import client from "./ApiClient";

export const getJalurPpdb = () => {
  return client("jalur-ppdb");
};

export const postJalurPpdb = (body) => {
  return client("jalur-ppdb", {
    method: "POST",
    body,
  });
};

export const putJalurPpdb = (id, body) => {
  return client(`jalur-ppdb/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteJalurPpdb = (id) => {
  return client(`jalur-ppdb/${id}`, {
    method: "DELETE",
  });
};

export const detailJalurPpdb = (id) => {
  return client(`jalur-ppdb/${id}`, {});
};
