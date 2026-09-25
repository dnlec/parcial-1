import { getDirectors, getGenres } from "@/lib/references";
import MovieForm from "../MovieForm";

export default async function NewMoviePage() {
  const [genres, directors] = await Promise.all([
    getGenres(),
    getDirectors(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Create movie</h1>
      <MovieForm genres={genres} directors={directors} />
    </div>
  );
}
