"use client";

import { createActor } from "@/lib/actors";
import ActorForm from "../ActorForm";

export default function NewActorPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Create actor</h1>
      <ActorForm action={createActor} submitLabel="Create" />
    </div>
  );
}
