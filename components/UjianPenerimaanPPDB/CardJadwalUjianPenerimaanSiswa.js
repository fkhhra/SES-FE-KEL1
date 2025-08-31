import React, { useEffect, useState } from "react";
import {
  FaCalendarDay,
  FaClock,
  FaMapMarkerAlt,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import Link from "next/link";
import { momentPackage } from "utilities/HelperUtils";
import useSekolah from "hooks/useSekolah";

const CardJadwalUjianPenerimaanSiswa = ({
  ssURL,
  mediaTes,
  data,
  checkPembayaran,
  checkPembayaranTintaEmas,
  setClickDetailJadwalUjian,
  subnav,
}) => {
  const { sekolah } = useSekolah();
  const [durasi, setDurasi] = useState("");
  useEffect(() => {
    if (mediaTes == "ss") {
      const loop = setInterval(() => {
        const temp = momentPackage.duration(
          momentPackage(data?.waktuDitutup).diff(momentPackage()),
          "milliseconds"
        );

        // setDurasi(`${temp.hours()} : ${temp.minutes()} : ${temp.seconds()}`);
        setDurasi(`${temp.humanize()}`);
      }, 1000);
      return () => {
        clearInterval(loop);
      };
    }
  }, [data, mediaTes]);

  return (
    <div
      className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer mb-4"
      // data-joyride={`${idx === 0 ? "card-jadwal-ujian" : ""}`}
    >
      {/* Card Label & Option Start */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Jadwal Ujian Label Start */}

        <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
          {mediaTes == "langsung"
            ? "Ujian Bertemu Langsung"
            : mediaTes == "online"
            ? "Ujian Diluar Smarteschool"
            : mediaTes == "ss"
            ? "Ujian Dari Smarteschool"
            : ""}
        </div>

        {/* Jadwal Ujian Label End */}

        {/* Dropdown Option Start */}
        {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
          <div
            role="button"
            id="dropdownOption"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownOption"
          >
            <li
              data-bs-toggle="modal"
              data-bs-target="#modalBuatJadwalUjian"
              // onClick={() =>
              //   onClickEdit(
              //     dataJadwalUjian?.jadwalUjian,
              //     dataJadwalUjian?.rombel
              //   )
              // }
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li
            // onClick={() =>
            //   handleDeleteJadwalUjianData(
            //     dataJadwalUjian?.jadwalUjian?.id
            //   )
            // }
            >
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
      {/* <Link
        href={`${ssURL}/ujian-penerimaan-ppdb/[id]/${
          mediaTes == "langsung" || mediaTes == "online"
            ? "diluar-smarteschool"
            : mediaTes == "ss"
            ? "ujian-smarteschool"
            : ""
        }`}
        as={`${ssURL}/ujian-penerimaan-ppdb/1/${
          mediaTes == "langsung" || mediaTes == "online"
            ? "diluar-smarteschool"
            : mediaTes == "ss"
            ? "ujian-smarteschool"
            : ""
        }`}
      > */}
      <a className="w-100 text-decoration-none">
        <div className="w-75 text-break">
          <h4 className="color-dark fw-black mb-2">{data?.nama}</h4>
          <h6 className="fw-semibold mb-0 color-secondary">
            {data?.info?.gelombang?.jalur?.nama} - {data?.info?.gelombang?.nama}
          </h6>
        </div>

        <div className="d-flex align-items-center justify-content-between flex-wrap color-primary mt-4">
          <div className="d-flex flex-wrap">
            <div className="d-flex align-items-center me-4 mb-2">
              <FaCalendarDay className="me-2" />
              {/* <span className="fs-14-ss fw-semibold">
              {dataJadwalUjian?.tanggalUjian ||
              dataJadwalUjian?.jadwalUjian?.tanggalUjian}
              </span> */}
              {momentPackage(data?.waktuDibuka).format("DD MMM YYYY HH:mm")} -{" "}
              {momentPackage(data?.waktuDitutup).format("DD MMM YYYY HH:mm")}
            </div>
            {/* <div className="d-flex align-items-center me-4 mb-2">
              <FaClock className="me-2" /> */}
            {/* <span className="fs-14-ss fw-semibold">
              {dataJadwalUjian?.waktuUjian ||
              dataJadwalUjian?.jadwalUjian?.waktuUjian}
              </span> */}
            {/* 07:00 - 09:00 AM
            </div> */}
            {mediaTes == "ss" ? (
              <div className="label-ss bg-light-primary fw-bolder  rounded-pill mb-2 d-flex">
                {/* <Countdown
                value={moment(
                  dataJadwalUjian?.waktuDitutup ||
                    dataJadwalUjian?.jadwalUjian?.waktuDitutup
                )}
                format="HH:mm:ss"
              /> */}
                <span className="fs-14-ss ms-1 mb-0">Tersisa {durasi}</span>
              </div>
            ) : (
              ""
            )}
            {mediaTes == "langsung" ? (
              <div className="d-flex align-items-center me-4 mb-2">
                <FaMapMarkerAlt className="me-2" />
                {/* <span className="fs-14-ss fw-semibold">
          {dataJadwalUjian?.waktuUjian ||
          dataJadwalUjian?.jadwalUjian?.waktuUjian}
          </span> */}
                {data?.lokasi}
              </div>
            ) : (
              ""
            )}
            {mediaTes == "langsung" || mediaTes == "online" ? (
              <div className="label-ss label-light-danger-ss fw-semibold rounded-pill mb-2 d-flex">
                <span className="fs-14-ss mb-0">Perlu Unggah Data Nilai</span>
              </div>
            ) : (
              ""
            )}
          </div>
          {sekolah?.id == 14 && (subnav !== 'akan-datang' && subnav !== 'sudah-selesai')  ? (
            checkPembayaranTintaEmas ? (
              <>
                {mediaTes == "online" ? (
                  <button
                    className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                    onClick={() => window.open(data?.link)}
                  >
                    Kerjakan Ujian
                  </button>
                ) : mediaTes == "ss" ? (
                  <button
                    className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                    data-bs-toggle="modal"
                    data-bs-target="#modalInstruksiUjian"
                    onClick={() => setClickDetailJadwalUjian(data)}
                  >
                    Kerjakan Ujian
                  </button>
                ) : (
                  <button
                    className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                    onClick={() => {}}
                  >
                    Ujian dilaksanakan di {data?.lokasi}
                  </button>
                )}
              </>
            ) : null
          ) : !checkPembayaran && (subnav !== 'akan-datang' && subnav !== 'sudah-selesai') ? (
            <>
              {mediaTes == "online" ? (
                <button
                  className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                  onClick={() => window.open(data?.link)}
                >
                  Kerjakan Ujian
                </button>
              ) : mediaTes == "ss" ? (
                <button
                  className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalInstruksiUjian"
                  onClick={() => setClickDetailJadwalUjian(data)}
                >
                  Kerjakan Ujian
                </button>
              ) : (
                <button
                  className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                  onClick={() => {}}
                >
                  Ujian dilaksanakan di {data?.lokasi}
                </button>
              )}
            </>
          ) : null}
        </div>
      </a>
      {/* </Link> */}
      {/* Date & Time Jadwal Ujian End */}
    </div>
  );
};

export default CardJadwalUjianPenerimaanSiswa;
