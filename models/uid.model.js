const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uidSchema = new Schema({
  counterType: String,
  idCounter: Number,
});

const uid = mongoose.model("UID", uidSchema);
module.exports = uid;
