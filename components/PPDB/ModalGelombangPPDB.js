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
import SelectShared from "../Shared/SelectShared/SelectShared";
import bankData from "data/bank.json";
import Select, { components } from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import useSekolah from "hooks/useSekolah";

const ModalGelombangPPDB = ({
  editData,
  _detailJalurPpdb,
  isEdit,
  m_jalur_ppdb_id,
  jalur,
}) => {
  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage(),
    diterima: 0,
  };
  const { sekolah } = useSekolah();

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

  const _postGelombangPPDB = async () => {
    if (!formData?.nama) {
      toast.error("Nama Gelombang harus diisi");
      return;
    }
    if (sekolah?.id !== 9487 && sekolah?.id !== 9489) {
      if (formData?.diterima != 0 && !formData?.diterima) {
        toast.error("Jumlah peserta diterima harus diisi");
        return;
      }
    }
    if (!formData?.dibuka) {
      toast.error("Waktu dibuka Gelombang harus diisi");
      return;
    }
    if (!formData?.ditutup) {
      toast.error("Waktu ditutup Gelombang harus diisi");
      return;
    }
    setButtonState("loading");

    const payload = {
      ...formData,
      dibuka: momentPackage(formData.dibuka).format("YYYY-MM-DD HH:mm:ss"),
      ditutup: momentPackage(formData.ditutup).format("YYYY-MM-DD HH:mm:ss"),
      m_jalur_ppdb_id,
    };

    const { data } = isEdit
      ? await editGelombangPPDB(editData?.id, payload)
      : await postGelombangPPDB(payload);

    if (data) {
      setButtonState("success");
      toast.success(data.message);
      hideModal("modalGelombangPPDB");
      _detailJalurPpdb();
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

  const handleChangeSelect = (e) => {
    setFormData({
      ...formData,
      bank: e?.value,
    });
  };

  function handleChangeDatePicker(date, dateString, name) {
    setFormData({
      ...formData,
      [name]: dateString ? moment(date) : "",
    });
  }

  const Option = (props) => {
    return (
      <components.Option {...props}>
        <div className="d-flex align-items-center">
          {props.data.img && (
            <img
              src={props.data.img}
              alt={props.data.label}
              style={{ height: 50, width: 50, objectFit: "contain" }}
            />
          )}
          <div className="ms-4">
            <div>{props.data.label}</div>
            <div style={{ fontSize: 12 }}>{props.data.value}</div>
          </div>
        </div>
      </components.Option>
    );
  };
  return (
    <NewModal
      modalId="modalGelombangPPDB"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Gelombang PPDB
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            gelombang PPDB
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Contoh : Ujian Seleksi Masuk"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChangeForm}
            />
          </div>
          {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
            <div className="mb-4">
              <label className="form-label">Jumlah Penerimaan</label>
              <InputNumber
                className="form-control w-100"
                placeholder="0"
                autoComplete="off"
                name="diterima"
                value={formData?.diterima}
                onChange={(value) =>
                  handleChangeForm({ target: { value, name: "diterima" } })
                }
                step={1000}
              />
            </div>
          )}
          <div className="row mb-4 gy-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Pendaftaran Dibuka</label>
              <DatePicker
                showTime
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                disabledDate={(current) =>
                  current < momentPackage(jalur?.dibuka).startOf("day") ||
                  current > momentPackage(jalur?.ditutup).endOf("day")
                }
                placeholder="Pilih tanggal"
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Pendaftaran Ditutup</label>
              <DatePicker
                showTime
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                disabledDate={(current) =>
                  current < momentPackage(jalur?.dibuka).startOf("day") ||
                  current > momentPackage(jalur?.ditutup).endOf("day")
                }
                placeholder="Pilih tanggal"
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
            {sekolah?.id !== 9487 && sekolah?.id !== 9489 ? (
              <>
                <div className="">
                  <label className="form-label">Nama Bank</label>
                  <Select
                    components={{ Option }}
                    options={bankData}
                    onChange={handleChangeSelect}
                    value={bankData?.filter(
                      (bank) => bank.value === formData.bank
                    )}
                  />
                </div>
                <div className="">
                  <label className="form-label">Nomor Rekening</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan nomor rekening"
                    type="number"
                    name="norek"
                    value={formData.norek}
                    onChange={handleChangeForm}
                  />
                </div>
                <div className="">
                  <label className="form-label">Nama Pemilik Rekening</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan nama pemilik"
                    type="text"
                    name="namaAkun"
                    value={formData.namaAkun}
                    onChange={handleChangeForm}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="">
                  <label className="form-label">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder= {[9349, 9350].includes(sekolah?.id) ? "Tuliskan KKTP Minimal Peserta" : "Tuliskan KKM Minimal Peserta"}
                    type="number"
                    name="norek"
                    value={formData.norek}
                    onChange={handleChangeForm}
                  />
                </div>
              </>
            )}

            {sekolah?.id == 14 && (
              <div className="">
                <label className="form-label">Biaya Pendaftaran</label>
                <InputNumber
                  className="form-control w-100"
                  formatter={(value) =>
                    `Rp${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  placeholder="Rp. 0"
                  autoComplete="off"
                  name="biaya_pendaftaran"
                  value={formData.biaya}
                  parser={(value) => value.replace(/Rp|\./g, "")}
                  onChange={(value) =>
                    handleChangeForm({
                      target: { name: "biaya_pendaftaran", value },
                    })
                  }
                  step={1000}
                />
              </div>
            )}
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={_postGelombangPPDB}
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

export default ModalGelombangPPDB;
