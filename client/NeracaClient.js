import client from "./ApiClient";

export const getNeraca = (params) => {
  return client("neraca-keuangan", { params });
};

export const downloadNeraca = (data) => {
  return client("download/neraca", { method: "POST", body: data });
};

export const postKategoriNeraca = (data) => {
  return client("kategori-neraca", { body: data, method: "POST" });
};

export const putKategoriNeraca = (id, data) => {
  return client(`kategori-neraca/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriNeraca = (id) => {
  return client(`kategori-neraca/${id}`, { method: "DELETE" });
};

export const postAkunNeraca = (data) => {
  return client("akun-neraca", { body: data, method: "POST" });
};

export const putAkunNeraca = (id, data) => {
  return client(`akun-neraca/${id}`, { body: data, method: "PUT" });
};

export const deleteAkunNeraca = (id) => {
  return client(`akun-neraca/${id}`, { method: "DELETE" });
};
