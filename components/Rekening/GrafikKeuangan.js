import React from "react";
import {
  getTotalPemasukan,
  getTotalPengeluaran,
  getTotalSaldo,
} from "utilities/TagihanUtils";
import GrafikMutasi from "components/Mutasi/GrafikMutasi";

const GrafikKeuangan = ({
  grafik,
  labels,
  grafikData,
  filterGrafik,
  setfilterGrafik,
}) => {
  return (
    <div className="col-md-12">
      <div className="card card-ss p-4 mb-4">
        {/* Card Label & Option Start */}
        <div className="card-header-ss d-flex justify-content-between align-items-md-center flex-md-row flex-column mb-4 px-0">
          <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
            Grafik Keuangan
          </h4>
          <div className="d-flex justify-content-between">
            <div
              className={`py-2 border  rounded-pill fw-bold fs-14-ss me-3 d-flex justify-content-center pointer ${
                filterGrafik == "minggu"
                  ? "border-primary-ss bg-light-primary color-primary"
                  : "border-secondary-ss color-secondary"
              }`}
              style={{ width: "100px" }}
              onClick={() => setfilterGrafik("minggu")}
            >
              Minggu
            </div>
            <div
              className={`py-2 border  rounded-pill fw-bold fs-14-ss me-3 d-flex justify-content-center pointer ${
                filterGrafik == "bulan" || !filterGrafik
                  ? "border-primary-ss bg-light-primary color-primary"
                  : "border-secondary-ss color-secondary"
              }`}
              style={{ width: "100px" }}
              onClick={() => setfilterGrafik("bulan")}
            >
              Bulan
            </div>
            <div
              className={`py-2 border  rounded-pill fw-bold fs-14-ss d-flex justify-content-center pointer ${
                filterGrafik == "tahun"
                  ? "border-primary-ss bg-light-primary color-primary"
                  : "border-secondary-ss color-secondary"
              }`}
              style={{ width: "100px" }}
              onClick={() => setfilterGrafik("tahun")}
            >
              Tahun
            </div>
          </div>
        </div>
        <div className="card-body p-2">
          <div className="d-flex align-items-md-center flex-md-row flex-column mb-4">
            <div className="d-flex mb-md-0 mb-3 me-md-5">
              <img src="/img/icon-total-saldo.svg" alt="icon-pemasukan" />
              <div className="ms-3">
                <h6 className="fw-bold fs-12-ss mb-2">Total Saldo</h6>
                <h5 className="fw-extrabold color-dark">
                  Rp {getTotalSaldo(grafik) || 0}
                </h5>
              </div>
            </div>
            <div className="d-flex mb-md-0 mb-3 me-md-5">
              <img src="/img/icon-pemasukan.svg" alt="icon-pemasukan" />
              <div className="ms-3">
                <h6 className="fw-bold fs-12-ss mb-2">Total Pemasukan</h6>
                <h5 className="fw-extrabold color-dark">
                  Rp {getTotalPemasukan(grafik) || 0}
                </h5>
              </div>
            </div>
            <div className="d-flex mb-md-0 mb-3">
              <img src="/img/icon-pengeluaran.svg" alt="icon-pengeluaran" />
              <div className="ms-3">
                <h6 className="fw-bold fs-12-ss mb-2">Total Pengeluaran</h6>
                <h5 className="fw-extrabold color-dark">
                  Rp {getTotalPengeluaran(grafik)}
                </h5>
              </div>
            </div>
          </div>

          <GrafikMutasi label={labels} data={grafikData} />
        </div>
      </div>
    </div>
  );
};

export default GrafikKeuangan;
