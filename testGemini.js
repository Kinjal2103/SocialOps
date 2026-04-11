import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

import { generateInsight } from './backend/services/geminiService.js';

const test = async () => {
  console.log("Current API Key in process:", process.env.GEMINI_API_KEY);
  const result = await generateInsight({
    weeklyEngagement: [2400, 3100, 2800, 4200],
    weeklyReach: [18000, 21000, 19500, 24500],
    topPostType: "Reel",
    topPlatform: "instagram",
    totalFollowers: 842910,
    audienceTopCountry: "United States"
  });

  console.log("Result:", result);
};

test();