exports.getStats = async (req, res) => {
  try {
    // Generate seeded data representing user's dashboard
    const stats = {
      followers: { total: 842910, growthPercent: 12.4 },
      smartInsight: { text: "Your engagement spikes at 6 PM — schedule more posts here.", confidence: 98 },
      audienceBreakdown: [
        { country: "United States", percent: 42 },
        { country: "United Kingdom", percent: 18 },
        { country: "Germany", percent: 12 }
      ],
      activityDensity: Array.from({ length: 28 }).map((_, i) => [0, 4, 8, 12, 16, 20, 24].includes(i) ? 0.9 : [1, 5, 9, 13, 17, 21, 25].includes(i) ? 0.6 : [2, 6, 10, 14, 18, 22, 26].includes(i) ? 0.3 : 0.1),
      anomaly: { title: "Unusual growth spike in Southeast Asia", description: "Likely viral redistribution of your last post." }
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
