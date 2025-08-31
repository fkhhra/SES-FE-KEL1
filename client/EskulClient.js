const { default: client } = require("./ApiClient");

export const getEskul = (params) => {
  return client("eskul", { params });
};

export const detailEskul = (id, params) => {
  return client(`eskul/${id}`, {
    method: "GET",
    body: params,
  });
};

export const postEskul = (payload) => {
  return client("eskul", {
    method: "POST",
    body: payload,
  });
};

export const updateEskul = (id, payload) => {
  return client(`eskul/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteEskul = (id) => {
  return client(`eskul/${id}`, {
    method: "DELETE",
  });
};

export const postAnggotaEskul = (id, body) => {
  return client(`anggota-eskul/${id}`, {
    method: "POST",
    body,
  });
};

export const deleteAnggotaEskul = (id) => {
  return client(`anggota-eskul/${id}`, {
    method: "DELETE",
  });
};
