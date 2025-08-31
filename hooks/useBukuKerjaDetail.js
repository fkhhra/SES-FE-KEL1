import create from "zustand";

const useBukuKerjaDetail = create((set) => ({
  bukuKerjaDetailData: "",
  refetchData: false,
  additionalParams: {},
  refetchBukuKerjaDetail: (refetch, params) => set({ refetchData: refetch, additionalParams: params }),
  setBukuKerjaDetailData: (data) => set({ bukuKerjaDetailData: data }),
}));

export default useBukuKerjaDetail;
