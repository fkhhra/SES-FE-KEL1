import client, { download } from "./ApiClient";

export const getMutasi = (params) => {
  return client("mutasi", { params });
};

export const postMutasi = (body) => {
  return client("mutasi", {
    body,
    method: "POST",
  });
};

export const downloadMutasi = (body) => {
  return download("mutasi/download-rek-mutasi", {
    body,
    method: "POST",
  });
};

export const downloadMutasiAset = (body) => {
  return download("download/aset-aktif", {
    body,
    method: "POST",
  });
};

export const downloadNeraca = (body) => {
  return download("download/neraca", {
    body,
    method: "POST",
  });
};

export const editMutasi = (body, id) => {
  return client(`mutasi/${id}`, {
    body,
    method: "PUT",
  });
};

export const deleteMutasi = (id) => {
  return client(`mutasi/${id}`, {
    method: "DELETE",
  });
};

export const getMutasiV2 = (params) => {
  return client("v2/mutasi", { params });
};
export const detailMutasiV2 = (id) => {
  return client(`v2/mutasi/${id}`);
};

export const postMutasiV2 = (body) => {
  return client("v2/mutasi", {
    body,
    method: "POST",
  });
};

export const editMutasiV2 = (body, id) => {
  return client(`v2/mutasi/${id}`, {
    body,
    method: "PUT",
  });
};

export const aprovalTransaksi = (body, id) => {
  return client(`aproval-transaksi/${id}`, {
    body,
    method: "PUT",
  });
};

export const deleteMutasiV2 = (id) => {
  return client(`v2/mutasi/${id}`, {
    method: "DELETE",
  });
};
