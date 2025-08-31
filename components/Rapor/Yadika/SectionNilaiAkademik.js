import {
  checkPredikatKeterampilan,
  checkPredikatPengetahuan,
  filterAgama,
} from "../../../utilities/RaporUtils";

const SectionNilaiAkademik = ({
  isReadOnly = false,
  muatan,
  predikat,
  siswa,
  jenisRapor,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">A. Nilai Akademik</h4>
        </div>
        <table className="table-ss">
          <thead>
            <tr>
              <th
                style={{ width: "5%" }}
                className="border border-white border-3 border-start-0 border-top-0"
              >
                No
              </th>
              <th
                style={{ width: "35%" }}
                className="border border-white border-3 border-start-0 border-top-0 border-end-0"
              >
                Nama
              </th>
              <th className="text-center border border-white border-3 p-3">
                Pengetahuan
              </th>
              <th className="text-center border border-white border-3 p-3 border-end-0">
                Keterampilan
              </th>
              <th className="text-center border border-white border-3 p-3">
                Nilai Akhir
              </th>
              <th className="text-center border border-white border-3 p-3 border-end-0">
                Predikat
              </th>
            </tr>
          </thead>
          {muatan?.map((d, idx) => {
            return (
              <tbody>
                <tr className="mb-0">
                  <td
                    colSpan="8"
                    className="bg-very-soft-secondary py-2 fs-18-ss fw-bold color-dark ps-md-4 ps-2"
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
                    ((nilai * 3) / 10 || 0) +
                      ((nilaiKeterampilan * 7) / 10 || 0)
                  );
                  return (
                    <tr>
                      <td data-th="No">{idx + 1}</td>
                      <td data-th="Mata Pelajaran">
                        <span className="fw-semibold">
                          {!data?.nama ? `-` : `${data?.nama}`}
                        </span>
                      </td>
                      <td
                        data-th="Pengetahuan"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark">
                          {!nilai ? `-` : `${nilai}`}
                        </span>
                      </td>
                      <td
                        data-th="Keterampilan"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark">
                          {!nilaiKeterampilan ? `-` : `${nilaiKeterampilan}`}
                        </span>
                      </td>
                      <td
                        data-th="Nilai Akhir"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark">
                          {nilaiAkhir}
                        </span>
                      </td>
                      <td
                        data-th="Predikat"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark text-uppercase">
                          {!nilaiAkhir || !predikat
                            ? `-`
                            : `
                     ${checkPredikatKeterampilan(nilaiAkhir, predikat)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default SectionNilaiAkademik;
