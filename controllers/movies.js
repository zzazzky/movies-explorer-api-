const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const ConflictError = require('../utils/ConflictError');
const ForbiddenError = require('../utils/ForbiddenError');

const getMovies = (req, res, next) => {
  const { user } = req;
  Movie.find({ owner: user })
    .populate('owner')
    .orFail(new NotFoundError('Кажется, у вас нет добавленных фильмов'))
    .then((movies) => { res.send({ movies }); })
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.findOne({ ...req.body, owner: req.user._id })
    .then((film) => {
      if (film) {
        return Promise.reject(new ConflictError('Этот фильм уже есть в вашей коллекции'));
      }
      return Movie.create({ ...req.body, owner: req.user._id })
        .then((createdMovie) => {
          Movie.findById(createdMovie._id)
            .populate('owner')
            .then((movie) => {
              res.send({ movie });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .populate('owner')
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner._id.toString() !== req.user._id.toString()) {
        return Promise.reject(new ForbiddenError('Вы не можете удалять фильмы других пользователей'));
      }
      return movie;
    })
    .then((movie) => {
      Movie.findByIdAndRemove(movie._id)
        .then(() => { res.send({ message: 'Фильм удален из закладок' }); })
        .catch(next);
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
