const ConnectedAccount = require('../models/ConnectedAccount');
const { google } = require('googleapis');

exports.getStats = async (req, res) => {
  try {
    const connectedAccounts = await ConnectedAccount.find({ userId: req.user._id }).select('platform accessToken');
    const hasConnectedAccount = connectedAccounts.length > 0;
    const youtubeAccount = connectedAccounts.find((account) => account.platform === 'youtube' && account.accessToken);

    let subscriberCount = 0;

    try {
      if (youtubeAccount) {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: youtubeAccount.accessToken });

        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
        const response = await youtube.channels.list({
          part: 'statistics',
          mine: true
        });

        if (response.data.items && response.data.items.length > 0) {
          subscriberCount = parseInt(response.data.items[0].statistics.subscriberCount, 10) || 0;
        }
      }
    } catch (e) {
      console.error('Error fetching youtube stats:', e.message);
    }

    const stats = {
      isConnected: hasConnectedAccount,
      followers: { total: subscriberCount, growthPercent: 0 },
      smartInsight: {
        text: hasConnectedAccount
          ? 'No insight available yet.'
          : 'Connect an account to see insights.',
        confidence: 0
      },
      audienceBreakdown: [],
      activityDensity: Array.from({ length: 28 }).map(() => 0),
      anomaly: {
        title: hasConnectedAccount ? 'No anomalies detected' : 'No data yet',
        description: hasConnectedAccount
          ? 'We have not detected any unusual changes yet.'
          : 'Connect an account to start tracking anomalies.'
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.applyInsight = async (req, res) => {
  try {
    const { insightId } = req.body;
    res.json({ message: 'Insight applied!', insightId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
