const express = require("express");
const Joi = require("@hapi/joi");
const { wrapAsync } = require("../utils");
const router = express.Router();

router.use(express.json());

const movieList = [];
const checkJSON = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Please send a json message");
  } else next();
};

const loadMovieFromDB = (movie) => {
  return setTimeout(() => {
    return { name: "Random Movie", director: "Random Lee" };
  }, 1000);
};

const loadOne = async (req, res, next) => {
  const movie = await loadMovieFromDB(1);
  throw new Error("error!");
};

router.get("/random", wrapAsync(loadOne));

router.param("id", (req, res, next, id) => {
  const movieID = parseInt(id);
  let newmovie = {};
  newmovie.id = movieID;
  newmovie.name = req.body.name;
  newmovie.director = req.body.director;
  req.newmovie = newmovie;
  next();
});

function validateMovie(movie) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3).required(),
    director: Joi.string().min(3).required(),
  });
  return schema.validate(movie);
}

router.post("/", checkJSON, (req, res, next) => {
  const validation = validateMovie(req.body);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    // 400 Bad Request
    error.statusCode = 400;
    next(error);
  } else {
    let movie = {};
    if (movieList.length === 0) movie.id = 1;
    else movie.id = movieList[movieList.length - 1].id + 1;
    movie.name = req.body.name;
    movie.director = req.body.director;
    movieList.push(movie);
    res.status(201).json(movie);
  }
});

router.get("/", (req, res) => {
  if (movieList.length > 0) res.status(200).json(movieList);
  else res.status(204).json([]);
});

router.get("/:id", (req, res, next) => {
  const newmovie = req.newmovie;
  let found = false;
  movieList.forEach((movie) => {
    if (movie.id === newmovie.id) {
      res.status(200).json(movie);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Movie ID not found");
    error.statusCode = 404;
    next(error);
  }
});

router.put("/:id", checkJSON, (req, res, next) => {
  const newmovie = req.newmovie;
  let found = false;
  movieList.forEach((movie, index) => {
    if (movie.id == newmovie.id) {
      movieList.splice(index, 1, newmovie);
      res.status(200).json(newmovie);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Movie ID not found");
    error.statusCode = 404;
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  const newmovie = req.newmovie;
  let found = false;
  movieList.forEach((movie, index) => {
    if (movie.id == newmovie.id) {
      movieList.splice(index, 1);
      res.status(200).json(movie);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Movie ID not found");
    error.statusCode = 404;
    next(error);
  }
});

module.exports = router;
