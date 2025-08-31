import client from "./ApiClient";

export const getRpp = (params) => {
  return client("rpp", { params });
};

export const getRppGuru = (id, params) => {
  return client(`rpp/guru/${id}`, { params });
};

export const getDetailRpp = (id, params) => {
  return client(`rpp/${id}`, { params });
};

export const postRpp = (payload) => {
  return client("rpp", {
    method: "POST",
    body: payload,
  });
};

export const editRpp = (id, payload) => {
  return client(`rpp/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteRpp = (id) => {
  return client(`rpp/${id}`, {
    method: "DELETE",
  });
};
