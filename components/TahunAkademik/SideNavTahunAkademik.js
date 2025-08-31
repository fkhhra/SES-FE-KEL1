import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const SideNavTahunAkademik = ({ ssURL, sekolah }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  const { id: taId } = router.query;

  useEffect(() => {
    setActiveMenu(router.asPath);
  }, [router.asPath]);

  return (
    <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column mb-4">
      <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/mata-pelajaran`}
          as={`${ssURL}/tahun-akademik/${taId}/mata-pelajaran`}
        >
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/tahun-akademik/${taId}/mata-pelajaran` ||
              activeMenu ==
                `${ssURL}/tahun-akademik/${taId}/mata-pelajaran?nav=kelompok-a` ||
              activeMenu ==
                `${ssURL}/tahun-akademik/${taId}/mata-pelajaran?nav=kelompok-b` ||
              activeMenu ==
                `${ssURL}/tahun-akademik/${taId}/mata-pelajaran?nav=kelompok-c`
                ? "active"
                : ""
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img src={`/img/icon-side-nav-mapel.svg`} alt="" className="me-2" />
            {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"}
          </a>
        </Link>
      </li>
      {/* <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/jurusan`}
          as={`${ssURL}/tahun-akademik/1/jurusan`}
        >
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/tahun-akademik/1/jurusan` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-side-nav-jurusan.svg`}
              alt=""
              className="me-2"
            />
            Jurusan
          </a>
        </Link>
      </li> */}
      <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/rombel`}
          as={`${ssURL}/tahun-akademik/${taId}/rombel`}
        >
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/tahun-akademik/${taId}/rombel` && "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-side-nav-rombel.svg`}
              alt=""
              className="me-2"
            />
            Rombel
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/jam-mengajar?hari=1`}
          as={`${ssURL}/tahun-akademik/${taId}/jam-mengajar?hari=1`}
        >
          <a
            className={`nav-link ${
              activeMenu ==
                `${ssURL}/tahun-akademik/${taId}/jam-mengajar?hari=1` &&
              "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-side-nav-jam-mengajar.svg`}
              alt=""
              className="me-2"
            />
            Jam Mengajar
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/jadwal-mengajar`}
          as={`${ssURL}/tahun-akademik/${taId}/jadwal-mengajar`}
        >
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/tahun-akademik/${taId}/jadwal-mengajar` &&
              "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-side-nav-jadwal-mengajar.svg`}
              alt=""
              className="me-2"
            />
            Jadwal Mengajar
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          href={`${ssURL}/tahun-akademik/[id]/surat-keputusan`}
          as={`${ssURL}/tahun-akademik/${taId}/surat-keputusan`}
        >
          <a
            className={`nav-link ${
              activeMenu == `${ssURL}/tahun-akademik/${taId}/surat-keputusan` &&
              "active"
            } color-dark fw-bold fs-18-ss d-flex align-items-center px-3 mb-3`}
            aria-current="page"
          >
            <img
              src={`/img/icon-side-nav-surat-keputusan.svg`}
              alt=""
              className="me-2"
            />
            Surat Keputusan
          </a>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavTahunAkademik;
