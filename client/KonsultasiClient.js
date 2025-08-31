import client, { download } from "./ApiClient";

export const postKonsultasi = (body) => {
  return client("konsultasi", {
    body,
    method: "POST",
  });
};

export const getKonsultasi = (params) => {
  return client("konsultasi", {
    method: "GET",
    params,
  });
};

export const getDetailKonsultasi = (id) => {
  return client(`konsultasi/${id}`, {
    method: "GET",
  });
};

export const postJadwalKonsultasi = (body, id) => {
  return client(`konsultasi/${id}/jadwal`, {
    method: "POST",
    body,
  });
};

export const rekapKonsultasi = () => {
  return download(`konsultasi/download`, {
    method: "POST",
  });
};

export const selesaiKonsultasi = (id, body) => {
  return client(`konsultasi/${id}/selesai`, {
    method: "POST",
    body,
  });
};
