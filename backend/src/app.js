
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');
const app = express();


app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: 'http://127.0.0.1:3000',
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept','Cookie'],
  credentials: true,
  preflightContinue:false
}));



app.use('/api/user', userRoutes);
app.use('/posts', postRoutes);

module.exports = app;
