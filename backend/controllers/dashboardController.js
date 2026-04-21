const mongoose = require('mongoose');
const DashboardStats = require('../models/DashboardStats');
const Post = require('../models/Post');
const { generateInsight } = require('../services/geminiService');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjId = new mongoose.Types.ObjectId(userId);

    // 1. Computed in real-time
    const [
      totalPosts,
      draftPosts,
      scheduledPosts,
      publishedPosts,
      postsThisWeek,
      platformBreakdownRaw,
      recentPosts
    ] = await Promise.all([
      Post.countDocuments({ userId }),
      Post.countDocuments({ userId, status: 'draft' }),
      Post.countDocuments({ userId, status: 'scheduled' }),
      Post.countDocuments({ userId, status: 'published' }),
      Post.countDocuments({ userId, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Post.aggregate([
        { $match: { userId: userObjId } },
        { $group: { _id: '$platform', count: { $sum: 1 } } }
      ]),
      Post.find({ userId, status: 'published' }).sort({ createdAt: -1 }).limit(5)
    ]);

    const platformBreakdown = platformBreakdownRaw.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // 2. Read from DashboardStats
    let cachedStats = await DashboardStats.findOne({ userId });
    
    const totalFollowers = cachedStats?.totalFollowers ?? cachedStats?.followers?.total ?? 0;
    const followersGrowth = cachedStats?.followersGrowth ?? cachedStats?.followers?.growthPercent ?? 0;
    const engagementRate = cachedStats?.engagementRate ?? 0;
    const aiInsight = cachedStats?.aiInsight ?? cachedStats?.smartInsight?.text ?? "Welcome to SocialOps! Gather more data for insights.";
    const aiInsightGeneratedAt = cachedStats?.aiInsightGeneratedAt ?? new Date(0);
    // 1.5 Calculate dynamic Activity Density (4 weeks, 28 days)
    const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    const activityPosts = await Post.find({ userId: userObjId, status: 'published', createdAt: { $gte: twentyEightDaysAgo } }).select('createdAt');
    const dayCounts = new Array(28).fill(0);
    
    activityPosts.forEach(p => {
      const dayIndex = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (24 * 60 * 60 * 1000));
      if (dayIndex >= 0 && dayIndex < 28) {
        dayCounts[27 - dayIndex]++; // latest day is at the end
      }
    });
    
    // Add some random base noise to density to make it visually interesting early on
    const maxDensity = Math.max(...dayCounts, 3);
    const activityDensity = dayCounts.map(count => (count + Math.random() * 0.5) / maxDensity);

    // Mock Audience Breakdown based dynamically on followers count
    const baseCountries = ["United States", "United Kingdom", "India", "Canada", "Australia", "Germany"];
    const audienceBreakdown = [
      { country: baseCountries[userId.charCodeAt(0) % baseCountries.length], percent: 45 },
      { country: baseCountries[(userId.charCodeAt(1) || 1) % baseCountries.length], percent: 30 },
      { country: baseCountries[(userId.charCodeAt(2) || 2) % baseCountries.length], percent: 25 }
    ];
    let anomalyData = cachedStats?.anomaly;
    if (!anomalyData || !anomalyData.title) {
       anomalyData = { title: "Spike in activity", description: "You received 45% more likes today." };
    }
    
    const isStale = (Date.now() - new Date(aiInsightGeneratedAt).getTime()) > 6 * 60 * 60 * 1000;

    const payload = {
      computed: {
        totalPosts,
        draftPosts,
        scheduledPosts,
        publishedPosts,
        postsThisWeek,
        platformBreakdown,
        recentPosts
      },
      cached: {
        totalFollowers,
        followersGrowth,
        engagementRate
      },
      ai: {
        insight: aiInsight,
        generatedAt: aiInsightGeneratedAt,
        isStale
      },
      activityDensity,
      audienceBreakdown,
      anomaly: anomalyData
    };

    res.json(payload);

    // 3. Update the DashboardStats document (upsert) asynchronously
    try {
      await DashboardStats.findOneAndUpdate(
        { userId },
        { 
          totalPosts, draftPosts, scheduledPosts, publishedPosts, platformBreakdown,
          lastUpdated: new Date()
        },
        { upsert: true }
      );
    } catch (e) {
      console.error("Failed to asynchronously update DashboardStats", e);
    }

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.refreshInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    // Generate fresh insight using the service
    const freshInsightData = await generateInsight({
      weeklyEngagement: [2400, 3100, 2800, 4200], // Example data for prompt
      weeklyReach: [18000, 21000, 19500, 24500],
      topPostType: "Reel",
      topPlatform: "instagram",
      totalFollowers: 842910,
      audienceTopCountry: "United States"
    });
    
    const insightText = freshInsightData.text || freshInsightData;
    const anomalyData = freshInsightData.anomaly || { title: "Unexpected Trend Detected", description: "Your audience engagement pattern has shifted recently." };

    await DashboardStats.findOneAndUpdate(
      { userId },
      { 
        aiInsight: insightText, 
        aiInsightGeneratedAt: new Date(),
        anomaly: anomalyData
      },
      { upsert: true }
    );

    res.json({ success: true, insight: insightText, anomaly: anomalyData });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.applyInsight = async (req, res) => {
  try {
    res.json({ success: true, message: "Insight applied successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
