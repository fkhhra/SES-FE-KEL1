import { ssURL } from "client/clientAxios";
import React from "react";
import Link from "next/link";

const SideBar = ({ activeMenu }) => {
  return (
    <div>
      <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
        <li className="nav-item">
          <Link href={`${ssURL}/surat-masuk`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/surat-masuk` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-surat-masuk.svg`} alt="" className="me-2" />
              Surat Masuk
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/disposisi`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/disposisi` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-disposisi.svg`} alt="" className="me-2" />
              Disposisi
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href={`${ssURL}/surat-keluar`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/surat-keluar` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-surat-keluar.svg`} alt="" className="me-2" />
              Surat Keluar
            </a>
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link href={`${ssURL}/surat-keputusan`}>
            <a
              className={`nav-link ${
                activeMenu == `${ssURL}/surat-keputusan` && "active"
              } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
              aria-current="page"
            >
              <img src={`/img/icon-surat-keluar.svg`} alt="" className="me-2" />
              Surat Keputusan
            </a>
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default SideBar;
