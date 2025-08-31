import client, { download } from "./ApiClient";

export const getMataPelajaran = (params) => {
  return client("mata-pelajaran", { params });
};

export const postMataPelajaran = (body) => {
  return client("mata-pelajaran", {
    body,
    method: "POST",
  });
};

export const downloadMataPelajaran = (params) => {
  return download("mata-pelajaran/download", {
    method: "POST",
    params,
    // body: payload,
  });
};

export const putMataPelajaran = (id, body) => {
  return client(`mata-pelajaran/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteMataPelajaran = (id) => {
  return client(`mata-pelajaran/${id}`, {
    method: "DELETE",
  });
};
