import { momentPackage } from "../utilities/HelperUtils";
import client, { download } from "./ApiClient";

export const getRombel = (params) => {
  return client(`rombel`, { params });
};

export const getDetailRombel = (id, params) => {
  return client(`rombel/${id}`, { params });
};

export const getRombelEresource = (params) => {
  return client(`rombel-eresource`, { params });
};

export const getLowonganIndustri = (id, params) => {
  return client(`industri/${id}`, { params });
};

export const getAnggotaRombel = (params) => {
  return client(`anggota-rombel`, { params });
};

export const postRombel = (body) => {
  return client("rombel", {
    method: "POST",
    body,
  });
};

export const downloadRombel = (body) => {
  return download("rombel/download-rombel", {
    method: "POST",
    body,
  });
};

export const deleteRombel = (id) => {
  return client(`rombel/${id}`, {
    method: "DELETE",
  });
};

export const putRombel = (id, body) => {
  return client(`rombel/${id}`, {
    method: "PUT",
    body,
  });
};

export const downloadAnalisis = (id) => {
  return download(`rombel-download/${id}/download-analisis-nilai`, {
    method: "POST",
  });
};

export const downloadAnalisisSikap = (id) => {
  return download(`download/sikap-siswa`, {
    method: "POST",
    body: { jadwalMengajarId: id },
  });
};

export const downloadLegder = (id, body) => {
  return download(`download/ledger-nilai/${id}`, {
    method: "POST",
    body,
  });
};

export const downloadLegderYadika = (id, body) => {
  return download(`download/ledger-nilai-yadika/${id}`, {
    method: "POST",
    body,
  });
};

export const downloadLegderYadikaTahun = (id, body) => {
  return download(`download/ledger-nilai-yadika-tahun/${id}`, {
    method: "POST",
    body,
  });
};
