import client from "./ApiClient";

// PRAKERIN
export const getPrakerin = (params) => {
  return client("prakerin", { params });
};

export const getTambahPrakerin = (params) => {
  return client("tambah-prakerin", { params });
};


export const getDetailPrakerin = (id, params) => {
  return client(`prakerin/${id}`, { params });
};

export const postPrakerin = (body) => {
  return client("prakerin", { method: "POST", body });
};

export const putPrakerin = (id, body) => {
  return client(`prakerin/${id}`, { method: "PUT", body });
};

export const deletePrakerin = (id) => {
  return client(`prakerin/${id}`, { method: "DELETE" });
};

// UKK
export const getUkkSiswa = (params) => {
  return client("ukk-siswa", { params });
};

export const getDetailUkk = (id, params) => {
  return client(`ukk-siswa/${id}`, { params });
};

export const putUkkSiswa = (id, body) => {
  return client(`ukk-siswa/${id}`, { method: "PUT", body });
};

export const deleteUkkSiswa = (id) => {
  return client(`ukk-siswa/${id}`, { method: "DELETE" });
};
