import Link from "next/link";
import { getMoviePrizes, getMovies } from "@/lib/movies";

export default async function MoviesPage() {
  const movies = await getMovies();

  // GET /movies has no `prizes` relation, so fetch each movie's prizes.
  const prizeNames = await Promise.all(
    movies.map(async (movie) => {
      const prizes = await getMoviePrizes(movie.id);
      return prizes[0]?.name ?? null;
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Movies</h1>
        <Link
          href="/movies/new"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Create movie
        </Link>
      </div>

      {movies.length === 0 ? (
        <p className="text-gray-500">No movies registered yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {movies.map((movie, i) => {
            const actorName = movie.actors?.[0]?.name ?? "—";
            const prizeName = prizeNames[i] ?? "—";
            return (
              <li key={movie.id} className="border rounded p-4">
                <Link
                  href={`/movies/${movie.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {movie.title}
                </Link>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 text-sm text-gray-500">
                  <dt>Release date</dt>
                  <dd>{new Date(movie.releaseDate).toLocaleDateString()}</dd>
                  <dt>Actor</dt>
                  <dd>{actorName}</dd>
                  <dt>Prize</dt>
                  <dd>{prizeName}</dd>
                </dl>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
