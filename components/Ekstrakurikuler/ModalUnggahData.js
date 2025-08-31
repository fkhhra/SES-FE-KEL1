import axios from "axios";
import { baseURL } from "client/clientAxios";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalUnggahDataEkstrakurikuler = ({ id, _detailEskul }) => {
  const [btnState, setBtnState] = useState("idle");
  const [file, setFile] = useState("");

  const importTemplate = async () => {
    if (!file) {
      toast.error("File Wajib Diisi");
    }
    setBtnState("loading");

    const form = new FormData();
    form.append("file", file);
    form.append("m_ekstrakurikuler_id", id);

    const { data, error } = await axios.post(
      baseURL + `/anggota-ekskul/import`,
      form
    );
    console.log(data?.data);

    if (data) {
      // toast.success("Import Berhasil");
      hideModal("modalUnggahDataEkstrakurikuler");
      _detailEskul();
      setBtnState("success");
      if (data?.data?.length) {
        data?.data?.map((d) => {
          if (d?.error) {
            toast.error(d?.message)
          } else {
            toast.success(d?.message)
          }
        });
      }
    } else {
      setBtnState("error");
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };
  return (
    <>
      <NewModal
        modalId="modalUnggahDataEkstrakurikuler"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Unggah Data</h4>
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
                  href="/import/template-import-anggota-Ekskul.xlsx"
                  target="_blank"
                  rel="noreferrer noopener"
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

export default ModalUnggahDataEkstrakurikuler;
