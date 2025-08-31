import client, { download } from "./ApiClient";

export const getAnalisisSoal = (params) => {
  return client("analisis-soal", { params });
};

export const getAnalisisSoalDetail = (id, params) => {
  return client(`analisis-soal/${id}`, { params });
};

export const downloadAnalisisSoal = (id) => {
  return download(`download/analisis-soal/${id}`, {
    method: "POST",
  });
};

export const postTemplateKesukaran = (payload) => {
  return client("template-kesukaran", {
    method: "POST",
    body: payload,
  });
};

export const editTemplateKesukaran = (id, payload) => {
  return client(`template-kesukaran/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteTemplateKesukaran = (id) => {
  return client(`template-kesukaran/${id}`, {
    method: "DELETE",
  });
};
