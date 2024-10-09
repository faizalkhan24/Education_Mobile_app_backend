const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['enrolled', 'completed', 'in-progress'], default: 'enrolled' }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
