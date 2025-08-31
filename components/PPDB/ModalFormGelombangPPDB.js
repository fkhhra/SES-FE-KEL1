import { DatePicker, InputNumber } from "antd";
import ReactiveButton from "reactive-button";
import moment from "moment";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NewModal from "../Shared/NewModal/NewModal";
import MultipleInputField from "../Shared/MultipleInputField/MultipleInputField";
import Editor from "../Shared/Editor/Editor";
import { momentPackage } from "../../utilities/HelperUtils";
import {
  editGelombangPPDB,
  postGelombangPPDB,
} from "../../client/GelombangPPDB";
import { hideModal } from "../../utilities/ModalUtils";
import { postJalurPpdb, putJalurPpdb } from "client/JalurPpdbClient";

const ModalFormGelombangPPDB = ({
  editData,
  _getJalurPPDB,
  isEdit,
  sekolah,
}) => {
  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage().add(7, "days"),
    biaya: 0,
    tipe: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  useEffect(
    () =>
      setFormData({
        ...editData,
        dibuka: momentPackage(editData?.dibuka),
        ditutup: momentPackage(editData?.ditutup),
      }),
    [editData]
  );

  const _handleSubmitJalur = async () => {
    if (!formData.nama) {
      toast.error("Nama jalur harus diisi");
      return;
    }
    if (!formData.dibuka) {
      toast.error("Tanggal dibuka harus diisi");
      return;
    }
    if (!formData.ditutup) {
      toast.error("Tanggal ditutup harus diisi");
      return;
    }
    if (sekolah?.id !== 9487 && sekolah?.id !== 9489) {
      if (formData?.biaya != 0 && !formData.biaya) {
        toast.error("Biaya jalur harus diisi");
        return;
      }
    }
    setButtonState("loading");

    const payload = {
      ...formData,
      dibuka: momentPackage(formData.dibuka).format("YYYY-MM-DD HH:mm:ss"),
      ditutup: momentPackage(formData.ditutup).format("YYYY-MM-DD HH:mm:ss"),
    };

    const { data } = isEdit
      ? await putJalurPpdb(editData?.id, payload)
      : await postJalurPpdb(payload);

    if (data) {
      setButtonState("success");
      toast.success(data.message);
      hideModal("ModalFormGelombangPPDB");
      _getJalurPPDB();
    } else {
      setButtonState("error");
      toast.error(data.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleChangeDatePicker(date, dateString, name) {
    setFormData({
      ...formData,
      [name]: dateString ? moment(date) : "",
    });
  }

  return (
    <NewModal
      modalId="ModalFormGelombangPPDB"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Jalur Pendaftaran{" "}
            {sekolah?.tingkat == "kampus" ? "Pendaftaran Mahasiswa" : "PPDB"}
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            jalur pendaftaran PPDB
          </span>
        </>
      }
      content={
        <>
          {(sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121) && (
            <div className="mb-4">
              <h6 className="fs-18-ss fw-bold color-dark mb-3">Tipe</h6>
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                  <input
                    className="form-check-input form-check-radio position-absolute"
                    type="radio"
                    id="Pembelian"
                    style={{
                      top: "36%",
                      left: "2em",
                    }}
                    name="tipe"
                    value="Pembelian"
                    checked={formData.tipe == "Pembelian"}
                    onChange={handleChangeForm}
                  />
                  <label
                    className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                    htmlFor="Pembelian"
                  >
                    <span className="ms-4 ps-2">Pembelian</span>
                  </label>
                </div>
                <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                  <input
                    className="form-check-input form-check-radio position-absolute"
                    type="radio"
                    id="Pengembalian"
                    style={{
                      top: "36%",
                      left: "2em",
                    }}
                    value="Pengembalian"
                    name="tipe"
                    checked={formData.tipe == "Pengembalian"}
                    onChange={handleChangeForm}
                  />
                  <label
                    className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                    htmlFor="Pengembalian"
                  >
                    <span className="ms-4 ps-2">Pengembalian</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="form-label">Nama</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Contoh: Jalur Pendaftaran Reguler"
              type="text"
              name="nama"
              value={formData?.nama}
              onChange={handleChangeForm}
            />
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Dibuka</label>
              <DatePicker
                showTime
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                placeholder="Pilih tanggal"
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Ditutup</label>
              <DatePicker
                showTime
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                placeholder="Pilih tanggal"
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
          </div>
          {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
            <div className="mb-4">
              <label className="form-label">Biaya Pendaftaran</label>
              <InputNumber
                className="form-control w-100"
                formatter={(value) =>
                  `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                placeholder="Rp. 0"
                autoComplete="off"
                name="biaya"
                value={formData.biaya}
                parser={(value) => value.replace(/Rp|\./g, "")}
                onChange={(value) =>
                  handleChangeForm({ target: { name: "biaya", value } })
                }
                step={1000}
              />
            </div>
          )}
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={_handleSubmitJalur}
          color={"primary"}
          idleText={`Simpan`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalFormGelombangPPDB;
