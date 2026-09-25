import { api } from "./api";

export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
}

// Fields the API accepts on create/update.
export type ActorInput = Omit<Actor, "id">;

export async function getActors(): Promise<Actor[]> {
  const { data } = await api.get<Actor[]>("/actors");
  return data;
}

export async function getActor(id: string): Promise<Actor> {
  const { data } = await api.get<Actor>(`/actors/${id}`);
  return data;
}

export async function createActor(input: ActorInput): Promise<Actor> {
  const { data } = await api.post<Actor>("/actors", input);
  return data;
}

export async function updateActor( id: string, input: ActorInput): Promise<Actor> {
  const { data } = await api.put<Actor>(`/actors/${id}`, input);
  return data;
}

export async function deleteActor(id: string): Promise<void> {
  await api.delete(`/actors/${id}`);
}
