const express = require('express');
const errorController = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());

app.use(cors());

app.use(express.json({ limit: '10kb' }));

app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

module.exports = app;
