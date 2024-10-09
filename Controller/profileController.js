const User = require('../Models/User');

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
  getUserProfile,
  updateUserProfile,
};
