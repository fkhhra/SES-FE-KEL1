import { DatePicker } from "antd";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { editTimeline, postTimeline } from "client/TimelineClient";

import moment from "moment";
import toast from "react-hot-toast";

import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import useEditModal from "hooks/useEditModal";
import NewModal from "components/Shared/NewModal/NewModal";

const initialFormData = {
  tanggalPembagian: "",
  tanggalAkhir: "",
  deskripsi: "",
  gmeet: ""
}

const ModalBuatPertemuan = ({ kelasId, getDetailRombelData, _getTimeline }) => {

  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  }
  
  const editModalData = useEditModal(state => state.editModal?.ModalBuatPertemuan);

  const submit = async () => {
    setButtonState("loading");
    let body = {
      ...formData,
      tipe: "absen",
      mJadwalMengajarId: kelasId,
      tanggalPembagian: momentPackage(formData.tanggalPembagian).format("YYYY-MM-DD HH:mm:ss"),
      tanggalAkhir: moment(formData.tanggalAkhir).format("YYYY-MM-DD HH:mm:ss")
    }

    const { isSuccess, data, error } = editModalData ? await editTimeline(editModalData?.id, body) : await postTimeline(body);
    if (isSuccess) {
      toast.success(data?.message);
      hideModal("ModalBuatPertemuan");
      setButtonState("success");
      getDetailRombelData && getDetailRombelData();
      _getTimeline && _getTimeline()
      setFormData(initialFormData);
    }
    setButtonState("idle")
  }

  useEffect(() => {
    if (editModalData) {
      setFormData({
        tanggalPembagian: momentPackage(editModalData?.tanggalPembagian),
        tanggalAkhir: momentPackage(editModalData?.tanggalAkhir),
        deskripsi: editModalData?.deskripsi,
        gmeet: editModalData?.gmeet
      })
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="ModalBuatPertemuan"
      title={
        <>
          <h4 className="mb-0 fw-extrabold">
            {`${editModalData ? "Ubah" : "Buat"} Pertemuan`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${editModalData ? "mengubah" : "membuat"} pertemuan`}
          </span>
        </>
      }
      content={
        <>
          <div className="mb-3">
            <div className="row">
              <div className="col-md">
                <label className="form-label">Mulai Pertemuan</label>
                <DatePicker
                  className="form-control"
                  autoComplete="off"
                  showTime
                  secondStep={60}
                  minuteStep={5}
                  onChange={date => changeFormData("tanggalPembagian", date)}
                  placeholder="Tanggal dibagikan"
                  value={formData?.tanggalPembagian}
                  format="DD-MM-YYYY HH:mm:ss"
                />
              </div>
              <div className="col-md">
                <label className="form-label">Akhir Pertemuan</label>
                <DatePicker
                  className="form-control"
                  autoComplete="off"
                  showTime
                  secondStep={60}
                  minuteStep={5}
                  onChange={date => changeFormData("tanggalAkhir", date)}
                  placeholder="Tanggal dibagikan"
                  disabledDate={(current) => current < momentPackage(formData?.tanggalPembagian)}
                  value={formData?.tanggalAkhir}
                  format="DD-MM-YYYY HH:mm:ss"
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Tuliskan deskripsi absen harian"
              minRows={3}
              name="deskripsi"
              onChange={e => changeFormData("deskripsi", e.target.value)}
              value={formData.deskripsi}
            />
          </div>
          <div className="mb-3">
            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
              <label className="form-label mb-0">Link Google Meet</label>
              <a
                href="https://meet.google.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="py-1 px-3 bg-soft-primary rounded-pill fs-12-ss color-primary text-decoration-none fw-semibold"
              >
                <FaLink className="me-2" />
                Ambil Link Google Meet
              </a>
            </div>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              id="exampleFormControlInput1"
              placeholder="Tempel link Google Meet disini"
              name="gmeet"
              onChange={e => changeFormData("gmeet", e.target.value)}
              value={formData.gmeet}
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          color={"primary"}
          idleText={`${editModalData ? "Ubah" : "Buat"} Pertemuan`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={submit}
        />
      }
    />
  );
};

export default ModalBuatPertemuan;
