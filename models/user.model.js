const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  userID: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  salulation: {
    type: String,
    enum: ["Dr", "Mr", "Mrs", "Ms", "Miss", "Mdm"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
