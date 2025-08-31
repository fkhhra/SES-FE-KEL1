import client from "./ApiClient";

export const getLaba = (params) => {
  return client("laba-rugi", { params });
};

export const downloadLaba = (data) => {
  return client("download/laba-rugi", { method: "POST", body: data });
};

export const postRumus = (data) => {
  return client("rumus-laba", { body: data, method: "POST" });
};

export const putRumus = (id, data) => {
  return client(`rumus-laba/${id}`, { body: data, method: "PUT" });
};

export const deleteRumus = (id) => {
  return client(`rumus-laba/${id}`, { method: "DELETE" });
};

export const postKategoriLaba = (data) => {
  return client("kategori-laba", { body: data, method: "POST" });
};

export const putKategoriLaba = (id, data) => {
  return client(`kategori-laba/${id}`, { body: data, method: "PUT" });
};

export const deleteKategoriLaba = (id) => {
  return client(`kategori-laba/${id}`, { method: "DELETE" });
};

export const postAkunLaba = (data) => {
  return client("akun-laba", { body: data, method: "POST" });
};

export const putAkunLaba = (id, data) => {
  return client(`akun-laba/${id}`, { body: data, method: "PUT" });
};

export const deleteAkunLaba = (id) => {
  return client(`akun-laba/${id}`, { method: "DELETE" });
};

export const putTemplateLaba = (id, data) => {
  return client(`laba-template/${id}`, { body: data, method: "PUT" });
};
