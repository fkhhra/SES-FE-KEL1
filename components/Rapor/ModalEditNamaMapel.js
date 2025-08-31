import axios from "axios";
import { baseURL } from "client/clientAxios";
import UploadFile from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import {
  postPenerimaanPerusahaan,
  putPenerimaanPerusahaan,
} from "client/PKLClient";

const initialFormData = {
  nama: "",
  tkPerusahaanSekolahId: "",
};

const ModalEditNamaMapel = ({
  editData,
  _getPenerimaanPerusahaan,
  id,
  onClickEdit,
  handleChangeForm,
  formData,
  editNamaMapel,
  setFormData,
  initialFormData,
}) => {
  // const [formData, setFormData] = useState(initialFormData);
  // const [btnState, setBtnState] = useState("idle");
  // const [file, setFile] = useState("");

  // const _postPenerimaanPerusahaan = async () => {
  //   setBtnState("loading");
  //   const { data, error } = await postPenerimaanPerusahaan({
  //     ...formData,
  //     mPerusahaanId: id,
  //   });

  //   if (data) {
  //     setBtnState("success");

  //     toast.success(data?.message);
  //     hideModal("modalPenerimaanPkl");
  //     // setFormData({ ...initialFormData });
  //     _getPenerimaanPerusahaan();
  //   }
  // };

  // const _putPenerimaanPerusahaan = async () => {
  //   setBtnState("loading");

  //   const { data, error } = await putPenerimaanPerusahaan(formData?.id, {
  //     ...formData,
  //     mPerusahaanId: id,
  //   });

  //   if (data) {
  //     setBtnState("success");

  //     toast.success(data?.message);
  //     hideModal("modalPenerimaanPkl");
  //     // setFormData({ ...initialFormData });
  //     _getPenerimaanPerusahaan();
  //   }
  // };

  // const handleChangeForm = (e, uploadedFile) => {
  //   setFormData({
  //     ...formData,
  //     [e?.target?.name]: uploadedFile || e?.target?.value,
  //   });
  // };

  // useEffect(() => {
  //   if (onClickEdit) {
  //     setFormData({
  //       ...onClickEdit,
  //     });
  //   } else {
  //     setFormData(initialFormData);
  //   }
  // }, [onClickEdit]);

  return (
    <>
      <NewModal
        modalId="modalEditNamaMapel"
        modalSize="sm"
        title={
          <>
            <h5>Edit Nama Mapel Rapor</h5>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Nama Mapel di Rapor</label>
              <TextareaAutosize
                className="form-control"
                minRows={1}
                name="namaMapel"
                value={formData?.namaMapel}
                onChange={handleChangeForm}
              />
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Lampiran Data Siswa
              </label>
              <UploadFile
                setLoading={(bool) =>
                  bool ? setBtnState("loading") : setBtnState("idle")
                }
                name="Data Siswa"
                id="dataSiswa"
                file={formData?.dataSiswa}
                onChange={(e, url) =>
                  handleChangeForm({
                    target: { name: "dataSiswa", value: url },
                  })
                }
                deleteFile={() =>
                  handleChangeForm({ target: { name: "dataSiswa", value: "" } })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Lampiran Surat Tugas
              </label>
              <UploadFile
                setLoading={(bool) =>
                  bool ? setBtnState("loading") : setBtnState("idle")
                }
                name="Surat Tugas"
                id="suratTugas"
                file={formData?.suratTugas}
                onChange={(e, url) =>
                  handleChangeForm({
                    target: { name: "suratTugas", value: url },
                  })
                }
                deleteFile={() =>
                  handleChangeForm({
                    target: { name: "suratTugas", value: "" },
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label"
              >
                Lampiran MoU
              </label>
              <UploadFile
                setLoading={(bool) =>
                  bool ? setBtnState("loading") : setBtnState("idle")
                }
                name="MoU"
                id="mou"
                file={formData?.mou}
                onChange={(e, url) =>
                  handleChangeForm({
                    target: { name: "mou", value: url },
                  })
                }
                deleteFile={() =>
                  handleChangeForm({ target: { name: "mou", value: "" } })
                }
              />
            </div> */}
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={formData.btnBio}
            onClick={editNamaMapel}
            color={"primary"}
            idleText={"Simpan"}
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

export default ModalEditNamaMapel;
