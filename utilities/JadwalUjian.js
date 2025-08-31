import { momentPackage } from "./HelperUtils";

export const formatWaktuMulai = (peserta, jadwalUjianRef) => {
  if (
    jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai &&
    peserta?.pesertaUjian?.[0]?.id
  ) {
    return momentPackage(
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai
    ).format("HH:mm:ss");
  } else {
    return "-";
  }
};

export const getStatusPengerjaan = (jadwalUjian, jadwalUjianRef, peserta) => {
  if (
    ((momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") <
      momentPackage().format("YYYY-MM-DD HH:mm:ss") ||
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_selesai !=
        undefined) &&
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai !=
        undefined &&
      peserta?.pesertaUjian?.[0]?.id) ||
    (momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") <
      momentPackage().format("YYYY-MM-DD HH:mm:ss") &&
      peserta?.pesertaUjian?.[0]?.id)
  ) {
    return (
      <div className="mx-md-auto label-ss bg-soft-success color-success rounded-pill fs-12-ss fw-bold d-flex align-items-center justify-content-center">
        Selesai
      </div>
    );
  } else {
    if (
      momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") >=
        momentPackage().format("YYYY-MM-DD HH:mm:ss") &&
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai !=
        undefined &&
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_selesai ==
        undefined &&
      peserta?.pesertaUjian?.[0]?.id
    ) {
      return (
        <div className="mx-md-auto label-ss bg-light-primary color-primary rounded-pill fs-12-ss fw-bold d-flex align-items-center justify-content-center">
          Mengerjakan
        </div>
      );
    } else {
      return (
        <div className="mx-md-auto label-ss bg-soft-danger color-danger rounded-pill fs-12-ss fw-bold d-flex align-items-center justify-content-center">
          Belum Masuk
        </div>
      );
    }
  }
};

export const getKeluarTabSiswa = (peserta) => {
  return peserta?.warning;
};

const getStatusPengerjaanAngka = (jadwalUjian, jadwalUjianRef, peserta) => {
  if (
    (momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") <
      momentPackage().format("YYYY-MM-DD HH:mm:ss") ||
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_selesai !=
        undefined) &&
    jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai !=
      undefined &&
    peserta?.pesertaUjian?.[0]?.id
  ) {
    return 3;
  } else {
    if (
      momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") >=
        momentPackage().format("YYYY-MM-DD HH:mm:ss") &&
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai !=
        undefined &&
      jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_selesai ==
        undefined &&
      peserta?.pesertaUjian?.[0]?.id
    ) {
      return 2;
    } else {
      return 1;
    }
  }
};

export const tablePesertaData = (
  data,
  jadwalUjian,
  jadwalUjianRef,
  search,
  statusSort,
  sortKeluarTab,
  sortNilai
) => {
  console.log(data);
  return data
    ?.sort((a, b) => {
      const status1 =
        getStatusPengerjaanAngka(jadwalUjian, jadwalUjianRef, a) || 0;
      const status2 =
        getStatusPengerjaanAngka(jadwalUjian, jadwalUjianRef, b) || 0;

      const keluarTab1 = a?.pesertaUjian[0]?.warning;
      const keluarTab2 = b?.pesertaUjian[0]?.warning;

      const nilai1 = a?.pesertaUjian[0]?.nilai;
      const nilai2 = b?.pesertaUjian[0]?.nilai;

      if (sortKeluarTab == 1) {
        return keluarTab2 - keluarTab1;
      } else if (sortNilai == 1) {
        return nilai2 - nilai1;
      } else if (sortNilai == 0) {
        return nilai1 - nilai2;
      } else if (statusSort == 1) {
        return status1 - status2;
      } else if (statusSort == 0) {
        return status2 - status1;
      } else if (sortKeluarTab == 0) {
        return keluarTab1 - keluarTab2;
      }
    })
    .filter((d) => {
      if (d?.nama) {
        return d?.nama.toLowerCase().includes(search.toLowerCase());
      } else {
        return 1;
      }
    });
};
