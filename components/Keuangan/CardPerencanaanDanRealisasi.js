import React from "react";
import { Doughnut } from "react-chartjs-2";
import { formatAngkaTitik } from "utilities/HelperUtils";

const CardPerencanaanDanRealisasi = ({
  rencana,
  labaAkumulasi,
  dataNeraca,
  data,
  options,
}) => {
  let status;
  let nilai = 0;
  let persen = 0;
  if (
    dataNeraca?.reduce((a, b) => a + b.totalRencana, 0) >=
    dataNeraca?.reduce((a, b) => a + b.total, 0)
  ) {
    status = "Tersisa";
    nilai =
      dataNeraca?.reduce((a, b) => a + b.totalRencana, 0) -
      dataNeraca?.reduce((a, b) => a + b.total, 0);
    persen = (
      (nilai / dataNeraca?.reduce((a, b) => a + b.total, 0)) *
      100
    ).toFixed(1);
  }
  if (
    dataNeraca?.reduce((a, b) => a + b.totalRencana, 0) <=
    dataNeraca?.reduce((a, b) => a + b.total, 0)
  ) {
    status = "Melebihi";
    nilai =
      (dataNeraca?.reduce((a, b) => a + b.totalRencana, 0) -
        dataNeraca?.reduce((a, b) => a + b.total, 0)) *
      -1;
    persen = 100;
  }
  return (
    <div className="col-lg-7 mb-lg-0 mb-4">
      {/* Add Kartu Rekening Start */}
      <div className="card card-ss rounded-ss p-0 h-100">
        <div
          className="card-header-ss bg-soft-primary p-4 py-3"
          style={{
            backgroundImage:
              "url('/img/bg-card-perencanaan-dan-realisasi-keuangan.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
          }}
        >
          <h5 className="title-border fw-extrabold color-dark mb-0">
            Perencanaan dan Realisasi
          </h5>
        </div>
        <div className="card-body p-4">
          <h4 className="fw-extrabold color-dark mb-2">
            Rencana Keuangan {rencana?.nama}
          </h4>
          <div className="progress-container mb-4">
            <div
              className="progress rounded-pill bg-light-secondary pointer w-100"
              style={{
                height: "7px",
              }}
              dataBsToogle={"tooltip"}
              dataBsPlacement={"bottom"}
              title={`100%`}
            >
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{
                  //   width: `${(
                  //     (pelunasanData?.totalLunas / pelunasanData?.total) *
                  //     100
                  //   ).toFixed(2)}%`,
                  width: `${persen}%`,
                }}
                // ariaValueNow={"75"}
                ariaValueMin={"0"}
                ariaValueMax={"100"}
              ></div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2 color-secondary">
              <span className="fs-14-ss fw-semibold color-primary">
                {status} Rp
                {formatAngkaTitik(nilai)}
              </span>
              <span className="fs-14-ss fw-bold">
                {/* {`${(
                (pelunasanData?.totalLunas / pelunasanData?.total) *
                100
              ).toFixed(2)}%`} */}
                {persen}%
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-md-0 mb-3">
              <div className="d-flex align-items-center">
                <img
                  src="/img/icon-total-perencanaan.svg"
                  alt="icon-total-perencanaan"
                />
                <div className="ms-3">
                  <span className="fs-12-ss fw-bold mb-1">
                    Total Perencanaan
                  </span>
                  <h5 className="fw-extrabold color-dark mb-0">
                    Rp{" "}
                    {formatAngkaTitik(
                      dataNeraca?.reduce((a, b) => a + b.totalRencana, 0)
                    )}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <img
                  src="/img/icon-total-realisasi.svg"
                  alt="icon-total-realisasi"
                />
                <div className="ms-3">
                  <span className="fs-12-ss fw-bold mb-1">Total Realisasi</span>
                  <h5 className="fw-extrabold color-dark mb-0">
                    Rp
                    {formatAngkaTitik(
                      dataNeraca?.reduce((a, b) => a + b.total, 0)
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPerencanaanDanRealisasi;
