import SectionCover from "../../../components/Rapor/SectionCover";
import SectionEkstrakurikuler from "../../../components/Rapor/SectionEkstrakurikuler";
import SectionIndetitasPesertaDidik from "../../../components/Rapor/SectionIdentitasPersertaDidik";
import SectionInformasiSiswa from "../../../components/Rapor/SectionInformasiSiswa";
import SectionKetidakhadiran from "../../../components/Rapor/SectionKetidakhadiran";
import SectionPengetahuanDanKeterampilan from "../../../components/Rapor/SectionPengetahuanDanKeterampilan";
import SectionPrestasi from "../../../components/Rapor/SectionPrestasi";
import SectionScrollMenu from "../../../components/Rapor/SectionScrollMenu";
import SectionSikap from "../../../components/Rapor/SectionSikap";
import SectionCatatanWaliKelas from "../../../components/Rapor/SectionCatatanWalikelas";
import SectionTandaTangan from "../../../components/Rapor/SectionTandaTangan";
import ModalUbahFotoProfil from "../../../components/Rombel/ModalUbahFotoProfil";
import SectionNilaiAkademik from "./SectionNilaiAkademik";
import SectionCatatanAkademik from "./SectionCatatanAkademik";
import SectionKetidakhadiranRaporYadika from "./SectionKetidakhadiranRaporYadika";
import SectionEkstrakurikulerRaporYadika from "./SectionEkstrakurikulerRaporYadika";
import SectionPraktikKerjaLapangan from "components/RaporPrint/SectionPraktikKerjaLapangan";
import SectionPraktikKerjaLapanganRaporYadika from "./SectionPraktikKerjaLapanganRaporYadika";
import SectionDeskripsiPerkembanganKarakter from "./SectionDeskripsiPerkembanganKarakter";
import SectionCatatanWalikelasRaporYadika from "./SectionCatatanWalikelasRaporYadika";
import SectionCoverRaporYadika from "./SectionCoverRaporYadika";
import SectionIndetitasPesertaDidikYadika from "./SectionIdentitasPersertaDidikYadika";

const RaporYadika = ({
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

  handleChangeForm,
  formData1,
  _postProfilUser,
  handleChangeSelect,
  province,
  regency,
  district,
  village,
  handleChangeDate,
  buttonState,
}) => {
  return (
    <>
      <div className="col-md-12">
        <SectionCoverRaporYadika
          sekolah={sekolah}
          siswa={siswa}
          ta={ta}
          jenisRapor={jenisRapor}
        />
      </div>
      <div className="col-md-12">
        <SectionIndetitasPesertaDidikYadika
          siswa={siswa}
          sekolah={sekolah}
          ta={ta}
          setFormData={setFormData}
          formData={formData}
          handleChangeForm={handleChangeForm}
          formData1={formData1}
          _postProfilUser={_postProfilUser}
          handleChangeSelect={handleChangeSelect}
          province={province}
          regency={regency}
          district={district}
          village={village}
          handleChangeDate={handleChangeDate}
          buttonState={buttonState}
        />
      </div>
      <div className="col-md-12">
        <SectionInformasiSiswa
          sekolah={sekolah}
          siswa={siswa}
          ta={ta}
          kelas={rombel?.nama}
        />
      </div>
      {/* <div className="col-md-12">
        <SectionSikap
          sikap={siswa?.sikap}
          siswa={siswa?.nama}
          sikapsosial={sikapsosial}
          sikapspiritual={sikapspiritual}
        />
      </div> */}
      <div className="col-md-12">
        <SectionNilaiAkademik
          muatan={muatan}
          predikat={predikat}
          siswa={siswa}
          jenisRapor={jenisRapor}
        />
      </div>
      <div className="col-md-12">
        <SectionCatatanAkademik
          catatan={siswa?.keteranganRapor}
          muatan={muatan}
          kelas={rombel?.nama}
          predikat={predikat}
          siswa={siswa}
          jenisRapor={jenisRapor}
          kenaikan={rombel?.tingkat}
        />
      </div>
      <div className="col-md-12">
        <SectionPraktikKerjaLapanganRaporYadika
          keteranganPkl={siswa?.keteranganPkl}
        />
      </div>
      <div className="col-md-12">
        <SectionEkstrakurikulerRaporYadika ekskul={siswa?.raporEkskul} />
      </div>
      <div className="col-md-12">
        <SectionKetidakhadiranRaporYadika
          totalAlpa={totalAlpa}
          totalIzin={totalIzin}
          totalSakit={totalSakit}
        />
      </div>
      <div className="col-md-12">
        <SectionDeskripsiPerkembanganKarakter
          siswa={siswa}
          jenisRapor={jenisRapor}
        />
      </div>
      <div className="col-md-12">
        <SectionCatatanWalikelasRaporYadika
          catatan={siswa?.keteranganRaporUas}
        />
      </div>
      <div className="col-md-12">
        <SectionTandaTangan walikelas={rombel} ta={ta} sekolah={sekolah} />
      </div>
      <ModalUbahFotoProfil
        formData={formData}
        onSubmit={putFoto}
        changeFoto={changeFoto}
      />
    </>
  );
};

export default RaporYadika;
