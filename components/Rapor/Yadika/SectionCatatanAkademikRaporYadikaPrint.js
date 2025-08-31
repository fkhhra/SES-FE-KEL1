import { useState } from "react";
import { useEffect } from "react";
import { filterAgama, getCatatanAkademikYadika } from "utilities/RaporUtils";

const SectionCatatanAkademikRaporYadikaPrint = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  catatan,
  muatan,
  predikat,
  kelas,
  siswa,
  jenisRapor,
  kenaikan
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
      <h6 className="fs-14-ss fw-bold mb-2">B. Catatan Akademik</h6>
      <div
        className="border border-dark border-2 p-2"
        style={{ borderColor: "#000000" }}
      >
        <p className="mb-0 fs-12-ss">
          {getCatatanAkademikYadika(dibawah, siswa, kelas,kenaikan)}
        </p>
      </div>
    </>
  );
};

export default SectionCatatanAkademikRaporYadikaPrint;
