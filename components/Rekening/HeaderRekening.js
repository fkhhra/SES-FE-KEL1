import React from "react";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";

const HeaderRekening = ({ setEditData, setSearch, search }) => {
  return (
    <div className="card card-ss mb-4">
      <div className="card-header p-4 card-header-ss">
        <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
          <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
            Akun Rekening
          </h4>
          <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
            <button
              type="button"
              className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#modalTambahRekening"
            >
              <FaPlus /> Tambah
            </button>
          </div>
        </div>
        <hr className="my-4" />
        <div className="d-flex jusitfy-content-start align-items-center flex-sm-row flex-column">
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
            data-bs-toggle="modal"
            data-bs-target="#modalUnggahGtk"
          >
            <FaCloudUploadAlt className="me-2 fs-18-ss" />
            Unggah Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderRekening;
