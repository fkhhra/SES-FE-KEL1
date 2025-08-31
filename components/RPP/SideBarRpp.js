import { ssURL } from "client/clientAxios";
import React from "react";
import Link from "next/link";

const SideBarRpp = ({ activeMenu }) => {
  return (
    <div>
      <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
        <li className="nav-item">
          <Link href={`${ssURL}/rpp-saya`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/rpp-saya` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              RPP Saya
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/rpp`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/rpp` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-cari-proyek.svg`} alt="" className="me-2" />
              Cari RPP
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/silabus`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/silabus` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Silabus saya
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/perangkat`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/perangkat` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Perangkat Pembelajaran
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/modul`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/modul` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Modul
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/atp`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/atp` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Alur Tujuan Pembelajaran
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/cp`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/cp` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Capaian Pembelajaran
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/laporan-bulanan-guru`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/laporan-bulanan-guru` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-rpp-saya.svg`} alt="" className="me-2" />
              Laporan Bulanan
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBarRpp;
