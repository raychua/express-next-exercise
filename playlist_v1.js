const express = require("express");
const api = express.Router();
const { protectRoute } = require("./utils/middlewares");

const songsRouter = require("./routes/songs.route");
const moviesRouter = require("./routes/movies.route");
const userRouter = require("./routes/users.route");

api.use("/songs", songsRouter);
api.use("/movies", protectRoute, moviesRouter);
api.use("/users", userRouter);

api.get("/", (req, res) => {
  res.send("Version 1 of playlist API");
});

module.exports = api;
