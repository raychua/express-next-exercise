const request = require("supertest");
const app = require("../playlist");
const Song = require("../models/song.model");
const { teardownMongoose } = require("../utils/teardownMongoose");

afterAll(async () => await teardownMongoose());

beforeEach(async () => {
  const songs = [
    {
      songID: 5,
      name: "army song5",
      artist: "chao ah beng5",
    },
  ];
  await Song.create(songs);
});

afterEach(async () => {
  await Song.deleteMany();
});

describe("songs.route", () => {
  it("should return 400 if not JSON message", async () => {
    const { body: actualSong } = await request(app)
      .post("/v1/songs")
      .send("army song2")
      .expect(400);
  });

  it("GET /v1/songs should return songlist", async () => {
    const expectedSong1 = {
      name: "army song5",
      artist: "chao ah beng5",
    };
    const { body: songList } = await request(app).get("/v1/songs").expect(200);
    expect(songList[0]).toMatchObject(expectedSong1);
  });

  it("POST /v1/songs new song should respond correctly when sending JSON", async () => {
    const expectedSong2 = { name: "army song2", artist: "chao ah beng2" };
    const expectedSong3 = { name: "army song3", artist: "chao ah beng3" };
    const { body: actualSong } = await request(app)
      .post("/v1/songs")
      .send({ name: "army song2", artist: "chao ah beng2" })
      .expect(201);
    expect(actualSong).toMatchObject(expectedSong2);

    const { body: actualSong1 } = await request(app)
      .post("/v1/songs")
      .send({ name: "army song3", artist: "chao ah beng3" })
      .expect(201);
    expect(actualSong1).toMatchObject(expectedSong3);
  });

  it("Get /v1/songs/ should get song", async () => {
    const { body: actualSong } = await request(app)
      .get("/v1/songs/")
      .expect(200);
    expect(actualSong.length).toEqual(1);
  });

  it("Get /v1/songs/5 should get song", async () => {
    const expectedSong3 = {
      name: "army song5",
      artist: "chao ah beng5",
    };
    const { body: actualSong } = await request(app)
      .get("/v1/songs/5")
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);
  });

  it("PUT /v1/songs/5 should update song artist", async () => {
    const expectedSong3 = {
      name: "army song1",
      artist: "chao ah beng1",
    };

    const { body: actualSong } = await request(app)
      .put("/v1/songs/5")
      .send({ name: "army song1", artist: "chao ah beng1" })
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);
  });

  it("DELETE /v1/songs/5 should delete the song", async () => {
    const expectedSong3 = {
      name: "army song5",
      artist: "chao ah beng5",
    };

    const { body: actualSong } = await request(app)
      .delete("/v1/songs/5")
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);

    await request(app).get("/v1/songs").expect(204);
  });

  it("POST /v1/songs should give error when not meeting correct validation", async () => {
    const expectedSong2 = { name: "ar", artist: "chao ah beng2" };

    const { body: error } = await request(app)
      .post("/v1/songs")
      .send(expectedSong2)
      .expect(400);
  });

  it("Get /v1/songs/8 should return 404 if song is not found", async () => {
    const { body: actualSong } = await request(app)
      .get("/v1/songs/8")
      .expect(404);
  });
  it("PUT /v1/songs/9 should return an error if not found", async () => {
    const { body: actualSong } = await request(app)
      .put("/v1/songs/9")
      .send({ name: "army song1", artist: "chao ah beng1" })
      .expect(404);
  });

  it("DELETE /v1/songs/9 should return 404 if not found", async () => {
    const { body: actualSong } = await request(app)
      .delete("/v1/songs/9")
      .expect(404);
  });
});
