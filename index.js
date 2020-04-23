const app = require("./playlist");
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Playlist API running on http://localhost:${PORT}`);
});
