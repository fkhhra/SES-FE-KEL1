import client, { download } from "./ApiClient";

export const getJadwalUjian = (params) => {
  return client("jadwal-ujian", { params });
};

export const getDetailJadwalUjian = (id, params) => {
  return client(`jadwal-ujian/${id}`, { params });
};

export const postJadwalUjian = (body) => {
  return client("jadwal-ujian", {
    method: "POST",
    body,
  });
};

export const downloadJadwalUjian = (body) => {
  return download("jadwal-ujian/download-hasil", {
    method: "POST",
    body,
  });
};

export const downloadSemuaJadwalUjian = (body) => {
  return download("jadwal-ujian/download-semua-hasil", {
    method: "POST",
    body,
  });
};

export const downloadBeritaAcaraUjian = (body) => {
  return download("ujian/download-absen", {
    method: "POST",
    body,
  });
};

export const downloadJawabanJadwalUjian = (body, id) => {
  return download(`download-hasil-ujian-2/${id}`, {
    method: "POST",
    body,
  });
};
export const downloadJawabanJadwalSemuaUjian = (body, id) => {
  return download(`download-hasil-semua-ujian-2/${id}`, {
    method: "POST",
    body,
  });
};

export const editJadwalUjian = (id, body) => {
  return client(`jadwal-ujian/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteJadwalUjian = (id) => {
  return client(`jadwal-ujian/${id}`, {
    method: "DELETE",
  });
};
