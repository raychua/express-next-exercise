const express = require("express");
const cookieParser = require("cookie-parser");
const apiVersion1 = require("./playlist_v1");
const apiVersion2 = require("./playlist_v2");

//require("./utils/SongsDB");
require("./utils/moviesDB");

const app = express();

app.use(cookieParser());
app.use("/v1", apiVersion1);

//app.use("/v2", apiVersion2);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
