import { DatePicker } from "antd";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import { momentPackage } from "../../utilities/HelperUtils";
import { useEffect, useState } from "react";
import {
  getKalenderData,
  postKalenderPendidikan,
  putKalenderPendidikan,
} from "../../client/KalenderClient";
import { toast } from "react-toastify";
import { hideModal } from "../../utilities/ModalUtils";

const initialFormData = {
  nama: "",
  mLabelKalenderId: "",
  tanggalAwal: momentPackage(),
  tanggalAkhir: momentPackage(),
};

const ModalBuatKalenderPendidikan = ({ _getKalenderData, editData }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const [listLabel, setListLabel] = useState([]);

  const optionLabel =
    (listLabel?.length > 0 &&
      listLabel?.map((label) => ({
        label: label?.nama,
        value: label?.id,
      }))) ||
    [];

  const _getKalenderLabel = async () => {
    const { data } = await getKalenderData();
    if (data) {
      setListLabel(data?.label);
    }
  };

  const handleChangeDate = (date, key) => {
    setFormData({
      ...formData,
      [key]: date ? momentPackage(date) : "",
    });
  };

  const submitModal = async () => {
    setButtonState("loading");
    let body = {
      ...formData,
      tanggalAwal: momentPackage(formData.tanggalAwal).format("YYYY-MM-DD"),
      tanggalAkhir: momentPackage(formData.tanggalAkhir).format("YYYY-MM-DD"),
    };
    const { data } =
      editData != null
        ? await putKalenderPendidikan(editData?.id, { ...body })
        : await postKalenderPendidikan(body);
    if (data) {
      toast.success(data?.message);
      hideModal("ModalBuatKalenderPendidikan");
      setFormData(initialFormData);
      window.location.reload();
      setButtonState("success");
      _getKalenderData();
    }

    setButtonState("idle");
  };

  useEffect(() => {
    _getKalenderLabel();
  }, []);

  useEffect(() => {
    if (editData !== null || editData != undefined) {
      setFormData({
        nama: editData?.nama,
        mLabelKalenderId: editData?.mLabelKalenderId,
        tanggalAwal: momentPackage(editData?.tanggalAwal),
        tanggalAkhir: momentPackage(editData?.tanggalAkhir),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  return (
    <NewModal
      modalId="ModalBuatKalenderPendidikan"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData ? "Edit" : "Buat"} Kalender Pendidikan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk membuat kalender pendidikan
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama Kegiatan Pendidikan</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama kegiatan pendidikan"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Label Kalender</label>
            <SelectShared
              name="label"
              handleChangeSelect={(e) =>
                setFormData({ ...formData, mLabelKalenderId: e.value })
              }
              value={formData.mLabelKalenderId}
              options={optionLabel}
              placeholder="Pilih label kalender"
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label">Tanggal Mulai</label>
              <DatePicker
                onChange={(date, dateString) =>
                  handleChangeDate(dateString, "tanggalAwal")
                }
                placeholder="dd / mm / yyyy"
                className="form-control"
                autoComplete="off"
                value={momentPackage(formData.tanggalAwal)}
              />
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label">Tanggal Selesai</label>
              <DatePicker
                onChange={(date, dateString) =>
                  handleChangeDate(dateString, "tanggalAkhir")
                }
                placeholder="dd / mm / yyyy"
                className="form-control"
                autoComplete="off"
                value={momentPackage(formData.tanggalAkhir)}
              />
            </div>
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={submitModal}
          color={"primary"}
          idleText={`${editData != null ? "Edit" : "Buat"}`}
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

export default ModalBuatKalenderPendidikan;
