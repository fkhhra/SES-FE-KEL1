import client from "./ApiClient";

export const getLedgerNilai = (params) => {
  return client(`ledger-nilai`, { params });
};
