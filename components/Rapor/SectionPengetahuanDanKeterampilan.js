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
}) => {
  
const { sekolah } = useSekolah();

  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            B. Pengetahuan dan Keterampilan
          </h4>
        </div>
        <table className="table-ss">
          <thead>
            <tr>
              <th
                style={{ width: "5%" }}
                rowSpan="2"
                className="border border-white border-3 border-start-0 border-top-0 border-end-0"
              >
                No
              </th>
              <th
                style={{ width: "35%" }}
                rowSpan="2"
                className="border border-white border-3 border-start-0 border-top-0 border-end-0"
              >
                Nama
              </th>
              <th
                style={{ width: "30%", height: "40px" }}
                colSpan="3"
                className="text-center border border-white border-3 p-2"
              >
                Pengetahuan
              </th>
              <th
                style={{ width: "30%", height: "40px" }}
                colSpan="3"
                className="text-center border border-white border-3 p-2 border-end-0"
              >
                Keterampilan
              </th>
            </tr>
            <tr>
              <th
                className="text-center border border-white border-3 border-end-0 p-2"
                style={{ height: "40px" }}
              >
                {[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}
              </th>
              <th
                className="text-center border border-white border-3 border-start-0 border-top-0 border-end-0 p-2"
                style={{ height: "40px" }}
              >
                Nilai
              </th>
              <th
                className="text-center border border-white border-3 border-start-0 p-2"
                style={{ height: "40px" }}
              >
                Predikat
              </th>
              <th
                className="text-center border border-white border-3  border-end-0 p-2"
                style={{ height: "40px" }}
              >
                {[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}
              </th>
              <th
                className="text-center border border-white border-3 border-start-0 border-top-0 border-end-0 p-2"
                style={{ height: "40px" }}
              >
                Nilai
              </th>
              <th
                className="text-center border border-white border-3 p-2 border-start-0 border-end-0"
                style={{ height: "40px" }}
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
                    colSpan="8"
                    className="bg-very-soft-secondary py-2 fs-18-ss fw-bold color-dark"
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
                    !jenisRapor || jenisRapor == "tengahSemester"
                      ? data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan
                      : data?.mataPelajaran?.nilaiIndividu?.nilaiKeterampilan;
                  return (
                    <tr>
                      <td data-th="No">{idx + 1}</td>
                      <td data-th="Kompetensi Inti">
                        <span className="fw-semibold">
                          {!data?.nama ? `-` : `${data?.nama}`}
                        </span>
                      </td>
                      <td
                        data-th="Pengetahuan"
                        className="d-md-none d-block"
                        style={{ background: "#F4F4F7" }}
                      >
                        <div style={{ opacity: "0" }}>a</div>
                      </td>
                      <td data-th="KKM" className="text-md-center text-start">
                        <span className="fw-semibold color-dark">
                          {!data?.mataPelajaran?.kkm
                            ? `-`
                            : `${data?.mataPelajaran?.kkm}`}
                        </span>
                      </td>
                      <td data-th="Nilai" className="text-md-center text-start">
                        <span className="fw-semibold color-dark">
                          {!nilai ? `-` : `${nilai}`}
                        </span>
                      </td>
                      <td
                        data-th="Predikat"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark text-uppercase">
                          {!nilai || !predikat
                            ? `-`
                            : `
                     ${checkPredikatPengetahuan(nilai, predikat)}`}
                        </span>
                      </td>
                      <td
                        data-th="Keterampilan"
                        className="d-md-none d-block"
                        style={{ background: "#F4F4F7" }}
                      >
                        <div style={{ opacity: "0" }}>a</div>
                      </td>
                      <td data-th="KKM" className="text-md-center text-start">
                        <span className="fw-semibold color-dark">
                          {!data?.kkm2 ? `-` : `${data?.kkm2}`}
                        </span>
                      </td>
                      <td data-th="Nilai" className="text-md-center text-start">
                        <span className="fw-semibold color-dark">
                          {!nilaiKeterampilan ? `-` : `${nilaiKeterampilan}`}
                        </span>
                      </td>
                      <td
                        data-th="Predikat"
                        className="text-md-center text-start"
                      >
                        <span className="fw-semibold color-dark text-uppercase">
                          {!nilaiKeterampilan || !predikat
                            ? `-`
                            : `
                     ${checkPredikatKeterampilan(nilaiKeterampilan, predikat)}`}
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

export default SectionPengetahuanDanKeterampilan;
