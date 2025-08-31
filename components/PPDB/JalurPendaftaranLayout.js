import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const JalurPendaftaranLayout = ({ children, ssURL, id, jalur }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navMenus = [
    {
      href: `${ssURL}/jalur-pendaftaran/[id]/informasi-umum`,
      as: `${ssURL}/jalur-pendaftaran/${id}/informasi-umum`,
      text: "Informasi Umum",
      active: `${ssURL}/jalur-pendaftaran/[id]/informasi-umum`,
    },
    {
      href: `${ssURL}/jalur-pendaftaran/[id]/gelombang`,
      as: `${ssURL}/jalur-pendaftaran/${id}/gelombang`,
      text: "Gelombang",
      active: `${ssURL}/jalur-pendaftaran/[id]/gelombang`,
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <Link href={`${ssURL}/jalur-pendaftaran`}>
            <a className="text-decoration-none fw-bolder color-primary">
              <FaChevronLeft />
              <span className="ms-2">Kembali</span>
            </a>
          </Link>

          <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 my-4">
            <div
              className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
              style={{
                minHeight: "150px",
                background: `url("/img/bg-jalur-pendaftaran-ppdb.png")`,
                backgroundPosition: "right bottom",
              }}
            >
              <div
                className="rounded-circle shadow-primary-ss"
                style={{ width: "86px", height: "86px" }}
              >
                <img src="/img/icon-jalur-pendaftaran-ppdb.svg" alt="" />
              </div>
              <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                  {jalur?.nama ? jalur?.nama?.toLowerCase() : "-"}
                </h2>
                <p className="fs-6 fw-bold mb-0">
                  {jalur?.gelombang?.length} Gelombang
                </p>
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
      {children}
    </>
  );
};

export default JalurPendaftaranLayout;
