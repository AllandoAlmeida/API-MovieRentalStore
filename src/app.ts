import express, { Application, json } from "express";
import {
  createMovies,
  deleteMovie,
  searchAllMovies,
  searchForMoviesById,
  upDateMoviesById,
} from "./logic";
import { startDatabase } from "./database";
import {
  existenceMovieById,
  existenceMovieName,
  requestLog,
} from "./middlewares";

const app: Application = express();
app.use(json());
app.use(requestLog);

app.post("/movies", existenceMovieName, createMovies);
app.get("/movies", searchAllMovies);
app.get("/movies/:id", existenceMovieById, searchForMoviesById);
app.patch(
  "/movies/:id",
  existenceMovieById,
  existenceMovieName,
  upDateMoviesById
);
app.delete("/movies/:id", existenceMovieById, deleteMovie);

const PORT: number = 3000;
const runningMsg = `Server running on http://localhost:${PORT}`;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(runningMsg);
});
