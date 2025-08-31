import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../client/clientAxios";

const SideNavRekening = ({ ssURL }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column mb-4">
      <li className="nav-item">
        <Link href={`${ssURL}/akun-keuangan`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/akun-keuangan` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-buku-induk.svg`} alt="" className="me-2" />
            Daftar Akun
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/rekening/v2`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/rekening/v2` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-akun-rekening.svg`} alt="" className="me-2" />
            Akun Rekening
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavRekening;
