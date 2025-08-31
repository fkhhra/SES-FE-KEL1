import React from "react";
import { currencyFormatter } from "utilities/HelperUtils";

const SaldoTotal = ({ totalSaldo, totalPemasukkan, totalPengeluaran }) => {
  return (
    <div className="col-lg-7">
      <div className="card card-ss card-overview-dashboard-keuangan p-4">
        <div className="d-flex justify-content-between">
          <div data-joyride="total-saldo">
            <h5 className="color-dark fw-bold mb-2">Total Saldo</h5>
            <h1 className="fw-extrabold color-primary mb-0">
              {currencyFormatter(
                totalSaldo +
                  parseInt(totalPemasukkan) -
                  parseInt(totalPengeluaran)
              ) || 0}
            </h1>
          </div>
          {/* <div data-joyride="total-saldo">
            <h5 className="color-dark fw-bold mb-2">Saldo Awal</h5>
            <h1 className="fw-extrabold color-primary mb-0">
              {currencyFormatter(totalSaldo) || 0}
            </h1>
          </div> */}
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6 mb-md-0 mb-3">
            <div className="d-flex">
              <img src="/img/icon-pemasukan.svg" alt="icon-pemasukan" />
              <div className="ms-3" data-joyride="total-pemasukan">
                <h6 className="fw-bold fs-12-ss mb-2">Total Pemasukan</h6>
                <h5 className="fw-extrabold color-dark">
                  {currencyFormatter(totalPemasukkan) || 0}
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex">
              <img src="/img/icon-pengeluaran.svg" alt="icon-pengeluaran" />
              <div className="ms-3" data-joyride="total-pengeluaran">
                <h6 className="fw-bold fs-12-ss mb-2">Total Pengeluaran</h6>
                <h5 className="fw-extrabold color-dark">
                  {currencyFormatter(totalPengeluaran) || 0}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaldoTotal;
