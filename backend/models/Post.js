const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  caption: { type: String },
  type: { type: String, enum: ['Post', 'Reel', 'Story'], required: true },
  platforms: [{ type: String }],
  imageUrl: { type: String },
  status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft' },
  scheduledAt: { type: Date },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
