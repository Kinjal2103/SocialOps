const ConnectedAccount = require('../models/ConnectedAccount');

exports.getConnectedAccounts = async (req, res) => {
  try {
    const accounts = await ConnectedAccount.find({ userId: req.user._id });
    res.json(accounts.map(acc => ({ platform: acc.platform, username: acc.username })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.connectAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    
    // Simulate connection flow mock
    const newAccount = await ConnectedAccount.findOneAndUpdate(
      { userId: req.user._id, platform },
      { 
        userId: req.user._id, 
        platform, 
        username: `@socialops_${platform}_user`,
        accessToken: 'mock_access_token',
        connectedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, account: { platform: newAccount.platform, username: newAccount.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.disconnectAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    await ConnectedAccount.findOneAndDelete({ userId: req.user._id, platform });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
