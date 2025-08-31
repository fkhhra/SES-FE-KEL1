import client from "./ApiClient";

export const postInformasiGelombang = (body) => {
  return client("informasi-gelombang", {
    method: "POST",
    body,
  });
};

export const putInformasiGelombang = (id, body) => {
  return client(`informasi-gelombang/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteInformasiGelombang = (id) => {
  return client(`informasi-gelombang/${id}`, {
    method: "DELETE",
  });
};
