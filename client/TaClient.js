import client from "./ApiClient";

export const getTa = (params) => {
  return client("ta", { params });
};

export const postTa = (payload) => {
  return client("ta", {
    method: "POST",
    body: payload,
  });
};

export const editTa = (id, payload) => {
  return client(`ta/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteTa = (id) => {
  return client(`ta/${id}`, {
    method: "DELETE",
  });
};

export const postNaikKelasJam = (payload) => {
  return client("naik-kelas-jam", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasMapel = (payload) => {
  return client("naik-kelas-mapel", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasRombel = (payload) => {
  return client("naik-kelas-rombel", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasJadwal = (payload) => {
  return client("naik-kelas-jadwal", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasJam1 = (payload) => {
  return client("naik-kelas1-jam", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasMapel1 = (payload) => {
  return client("naik-kelas1-mapel", {
    method: "POST",
    body: payload,
  });
};

export const postNaikKelasRombel1 = (payload) => {
  return client("naik-kelas1-rombel", {
    method: "POST",
    body: payload,
  });
};

// export const postNaikKelasJadwal1 = (payload) => {
//   return client("naik-kelas1-jadwal1", {
//     method: "POST",
//     body: payload,
//   });
// };
