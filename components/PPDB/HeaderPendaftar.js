import NavSkeleton from "components/Shared/Skeleton/NavSkeleton";
import React from "react";
import { momentPackage } from "utilities/HelperUtils";
import Link from "next/link";
import useSekolah from "hooks/useSekolah";
import dataStatus from "data/status-pendaftar.json";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";

const HeaderPendaftar = ({
  pendaftar,
  navMenus,
  loading,
  _handleUpdatePendaftar,
}) => {
  const { sekolah } = useSekolah();

  const checkBayar =
    JSON.parse(pendaftar?.pembayaran || "[]")?.reduce((a, b) => {
      if (b?.diverifikasi) {
        return a + b?.nominal;
      } else {
        return a + 0;
      }
    }, 0) <
    (pendaftar?.diskon?.harga
      ? pendaftar?.diskon?.harga
      : pendaftar?.gelombang?.biayaPendaftaran ||
        pendaftar?.gelombang?.jalur?.biaya ||
        0)
      ? "menungguKonfirmasiPembayaran"
      : pendaftar?.status;

  let status = "";
  if (
    pendaftar?.status == "menungguKonfirmasiPembayaran" &&
    (sekolah?.id == 9487 || sekolah?.id == 9489)
  ) {
    status = dataStatus["menungguHasilPengumuman"];
  } else if (
    pendaftar?.status == "menungguSeleksiBerkas" &&
    (sekolah?.id == 9487 || sekolah?.id == 9489)
  ) {
    status = dataStatus["tidakLulusSeleksi"];
  } else if (sekolah?.id == 9487 || sekolah?.id == 9489) {
    status = dataStatus[pendaftar?.status];
  } else {
    status = dataStatus[checkBayar];
  }

  return (
    <div className="row gy-4 mb-4">
      <div className="col-md-12">
        <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-0">
          <div
            className="card-header card-header-ss p-4 pb-0
            "
          >
            <div
              className="d-flex align-items-center flex-md-row flex-column"
              style={{
                alignItems: "center !important",
              }}
            >
              <img
                src={sekolah?.logo}
                alt="logo-sekolah"
                height="50px"
                className="mb-4 mb-md-0 me-0 me-md-4"
              />
              <div>
                <h3 className="color-dark fw-black m-0">
                  {pendaftar?.user?.nama}
                </h3>
                <p className="fs-16-ss fw-semibold mb-0">
                  {pendaftar?.user?.profil?.alamat}
                </p>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-6 mb-lg-0 mb-3">
                <div
                  className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-4 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                  style={{ backgroundColor: "#f8f8fb" }}
                >
                  <WhatsappLink
                    phoneNumber={pendaftar?.user?.whatsapp}
                    text="Halo nak"
                  >
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-0 ">
                      <h6 className="fw-bold fs-14-ss  color-secondary mb-2">
                        No Telepon
                      </h6>
                      <div className="d-flex align-items-center">
                        <img
                          src={`/img/whatsapp.svg`}
                          width={30}
                          height={30}
                          style={{ marginRight: "2px" }}
                        />
                        <h4 className="fw-extrabold fs-5 color-primary m-0">
                          {pendaftar?.user?.whatsapp}
                        </h4>
                      </div>
                    </div>
                  </WhatsappLink>
                  <div className="status-info-items mb-lg-0 mb-3 p-0 order-md-1 ">
                    <h6 className="fw-bold fs-14-ss color-secondary mb-2">
                      Tanggal Mendaftar
                    </h6>
                    <h5 className="fw-extrabold fs-5 color-primary m-0">
                      {momentPackage(pendaftar?.createdAt).format(
                        "dddd, DD MMMM YYYY"
                      )}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-lg-0 mb-3">
                <div
                  className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                  style={{ backgroundColor: "#f8f8fb" }}
                >
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-0 ">
                    <h6 className="fw-bold fs-14-ss  color-secondary mb-2">
                      Status
                    </h6>
                    <h4 className="fw-extrabold fs-5 color-primary m-0">
                      {status?.text}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
            (pendaftar?.status == "berkasTerkonfirmasi" ||
              pendaftar?.status == "lulusSeleksi" ||
              pendaftar?.status == "tidakLulusSeleksi" ||
              pendaftar?.status == "cadangan") && (
              <div className="d-flex justify-content-end me-4">
                <button
                  className="btn btn-ss btn-secondary btn-secondary-ss bg-gradient-secondary shadow-secondary-ss rounded-pill fs-14-ss fw-bold me-4"
                  onClick={() =>
                    _handleUpdatePendaftar({
                      status: "cadangan",
                    })
                  }
                >
                  Cadangan Siswa
                </button>
                <button
                  className="btn btn-ss btn-outline-danger rounded-pill fs-14-ss fw-bold me-4"
                  onClick={() =>
                    _handleUpdatePendaftar({
                      status: "tidakLulusSeleksi",
                    })
                  }
                >
                  Tolak Siswa
                </button>
                <button
                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold"
                  onClick={() =>
                    _handleUpdatePendaftar({
                      status: "lulusSeleksi",
                    })
                  }
                >
                  Terima Siswa
                </button>
              </div>
            )}
          <div
            className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
            style={{ background: `rgba(244,244,247,0.3)` }}
          >
            <div className="kelas-nav d-flex flex-column flex-lg-row">
              {loading ? (
                <div>
                  <NavSkeleton totalMenu={5} />
                </div>
              ) : (
                navMenus.map((d) => {
                  return (
                    d.isVisible && (
                      <Link href={d.href} as={d.as}>
                        <a
                          className={`position-relative fs-16-ss fw-bold text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                            d.active ? "color-primary" : "color-secondary"
                          }`}
                          // data-joyride={d.dataJoyride || ""}
                        >
                          {d.text}
                        </a>
                      </Link>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPendaftar;
