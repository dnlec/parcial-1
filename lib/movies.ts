import { api } from "./api";
import type { Prize } from "./prizes";

// Actor summary as embedded in a movie's `actors` relation.
export interface MovieActor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
}

export interface MovieGenre {
  id: string;
  type: string;
}

export interface MovieDirector {
  id: string;
  name: string;
}

export interface MovieTrailer {
  id: string;
  name: string;
  url: string;
  duration: number;
  channel: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  // GET /movies includes `actors`; `prizes` must be fetched separately.
  actors?: MovieActor[];
  genre?: MovieGenre | null;
  director?: MovieDirector | null;
  youtubeTrailer?: MovieTrailer | null;
}

export type MovieInput = Omit<
  Movie,
  "id" | "actors" | "genre" | "director" | "youtubeTrailer"
>;

// The backend requires an existing genre, director and youtube trailer
// (enforced in MovieService.create, not visible in MovieDto).
export interface MovieCreatePayload extends MovieInput {
  genre: { id: string };
  director: { id: string };
  youtubeTrailer: { id: string };
}

export async function getMovies(): Promise<Movie[]> {
  const { data } = await api.get<Movie[]>("/movies");
  return data;
}

export async function getMovie(id: string): Promise<Movie> {
  const { data } = await api.get<Movie>(`/movies/${id}`);
  return data;
}

// GET /movies and /movies/:id do not include the `prizes` relation,
// so prizes are read from the dedicated sub-route.
export async function getMoviePrizes(movieId: string): Promise<Prize[]> {
  const { data } = await api.get<Prize[]>(`/movies/${movieId}/prizes`);
  return data;
}

export async function createMovie(input: MovieCreatePayload): Promise<Movie> {
  const { data } = await api.post<Movie>("/movies", input);
  return data;
}

// Link an existing movie to an existing actor.
export async function addMovieToActor(
  actorId: string,
  movieId: string,
): Promise<void> {
  await api.post(`/actors/${actorId}/movies/${movieId}`);
}

// Link an existing prize to an existing movie.
export async function addPrizeToMovie(
  movieId: string,
  prizeId: string,
): Promise<void> {
  await api.post(`/movies/${movieId}/prizes/${prizeId}`);
}
