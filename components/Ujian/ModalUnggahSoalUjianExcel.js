import NewModal from "components/Shared/NewModal/NewModal";
import React from "react";
import ReactiveButton from "reactive-button";
import { FaCloudDownloadAlt, FaTimes, FaFile } from "react-icons/fa";

export const ModalUnggahSoalUjianExcel = ({
  fileSoal,
  setFileSoal,
  buttonStateUnggahSoal,
  handlePostImportSoalData,
}) => {
  return (
    <NewModal
      modalSize="md"
      modalId="modalUnggahSoalExcel"
      title={
        <>
          <h4 className="mb-0 fw-extrabold">Unggah Soal Excel</h4>
        </>
      }
      content={
        <>
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label mb-0"
              >
                File Soal
              </label>
              <div>
                <a
                  href="/import/template-soal-import-ss-new .xlsx"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold me-3"
                >
                  <FaCloudDownloadAlt className="me-2" />
                  Download Template Soal
                </a>
              </div>
            </div>
            <label
              htmlFor="inputUnggahSoal"
              className="form-label mt-3 mb-4 w-100"
            >
              <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                  <img src={`/img/icon-upload-dropfile.svg`} />
                  <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                    Klik untuk mengunggah{" "}
                    <span className="color-primary">Soal</span>
                  </span>
                </div>
              </div>
            </label>
            <input
              className="form-control d-none"
              type="file"
              id="inputUnggahSoal"
              onChange={({ target }) => setFileSoal(target)}
            />
            {fileSoal?.files?.[0] && (
              <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                      <FaFile className="text-white fs-3" />
                    </div>
                    <div className="p-2">
                      <p className="fw-bold color-dark mb-0">
                        Template Import Soal
                      </p>
                      <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                        {/* PDF */}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                    <a
                      href={URL.createObjectURL(fileSoal?.files?.[0])}
                      target="_blank"
                      className="btn btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                    >
                      Pratinjau
                    </a>
                    <FaTimes
                      className="text-secondary pointer"
                      onClick={() => setFileSoal({})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonStateUnggahSoal}
          onClick={() => handlePostImportSoalData()}
          disabled={!fileSoal?.files?.[0]}
          color={"primary"}
          idleText={"Unggah Soal"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};
