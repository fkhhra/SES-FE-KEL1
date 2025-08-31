import client from "./ApiClient";

export const getAlumni = (params) => {
  return client("alumniv2", { params });
};

export const getDetailAlumni = (id, params) => {
  return client(`alumniv2/${id}`, { params });
};

export const editAlumni = (id, payload) => {
  return client(`alumniv2/${id}`, {
    method: "PUT",
    body: payload,
  });
};
``;
export const deleteAlumni = (id) => {
  return client(`alumni/${id}`, {
    method: "DELETE",
  });
};
