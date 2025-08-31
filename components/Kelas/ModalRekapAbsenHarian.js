import { useState } from "react";
import { DatePicker } from "antd";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import { downloadURL } from "client/clientAxios";
import { downloadRekapAbsensiHarian } from "client/KegiatanClient";

import ReactiveButton from "reactive-button";
import moment from "moment";
import NewModal from "components/Shared/NewModal/NewModal";

const initialFormData = {
  tanggalAwal: momentPackage().subtract(7, "days"),
  tanggalAkhir: momentPackage(),
  buttonState: "idle",
};

const ModalRekapAbsenHarian = ({ isEdit, rombelId }) => {

  const [formData, setFormData] = useState(initialFormData);

  const _downloadMonev = async () => {
    setFormData({ ...formData, buttonState: "loading" });

    const payload = {
      tanggalAwal: momentPackage(formData.tanggalAwal).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggalAkhir: momentPackage(formData.tanggalAkhir).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      rombelId: rombelId
    };

    const { data } = await downloadRekapAbsensiHarian(payload);

    if (data) {
      setFormData({ ...initialFormData, buttonState: "success" });
      hideModal("modalRekapAbsenHarian");
      window.open(`${downloadURL}${data}`);
    } else {
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  function handleChangeDatePicker(date, dateString, name) {
    setFormData({
      ...formData,
      [name]: dateString ? moment(date) : "",
    });
  }

  return (
    <NewModal
      modalId="modalRekapAbsenHarian"
      modalSize="md"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Unduh"} Rekap Absensi Harian
          </h4>
          {/* <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "mengunduh"}{" "}
            hasil monitoring evalusi
          </span> */}
        </>
      }
      content={
        <>
          <div className="mb-3">
            <label className="form-label">Tanggal Awal</label>
            <DatePicker
              className="form-control"
              autoComplete="off"
              value={formData?.tanggalAwal}
              placeholder="Pilih tanggal"
              onChange={(date, dateString) =>
                handleChangeDatePicker(date, dateString, "tanggalAwal")
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Akhir</label>
            <DatePicker
              className="form-control"
              autoComplete="off"
              value={formData?.tanggalAkhir}
              placeholder="Pilih tanggal"
              onChange={(date, dateString) =>
                handleChangeDatePicker(date, dateString, "tanggalAkhir")
              }
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData.buttonState}
          onClick={_downloadMonev}
          color={"primary"}
          idleText={`${isEdit ? "Ubah" : "Unduh"}`}
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

export default ModalRekapAbsenHarian;
