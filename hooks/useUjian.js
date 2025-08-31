import create from "zustand";

const useUjian = create((set) => ({
  detailUjianData: {},
  setDetailUjianData: (data) => set({ detailUjianData: data }),

  soalMenjodohkan: [{ id: 1, soal: "", jawaban: "", pembahasan: "", poin: parseInt() }],
  
  setSoalMenjodohkan: (data) =>
    set(() => {
      const totalPoin = data.reduce((acc, item) => acc + (Number(item.poin) || 0), 0);
      return { soalMenjodohkan: data, totalPoin };
    }),

  pilihanMenjodohkan: [0],
  setPilihanMenjodohkan: (data) => set({ pilihanMenjodohkan: data }),

  pilihanJawabanPG: [0],
  setPilihanJawabanPG: (data) => set({ pilihanJawabanPG: data }),

  rubrikKj: [
    {
      poin: "",
      indikator: "",
      id: Math.random(),
    },
  ],
  setRubrikKj: (data) => set({ rubrikKj: data }),
}));

export default useUjian;
