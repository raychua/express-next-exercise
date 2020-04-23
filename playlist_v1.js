const express = require("express");
const api = express.Router();


const songsRouter = require("./routes/songs.route");
const moviesRouter = require("./routes/movies.route");

api.use("/songs", songsRouter);
api.use("/movies", moviesRouter);

api.get("/", (req, res) => {
  res.send("Version 1 of playlist API");
});

module.exports = api;
