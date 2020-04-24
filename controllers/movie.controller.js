const Joi = require("@hapi/joi");
const Uid = require("../controllers/uid.controller");
const Movie = require("../models/movie.model");

function validateMovie(movie) {
  const schema = Joi.object({
    movieID: Joi.number().integer(),
    name: Joi.string().min(1).required(),
    director: Joi.string().min(3).required(),
    productionYear: Joi.number().integer(),
  });
  return schema.validate(movie);
}

const createMovie = async (req, res, next) => {
  try {
    const validation = validateMovie(req.body);
    if (validation.error) {
      const error = new Error(validation.error.details[0].message);
      // 400 Bad Request
      error.statusCode = 400;
      next(error);
    } else {
      let movie = {};
      movie.movieID = await Uid.genNextID("Movie");
      movie.name = req.body.name;
      movie.director = req.body.director;
      movie.productionYear = req.body.productionYear;
      const newmovie = new Movie(movie);
      await newmovie.save();
      res.status(201).json(newmovie);
    }
  } catch (err) {
    next(err);
  }
};

const findAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}, "-_id -__v");
    if (movies.length > 0) res.status(200).json(movies);
    else {
      const error = new Error("Movie List is empty");
      error.statusCode = 204;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const findOneMovie = async (req, res, next) => {
  try {
    let newmovie = {};
    newmovie.movieID = req.newmovie.movieID;
    foundmovie = await Movie.findOne(newmovie, "-_id -__v");
    if (foundmovie) res.status(200).json(foundmovie);
    else {
      const error = new Error("Movie ID not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const findMovieandUpdate = async (req, res, next) => {
  try {
    let newmovie = {};
    newmovie.movieID = req.newmovie.movieID;
    foundmovie = await Movie.findOneAndUpdate(newmovie, req.newmovie, {
      new: true,
    });
    if (foundmovie) res.status(200).json(foundmovie);
    else {
      const error = new Error("Movie ID not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    let newmovie = {};
    newmovie.movieID = req.newmovie.movieID;
    foundmovie = await Movie.findOneAndDelete(newmovie);
    if (foundmovie) res.status(200).json(foundmovie);
    else {
      const error = new Error("Movie ID not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMovie,
  findAllMovies,
  findOneMovie,
  findMovieandUpdate,
  deleteMovie,
};
