import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaClone, FaPen, FaPlus, FaTrashAlt, FaUndo } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import { getRaporNilai } from "../../client/RaporClient";
import useUser from "../../hooks/useUser";
import {
  checkLabelStatusTuntas,
  checkStatusTuntas,
} from "../../utilities/RaporUtils";
import useSekolah from "hooks/useSekolah";

const DaftarNilaiPengetahuan = ({
  keterangan,
  rombel_id,
  kkm,
  mapelId,
  getDetailRombelData,
}) => {
  const { user } = useUser();
  const { sekolah } = useSekolah();

  const refreshNilai = async () => {
    await Promise.all(
      keterangan.map((d) => {
        return getRaporNilai(mapelId, d.user.id);
      })
    );

    await getDetailRombelData();
  };

  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);

  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-sm-4 p-3 card-header-ss">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-md-6">
              <h4 className="fw-extrabold color-dark mb-md-0 mb-3">
                Daftar Nilai Pengetahuan
              </h4>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end justify-content-between">
                <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
                  <button
                    className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold`}
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
                <button
                  className="btn btn-outline-primary btn-outline-primary-ss p-1 ms-4 rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                  onClick={() => refreshNilai()}
                >
                  <FaUndo className="fs-6" />
                </button>
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
                  <th className="text-md-center text-start">{[9349, 9350].includes(sekolah?.id) ? 'KKTP' : 'KKM'}</th>
                  <th className="text-md-center text-start">Nilai</th>
                  <th className="text-md-center text-start">Status</th>
                  {/* <th className="text-md-center text-start">Dibawah KKM</th> */}
                  <th className="text-md-center text-start">Rekap Nilai</th>
                </tr>
              </thead>
              {keterangan
                ?.sort((a, b) =>
                  ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                )
                ?.map((d, idx) => {
                  return (
                    <tbody>
                      <tr>
                        <td data-th="No">{idx + 1}</td>
                        <td data-th="Nama">
                          <span className="fw-semibold">{d?.user?.nama}</span>
                        </td>
                        <td className="text-md-center text-start" data-th="KKM">
                          <span className="color-dark fw-semibold">{kkm}</span>
                        </td>
                        <td
                          className="text-md-center text-start"
                          data-th="Nilai"
                        >
                          <span className="color-dark fw-semibold">
                            {!d?.user?.nilaiUjian?.nilai
                              ? `-`
                              : `${d?.user?.nilaiUjian?.nilai}`}
                          </span>
                        </td>
                        <td
                          data-th="Status"
                          className="text-md-center text-start"
                        >
                          <span
                            className={checkLabelStatusTuntas(
                              d?.user?.nilaiUjian?.nilai,
                              kkm
                            )}
                          >
                            {checkStatusTuntas(d?.user?.nilaiUjian?.nilai, kkm)}
                          </span>
                        </td>
                        {/* <td
                        data-th="Status"
                        className="text-md-center text-start"
                      >
                        <span
                          className={checkLabelStatusTuntas(
                            d?.user?.nilaiUjian?.nilai,
                            kkm
                          )}
                        >
                          {checkStatusTuntas(d?.user?.nilaiUjian?.nilai, kkm)}
                          {d?.user?.__meta__?.jumlahMapelDikerjakan}{" "}
                          nilai
                        </span>
                      </td> */}
                        <td className="text-md-center text-start">
                          <Link
                            href={`${ssURL}/rapor-nilai/${d?.user?.id}?mapelId=${mapelId}&jadwalId=${rombel_id}&nilai=pengetahuan`}
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

export default DaftarNilaiPengetahuan;
