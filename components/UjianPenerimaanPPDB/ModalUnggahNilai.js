import axios from "axios";
import { baseURL, downloadURL } from "client/clientAxios";
import { downloadNilaiJadwalPPDB } from "client/JadwalPPDBClient";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalUnggahNilai = ({ id, _detailUjian }) => {
  const [btnState, setBtnState] = useState("idle");
  const [file, setFile] = useState("");
  const [disableDownload, setDisableDownload] = useState(false);

  const download = async () => {
    setDisableDownload(true);
    const { data } = await downloadNilaiJadwalPPDB(id);
    if (data) {
      document.getElementById("downloadIframe").src = baseURL + data;
    } else {
      toast.error("Silahkan Coba beberapa saat lagi");
    }
    setDisableDownload(false);
  };

  const importTemplate = async () => {
    if (!file) {
      toast.error("File Wajib Diisi");
    }
    setBtnState("loading");

    const form = new FormData();
    form.append("file", file);
    form.append("m_ekstrakurikuler_id", id);

    const { data, error } = await axios.post(
      baseURL + `/import-jadwal-ppdb/${id}`,
      form
    );

    if (data) {
      toast.success("Import Berhasil");
      hideModal("modalUnggahNilai");
      _detailUjian();
      setBtnState("success");
      // if (data?.length) {
      //   data?.map((d) => toast.error(d?.message));
      // }
    } else {
      setBtnState("error");
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };
  return (
    <>
      <NewModal
        modalId="modalUnggahNilai"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Unggah Nilai</h4>
          </>
        }
        modalSize="md"
        content={
          <>
            <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
            <p className="fw-bold color-dark mb-4 fs-18-ss">
              Pastikan Anda mengunduh template data nilai sesuai dengan kelas
              yang ingin diberi nilai.
            </p>
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label mb-2"
              >
                Template Data Nilai Ujian Seleksi Masuk 2021
              </label>
              <a
                for="formInputFile"
                onClick={() => (disableDownload ? null : download())}
                className="input-file-ss d-flex align-items-center justify-content-center p-3 rounded-ss w-100 pointer mb-4"
              >
                <img src="/img/icon-file-download.svg" alt="file-download" />
                <h6 className="fw-semibold fs-18-ss color-secondary ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary">File</span>
                </h6>
              </a>
            </div>
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label mb-2"
              >
                Unggah Data
              </label>
              <UploadFile
                handleChange={({ target }) => setFile(target.files[0])}
                file={file}
                deleteFile={() => setFile("")}
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            onClick={importTemplate}
            color={"primary"}
            idleText={"Unggah"}
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

export default ModalUnggahNilai;
