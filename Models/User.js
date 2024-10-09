const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['superadmin', 'teacher', 'student'],
    required: true,
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to the teacher
});

module.exports = mongoose.model('User', UserSchema);
