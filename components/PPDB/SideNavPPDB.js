import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../client/clientAxios";

const SideNavPPDB = ({ ssURL }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column mb-4">
      <li className="nav-item">
        <Link href={`${ssURL}/alur-ppdb`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/alur-ppdb` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-alur-ppdb.svg`} alt="" className="me-2" />
            Alur PPDB
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/jalur-pendaftaran`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/jalur-pendaftaran` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-gelombang-ppdb.svg`} alt="" className="me-2" />
            Jalur Pendaftaran
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/pendaftar-ppdb`}>
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/pendaftar-ppdb` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-pendaftar-ppdb.svg`} alt="" className="me-2" />
            Pendaftar
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`${ssURL}/ujian-penerimaan-ppdb`}>
          <a
            className={`nav-link ${
              (activeMenu == `${ssURL}/ujian-penerimaan-ppdb` ||
                activeMenu == `${ssURL}/ujian-penerimaan-ppdb/soal`) &&
              "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-ujian-penerimaan-ppdb.svg`}
              alt=""
              className="me-2"
            />
            Ujian Penerimaan
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavPPDB;
