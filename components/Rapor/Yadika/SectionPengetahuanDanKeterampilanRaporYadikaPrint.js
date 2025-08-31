import {
  checkPredikatKeterampilan,
  checkPredikatPengetahuan,
  filterAgama,
} from "../../../utilities/RaporUtils";

const SectionPengetahuanDanKeterampilanRaporYadikaPrint = ({
  isReadOnly = false,
  muatan,
  predikat,
  siswa,
  jenisRapor,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold mb-2">A. Nilai Akademik</h6>
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="fw-bold fs-12-ss align-middle text-center"
              style={{ width: "50%" }}
              colSpan={2}
            >
              Mata Pelajaran
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "15%" }}
            >
              Pengetahuan
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "15%" }}
            >
              Keterampilan
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "15%" }}
            >
              Nilai Akhir
            </th>
            <th
              className="fw-bold fs-12-ss py-1 text-center"
              style={{ width: "15%" }}
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
                  !jenisRapor || jenisRapor == "akhirSemester"
                    ? data?.mataPelajaran?.nilaiIndividu?.nilai
                    : data?.mataPelajaran?.nilaiIndividu?.nilai;
                const nilaiKeterampilan =
                  !jenisRapor || jenisRapor == "akhirSemester"
                    ? data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan
                    : data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan;
                const nilaiAkhir = Math.round(
                  ((nilai * 3) / 10 || 0) + ((nilaiKeterampilan * 7) / 10 || 0)
                );
                return (
                  <tr>
                    <td className="align-text-top fs-12-ss text-center">
                      {idx + 1}
                    </td>
                    <td className="align-text-top fs-12-ss">
                      {!data?.nama ? `-` : `${data?.nama}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilai ? `-` : `${nilai}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilaiKeterampilan ? `-` : `${nilaiKeterampilan}`}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {nilaiAkhir}
                    </td>
                    <td className="align-text-top fs-12-ss text-center text-uppercase">
                      {!nilaiAkhir || !predikat
                        ? `-`
                        : `
                     ${checkPredikatKeterampilan(nilaiAkhir, predikat)}`}
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

export default SectionPengetahuanDanKeterampilanRaporYadikaPrint;
