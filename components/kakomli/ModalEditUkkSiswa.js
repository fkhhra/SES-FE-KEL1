import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";

import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import { putNilaiPenerimaan } from "client/PenerimaanClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import { DatePicker } from "antd";
import { deleteUkkSiswa, putUkkSiswa } from "client/KakomliClient";
import { momentPackage } from "utilities/HelperUtils";
const initialFormData = {
  tanggal: "",
  keterangan: "",
  pembimbing: "",
  catatan: "",
};

const ModalEditUkkSiswa = ({ editData, _getUkkSiswa, id }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const _putUkkSiswa = async () => {
    setBtnState("loading");
    const { data, error } = await putUkkSiswa(formData?.id, {
      ...formData,
      m_ta_id: id,
    });

    if (data) {
      setBtnState("success");

      toast.success(data?.message);
      hideModal("modalEditUkkSiswa");
      // setFormData({ ...initialFormData });
      _getUkkSiswa();
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData,
        catatan: editData?.ukkSiswa?.catatan,
        keterangan: editData?.ukkSiswa?.keterangan,
        pembimbing: editData?.ukkSiswa?.pembimbing,
        tanggal: momentPackage(editData?.ukkSiswa?.tanggal).format(
          "YYYY-MM-DD"
        ),
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editData]);
  return (
    <>
      <NewModal
        modalId="modalEditUkkSiswa"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Edit UKK Siswa</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah data UKK siswa
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <h5 className="fw-bold color-dark fs-18-ss mb-2">
                {formData?.nama}
                {/* Elizabeth Swann */}
              </h5>
              <span className="fw-semibold m-0">
                {/* {formData?.rombel}  */}
                XII SIJA 2
              </span>
            </div>
            <div className="mb-4">
              <label className="form-label">Penguji</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nama pembimbing"
                type="text"
                name="pembimbing"
                value={formData?.pembimbing || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Tanggal UKK</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={
                  formData?.tanggal ? momentPackage(formData?.tanggal) : ""
                }
                onChange={(date, dateString) =>
                  handleChangeInput({
                    target: {
                      name: "tanggal",
                      value: dateString,
                    },
                  })
                }
                placeholder="Pilih tanggal UKK"
              />
            </div>
            <div className="col-md">
              <label className="form-label">Keterangan</label>
            </div>
            <div className="col-md mb-4">
              <TextareaAutosize
                className="form-control"
                placeholder="keterangan Lengkap"
                autoComplete="off"
                name="keterangan"
                style={{
                  resize: "none",
                  width: "100%",
                  height: "100%",
                }}
                minRows={4}
                value={formData?.keterangan || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md">
              <label className="form-label">Catatan</label>
            </div>
            <div className="col-md mb-4">
              <TextareaAutosize
                className="form-control"
                placeholder="catatan Lengkap"
                autoComplete="off"
                name="catatan"
                style={{
                  resize: "none",
                  width: "100%",
                  height: "100%",
                }}
                minRows={4}
                value={formData?.catatan || ""}
                onChange={handleChangeInput}
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => _putUkkSiswa()}
          />
        }
      />
    </>
  );
};

export default ModalEditUkkSiswa;
