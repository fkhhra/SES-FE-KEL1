import React from "react";
import { Doughnut } from "react-chartjs-2";

const GrafikSaldo = ({ data, options }) => {
  return (
    <div className="col-lg-5 mb-lg-0 mb-4">
      {/* Add Kartu Rekening Start */}
      <div className="card card-ss rounded-ss p-0 h-100">
        <div
          className="card-header-ss bg-soft-primary p-4 py-3"
          style={{
            backgroundImage: "url('/img/bg-card-saldo-rekening.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "contain",
          }}
        >
          <h5 className="title-border fw-extrabold color-dark mb-0">
            Saldo Rekening
          </h5>
        </div>
        <div className="card-body p-4">
          <Doughnut data={data} options={options} height={83} />
        </div>
      </div>
    </div>
  );
};

export default GrafikSaldo;
