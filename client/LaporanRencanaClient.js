import client from "./ApiClient";

// Neraca
export const getNeraca = (params, id) => {
  return client(`rencana-neraca/${id}`, { params });
};

export const downloadNeraca = (data) => {
  return client("download/neraca", { method: "POST", body: data });
};

export const postKategoriNeraca = (id, data) => {
  return client(`kategori-rencana-neraca/${id}`, {
    body: data,
    method: "POST",
  });
};

export const putKategoriNeraca = (id, data) => {
  return client(`kategori-rencana-neraca/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriNeraca = (id) => {
  return client(`kategori-rencana-neraca/${id}`, { method: "DELETE" });
};

export const postAkunNeraca = (data) => {
  return client("rencana-neraca", { body: data, method: "POST" });
};

export const putAkunNeraca = (id, data) => {
  return client(`rencana-neraca/${id}`, { body: data, method: "PUT" });
};

export const deleteAkunNeraca = (id) => {
  return client(`rencana-neraca/${id}`, { method: "DELETE" });
};

// Laba Rugi
export const getLaba = (id, params) => {
  return client(`rencana-laba/${id}`, { params });
};

export const downloadLaba = (data) => {
  return client("download/laba-rugi", { method: "POST", body: data });
};

export const postRumus = (id, data) => {
  return client(`rumus-rencana-laba/${id}`, { body: data, method: "POST" });
};

export const putRumus = (id, data) => {
  return client(`rumus-rencana-laba/${id}`, { body: data, method: "PUT" });
};

export const deleteRumus = (id) => {
  return client(`rumus-rencana-laba/${id}`, { method: "DELETE" });
};

export const postKategoriLaba = (id, data) => {
  return client(`kategori-rencana-laba/${id}`, { body: data, method: "POST" });
};

export const putKategoriLaba = (id, data) => {
  return client(`kategori-rencana-laba/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriLaba = (id) => {
  return client(`kategori-rencana-laba/${id}`, { method: "DELETE" });
};

export const postAkunLaba = (data) => {
  return client("rencana-laba", { body: data, method: "POST" });
};

export const putAkunLaba = (id, data) => {
  return client(`rencana-laba/${id}`, { body: data, method: "PUT" });
};
export const putTemplateLaba = (id, data) => {
  return client(`rencana-laba-template/${id}`, { body: data, method: "PUT" });
};

export const deleteAkunLaba = (id) => {
  return client(`rencana-laba/${id}`, { method: "DELETE" });
};

// Laporan Arus

export const getArus = (id, params) => {
  return client(`rencana-arus/${id}`, { params });
};

export const getArusLaporan = (id, params) => {
  return client(`rencana-arus-laporan/${id}`, { params });
};

export const getArusLaporanNeraca = (id, params) => {
  return client("rencana-arus-keuangan-laporan-neraca/" + id, { params });
};

export const rekapArus = (data) => {
  return client("download/arus-kas", { body: data, method: "POST" });
};

export const postKategoriArus = (id, data) => {
  return client(`kategori-rencana-arus/${id}`, { body: data, method: "POST" });
};

export const putKategoriArus = (id, data) => {
  return client(`kategori-rencana-arus/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriArus = (id) => {
  return client(`kategori-rencana-arus/${id}`, { method: "DELETE" });
};

export const postAktivitas = (data) => {
  return client("rencana-arus", { body: data, method: "POST" });
};

export const putAktivitas = (id, data) => {
  return client(`rencana-arus/${id}`, { body: data, method: "PUT" });
};

export const deleteAktivitas = (id) => {
  return client(`rencana-arus/${id}`, { method: "DELETE" });
};

export const postTipeAkun = (id, data) => {
  return client(`rencana-tipe-akun/${id}`, { body: data, method: "POST" });
};

export const putTipeAkun = (id, data) => {
  return client(`rencana-tipe-akun/${id}`, { body: data, method: "PUT" });
};

export const deleteTipeAkun = (id) => {
  return client(`rencana-tipe-akun/${id}`, { method: "DELETE" });
};

export const postRumusKenaikan = (id, data) => {
  return client(`rencana-rumus-kenaikan/${id}`, { body: data, method: "POST" });
};

export const putRumusKenaikan = (id, data) => {
  return client(`rencana-rumus-kenaikan/${id}`, { body: data, method: "PUT" });
};

export const postRumusKasAwal = (id, data) => {
  return client(`rencana-rumus-kas-awal/${id}`, { body: data, method: "POST" });
};

export const putRumusKasAwal = (id, data) => {
  return client(`rencana-rumus-kas-awal/${id}`, { body: data, method: "PUT" });
};

export const postRumusKasAkhir = (id, data) => {
  return client(`rencana-rumus-kas-akhir/${id}`, {
    body: data,
    method: "POST",
  });
};

export const putRumusKasAkhir = (id, data) => {
  return client(`rencana-rumus-kas-akhir/${id}`, { body: data, method: "PUT" });
};
