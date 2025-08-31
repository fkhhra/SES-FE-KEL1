import client from "./ApiClient";

export const getBukuKerjaGuru = (params) => {
  return client("buku-kerja-guru", { params });
};

export const getBukuKerjaDetail = (params) => {
  return client("buku-kerja-detail", { params });
};

export const postBukuKerja = (body) => {
  return client("buku-kerja", { method: "POST", body });
};

export const editBukuKerja = (id, body) => {
  return client(`buku-kerja/${id}`, { method: "PUT", body });
};

export const deleteBukuKerja = (id) => {
  return client(`buku-kerja/${id}`, { method: "DELETE" });
};

export const getBukuKerjaKehadiran = (params) => {
  return client("buku-kerja-kehadiran", { params });
};

export const getBukuKerjaNilai = (id, params) => {
  return client(`buku-kerja-nilai/${id}`, { params });
};

export const getDetailRekapBukuKerjaNilai = (id, userId, params) => {
  return client(`buku-kerja-nilai/${id}/user/${userId}`, { params });
};

export const postBukuKerjaSoal = (body) => {
  return client("buku-kerja-soal", { method: "POST", body });
};

export const editBukuKerjaSoal = (id, body) => {
  return client(`buku-kerja-soal/${id}`, { method: "PUT", body });
};

export const getBukuKerjaDinas = (params) => {
  return client("dinas/buku-kerja", { params });
};

export const downloadBukuKerjaDinas = (params) => {
  return client("download/jadwal-dinas", { method: "POST", body: params });
};

export const downloadRekapKehadiran = (body) => {
  return client("absen-siswa/rekapdownload/dinas", { method: "POST", body: body });
}

export const downloadRekapNilaiSiswa = (body) => {
  return client("download/semua-rekap/nilai-siswa", { method: "POST", body: body });
}