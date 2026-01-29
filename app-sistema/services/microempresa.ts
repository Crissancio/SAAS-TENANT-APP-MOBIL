import { apiClient } from "../services/api";

export const getMicroempresaById = (id_microempresa: number) =>
  apiClient.get(`/microempresas/${id_microempresa}`);
