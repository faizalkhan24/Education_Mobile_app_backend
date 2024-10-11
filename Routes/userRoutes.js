const express = require('express');
const {
  createUser,
  loginUser,
  getUsers,
  deleteUser,
  resetPassword,
  updateUserRole,
  getUserById,
  suspendUser,
  getUserProfile,
  updateUserProfile
} = require('../Controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', createUser); 

router.post('/login', loginUser);

router.get('/profile', authMiddleware, getUserProfile);

router.put('/profile/:id', authMiddleware, updateUserProfile);

router.get('/users', authMiddleware, getUsers); 

router.delete('/users/:id', authMiddleware, deleteUser); 

router.put('/resetpassword', resetPassword);

router.put('/:id/role', authMiddleware, updateUserRole); 

router.get('/:id', authMiddleware, getUserById); 

router.put('/admin/users/:id/suspend', authMiddleware, suspendUser);


router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
