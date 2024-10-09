const express = require('express');
const {
  createUser,
  loginUser,
  getUsers,
  deleteUser,
  resetPassword,
  updateUserRole,
  getUserById
} = require('../Controller/userController');
const { getUserProfile, updateUserProfile } = require('../Controller/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User registration
router.post('/signup', createUser); 

// User login
router.post('/login', loginUser);

// Get user profile (authenticated)
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile (authenticated)
router.put('/profile/:id', authMiddleware, updateUserProfile);

// Get users based on role (authenticated)
router.get('/users', authMiddleware, getUsers); 

// Delete a user by ID (authenticated)
router.delete('/users/:id', authMiddleware, deleteUser); 

// Reset password by email
router.put('/resetpassword', resetPassword);

// Update user role (only for super admin)
router.put('/:id/role', authMiddleware, updateUserRole); 

router.get('/:id', authMiddleware, getUserById); 

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
