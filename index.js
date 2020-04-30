const app = require("./playlist");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

const server = app.listen(PORT, () => {
  console.log(`Playlist API running on http://localhost:${PORT}`);
});
