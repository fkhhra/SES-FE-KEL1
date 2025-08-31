import client from "./ApiClient";

export const loginPPDB = (payload) => {
  return client("ppdb/login", {
    method: "POST",
    body: payload,
  });
};

export const logout = (payload) => {
  return client("logout", {
    method: "POST",
    body: payload,
  });
}

export const daftarPPDB = (payload) => {
  return client("ppdb/daftar", {
    method: "POST",
    body: payload,
  });
};

export const getProfilUser = () => {
  return client("profil-user");
};

export const detailProfilUser = (id) => {
  return client(`profil-user/${id}`);
};

export const postDetailProfilUser = (id, payload) => {
  return client(`profil-user/${id}`, {
    method: "POST",
    body: payload,
  });
};

export const postProfilUser = (payload) => {
  return client("profil-user", {
    method: "POST",
    body: payload,
  });
};

export const postProfilUserAdmin = (payload) => {
  return client("profil-user-admin", {
    method: "POST",
    body: payload,
  });
};
