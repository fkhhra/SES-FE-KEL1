import client from "./ApiClient";

export const postInformasiJalur = (body) => {
  return client("informasi-jalur-ppdb", {
    method: "POST",
    body,
  });
};

export const putInformasiJalur = (id, body) => {
  return client(`informasi-jalur-ppdb/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteInformasiJalur = (id) => {
  return client(`informasi-jalur-ppdb/${id}`, {
    method: "DELETE",
  });
};
