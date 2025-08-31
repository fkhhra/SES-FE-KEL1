import { ssURL } from "client/clientAxios";
import useUjian from "hooks/useUjian";
import React from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

export const UjianHeader = () => {
  const { detailUjianData } = useUjian();
  const { ujian, jumlahSoalEsai, jumlahSoalPg, totalNilai } = detailUjianData;
  return (
    <div className="row">
      {/* Header Jadwal Ujian Detail End */}
      <div className="col-md-12">
        <Link href={`${ssURL}/ujian/`}>
          <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
            <FaChevronLeft />
            <span className="ms-2">Kembali</span>
          </a>
        </Link>

        <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
          {/* Card Label & Option Start */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Ujian Label Start */}

            <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
              {ujian?.tipeFormat
                ? ujian?.tipeFormat
                : "Penilaian Akhir Semester 1"}
            </div>

            {/* Ujian Label End */}

            {/* Dropdown Option Start */}

            {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                  <div
                    role="button"
                    id="dropdownOption"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={`/img/icon-dropdown-option.svg`}
                      alt="icon-option"
                      data-joyride="btn-edit-ujian"
                    />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownOption"
                  >
                    <li>
                      <a className="dropdown-item">
                        <FaPen className="me-2" />
                        <span>Edit</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item color-danger">
                        <FaTrashAlt className="me-2" />
                        <span>Hapus</span>
                      </a>
                    </li>
                  </ul>
                </div> */}
            {/* Dropdown Option End */}
          </div>
          {/* Card Label & Option End */}
          {/* Ujian Title Start */}
          <div className="w-75 text-break">
            <h2 className="color-dark fw-black mb-4">
              {ujian?.nama} - Kelas {ujian?.tingkat}
            </h2>
          </div>
          {/* Ujian Title End */}

          {/* Ujian Info Start */}
          <div className="row mt-4">
            <div className="col-md-9 pe-2">
              <div
                className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
                data-joyride="informasi-ujian"
              >
                {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? (
                  <>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">PG</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {`${parseInt(jumlahSoalPg) || 0} Soal`}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">Esai</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {`${parseInt(jumlahSoalEsai) || 0} Soal`}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">
                        Jumlah Soal
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {`${
                          parseInt(jumlahSoalPg) + parseInt(jumlahSoalEsai)
                        } Soal`}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">
                        Jumlah Nilai Soal
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {totalNilai} Poin
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">
                        Jumlah Soal
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {`${ujian?.soalUjian?.length} Soal`}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">
                        Jumlah Nilai Soal
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {totalNilai} Poin
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-3 ps-2">
              <button
                className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100 w-100"
                data-bs-toggle="modal"
                data-bs-target="#modalPratinjauSoal"
                data-joyride="btn-pratinjau-soal"
              >
                <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                  <img
                    src={`/img/icon-pratinjau.svg`}
                    alt="icon-pratinjau"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                  />
                  <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                    Pratinjau Soal
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Ujian Info End */}

          {/* Ujian AKM Info Start */}
          {/* <div className="row mt-4">
                  <div className="col-md-9 pe-2">
                    <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss mb-3 mb-md-0 d-flex flex-wrap justify-content-start">
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-1 order-sm-1">
                          <p className="fs-14-ss color-secondary mb-2">PG</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-5 order-sm-2">
                          <p className="fs-14-ss color-secondary mb-2">
                            Uraian
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-3 order-sm-3">
                          <p className="fs-14-ss color-secondary mb-2">Isian</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-2 order-sm-4">
                          <p className="fs-14-ss color-secondary mb-2">
                            PG. Kompleks
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-4 order-sm-5">
                          <p className="fs-14-ss color-secondary mb-2">
                            Menjodohkan
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-last">
                          <p className="fs-14-ss color-secondary mb-2">
                            Total Nilai
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            100 Poin
                          </p>
                        </div>
                    </div>
                  </div>
                  <div className="col-md-3 ps-2">
                    <div className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100">
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-pratinjau.svg`}
                          alt="icon-tatap-muka"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Mengawas
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

          {/* Ujian AKM Info End */}
        </div>
      </div>
      {/* Header Jadwal Ujian Detail End */}
    </div>
  );
};
