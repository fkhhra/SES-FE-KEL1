import SectionCatatanWaliKelas from "components/RaporPrint/SectionCatatanWaliKelas";
import SectionCover from "components/RaporPrint/SectionCover";
import SectionIdentitasPesertaDidik from "components/RaporPrint/SectionIdentitasPersertaDidik";
import SectionInformasiRapor from "components/RaporPrint/SectionInformasiRapor";
import SectionKeputusan from "components/RaporPrint/SectionKeputusan";
import SectionKetidakhadiran from "components/RaporPrint/SectionKetidakhadiran";
import SectionPengetahuanDanKeterampilan from "components/RaporPrint/SectionPengetahuanDanKeterampilan";
import SectionSikap from "components/RaporPrint/SectionSikap";
import SectionTandaTangan from "components/RaporPrint/SectionTandaTangan";
import SectionCatatanAkademikRaporYadikaPrint from "./SectionCatatanAkademikRaporYadikaPrint";
import SectionCatatanWaliKelasRaporYadikaPrint from "./SectionCatatanWaliKelasRaporYadikaPrint";
import SectionCoverRaporYadikaPrint from "./SectionCoverRaporYadikaPrint";
import SectionDeskripsiPerkembanganKarakterRaporYadikaPrint from "./SectionDeskripsiPerkembanganKarakterRaporYadikaPrint";
import SectionEkstrakurikulerRaporYadikaPrint from "./SectionEkstrakurikulerRaporYadikaPrint";
import SectionIdentitasPesertaDidikYadikaPrint from "./SectionIdentitasPersertaDidikYadikaPrint";
import SectionInformasiRaporYadikaPrint from "./SectionInformasiRaporYadikaPrint";
import SectionKetidakhadiranRaporYadika from "./SectionKetidakhadiranRaporYadika";
import SectionKetidakhadiranRaporYadikaPrint from "./SectionKetidakhadiranRaporYadikaPrint";
import SectionPengetahuanDanKeterampilanRaporYadikaPrint from "./SectionPengetahuanDanKeterampilanRaporYadikaPrint";
import SectionPraktikKerjaLapanganRaporYadikaPrint from "./SectionPraktikKerjaLapanganRaporYadikaPrint";
import SectionTandaTanganRaporYadikaPrint from "./SectionTandaTanganRaporYadikaPrint";
import SectionTanggapaOrangTuaWaliRaporYadikaPrint from "./SectionTanggapaOrangTuaWaliRaporYadikaPrint";

const RaporYadikaPrint = ({
  sekolah,
  siswa,
  ta,
  setFormData,
  rombel,
  sikapsosial,
  sikapspiritual,
  muatan,
  predikat,
  totalAlpa,
  totalIzin,
  totalSakit,
  putFoto,
  changeFoto,
  formData,
  jenisRapor,
}) => {
  return (
    <div className="rapor-yadika-print">
      {" "}
      <SectionCoverRaporYadikaPrint sekolah={sekolah} siswa={siswa} ta={ta} />
      <SectionIdentitasPesertaDidikYadikaPrint
        siswa={siswa}
        sekolah={sekolah}
        ta={ta}
      />
      <div style={{ minHeight: "200vh" }}>
        <div className="mb-2">
          <SectionInformasiRaporYadikaPrint
            sekolah={sekolah}
            siswa={siswa}
            ta={ta}
            kelas={rombel?.nama}
          />
        </div>
        <div className="mb-2">
          <SectionPengetahuanDanKeterampilanRaporYadikaPrint
            muatan={muatan}
            predikat={predikat}
            siswa={siswa}
            jenisRapor={jenisRapor}
          />
        </div>
        <div className="mb-2">
          <SectionCatatanAkademikRaporYadikaPrint
            catatan={siswa?.keteranganRapor}
            muatan={muatan}
            kelas={rombel?.nama}
            predikat={predikat}
            siswa={siswa}
            jenisRapor={jenisRapor}
            kenaikan={rombel?.tingkat}
          />
        </div>
        <div className="mb-2">
          <SectionPraktikKerjaLapanganRaporYadikaPrint
            keteranganPkl={siswa?.keteranganPkl}
          />
        </div>
        <div className="mb-4">
          <SectionEkstrakurikulerRaporYadikaPrint ekskul={siswa?.raporEkskul} />
        </div>
        <div className="mb-4">
          <SectionKetidakhadiranRaporYadikaPrint
            totalAlpa={totalAlpa}
            totalIzin={totalIzin}
            totalSakit={totalSakit}
            absen={
              !jenisRapor || jenisRapor == "akhirSemester"
                ? siswa?.keteranganRaporUas
                : siswa?.keteranganRapor
            }
          />
        </div>
        <div className="mb-4">
          <SectionDeskripsiPerkembanganKarakterRaporYadikaPrint
            siswa={siswa}
            jenisRapor={jenisRapor}
            catatan={siswa?.keteranganRapor}
          />
        </div>
        <div className="mb-4">
          <SectionCatatanWaliKelasRaporYadikaPrint
            catatan={
              !jenisRapor || jenisRapor == "akhirSemester"
                ? siswa?.keteranganRaporUas
                : siswa?.keteranganRapor
            }
          />
        </div>
        <div className="mb-4">
          <SectionTanggapaOrangTuaWaliRaporYadikaPrint
            catatan={
              !jenisRapor || jenisRapor == "akhirSemester"
                ? siswa?.keteranganRaporUas
                : siswa?.keteranganRapor
            }
          />
        </div>
        <div className="mb-4">
          {(ta?.semester == 2 || ta?.semester == "GENAP") &&
          jenisRapor == "akhirSemester" ? (
            <SectionKeputusan
              ta={ta}
              keterangan={siswa?.keteranganRaporUas}
              kenaikan={rombel?.tingkat}
              sekolah={sekolah}
            />
          ) : (
            ""
          )}
        </div>
        <SectionTandaTanganRaporYadikaPrint
          walikelas={rombel}
          ta={ta}
          sekolah={sekolah}
        />
      </div>
    </div>
  );
};

export default RaporYadikaPrint;
