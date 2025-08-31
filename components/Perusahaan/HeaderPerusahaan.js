import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { getPenerimaanPkl } from "client/PenerimaanClient";
const HeaderPerusahaan = ({ children, ssURL, id, judul }) => {
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
      href: `${ssURL}/pkl/penerimaan`,
      as: `${ssURL}/pkl/penerimaan`,
      text: "Penerimaan",
      active: `${ssURL}/pkl/penerimaan`,
    },
    {
      href: `${ssURL}/pkl/perusahaan`,
      as: `${ssURL}/pkl/perusahaan`,
      text: "Perusahaan",
      active: `${ssURL}/pkl/perusahaan`,
    },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
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
                  <div className="pe-4">
                    <h1 className="fs-6 fw-bold mb-1 ">Partner Perusahaan</h1>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPerusahaan;
