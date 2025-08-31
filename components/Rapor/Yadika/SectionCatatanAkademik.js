import { useState } from "react";
import { useEffect } from "react";
import { filterAgama, getCatatanAkademikYadika } from "utilities/RaporUtils";

const SectionCatatanAkademik = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  catatan,
  muatan,
  predikat,
  kelas,
  siswa,
  jenisRapor,kenaikan
}) => {
  const [dibawah, setDibawah] = useState([]);

  useEffect(() => {
    setDibawah([]);
    let temp = [];
    muatan?.map((d) => {
      return filterAgama(d?.mapelRapor, siswa)?.filter((data) => {
        const nilai =
          !jenisRapor || jenisRapor == "akhirSemester"
            ? data?.mataPelajaran?.nilaiIndividu?.nilai
            : data?.mataPelajaran?.nilaiIndividu?.nilaiUts;
        const nilaiKeterampilan =
          !jenisRapor || jenisRapor == "akhirSemester"
            ? data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan
            : data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilanUts;
        const nilaiAkhir = ((nilai || 0) + (nilaiKeterampilan || 0)) / 2;
        if (nilaiAkhir < data?.mataPelajaran?.kkm) {
          temp.push(data);
        }
      });
    });
    setDibawah(temp);
    return () => {
      temp = [];
    };
  }, [muatan]);
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">B. Catatan Akademik</h4>
          {/* <h4 className="fw-extrabold color-dark mb-0">
            F. Catatan Wali Kelas
          </h4> */}
        </div>

        <p className="mx-4">
          {getCatatanAkademikYadika(dibawah, siswa, kelas,kenaikan)}
        </p>
      </div>
    </>
  );
};

export default SectionCatatanAkademik;
