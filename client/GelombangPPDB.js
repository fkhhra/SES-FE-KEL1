import client, { download } from "./ApiClient";

// export const getGelombangPPDB = (params) => {
//   return client("gelombang-ppdb", { params });
// };


export const getGelombangPPDB = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString(); // Konversi params jadi query string
  return client(`gelombang-ppdb?${queryParams}`);
};

export const detailGelombangPPDB = (id) => {
  return client(`gelombang-ppdb/${id}`);
};

export const postGelombangPPDB = (payload) => {
  return client("gelombang-ppdb", {
    method: "POST",
    body: payload,
  });
};

// export const downloadGelombangPPDB = (payload) => {
//   return download("ppdb/downloadgelombang", {
//     method: "POST",
//     body: payload,
//   });
// };

export const editGelombangPPDB = (id, payload) => {
  return client(`gelombang-ppdb/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const downloadGelombangPPDB = (id, payload) => {
  return download(`download-gelombang-ppdb/${id}`, {
    method: "POST",
    body: payload,
  });
};

export const downloadGelombangPPDBMtsn = (id, payload) => {
  return download(`download-gelombang-ppdb-mtsn/${id}`, {
    method: "POST",
    body: payload,
  });
};

export const deleteGelombangPPDB = (id) => {
  return client(`gelombang-ppdb/${id}`, {
    method: "DELETE",
  });
};
