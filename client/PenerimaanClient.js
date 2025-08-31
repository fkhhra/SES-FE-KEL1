import client from "./ApiClient";

export const getPenerimaanPklSiswa = (id, params) => {
  return client(`penerimaan-siswa/${id}`, { params });
};

export const getPenerimaanPkl31 = (params) => {
  return client(`pkl/penerimaan-31`, { params });
};

export const getTambahPenerimaanPkl31 = (params) => {
  return client(`tambah-penerimaan-siswa-31`, { params });
};

export const postPenerimaanPklSiswa = (body) => {
  return client(`penerimaan-siswa`, { method: "POST", body });
};

export const postPenerimaanPkl31 = (body) => {
  return client(`penerimaan-siswa-31`, { method: "POST", body });
};

export const putPenerimaanPklSiswa = (id, body) => {
  return client(`penerimaan-siswa/${id}`, { method: "PUT", body });
};

export const putPenerimaanPkl31 = (body) => {
  return client(`penerimaan-siswa-31`, { method: "PUT", body });
};

export const putNilaiPenerimaan = (body) => {
  return client(`rapor/pkl-31`, { method: "PUT", body });
};

export const deletePenerimaanPklSiswa = (id) => {
  return client(`penerimaan-siswa/${id}`, { method: "DELETE" });
};

export const getPenerimaanPkl = (params) => {
  return client(`pkl/penerimaan`, { params });
};
