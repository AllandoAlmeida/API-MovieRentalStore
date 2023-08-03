import { QueryConfig } from "pg";
import { client } from "./database";
import { Movies, MoviesResult } from "./interfaces";
import { Request, Response } from "express";
import format from "pg-format";

export const createMovies = async (
  request: Request,
  response: Response
): Promise<void | Response> => {
  const newMovie: Movies = request.body as Movies;

  const queryString: string = format(
    `
        INSERT INTO "movies"
        (%I)
        VALUES
        (%L)
        RETURNING *;`,
    Object.keys(newMovie),
    Object.values(newMovie)
  );

  const queryResult: MoviesResult = await client.query(queryString);
  const movie: Movies = queryResult.rows[0];

  return response.status(201).json(movie);
};

export const searchAllMovies = async (
  request: Request,
  response: Response
): Promise<void | Response> => {
  const { category } = request.query;
  let queryString: string = `
    SELECT * FROM "movies"
    `;
  if (category) {
    queryString += `
        WHERE "category" = $1        
        `;
  }
  const queryConfig: QueryConfig = {
    text: queryString,
    values: category ? [category] : [],
  };

  const queryResult: MoviesResult = await client.query(queryConfig);
  const movies = queryResult.rows;

  if (movies.length === 0) {
    const queryString: string = `
        SELECT * FROM "movies"
        `;
    const queryResult = await client.query(queryString);
    const movies = queryResult.rows;

    return response.status(200).json(movies);
  }

  return response.status(200).json(movies);
};

export const searchForMoviesById = async (
  request: Request,
  response: Response
): Promise<void | Response> => {
  const { id } = request.params;
  const queryString: string = `
    SELECT * FROM "movies"
    WHERE "id" = $1
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: MoviesResult = await client.query(queryConfig);
  const movies = queryResult.rows[0];

  return response.status(200).json(movies);
};

export const upDateMoviesById = async (
  request: Request,
  response: Response
): Promise<void | Response> => {
  const { body, params } = request;

  const updateColumns: string[] = Object.keys(body);
  const updateValues: any[] = Object.values(body);

  const queryString: string = `
    UPDATE "movies"
    SET (%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
    `;

  const queryFormat: string = format(
    queryString,
    updateColumns,
    updateValues
  );

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [params.id],
  };
  const queryResult: MoviesResult = await client.query(queryConfig);
  console.log;
  const upDateMovies = queryResult.rows[0];

  return response.status(200).json(upDateMovies);
};

export const deleteMovie = async (
  request: Request,
  response: Response
): Promise<void | Response> => {
  const { id } = request.params;
  const queryString: string = `
          DELETE FROM "movies"
          WHERE "id" = $1
        `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: MoviesResult = await client.query(queryConfig);
  const movies = queryResult.rows[0];

  return response.status(204).json(movies);
};
