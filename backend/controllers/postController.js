const Post = require('../models/Post');

exports.getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id, status: 'published' })
      .sort({ createdAt: -1 })
      .limit(4);
    
    const mapped = posts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      date: p.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: p.likes,
      comments: p.comments,
      type: p.type ? p.type.toUpperCase() : 'POST',
      image: p.imageUrl
    }));
    
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
