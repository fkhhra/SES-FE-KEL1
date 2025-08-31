import client from "./ApiClient";

export const getArus = (params) => {
  return client("arus-keuangan", { params });
};

export const getArusLaporan = (params) => {
  return client("arus-keuangan-laporan", { params });
};

export const getArusLaporanNeraca = (params) => {
  return client("arus-keuangan-laporan-neraca", { params });
};

export const rekapArus = (data) => {
  return client("download/arus-kas", { body: data, method: "POST" });
};

export const postKategoriArus = (data) => {
  return client("kategori-arus", { body: data, method: "POST" });
};

export const putKategoriArus = (id, data) => {
  return client(`kategori-arus/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriArus = (id) => {
  return client(`kategori-arus/${id}`, { method: "DELETE" });
};

export const postAktivitas = (data) => {
  return client("aktivitas-arus", { body: data, method: "POST" });
};

export const putAktivitas = (id, data) => {
  return client(`aktivitas-arus/${id}`, { body: data, method: "PUT" });
};

export const deleteAktivitas = (id) => {
  return client(`aktivitas-arus/${id}`, { method: "DELETE" });
};

export const postTipeAkun = (data) => {
  return client("tipe-akun", { body: data, method: "POST" });
};

export const putTipeAkun = (id, data) => {
  return client(`tipe-akun/${id}`, { body: data, method: "PUT" });
};

export const deleteTipeAkun = (id) => {
  return client(`tipe-akun/${id}`, { method: "DELETE" });
};

export const postRumusKenaikan = (data) => {
  return client("rumus-kenaikan", { body: data, method: "POST" });
};

export const putRumusKenaikan = (id, data) => {
  return client(`rumus-kenaikan/${id}`, { body: data, method: "PUT" });
};

export const postRumusKasAwal = (data) => {
  return client("rumus-kas-awal", { body: data, method: "POST" });
};

export const putRumusKasAwal = (id, data) => {
  return client(`rumus-kas-awal/${id}`, { body: data, method: "PUT" });
};

export const postRumusKasAkhir = (data) => {
  return client("rumus-kas-akhir", { body: data, method: "POST" });
};

export const putRumusKasAkhir = (id, data) => {
  return client(`rumus-kas-akhir/${id}`, { body: data, method: "PUT" });
};
