import client from "./ApiClient";

export const getHistori = (params) => {
  return client("histori-keuangan", { params });
};

export const getHistoriSarpras = (params) => {
  return client("histori-sarpras", { params });
};
