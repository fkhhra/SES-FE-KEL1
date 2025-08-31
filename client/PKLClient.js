import client from "./ApiClient";

export const getPenerimaanPerusahaan = (id, params) => {
  return client(`penerimaan-perusahaan/${id}`, { params });
};

export const postPenerimaanPerusahaan = (body) => {
  return client("penerimaan-perusahaan", { method: "POST", body });
};

export const putPenerimaanPerusahaan = (id, body) => {
  return client(`penerimaan-perusahaan/${id}`, { method: "PUT", body });
};

export const deletePenerimaanPerusahaan = (id) => {
  return client(`penerimaan-perusahaan/${id}`, { method: "DELETE"});
};
