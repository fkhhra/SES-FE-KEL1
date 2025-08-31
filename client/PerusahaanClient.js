import client from "./ApiClient";

export const getPerusahaanSekolah = (params) => {
  return client("perusahaan-sekolah", { params });
};

export const getPerusahaan = (params) => {
  return client("perusahaan-sekolah-31", { params });
};

export const getIndustri = (params) => {
  return client("industri", { params });
};

export const detailPerusahaanSekolah = (id) => {
  return client(`perusahaan-sekolah/${id}`);
};

export const detailPerusahaan = (id) => {
  return client(`cdc/cari-perusahaan/${id}`);
};

export const postPerusahaan = (body) => {
  return client("cdc/perusahaan", { method: "POST", body });
};

export const postPerusahaanSekolah = (body) => {
  return client("perusahaan-sekolah", { method: "POST", body });
};

export const editPerusahaan = (id, body) => {
  return client(`cdc/informasi-perusahaan/${id}`, { method: "PUT", body });
};

export const putPerusahaanSekolah = (id, body) => {
  return client(`perusahaan-sekolah/${id}`, { method: "PUT", body });
};

export const putInformasiPerusahaan = (id, body) => {
  return client(`cdc/informasi-perusahaan-lite/${id}`, { method: "PUT", body });
};

export const putPenanggungJawabPerusahaan = (id, body) => {
  return client(`cdc/penanggung-jawab-perusahaan/${id}`, {
    method: "PUT",
    body,
  });
};

export const deletePerusahaanSekolah = (id) => {
  return client(`perusahaan-sekolah/${id}`, { method: "DELETE" });
};
