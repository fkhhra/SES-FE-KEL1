import client from "./ApiClient";
import { downloadURL } from "./clientAxios";

export const getUjian = (params) => {
  return client("ujian", { params });
};

export const getUjianSampah = (params) => {
  return client("ujian-sampah", { params });
};

export const getDetailUjian = (id, params) => {
  return client(`ujian/${id}`, { params });
};

export const getHasilUjian = (id, params) => {
  return client(`nilai-pg/${id}`, { params });
};

export const postUjian = (body) => {
  return client("ujian", {
    method: "POST",
    body,
  });
};

export const restoreUjian = (id, body) => {
  return client(`ujian-sampah/${id}`, {
    method: "PUT",
    body,
  });
};

export const downloadKartuSoal = (id, tipe = "pg") => {
  if (tipe == "pg") {
    return client(
      `${downloadURL}/ujian/download-kartu-pg/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
  if (tipe == "esai") {
    return client(
      `${downloadURL}/ujian/download-kartu-esai/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
  if (tipe == "kisi") {
    return client(
      `${downloadURL}/ujian/download-kartu-kisi-kisi/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
  if (tipe == "naskah") {
    return client(
      `${downloadURL}/ujian/download-kartu-naskah/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
  if (tipe == "rumusan") {
    return client(
      `${downloadURL}/ujian/download-kartu-rumusan/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
  if (tipe == "template") {
    return client(
      `${downloadURL}/ujian/download-kartu-template/${id}`,
      {
        method: "POST",
      },
      1
    );
  }
};

export const editUjian = (id, body) => {
  return client(`ujian/${id}`, {
    method: "PUT",
    body,
  });
};

export const deleteUjian = (id) => {
  return client(`ujian/${id}`, {
    method: "DELETE",
  });
};

export const updateNilaiPeserta = (id) => {
  return client(`update-nilai/${id}`, {
    method: "PUT",
  });
};

export const updateNilaiPesertaJadwal = (body) => {
  return client("jadwal-ujian/update-nilai", { body, method: "POST" });
};

export const postPeringatanUjian = (body) => {
  return client("peringatan-ujian", {
    method: "POST",
    body,
  });
};
export const editPeringatanUjian = (id, body) => {
  return client(`peringatan-ujian/${id}`, {
    method: "PUT",
    body,
  });
};

export const postJawabanPeringatanUjian = (body) => {
  return client("jawaban-peringatan-ujian", {
    method: "POST",
    body,
  });
};
export const editJawabanPeringatanUjian = (id, body) => {
  return client(`jawaban-peringatan-ujian/${id}`, {
    method: "PUT",
    body,
  });
};

export const postDibacaPeringatanUjian = (id, body) => {
  return client(`dibaca-peringatan-ujian/${id}`, {
    method: "POST",
    body,
  });
};
export const postDibacaPeringatanUjianGuru = (id, body) => {
  return client(`dibaca-peringatan-ujian-guru/${id}`, {
    method: "POST",
    body,
  });
};
