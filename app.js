const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

require('dotenv').config();

const router = require('./routes');
const limiter = require('./middlewares/ratelimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const { errorHandler } = require('./utils/errorhandler');

const { PORT = 3000, DATA_BASE, NODE_ENV } = process.env;

const app = express();

mongoose.set('strictQuery', true);
mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
