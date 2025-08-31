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
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { postPeringatanUjian } from "client/UjianClient";

const ModalTambahPeringatan = ({ dataPeserta }) => {
  const initialFormData = {
    deskripsi: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");

  const [deskripsi, setDeskripsi] = useState("");

  const _postPeringatan = async () => {
    const validate = formValidation(formData?.deskripsi);
    if (validate) {
      toast.error(validate);
      return;
    }
    setBtnState("loading");
    const { data, error } = await postPeringatanUjian({
      ...formData,
      tk_jadwal_ujian_id: dataPeserta?.tkJadwalUjianId,
      tk_peserta_ujian_id: dataPeserta?.id,
    });

    if (data) {
      setBtnState("success");

      toast.success(data?.message);
      hideModal("modalTambahPeringatan");
    }
    if (error) {
      setBtnState("error");
      toast.error(data?.message);
      return;
    }
  };

  const formValidation = (deskripsi) => {
    if (!deskripsi) {
      return "Harap Memasukan Deskripsi Peringatan";
    }
    return "";
  };

  //   const handleChangeInput = (e, uploadedFile) => {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: uploadedFile || e.target.value,
  //     });
  //   };
  const handleChangeForm = (e) => {
    console.log(e);
    setFormData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <NewModal
        modalId="modalTambahPeringatan"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Tambah Peringatan Siswa</h4>
          </>
        }
        modalSize="md"
        content={
          <>
            {/* <div className="mb-4">
              <label className="form-label">Jenis Peringatan</label>
              <SelectShared
                name="kepemilikan"
                placeholder="Pilih jenis peringatan"
                // options={statusData?.map((d) => {
                //   return {
                //     label: `${d?.label}`,
                //     value: d?.value,
                //   };
                // })}
                // handleChangeSelect={(e, name) => {
                //   setFormData({
                //     ...formData,
                //     jenisPeringatan: e?.value,
                //   });
                // }}
                // {changeRombel}
                // value={formData?.jenisPeringatan || ""}
              />
            </div> */}
            <div className="mb-4">
              <label className="form-label">Deskripsi Peringatan</label>
              <div className="mb-4">
                <TextareaAutosize
                  className="form-control"
                  placeholder="Deskripsi peringatan"
                  autoComplete="off"
                  name="deskripsi"
                  style={{
                    resize: "none",
                    width: "100%",
                    height: "100%",
                  }}
                  minRows={4}
                  value={formData?.deskripsi}
                  onChange={handleChangeForm}
                />
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            onClick={_postPeringatan}
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

export default ModalTambahPeringatan;
