import { DatePicker } from "antd";
import {
  postRencanaKeuangan,
  putRencanaKeuangan,
} from "client/RencanaKeuanganClient";
import NewModal from "components/Shared/NewModal/NewModal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const ModalBuatRencana = ({ editData, _getRencana }) => {
  const initialFormData = {
    nama: "",
    tanggalAwal: "",
    tanggalAkhir: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkFormData = (formData) => {
    if (!formData.nama) {
      toast.error("harap memasukan nama");
      return 0;
    }
    if (!formData.tanggalAwal) {
      toast.error("harap memasukan tanggal awal");
      return 0;
    }
    if (!formData.tanggalAkhir) {
      toast.error("harap memasukan tanggal akhir");
      return 0;
    }
    if (formData.tanggalAwal > formData.tanggalAkhir) {
      toast.error("Tanggal akhir harus melebihi tanggal awal");
      return 0;
    }
    return 1;
  };

  const _postRencana = async () => {
    const check = checkFormData(formData);
    if (!check) {
      return;
    }
    const { data, error } = await postRencanaKeuangan({
      ...formData,
      tanggalAkhir: momentPackage(formData?.tanggalAkhir).format(
        "YYYY-MM-DD 23:59:59"
      ),
      tanggalAwal: momentPackage(formData?.tanggalAwal).format(
        "YYYY-MM-DD 00:00:00"
      ),
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalBuatRencana");
      _getRencana();
    } else {
      toast.error(error?.message);
      return;
    }
  };

  const _putRencana = async () => {
    const check = checkFormData(formData);
    if (!check) {
      return;
    }
    const { data, error } = await putRencanaKeuangan(formData?.id, {
      ...formData,
      tanggalAkhir: momentPackage(formData?.tanggalAkhir).format(
        "YYYY-MM-DD 23:59:59"
      ),
      tanggalAwal: momentPackage(formData?.tanggalAwal).format(
        "YYYY-MM-DD 00:00:00"
      ),
    });

    if (data) {
      toast.success(data?.message);
      hideModal("modalBuatRencana");
      _getRencana();
    } else {
      toast.error(error?.message);
      return;
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        tanggalAwal: momentPackage(editData.tanggalAwal).format("YYYY-MM-DD"),
        tanggalAkhir: momentPackage(editData.tanggalAkhir).format("YYYY-MM-DD"),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  return (
    <NewModal
      modalId="modalBuatRencana"
      onCloseModal={() => {
        setFormData({ ...initialFormData });
      }}
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData ? "Ubah" : "Buat"} Perencanaan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "membuat"}{" "}
            perencanaan
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama perencanaan</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama perencanaan"
              type="text"
              name="nama"
              value={formData.nama}
              maxLength={255}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Tanggal Awal</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeForm({
                      target: {
                        name: "tanggalAwal",
                        value: dateString,
                      },
                    })
                  }
                  // picker="month"
                  placeholder="Tanggal Awal"
                  className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                  autoComplete="off"
                  style={{
                    height: "42px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                  }}
                  value={
                    formData.tanggalAwal
                      ? momentPackage(formData.tanggalAwal)
                      : ""
                  }
                />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label">Tanggal Akhir</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeForm({
                      target: {
                        name: "tanggalAkhir",
                        value: dateString,
                      },
                    })
                  }
                  // picker="month"
                  placeholder="Tanggal Akhir"
                  className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                  autoComplete="off"
                  style={{
                    height: "42px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                  }}
                  value={
                    formData.tanggalAkhir
                      ? momentPackage(formData.tanggalAkhir)
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          //   buttonState={buttonState}
          onClick={editData ? _putRencana : _postRencana}
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

export default ModalBuatRencana;
