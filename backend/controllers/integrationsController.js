const ConnectedAccount = require('../models/ConnectedAccount');

const ALL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'twitter',   label: 'Twitter / X', color: '#1DA1F2' },
  { id: 'linkedin',  label: 'LinkedIn', color: '#0A66C2' },
  { id: 'tiktok',    label: 'TikTok', color: '#010101' },
  { id: 'youtube',   label: 'YouTube', color: '#FF0000' },
];

exports.getIntegrations = async (req, res) => {
  try {
    const accounts = await ConnectedAccount.find({ userId: req.user._id });

    const integrations = ALL_PLATFORMS.map(p => {
      const acc = accounts.find(a => a.platform === p.id);
      if (acc && acc.connected) {
        return {
          platform: p.id,
          label: p.label,
          color: p.color,
          connected: true,
          username: acc.username,
          followers: acc.followers || 0,
          connectedAt: acc.connectedAt
        };
      }
      return {
        platform: p.id,
        label: p.label,
        color: p.color,
        connected: false,
        username: "",
        followers: 0,
        connectedAt: null
      };
    });

    res.json({ integrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.connectIntegration = async (req, res) => {
  try {
    const { platform, username } = req.body;
    
    if (!ALL_PLATFORMS.find(p => p.id === platform)) {
      return res.status(400).json({ success: false, message: 'Invalid platform' });
    }

    let acc = await ConnectedAccount.findOne({ userId: req.user._id, platform });
    if (acc) {
      acc.connected = true;
      acc.username = username;
      acc.connectedAt = new Date();
      await acc.save();
    } else {
      acc = await ConnectedAccount.create({
        userId: req.user._id,
        platform,
        username,
        connected: true,
        connectedAt: new Date()
      });
    }

    res.json({ success: true, integration: { platform, username, connected: true } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.disconnectIntegration = async (req, res) => {
  try {
    const { platform } = req.body;
    let acc = await ConnectedAccount.findOne({ userId: req.user._id, platform });
    if (acc) {
      acc.connected = false;
      acc.username = '';
      acc.accessToken = null;
      acc.refreshToken = null;
      await acc.save();
    }
    res.json({ success: true, platform });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getIntegrationStats = async (req, res) => {
  try {
    const { platform } = req.params;
    let acc = await ConnectedAccount.findOne({ userId: req.user._id, platform });
    
    if (!acc || !acc.connected) {
      return res.json({ connected: false });
    }

    let stats = {};
    if (platform === 'instagram') stats = { posts: 48, avgLikes: 2840, avgComments: 124, bestTime: '6:00 PM' };
    else if (platform === 'linkedin') stats = { posts: 12, avgLikes: 890, avgComments: 34, bestTime: '9:00 AM' };
    else if (platform === 'tiktok') stats = { posts: 31, avgLikes: 8400, avgComments: 342, bestTime: '8:00 PM' };
    else if (platform === 'twitter') stats = { posts: 0, avgLikes: 0, avgComments: 0, bestTime: 'N/A' };
    else if (platform === 'youtube') stats = { posts: 0, avgLikes: 0, avgComments: 0, bestTime: 'N/A' };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
