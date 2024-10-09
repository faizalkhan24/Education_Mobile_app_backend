const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledDate: { type: Date, required: true },
  duration: { type: Number, required: true },  // Duration of the live session in minutes
  joinLink: { type: String, required: true },  // Link to join the session (e.g., Zoom, WebRTC)
  createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
