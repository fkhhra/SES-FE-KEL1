import {
  checkPredikatKeterampilan,
  checkPredikatPengetahuan,
  filterAgama,
} from "../../utilities/RaporUtils";
import useSekolah from "hooks/useSekolah";

const SectionPengetahuanDanKeterampilan = ({
  isReadOnly = false,
  muatan,
  predikat,
  siswa,
  jenisRapor,
  ta,
  tingkat
}) => {
  
  const { sekolah } = useSekolah();

  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-3 ms-4">
        B. Pengetahuan dan Keterampilan
      </h6>
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="text-center align-middle fw-bold fs-12-ss"
              style={{ width: "5%" }}
              rowSpan="2"
            >
              No
            </th>
            <th
              className="fw-bold fs-12-ss align-middle"
              style={{ width: "30%" }}
              rowSpan="2"
            >
              Mata Pelajaran
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "30%" }}
              colSpan="3"
            >
              Pengetahuan
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "30%" }}
              colSpan="3"
            >
              Keterampilan
            </th>
          </tr>
          <tr>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              {[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              Nilai
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              Predikat
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              {[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              Nilai
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "8%" }}
            >
              Predikat
            </th>
          </tr>
        </thead>
        {muatan?.map((d, idx) => {
          return (
            <tbody>
              <tr>
                <td
                  className="align-text-top fs-12-ss fw-bold py-1"
                  colSpan="8"
                >
                  {!d?.nama ? `-` : `${d?.nama}`}
                </td>
              </tr>
              {filterAgama(d?.mapelRapor, siswa)?.map((data, idx) => {
                const nilai =
                  !jenisRapor || jenisRapor == "tengahSemester"
                    ? data?.mataPelajaran?.nilaiIndividu?.nilai
                    : data?.mataPelajaran?.nilaiIndividu?.nilai;
                const nilaiKeterampilan =
                  ((ta?.id == 40 || ta?.id == 41) && tingkat == "X") ||
                  ((ta?.id == 47 || ta?.id == 8186) && tingkat == "XI") ||
                  ((ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII")
                    ? !jenisRapor || jenisRapor == "tengahSemester"
                      ? data?.mataPelajaran?.nilaiIndividu?.nilai
                      : data?.mataPelajaran?.nilaiIndividu?.nilai
                    : !jenisRapor || jenisRapor == "tengahSemester"
                    ? data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan
                    : data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan;
                return (
                  <tr>
                    <td className="align-text-top fs-12-ss text-center">
                      {idx + 1}
                    </td>
                    <td className="align-text-top fs-12-ss">
                      {!data?.nama ? `-` : `${data?.nama}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!data?.mataPelajaran?.kkm
                        ? `-`
                        : `${data?.mataPelajaran?.kkm}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilai ? `-` : `${nilai}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilai || !predikat
                        ? `-`
                        : `
                     ${checkPredikatPengetahuan(nilai, predikat)}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!data?.kkm2 ? `-` : `${data?.kkm2}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilaiKeterampilan ? `-` : `${nilaiKeterampilan}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilaiKeterampilan || !predikat
                        ? `-`
                        : `
                     ${checkPredikatKeterampilan(nilaiKeterampilan, predikat)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </>
  );
};

export default SectionPengetahuanDanKeterampilan;
