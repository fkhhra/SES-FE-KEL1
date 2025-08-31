import { momentPackage } from "./HelperUtils";

export const getStatusPembayaran = (pembayaran) => {
  if (pembayaran?.status === "belum lunas") {
    if (
      pembayaran?.ditangguhkan &&
      momentPackage(pembayaran?.ditangguhkan).toDate() >
        momentPackage().toDate()
    ) {
      return (
        <div className="jadwal-ujian-label label-ss bg-soft-secondary color-secondary fw-bold text-white rounded-pill fs-12-ss me-2">
          Ditangguhkan
        </div>
      );
    } else {
      return (
        <div className="jadwal-ujian-label label-ss bg-soft-secondary color-secondary fw-bold text-white rounded-pill fs-12-ss me-2">
          Belum Lunas
        </div>
      );
    }
  } else {
    return (
      <div className="jadwal-ujian-label label-ss bg-soft-success color-success fw-bold text-white rounded-pill fs-12-ss me-2">
        Sudah Lunas
      </div>
    );
  }
};

export const textStatusPembayaran = (siswa, totalSudahBayar, nominal) => {
  if (momentPackage(siswa?.ditangguhkan).toDate() > momentPackage().toDate()) {
    return 3;
  } else if (totalSudahBayar < nominal) {
    if (siswa?.riwayat?.some((item) => !item.dikonfirmasi)) {
      return 0;
    } else {
      return 2;
    }
  } else {
    if (siswa?.riwayat?.some((item) => !item.dikonfirmasi)) {
      return 0;
    } else {
      return 1;
    }
  }
};
