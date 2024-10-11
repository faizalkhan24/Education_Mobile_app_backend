const express = require('express');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getTeachersCourses,
  enrollInCourse,
  suspendCourse,
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);
router.get('/', authMiddleware, getAllCourses);
router.get('/:id', authMiddleware, getCourseById);
router.get('/teacher/courses', authMiddleware, getTeachersCourses);
router.post('/enroll', authMiddleware, enrollInCourse);
router.put('/suspend/:id', authMiddleware, suspendCourse);

module.exports = router;
