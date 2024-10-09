const mongoose = require('mongoose');

const PasswordHistorySchema = new mongoose.Schema({
  email: { type: String, required: true },
  previousPassword: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PasswordHistory', PasswordHistorySchema);
