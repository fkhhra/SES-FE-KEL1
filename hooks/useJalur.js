import create from "zustand";

export const useJalur = create((set) => ({
  jalurData: "",
  setJalurData: (data) => set({ jalurData: data }),
}));

export const useJalurId = create((set) => ({
  jalurId: "",
  setJalurId: (id) => set({ jalurId: id }),
}));