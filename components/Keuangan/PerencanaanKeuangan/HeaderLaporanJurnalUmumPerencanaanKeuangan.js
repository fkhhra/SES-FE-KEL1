import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const HeaderLaporanJurnalUmumPerencanaanKeuangan = ({
  children,
  ssURL,
  id,
  rencana,
}) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navMenus = [
    {
      href: `${ssURL}/laporan-keuangan/neraca/data-laporan`,
      as: `${ssURL}/laporan-keuangan/neraca/data-laporan`,
      text: "Data Laporan",
      active: `${ssURL}/laporan-keuangan/neraca/data-laporan`,
    },
    {
      href: `${ssURL}/laporan-keuangan/neraca/template-laporan`,
      as: `${ssURL}/laporan-keuangan/neraca/template-laporan`,
      text: "Template Laporan",
      active: `${ssURL}/laporan-keuangan/neraca/template-laporan`,
    },
  ];

  return (
    <div className="col-md-12">
      <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
        <div
          className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
          style={{
            minHeight: "150px",
            background: `url("/img/bg-header-laporan-keuangan-jurnal-umum.png")`,
            backgroundPositionX: "right",
            backgroundPositionY: "bottom",
          }}
        >
          <div
            className="rounded-circle shadow-primary-ss"
            style={{ width: "86px", height: "86px" }}
          >
            <img src="/img/icon-laporan-keuangan-jurnal-umum.svg" alt="" />
          </div>
          <div className="ms-md-4 ms-0 mt-md-0 mt-4">
            <h2 className="h2 fw-black color-dark text-capitalize position-relative">
              Jurnal Umum
            </h2>
            <p className="fs-6 fw-bold mb-0">{rencana?.nama}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderLaporanJurnalUmumPerencanaanKeuangan;
