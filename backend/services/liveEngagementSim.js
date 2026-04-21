const Post = require('../models/Post');
const DashboardStats = require('../models/DashboardStats');

let timer = null;

const startLiveEngagementEngine = (io) => {
  if (timer) return;

  console.log('🚀 Starting Background Live Engagement Simulator...');
  
  // Tick every 15 seconds
  timer = setInterval(async () => {
    try {
      // Find a random published post
      const postsCount = await Post.countDocuments({ status: 'published' });
      if (postsCount === 0) return;

      const randomSkip = Math.floor(Math.random() * postsCount);
      const post = await Post.findOne({ status: 'published' }).skip(randomSkip);

      if (!post) return;

      // Random engagement bump
      const likesAdded = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const isComment = Math.random() > 0.8;
      
      post.likes = (post.likes || 0) + likesAdded;
      if (isComment) {
        post.comments = (post.comments || 0) + 1;
      }
      post.updatedAt = new Date();
      await post.save();

      // Emit specific engagement update for dashboards
      io.to(post.userId.toString()).emit('engagement:live', {
        postId: post._id.toString(),
        likes: post.likes,
        comments: post.comments
      });

      // Emit top right notification optionally
      if (Math.random() > 0.5) {
        const platformLabel = post.platform ? post.platform.charAt(0).toUpperCase() + post.platform.slice(1) : 'post';
        io.to(post.userId.toString()).emit('notification:new', {
          id: Math.random().toString(36).substring(7),
          title: 'New Engagement! 🔥',
          message: `Your ${platformLabel} post "${post.title || 'untitled'}" just got ${likesAdded} new likes!`
        });
      }

      // Slightly increase follower count for the user on DashboardStats randomly
      if (Math.random() > 0.7) {
        const stats = await DashboardStats.findOne({ userId: post.userId });
        if (stats) {
          const currentFollowers = stats.totalFollowers ?? stats.followers?.total ?? 0;
          stats.totalFollowers = currentFollowers + 1;
          await stats.save();
          // We can optionally push a stats update socket event, but the Dashboard refreshes manually or on initial load.
        }
      }

    } catch (err) {
      console.error('Live Engagement Simulator Error:', err);
    }
  }, 15000);
};

module.exports = { startLiveEngagementEngine };
