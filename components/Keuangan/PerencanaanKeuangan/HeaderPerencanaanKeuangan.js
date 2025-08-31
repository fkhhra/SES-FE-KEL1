import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import useRencana from "hooks/useRencanaKeuangan";
import { detailRencana } from "utilities/KeuanganUtils";
import { momentPackage } from "utilities/HelperUtils";

const HeaderPerencanaanKeuangan = ({ children, ssURL, id, user }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.asPath);
  }, [router.asPath]);

  const { rencana, setRencana } = useRencana();

  const _detailRencana = async () => {
    if (!rencana || rencana?.id != id) {
      const data = await detailRencana(id);
      setRencana(data);
    }
  };

  useEffect(() => {
    _detailRencana();
  }, [rencana]);

  let navMenus;
  if (!user?.bagian) {
    navMenus = [
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
        as: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
        text: "Daftar Akun",
        active: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/akun-rekening`,
        as: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
        text: "Akun Rekening",
        active: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/rencana`,
        as: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
        text: "Rencana",
        active: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/laporan`,
        as: `${ssURL}/perencanaan-keuangan/${id}/laporan`,
        text: "Laporan",
        active: `${ssURL}/perencanaan-keuangan/${id}/laporan`,
      },
    ];
  } else if (user?.bagian == "keuangan") {
    navMenus = [
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
        as: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
        text: "Daftar Akun",
        active: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/rencana`,
        as: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
        text: "Rencana",
        active: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
      },
    ];
  } else if (user?.bagian == "aproval") {
    navMenus = [
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
        as: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
        text: "Daftar Akun",
        active: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/akun-rekening`,
        as: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
        text: "Akun Rekening",
        active: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/rencana-transaksi`,
        as: `${ssURL}/perencanaan-keuangan/${id}/rencana-transaksi`,
        text: "Rencana",
        active: `${ssURL}/perencanaan-keuangan/${id}/rencana-transaksi`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/rencana`,
        as: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
        text: "Persetujuan",
        active: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
      },
    ];
  } else if (user?.bagian == "yayasan") {
    navMenus = [
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/daftar-akun`,
        as: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
        text: "Daftar Akun",
        active: `${ssURL}/perencanaan-keuangan/${id}/daftar-akun`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/akun-rekening`,
        as: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
        text: "Akun Rekening",
        active: `${ssURL}/perencanaan-keuangan/${id}/akun-rekening`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/rencana-transaksi`,
        as: `${ssURL}/perencanaan-keuangan/${id}/rencana-transaksi`,
        text: "Rencana",
        active: `${ssURL}/perencanaan-keuangan/${id}/rencana-transaksi`,
      },
      {
        href: `${ssURL}/perencanaan-keuangan/[id]/laporan`,
        as: `${ssURL}/perencanaan-keuangan/${id}/laporan`,
        text: "Laporan",
        active: `${ssURL}/perencanaan-keuangan/${id}/laporan`,
      },
    ];
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <Link href={`${ssURL}/perencanaan-keuangan`}>
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
              background: `url("/img/bg-header-rencana-keuangan.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img src="/img/icon-rencana-keuangan.svg" alt="" />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                {rencana?.nama}
              </h2>
              <p className="fs-6 fw-bold mb-0">
                {momentPackage(rencana?.tanggalAwal).format("ddd, DD MMM YYYY")}{" "}
                -{" "}
                {momentPackage(rencana?.tanggalAkhir).format(
                  "ddd, DD MMM YYYY"
                )}
                {/* Sen, 1 Jan 2022 - Sen, 1 Jan 2023 */}
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
  );
};

export default HeaderPerencanaanKeuangan;
