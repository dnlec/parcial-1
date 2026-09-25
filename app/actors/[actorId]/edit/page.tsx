import { getActor } from "@/lib/actors";
import EditActorForm from "./EditActorForm";

export default async function EditActorPage({
  params,
}: PageProps<"/actors/[actorId]/edit">) {
  const { actorId } = await params;
  const actor = await getActor(actorId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Edit actor</h1>
      <EditActorForm actor={actor} />
    </div>
  );
}
