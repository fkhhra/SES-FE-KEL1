import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import listNegara from "../../data/negara.json";
import { postKalenderLabel, updateKalenderLabel } from "../../client/KalenderClient";
import { toast } from "react-toastify";
import { hideModal } from "../../utilities/ModalUtils";

const CustomSelect = (props) => {
  return (
    <div className="d-flex align-items-center">
      <div style={{ width: 24, height: 24, background: props.data.value, borderRadius: "50%" }} />
      <span className="ms-2">{props.data.label}</span>
    </div>
  )
}

const initialFormData = {
  nama: "",
  warna: ""
}

const ModalBuatLabelKalender = ({ _getKalenderData, editKalenderData=null }) => {

  const [formData, setFormData] = useState(initialFormData)

  const colorOption = [
    {
      label: "Merah",
      value: "#FC544B"
    },
    {
      label: "Hijau",
      value: "#63ED7A"
    },
    {
      label: "Biru",
      value: "#2680EB"
    },
    {
      label: "Kuning",
      value: "#FFC107"
    },
    {
      label: "Ungu",
      value: "#7986CB"
    }    
  ]

  const handleChangeSelect = (e) => {
    setFormData({
      ...formData,
      warna: e.value
    });
  }

  const submitModal = async () => {
    const { data } = editKalenderData ? await updateKalenderLabel(formData, editKalenderData.data.id) : await postKalenderLabel(formData)
    if (data) {
      toast.success(data?.message);
      hideModal("ModalBuatLabelKalender");
      _getKalenderData();
      setFormData(initialFormData);
    }
  }

  useEffect(() => {
    if (editKalenderData !== null) {
      setFormData({
        nama: editKalenderData.data.nama,
        warna: editKalenderData.data.warna,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editKalenderData])

  return (
    <>
      <NewModal
        modalId="ModalBuatLabelKalender"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {`${editKalenderData ? "Ubah" : "Buat"} Label Kalendar`}
            </h4>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Label</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="nama"
                placeholder="Masukkan nama label"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label className="form-label">Warna</label>
              <SelectShared
                name="kelulusan"
                placeholder="Pilih Warna"
                customSelect={(props) => <CustomSelect {...props} />}
                handleChangeSelect={handleChangeSelect}
                value={formData.warna}
                options={colorOption}
                colorLeft
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => submitModal()}
          />
        }
      />
    </>
  );
};

export default ModalBuatLabelKalender;
