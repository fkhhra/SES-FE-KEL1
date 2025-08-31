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

const initialFormData = {
  nilai: "",
  keterangan: "",
  mUserId: "",
};

const ModalNilaiPklSiswa = ({ editDataNilai, _getPenerimaanPkl31 }) => {
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
      hideModal("modalNilaiPklSiswa");
      // setFormData({ ...initialFormData });
      _getPenerimaanPkl31();
    }
  };

  useEffect(() => {
    if (editDataNilai) {
      setFormData({
        ...formData,
        ...editDataNilai,
        nilai: editDataNilai?.user?.keteranganPkl1?.nilai,
        keterangan: editDataNilai?.user?.keteranganPkl1?.keterangan,
        mUserId: editDataNilai?.user?.id,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editDataNilai]);
  return (
    <>
      <NewModal
        modalId="modalNilaiPklSiswa"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Nilai Siswa</h4>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Nilai</label>
              <SelectShared
                name="perusahaan"
                placeholder="Pilih Predikat Nilai"
                options={predikatNilai?.map((d) => {
                  return {
                    label: `${d?.nama}`,
                    value: d?.value,
                  };
                })}
                handleChangeSelect={(e, name) => {
                  setFormData({
                    ...formData,
                    nilai: e?.value,
                  });
                }}
                value={formData?.nilai || ""}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Keterangan</label>
              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                placeholder="Tuliskan keterangan"
                minRows={3}
                name="keterangan"
                value={formData.keterangan}
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
            onClick={() => _putNilaiPkl()}
          />
        }
      />
    </>
  );
};

export default ModalNilaiPklSiswa;
