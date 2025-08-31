import client, { download } from "./ApiClient";

export const gettJadwalPPDB = (params) => {
  return client("jadwal-ppdb", {
    params,
  });
};

export const postJadwalPPDB = (body) => {
  return client("jadwal-ppdb", {
    method: "POST",
    body,
  });
};

export const putJadwalPPDB = (id, body) => {
  return client(`jadwal-ppdb/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteJadwalPPDB = (id) => {
  return client(`jadwal-ppdb/${id}`, {
    method: "DELETE",
  });
};

export const detailJadwalPPDB = (id, params) => {
  return client(`jadwal-ppdb/${id}`, {
    params,
  });
};

export const detailJadwalPPDBSS = (id, params) => {
  return client(`jadwal-ppdb-ss/${id}`, {
    params,
  });
};

export const downloadNilaiJadwalPPDB = (id, params) => {
  return client(`download-nilai-jadwal-ppdb/${id}`, {
    method: "POST",
  });
};

export const downloadJadwalUjianSS = (id) => {
  return download(`download-nilai-jadwal-ppdb-ss/${id}`, {
    method: "POST",
  });
};
