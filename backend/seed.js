const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const DashboardStats = require('./models/DashboardStats');
const AnalyticsData = require('./models/AnalyticsData');
const ConnectedAccount = require('./models/ConnectedAccount');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/socialops')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const generateDensity = (pattern) => {
  const density = new Array(28).fill(0);
  if (pattern === 'user1') {
    // High Mon/Wed/Fri, medium weekday mornings
    return density.map((_, i) => (i % 7 === 1 || i % 7 === 3 || i % 7 === 5) ? 0.8 : (i % 2 === 0 ? 0.4 : 0.1));
  }
  if (pattern === 'user2') {
    // High evenings, peak Sat/Sun
    return density.map((_, i) => (i % 7 === 6 || i % 7 === 0) ? 0.9 : 0.6);
  }
  if (pattern === 'user3') {
    // High Tue/Wed mornings only
    return density.map((_, i) => (i === 1 || i === 2) ? 0.8 : 0);
  }
  if (pattern === 'user4') {
    // Only 3 dots active
    density[10] = 0.9; density[14] = 0.8; density[20] = 0.7;
    return density;
  }
  if (pattern === 'user5') {
    // All 28 dots high
    return density.map(() => 0.8 + Math.random() * 0.1);
  }
  return density;
};

const createPosts = async (userId, published, scheduled, drafts, platforms) => {
  const posts = [];
  
  for (const title of published) {
    posts.push({
      userId,
      title,
      type: 'Post',
      platforms,
      status: 'published',
      likes: Math.floor(Math.random() * 10000),
      comments: Math.floor(Math.random() * 1000)
    });
  }

  for (const title of scheduled) {
    posts.push({
      userId,
      title,
      type: 'Post',
      platforms,
      status: 'scheduled',
      scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }

  for (const title of drafts) {
    posts.push({
      userId,
      title,
      type: 'Post',
      platforms,
      status: 'draft'
    });
  }

  await Post.insertMany(posts);
};

const seedUser = async (userData) => {
  // 1. Create User
  const user = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password
  });
  await user.save(); // triggers pre-save hash

  // 2. Create Posts
  await createPosts(user._id, userData.posts.published, userData.posts.scheduled, userData.posts.drafts, userData.posts.platforms);

  // 3. Create Dashboard Stats
  await DashboardStats.create({
    userId: user._id,
    followers: userData.dashboard.followers,
    smartInsight: userData.dashboard.smartInsight,
    audienceBreakdown: userData.dashboard.audienceBreakdown,
    activityDensity: generateDensity(userData.dashboard.densityPattern),
    anomaly: userData.dashboard.anomaly
  });

  // 4. Create Analytics
  await AnalyticsData.create({
    userId: user._id,
    kpis: userData.analytics.kpis,
    growthChart: userData.analytics.growthChart,
    networkDistribution: userData.analytics.networkDistribution,
    audienceDNA: userData.analytics.audienceDNA
  });

  // 5. Create Connected Accounts
  for (const acc of userData.connectedAccounts) {
    if (acc.connected) {
      await ConnectedAccount.create({
        userId: user._id,
        platform: acc.platform,
        username: acc.username,
        followers: acc.followers,
        connected: true,
        connectedAt: new Date()
      });
    }
  }

  console.log(`✅ Seeded: ${userData.name} (${userData.email})`);
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    await DashboardStats.deleteMany({});
    await AnalyticsData.deleteMany({});
    await ConnectedAccount.deleteMany({});
    console.log('🗑️  Cleared all collections');

    const usersData = [
      {
        name: "Arjun Mehta",
        email: "test@socialops.com",
        password: "test1234",
        posts: {
          platforms: ["instagram", "linkedin", "twitter"],
          published: [
            "I built a SaaS in 30 days from Mumbai — here's what happened",
            "Top 5 Indian startup tools nobody talks about",
            "Why Indian developers should learn system design NOW",
            "Behind the scenes at a Mumbai tech meetup"
          ],
          scheduled: [
            "My honest review of IIT Bombay's coding bootcamp",
            "How to get a remote job from India in 2024",
            "The Bangalore vs Mumbai startup debate — my take",
            "Building in public: Week 12 update"
          ],
          drafts: [
            "Why I left my TCS job to build a startup",
            "Indian SaaS founders you need to follow",
            "The truth about Indian tech Twitter",
            "How I grew 10K followers posting only in Hindi"
          ]
        },
        dashboard: {
          followers: { total: 284000, growthPercent: 14.2 },
          smartInsight: { text: "Your tech tutorials get 4x more saves between 9–11 PM IST — post then.", confidence: 96 },
          audienceBreakdown: [
            { country: "India", percent: 68 },
            { country: "United States", percent: 14 },
            { country: "United Kingdom", percent: 8 }
          ],
          densityPattern: 'user1',
          anomaly: { title: "Viral post detected — 'Built a SaaS in 30 days'", description: "Shared 4,200 times in 48 hours across Indian tech communities." }
        },
        analytics: {
          kpis: { followers: "284K", followersChange: "+14%", impressions: "8.4M", impressionsChange: "+38%", engagementRate: "7.2%", engagementChange: "+4%", postFrequency: "14.0", frequencyChange: "+6%" },
          growthChart: { engagement: [8400, 11200, 9800, 16400], reach: [420000, 580000, 520000, 840000], conversions: [840, 1120, 980, 1640] },
          networkDistribution: [{ platform: "Instagram", percent: 48 }, { platform: "LinkedIn", percent: 32 }, { platform: "Twitter", percent: 20 }],
          audienceDNA: { primaryAge: "22-28", regions: [{ label: "India", percent: 68 }, { label: "United States", percent: 14 }, { label: "United Kingdom", percent: 8 }, { label: "UAE", percent: 6 }] }
        },
        connectedAccounts: [
          { platform: "instagram", connected: true, username: "@arjunmehta.tech", followers: 142000 },
          { platform: "linkedin", connected: true, username: "Arjun Mehta", followers: 84000 },
          { platform: "twitter", connected: true, username: "@arjunmehta_", followers: 58000 }
        ]
      },
      {
        name: "Priya Sharma",
        email: "priya@socialops.com",
        password: "test1234",
        posts: {
          platforms: ["instagram"],
          published: [
            "Sarojini Nagar haul under ₹500 — everything I bought",
            "Delhi's best hidden cafes in 2024 — full guide",
            "My bridal skincare routine 90 days before the wedding"
          ],
          scheduled: [
            "Diwali outfit ideas under ₹2000",
            "Khan Market vs Lajpat Nagar — where to shop?",
            "Honest review: Indian skincare brands vs international"
          ],
          drafts: [
            "My morning routine as a Delhi content creator",
            "Best Instagram spots in Lodhi Garden",
            "Indian wedding guest outfit guide by budget",
            "How I work with Indian fashion brands"
          ]
        },
        dashboard: {
          followers: { total: 892000, growthPercent: 22.4 },
          smartInsight: { text: "Reels posted between 7–9 PM IST get 5x more reach — perfect for your Delhi audience.", confidence: 95 },
          audienceBreakdown: [
            { country: "India", percent: 82 },
            { country: "UAE", percent: 8 },
            { country: "United Kingdom", percent: 5 }
          ],
          densityPattern: 'user2',
          anomaly: { title: "Diwali content surge incoming", description: "Festive content gets 8x normal reach in October — schedule now." }
        },
        analytics: {
          kpis: { followers: "892K", followersChange: "+22%", impressions: "42M", impressionsChange: "+58%", engagementRate: "8.4%", engagementChange: "+6%", postFrequency: "10.0", frequencyChange: "+4%" },
          growthChart: { engagement: [28000, 34000, 31000, 48000], reach: [1800000, 2200000, 1900000, 3200000], conversions: [1200, 1480, 1320, 2100] },
          networkDistribution: [{ platform: "Instagram", percent: 78 }, { platform: "TikTok", percent: 14 }, { platform: "LinkedIn", percent: 8 }],
          audienceDNA: { primaryAge: "18-28", regions: [{ label: "India", percent: 82 }, { label: "UAE", percent: 8 }, { label: "United Kingdom", percent: 5 }, { label: "United States", percent: 4 }] }
        },
        connectedAccounts: [
          { platform: "instagram", connected: true, username: "@priyasharma.delhi", followers: 784000 },
          { platform: "tiktok", connected: true, username: "@priyasharma", followers: 108000 }
        ]
      },
      {
        name: "Rahul Verma",
        email: "rahul@socialops.com",
        password: "test1234",
        posts: {
          platforms: ["linkedin", "twitter"],
          published: [
            "We just raised ₹2 crore pre-seed — here's what I learned",
            "Why 90% of Bangalore startups fail in year 2",
            "The hiring mistake every Indian founder makes",
            "How we got our first 100 B2B customers with zero marketing budget",
            "Indian VC landscape in 2024 — my honest take"
          ],
          scheduled: [
            "Building a remote-first team across India — lessons learned",
            "Why I moved our startup from Bangalore to a smaller city",
            "The problem with Indian startup culture nobody talks about",
            "Our SaaS just hit ₹10L MRR — breakdown of how we got here"
          ],
          drafts: [
            "Open letter to Indian VCs",
            "Why we almost shut down in month 6",
            "The Bangalore startup ecosystem — honest review"
          ]
        },
        dashboard: {
          followers: { total: 48400, growthPercent: -2.4 },
          smartInsight: { text: "Engagement dropped 24% — your audience responds better to personal stories than startup advice.", confidence: 93 },
          audienceBreakdown: [
            { country: "India", percent: 74 },
            { country: "Singapore", percent: 12 },
            { country: "United States", percent: 10 }
          ],
          densityPattern: 'user3',
          anomaly: { title: "LinkedIn reach dropped 28% this month", description: "Algorithm is deprioritizing text-only posts — add images or carousels." }
        },
        analytics: {
          kpis: { followers: "48.4K", followersChange: "-2%", impressions: "1.2M", impressionsChange: "-24%", engagementRate: "3.8%", engagementChange: "-8%", postFrequency: "8.4", frequencyChange: "-2%" },
          growthChart: { engagement: [4800, 4200, 3600, 2900], reach: [180000, 158000, 142000, 108000], conversions: [240, 210, 184, 148] },
          networkDistribution: [{ platform: "LinkedIn", percent: 72 }, { platform: "Twitter", percent: 28 }],
          audienceDNA: { primaryAge: "28-38", regions: [{ label: "India", percent: 74 }, { label: "Singapore", percent: 12 }, { label: "United States", percent: 10 }, { label: "UAE", percent: 4 }] }
        },
        connectedAccounts: [
          { platform: "linkedin", connected: true, username: "Rahul Verma", followers: 38400 },
          { platform: "twitter", connected: true, username: "@rahulverma_", followers: 10000 }
        ]
      },
      {
        name: "Ananya Krishnan",
        email: "ananya@socialops.com",
        password: "test1234",
        posts: {
          platforms: ["instagram"],
          published: [
            "Authentic Chennai filter coffee recipe — the right way"
          ],
          scheduled: [
            "Pondy Bazaar street food guide — best eats under ₹100"
          ],
          drafts: [
            "My first month as a Tamil content creator — honest review"
          ]
        },
        dashboard: {
          followers: { total: 1240, growthPercent: 42.0 },
          smartInsight: { text: "Post Tamil-language captions — your audience engages 6x more with regional content.", confidence: 91 },
          audienceBreakdown: [
            { country: "India", percent: 88 },
            { country: "Sri Lanka", percent: 6 },
            { country: "Singapore", percent: 4 }
          ],
          densityPattern: 'user4',
          anomaly: { title: "Strong regional growth signal", description: "Tamil food content gets 3x average reach in South India." }
        },
        analytics: {
          kpis: { followers: "1,240", followersChange: "+42%", impressions: "18.4K", impressionsChange: "+184%", engagementRate: "14.2%", engagementChange: "+14%", postFrequency: "0.8", frequencyChange: "+0%" },
          growthChart: { engagement: [0, 48, 184, 480], reach: [0, 840, 4200, 12400], conversions: [0, 4, 18, 48] },
          networkDistribution: [{ platform: "Instagram", percent: 100 }],
          audienceDNA: { primaryAge: "18-30", regions: [{ label: "India", percent: 88 }, { label: "Sri Lanka", percent: 6 }, { label: "Singapore", percent: 4 }, { label: "Malaysia", percent: 2 }] }
        },
        connectedAccounts: [
          { platform: "instagram", connected: true, username: "@ananya.eats.chennai", followers: 1240 }
        ]
      },
      {
        name: "Vikram Singh",
        email: "vikram@socialops.com",
        password: "test1234",
        posts: {
          platforms: ["instagram", "tiktok", "twitter", "linkedin"],
          published: [
            "Jaipur's hidden havelis nobody shows you on Instagram",
            "48 hours in Udaipur — complete travel guide",
            "Why Rajasthan is India's most underrated travel destination",
            "I spent ₹50,000 travelling across Rajasthan — full breakdown",
            "Pushkar Mela 2024 — what nobody tells you",
            "The real cost of travel content creation in India"
          ],
          scheduled: [
            "Jodhpur Blue City guide — best time to visit",
            "Desert safari in Jaisalmer — honest review",
            "Top 10 heritage hotels in Rajasthan under ₹5000",
            "How I work with Indian tourism boards",
            "Ranthambore tiger safari — everything you need to know"
          ],
          drafts: [
            "Why I quit my job to travel India full time",
            "India travel budget guide for 2024",
            "My camera gear for Indian travel content",
            "How to pitch Indian travel brands as a creator",
            "The dark side of Indian travel content creation"
          ]
        },
        dashboard: {
          followers: { total: 3840000, growthPercent: 16.8 },
          smartInsight: { text: "Heritage and culture Reels get 6x more shares from Indian audiences — double down on this.", confidence: 97 },
          audienceBreakdown: [
            { country: "India", percent: 72 },
            { country: "United Kingdom", percent: 10 },
            { country: "United States", percent: 8 }
          ],
          densityPattern: 'user5',
          anomaly: { title: "Jaisalmer Reel hit 2M views in 72 hours", description: "Fastest growing post in your account history — boost it now." }
        },
        analytics: {
          kpis: { followers: "3.84M", followersChange: "+17%", impressions: "224M", impressionsChange: "+52%", engagementRate: "5.8%", engagementChange: "+6%", postFrequency: "22.0", frequencyChange: "+10%" },
          growthChart: { engagement: [64000, 84000, 108000, 148000], reach: [3800000, 4800000, 6200000, 8800000], conversions: [1800, 2400, 3200, 4600] },
          networkDistribution: [{ platform: "Instagram", percent: 44 }, { platform: "TikTok", percent: 30 }, { platform: "YouTube", percent: 16 }, { platform: "Twitter", percent: 10 }],
          audienceDNA: { primaryAge: "22-35", regions: [{ label: "India", percent: 72 }, { label: "United Kingdom", percent: 10 }, { label: "United States", percent: 8 }, { label: "UAE", percent: 6 }] }
        },
        connectedAccounts: [
          { platform: "instagram", connected: true, username: "@vikramsingh.travels", followers: 2100000 },
          { platform: "tiktok", connected: true, username: "@vikram.travels", followers: 1200000 },
          { platform: "twitter", connected: true, username: "@vikramsingh_", followers: 284000 },
          { platform: "linkedin", connected: true, username: "Vikram Singh", followers: 256000 }
        ]
      }
    ];

    for (const userData of usersData) {
      await seedUser(userData);
    }

    console.log('🌱 Seeding complete! 5 Indian users ready.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
