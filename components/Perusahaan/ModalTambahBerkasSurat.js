import axios from "axios";
import { baseURL } from "client/clientAxios";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import {
  postBerkasSurat,
  putBerkasSurat,
} from "client/MouSuratPerusahaanClient";

const initialFormData = {
  nama: "",
  lampiran: "",
};
const ModalTambahBerkasSurat = ({ editData, _getDetailBerkas, id }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");
  const [file, setFile] = useState("");

  const _postBerkasSurat = async () => {
    setBtnState("loading");
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }
    const { data, error } = await postBerkasSurat({
      ...formData,
      mPerusahaanId: id,
    });

    if (data) {
      setBtnState("success");

      toast.success(data?.message);
      hideModal("modalTambahBerkasSurat");
      _getDetailBerkas();
    }
  };

  const _putBerkasSurat = async () => {
    setBtnState("loading");

    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }
    const { data, error } = await putBerkasSurat(formData?.id, {
      ...formData,
    });

    if (data) {
      setBtnState("success");

      toast.success(data?.message);
      hideModal("modalTambahBerkasSurat");
      _getDetailBerkas();
    }
  };

  const formValidation = (formData) => {
    if (!formData?.nama) {
      return "Harap Memasukan Nama surat";
    }
    if (!formData?.lampiran) {
      return "Harap Mengupload file surat";
    }
    return "";
  };

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);
  return (
    <>
      <NewModal
        modalId="modalTambahBerkasSurat"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {editData ? "Ubah" : "Tambah"} Berkas Surat
            </h4>
          </>
        }
        modalSize="md"
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Nama</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="nama"
                placeholder="Contoh: Surat Smarteschool"
                value={formData?.nama}
                onChange={handleChangeInput}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label mb-0"
              >
                Lampiran
              </label>
            </div>
            <UploadFileComplete
              id="fileLampiranSurat"
              onChange={(e, fileUrl) => {
                handleChangeInput({
                  target: {
                    name: "lampiran",
                    value: fileUrl,
                  },
                });
              }}
              file={formData?.lampiran}
              deleteFile={() => {
                handleChangeInput({
                  target: {
                    name: "lampiran",
                    value: "",
                  },
                });
              }}
              name="Berkas Surat"
            />
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            onClick={editData ? _putBerkasSurat : _postBerkasSurat}
            color={"primary"}
            idleText={editData ? "Ubah" : "Simpan"}
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

export default ModalTambahBerkasSurat;
