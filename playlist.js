const express = require("express");
const apiVersion1 = require("./playlist_v1");
const apiVersion2 = require("./playlist_v2");
const app = express();

app.use("/v1", apiVersion1);
app.use("/v2", apiVersion2);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
