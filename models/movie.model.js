const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  movieID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
  },
  director: {
    type: String,
    required: true,
    minlength: 3,
  },
  genre: {
    type: String,
  },
  productionYear: {
    type: Number,
    min: 1900,
    max: 2500,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
