import NewModal from "components/Shared/NewModal/NewModal";
import React, { useState } from "react";
import ReactiveButton from "reactive-button";
import { FaCloudDownloadAlt, FaTimes, FaFile, FaLink } from "react-icons/fa";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import ModalStep from "components/Shared/ModalStep/ModalStep";

const initialFormData = {
  totalNilaiPg: 0,
  totalNilaiEsai: 0,
};

export const ModalUnggahSoalUjianWord = ({
  fileSoalWord,
  setFileSoalWord,
  buttonStateUnggahSoal,
  handlePostImportSoalDataWord,
  handleChangeInput,
  formData,
}) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Cek Soal",
      content: (
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
            <label
              htmlFor="exampleFormControlTextarea1"
              className="form-label mb-0"
            >
              {/* Tutorial */}
            </label>
            <div>
              <a
                href="https://drive.google.com/drive/folders/10Kmsh9nJpJSMLUH6PjRqgazI7cwsM8Lh?usp=sharing"
                target="_blank"
                rel="noreferrer noopener"
                className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
              >
                <FaLink className="me-2" />
                Tutorial unggah soal via word
              </a>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
            <label
              htmlFor="exampleFormControlTextarea1"
              className="form-label mb-3"
            >
              Cek soal terlebih dahulu melalui link di bawah ini !
            </label>

            <label
              htmlFor="inputUnggahSoalWord"
              className="form-label mt-3 mb-4 w-100"
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open("https://ed.oc.edu/blackboardquizgenerator/")
                }
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
              >
                {/* <img src="/img/icon-file-download.svg" alt="" /> */}
                <FaLink className=" color-primary" size={30} />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik link berikut untuk{" "}
                  <span className="color-primary fw-bold">mengecek soal</span>
                </p>
              </div>
            </label>
            {/* <div>
        <a
          href="https://ed.oc.edu/blackboardquizgenerator/"
          target="_blank"
          rel="noreferrer noopener"
          className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
        >
          <FaLink className="me-2" />
          Link tools
        </a>
      </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "Unggah File Soal",
      content: (
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="" className="form-label mb-3">
              Sudah klik "Download Test Questions" dari langkah sebelumnya ?
            </label>
            <div>
              <img
                src="/img/download-blackboard-v1.jpeg"
                style={{ width: "800px", height: "200px" }}
                alt=""
                className="img-fit-contain"
              />
            </div>
          </div>

          <label htmlFor="totalNilaiPg" className="form-label mb-0">
            Unggah file hasil downloadnya di bawah ini !
          </label>
          <label
            htmlFor="inputUnggahSoalWord"
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
            id="inputUnggahSoalWord"
            onChange={({ target }) => setFileSoalWord(target)}
          />
          {fileSoalWord?.files?.[0] && (
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
                    href={URL.createObjectURL(fileSoalWord?.files?.[0])}
                    target="_blank"
                    className="btn btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                  >
                    Pratinjau
                  </a>
                  <FaTimes
                    className="text-secondary pointer"
                    onClick={() => setFileSoalWord({})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Masukkan Nilai per Soal",
      content: (
        <div className="mb-3">
          <label htmlFor="totalNilaiPg" className="form-label mb-3">
            Beri poin untuk masing - masing soal !
          </label>
          <div className="mb-4 flex-wrap">
            <label htmlFor="totalNilaiPg" className="form-label mb-2">
              Poin per Soal Pilihan Ganda
            </label>
            <div>
              <input
                className="form-control"
                id="totalNilaiPg"
                autoComplete="off"
                placeholder="Tuliskan total nilai pilihan ganda"
                type="number"
                name="totalNilaiPg"
                value={formData?.totalNilaiPg}
                onChange={handleChangeInput}
              />
            </div>
          </div>
          <div className="mb-4 flex-wrap">
            <label htmlFor="totalNilaiEsai" className="form-label mb-2">
              Poin per Soal Esai
            </label>
            <div>
              <input
                className="form-control"
                id="totalNilaiEsai"
                autoComplete="off"
                placeholder="Tuliskan total nilai esai"
                type="number"
                name="totalNilaiEsai"
                value={formData?.totalNilaiEsai}
                onChange={handleChangeInput}
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const onCloseModal = () => {
    setCurrent(0);
  };
  return (
    <>
      <ModalStep
        onClose={onCloseModal}
        isFullScreen
        modalClass="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        isNext={true}
        modalId="modalUnggahSoalWord"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {/* {`${
                isDuplikatTugas ? "Duplikat" : editModalData ? "Ubah" : "Buat"
              } Tugas ${modalTugasType === "kuis" ? "Kuis" : ""}`} */}
              Unggah Soal Word
            </h4>
            <span className="fs-6 fw-normal">
              {/* {`Isi informasi dibawah untuk ${
                isDuplikatTugas
                  ? "menduplikat"
                  : editModalData
                  ? "mengubah"
                  : "membuat"
              } tugas ${modalTugasType === "kuis" ? "kuis" : ""}`} */}
              Isi informasi dibawah untuk mengunggah soal via word
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={steps}
        // customButton={
        //   current == 0 ? (
        //     <div className="d-flex justify-content-sm-end flex-sm-row flex-column">
        //       <button
        //         className="btn btn-ss btn-outline-danger btn-outline-danger-ss rounded-pill me-sm-2 mb-sm-0 mb-3 fw-bold"
        //         onClick={() => handleClickDelete()}
        //       >
        //         Tolak Verifikasi
        //       </button>
        //       <button className="btn btn-primary" onClick={() => next()}>
        //         Konfirmasi Verifikasi
        //       </button>
        //     </div>
        //   ) : null
        // }
        buttonSubmit={
          <ReactiveButton
            buttonState={buttonStateUnggahSoal}
            onClick={() => handlePostImportSoalDataWord()}
            disabled={!fileSoalWord?.files?.[0]}
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
    </>
  );
};
