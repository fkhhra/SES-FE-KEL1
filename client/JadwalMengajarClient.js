import client, { download } from "./ApiClient";
import { downloadURL } from "./clientAxios";

export const getJadwalMengajar = (params) => {
  return client("jadwal-mengajar", { params });
};

export const getAllJadwalMengajar = (params) => {
  return client("jadwal-mengajar-all", { params });
};

export const getJadwalMengajarPertemuan = (params) => {
  return client("jadwal-mengajar/pertemuan", { params });
};

export const getJadwalMengajarPertemuanV2 = (params) => {
  return client("jadwal-mengajar/pertemuan-v2", { params });
};

export const editJadwalMengajar = (id, body) => {
  return client(`jadwal-mengajar/${id}`, {
    method: "PUT",
    body,
  });
};

export const downloadMonev = (body) => {
  return download(`download/monev`, {
    method: "POST",
    body,
  });
};

export const downloadRekapJadwal = (body) => {
  // return download(`download/jadwal`, {
  //   method: "POST",
  //   body,
  // });
  return client(
    `${downloadURL}/download/jadwal`,
    {
      method: "POST",
      body,
    },
    1
  );
};
export const downloadImportJadwal = (body) => {
  // return download(`download/import-jadwal`, {
  //   method: "POST",
  //   body,
  // });
  return client(
    `${downloadURL}/download/import-jadwal`,
    {
      method: "POST",
      body,
    },
    1
  );
};
