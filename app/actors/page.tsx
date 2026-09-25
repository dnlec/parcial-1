import Image from "next/image";
import Link from "next/link";
import { getActors } from "@/lib/actors";
import DeleteActorButton from "./DeleteActorButton";

export default async function ActorsPage() {
  const actors = await getActors();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Actors</h1>
        <Link
          href="/actors/new"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Create actor
        </Link>
      </div>

      {actors.length === 0 ? (
        <p className="text-gray-500">No actors registered yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {actors.map((actor) => (
            <li
              key={actor.id}
              className="flex items-center gap-4 border rounded p-4"
            >
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={actor.photo}
                  alt={actor.name}
                  fill
                  sizes="64px"
                  className="rounded object-cover bg-gray-100"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{actor.name}</p>
                <p className="text-sm text-gray-500">{actor.nationality}</p>
              </div>
              <div className="flex gap-4 text-sm">
                <Link
                  href={`/actors/${actor.id}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <DeleteActorButton id={actor.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
