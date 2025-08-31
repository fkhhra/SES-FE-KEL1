import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/router";
import { DatePicker } from "antd";
import { momentPackage } from "utilities/HelperUtils";

const HeaderKbm = ({
  children,
  ssURL,
  id,
  judul,
  tanggal,
  data = {},
  total,
  listAkanDatang,
  listSudahSelesai,
}) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  useEffect(() => {
    setActiveMenu(router.asPath);
  }, [router.asPath]);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
          <div
            className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
            style={{
              minHeight: "150px",
              background: `url("/img/bg-header-kbm.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img
                src="/img/icon-kbm.svg"
                style={{ width: "86px", height: "86px" }}
                alt=""
              />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative mb-0">
                Kegiatan Belajar Mengajar
              </h2>
              {/* <p className="fs-6 fw-bold mb-0">Praktik Kerja Lapangan</p> */}
            </div>
          </div>
          <div className="row px-4 mb-4">
            <div className="col-md-9 mt-4">
              <div
                className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                style={{ backgroundColor: "#f8f8fb" }}
              >
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Saat Ini</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    {Object.keys(data).length -
                      listAkanDatang?.length -
                      listSudahSelesai?.length}
                    /{Object.keys(data).length} Kegiatan
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">Terlaksana</h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    {Object.keys(data).length} Kegiatan
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">
                    Tidak Terlaksana
                  </h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    {total - Object.keys(data).length} Kegiatan
                  </h4>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <h6 className="fw-bold color-secondary mb-2">
                    Total Kegiatan
                  </h6>
                  <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                    {total} Kegiatan
                  </h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="status-info bg-primary p-3 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between mt-4">
                <div className="status-info-items w-100">
                  <h6 className="fw-bold text-white mb-1">Tanggal</h6>
                  <div className="col-md-12">
                    <div className="date-picker-header-kbm">
                      <DatePicker
                        onChange={(date) =>
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              tanggal: date.format("YYYY-MM-DD"),
                            },
                          })
                        }
                        placeholder="Pilih Tanggal"
                        className="form-control w-100"
                        autoComplete="off"
                        value={
                          tanggal ? momentPackage(tanggal + " 00:00:00") : ""
                        }
                        format="DD-MM-YYYY"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeaderKbm;
