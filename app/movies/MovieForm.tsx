"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addMovieToActor,
  addPrizeToMovie,
  createMovie,
  type MovieCreatePayload,
} from "@/lib/movies";
import { createActor, type ActorInput } from "@/lib/actors";
import { createPrize, type PrizeInput } from "@/lib/prizes";
import {
  createYoutubeTrailer,
  type Director,
  type Genre,
} from "@/lib/references";

interface Props {
  genres: Genre[];
  directors: Director[];
}

// Numeric/date fields kept as strings while typing.
interface FormState {
  // Movie
  title: string;
  poster: string;
  duration: string;
  country: string;
  releaseDate: string;
  popularity: string;
  genreId: string;
  directorId: string;
  // Youtube trailer (created on submit; required by the backend)
  trailerName: string;
  trailerUrl: string;
  trailerDuration: string;
  trailerChannel: string;
  // Lead actor
  actorName: string;
  actorPhoto: string;
  actorNationality: string;
  actorBirthDate: string;
  actorBiography: string;
  // Prize
  prizeName: string;
  prizeCategory: string;
  prizeYear: string;
  prizeStatus: string;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export default function MovieForm({ genres, directors }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    poster: "",
    duration: "",
    country: "",
    releaseDate: "",
    popularity: "",
    genreId: genres[0]?.id ?? "",
    directorId: directors[0]?.id ?? "",
    trailerName: "",
    trailerUrl: "",
    trailerDuration: "",
    trailerChannel: "",
    actorName: "",
    actorPhoto: "",
    actorNationality: "",
    actorBirthDate: "",
    actorBiography: "",
    prizeName: "",
    prizeCategory: "",
    prizeYear: "",
    prizeStatus: "won",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const actorInput: ActorInput = {
      name: form.actorName,
      photo: form.actorPhoto,
      nationality: form.actorNationality,
      birthDate: new Date(form.actorBirthDate).toISOString(),
      biography: form.actorBiography,
    };
    const prizeInput: PrizeInput = {
      name: form.prizeName,
      category: form.prizeCategory,
      year: Number(form.prizeYear),
      status: form.prizeStatus,
    };

    try {
      // 1. Create each entity on its own endpoint.
      //    A movie requires a fresh youtube trailer plus an existing
      //    genre and director (enforced by the backend).
      const trailer = await createYoutubeTrailer({
        name: form.trailerName,
        url: form.trailerUrl,
        duration: Number(form.trailerDuration),
        channel: form.trailerChannel,
      });

      const moviePayload: MovieCreatePayload = {
        title: form.title,
        poster: form.poster,
        duration: Number(form.duration),
        country: form.country,
        releaseDate: new Date(form.releaseDate).toISOString(),
        popularity: Number(form.popularity),
        genre: { id: form.genreId },
        director: { id: form.directorId },
        youtubeTrailer: { id: trailer.id },
      };

      const movie = await createMovie(moviePayload);
      const actor = await createActor(actorInput);
      const prize = await createPrize(prizeInput);

      // 2. Link them through the association endpoints.
      await addMovieToActor(actor.id, movie.id);
      await addPrizeToMovie(movie.id, prize.id);

      router.push("/movies");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-md">
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Movie</h2>
        <Field label="Title">
          <input
            className="border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </Field>
        <Field label="Poster (URL)">
          <input
            type="url"
            className="border rounded px-3 py-2"
            value={form.poster}
            onChange={(e) => update("poster", e.target.value)}
            required
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            required
          />
        </Field>
        <Field label="Country">
          <input
            className="border rounded px-3 py-2"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
        </Field>
        <Field label="Release date">
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={form.releaseDate}
            onChange={(e) => update("releaseDate", e.target.value)}
            required
          />
        </Field>
        <Field label="Popularity">
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={form.popularity}
            onChange={(e) => update("popularity", e.target.value)}
            required
          />
        </Field>
        <Field label="Genre">
          <select
            className="border rounded px-3 py-2"
            value={form.genreId}
            onChange={(e) => update("genreId", e.target.value)}
            required
          >
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.type}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Director">
          <select
            className="border rounded px-3 py-2"
            value={form.directorId}
            onChange={(e) => update("directorId", e.target.value)}
            required
          >
            {directors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Youtube trailer</h2>
        <Field label="Name">
          <input
            className="border rounded px-3 py-2"
            value={form.trailerName}
            onChange={(e) => update("trailerName", e.target.value)}
            required
          />
        </Field>
        <Field label="URL">
          <input
            type="url"
            className="border rounded px-3 py-2"
            value={form.trailerUrl}
            onChange={(e) => update("trailerUrl", e.target.value)}
            required
          />
        </Field>
        <Field label="Duration (minutes)">
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-2"
            value={form.trailerDuration}
            onChange={(e) => update("trailerDuration", e.target.value)}
            required
          />
        </Field>
        <Field label="Channel">
          <input
            className="border rounded px-3 py-2"
            value={form.trailerChannel}
            onChange={(e) => update("trailerChannel", e.target.value)}
            required
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Lead actor</h2>
        <Field label="Name">
          <input
            className="border rounded px-3 py-2"
            value={form.actorName}
            onChange={(e) => update("actorName", e.target.value)}
            required
          />
        </Field>
        <Field label="Photo (URL)">
          <input
            type="url"
            className="border rounded px-3 py-2"
            value={form.actorPhoto}
            onChange={(e) => update("actorPhoto", e.target.value)}
            required
          />
        </Field>
        <Field label="Nationality">
          <input
            className="border rounded px-3 py-2"
            value={form.actorNationality}
            onChange={(e) => update("actorNationality", e.target.value)}
            required
          />
        </Field>
        <Field label="Birth date">
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={form.actorBirthDate}
            onChange={(e) => update("actorBirthDate", e.target.value)}
            required
          />
        </Field>
        <Field label="Biography">
          <textarea
            className="border rounded px-3 py-2"
            rows={3}
            value={form.actorBiography}
            onChange={(e) => update("actorBiography", e.target.value)}
            required
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Prize</h2>
        <Field label="Name">
          <input
            className="border rounded px-3 py-2"
            value={form.prizeName}
            onChange={(e) => update("prizeName", e.target.value)}
            required
          />
        </Field>
        <Field label="Category">
          <input
            className="border rounded px-3 py-2"
            value={form.prizeCategory}
            onChange={(e) => update("prizeCategory", e.target.value)}
            required
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={form.prizeYear}
            onChange={(e) => update("prizeYear", e.target.value)}
            required
          />
        </Field>
        <Field label="Status">
          <select
            className="border rounded px-3 py-2"
            value={form.prizeStatus}
            onChange={(e) => update("prizeStatus", e.target.value)}
          >
            <option value="won">won</option>
            <option value="nominated">nominated</option>
          </select>
        </Field>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Creating..." : "Create movie"}
      </button>
    </form>
  );
}
