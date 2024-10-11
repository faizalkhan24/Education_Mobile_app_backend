const Course = require('../Models/Course');
const Enrollment = require('../Models/Enrollment'); 

const createCourse = async (req, res) => {
    const { title, description, category, subCategory, price, duration, tags, thumbnail } = req.body;
  
    if (!title || !description || !category || !price || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const userRole = req.user.role; 
  
    if (userRole !== 'superadmin' && userRole !== 'teacher') {
      return res.status(403).json({ message: 'Access denied. Only Admins and Teachers can create a course.' });
    }
  
    const newCourse = new Course({
      title,
      description,
      category,
      subCategory,
      teacherId: req.user.id,
      price,
      duration,
      tags,
      thumbnail,
    });
  
    try {
      const savedCourse = await newCourse.save();
      res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    } catch (error) {
      res.status(500).json({ message: 'Error creating course', error: error.message });
    }
  };
  

  const updateCourse = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    const userRole = req.user.role; 
    if (userRole !== 'Admin' && userRole !== 'Teacher') {
      return res.status(403).json({ message: 'Access denied. Only Admins and Teachers can update a course.' });
    }
  
    try {
      const course = await Course.findByIdAndUpdate(id, updates, { new: true });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
      res.status(500).json({ message: 'Error updating course', error: error.message });
    }
  };
  

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  const userRole = req.user.role; 
  if (userRole !== 'Admin' && userRole !== 'Teacher') {
    return res.status(403).json({ message: 'Access denied. Only Admins and Teachers can delete a course.' });
  }

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving courses', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving course', error: error.message });
  }
};

const getTeachersCourses = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const courses = await Course.find({ teacherId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teacher courses', error: error.message });
  }
};

const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.id;
  
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }
  
      const newEnrollment = new Enrollment({
        studentId,
        courseId,
      });
  
      await newEnrollment.save();
  
      res.status(201).json({ message: 'Successfully enrolled in course', enrollment: newEnrollment });
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
  };

const suspendCourse = async (req, res) => {
  const { id } = req.params;

  const userRole = req.user.role; 
  if (userRole !== 'Admin' && userRole !== 'Teacher') {
    return res.status(403).json({ message: 'Access denied. Only Admins and Teachers can suspend a course.' });
  }

  try {
    const course = await Course.findByIdAndUpdate(id, { isSuspended: true }, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course suspended successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Error suspending course', error: error.message });
  }
};



module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getTeachersCourses,
  enrollInCourse,
  suspendCourse,
};
