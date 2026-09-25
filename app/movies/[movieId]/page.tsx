import Image from "next/image";
import Link from "next/link";
import { getMovie, getMoviePrizes } from "@/lib/movies";

export default async function MovieDetailPage({
  params,
}: PageProps<"/movies/[movieId]">) {
  const { movieId } = await params;
  const [movie, prizes] = await Promise.all([
    getMovie(movieId),
    getMoviePrizes(movieId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/movies" className="text-sm text-blue-600 hover:underline">
        ← Back to movies
      </Link>

      <div className="flex gap-6">
        <div className="relative w-40 h-56 shrink-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="160px"
            className="rounded object-cover bg-gray-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{movie.title}</h1>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
            <dt className="font-medium">Release date</dt>
            <dd>{new Date(movie.releaseDate).toLocaleDateString()}</dd>
            <dt className="font-medium">Duration</dt>
            <dd>{movie.duration} min</dd>
            <dt className="font-medium">Country</dt>
            <dd>{movie.country}</dd>
            <dt className="font-medium">Popularity</dt>
            <dd>{movie.popularity}</dd>
            <dt className="font-medium">Genre</dt>
            <dd>{movie.genre?.type ?? "—"}</dd>
            <dt className="font-medium">Director</dt>
            <dd>{movie.director?.name ?? "—"}</dd>
            <dt className="font-medium">Trailer</dt>
            <dd>
              {movie.youtubeTrailer ? (
                <a
                  href={movie.youtubeTrailer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {movie.youtubeTrailer.name}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </dl>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Actors</h2>
        {movie.actors && movie.actors.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {movie.actors.map((actor) => (
              <li key={actor.id} className="flex items-center gap-3">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={actor.photo}
                    alt={actor.name}
                    fill
                    sizes="40px"
                    className="rounded object-cover bg-gray-100"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{actor.name}</p>
                  <p className="text-xs text-gray-500">{actor.nationality}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No actors linked to this movie.</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Prizes</h2>
        {prizes.length > 0 ? (
          <ul className="list-disc pl-5 text-sm text-gray-600">
            {prizes.map((prize) => (
              <li key={prize.id}>
                {prize.name} — {prize.category} ({prize.year}, {prize.status})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No prizes linked to this movie.</p>
        )}
      </section>
    </div>
  );
}
