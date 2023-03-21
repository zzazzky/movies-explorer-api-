const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const NotFoundError = require('../utils/NotFoundError');

const validEmail = /[a-z0-9_\-.]+@[a-z0-9_\-.]+\.[a-z]{2,}/;

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(validEmail).required(),
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(validEmail).required(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);
router.use('/movies', moviesRouter);
router.get('/signout', logout);
router.use('/users', usersRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
