import React from "react";
import { FaCloudDownloadAlt, FaCloudUploadAlt, FaPlus } from "react-icons/fa";

const HeaderAkunKeuangan = ({
  setEditData,
  setSearch,
  search,
  downloadAkun,
  user,
}) => {
  return (
    <div className="card card-ss mb-4 p-4">
      <div className="d-flex jusitfy-content-start align-items-md-center flex-sm-row flex-column">
        <input
          type="text"
          className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss mb-sm-0 mb-3 me-3"
          style={{ height: "42px" }}
          id="exampleFormControlInput1"
          placeholder="Cari Akun"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-ss btn-outline-secondary  btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss mb-sm-0 mb-3 me-3"
          type="button"
          onClick={() => downloadAkun()}
        >
          <FaCloudDownloadAlt className="me-2 fs-18-ss" />
          Rekap Akun
        </button>
        {!user.bagian ? (
          <button
            type="button"
            className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#modalTambahAkunKeuangan"
            onClick={() => setEditData("")}
          >
            <FaPlus /> Tambah
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default HeaderAkunKeuangan;
