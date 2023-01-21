const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: 'success',
    data: {
      users,
    },
  });
});

exports.bulkDelete = catchAsync(async (req, res, next) => {
  const users = req.body.users;
  const result = await User.deleteMany({ _id: { $in: users } });
  if (result.acknowledged) {
    return res.status(204).send('success');
  }
  res.status(400);
});

exports.bulkChangeUserStatus = catchAsync(async (req, res, next) => {
  try {
    const users = req.body.users;
    const isBlock = req.body.isBlock;
    const result = await User.updateMany(
      { _id: { $in: users } },
      { isBlocked: isBlock }
    );
    if (result.acknowledged) {
      return res.sendStatus(200);
    }
    res.sendStatus(400);
  } catch (e) {
    console.log(e);
  }
});
