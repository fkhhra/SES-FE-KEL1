import client from "./ApiClient";

export const getBroadcast = (params) => {
  return client(`broadcast`, { params });
};

export const postBroadcast = (data) => {
  return client(`broadcast`, { method: "POST", body: data });
};

export const putBroadcast = (id, data) => {
  return client(`broadcast/${id}`, { method: "PUT", body: data });
};

export const deleteBroadcast = (id) => {
  return client(`broadcast/${id}`, { method: "DELETE" });
};

export const getKepada = (params) => {
  return client(`broadcast-post`, { params });
};
