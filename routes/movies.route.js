const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");
const { checkJSON } = require("../utils/middlewares");
router.use(express.json());

router.param("id", (req, res, next, id) => {
  const movieID = parseInt(id);
  let newmovie = {};
  newmovie.movieID = movieID;
  newmovie.name = req.body.name;
  newmovie.director = req.body.director;
  newmovie.productionYear = req.body.productionYear;
  req.newmovie = newmovie;
  next();
});

router.post("/", checkJSON, movieController.createMovie);
router.get("/", movieController.findAllMovies);
router.get("/:id", movieController.findOneMovie);
router.put("/:id", movieController.findMovieandUpdate);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
