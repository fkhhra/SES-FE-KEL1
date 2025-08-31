import React, { useState } from "react";
import AnimateHeight from "react-animate-height";
import KegiatanKelas from "./KegiatanKelas";

const CardKelasKBM = ({ tanggalKegiatan, data = [] }) => {
  const [height, setHeight] = useState("0" || "auto");

  return (
    <div className="col-md-10 mb-4">
      <div className="card card-ss px-4 py-0">
        <div className="py-4 d-flex align-items-sm-center flex-sm-row flex-column">
          <div className="d-flex justify-content-between align-items-center">
            <div
              className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-3"
              style={{ width: "50px", height: "50px" }}
            >
              <img src="/img/icon-kegiatan.svg" alt="icon-kegiatan" />
            </div>
            <div className="d-block d-sm-none">
              <span
                className={`me-2 rounded-pill fs-12-ss fw-bold label-ss label-light-primary-ss`}
              >
                {data?.length}
              </span>

              <img
                onClick={() => setHeight(height === 0 ? "auto" : 0)}
                src="/img/chevron-bottom.svg"
                className={`pointer ${height != 0 ? "rotate-180" : ""}`}
                style={{ transition: "0.3s" }}
              />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="">
              <h5 className="fw-extrabold color-dark mb-0">
                {data?.[0]?.user?.nama}
              </h5>
              <span>
                {data?.[0]?.rombel?.nama} - {data?.[0]?.mataPelajaran?.nama}
              </span>
            </div>

            <div className="d-sm-block d-none">
              <span
                className={`me-2 rounded-pill fs-12-ss fw-bold label-ss label-light-primary-ss`}
              >
                {data?.length}
              </span>

              <img
                onClick={() => setHeight(height === 0 ? "auto" : 0)}
                src="/img/chevron-bottom.svg"
                className={`pointer ${height != 0 ? "rotate-180" : ""}`}
                style={{ transition: "0.3s" }}
              />
            </div>
          </div>
        </div>
        <AnimateHeight height={height}>
          {data?.map((d) => {
            return (
              <KegiatanKelas
                disabled={false}
                data={d}
                type={
                  d?.tugas
                    ? d?.tugas?.soal?.length
                      ? "tugas-kuis"
                      : "tugas"
                    : d?.materi?.length
                    ? "materi"
                    : "tatap-maya"
                }
              />
            );
          })}
        </AnimateHeight>
      </div>
    </div>
  );
};

export default CardKelasKBM;
