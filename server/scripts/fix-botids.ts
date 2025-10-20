/**
 * Migration script to ensure all users have a botId
 * Run this once to fix existing users without botId
 */

import mongoose from 'mongoose';
import User from '../models/User.model.js';
import { connectDB } from '../config/database.js';

const generateBotId = (): string => {
  return 'bot_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

async function fixBotIds() {
  try {
    await connectDB();
    console.log('🔍 Checking for users without botId...');

    // Find users without botId
    const usersWithoutBotId = await User.find({
      $or: [
        { botId: { $exists: false } },
        { botId: null },
        { botId: '' }
      ]
    });

    console.log(`📊 Found ${usersWithoutBotId.length} users without botId`);

    if (usersWithoutBotId.length === 0) {
      console.log('✅ All users have botId!');
      process.exit(0);
    }

    // Fix each user
    for (const user of usersWithoutBotId) {
      const newBotId = generateBotId();
      user.botId = newBotId;
      await user.save();
      console.log(`✅ Fixed user ${user.email}: ${newBotId}`);
    }

    console.log('🎉 All users fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixBotIds();
