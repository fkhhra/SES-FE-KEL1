import { useRouter } from "next/router";
import ModalEvaluasiDiriKerjaGuru from "./ModalEvaluasiDiriKerjaGuru";
import ModalTambahAlokasiWaktu from "./ModalTambahAlokasiWaktu";
import ModalTambahAnalisisButirSoal from "./ModalTambahAnalisisButirSoal";
import ModalTambahAnalisisHasilUlangan from "./ModalTambahAnalisisHasilUlangan";
import ModalTambahBukuPeganganGuru from "./ModalTambahBukuPeganganGuru";
import ModalTambahDayaSerapSiswa from "./ModalTambahDayaSerapSiswa";
import ModalTambahIkrarGuru from "./ModalTambahIkrarGuru";
import ModalTambahJurnalAgendaGuru from "./ModalTambahJurnalAgendaGuru";
import ModalTambahKalenderPendidikan from "./ModalTambahKalenderPendidikan";
import ModalTambahKKM from "./ModalTambahKKM";
import ModalTambahKodeEtikGuru from "./ModalTambahKodeEtikGuru";
import ModalTambahKumpulanKisiSoal from "./ModalTambahKumpulanKisiSoal";
import ModalTambahKumpulanSoal from "./ModalTambahKumpulanSoal";
import ModalTambahPembiasaanGuru from "./ModalTambahPembiasaanGuru";
import ModalTambahPenilaianAkhlak from "./ModalTambahPenilaianAkhlak";
import ModalTambahPerbaikanSoal from "./ModalTambahPerbaikanSoal";
import ModalTambahProgramPelaksanaanDanPerbaikan from "./ModalTambahProgramPelaksanaanDanPerbaikan";
import ModalTambahProgramSemester from "./ModalTambahProgramSemester";
import ModalTambahProgramTahunan from "./ModalTambahProgramTahunan";
import ModalTambahSilabus from "./ModalTambahSilabus";
import ModalTambahSklKiKd from "./ModalTambahSklKiKd";
import ModalTambahTataTertibGuru from "./ModalTambahTataTertibGuru";
import ModalTindakLanjutKerjaGuru from "./ModalTindakLanjutKerjaGuru";

const BukuKerjaModal = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <>
      {pathname?.includes("skl") && <ModalTambahSklKiKd />}
      {pathname?.includes("silabus") && <ModalTambahSilabus />}
      {pathname?.includes("kkm") && <ModalTambahKKM />}
      {pathname?.includes("evaluasi-diri-kerja-guru") && (
        <ModalEvaluasiDiriKerjaGuru />
      )}
      {pathname?.includes("program-tindak-lanjut-kerja-guru") && (
        <ModalTindakLanjutKerjaGuru />
      )}
      {pathname?.includes("kode-etik") && <ModalTambahKodeEtikGuru />}
      {pathname?.includes("ikrar-guru") && <ModalTambahIkrarGuru />}
      {pathname?.includes("tata-tertib-guru") && <ModalTambahTataTertibGuru />}
      {pathname?.includes("pembiasaan-guru") && <ModalTambahPembiasaanGuru />}
      {pathname?.includes("kalender-pendidikan") && (
        <ModalTambahKalenderPendidikan />
      )}
      {pathname?.includes("alokasi-waktu") && <ModalTambahAlokasiWaktu />}
      {pathname?.includes("program-tahunan") && <ModalTambahProgramTahunan />}
      {pathname?.includes("program-semester") && <ModalTambahProgramSemester />}
      {pathname?.includes("jurnal-agenda-guru") && (
        <ModalTambahJurnalAgendaGuru />
      )}
      {pathname?.includes("analisis-hasil-ulangan") && (
        <ModalTambahAnalisisHasilUlangan />
      )}
      {pathname?.includes("daftar-buku-pegangan-guru") && (
        <ModalTambahBukuPeganganGuru />
      )}
      {pathname?.includes("daya-serap-siswa") && <ModalTambahDayaSerapSiswa />}
      {pathname?.includes("analisis-butir-soal") && (
        <ModalTambahAnalisisButirSoal />
      )}
      {pathname?.includes("perbaikan-soal") && <ModalTambahPerbaikanSoal />}
      {pathname?.includes("kumpulan-soal") && <ModalTambahKumpulanSoal />}
      {pathname?.includes("kumpulan-kisi-soal") && (
        <ModalTambahKumpulanKisiSoal />
      )}
      {pathname?.includes("penilaian-akhlak") && <ModalTambahPenilaianAkhlak />}
      {pathname?.includes("prog-pelaks-perbaikan-pengayaan") && (
        <ModalTambahProgramPelaksanaanDanPerbaikan />
      )}
    </>
  );
};

export default BukuKerjaModal;
