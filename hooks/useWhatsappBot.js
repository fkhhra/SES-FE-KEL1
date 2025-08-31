import create from "zustand";

const useWaBot = create((set) => ({
  waBot: {},
  setWaBot: (data) => set({ waBot: data }),
}));

export default useWaBot;
