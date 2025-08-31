import { DatePicker, TimePicker } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { postJadwalKonsultasi } from "../../../client/KonsultasiClient";
import { momentPackage } from "../../../utilities/HelperUtils";

const initialFormData = {
  waktuMulai: "",
  waktuBerakhir: "",
  media: "",
  keterangan: "",
  status: 1,
};

const CardBuatJadwalKonsultasi = ({ konsultasi, _getDetailKonsultasi }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChangeTimePicker = (value, key) => {
    setFormData({
      ...formData,
      [key]: momentPackage(value, "HH:mm"),
    });
  };

  const radioMediaKonsultasi = [
    {
      label: "Bertemu Langsung",
      id: "radio-bertemu-langsung",
      checked: konsultasi?.mediaKonsultasi === "Bertemu Langsung",
    },
    {
      label: "Meeting Online",
      id: "radio-meeting-online",
      checked: konsultasi?.mediaKonsultasi === "Meeting Online",
    },
    {
      label: "Whatsapp",
      id: "radio-whatsapp",
      checked: konsultasi?.mediaKonsultasi === "Whatsapp",
    },
  ];

  const handleChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buatJadwalKonsultasi = async () => {
    let body = {
      ...formData,
      waktuMulai: momentPackage(formData.waktuMulai).format("HH:mm"),
      waktuBerakhir: momentPackage(formData.waktuBerakhir).format("HH:mm"),
    };

    const { data } = await postJadwalKonsultasi(body, konsultasi?.id);
    if (data) {
      toast.success(data?.message);
      _getDetailKonsultasi();
    }
  };

  return (
    <div className="card card-ss mt-4">
      <div className="card-body">
        <h4 className="fw-extrabold color-dark">Buat Jadwal Konsultasi</h4>

        <div className="mb-4">
          <label className="form-label">Tanggal</label>
          <input
            className="form-control"
            autoComplete="off"
            type="text"
            name="golDarah"
            placeholder="Masukkan Keterangan"
            value={momentPackage(konsultasi?.tanggalKonsultasi).format(
              "DD / MM / YYYY"
            )}
            disabled
          />
        </div>

        <div className="d-flex align-items-center w-100">
          <div className="mb-4 w-50 me-4">
            <label className="form-label">Waktu Mulai</label>
            <TimePicker
              onChange={(date, dateString) =>
                handleChangeTimePicker(dateString, "waktuMulai")
              }
              autoComplete="off"
              format="HH:mm"
              placeholder="-- : --"
              className="form-control"
              value={formData?.waktuMulai}
            />
          </div>
          <div className="mb-4 w-50">
            <label className="form-label">Waktu Berakhir</label>
            <TimePicker
              onChange={(date, dateString) =>
                handleChangeTimePicker(date, "waktuBerakhir")
              }
              autoComplete="off"
              format="HH:mm"
              placeholder="-- : --"
              className="form-control"
              value={formData?.waktuBerakhir}
            />
          </div>
        </div>

        <label className="form-label">Media Konsultasi</label>
        <div className="row w-100 mb-4">
          {radioMediaKonsultasi?.map((radio, index) => (
            <div
              className="form-check-ss col-md-4 position-relative"
              key={`${index}-${new Date().getTime()}`}
            >
              <input
                className="form-check-input form-check-radio position-absolute"
                type="radio"
                id={radio?.id}
                style={{
                  top: "36%",
                  left: "2em",
                }}
                checked={radio?.checked}
              />
              <label
                className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                htmlFor={radio?.id}
                disabled
              >
                <span className="ms-5 ps-2">{radio?.label}</span>
              </label>
            </div>
          ))}
        </div>

        {konsultasi?.mediaKonsultasi !== "Whatsapp" && (
          <div className="mb-4">
            <label className="form-label">
              {konsultasi?.mediaKonsultasi === "Meeting Online"
                ? "Link Meeting Online"
                : "Lokasi Konsultasi"}
            </label>
            <input
              className="form-control"
              autoComplete="off"
              type="text"
              name="media"
              placeholder={
                konsultasi?.mediaKonsultasi === "Meeting Online"
                  ? "Masukkan Link Meeting Online"
                  : "Masukkan Lokasi Konsultasi"
              }
              value={formData?.media}
              onChange={handleChangeInput}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="form-label">Keterangan</label>
          <input
            className="form-control"
            autoComplete="off"
            type="text"
            name="keterangan"
            placeholder="Masukkan Keterangan"
            value={formData?.keterangan}
            onChange={handleChangeInput}
          />
        </div>

        <div
          className="btn-primary btn-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer"
          onClick={buatJadwalKonsultasi}
        >
          <p className="fw-bold mb-0 ms-3">Buat Jadwal</p>
        </div>
      </div>
    </div>
  );
};

export default CardBuatJadwalKonsultasi;
