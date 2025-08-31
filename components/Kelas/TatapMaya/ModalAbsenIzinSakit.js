import InputFile from "components/Shared/InputFile/InputFile";
import NewModal from "components/Shared/NewModal/NewModal";
import React from "react";
import { FaFile, FaPaperclip, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";

const ModalAbsenIzinSakit = ({
  modalType = "izin",
  setKeterangan = () => {},
  setLampiran = () => {},
  lampiran = [],
  onSubmit = () => {},
}) => {
  const deleteLampiran = (deletedLampiran) => {
    const newLampiran = [...lampiran].filter(
      (lamp) => lamp !== deletedLampiran
    );
    setLampiran(newLampiran);
  };

  return (
    <NewModal
      modalId="modalAbsenIzinSakit"
      title={
        <h4 className="mb-0 fw-bold">
          {`Absen ${modalType === "izin" ? "Izin" : "Sakit"}`}
        </h4>
      }
      content={
        <div>
          <h6 className="fw-bold color-dark mb-3">
            {`Kirimkan Bukti Keterangan ${
              modalType === "izin" ? "Izin" : "Sakit atau Surat Dokter"
            }`}
          </h6>
          <TextareaAutosize
            className="form-control"
            autoComplete="off"
            style={{
              resize: "none",
              width: "100%",
            }}
            placeholder="Tuliskan keterangan absen izin"
            minRows={3}
            onChange={(e) => setKeterangan(e.target.value)}
          />
          <div className="d-flex justify-content-between align-items-center mb-3 mt-4 flex-wrap">
            <h6 className="mt-0 fw-bold color-dark">Lampiran</h6>
            <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between">
              <label
                htmlFor="lampiranTimeline"
                className="btn btn-ss fs-12-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold form-label"
              >
                <FaPaperclip className="me-2" />
                Unggah File
              </label>
              <InputFile
                name="lampiranTimeline"
                id="lampiranTimeline"
                onChange={(e, fileUrl) => setLampiran([...lampiran, fileUrl])}
              />
            </div>
          </div>
          {lampiran?.map((dataLampiran, idx) => (
            <div
              className="card-lampiran-materi border-light-secondary rounded-ss mb-3"
              key={`${idx}-${new Date().getTime()}`}
            >
              <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                    <FaFile className="text-white fs-3" />
                  </div>
                  <div className="p-2">
                    <p className="fw-bold color-dark mb-0">{dataLampiran}</p>
                    <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                      {/* PDF */}
                    </span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                  >
                    Pratinjau
                  </button>
                  <FaTimes
                    className="text-secondary pointer"
                    onClick={() => deleteLampiran(dataLampiran)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      submitButton={
        <ReactiveButton
          onClick={() => {}}
          color={"primary"}
          idleText={"Absen"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          className={"btn btn-primary"}
          onClick={onSubmit}
        />
      }
    />
  );
};

export default ModalAbsenIzinSakit;
