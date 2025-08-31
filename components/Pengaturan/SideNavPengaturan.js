import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../client/clientAxios";

const SideNavPengaturan = ({ ssURL }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column mb-4">
      <li className="nav-item">
        <Link href={`${ssURL}/pengaturan/keamanan`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/pengaturan/keamanan` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-pengaturan-keamanan.svg`}
              alt=""
              className="me-2"
            />
            Keamanan
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/pengaturan/kontak`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/pengaturan/kontak` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-pengaturan-kontak.svg`}
              alt=""
              className="me-2"
            />
            Kontak
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/pengaturan/fitur`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/pengaturan/fitur` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-pengaturan-fitur.svg`}
              alt=""
              className="me-2"
            />
            Fitur
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavPengaturan;
