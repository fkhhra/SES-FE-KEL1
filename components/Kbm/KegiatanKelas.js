import React from "react";
import Link from "next/link";
import { FaClock } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";

const KegiatanKelas = ({ data, disabled = false, type }) => {
  const { meta } = data || {};
  const { totalAbsen, totalSiswa, totalRespon } = meta || {};

  const getIconSource = () => {
    switch (type) {
      case "tatap-maya":
        return "/img/icon-kegiatan-tatap-maya.svg";
      case "materi":
        return "/img/icon-kegiatan-materi.svg";
      case "tugas":
      case "tugas-kuis":
        return disabled
          ? "/img/icon-kegiatan-tugas-disabled.svg"
          : "/img/icon-kegiatan-tugas.svg";
      default:
        break;
    }
  };

  const getKegiatanTitle = () => {
    const tugasJudul = data?.tugas?.judul || data?.timeline?.tugas?.judul;

    switch (type) {
      case "tatap-maya":
        return "Tatap Maya";
      case "materi":
        return `Materi - ${data?.bab?.judul}`;
      case "tugas":
        return `Tugas - ${tugasJudul}`;
      case "tugas-kuis":
        return `Tugas Kuis - ${tugasJudul}`;
    }
  };

  const getKegiatanSubTitle = () => {
    const tanggalPengumpulan =
      data?.tugas?.tanggalPengumpulan ||
      data?.timeline?.tugas?.tanggalPengumpulan;
    const waktuPengumpulan =
      data?.tugas?.waktuPengumpulan || data?.timeline?.tugas?.waktuPengumpulan;

    switch (type) {
      case "materi":
        return `BAB ${data?.babNumber} - ${data?.judul}`;
      case "tugas":
      case "tugas-kuis":
        return disabled ? (
          "Belum Membaca Materi"
        ) : (
          <>
            <FaClock className="me-2 mb-1" />
            {tanggalPengumpulan
              ? `Batas Pengumpulan ${momentPackage(
                  momentPackage(tanggalPengumpulan)
                    .add(7, "hours")
                    .format("YYYY-MM-DD ") + waktuPengumpulan
                ).fromNow()}`
              : "Batas Pengumpulan Tidak Ada"}
          </>
        );
    }
  };

  const getCountClasses = () => {
    if (type === "tatap-maya") {
      if (totalAbsen === 0) {
        return "bg-soft-danger color-danger";
      } else if (totalAbsen > 0 && totalAbsen !== totalSiswa) {
        return "bg-soft-primary color-primary";
      } else {
        return "bg-soft-success color-success";
      }
    }

    if (type === "tugas" || type === "tugas-kuis") {
      if (totalRespon === 0) {
        return "bg-soft-danger color-danger";
      } else if (totalRespon > 0 && totalRespon !== totalSiswa) {
        return "bg-soft-primary color-primary";
      } else {
        return "bg-soft-success color-success";
      }
    }

    if (type === "materi") {
      if (data?.sudahBaca === 0) {
        return "bg-soft-danger color-danger";
      } else if (
        data?.sudahBaca > 0 &&
        data?.sudahBaca !== data?.anggotaRombel?.length
      ) {
        return "bg-soft-primary color-primary";
      } else {
        return "bg-soft-success color-success";
      }
    }
  };

  const getCountData = () => {
    if (type === "tatap-maya") {
      return `${totalAbsen} / ${totalSiswa}`;
    }

    if (type === "tugas" || type === "tugas-kuis") {
      return `${totalRespon} / ${totalSiswa}`;
    }

    if (type === "materi") {
      return `${data?.sudahBaca} / ${data?.anggotaRombel?.length}`;
    }

    return null;
  };
  return (
    <div
      className={`kegiatan-items py-3 pointer rounded-ss mb-4 px-4 ${
        disabled ? "disabled" : ""
      }`}
    >
      <div className="row">
        <div className="col-lg-9 mb-lg-0 mb-5">
          <a className="text-decoration-none">
            <div className="d-flex align-items-md-center flex-lg-nowrap flex-wrap flex-md-row flex-column">
              <img
                src={getIconSource()}
                alt="icon-kegiatan"
                width="50px"
                height="50px"
                className="me-lg-3 mb-lg-0 mb-4"
              />
              <div className="w-100">
                <h6
                  className={`fs-18-ss color-dark fw-bold text-truncate ${
                    type == "tatap-maya" ? "mb-0" : "mb-1"
                  }`}
                >
                  {getKegiatanTitle()}
                </h6>
                <p
                  className={`
                    fs-14-ss fw-semibold color-secondary text-truncate mb-0
                    ${
                      type == "tugas" || type == "tugas-kuis"
                        ? data?.tugas?.tanggalPengumpulan ||
                          data?.timeline?.tugas?.tanggalPengumpulan
                          ? "color-danger"
                          : "color-secondary"
                        : ""
                    }
                  `}
                >
                  {getKegiatanSubTitle()}
                </p>
              </div>
            </div>
          </a>
        </div>
        <div className="col-lg-3 d-flex justify-content-end align-items-center">
          <a className="text-decoration-none">
            <span
              className={`p-1 d-flex align-items-center justify-content-center rounded-pill fs-12-ss fw-bold ${getCountClasses()}`}
              style={{ width: "90px", height: "24px" }}
            >
              {getCountData()}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default KegiatanKelas;
