import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaUndo } from "react-icons/fa";
import { baseURL, downloadURL, ssURL } from "../../client/clientAxios";
import { getRaporKeterampilan, getRaporNilai } from "../../client/RaporClient";
import {
  downloadLegder,
  downloadLegderYadika,
} from "../../client/RombelClient";
import {
  checkLabelStatusTuntasWalas,
  checkStatusTuntasWalas,
  getTotalNilai,
  jumlahNilaiDibawah,
  sortRanking,
} from "../../utilities/RaporUtils";
import useSekolah from "hooks/useSekolah";

const DaftarNilaiPengetahuanWalas = ({
  keterangan,
  jadwalMengajar,
  rombel_id,
  kkm,
  totalMapel,
  getDetailRombelData,
  user,
  admin,
}) => {
  const [disableRefresh, setDisableRefresh] = useState(false);
  const [legder, setLegder] = useState(false);
  const listKKM = [];
  kkm?.map((item) => {
    item?.mapelRapor?.map((mapel) => {
      listKKM.push({
        mMataPelajaranId: mapel?.mMataPelajaranId,
        kkm2: mapel?.kkm2,
        kkm: mapel.mataPelajaran.kkm,
      });
    });
  });

  const refreshNilai = async () => {
    setDisableRefresh(true);
    keterangan.forEach((d) => {
      d?.user?.nilaiSemuaUjian?.forEach(async (e) => {
        await getRaporNilai(e.mMataPelajaranId, d?.user?.id);
        await getRaporKeterampilan(e.mMataPelajaranId, d?.user?.id);
      });
    });

    await getDetailRombelData();
    setDisableRefresh(false);
  };

  const handleDownloadLegder = async () => {
    setLegder(true);
    const ranking = sortRanking(keterangan)?.map((d, idx) => {
      const siswa = d?.user;
      const nilaiSemuaUjian = d?.user?.nilaiSemuaUjian?.filter((d) =>
        listKKM?.find((e) => e?.mMataPelajaranId == d?.mapel?.id)
      );
      const totalNilai = getTotalNilai(nilaiSemuaUjian, siswa);
      return {
        m_user_id: siswa?.id,
        total_nilai: totalNilai,
        ranking: idx + 1,
      };
    });
    document.getElementById("downloadIframe").src = "about:blank";
    const { data, error } =
      admin == 1
        ? user?.mSekolahId == "33"
          ? await downloadLegderYadika(rombel_id, { ranking })
          : await downloadLegder(rombel_id, { ranking })
        : user?.mSekolahId == "33"
        ? await downloadLegderYadika(jadwalMengajar?.mRombelId, { ranking })
        : await downloadLegder(jadwalMengajar?.mRombelId, { ranking });

    if (data) {
      document.getElementById("downloadIframe").src = `${downloadURL}${data}`;
      toast.success(data?.message);
      setLegder(false);
    } else if (error) {
      toast.error("silahkan Coba beberapa saat lagi");
      setLegder(false);
    }
  };

  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  const { sekolah } = useSekolah();
  return (
    <>
      <div className="card card-ss">
        <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
        <div className="card-header p-4 card-header-ss">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-lg-4 col-md-6">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Daftar Semua Nilai
              </h4>
            </div>
            <div className="col-lg-8">
              <div className="d-flex align-items-sm-center flex-sm-row flex-column justify-content-end">
                <button
                  type="button"
                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold color-secondary"
                  onClick={() => {
                    handleDownloadLegder();
                  }}
                  data-joyride="btn-download-rekapan"
                  disabled={legder}
                >
                  <FaCloudDownloadAlt className="me-2 fs-6" />
                  Unduh Legger Nilai
                </button>
                <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
                  <button
                    className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4 mt-sm-0 mt-3`}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-joyride="btn-filter-kelas"
                  >
                    {!jenisRapor || jenisRapor == "tengahSemester"
                      ? "Tengah Semester"
                      : "Akhir Semester"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          setJenisRapor("tengahSemester");
                          localStorage.setItem("jenisRapor", "tengahSemester");
                        }}
                      >
                        Tengah Semester
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          setJenisRapor("akhirSemester");
                          localStorage.setItem("jenisRapor", "akhirSemester");
                        }}
                      >
                        Akhir Semester
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  {/* <th>KKM</th>
                  <th>Nilai</th> */}
                  <th className="text-md-center text-start">Status</th>
                  <th className="text-md-center text-start">{[9349, 9350].includes(sekolah?.id) ? "Dibawah KKTP" : "Dibawah KKM"}</th>
                  <th className="text-md-center text-start">Rekap Nilai</th>
                </tr>
              </thead>
              {keterangan
                ?.sort((a, b) =>
                  ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                )
                ?.map((d, idx) => {
                  const siswa = d?.user;
                  return (
                    <tbody>
                      <tr>
                        <td data-th="No">{idx + 1}</td>
                        <td data-th="Nama">
                          <span className="fw-semibold">{d?.user?.nama}</span>
                        </td>
                        {/* <td data-th="KKM">
                        <span className="color-dark fw-semibold">{kkm}</span>
                      </td>
                      <td data-th="Nilai">
                        <span className="color-dark fw-semibold">
                          {!d?.user?.nilaiUjian?.nilai
                            ? `-`
                            : `${d?.user?.nilaiUjian?.nilai}`}
                        </span>
                      </td> */}
                        <td
                          data-th="Status"
                          className="text-md-center text-start"
                        >
                          <span
                            className={checkLabelStatusTuntasWalas(
                              d,
                              listKKM,
                              totalMapel,
                              jenisRapor,
                              siswa
                            )}
                          >
                            {checkStatusTuntasWalas(
                              d,
                              listKKM,
                              totalMapel,
                              jenisRapor,
                              siswa
                            )}
                          </span>
                        </td>
                        <td
                          data-th="Dibawah KKM"
                          className="text-md-center text-start"
                        >
                          <span
                            className={
                              d?.user?.nilaiSemuaUjian?.length > 0
                                ? checkLabelStatusTuntasWalas(
                                    d,
                                    listKKM,
                                    totalMapel,
                                    jenisRapor,
                                    siswa
                                  )
                                : ""
                            }
                          >
                            {jumlahNilaiDibawah(d, listKKM, siswa, jenisRapor)}
                          </span>
                        </td>
                        <td className="text-md-center text-start">
                          <Link
                            href={`${ssURL}/rombel/${d?.mRombelId}/nilai/${d?.user?.id}?jadwalId=${rombel_id}`}
                          >
                            <a className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DaftarNilaiPengetahuanWalas;
