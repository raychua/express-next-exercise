const express = require("express");
const Joi = require("@hapi/joi");
const router = express.Router();

router.use(express.json());

const songList = [];
const checkJSON = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Please send a json message");
  } else next();
};

router.param("id", (req, res, next, id) => {
  const songID = parseInt(id);
  let newsong = {};
  newsong.id = songID;
  newsong.name = req.body.name;
  newsong.artist = req.body.artist;
  req.newsong = newsong;
  next();
});

function validateSong(song) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3).required(),
    artist: Joi.string().min(3).required(),
  });
  return schema.validate(song);
}

router.post("/", checkJSON, (req, res, next) => {
  const validation = validateSong(req.body);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    // 400 Bad Request
    error.statusCode = 400;
    next(error);
  } else {
    let song = {};
    if (songList.length === 0) song.id = 1;
    else song.id = songList[songList.length - 1].id + 1;
    song.name = req.body.name;
    song.artist = req.body.artist;
    songList.push(song);
    res.status(201).json(song);
  }
});

router.get("/", (req, res, next) => {
  if (songList.length > 0) res.status(200).json(songList);
  else {
    const error = new Error("Song List is empty");
    error.statusCode = 204;
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  const newsong = req.newsong;
  let found = false;
  songList.forEach((song) => {
    if (song.id === newsong.id) {
      res.status(200).json(song);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Song ID not found");
    error.statusCode = 404;
    next(error);
  }
});

router.put("/:id", checkJSON, (req, res, next) => {
  const newsong = req.newsong;
  let found = false;
  songList.forEach((song, index) => {
    if (song.id == newsong.id) {
      songList.splice(index, 1, newsong);
      res.status(200).json(newsong);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Song ID not found");
    error.statusCode = 404;
    next(error);
  }
});

router.delete("/:id", (req, res, next) => {
  const newsong = req.newsong;
  let found = false;
  songList.forEach((song, index) => {
    if (song.id == newsong.id) {
      songList.splice(index, 1);
      res.status(200).json(song);
      found = true;
    }
  });
  if (!found) {
    const error = new Error("Song ID not found");
    error.statusCode = 404;
    next(error);
  }
});

module.exports = router;
