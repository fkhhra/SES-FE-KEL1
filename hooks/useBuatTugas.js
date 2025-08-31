import create from "zustand";
import moment from "moment"

const initialState = {
  judul: "",
  instruksi: "",
  tanggalPembagian: "",
  tanggalAkhir: "",
  waktuPembagian: "",
  dikumpulkan: false,
  dikkm: false,
  showNilai: true,
  dijadwalkan: false,
  tanggalPengumpulan: "",
  waktuPengumpulan: "",
  lampiran: [],
  link: [],
  kkm: 0,
  gmeet: "",
  draft: 0,
  deskripsi: "",
  hariIni: moment().format("YYYY-MM-DD"),
  bab: "",
  materi: [],
  listRombel: [],
  listAnggota: [],
  soal: []
}

const _changeStateBuatTugas = (key, value, state) => {

  if (typeof(key) === "object") {
    return {
      stateBuatTugas: { ...state.stateBuatTugas, ...key } // set data with object in paramater key
    }
  }

  return {
    stateBuatTugas: { ...state.stateBuatTugas, [key]: value }
  }
}

const useBuatTugas = create((set) => ({
  stateBuatTugas: initialState,
  changeStateBuatTugas: (key, value) => set(state => _changeStateBuatTugas(key, value, state)),
  resetStateBuatTugas: () => set({ stateBuatTugas: initialState }),

  isDuplikatTugas: false,
  setIsDuplikatTugas: value => set({ isDuplikatTugas: value })
}));

export default useBuatTugas;
