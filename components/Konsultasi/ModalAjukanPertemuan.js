import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import ReactMultiselectCheckboxes from "react-multiselect-checkboxes/lib/ReactMultiselectCheckboxes";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { momentPackage } from "../../utilities/HelperUtils";
import { postKonsultasi } from "../../client/KonsultasiClient";
import toast from "react-hot-toast";
import { hideModal } from "../../utilities/ModalUtils";

const ModalAjukanPertemuan = ({ selectedGuru }) => {
  const initialFormData = {
    mUserGuruId: selectedGuru?.id,
    keperluan: "",
    tanggalKonsultasi: momentPackage(),
    mediaKonsultasi: [],
    keterangan: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChangeInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeDate = (dateString) => {
    setFormData({
      ...formData,
      tanggalKonsultasi: dateString ? momentPackage(dateString) : "",
    });
  };

  const handleChangeMediaKonsultasi = (e) => {
    if (e.target.checked) {
      setFormData({
        ...formData,
        mediaKonsultasi: [...formData.mediaKonsultasi, e.target.value],
      });
    } else {
      setFormData({
        ...formData,
        mediaKonsultasi: formData.mediaKonsultasi.filter(
          (media) => media !== e.target.value
        ),
      });
    }
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      tanggalKonsultasi: momentPackage(formData.tanggalKonsultasi).format(
        "YYYY-MM-DD"
      ),
    };

    const { data } = await postKonsultasi(payload);
    if (data) {
      toast.success(data?.message);
      hideModal("modalAjukanPertemuan");
    }
  };

  useEffect(() => {
    if (selectedGuru) {
      setFormData({
        ...formData,
        mUserGuruId: selectedGuru?.user?.id,
      });
    }
  }, [selectedGuru]);

  return (
    <NewModal
      modalId="modalAjukanPertemuan"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Ajukan Pertemuan</h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk mengajukan pertemuan dengan Guru BK
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama Guru BK</label>
            <input
              className="form-control"
              autoComplete="off"
              type="text"
              name="idSertifikat"
              placeholder="Masukkan nama guru BK"
              disabled
              value={selectedGuru?.user?.nama}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Keperluan</label>
            <input
              className="form-control"
              autoComplete="off"
              type="text"
              name="keperluan"
              placeholder="Masukkan Keperluan"
              onChange={handleChangeInput}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Tanggal Konsultasi</label>
            <DatePicker
              onChange={(date, dateString) => handleChangeDate(dateString)}
              placeholder="Pilih tanggal"
              className="form-control"
              autoComplete="off"
              value={momentPackage(formData.tanggalKonsultasi)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Media Konsultasi</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"Bertemu Langsung"}
                  id="checkbox-1"
                  onChange={handleChangeMediaKonsultasi}
                />
                <label
                  className="form-check-label fs-14-ss fw-semibold"
                  htmlFor={"checkbox-1"}
                >
                  Bertemu Langsung
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"Meeting Online"}
                  id="checkbox-2"
                  onChange={handleChangeMediaKonsultasi}
                />
                <label
                  className="form-check-label fs-14-ss fw-semibold"
                  htmlFor={"checkbox-2"}
                >
                  Meeting Online
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"Whatsapp"}
                  id="checkbox-3"
                  onChange={handleChangeMediaKonsultasi}
                />
                <label
                  className="form-check-label fs-14-ss fw-semibold"
                  htmlFor={"checkbox-3"}
                >
                  Whatsapp
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Keterangan</label>
            <input
              className="form-control"
              autoComplete="off"
              type="text"
              name="keterangan"
              placeholder="Masukkan Keterangan"
              onChange={handleChangeInput}
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          // buttonState={buttonState}
          color={"primary"}
          idleText={"Ajukan Pertemuan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={handleSubmit}
        />
      }
    />
  );
};

export default ModalAjukanPertemuan;
