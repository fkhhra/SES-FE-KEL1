import { DatePicker, Select, TimePicker } from "antd";
import ModalStep from "components/Shared/ModalStep/ModalStep";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import ReactiveButton from "reactive-button";

const { Option } = Select;

const initialFormData = {
  mUjianId: "",
  kkm: "",
};

const JadwalSmarteschool = ({ editId }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [ujian, setUjian] = useState([]);
  const [tipeUjian, setTipeUjian] = useState("");
  const [current, setCurrent] = useState(0);
  const handlePostUjianData = () => {};

  const next = () => {
    if (!formData.mUjianId) {
      toast.error("Anda belum memilih daftar ujian");
      return;
    } else if (!formData.kkm) {
      toast.error("Anda belum memasukkan kkm ujian");
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const setInitialFormData = () => {
    setFormData(initialFormData);
    setEditId(null);
  };

  const handleChangeForm = (e, type, stateName, parseInteger = false) => {
    if (type === "date" || type === "time") {
      setFormData({
        ...formData,
        [stateName]: type === "date" ? moment(e) : moment(e, "HH:mm"),
      });
      return;
    }

    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        setFormData({
          ...formData,
          rombelId: [
            ...formData.rombelId,
            parseInteger ? parseInt(e.target.value) : e.target.value,
          ],
        });
      } else {
        setFormData({
          ...formData,
          rombelId: formData.rombelId.filter(
            (id) => id !== parseInt(e.target.value)
          ),
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: parseInteger ? parseInt(e.target.value) : e.target.value,
    });
  };
  return (
    <ModalStep
      modalClass="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      buttonSubmit={
        <ReactiveButton
          buttonState={buttonState}
          color={"primary"}
          idleText={editId ? "Edit Jadwal Ujian" : "Buat Jadwal Ujian"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={handlePostUjianData}
        />
      }
      isNext={true}
      modalId="jadwalSmarteschool"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editId ? "Edit" : "Buat"} Jadwal Ujian
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk membuat jadwal ujian
          </span>
        </>
      }
      current={current}
      next={next}
      prev={prev}
      steps={[
        {
          title: "Pilih Bank Soal",
          content: (
            <>
              <div className="mt-4 mb-3">
                <label className="form-label">Bank Soal</label>
                <SelectShared
                  name="mUjianId"
                  placeholder="Pilih bank soal yang akan diujikan"
                  handleChangeSelect={(e, name) => {
                    setFormData({
                      ...formData,
                      [name]: e.value,
                    });
                  }}
                  value={formData.mUjianId}
                  options={ujian?.map((data) => {
                    return { label: data?.nama, value: data?.id };
                  })}
                />
                {/* <select
                className="form-select"
                aria-label="Default select example"
                placeholder="Pilih bank soal yang akan diujikan"
                name="mUjianId"
                onChange={(e) => {
                  setTipeUjian(
                    ujian?.filter(
                      (data) => data.id === parseInt(e.target.value)
                    )?.[0]?.tipe
                  );
                  handleChangeForm(e, null, null, true);
                }}
                value={formData?.mUjianId}
              >
                <option hidden>
                  Pilih bank soal yang akan diujikan{" "}
                </option>
                {ujian?.map((data) => (
                  <option value={data?.id}>{data?.nama}</option>
                ))}
              </select> */}
              </div>
              <div className="row mb-3">
                {tipeUjian !== "literasi" && tipeUjian !== "numerasi" ? (
                  <>
                    <div className="col-md-6 mb-md-0 mb-3">
                      <label className="form-label">Jumlah Soal PG </label>
                      <input
                        type="number"
                        className="form-control"
                        autoComplete="off"
                        placeholder="0 Soal"
                        name="jumlahPg"
                        value={formData?.jumlahPg}
                        onChange={(e) => handleChangeForm(e, null, null, true)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Jumlah Soal Esai</label>
                      <input
                        type="number"
                        className="form-control"
                        autoComplete="off"
                        placeholder="0 Soal"
                        name="jumlahEsai"
                        value={formData?.jumlahEsai}
                        onChange={(e) => handleChangeForm(e, null, null, true)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-md-6 mb-md-0 mb-3">
                    <label className="form-label">Jumlah Soal AKM</label>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      placeholder="0 Soal"
                      name="jumlahSoalAkm"
                      value={formData?.jumlahSoalAkm}
                      onChange={(e) => handleChangeForm(e, null, null, true)}
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Jumlah Semua </label>
                <input
                  type="number"
                  className="form-control"
                  autoComplete="off"
                  placeholder="0 Soal"
                  readOnly
                  value={formData?.jumlahPg + formData?.jumlahEsai}
                />
              </div>
              <div className="mb-3">
                <h6 className="fs-18-ss fw-bold color-dark mb-3">Acak Soal</h6>
                <div className="row">
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio position-absolute"
                      type="radio"
                      name="flexRadioDefault"
                      id="radioYa"
                      style={{
                        top: "36%",
                        left: "2em",
                        // height: "20px",
                      }}
                      // name="diacak"
                      value={1}
                      checked={formData?.diacak === 1}
                      onChange={(e) => handleChangeForm(e, null, null, true)}
                    />
                    <label
                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="radioYa"
                    >
                      <span className="ms-4 ps-2">Ya</span>
                    </label>
                  </div>
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                      type="radio"
                      name="flexRadioDefault"
                      id="radioTidak"
                      style={{
                        top: "36%",
                        left: "2em",
                        // height: "20px",
                      }}
                      // name="diacak"
                      value={0}
                      checked={formData?.diacak === 0}
                      onChange={(e) => handleChangeForm(e, null, null, true)}
                    />
                    <label
                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="radioTidak"
                    >
                      <span className="ms-4 ps-2">Tidak</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">KKM </label>
                <input
                  type="number"
                  className="form-control"
                  autoComplete="off"
                  placeholder="0"
                  name="kkm"
                  value={formData?.kkm}
                  onChange={(e) => handleChangeForm(e, null, null, true)}
                />
              </div>
            </>
          ),
        },
        {
          title: "Atur Waktu Ujian",
          content: (
            <>
              <div className="mt-4 mb-3">
                <label htmlFor="example-date-input" className="form-label">
                  Tanggal
                </label>
                <DatePicker
                  className="form-control"
                  autoComplete="off"
                  onChange={(date, dateString) =>
                    handleChangeForm(dateString, "date", "tanggal")
                  }
                  placeholder="dd / mm / yyyy"
                  value={formData?.tanggal}
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-md-0 mb-3">
                  <label className="form-label">Waktu Dibuka </label>
                  <TimePicker
                    className="form-control"
                    autoComplete="off"
                    format="HH:mm"
                    onChange={(date, dateString) =>
                      handleChangeForm(dateString, "time", "waktu")
                    }
                    value={formData?.waktu}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Durasi</label>
                  <input
                    type="number"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Masukkan waktu dalam menit"
                    name="durasi"
                    value={formData?.durasi}
                    onChange={(e) => handleChangeForm(e, null, null, true)}
                  />
                </div>
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
                  value={formData?.gmeet}
                  onChange={handleChangeForm}
                />
              </div>
            </>
          ),
        },
      ]}
    />
  );
};

export default JadwalSmarteschool;
