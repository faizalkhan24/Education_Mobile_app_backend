const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  isActive: { type: Boolean, default: false },  // Courses need to be approved by admin
  createdDate: { type: Date, default: Date.now },
  price: { type: Number, default: 0 },
  thumbnail: { type: String },  // Thumbnail image URL
  duration: { type: Number },  // Total duration of the course in minutes
  tags: [{ type: String }]
});

module.exports = mongoose.model('Course', CourseSchema);
