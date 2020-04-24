const request = require("supertest");
const app = require("../playlist");
const Movie = require("../models/movie.model");
const { teardownMongoose } = require("../utils/teardownMongoose");

afterAll(async () => await teardownMongoose());

beforeEach(async () => {
  const movies = [
    {
      movieID: 5,
      name: "money no enough5",
      director: "jack neo5",
    },
  ];
  await Movie.create(movies);
});

afterEach(async () => {
  await Movie.deleteMany();
});

describe("movies.route", () => {
  it("should return 400 if not JSON message", async () => {
    const { body: actualSong } = await request(app)
      .post("/v1/movies")
      .send("movies")
      .expect(400);
  });

  it("GET /v1/movies should return movielist", async () => {
    const expectedmovie5 = { name: "money no enough5", director: "jack neo5" };

    const { body: movieList } = await request(app)
      .get("/v1/movies")
      .expect(200);
    expect(movieList[0]).toMatchObject(expectedmovie5);
  });

  it("POST /v1/movies new movie should respond correctly when sending JSON", async () => {
    const expectedmovie2 = { name: "money no enough2", director: "jack neo2" };
    const { body: actualmovie } = await request(app)
      .post("/v1/movies")
      .send({ name: "money no enough2", director: "jack neo2" })
      .expect(201);
    expect(actualmovie).toMatchObject(expectedmovie2);
  });

  it("Get /v1/movies/5 should get movie", async () => {
    const expectedmovie5 = {
      name: "money no enough5",
      director: "jack neo5",
    };
    const { body: actualmovie } = await request(app)
      .get("/v1/movies/5")
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie5);
  });

  it("PUT /v1/movies/1 should update movie director", async () => {
    const expectedmovie3 = {
      name: "money no enough1",
      director: "jack neo1",
    };

    const { body: actualmovie } = await request(app)
      .put("/v1/movies/5")
      .send({ name: "money no enough1", director: "jack neo1" })
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie3);

    const { body: actualmovie1 } = await request(app)
      .get("/v1/movies/5")
      .expect(200);
    expect(actualmovie1).toMatchObject(expectedmovie3);
  });

  it("DELETE /v1/movies/1 should delete the movie", async () => {
    const expectedmovie3 = {
      name: "money no enough5",
      director: "jack neo5",
    };

    const { body: actualmovie } = await request(app)
      .delete("/v1/movies/5")
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie3);

    await request(app).get("/v1/movies").expect(204);
  });

  it("POST /v1/movies should give error when not meeting correct validation", async () => {
    const expectedmovie2 = { name: "mo", artist: "jack neo3" };

    const { body: error } = await request(app)
      .post("/v1/movies")
      .send(expectedmovie2)
      .expect(400);
  });

  it("Get /v1/movies/8 should return 404 if movie is not found", async () => {
    const { body: actualMovie } = await request(app)
      .get("/v1/movies/8")
      .expect(404);
  });
  it("PUT /v1/movies/9 should return an error if not found", async () => {
    const { body: actualMovie } = await request(app)
      .put("/v1/movies/9")
      .send({ name: "money no enough3", artist: "jack neo3" })
      .expect(404);
  });

  it("DELETE /v1/movies/9 should return 404 if not found", async () => {
    const { body: actualMovie } = await request(app)
      .delete("/v1/movies/9")
      .expect(404);
  });
});
