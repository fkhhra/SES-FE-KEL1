import client from "./ApiClient";

export const getKeuanganSekolah = (params) => {
  return client("keuangan-sekolah", { params });
};

export const getKeuanganRencana = (id, params) => {
  return client(`rencana-keuangan-sekolah1/${id}`, { params });
};

export const putKeuanganSekolah = (body) => {
  return client("keuangan-sekolah", { method: "PUT", body });
};

export const postAkunSekolah = (body) => {
  return client("akun-sekolah", { method: "POST", body });
};

export const putAkunSekolah = (id, body) => {
  return client(`akun-sekolah/${id}`, { method: "PUT", body });
};

export const deleteAkunSekolah = (id) => {
  return client(`akun-sekolah/${id}`, { method: "DELETE" });
};

export const downloadAkun = (body) => {
  return client("download/akun", { method: "POST", body });
};

export const downloadJurnal = (body) => {
  return client("download/jurnal", { method: "POST", body });
};

export const downloadJurnalRencana = (id, body) => {
  return client("download/jurnal/" + id, { method: "POST", body });
};

export const downloadTransaksi = (body) => {
  return client("download/transaksi", { method: "POST", body });
};
export const downloadTransaksiRencana = (id, body) => {
  return client("download/transaksi/" + id, { method: "POST", body });
};

export const otomatisAkun = (params) => {
  return client(`otomatis-akun-keuangan`, { params });
};

export const otomatisLabaRugi = (params) => {
  return client(`otomatis-labarugi-keuangan`, { params });
};

export const otomatisNeraca = (params) => {
  return client(`otomatis-neraca-keuangan`, { params });
};

export const otomatisArusKas = (params) => {
  return client(`otomatis-aruskas-keuangan`, { params });
};

export const otomatisRencanaLabaRugi = (id, params) => {
  return client(`otomatis-labarugi-keuangan/${id}`, { params });
};

export const otomatisRencanaNeraca = (id, params) => {
  return client(`otomatis-neraca-keuangan/${id}`, { params });
};

export const otomatisRencanaArusKas = (id, params) => {
  return client(`otomatis-aruskas-keuangan/${id}`, { params });
};

export const getAkunTransaksi = (id, params) => {
  return client("akun-transaksi/" + id, { params });
};
