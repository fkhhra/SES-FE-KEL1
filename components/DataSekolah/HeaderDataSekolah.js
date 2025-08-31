import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import useSekolah from "hooks/useSekolah";

const HeaderDataSekolah = ({ children, ssURL, id }) => {
  const { sekolah } = useSekolah();

  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
            style={{
              minHeight: "150px",
              background: `url("/img/bg-header-data-sekolah.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img
                src="/img/icon-data-sekolah.svg"
                alt=""
                style={{ width: "86px", height: "86px" }}
              />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative mb-0">
                Data Sekolah
              </h2>
            </div>
          </div>
          <div
            className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
            style={{ background: `rgba(244,244,247,0.3)` }}
          >
            <div className="kelas-nav d-flex flex-column flex-lg-row">
              <Link href={`${ssURL}/gtk`} as={`${ssURL}/gtk`}>
                <a
                  className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                    activeMenu == `/smartschool/gtk` ||
                    activeMenu == `${ssURL}/siswa`
                      ? "color-primary"
                      : "color-secondary"
                  }`}
                >
                  Identitas
                </a>
              </Link>
              <Link
                href={`${ssURL}/kehadiran-gtk`}
                as={`${ssURL}/kehadiran-gtk`}
              >
                <a
                  className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                    activeMenu == `${ssURL}/kehadiran-gtk` ||
                    activeMenu == `${ssURL}/kehadiran-siswa`
                      ? "color-primary"
                      : "color-secondary"
                  }`}
                >
                  Kehadiran
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card card-ss mb-4">
          <ul className="nav d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
            <div className="d-flex flex-column flex-lg-row">
              {(router?.pathname == `${ssURL}/gtk` ||
                router?.pathname == `${ssURL}/siswa`) && (
                <Link href={`${ssURL}/gtk`} as={`${ssURL}/gtk`}>
                  <a
                    className={`nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary ${
                      activeMenu == `${ssURL}/gtk` ? "active" : ""
                    }`}
                  >
                    {sekolah?.tingkat == "kampus" ? "Dosen" : "Guru"}
                  </a>
                </Link>
              )}
              {(router?.pathname == `${ssURL}/kehadiran-gtk` ||
                router?.pathname == `${ssURL}/kehadiran-siswa`) && (
                <Link
                  href={`${ssURL}/kehadiran-gtk`}
                  as={`${ssURL}/kehadiran-gtk`}
                >
                  <a
                    className={`nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary ${
                      activeMenu == `${ssURL}/kehadiran-gtk` ? "active" : ""
                    }`}
                  >
                    {sekolah?.tingkat == "kampus" ? "Dosen" : "Guru"}
                  </a>
                </Link>
              )}
              {(router?.pathname == `${ssURL}/gtk` ||
                router?.pathname == `${ssURL}/siswa`) && (
                <Link href={`${ssURL}/siswa`} as={`${ssURL}/siswa`}>
                  <a
                    className={`nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary ${
                      activeMenu == `${ssURL}/siswa` ? "active" : ""
                    }`}
                  >
                    {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                  </a>
                </Link>
              )}
              {(router?.pathname == `${ssURL}/kehadiran-gtk` ||
                router?.pathname == `${ssURL}/kehadiran-siswa`) && (
                <Link
                  href={`${ssURL}/kehadiran-siswa`}
                  as={`${ssURL}/kehadiran-siswa`}
                >
                  <a
                    className={`nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary ${
                      activeMenu == `${ssURL}/kehadiran-siswa` ? "active" : ""
                    }`}
                  >
                    {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                  </a>
                </Link>
              )}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderDataSekolah;
