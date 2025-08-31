import React from "react";
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaPlus } from "react-icons/fa";

const HeaderRekeningV2 = ({
  setEditData,
  setSearch,
  search,
  downloadRekening,
}) => {
  return (
    <div className="card card-ss mb-4 p-4">
      {/* <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
        <h4 className="fw-extrabold color-dark mb-0">Akun Rekening</h4>
      </div>
      <hr className="my-4" /> */}
      <div className="d-flex jusitfy-content-start align-items-sm-center flex-sm-row flex-column">
        <input
          type="text"
          className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-3 mb-sm-0 mb-3"
          style={{ height: "42px" }}
          id="exampleFormControlInput1"
          placeholder="Cari Akun"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss"
          type="button"
          onClick={() => downloadRekening()}
        >
          <FaCloudDownloadAlt className="me-2 fs-18-ss" />
          Rekap Rekening
        </button>
      </div>
    </div>
  );
};

export default HeaderRekeningV2;
