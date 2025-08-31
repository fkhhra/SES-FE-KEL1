import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const HeaderRealisasiKeuangan = ({ children, ssURL, id, judul, user }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.asPath);
  }, [router.asPath]);

  let navMenus;
  if (!user?.bagian) {
    navMenus = [
      {
        href: `${ssURL}/akun-keuangan`,
        as: `${ssURL}/akun-keuangan`,
        text: "Daftar Akun",
        active: `${ssURL}/akun-keuangan`,
      },
      {
        href: `${ssURL}/rekening/v2`,
        as: `${ssURL}/rekening/v2`,
        text: "Akun Rekening",
        active: `${ssURL}/rekening/v2`,
      },
      {
        href: `${ssURL}/mutasi/v2`,
        as: `${ssURL}/mutasi/v2`,
        text: "Transaksi",
        active: `${ssURL}/mutasi/v2`,
      },
      {
        href: `${ssURL}/laporan-keuangan`,
        as: `${ssURL}/laporan-keuangan`,
        text: "Laporan",
        active: `${ssURL}/laporan-keuangan`,
      },
    ];
  } else if (user?.bagian == "keuangan") {
    navMenus = [
      {
        href: `${ssURL}/akun-keuangan`,
        as: `${ssURL}/akun-keuangan`,
        text: "Daftar Akun",
        active: `${ssURL}/akun-keuangan`,
      },
      {
        href: `${ssURL}/mutasi/v2`,
        as: `${ssURL}/mutasi/v2`,
        text: "Transaksi",
        active: `${ssURL}/mutasi/v2`,
      },
    ];
  } else if (user?.bagian == "aproval") {
    navMenus = [
      {
        href: `${ssURL}/akun-keuangan`,
        as: `${ssURL}/akun-keuangan`,
        text: "Daftar Akun",
        active: `${ssURL}/akun-keuangan`,
      },
      {
        href: `${ssURL}/rekening/v2`,
        as: `${ssURL}/rekening/v2`,
        text: "Akun Rekening",
        active: `${ssURL}/rekening/v2`,
      },
      {
        href: `${ssURL}/transaksi-keuangan`,
        as: `${ssURL}/transaksi-keuangan`,
        text: "Transaksi",
        active: `${ssURL}/transaksi-keuangan`,
      },
      {
        href: `${ssURL}/mutasi/v2`,
        as: `${ssURL}/mutasi/v2`,
        text: "Persetujuan",
        active: `${ssURL}/mutasi/v2`,
      },
    ];
  } else if (user?.bagian == "yayasan") {
    navMenus = [
      {
        href: `${ssURL}/akun-keuangan`,
        as: `${ssURL}/akun-keuangan`,
        text: "Daftar Akun",
        active: `${ssURL}/akun-keuangan`,
      },
      {
        href: `${ssURL}/rekening/v2`,
        as: `${ssURL}/rekening/v2`,
        text: "Akun Rekening",
        active: `${ssURL}/rekening/v2`,
      },
      {
        href: `${ssURL}/transaksi-keuangan`,
        as: `${ssURL}/transaksi-keuangan`,
        text: "Transaksi",
        active: `${ssURL}/transaksi-keuangan`,
      },
      {
        href: `${ssURL}/laporan-keuangan`,
        as: `${ssURL}/laporan-keuangan`,
        text: "Laporan",
        active: `${ssURL}/laporan-keuangan`,
      },
    ];
  }
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
            style={{
              minHeight: "150px",
              background: `url("/img/bg-header-realisasi-keuangan.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img src="/img/icon-realisasi-keuangan.svg" alt="" />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                {judul}
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

export default HeaderRealisasiKeuangan;
