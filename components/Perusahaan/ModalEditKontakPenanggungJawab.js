import { DatePicker } from "antd";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";
import { putPenanggungJawabPerusahaan } from "client/PerusahaanClient";
import { momentPackage } from "utilities/HelperUtils";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  namaPj: "",
  teleponPj: "",
  emailPj: "",
  registrasiPj: "",
};
const ModalEditKontakPenanggungJawab = ({
  editData,
  id,
  _getDetailPerusahaan,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const _putPjPerusahaan = async () => {
    setButtonState("loading");
    const { data, error } = await putPenanggungJawabPerusahaan(id, {
      ...formData,
      registrasi_pj: momentPackage(formData?.registrasiPj).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    if (data) {
      setButtonState("success");

      toast.success(data?.message);
      hideModal("modalEditKontakPenanggungJawab");
      // setFormData({ ...initialFormData });
      _getDetailPerusahaan();
    }
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
        ...editData.informasi,
        registrasi_pj: momentPackage(editData?.registrasiPj).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  return (
    <>
      <NewModal
        // onCloseModal={() => setEditIndex(null)}
        modalId="modalEditKontakPenanggungJawab"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Ubah Kontak Penanggung Jawab</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah kontak penanggung jawab
            </span>
          </>
        }
        content={
          <>
            <div className="row g-4">
              <div className="col-md-12">
                <label className="form-label">Nama</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="namaPj"
                  placeholder="Masukkan nama"
                  value={formData?.namaPj}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Nomor Telepon</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="teleponPj"
                  placeholder="Masukkan nomor telepon"
                  value={formData?.teleponPj}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="emailPj"
                  placeholder="Masukkan email"
                  value={formData?.emailPj}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Tanggal Registrasi</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: {
                        name: "registrasiPj",
                        value: dateString,
                      },
                    })
                  }
                  placeholder="Pilih tahun"
                  className="form-control"
                  autoComplete="off"
                  value={
                    formData?.registrasiPj
                      ? momentPackage(formData?.registrasiPj)
                      : ""
                  }
                />
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={`Simpan`}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={_putPjPerusahaan}
          />
        }
      />
    </>
  );
};

export default ModalEditKontakPenanggungJawab;
