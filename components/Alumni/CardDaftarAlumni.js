import React from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { ssURL } from "client/clientAxios";

const CardDaftarAlumni = ({
  status,
  isTerverifikasi,
  isScollMenu,
  dataAlumni,
}) => {
  return (
    <div
      className={`${
        isScollMenu ? "card-scroll-menu" : "card card-ss"
      } border border-1 border-white rounded-ss p-3 position-relative card-daftar-alumni pointer
                `}
      // className={`border border-1 border-light-secondary rounded-ss p-3 position-relative card-rapor-siswa pointer
      // ${active && " bg-soft-primary"}
      // `}
    >
      {isTerverifikasi && (
        <div
          className="position-absolute icon-delete"
          style={{
            top: "10px",
            right: "10px",
          }}
        >
          <div
            className="rounded-circle bg-danger d-flex justify-content-center align-items-center text-white"
            style={{
              width: "30px",
              height: "30px",
              boxShadow: "0 5px 15px rgba(255, 112, 79, 0.5)",
            }}
            // onClick={() =>
            //   setFormData({
            //     ...formData,
            //     userId: data?.user?.id,
            //     avatar: data?.user?.avatar,
            //   })
            // }
            data-bs-toggle="modal"
            data-bs-target="#modalUbahFotoProfil"
          >
            <FaTrashAlt />
          </div>
        </div>
      )}
      <Link
        href={`${ssURL}/alumni/${dataAlumni?.id}`}
        as={`${ssURL}/alumni/${dataAlumni?.id}`}
      >
        <div className="d-flex align-items-stretch">
          <img
            //   src={data?.user?.avatar || "/img/cover-sma-smk.svg"}
            src={
              dataAlumni?.user?.avatar != null
                ? dataAlumni?.user?.avatar
                : "/img/cover-sma-smk.svg"
            }
            className="me-3 rounded-ss img-fit-cover"
            width="75px"
            height="100px"
            alt=""
          />
          <div className="flex-grow-1">
            <div className="h-100 d-flex flex-column justify-content-between">
              <div>
                <p className="fs-18-ss fw-extrabold mb-0 color-dark clamp-1">
                  {dataAlumni?.user?.nama}
                </p>
                <p className="fs-14-ss fw-semi-bold clamp-2 mb-0">
                  {/* Sistem Informatika Jaringan dan Aplikasi */}
                  {dataAlumni?.jurusan}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className={`fs-12-ss fw-semibold color-primary`}>
                  Angkatan {dataAlumni?.tahunMasuk}
                </span>

                <img
                  src={`/img/icon-alumni-${
                    status == "bekerja"
                      ? "bekerja"
                      : status == "kuliah"
                      ? "kuliah"
                      : status == "mencari-kerja"
                      ? "mencari-kerja"
                      : status == "berwirausaha"
                      ? "berwirausaha"
                      : ""
                  }.svg`}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  //   );
};

export default CardDaftarAlumni;
