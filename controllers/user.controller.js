//const Joi = require("@hapi/joi");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const { protectRoute, createJWTToken } = require("../utils/middlewares");

const newSignup = async (req, res, next) => {
  try {
    console.log("in post new sign up");
    let newUser = {};
    newUser.userID = req.body.userID;
    newUser.name = req.body.name;
    newUser.salutation = req.body.salulation;
    newUser.password = req.body.password;
    const newuser = new User(newUser);
    await newuser.save();
    res.status(201).json(newuser);
  } catch (err) {
    next(err);
  }
};

const userlogin = async (req, res, next) => {
  try {
    console.log("in userlogin");
    let user = {};
    user.userID = req.body.userID;
    let validPassword = false;
    const founduser = await User.findOne(user);

    if (founduser) {
      validPassword = await bcrypt.compare(
        req.body.password,
        founduser.password
      );
    }
    if (!founduser || !validPassword) {
      const invalidLogin = new Error("Incorrect user name or password");
      throw invalidLogin;
    }

    const cookieInfo = createJWTToken(founduser.userID);
    console.log("cookieInfo.exp:", cookieInfo.exp);
    if (process.env.NODE_ENV === "development") {
      res.cookie("loginToken", cookieInfo.token, {
        expires: cookieInfo.exp,
        httpOnly: true, // client-side js cannot access cookie info
        signed: true,
      });
    } else {
      res.cookie("loginToken", cookieInfo.token, {
        expires: cookieInfo.exp,
        httpOnly: true, // client-side js cannot access cookie info
        secure: true, // use HTTPS
        signed: true,
      });
    }
    res.status(200).json("You have logged in successfully");
  } catch (err) {
    res.clearCookie("loginToken");
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("loginToken").send("You have logged out successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { newSignup, userlogin, logout };
