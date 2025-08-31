import client from "./ApiClient";

export const getUser = (params) => {
  return client("user", { params });
};

export const getDetailUser = (id, params) => {
  return client(`user/${id}`, { params });
};

export const resetPassword = (body) => {
  return client("reset-password", { method: "POST", body });
};

export const resetPasswordRole = (body) => {
  return client("reset-password-role", { method: "POST", body });
};

export const hapusAkunRole = (body) => {
  return client("hapus-akun-role", { method: "POST", body });
};

export const requestResetPassword = (body) => {
  return client("reset-password-request", { method: "POST", body });
};

export const sendActivationCode = (body) => {
  return client("resend", { method: "POST", body });
};

export const activate = (body) => {
  return client("aktivasi", { method: "POST", body });
};

export const gantiTaUser = (body) => {
  return client("ganti-ta-user", { method: "PUT", body });
};
