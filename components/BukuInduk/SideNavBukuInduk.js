import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SideNavBukuInduk = ({ ssURL }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
      <li className="nav-item">
        <Link href={`${ssURL}/buku-induk`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/buku-induk` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-buku-induk.svg`} alt="" className="me-2" />
            Buku Induk
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/rapor-buku-induk`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/rapor-buku-induk` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-rapor-buku-induk.svg`}
              alt=""
              className="me-2"
            />
            Rapor
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/predikat-nilai`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/predikat-nilai` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-predikat-nilai.svg`} alt="" className="me-2" />
            Predikat Nilai
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/bobot-nilai`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/bobot-nilai` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-bobot-nilai.svg`} alt="" className="me-2" />
            Bobot Nilai
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/leger-nilai`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/leger-nilai` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-leger-nilai.svg`} alt="" className="me-2" />
            Leger Nilai
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavBukuInduk;
