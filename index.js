const app = require("./playlist");
const env = require("./env/env.js");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Playlist API running on http://localhost:${PORT}`);
});
