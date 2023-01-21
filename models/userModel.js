/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    select: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  registredAt: Date,
  lastSeenAt: Date,
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.registredAt = Date.now();
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
