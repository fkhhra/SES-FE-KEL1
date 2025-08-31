import client from "./ApiClient";

export const getTunggakan = (params) => {
  return client("tunggakan", { params });
};

export const getTotalTunggakan = (params) => {
  return client("total-tunggakan", { params });
};
