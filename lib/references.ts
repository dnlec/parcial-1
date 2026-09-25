import { api } from "./api";

export interface Genre {
  id: string;
  type: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface YoutubeTrailer {
  id: string;
  name: string;
  url: string;
  duration: number;
  channel: string;
}

export type YoutubeTrailerInput = Omit<YoutubeTrailer, "id">;

export async function getGenres(): Promise<Genre[]> {
  const { data } = await api.get<Genre[]>("/genres");
  return data;
}

export async function getDirectors(): Promise<Director[]> {
  const { data } = await api.get<Director[]>("/directors");
  return data;
}

export async function createYoutubeTrailer(
  input: YoutubeTrailerInput,
): Promise<YoutubeTrailer> {
  const { data } = await api.post<YoutubeTrailer>("/youtube-trailers", input);
  return data;
}
