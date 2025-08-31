import { useEffect, useState } from "react";
import SectionIndetitasPesertaDidik from "../../../../../components/RaporPrint/SectionIdentitasPersertaDidik";
import SectionInformasiRapor from "../../../../../components/RaporPrint/SectionInformasiRapor";
import SectionSikap from "../../../../../components/RaporPrint/SectionSikap";
import SectionPengetahuanDanKeterampilan from "../../../../../components/RaporPrint/SectionPengetahuanDanKeterampilan";
import SectionPraktikKerjaLapangan from "../../../../../components/RaporPrint/SectionPraktikKerjaLapangan";
import SectionEkstrakurikuler from "../../../../../components/RaporPrint/SectionEkstrakurikuler";
import SectionPrestasi from "../../../../../components/RaporPrint/SectionPrestasi";
import SectionKetidakhadiran from "../../../../../components/RaporPrint/SectionKetidakhadiran";
import SectionCatatanWaliKelas from "../../../../../components/RaporPrint/SectionCatatanWaliKelas";
import SectionKeputusan from "../../../../../components/RaporPrint/SectionKeputusan";
import SectionTandaTangan from "../../../../../components/RaporPrint/SectionTandaTangan";
import SectionCover from "../../../../../components/RaporPrint/SectionCover";
import { getRaporSiswa } from "../../../../../client/BukuIndukClient";
import SectionIdentitasPesertaDidik from "../../../../../components/RaporPrint/SectionIdentitasPersertaDidik";
import RaporYadikaPrint from "components/Rapor/Yadika/RaporYadikaPrint";
import SectionIdentitasPesertaDidikSmkKampungJawaPrint from "../../../../../components/Rapor/SmkKampungJawa/SectionIdentitasPersertaDidikSmkKampungJawaPrint";

const index = ({ rombel_id, id, jenis_rapor = "akhirSemester" }) => {
  const [raporSiswa, setRaporSiswa] = useState({});
  const {
    siswa,
    ekskul,
    totalHadir,
    sekolah,
    ta,
    rombel,
    sikapsosial,
    sikapspiritual,
    muatan,
    predikat,
  } = raporSiswa;
  const [loading, setLoading] = useState(true);

  const _getRaporSiswa = async () => {
    setLoading(true);
    const { data } = await getRaporSiswa(rombel_id, id);
    if (data) {
      setRaporSiswa(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getRaporSiswa();
  }, []);

  const [totalSakit, setTotalSakit] = useState(0);
  const [totalIzin, setTotalIzin] = useState(0);
  const [totalAlpa, setTotalAlpa] = useState(0);

  useEffect(() => {
    setTotalAlpa(
      !jenis_rapor || jenis_rapor == "tengahSemester"
        ? siswa?.keteranganRapor?.alpa
        : siswa?.keteranganRaporUas?.alpa
    );
    setTotalSakit(
      !jenis_rapor || jenis_rapor == "tengahSemester"
        ? siswa?.keteranganRapor?.sakit
        : siswa?.keteranganRaporUas?.sakit
    );
    setTotalIzin(
      !jenis_rapor || jenis_rapor == "tengahSemester"
        ? siswa?.keteranganRapor?.izin
        : siswa?.keteranganRaporUas?.izin
    );
  }, [siswa, jenis_rapor]);

  // useEffect(() => {
  //   if (!loading) {
  //     setTimeout(function () {
  //       window.print();
  //     }, 1500);
  //   }
  // }, [loading]);

  return (
    <>
      <div className="print-page color-dark">
        {sekolah?.id == 33 ? (
          <RaporYadikaPrint
            sekolah={sekolah}
            siswa={siswa}
            ta={ta}
            rombel={rombel}
            sikapsosial={sikapsosial}
            sikapspiritual={sikapspiritual}
            muatan={muatan}
            predikat={predikat}
            totalAlpa={totalAlpa}
            totalIzin={totalIzin}
            totalSakit={totalIzin}
            jenisRapor={jenis_rapor}
          />
        ) : (
          <>
            {" "}
            <SectionCover
              sekolah={sekolah}
              siswa={siswa}
              ta={ta}
              jenisRapor={jenis_rapor}
            />
            {sekolah?.id == "15" || sekolah?.id == "13" ? (
              <SectionIdentitasPesertaDidikSmkKampungJawaPrint
                siswa={siswa}
                sekolah={sekolah}
                ta={ta}
                jenisRapor={jenis_rapor}
              />
            ) : (
              <SectionIdentitasPesertaDidik
                siswa={siswa}
                sekolah={sekolah}
                ta={ta}
              />
            )}
            <div className="mb-4">
              <SectionInformasiRapor
                sekolah={sekolah}
                siswa={siswa}
                ta={ta}
                kelas={rombel?.nama}
                rombel={rombel}
              />
            </div>
            <div className="mb-4">
              <SectionSikap
                sikap={
                  !jenis_rapor || jenis_rapor == "tengahSemester"
                    ? siswa?.sikap
                    : siswa?.sikapUas
                }
                siswa={siswa?.nama}
                sikapsosial={sikapsosial}
                sikapspiritual={sikapspiritual}
                tingkat={rombel?.tingkat}
                sekolah={sekolah}
                ta={ta}
              />
            </div>
            <div className="mb-4">
              <SectionPengetahuanDanKeterampilan
                muatan={muatan}
                predikat={predikat}
                siswa={siswa}
                jenisRapor={jenis_rapor}
                ta={ta}
                tingkat={rombel?.tingkat}
              />
            </div>
            <div className="mb-4">
              <SectionEkstrakurikuler ekskul={siswa?.raporEkskul} />
            </div>
            {sekolah?.id == 578 ? (
              <>
                {rombel?.tingkat == "XII" || rombel?.tingkat == "XI" ? (
                  <div className="mb-4">
                    <SectionPraktikKerjaLapangan
                      keteranganPkl={siswa?.keteranganPkl}
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
            <div className="mb-4">
              {/* <SectionPrestasi prestasi={siswa?.prestasi} /> */}
            </div>
            <div className="mb-4">
              <SectionKetidakhadiran
                totalAlpa={totalAlpa}
                totalIzin={totalIzin}
                totalSakit={totalSakit}
                siswa={
                  !jenis_rapor || jenis_rapor == "tengahSemester"
                    ? siswa?.keteranganRapor
                    : siswa?.keteranganRaporUas
                }
                tingkat={rombel?.tingkat}
                sekolah={sekolah}
                ta={ta}
              />
            </div>
            <div className="mb-4">
              <SectionCatatanWaliKelas
                catatan={
                  !jenis_rapor || jenis_rapor == "tengahSemester"
                    ? siswa?.keteranganRapor
                    : siswa?.keteranganRaporUas
                }
                sekolah={sekolah}
                tingkat={rombel?.tingkat}
                ta={ta}
              />
            </div>
            {sekolah?.id == 15 || sekolah?.id == 13 || sekolah?.id == 578 ? (
              <div className="mb-5">
                {ta?.semester == 2 ||
                ta?.semester == "GENAP" ||
                ta?.semester == "Genap" ||
                ta?.semester == "genap" ? (
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
            ) : (
              ""
            )}
            <SectionTandaTangan walikelas={rombel} ta={ta} sekolah={sekolah} />
          </>
        )}
      </div>
    </>
  );
};
export async function getServerSideProps({
  params: { rombel_id, id },
  query: { jenis_rapor },
}) {
  return {
    props: {
      rombel_id,
      id,
      jenis_rapor: jenis_rapor || null,
    },
  };
}
export default index;
