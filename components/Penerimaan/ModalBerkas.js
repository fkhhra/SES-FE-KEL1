import CompleteFileUpload from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import { putNilaiPenerimaan } from "client/PenerimaanClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import { getFileName } from "utilities/FileViewer";

const initialFormData = {
  idCard: "",
  kontrak: "",
  sertifikat: "",
  mUserId: "",
};
const ModalBerkas = ({ editDataBerkas, _getPenerimaanPkl31, isRekrutmen }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");

  const predikatNilai = [
    { nama: "A", value: "A" },
    { nama: "B", value: "B" },
    { nama: "C", value: "C" },
    { nama: "D", value: "D" },
  ];

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const _putNilaiPkl = async () => {
    setBtnState("loading");
    const { data, error } = await putNilaiPenerimaan({
      ...formData,
      m_user_id: formData?.mUserId,
    });

    if (data) {
      setBtnState("success");

      toast.success(data?.message);
      hideModal("modalBerkas");
      // setFormData({ ...initialFormData });
      _getPenerimaanPkl31();
    }
  };

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  useEffect(() => {
    if (editDataBerkas) {
      setFormData({
        ...formData,
        ...editDataBerkas,
        idCard: editDataBerkas?.user?.keteranganPkl1?.idCard,
        kontrak: editDataBerkas?.user?.keteranganPkl1?.kontrak,
        sertifikat: editDataBerkas?.user?.keteranganPkl1?.sertifikat,
        mUserId: editDataBerkas?.user?.id,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editDataBerkas]);
  return (
    <>
      <NewModal
        modalId="modalBerkas"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Lihat Berkas</h4>
          </>
        }
        content={
          <>
            {isRekrutmen && (
              <>
                <div className="mb-4">
                  <label className="form-label">ID Card</label>
                  <FileAttachment />
                </div>
                <div className="mb-4">
                  <label className="form-label">Surat Keterangan</label>
                  <FileAttachment />
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="form-label">ID Card</label>
              <CompleteFileUpload
                name={getFileName(formData?.idCard)}
                id="idCard"
                onChange={(e, url) => {
                  changeFormData("idCard", url);
                }}
                file={formData?.idCard}
                deleteFile={() => {
                  changeFormData("idCard", "");
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Kontrak</label>
              <CompleteFileUpload
                name={getFileName(formData?.kontrak)}
                id="kontrak"
                onChange={(e, url) => {
                  changeFormData("kontrak", url);
                }}
                file={formData?.kontrak}
                deleteFile={() => {
                  changeFormData("kontrak", "");
                }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Sertifikat</label>
              <CompleteFileUpload
                name={getFileName(formData?.sertifikat)}
                id="sertifikat"
                onChange={(e, url) => {
                  changeFormData("sertifikat", url);
                }}
                file={formData?.sertifikat}
                deleteFile={() => {
                  changeFormData("sertifikat", "");
                }}
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
            onClick={() => _putNilaiPkl()}
          />
        }
      />
    </>
  );
};

export default ModalBerkas;
