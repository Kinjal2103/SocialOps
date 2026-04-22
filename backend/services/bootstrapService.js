const User = require('../models/User');
const DashboardStats = require('../models/DashboardStats');
const AnalyticsData = require('../models/AnalyticsData');

const emptyPlatformStats = () => ({
  instagram: { posts: 0, reach: 0, engagement: 0 },
  twitter: { posts: 0, reach: 0, engagement: 0 },
  linkedin: { posts: 0, reach: 0, engagement: 0 }
});

const bootstrapNewUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('Bootstrap failed: User not found');
      return;
    }

    const now = new Date();

    // New users should start with an empty workspace, not seeded demo activity.
    await Promise.all([
      DashboardStats.findOneAndUpdate(
        { userId },
        {
          $setOnInsert: {
            userId,
            totalFollowers: 0,
            followersGrowth: 0,
            totalPosts: 0,
            scheduledPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            engagementRate: 0,
            platformBreakdown: {},
            aiInsight: 'Welcome to SocialOps! Publish your first post to unlock insights.',
            aiInsightGeneratedAt: now,
            lastUpdated: now,
            audienceBreakdown: [],
            activityDensity: [],
            anomaly: null
          }
        },
        { upsert: true, new: true }
      ),
      AnalyticsData.findOneAndUpdate(
        { userId },
        {
          $setOnInsert: {
            userId,
            followerHistory: [],
            engagementHistory: [],
            platformStats: emptyPlatformStats(),
            topPosts: [],
            audienceRegions: [],
            weeklyKpis: { impressions: 0, clicks: 0, shares: 0, comments: 0 },
            createdAt: now
          }
        },
        { upsert: true, new: true }
      )
    ]);
  } catch (error) {
    console.error('Error during new user bootstrap:', error);
  }
};

module.exports = { bootstrapNewUser };
