import client, { download } from "./ApiClient";

export const getAbsen = (params) => {
  return client("absen", { params });
};

export const getAbsenData = (params) => {
  return client("absen-data", { params });
};

export const getDetailAbsen = (id, params) => {
  return client(`absen/${id}`, { params });
};

export const detailAbsen = (params) => {
  return client("absen/me", { params });
};

export const postAbsen = (payload) => {
  return client("absen", {
    method: "POST",
    body: payload,
  });
};

export const downloadAbsen = (payload) => {
  return download("absen/download-absen", {
    method: "POST",
    body: payload,
  });
};

export const downloadAbsenSiswa = (payload) => {
  return download("absen-siswa/rekapdownload", {
    method: "POST",
    body: payload,
  });
};

export const downloadAbsenSiswaTanggal = (payload) => {
  return download("absen-siswa-tanggal/rekapdownload", {
    method: "POST",
    body: payload,
  });
};

export const downloadAbsenSeluruhSiswa = (payload) => {
  return download("absen-seluruh-siswa/rekapdownload", {
    method: "POST",
    body: payload,
  });
};

export const downloadAbsenRombel = (payload) => {
  return download("absen/rombel", {
    method: "POST",
    body: payload,
  });
};

export const editAbsen = (id, payload) => {
  return client(`absen/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteAbsen = (id) => {
  return client(`absen/${id}`, {
    method: "DELETE",
  });
};
