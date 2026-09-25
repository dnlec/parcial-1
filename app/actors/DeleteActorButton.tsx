"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteActor } from "@/lib/actors";

export default function DeleteActorButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this actor?")) return;
    setDeleting(true);
    try {
      await deleteActor(id);
      router.refresh();
    } catch {
      alert("Could not delete the actor");
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete"}
    </button>
  );
}
