import { Request, Response,NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { MoviesResult, Movies } from "./interfaces";

export const requestLog = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    console.log(`${request.method}: ${request.url}`);
  
    return next();
  };  

export const existenceMovieName = async (
    request: Request,
    response: Response,
    next: NextFunction
  ):Promise <void | Response> => {
    const newName: string = request.body.name;
    
    const queryString:string = "SELECT * FROM movies WHERE name = $1"
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [newName],
    };

    const queryResult: MoviesResult = await client.query(queryConfig);
    const movie: Movies = queryResult.rows[0];

    if (movie) {
      return response
        .status(409)
        .json({ message: "Product already registered." });
    }
    return next();
  };

  export const existenceMovieById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ):Promise <void | Response> => {
    const { id } = request.params;
    
    const queryString: string = "SELECT * FROM movies WHERE id = $1";
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id],
    };

    const queryResult: MoviesResult = await client.query(queryConfig);
    const movie: Movies = queryResult.rows[0];

    if (!movie) {
      return response
        .status(404)
        .json({ message: "Movie not found!" });
    }
    return next();
  };
  