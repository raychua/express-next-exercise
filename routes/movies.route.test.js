const request = require("supertest");
const app = require("../playlist");

beforeEach(async (done) => {
  await request(app)
    .post("/v1/movies")
    .send({ name: "money no enough1", director: "jack neo" });
  done();
});

afterEach(async (done) => {
  await request(app).delete("/v1/movies/1");
  await request(app).delete("/v1/movies/2");
  done();
});

describe("App", () => {
  const expectedmovie1 = { name: "money no enough1", director: "jack neo" };
  it("GET /v1/movies should return movielist", async (done) => {
    const { body: movieList } = await request(app)
      .get("/v1/movies")
      .expect(200);
    expect(movieList[0]).toMatchObject(expectedmovie1);
    done();
  });

  it("POST /v1/movies new movie should respond correctly when sending JSON", async (done) => {
    const expectedmovie2 = { name: "money no enough2", director: "jack neo2" };
    const { body: actualmovie } = await request(app)
      .post("/v1/movies")
      .send({ name: "money no enough2", director: "jack neo2" })
      .expect(201);
    expect(actualmovie).toMatchObject(expectedmovie2);
    done();
  });

  it("Get /v1/movies/1 should get movie", async (done) => {
    const expectedmovie3 = {
      name: "money no enough1",
      director: "jack neo",
    };
    const { body: actualmovie } = await request(app)
      .get("/v1/movies/1")
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie3);
    done();
  });

  it("PUT /v1/movies/1 should update movie director", async (done) => {
    const expectedmovie3 = {
      name: "money no enough1",
      director: "jack neo1",
    };

    const { body: actualmovie } = await request(app)
      .put("/v1/movies/1")
      .send({ name: "money no enough1", director: "jack neo1" })
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie3);

    const { body: actualmovie1 } = await request(app)
      .get("/v1/movies/1")
      .expect(200);
    expect(actualmovie1).toMatchObject(expectedmovie3);

    done();
  });

  it("DELETE /v1/movies/1 should delete the movie", async (done) => {
    const expectedmovie3 = {
      name: "money no enough1",
      director: "jack neo",
    };

    const { body: actualmovie } = await request(app)
      .delete("/v1/movies/1")
      .expect(200);
    expect(actualmovie).toMatchObject(expectedmovie3);

    await request(app).get("/v1/movies").expect(204);

    done();
  });
});
