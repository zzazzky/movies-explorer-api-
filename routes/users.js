const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getCurrentUser, updateUserInfo } = require('../controllers/users');

const validEmail = /[a-z0-9_\-.]+@[a-z0-9_\-.]+\.[a-z]{2,}/;

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(validEmail).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

module.exports = router;
