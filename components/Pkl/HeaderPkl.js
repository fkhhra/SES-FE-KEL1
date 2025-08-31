import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { getPenerimaanPkl } from "client/PenerimaanClient";
const HeaderPkl = ({ children, ssURL, id, judul }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [totalPatner, setTotalPatner] = useState([]);
  const [totalSiswa, setTotalSiswa] = useState([]);

  const _getPenerimaanPklHeader = async () => {
    const { data, error } = await getPenerimaanPkl();

    if (data) {
      setTotalSiswa(data?.totalSiswa);
      setTotalPatner(data?.totalPartner);
    }
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getPenerimaanPklHeader();
  }, []);

  const navMenus = [
    {
      href: `${ssURL}/penerimaan/pkl`,
      as: `${ssURL}/penerimaan/pkl`,
      text: "PKL l",
      active: `${ssURL}/penerimaan/pkl`,
    },
    {
      href: `${ssURL}/penerimaan/rekrutmen`,
      as: `${ssURL}/penerimaan/rekrutmen`,
      text: "Rekrutmen",
      active: `${ssURL}/penerimaan/rekrutmen`,
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
              background: `url("/img/bg-header-pkl.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img
                src="/img/icon-perusahaan.svg"
                style={{ width: "86px", height: "86px" }}
                alt=""
              />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                {judul}
              </h2>
              <p className="fs-6 fw-bold mb-0">Praktik Kerja Lapangan</p>
            </div>
          </div>
          <div className="row mx-4 mb-4">
            <div
              className="rounded-ss px-4 py-3 h-100"
              style={{ backgroundColor: `#F8F8FB` }}
            >
              <div className="d-flex flex-sm-row flex-column justify-content-md-start justify-content-between">
                <div className="d-flex flex-md-row flex-column me-md-0 me-auto">
                  {judul == "Perusahaan" ? (
                    <>
                      <div className="pe-4">
                        <h1 className="fs-6 fw-bold mb-1 ">
                          Partner Perusahaan
                        </h1>
                        <h1
                          className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                          style={{ color: `#4890fe` }}
                        >
                          {totalPatner || 0} Perusahaan
                        </h1>
                      </div>
                      <div className="px-md-4">
                        <h1 className="fs-6 fw-bold mb-1 ">Penerimaan</h1>
                        <h1
                          className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                          style={{ color: `#4890fe` }}
                        >
                          {totalSiswa || 0} Siswa
                        </h1>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pe-4">
                        <h1 className="fs-6 fw-bold mb-1 ">
                          Partner Perusahaan
                        </h1>
                        <h1
                          className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                          style={{ color: `#4890fe` }}
                        >
                          {totalPatner || 0} Perusahaan
                        </h1>
                      </div>
                      <div className="px-md-4">
                        <h1 className="fs-6 fw-bold mb-1 ">Penerimaan PKL</h1>
                        <h1
                          className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                          style={{ color: `#4890fe` }}
                        >
                          {totalSiswa || 0} Siswa
                        </h1>
                      </div>
                      <div className="px-md-4">
                        <h1 className="fs-6 fw-bold mb-1 ">
                          Penerimaan Rekrutmen
                        </h1>
                        <h1
                          className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                          style={{ color: `#4890fe` }}
                        >
                          {totalSiswa || 0} Siswa
                        </h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
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

export default HeaderPkl;
