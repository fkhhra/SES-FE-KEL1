import client from "./ApiClient";

export const getKalenderData = (params) => {
  return client("kalender", {
    method: "GET",
    params,
  });
};

export const postKalenderLabel = (body) => {
  return client("kalender/label", {
    body,
    method: "POST",
  });
};

export const updateKalenderLabel = (body, id) => {
  return client(`kalender/label/${id}`, {
    body,
    method: "PUT",
  });
};

export const deleteKalenderLabel = (id) => {
  return client(`kalender/label/${id}`, {
    method: "DELETE",
  });
};

export const postKalenderPendidikan = (body) => {
  return client("kalender/pendidikan", {
    body,
    method: "POST",
  });
};

export const postKalenderKegiatan = (body) => {
  return client("kalender/kegiatan", {
    body,
    method: "POST",
  });
};

export const putKalenderPendidikan = (id, body) => {
  return client(`kalender/pendidikan/${id}`, {
    body,
    method: "PUT",
  });
};

export const putKalenderKegiatan = (id, body) => {
  return client(`kalender/kegiatan/${id}`, {
    body,
    method: "PUT",
  });
};

export const deleteDetailKalenderPendidikan = (id) => {
  return client(`kalender/pendidikan/${id}`, {
    method: "DELETE",
  });
};

export const deleteDetailKalenderKegiatan = (id) => {
  return client(`kalender/kegiatan/${id}`, {
    method: "DELETE",
  });
};

export const getDetailKalenderPendidikan = (id) => {
  return client(`kalender/pendidikan/${id}`, {
    method: "GET",
  });
};

export const getDetailKalenderKegiatan = (id) => {
  return client(`kalender/kegiatan/${id}`, {
    method: "GET",
  });
};
