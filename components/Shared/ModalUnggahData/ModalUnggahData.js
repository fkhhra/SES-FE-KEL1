import axios from "axios";
import { baseURL, downloadURL } from "client/clientAxios";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "components/Shared/NewModal/NewModal";
import { getFileType } from "utilities/FileViewer";
import { useEffect } from "react";

const ModalUnggahData = ({
  id,
  endpoint,
  onSuccess = "",
  template,
  downloadEndpoint,
  fileType = [],
  body = [],
  downloadBody = [],
}) => {
  const [btnState, setBtnState] = useState("idle");
  const [file, setFile] = useState("");
  const [token, setToken] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const importTemplate = async () => {
    const ext = getFileType(file.name);
    if (!file) {
      toast.error("File Wajib Diisi");
      return;
    }
    if (fileType.length && !fileType.includes(ext)) {
      toast.error("Periksa Kembali tipe file anda");
      return;
    }
    setBtnState("loading");

    const form = new FormData();
    form.append("file", file);
    body.map((d) => {
      form.append(d?.name, d?.value);
    });

    if (endpoint) {
      const { data, error } = await axios.post(
        baseURL + `${endpoint}`,
        form,
        config
      );

      if (data) {
        toast.success("Import Berhasil");
        hideModal(id);
        if (onSuccess) {
          onSuccess();
        }
        setBtnState("success");
        // if (data?.length) {
        //   data?.map((d) => toast.success(d?.message));
        // }
      } else {
        setBtnState("error");
        toast.error("Silahkan coba beberapa saat lagi");
      }
      if (error) {
        setBtnState("error");
        toast.error("Silahkan coba beberapa saat lagi");
      }
    }
  };

  const downloadTemplate = async () => {
    const form = new FormData();
    downloadBody.map((d) => {
      form.append(d?.name, d?.value);
    });
    const { data, error } = await axios.post(
      downloadURL + `${downloadEndpoint}`,
      form,
      config
    );

    if (data) {
      toast.success("Import Berhasil");
      document.getElementById("downloadIframe").src = downloadURL + data;
    } else {
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("ss-token")));
  }, []);
  return (
    <>
      <NewModal
        modalId={`${id}`}
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Unggah Data</h4>
          </>
        }
        modalSize="md"
        content={
          <>
            <div className="mb-3">
              <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label mb-0"
                >
                  Unggah Data
                </label>
                {downloadEndpoint ? (
                  <a
                    onClick={() => downloadTemplate()}
                    className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
                  >
                    <FaCloudDownloadAlt className="me-2" />
                    Download Template
                  </a>
                ) : (
                  <a
                    href={template}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
                  >
                    <FaCloudDownloadAlt className="me-2" />
                    Download Template
                  </a>
                )}
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

export default ModalUnggahData;
