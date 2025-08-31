import { Tooltip } from "antd";
import { useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";

const AnalisisNilaiPengetahuan = ({
  analisisNilai,
  downloadAnalisisNilai,
  jadwalMengajar,
  judulTugas,
}) => {
  const [tugasNumber, setTugasNumber] = useState(0);

  // let tugasData = [];

  // for (let i = 1; i <= tugasNumber; i++) {
  //   tugasData.push("data");
  // }

  const tugasData = judulTugas?.filter(
    (d) =>
      d?.ditugaskan?.[0]?.jumlahSiswa !== null &&
      d?.ditugaskan?.[0]?.jumlahSiswa > 0 &&
      d?.ditugaskan?.[0]?.jumlahSiswa !== undefined
  );

  return (
    <div>
      <div className="card card-ss">
        <div className="card-body p-0">
          <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column p-4">
            <h4 className="mb-lg-0 mb-3 fw-extrabold color-dark">
              Nilai Pengetahuan Siswa
            </h4>
            <div className="d-flex align-items-sm-center flex-sm-row flex-column">
              <div className="d-flex flex-column flex-lg-row align-items-lg-center fs-6">
                <button
                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 me-0 mb-sm-0 mb-3 fw-bold color-secondary fs-14-ss"
                  onClick={() => downloadAnalisisNilai("nilai-pengetahuan")}
                >
                  <FaCloudDownloadAlt className="me-2 fs-6" />
                  Unduh
                </button>
              </div>
              <input
                type="text"
                className="form-control form-search rounded-pill fs-14-ss fw-semibold py-2 border-secondary-ss h-100"
                style={{ height: "39px !important" }}
                id="exampleFormControlInput1"
                placeholder="Cari Nama Siswa"
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Rata Rata</th>
                  <th>Dibawah KKM</th>
                  <th>Tugas Belum Dikerjakan</th>
                  <th>Tugas Belum Dinilai</th>
                  <th>Jumlah Tugas</th>
                  {tugasData?.map((tugas, idx) => (
                    <th>
                      <Tooltip title={tugas?.tugas?.judul}>
                        <p
                          // className="text-truncate mb-0"
                          style={{
                            whiteSpace: "nowrap",
                            width: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {tugas?.tugas?.judul}
                        </p>
                      </Tooltip>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analisisNilai
                  ?.sort((a, b) => ("" + a?.nama).localeCompare("" + b?.nama))
                  ?.map((analisis, idx) => {
                    if (analisis?.tugas?.length > tugasNumber) {
                      setTugasNumber(analisis?.tugas?.length);
                    }
                    const dibawahKKM =
                      analisis?.tugas.filter(
                        (tugas) =>
                          tugas.nilai < jadwalMengajar?.mataPelajaran?.kkm
                      )?.length || 0;

                    const tugasBelumDikerjakan =
                      analisis?.tugas?.filter(
                        (tugas) => tugas?.dikumpulkan == 0
                      )?.length || 0;

                    const tugasBelumDinilai =
                      analisis?.tugas?.filter(
                        (tugas) =>
                          tugas?.dikumpulkan == 1 && tugas?.nilai == null
                      )?.length || 0;

                    return (
                      <tr>
                        <td>{idx + 1}</td>
                        <td>{analisis?.nama}</td>
                        <td>
                          {(
                            parseInt(
                              analisis?.tugas?.reduce(
                                (a, b) => a + b.nilai || 0,
                                0
                              )
                            ) / analisis?.tugas?.length
                          ).toFixed(2) || 0}
                        </td>
                        <td>{dibawahKKM || 0} Tugas</td>
                        <td>{tugasBelumDikerjakan} Tugas</td>
                        <td>{tugasBelumDinilai} Tugas</td>
                        <td>{analisis?.tugas?.length || 0} Tugas</td>
                        {tugasData?.map((tugasData) => {
                          const tugasSiswa = analisis?.tugas?.find(
                            (s) => s?.mTimelineId == tugasData?.id
                          );
                          return (
                            <>
                              {tugasSiswa?.id ? (
                                <td>{tugasSiswa?.nilai || 0}</td>
                              ) : (
                                <td> -</td>
                              )}
                            </>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalisisNilaiPengetahuan;
