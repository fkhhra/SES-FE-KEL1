import client from "./ApiClient";

export const getRekeningSekolah = (params) => {
  return client("rek-sekolah", { params });
};

export const postRekeningSekolah = (body) => {
  return client(`rek-sekolah`, {
    method: "POST",
    body,
  });
};

export const downloadRekening = (body) => {
  return client(`rek-sekolah/download`, {
    method: "POST",
    body,
  });
};
export const downloadRekeningV2 = (body) => {
  return client(`mutasi/download-rek-mutasi`, {
    method: "POST",
    body,
  });
};

export const updateRekeningSekolah = (body, id) => {
  return client(`rek-sekolah/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteRekeningSekolah = (id) => {
  return client(`rek-sekolah/${id}`, {
    method: "DELETE",
  });
};
