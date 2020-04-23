const request = require("supertest");
const app = require("../playlist");

beforeEach(async (done) => {
  await request(app)
    .post("/v1/songs")
    .send({ name: "army song1", artist: "chao ah beng" });
  done();
});

afterEach(async (done) => {
  await request(app).delete("/v1/songs/1");
  await request(app).delete("/v1/songs/2");
  done();
});

describe("App", () => {
  const expectedSong1 = { name: "army song1", artist: "chao ah beng" };
  it("GET /v1/songs should return songlist", async (done) => {
    const { body: songList } = await request(app).get("/v1/songs").expect(200);
    expect(songList[0]).toMatchObject(expectedSong1);
    done();
  });

  it("POST /v1/songs new song should respond correctly when sending JSON", async (done) => {
    const expectedSong2 = { name: "army song2", artist: "chao ah beng2" };
    const { body: actualSong } = await request(app)
      .post("/v1/songs")
      .send({ name: "army song2", artist: "chao ah beng2" })
      .expect(201);
    expect(actualSong).toMatchObject(expectedSong2);
    done();
  });

  it("Get /v1/songs/1 should get song", async (done) => {
    const expectedSong3 = {
      name: "army song1",
      artist: "chao ah beng",
    };
    const { body: actualSong } = await request(app)
      .get("/v1/songs/1")
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);
    done();
  });

  it("PUT /v1/songs/1 should update song artist", async (done) => {
    const expectedSong3 = {
      name: "army song1",
      artist: "chao ah beng1",
    };

    const { body: actualSong } = await request(app)
      .put("/v1/songs/1")
      .send({ name: "army song1", artist: "chao ah beng1" })
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);

    const { body: actualSong1 } = await request(app)
      .get("/v1/songs/1")
      .expect(200);
    expect(actualSong1).toMatchObject(expectedSong3);

    done();
  });

  it("DELETE /v1/songs/1 should delete the song", async (done) => {
    const expectedSong3 = {
      name: "army song1",
      artist: "chao ah beng",
    };

    const { body: actualSong } = await request(app)
      .delete("/v1/songs/1")
      .expect(200);
    expect(actualSong).toMatchObject(expectedSong3);

    await request(app).get("/v1/songs").expect(204);

    done();
  });
});
