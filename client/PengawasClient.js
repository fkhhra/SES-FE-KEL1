import client from "./ApiClient";

export const getDashboardPengawas = (params) => {
  return client("dashboard/pengawas", { params });
};
