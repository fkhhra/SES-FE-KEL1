import client from "./ApiClient";

export const getRencanaTransaksi = (rencana, params) => {
  return client(`rencana-transaksi/${rencana}`, { params });
};

export const postRencanaTransaksi = (rencana, body) => {
  return client(`rencana-transaksi/${rencana}`, { method: "POST", body });
};

export const putRencanaTransaksi = (id, body) => {
  return client(`rencana-transaksi/${id}`, { method: "PUT", body });
};

export const deleteRencanaTransaksi = (id) => {
  return client(`rencana-transaksi/${id}`, { method: "DELETE" });
};

export const aprovalRencanaTransaksi = (id, body) => {
  return client(`aproval-perencanaan/${id}`, { method: "PUT", body });
};
