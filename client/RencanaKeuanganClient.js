import client from "./ApiClient";

export const getRencanaKeuangan = (params) => {
  return client("rencana-keuangan", { params });
};

export const getRencanaRekeningSekolah = (id, params) => {
  return client(`rencana-rekening-keuangan/${id}`, { params });
};

export const detailRencanaKeuangan = (id) => {
  return client(`rencana-keuangan/${id}`);
};

export const postRencanaKeuangan = (body) => {
  return client("rencana-keuangan", { method: "POST", body });
};

export const putRencanaKeuangan = (id, body) => {
  return client(`rencana-keuangan/${id}`, { method: "PUT", body });
};

export const deleteRencanaKeuangan = (id) => {
  return client(`rencana-keuangan/${id}`, { method: "DELETE" });
};
