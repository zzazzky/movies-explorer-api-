const Movie = require('../models/movie');
const NotFoundError = require('../utils/NotFoundError');
const ConflictError = require('../utils/ConflictError');
const ForbiddenError = require('../utils/ForbiddenError');

const getMovies = (req, res, next) => {
  const { user } = req;
  Movie.find({ owner: user })
    .populate('owner')
    .orFail(new NotFoundError('Кажется, у вас нет добавленных фильмов'))
    .populate('owner')
    .then((movies) => { res.send({ movies }); })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { user } = req;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: user,
    movieId,
    nameRU,
    nameEN,
  })
    .then((createdMovie) => {
      Movie.findById(createdMovie._id)
        .populate('owner')
        .then((movie) => {
          res.send({ movie });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Этот фильм уже есть в вашей коллекции'));
      } else (next(err));
    });
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
