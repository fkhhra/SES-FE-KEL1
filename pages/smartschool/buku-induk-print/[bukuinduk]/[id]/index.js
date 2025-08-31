import { useEffect, useState } from "react";
import { getRaporBukuInduk } from "../../../../../client/BukuIndukClient";
import SectionDaftarNilai from "../../../../../components/BukuIndukPrint/SectionDaftarNilai";
import SectionKenaikan from "../../../../../components/BukuIndukPrint/SectionKenaikan";
import SectionPengetahuanDanKeterampilanBukuInduk from "../../../../../components/BukuIndukPrint/SectionPengetahuanDanKeterampilanBukuInduk";
import SectionCatatanWaliKelas from "../../../../../components/RaporPrint/SectionCatatanWaliKelas";
import SectionCover from "../../../../../components/RaporPrint/SectionCover";
import SectionEkstrakurikuler from "../../../../../components/RaporPrint/SectionEkstrakurikuler";
import SectionIndetitasPesertaDidik from "../../../../../components/RaporPrint/SectionIdentitasPersertaDidik";
import SectionInformasiRapor from "../../../../../components/RaporPrint/SectionInformasiRapor";
import SectionKetidakhadiran from "../../../../../components/RaporPrint/SectionKetidakhadiran";
import SectionPraktikKerjaLapangan from "../../../../../components/RaporPrint/SectionPraktikKerjaLapangan";
import SectionPrestasi from "../../../../../components/RaporPrint/SectionPrestasi";
import SectionSikap from "../../../../../components/RaporPrint/SectionSikap";
import SectionTandaTangan from "../../../../../components/RaporPrint/SectionTandaTangan";

const index = ({ bukuinduk, id }) => {
  const [raporBukuIndukData, setRaporBukuIndukData] = useState({});
  const { result, sikapsosial, sikapspiritual } = raporBukuIndukData;
  const [loading, setLoading] = useState(true);

  const _getRaporBukuInduk = async () => {
    setLoading(true);
    const { data } = await getRaporBukuInduk(bukuinduk, id);
    if (data) {
      setRaporBukuIndukData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getRaporBukuInduk();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(function () {
        window.print();
      }, 5000);
    }
  }, [loading]);

  return (
    <>
      <div className="print-page color-dark">
        <SectionCover
          sekolah={result?.[0]?.sekolah}
          siswa={result?.[0]?.siswa}
          isBukuInduk
        />
        <SectionIndetitasPesertaDidik
          siswa={result?.[0]?.siswa}
          sekolah={result?.[0]?.sekolah}
          ta={result?.[0]?.ta}
        />
        {result?.map((d, idx) => {
          return (
            <>
              <div className="mb-4">
                <SectionInformasiRapor
                  isBukuInduk
                  sekolah={d?.sekolah}
                  siswa={d?.siswa}
                  ta={d?.ta}
                  kelas={d?.rombel?.nama}
                />
              </div>
              <div className="mb-4">
                <SectionSikap
                  sikap={d?.siswa?.sikap}
                  siswa={d?.siswa?.nama}
                  sikapsosial={sikapsosial}
                  sikapspiritual={sikapspiritual}
                />
              </div>
              <div className="mb-4">
                <SectionPengetahuanDanKeterampilanBukuInduk
                  data={d}
                  sikapsosial={sikapsosial}
                  siswa={result?.[0]?.siswa}
                />
              </div>
              <div className="mb-4">
                <SectionPraktikKerjaLapangan
                  keteranganPkl={d?.siswa?.keteranganPkl}
                />
              </div>
              <div className="mb-4">
                <SectionEkstrakurikuler ekskul={d?.siswa?.raporEkskul} />
              </div>
              <div className="mb-4">
                <SectionPrestasi prestasi={d?.siswa?.prestasi} />
              </div>
              <div className="mb-4">
                <SectionKetidakhadiran
                  totalAlpa={d?.totalAlpa}
                  totalIzin={d?.totalIzin}
                  totalSakit={d?.totalSakit}
                />
              </div>
              <div className="mb-4">
                <SectionCatatanWaliKelas catatan={d?.siswa?.keteranganRapor} />
              </div>
              <div className="mb-4">
                <SectionKenaikan
                  keterangan={d?.siswa?.keteranganRapor}
                  kenaikan={d?.rombel?.tingkat}
                />
              </div>
            </>
          );
        })}
        {result?.length > 6 && <SectionDaftarNilai />}
        <div style={{ marginBottom: "650px" }}>
          <SectionTandaTangan
            walikelas={result?.[0]?.rombel}
            ta={result?.[0]?.ta}
          />
        </div>
      </div>
    </>
  );
};
export async function getServerSideProps({ params: { bukuinduk, id } }) {
  return {
    props: {
      bukuinduk,
      id,
    },
  };
}
export default index;
