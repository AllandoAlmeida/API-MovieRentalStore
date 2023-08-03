import { QueryResult } from "pg";

export interface Movies {
    id: number;
    name: string;
    category: string;
    duration: number;
    price: number;
}

export type CreateMovies = Omit<Movies, 'id'>;
export type MoviesResult = QueryResult<Movies>;