import React from "react";
import {
  FaCalendarDay,
  FaCheckCircle,
  FaClock,
  FaExclamation,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import { momentPackage } from "../../utilities/HelperUtils";

const CardPenerimaanUjianUser = ({ dataBukuInduk }) => {
  const handleEdit = (data) => {
    setFormData({
      id: data.id,
      userId: data.mUserId,
      penanganan: data.penanganan,
      tanggal: momentPackage(data.tanggalPengembalian),
      file: data.ttd,
      ttd: [data.ttd],
    });
  };
  // const { user } = useUser();
  return (
    <>
      {/* {dataBukuInduk?.map((d, idx) => {
        return ( */}
      <div className={`card card-ss rounded-ss mb-4`}>
        <div className="card-body card-body-ss p-4">
          <div className="d-flex align-items-md-center align-items-start mb-0 mb-md-3 flex-md-row flex-column">
            <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-success color-success mb-3 mb-md-0">
              Lolos Ujian
            </span>
            <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-secondary color-secondary mb-3 mb-md-0">
              Ujian Belum Dibuka
            </span>
            <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-warning color-warning mb-3 mb-md-0">
              Sedang Dikerjakan
            </span>
            <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-primary color-primary mb-3 mb-md-0">
              Menunggu Hasil Ujian
            </span>
            <span className="rounded-pill me-3 px-3 fw-semibold fs-12-ss py-1 bg-soft-danger color-danger mb-3 mb-md-0">
              Tidak Lolos Ujian
            </span>
          </div>
          <div className="d-flex justify-content-between flex-column flex-md-row ">
            <div className="order-2 order-md-1">
              <h4 className="fw-black color-dark">
                Jalur Seleksi Reguler - Gelombang 1
              </h4>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-stretch align-items-md-center flex-column flex-md-row">
            <div className="d-flex flex-column flex-md-row mb-4 mb-md-0">
              <div>
                <FaCalendarDay color="#2680EB" />
                <span className="color-primary fs-14-ss fw-semibold ms-2 ">
                  Kamis 22 April 2021
                </span>
              </div>
              <div className="ms-0 ms-md-4">
                <FaClock color="#2680EB" />
                <span className="color-primary fs-14-ss fw-semibold ms-2 ">
                  07:00 - 09:00 AM
                </span>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <button className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold">
                Lihat Hasil Ujian
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ); })} */}
    </>
  );
};

export default CardPenerimaanUjianUser;
