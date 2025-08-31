import axios from "axios";
import { baseURL } from "client/clientAxios";
import UploadFile from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../../Shared/NewModal/NewModal";
import {
  postPenerimaanPerusahaan,
  putPenerimaanPerusahaan,
} from "client/PKLClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { Select } from "antd";
import { getKeuanganSekolah } from "client/KeuanganSekolahClient";

const initialFormData = {
  nama: "",
  tkPerusahaanSekolahId: "",
};

const ModalTemplateLaporanNeraca = ({
  edit,
  _getPenerimaanPerusahaan,
  id,
  onClickEdit,
  handleChangeForm,
  formData,
  editNamaMapel,
  setFormData,
  initialFormData,
  akun,
  keuangan,
  _postAkunNeraca,
  _editAkunNeraca,
}) => {
  console.log(keuangan, 1);
  // const [keuangan, setKeuangan] = useState({});

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

  useEffect(() => {
    if (edit) {
      setFormData({
        ...edit,
      });
    }
  }, [edit]);

  // useEffect(() => {
  //   _getKeuanganSekolah();
  // }, []);
  return (
    <>
      <NewModal
        modalId="modalTemplateLaporanNeraca"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {edit ? "Ubah" : "Tambah"} Akun
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk {edit ? "mengubah" : "menambah"} Akun
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Nama Akun</label>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <SelectShared
                    name="moda"
                    options={keuangan?.map((d) => {
                      return {
                        label: `${d?.kode} - ${d?.nama}`,
                        value: d?.id,
                      };
                    })}
                    placeholder="Pilih Akun"
                    value={formData?.mKeuAkunId || edit?.mKeuAkunId}
                    handleChangeSelect={(e) => {
                      setFormData({
                        ...formData,
                        mKeuAkunId: e?.value || "",
                      });
                    }}
                    isClearable
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Pengaturan</label>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="pengaturan"
                  id="kosong"
                  value={""}
                  onChange={(e) =>
                    handleChangeForm({
                      target: { name: "pengaturan", value: e.target.value },
                    })
                  }
                  checked={!formData?.pengaturan}
                />
                <label class="form-check-label" for="kosong">
                  default
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="pengaturan"
                  id="positif"
                  value={"positif"}
                  onChange={(e) =>
                    handleChangeForm({
                      target: { name: "pengaturan", value: e.target.value },
                    })
                  }
                  checked={formData?.pengaturan == "positif"}
                />
                <label class="form-check-label" for="positif">
                  Selalu Positif
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="pengaturan"
                  id="negatif"
                  value={"negatif"}
                  onChange={(e) =>
                    handleChangeForm({
                      target: { name: "pengaturan", value: e.target.value },
                    })
                  }
                  checked={formData?.pengaturan == "negatif"}
                />
                <label class="form-check-label" for="negatif">
                  Dibalik
                </label>
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={formData?.btnBio}
            onClick={edit ? _editAkunNeraca : _postAkunNeraca}
            color={"primary"}
            idleText={edit ? "Ubah" : "Simpan"}
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

export default ModalTemplateLaporanNeraca;
