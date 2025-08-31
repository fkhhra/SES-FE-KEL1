import client from "./ApiClient";

export const getSuratKeputusan = (params) => {
  return client("surat-keputusan", { params });
};

export const getListGuruSuratKeputusan = (params) => {
  return client("guru-surat-keputusan", { params });
};

export const postSuratKeputusan = (payload) => {
  return client("surat-keputusan", {
    method: "POST",
    body: payload,
  });
};

export const updateSuratKeputusan = (id, payload) => {
  return client(`surat-keputusan/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteSuratKeputusan = (id) => {
  return client(`surat-keputusan/${id}`, {
    method: "DELETE",
  });
};