import client from "./ApiClient";

export const getDetailBerkas = (id, params) => {
  return client(`cdc/berkas-perusahaan/${id}`, { params });
};

export const postBerkasSurat = (body) => {
  return client("cdc/surat", { method: "POST", body });
};

export const putBerkasSurat = (id, body) => {
  return client(`cdc/surat/${id}`, { method: "PUT", body });
};

export const deleteBerkasSurat = (id) => {
  return client(`cdc/surat/${id}`, { method: "DELETE" });
};

export const postBerkasMou = (body) => {
  return client("cdc/mou", { method: "POST", body });
};

export const putBerkasMou = (id, body) => {
  return client(`cdc/mou/${id}`, { method: "PUT", body });
};

export const deleteBerkasMou = (id) => {
  return client(`cdc/mou/${id}`, { method: "DELETE" });
};
