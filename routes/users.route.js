const express = require("express");
const router = express.Router();
router.use(express.json());
const userController = require("../controllers/user.controller");
const { checkJSON } = require("../utils/middlewares");

router.post("/newSignup", checkJSON, userController.newSignup);
router.post("/login", checkJSON, userController.userlogin);
router.post("/logout", checkJSON, userController.logout);

module.exports = router;
