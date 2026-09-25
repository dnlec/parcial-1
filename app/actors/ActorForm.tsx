"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Actor, ActorInput } from "@/lib/actors";

interface Props {
  actor?: Actor;
  action: (input: ActorInput) => Promise<Actor>;
  submitLabel: string;
}

// Backend birthDate is a full ISO string; <input type="date"> wants YYYY-MM-DD.
function toDateInput(value?: string): string {
  return value ? value.slice(0, 10) : "";
}

export default function ActorForm({ actor, action, submitLabel }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ActorInput>({
    name: actor?.name ?? "",
    photo: actor?.photo ?? "",
    nationality: actor?.nationality ?? "",
    birthDate: toDateInput(actor?.birthDate),
    biography: actor?.biography ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: keyof ActorInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await action({
        ...form,
        birthDate: new Date(form.birthDate).toISOString(),
      });
      router.push("/actors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          className="border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Photo (URL)</span>
        <input
          type="url"
          className="border rounded px-3 py-2"
          value={form.photo}
          onChange={(e) => update("photo", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nationality</span>
        <input
          className="border rounded px-3 py-2"
          value={form.nationality}
          onChange={(e) => update("nationality", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Birth date</span>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={form.birthDate}
          onChange={(e) => update("birthDate", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Biography</span>
        <textarea
          className="border rounded px-3 py-2"
          rows={4}
          value={form.biography}
          onChange={(e) => update("biography", e.target.value)}
          required
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
