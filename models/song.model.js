const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  songID: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  artist: {
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

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
