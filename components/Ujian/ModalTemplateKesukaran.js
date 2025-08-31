import { InputNumber } from "antd";
import {
  editTemplateKesukaran,
  postTemplateKesukaran,
} from "client/AnalisisSoalClient";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";

const initialFormData = {
  judul: "",
  batasBawah: "",
  batasAtas: "",
  mMateriId: null,
};
const ModalTemplateKesukaran = ({
  editData = null,
  setEditData,
  _getAnalisisData,
  materiId,
}) => {
  const isEdit = editData !== null;

  const [buttonState, setButtonState] = useState("idle");

  const [formData, setFormData] = useState(initialFormData);
  // console.log(formData);
  const [uploading, setUploading] = useState(false);

  const handleChangeInput = (e) => {
    // console.log(e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  // console.log(handleChangeInput);

  const setupPayload = () => {
    const payload = {
      ...formData,
      mMateriId: materiId,
    };

    return payload;
  };

  const handleSubmit = async () => {
    if (!formData.judul) {
      toast.error("Anda belum memasukkan judul");
      return;
    } else if (!formData.batasBawah) {
      toast.error("Anda belum memasukkan batas bawah");
      return;
    } else if (!formData.batasAtas) {
      toast.error("Anda belum memasukkan batas atas");
      return;
    }
    const payload = setupPayload();
    const { data, error } = isEdit
      ? await editTemplateKesukaran(editData?.id, payload)
      : await postTemplateKesukaran(payload);
    if (data) {
      setEditData(null);
      setButtonState("success");
      setFormData(initialFormData);
      hideModal("modalTemplateKesukaran");
      _getAnalisisData();
      toast.success(data?.message);
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (editData !== null) {
      setFormData({
        judul: editData.judul,
        batasBawah: editData.batasBawah,
        batasAtas: editData.batasAtas,
        mMateriId: materiId,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  return (
    <>
      <NewModal
        modalId="modalTemplateKesukaran"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Buat Tingkat Kesukaran</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk membuat tingkat kesukararan
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Judul</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="judul"
                placeholder="Masukkan judul"
                value={formData?.judul}
                onChange={handleChangeInput}
              />
            </div>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Batas Bawah</label>
                <InputNumber
                  className="form-control w-100"
                  defaultValue="0"
                  step="0.01"
                  //   formatter={(value) =>
                  //     `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  //   }
                  placeholder="Contoh : 0.5"
                  autoComplete="off"
                  name="batasBawah"
                  value={formData?.batasBawah}
                  // onChange={handleChangeInput}
                  //   parser={(value) => value.replace(/Rp|\./g, "")}
                  min={0}
                  max={1}
                  onChange={(value) => {
                    if (parseFloat(value) >= 0 && parseFloat(value) <= 1) {
                      handleChangeInput({
                        target: { value, name: "batasBawah" },
                      });
                    } else {
                      toast.error("Pilih diantara 0 - 1");
                    }
                  }}
                  stringMode
                  //   step={1000}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Batas Atas</label>
                <InputNumber
                  step="0.01"
                  defaultValue="1"
                  className="form-control w-100"
                  placeholder="Contoh : 0.56"
                  autoComplete="off"
                  name="batasAtas"
                  value={formData?.batasAtas}
                  onChange={(value) => {
                    if (parseFloat(value) >= 0 && parseFloat(value) <= 1) {
                      handleChangeInput({
                        target: { value, name: "batasAtas" },
                      });
                    } else {
                      toast.error("Pilih diantara 0 - 1");
                    }
                  }}
                  stringMode
                />
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            // buttonState={formData.btnBio}
            buttonState={buttonState}
            onClick={handleSubmit}
            color={"primary"}
            idleText={`${isEdit ? "Ubah" : "Tambah"}`}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}

            // onClick={() => _postProfilUser()}
          />
        }
      />
    </>
  );
};

export default ModalTemplateKesukaran;
