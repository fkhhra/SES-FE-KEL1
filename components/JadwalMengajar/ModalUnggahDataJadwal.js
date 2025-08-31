import axios from "axios";
import { baseURL, downloadURL } from "client/clientAxios";
import { downloadImportJadwal } from "client/JadwalMengajarClient";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalUnggahDataJadwal = ({ tingkat }) => {
  const [btnState, setBtnState] = useState("idle");
  const [file, setFile] = useState("");

  const [progress, setProgress] = useState(0);
  const [downloadingRekapJadwal, setDownloadingImportJadwal] = useState(false);
  const handleClickDownloadImportJadwal = async (tingkat) => {
    setDownloadingImportJadwal(true);
    const toastloading = toast.loading("Downloading");
    const { data, error } = await downloadImportJadwal({ tingkat: tingkat });
    if (data) {
      document.getElementById("downloadIframe").src = `${downloadURL}/${data}`;
      //   window.open(`${downloadURL}/${data}`, "_blank");
      setDownloadingImportJadwal(false);
      toast.success("Downloaded", { id: toastloading });
    } else if (error) {
      toast.error("silahkan Coba beberapa saat lagi");
      toast.error("Error", { id: toastloading });
    }
  };
  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setProgress(uploadProgress);
    }
  };
  useEffect(() => {
    if (progress === 100) {
      setProgress(0);
    }
  }, [progress]);
  const importTemplate = async () => {
    if (!file) {
      toast.error("File Wajib Diisi");
    }
    setBtnState("loading");

    const form = new FormData();
    form.append("file", file);
    setDownloadingImportJadwal(true);
    const toastloading = toast.loading("Sedang Memproses Data");

    const { data, error } = await axios.post(
      baseURL + `/import/jadwal-mengajar`,
      form,
      checkProgress
    );

    if (data) {
      toast.success("Import Berhasil");
      hideModal("modalUnggahDataJadwal");
      // _detailEskul();
      setBtnState("success");
      setDownloadingImportJadwal(false);
      toast.success("Downloaded", { id: toastloading });
    } else {
      setBtnState("error");
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };

  return (
    <>
      <LoadingProgress
        key={"progress-2"}
        progress={progress}
        loadingText="Sedang mengkompres file"
        successText="Berhasil mengkompres file"
      />
      <NewModal
        modalId="modalUnggahDataJadwal"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Unggah Data Tingkat {tingkat}</h4>
          </>
        }
        modalSize="md"
        content={
          <>
            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label mb-0"
                >
                  Unggah Data
                </label>
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => handleClickDownloadImportJadwal(tingkat)}
                  className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
                >
                  <FaCloudDownloadAlt className="me-2" />
                  Download Template
                </a>
              </div>
            </div>
            <UploadFile
              handleChange={({ target }) => setFile(target.files[0])}
              file={file}
              deleteFile={() => setFile("")}
            />
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

export default ModalUnggahDataJadwal;
