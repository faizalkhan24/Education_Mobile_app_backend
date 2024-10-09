const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },  // URL of the video
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  duration: { type: Number, required: true },  // Duration of video in minutes
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
