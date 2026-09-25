import { api } from "./api";

export interface Prize {
  id: string;
  name: string;
  category: string;
  year: number;
  status: string; // 'won' or 'nominated'
}

export type PrizeInput = Omit<Prize, "id">;

export async function createPrize(input: PrizeInput): Promise<Prize> {
  const { data } = await api.post<Prize>("/prizes", input);
  return data;
}
