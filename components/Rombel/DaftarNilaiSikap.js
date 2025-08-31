import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaClone, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import useUser from "../../hooks/useUser";
import { checkKeteranganSikap } from "../../utilities/RaporUtils";

const DaftarNilaiSikap = ({ keterangan, sikapsosial, sikapspiritual }) => {
  const { user } = useUser();
  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  return (
    <>
      <div className="card card-ss">
        {/* <div className="card-header p-4 card-header-ss">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              Daftar Nilai Sikap
            </h4>
          </div>
        </div> */}
        <div className="card-header p-4 card-header-ss">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-sm-6">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Daftar Nilai Sikap
              </h4>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-sm-center flex-sm-row flex-column justify-content-end">
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
                  <th>Predikat</th>
                  <th>Keterangan</th>
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
                        <td data-th="Nama">
                          <span className="fw-semibold">
                            {d?.user?.rekapSikap?.predikat?.predikat || "-"}
                          </span>
                        </td>
                        <td data-th="Keterangan">
                          <p className="fw-semibold mb-0">
                            {!d?.user?.rekapSikap?.mSikapDitunjukkanId ||
                            !d?.user?.rekapSikap?.mSikapDitingkatkanId
                              ? `-`
                              : `
                          Peserta didik telah menunjukkan sikap
                          ${checkKeteranganSikap(
                            d?.user?.rekapSikap?.mSikapDitunjukkanId,
                            sikapsosial
                          )}. Namun sikap ${checkKeteranganSikap(
                                  d?.user?.rekapSikap?.mSikapDitingkatkanId,
                                  sikapsosial
                                )} masih perlu ditingkatkan`}
                          </p>
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

export default DaftarNilaiSikap;
