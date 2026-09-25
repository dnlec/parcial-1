"use client";

import { updateActor, type Actor, type ActorInput } from "@/lib/actors";
import ActorForm from "../../ActorForm";

export default function EditActorForm({ actor }: { actor: Actor }) {
  const action = (input: ActorInput) => updateActor(actor.id, input);
  return <ActorForm actor={actor} action={action} submitLabel="Save" />;
}
