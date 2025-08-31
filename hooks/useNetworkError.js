import create from "zustand";

const setErrorMessage = (set, message) => {
  return set({ error: { message } });
};

const _networkErrorHandler = (error, set) => {
  const { status } = error?.response || {};

  switch (status) {
    case 401:
      // setErrorMessage(set, "Sesi Anda sudah habis. Silahkan login kembali");
      break;
    case 403:
      setErrorMessage(set, "Anda tidak memiliki hak akses pada laman ini");
      break;
    case 500:
      setErrorMessage(
        set,
        "Apakah anda menemukan kendala? Silahkan hubungi Technical Support di bawah kanan aplikasi"
      );
      break;
    case 422:
      setErrorMessage(set, "Pastikan semua form terinput");
      break;
  }

  return Promise.reject(error);
};

const useNetworkError = create((set) => ({
  error: null,
  resetError: () => set({ error: null }),
  networkErrorHandler: (error) => _networkErrorHandler(error, set),
}));

export default useNetworkError;
