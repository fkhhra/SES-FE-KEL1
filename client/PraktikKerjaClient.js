const { default: client } = require("./ApiClient");

export const getPraktikKerja = (params) => {
  return client("praktik-kerja", { params });
};

export const postPraktikKerja = (payload) => {
  return client("praktik-kerja", { method: "POST", body: payload });
};

export const putPraktikKerja = (payload, id) => {
  return client(`praktik-kerja/${id}`, { method: "PUT", body: payload });
};

export const deletePraktikKerja = (id) => {
  return client(`praktik-kerja/${id}`, { method: "DELETE" });
};
