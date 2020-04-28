const express = require("express");
const router = express.Router();
const songController = require("../controllers/song.controller");
const { checkJSON, protectRoute } = require("../utils/middlewares");

router.use(express.json());

/* const checkJSON = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Please send a json message");
  } else next();
}; */

router.param("id", (req, res, next, id) => {
  const songID = parseInt(id);
  let newsong = {};
  newsong.songID = songID;
  newsong.name = req.body.name;
  newsong.artist = req.body.artist;
  newsong.productionYear = req.body.productionYear;
  req.newsong = newsong;
  next();
});

router.post("/", protectRoute, checkJSON, songController.createSong);
router.get("/", songController.findAllSongs);
router.get("/:id", songController.findOneSong);
router.put("/:id", protectRoute, songController.findOneSongandUpdate);
router.delete("/:id", protectRoute, songController.deleteSong);

module.exports = router;
