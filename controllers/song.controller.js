const Joi = require("@hapi/joi");
const Song = require("../models/song.model");
const uid = require("./uid.controller");

function validateSong(song) {
  const schema = Joi.object({
    songID: Joi.number().integer(),
    name: Joi.string().min(3).required(),
    artist: Joi.string().min(3).required(),
    productionYear: Joi.number().integer(),
  });
  return schema.validate(song);
}

const createSong = async (req, res, next) => {
  try {
    const validation = validateSong(req.body);
    if (validation.error) {
      const error = new Error(validation.error.details[0].message);
      // 400 Bad Request
      error.statusCode = 400;
      next(error);
    } else {
      console.log("in post new song after validation");
      let newsong = {};
      newsong.name = req.body.name;
      newsong.artist = req.body.artist;
      newsong.productionYear = req.body.productionYear;
      newsong.songID = await uid.genNextID("Song");
      console.log("In after genNextID song");
      const newSong = new Song(newsong);
      await newSong.save();
      res.status(201).json(newSong);
    }
  } catch (err) {
    next(err);
  }
};

const findAllSongs = async (req, res, next) => {
  try {
    console.log("In here findAllSongs");
    const songs = await Song.find({}, "-_id -__v");
    if (songs.length > 0) res.status(200).json(songs);
    else {
      const error = new Error("Song List is empty");
      error.statusCode = 204;
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

const findOneSong = async (req, res, next) => {
  try {
    const newsong = req.newsong;
    let findsong = {};
    findsong.songID = newsong.songID;
    console.log("In here findOne findOneSong:", findsong);
    const song = await Song.findOne(findsong, "-_id -__v");
    if (song === null) {
      const error = new Error("Song ID not found");
      error.statusCode = 404;
      next(error);
    } else res.status(200).json(song);
  } catch (err) {
    next(err);
  }
};

const findOneSongandUpdate = async (req, res, next) => {
  try {
    const newsong = req.newsong;
    let findsong = {};
    findsong.songID = newsong.songID;
    console.log("In here findOneSongandUpdate findsong:", findsong);
    const song = await Song.findOneAndUpdate(findsong, newsong, { new: true });
    if (song === null) {
      const error = new Error("Song ID not found");
      error.statusCode = 404;
      next(error);
    } else res.status(200).json(song);
  } catch (err) {
    next(err);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const newsong = req.newsong;
    let findsong = {};
    findsong.songID = newsong.songID;
    console.log("In here findOne findOneSong:", findsong);
    const song = await Song.findOneAndDelete(findsong);
    if (song === null) {
      const error = new Error("Song ID not found");
      error.statusCode = 404;
      next(error);
    } else res.status(200).json(song);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSong,
  findAllSongs,
  findOneSong,
  findOneSongandUpdate,
  deleteSong,
};
