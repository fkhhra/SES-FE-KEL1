import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const HeaderAnalisisKeuangan = ({ children, ssURL, id, judul }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navMenus = [
    {
      href: `${ssURL}/analisis-keuangan/data-laporan`,
      as: `${ssURL}/analisis-keuangan/data-laporan`,
      text: "Data Laporan",
      active: `${ssURL}/analisis-keuangan/data-laporan`,
    },
    {
      href: `${ssURL}/analisis-keuangan/template-laporan`,
      as: `${ssURL}/analisis-keuangan/template-laporan`,
      text: "Template Laporan",
      active: `${ssURL}/analisis-keuangan/template-laporan`,
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
            style={{
              minHeight: "150px",
              background: `url("/img/bg-header-analisis-keuangan.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img src="/img/icon-analisis-keuangan.svg" alt="" />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                Laporan Analisis
              </h2>
              <p className="fs-6 fw-bold mb-0">Realisasi</p>
            </div>
          </div>
          <div
            className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
            style={{ background: `rgba(244,244,247,0.3)` }}
          >
            <div className="kelas-nav d-flex flex-column flex-lg-row">
              {navMenus.map((d) => {
                return (
                  <Link href={d.href} as={d.as}>
                    <a
                      className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                        activeMenu == d.active
                          ? "color-primary"
                          : "color-secondary"
                      }`}
                      data-joyride={d.dataJoyride || ""}
                    >
                      {d.text}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderAnalisisKeuangan;
