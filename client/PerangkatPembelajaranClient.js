import ppClient from "./PPApiClient";

export const getTingkat = (params) => {
  return ppClient("tingkat", { params });
};

export const showTingkat = (id) => {
  return ppClient("tingkat/" + id);
};

export const showTingkatFolder = (id) => {
  return ppClient("tingkat-folder/" + id);
};

export const storeFolderContent = (payload) => {
  return ppClient("folder-content", { body: payload, method: "POST" });
};
