const app = require("./playlist");
const env = require("./env/env.js");

const server = app.listen(process.env.PORT, () => {
  console.log(`Playlist API running on http://localhost:${process.env.PORT}`);
});
