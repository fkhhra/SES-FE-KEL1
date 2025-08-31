import create from "zustand";

const useUserSiswa = create((set) => ({
  userSiswa: {},
  setUserSiswa: (data) => set({ userSiswa: data }),
}));

export default useUserSiswa;
