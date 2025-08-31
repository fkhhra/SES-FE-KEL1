import React from "react";
import { FaTimes } from "react-icons/fa";

const UploadFile = ({ handleChange, file, deleteFile }) => {
  return (
    <div>
      <input
        class="form-control d-none"
        type="file"
        id="formInputFile"
        onChange={handleChange}
      />
      <label
        for="formInputFile"
        className="input-file-ss d-flex align-items-center justify-content-center p-3 rounded-ss w-100 pointer mb-4"
      >
        <img src="/img/icon-file-upload.svg" alt="file-upload" />
        <h6 className="fw-semibold fs-18-ss color-secondary ms-4 mb-0">
          Klik untuk mengunggah <span className="color-primary">File</span>
        </h6>
      </label>
      {file ? (
        <div
          className="px-4 py-3 border-0 bg-soft-primary rounded-ss mb-4"
          style={{ minHeight: "79px" }}
        >
          <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
            <div className="d-flex align-items-center flex-wrap">
              <img src="/img/icon-file.svg" alt="icon-file" className="me-3" />
              <p className="fw-bold color-dark mb-0 py-2">{file?.name || file}</p>
            </div>
            <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0">
              <FaTimes
                className="pointer fs-4"
                style={{ color: "#96DAFF" }}
                onClick={deleteFile}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadFile;
