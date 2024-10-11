const User = require('../Models/User');
const PasswordHistory = require('../Models/PreviousPassword');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });

  try {
    const result = await newUser.save();
    const token = jwt.sign({ id: result._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  const { password: _, ...userDetails } = user.toObject();

  res.status(200).json({ message: 'Login successful', token, user: userDetails });
};

const getUsers = async (req, res) => {
  try {
    const { role, id } = req.user; // Get the role and ID from the authenticated user

    if (role === 'superadmin') {
      const users = await User.find();
      return res.json(users);
    } else if (role === 'teacher') {
      const students = await User.find({ teacherId: id, role: 'student' });
      return res.json(students);
    } else if (role === 'student') {
      const teachers = await User.find({ role: 'teacher' });
      return res.json(teachers);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { role } = req.user; // Get the role from the authenticated user
    const { id } = req.params; // Get the user ID from the request parameters

    if (role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { role } = req.user; // Get the role from the authenticated user
    const { id } = req.params; // Get the user ID from the request parameters

    if (role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { role } = req.body; // Get the new role from the request body

  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    // Check if the user is a superadmin
    const { role: requesterRole } = req.user;
    if (requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the user by ID and update their role
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};


const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const previousPasswords = await PasswordHistory.find({ email });
    const isPasswordUsed = await Promise.all(previousPasswords.map(async (entry) => {
      return await bcrypt.compare(newPassword, entry.previousPassword);
    }));

    const isCurrentPassword = await bcrypt.compare(newPassword, user.password);

    if (isPasswordUsed.some(Boolean) || isCurrentPassword) {
      return res.status(400).json({ message: 'This is your old password or has been used before. Please enter a new password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const newPasswordHistory = new PasswordHistory({ email, previousPassword: hashedPassword });
    await newPasswordHistory.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

const suspendUser = async (req, res) => {
  const { role } = req.user; 
  const { id } = req.params; 

  if (role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied. Only superadmins can suspend user accounts.' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: 'User account suspended successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error suspending user account', error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL
    const { name, email, profilePicture, bio } = req.body;
    const userIdFromToken = req.user.id; // Extracted from the JWT token
  
    const isSuperAdmin = req.user.role === 'superadmin';
  
    const userToUpdate = await User.findById(id); 
  
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (!isSuperAdmin && userToUpdate._id.toString() !== userIdFromToken) {
      return res.status(403).json({ message: 'You are not authorized to update this profile' });
    }
  
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.profilePicture = profilePicture || userToUpdate.profilePicture;
    userToUpdate.bio = bio || userToUpdate.bio;
  
    userToUpdate.updatedBy = userIdFromToken;
  
    try {
      await userToUpdate.save();
      res.status(200).json({ message: 'Profile updated successfully', user: userToUpdate });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  resetPassword,
  suspendUser,
  getUserProfile,
  updateUserProfile
};
