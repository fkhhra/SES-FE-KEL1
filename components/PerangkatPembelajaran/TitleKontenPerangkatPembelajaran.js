import React, { useEffect, useState } from "react";

const TitleKontenPerangkatPembelajaran = ({}) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0">
          <div
            className="card-body p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
            style={{
              minHeight: "150px",
              background: `url("/img/bg-header-konten-perangkat-pembelajaran.png")`,
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div
              className="rounded-circle shadow-primary-ss"
              style={{ width: "86px", height: "86px" }}
            >
              <img
                src="/img/icon-header-konten-perangkat-pembelajaran.svg"
                alt=""
              />
            </div>
            <div className="ms-md-4 ms-0 mt-md-0 mt-4">
              <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                Tema 1
              </h2>
              <p className="fs-6 fw-bold mb-0">10 Konten</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleKontenPerangkatPembelajaran;
