import { Tooltip } from "antd";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import React, { useState } from "react";
import { FaPen, FaTrashAlt, FaClone, FaPaperPlane } from "react-icons/fa";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";

function ListHistoryPeringatan({
  status,
  id,
  data,
  setEditData,
  handleDelete,
  isActive,
  dataMou,
  _deleteBerkasMou,
}) {
  const [collapseOpen, setcollapseOpen] = useState("");

  console.log(data);
  return (
    <div className="card card-ss card-biaya-pendaftaran p-0">
      <div className="card-header-ss rounded-ss d-flex justify-content-md-between align-items-md-center flex-md-row flex-column p-4 pb-md-3">
        <div className="flex-grow-1 mb-md-0 mb-3">
          {/* <div
            className={`label-ss fs-12-ss rounded-pill bg-warning text-white mb-2`}
            style={{ width: "min-content", whiteSpace: "nowrap" }}
          >
            Peringatan pertama
          </div> */}
          <div className="d-flex align-items-center mb-2">
            <h4 className="fw-bold color-dark mb-0 me-3">{data?.deskripsi}</h4>
          </div>
          <h6 className="color-primary fw-bold mb-0">
            {/* {momentPackage(dataMou?.mulaiKontrak).format("DD MMM YYYY")} -{" "}
            {momentPackage(dataMou?.akhirKontrak).format("DD MMM YYYY")} */}
          </h6>
        </div>
        <div className="d-flex ms-md-0 ms-auto">
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
          <div className="row gy-4">
            {/* {ruangLingkupMou?.map((d) => {
              return ( */}
            <div className={"col-md-12"}>
              <div className={`d-flex align-items-center`}>
                <div className="ms-4">
                  <h6 className="fw-semibold color-dark mb-0">
                    {/* saya tidak sengaja kepencet keluar ujiannya ibu */}
                    {data?.jawaban || "Belum Ada Balasan"}
                  </h6>
                </div>
              </div>
            </div>
            {/* );
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListHistoryPeringatan;
