import create from "zustand";

const useRencana = create((set) => ({
  rencana: "",
  setRencana: (data) => set({ rencana: data }),
}));

export default useRencana;
