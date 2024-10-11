const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  subCategory: { 
    type: String 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  videos: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video' 
  }],
  isActive: { 
    type: Boolean, 
    default: false 
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  thumbnail: { 
    type: String 
  },
  duration: { 
    type: Number 
  },
  tags: [{ 
    type: String 
  }]
});

module.exports = mongoose.model('Course', CourseSchema);
