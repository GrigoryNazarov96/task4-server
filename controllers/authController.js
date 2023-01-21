const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    lastSeenAt: Date.now(),
  });
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  user.lastSeenAt = Date.now();
  await user.save();
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  if (user.isBlocked) {
    return next(new AppError('You are blocked', 401));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
