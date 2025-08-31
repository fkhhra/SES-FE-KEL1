import client from "./ApiClient";

export const getInventaris = (params) => {
  return client("inventaris", { params });
};

export const getInventarisAktif = (params) => {
  return client("inventaris-aktif", { params });
};

export const getGeneratePenyusutan = (params) => {
  return client("penyusutan-generate", { params });
};
export const getInventarisPenyusutan = (params) => {
  return client("penyusutan", { params });
};
export const postInventarisPenyusutan = (body) => {
  return client("penyusutan", { method: "POST", body });
};
export const putInventarisPenyusutan = (id, body) => {
  return client(`penyusutan/${id}`, { method: "PUT", body });
};

export const deleteInventarisPenyusutan = (id, body) => {
  return client(`penyusutan/${id}`, { method: "DELETE", body });
};

export const postInventaris = (body) => {
  return client("inventaris", { method: "POST", body });
};

export const putInventaris = (id, body) => {
  return client(`inventaris/${id}`, { method: "PUT", body });
};

export const deleteInventaris = (id) => {
  return client(`inventaris/${id}`, { method: "DELETE" });
};
