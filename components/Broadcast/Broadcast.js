import { Tooltip } from "antd";
import React, { useState } from "react";
import { FaPen, FaTrashAlt, FaClone, FaPaperPlane } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";

function Broadcast({ status, id, data, setEditData, handleDelete }) {
  const [collapseOpen, setcollapseOpen] = useState("");
  const kepada = JSON.parse(data?.kepada || "[]");
  const editData = {
    ...data,
    id: 0,
    kepada,
    tanggalDibagikan: momentPackage(data?.tanggalDibagikan).format(
      "YYYY-MM-DD HH:mm:ss"
    ),
    lampiran: [...data?.lampiran],
  };

  return (
    <div className="card card-ss card-biaya-pendaftaran p-0">
      <div className="card-header-ss rounded-ss d-flex justify-content-md-between align-items-md-center flex-md-row flex-column p-4 pb-md-3">
        <div className="flex-grow-1 mb-md-0 mb-3">
          <div className="d-flex align-items-center mb-1">
            <h4 className="fw-bold color-dark mb-0 me-3">{data?.judul}</h4>
            <img
              src={`/img/icon-broadcast-${
                status == "terjadwal"
                  ? "terjadwal"
                  : status == "terkirim"
                  ? "terkirim"
                  : status == "draf"
                  ? "draf"
                  : ""
              }.svg`}
              alt={`icon-broadcast-${
                status == "terjadwal"
                  ? "terjadwal"
                  : status == "terkirim"
                  ? "terkirim"
                  : status == "draf"
                  ? "draf"
                  : ""
              }`}
            />
          </div>
          <p className="fw-semibold">
            {momentPackage(data?.tanggalDibagikan).format(
              "dddd, DD MMMM YYYY - HH:mm"
            )}
          </p>
          <div className="d-flex flex-wrap">
            {kepada?.map((d) => {
              return (
                <Tooltip title={d?.label}>
                  <span
                    className="label-ss label-light-primary-ss rounded-pill fs-12-ss fw-semibold text-truncate me-2 mb-2 pointer"
                    style={{ maxWidth: "150px" }}
                  >
                    {d?.label}
                  </span>
                </Tooltip>
              );
            })}
            {kepada?.length > 4 ? (
              <Tooltip title={`Lihat Detail`}>
                <a
                  data-bs-toggle="modal"
                  data-bs-target={`#modalPenerimaBroadcast`}
                  className="label-ss label-light-primary-ss rounded-pill fs-12-ss fw-semibold text-truncate me-2 mb-2 pointer"
                  style={{ maxWidth: "150px" }}
                >
                  +{kepada?.length - 4}
                </a>
              </Tooltip>
            ) : null}
          </div>
        </div>
        <div className="d-flex ms-md-0 ms-auto">
          {status == "terkirim" ? (
            <button
              type="button"
              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
              style={{
                width: "40px",
                height: "40px",
              }}
              data-bs-toggle="modal"
              data-bs-target={`#modalBuatBroadcast`}
              onClick={() =>
                setEditData({
                  ...editData,
                  id: 0,
                })
              }
            >
              <FaClone className="color-secondary" />
            </button>
          ) : status == "terjadwal" ? (
            <button
              type="button"
              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
              style={{
                width: "40px",
                height: "40px",
              }}
              data-bs-toggle="modal"
              data-bs-target={`#modalBuatBroadcast`}
              onClick={() =>
                setEditData({
                  ...editData,
                  id: data?.id,
                })
              }
            >
              <FaPaperPlane className="color-secondary" />
            </button>
          ) : status == "draf" ? (
            <button
              type="button"
              className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0 shadow-none"
              style={{
                width: "40px",
                height: "40px",
              }}
              data-bs-toggle="modal"
              data-bs-target={`#modalBuatBroadcast`}
              onClick={() =>
                setEditData({
                  ...editData,
                  id: data?.id,
                })
              }
            >
              <FaPen className="color-secondary" />
            </button>
          ) : (
            ""
          )}
          <button
            className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={() => handleDelete(data?.id)}
          >
            <FaTrashAlt className="color-secondary" />
          </button>
          <button
            data-bs-toggle="collapse"
            data-bs-target={`#collapseExample${id}`}
            role="button"
            aria-expanded="false"
            className={`btn btn-collapse p-0 shadow-none ${
              collapseOpen ? "active" : ""
            }`}
            onClick={() => setcollapseOpen(!collapseOpen)}
          >
            <span
              class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary hover-shadow-none btn-primary-ss"
              style={{ width: "40px", height: "40px" }}
            >
              <img className="dropdown" src="/img/arrow-bottom.svg" alt="" />
            </span>
          </button>
        </div>
      </div>

      <div class="collapse" id={`collapseExample${id}`}>
        <hr className="mb-4 mt-0" />
        <div class="card-body card-footer-ss pb-4 px-4 pt-0">
          <p className="color-dark fw-semibold fs-16-ss">{data?.pesan}</p>
        </div>
      </div>
    </div>
  );
}

export default Broadcast;
