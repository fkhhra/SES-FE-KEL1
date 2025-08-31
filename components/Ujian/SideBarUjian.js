import { ssURL } from "client/clientAxios";
import React from "react";
import Link from "next/link";

const SideBarUjian = ({ activeMenu }) => {
  return (
    <>
      <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
        <li className="nav-item">
          <Link href={`${ssURL}/ujian`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/ujian` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img
                src={`/img/icon-nav-daftar-ujian.svg`}
                alt=""
                className="me-2"
              />
              Bank Soal
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/jadwal-ujian`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/jadwal-ujian` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img
                src={`/img/icon-nav-jadwal-ujian.svg`}
                alt=""
                className="me-2"
              />
              Jadwal Ujian
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/analisis-soal-ujian`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/analisis-soal-ujian` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img
                src={`/img/icon-nav-analisis-soal-ujian.svg`}
                alt=""
                className="me-2"
              />
              Analisis Soal
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/sampah-ujian`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/sampah-ujian` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img
                src={`/img/icon-nav-daftar-ujian.svg`}
                alt=""
                className="me-2"
              />
              Sampah Ujian
            </a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default SideBarUjian;
