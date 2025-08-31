import client from "./ApiClient";

export const getAnalisis = (params) => {
  return client("analisis-keuangan", { params });
};

export const downloadAnalisis = (body) => {
  return client("download/analisis-keuangan", { method: "POST", body });
};

export const postAnalisis = (body) => {
  return client("analisis-keuangan", { method: "POST", body });
};

export const putAnalisis = (id, body) => {
  return client(`analisis-keuangan/${id}`, { method: "PUT", body });
};

export const deleteAnalisis = (id) => {
  return client(`analisis-keuangan/${id}`, { method: "DELETE" });
};
