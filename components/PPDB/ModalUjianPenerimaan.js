import { DatePicker } from "antd";
import { postJadwalPPDB, putJadwalPPDB } from "client/JadwalPPDBClient";
import { getJadwalUjian } from "client/JadwalUjianClient";
import InputJumlahSoal from "components/JadwalUjian/InputJumlahSoal";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaLink } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { checkFormJadwalGelombang } from "utilities/PPDBUtils";
import { momentPackage } from "../../utilities/HelperUtils";
import { hideModal } from "../../utilities/ModalUtils";
import ModalStep from "../Shared/ModalStep/ModalStep";
import SelectShared from "../Shared/SelectShared/SelectShared";

const ModalUjianPenerimaan = ({
  editData,
  _detailJalurPpdb,
  isEdit,
  m_gelombang_ppdb_id,
  jalur,
}) => {
  const initialFormData = {
    nama: "",
    m_jalur_id: "",
    m_gelombang_ppdb_id: "",
    keterangan: "",
    tipe: "langsung",
    dibuka: "",
    ditutup: "",
    tesAkademik: 0,
    biayaPendaftaran: 0,
    jumlahPg: 0,
    jumlahEsai: 0,
    gmeet: "",
    buttonState: "idle",
    diacak: 0,
    terlihat: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [ujianData, setUjianData] = useState([]);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        dibuka: momentPackage(editData?.dibuka),
        ditutup: momentPackage(editData?.ditutup),
      });
    } else {
      setFormData(initialFormData);
    }
    setCurrent(0);
  }, [editData]);

  const getUjianData = async () => {
    const { data } = await getJadwalUjian({
      status: "berlangsung",
      hariIni: momentPackage().format("YYYY-MM-DD HH:mm"),
      tipeUjian: ["ppdb"],
    });
    if (data) {
      setUjianData(data?.ujian);
    }
  };

  useEffect(() => {
    getUjianData();
  }, []);

  const _postJadwalPPDB = async () => {
    if (!formData.nama) {
      toast.error("Masukan Nama Jadwal");
      return;
    }
    if (!formData.tipe) {
      toast.error("Harap memasukan jenis media test");
      return;
    }
    if (!formData.dibuka) {
      toast.error("Harap memasukan waktu dibuka");
      return;
    }
    if (!formData.ditutup) {
      toast.error("Harap memasukan waktu ditutup");
      return;
    }
    if (!formData.kkm) {
      toast.error("Harap memasukan kkm");
      return;
    }
    if (formData?.tipe == "langsung") {
      if (!formData?.lokasi) {
        toast.error("Harap memasukan lokasi");
        return;
      }
    }
    if (formData?.tipe == "online") {
      if (!formData?.link) {
        toast.error("Harap memasukan link ujian");
        return;
      }
    }
    setFormData({ ...formData, buttonState: "loading" });

    const payload = {
      ...formData,
      waktuDibuka: momentPackage(formData.dibuka).format("YYYY-MM-DD HH:mm:ss"),
      waktuDitutup: momentPackage(formData.ditutup).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      m_gelombang_ppdb_id,
    };

    const { data } = isEdit
      ? await putJadwalPPDB(editData?.id, payload)
      : await postJadwalPPDB(payload);

    if (data) {
      setFormData({ ...initialFormData, buttonState: "success" });
      toast.success(data.message);
      hideModal("ModalUjianPenerimaan");
      _detailJalurPpdb();
    } else {
      setFormData({ ...formData, buttonState: "error" });
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

  const next = () => {
    const check = checkFormJadwalGelombang(formData, current);
    if (check) {
      toast.error(check);
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const [current, setCurrent] = useState(0);

  const stepsBertemuLangsung = [
    {
      title: "Informasi Ujian",
      content: (
        <>
          <div className="my-4">
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

          <div className="mb-4">
            <label className="form-label">Media Tes</label>

            <div className="row">
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="bertemu-langsung"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="tipe"
                  value="langsung"
                  checked={formData.tipe == "langsung" || !formData?.tipe}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="bertemu-langsung"
                >
                  <span className="ms-4 ps-2">Bertemu langsung</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="online"
                  name="tipe"
                  checked={formData.tipe == "online"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online"
                >
                  <span className="ms-4 ps-2">Tes Online</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online-smarteschool"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="ss"
                  name="tipe"
                  checked={formData.tipe == "ss"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online-smarteschool"
                >
                  <span className="ms-4 ps-2">Tes Online di Smarteschool</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Keterangan</label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Masukkan Keterangan"
              minRows={3}
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
    {
      title: "Jadwal Ujian",
      content: (
        <>
          <div className="row my-4 gy-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Dibuka</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                placeholder="Pilih tanggal"
                // disabledDate={(current) =>
                //   current < momentPackage(jalur?.dibuka).startOf("day") ||
                //   current > momentPackage(jalur?.ditutup).endOf("day")
                // }
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Ditutup</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                placeholder="Pilih tanggal"
                // disabledDate={(current) => {
                //   return (
                //     current < formData?.dibuka ||
                //     current < momentPackage(jalur?.dibuka).startOf("day") ||
                //     current > momentPackage(jalur?.ditutup).endOf("day")
                //   );
                // }}
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Lokasi Tes</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Masukkan Lokasi Tes"
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">KKM </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="0"
              name="kkm"
              value={formData?.kkm}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
  ];

  const stepsOnline = [
    {
      title: "Informasi Ujian",
      content: (
        <>
          <div className="my-4">
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

          <div className="mb-4">
            <label className="form-label">Media Tes</label>

            <div className="row">
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="bertemu-langsung"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="tipe"
                  value="langsung"
                  checked={formData.tipe == "langsung"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="bertemu-langsung"
                >
                  <span className="ms-4 ps-2">Bertemu langsung</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="online"
                  name="tipe"
                  checked={formData.tipe == "online"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online"
                >
                  <span className="ms-4 ps-2">Tes Online</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online-smarteschool"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="ss"
                  name="tipe"
                  checked={formData.tipe == "ss"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online-smarteschool"
                >
                  <span className="ms-4 ps-2">Tes Online di Smarteschool</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Keterangan</label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Masukkan Keterangan"
              minRows={3}
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
    {
      title: "Jadwal Ujian",
      content: (
        <>
          <div className="row my-4 gy-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Dibuka</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                placeholder="Pilih tanggal"
                // disabledDate={(current) =>
                //   current < momentPackage(jalur?.dibuka).startOf("day") ||
                //   current > momentPackage(jalur?.ditutup).endOf("day")
                // }
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Ditutup</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                placeholder="Pilih tanggal"
                // disabledDate={(current) => {
                //   return (
                //     current < formData?.dibuka ||
                //     current < momentPackage(jalur?.dibuka).startOf("day") ||
                //     current > momentPackage(jalur?.ditutup).endOf("day")
                //   );
                // }}
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Link Tes Online</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Masukkan Link Tes Online "
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">KKM </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="0"
              name="kkm"
              value={formData?.kkm}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
  ];

  const stepsSmarteschool = [
    {
      title: "Informasi Ujian",
      content: (
        <>
          <div className="my-4">
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

          <div className="mb-4">
            <label className="form-label">Media Tes</label>

            <div className="row">
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="bertemu-langsung"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="tipe"
                  value="langsung"
                  checked={formData.tipe == "langsung"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="bertemu-langsung"
                >
                  <span className="ms-4 ps-2">Bertemu langsung</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="online"
                  name="tipe"
                  checked={formData.tipe == "online"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online"
                >
                  <span className="ms-4 ps-2">Tes Online</span>
                </label>
              </div>
              <div className="form-check-ss col-md-4 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="tes-online-smarteschool"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="ss"
                  name="tipe"
                  checked={formData.tipe == "ss"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="tes-online-smarteschool"
                >
                  <span className="ms-4 ps-2">Tes Online di Smarteschool</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Keterangan</label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Masukkan Keterangan"
              minRows={3}
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
    {
      title: "Daftar Ujian",
      content: (
        <>
          <div className="my-4">
            <label className="form-label">Nama Bank Soal</label>
            <SelectShared
              name="mUjianId"
              placeholder="Pilih Bank Soal"
              handleChangeSelect={(e, name) => {
                setFormData({
                  ...formData,
                  [name]: e.value,
                });
              }}
              value={formData.mUjianId}
              options={ujianData?.map((d) => {
                return { value: d?.id, label: d?.nama };
              })}
            />
          </div>
          <div className="row mb-4 gy-4">
            <div className="col-md-6 mb-md-0 mb-4">
              <label className="form-label">Jumlah Soal PG </label>
              <InputJumlahSoal
                handleChangeForm={handleChangeForm}
                value={formData?.jumlahPg}
                maks={
                  ujianData?.find((d) => d?.id == formData?.mUjianId)?.meta
                    ?.soalPg
                }
                name={"jumlahPg"}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Jumlah Soal Esai</label>
              <InputJumlahSoal
                handleChangeForm={handleChangeForm}
                value={formData?.jumlahEsai}
                maks={
                  ujianData?.find((d) => d?.id == formData?.mUjianId)?.meta
                    ?.soalEsai
                }
                name={"jumlahEsai"}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Jumlah Semua Soal </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="0 Soal"
              readOnly
              value={formData?.jumlahPg + formData?.jumlahEsai}
            />
          </div>
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">Acak Soal</h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="acakYa"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  name="diacak"
                  value={1}
                  checked={formData?.diacak === 1}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="acakYa"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                  type="radio"
                  id="acakTidak"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  value={0}
                  checked={formData?.diacak === 0}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="acakTidak"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">KKM </label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="0"
              name="kkm"
              value={formData?.kkm}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">
              Peserta Dapat Melihat Hasil
            </h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  // name="flexRadioDefault"
                  id="terlihatYa"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  name="terlihat"
                  value={1}
                  checked={formData?.terlihat === 1}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="terlihatYa"
                >
                  <span className="ms-4 ps-2">Ya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative">
                <input
                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                  type="radio"
                  // name="flexRadioDefault"
                  id="terlihatTidak"
                  style={{
                    top: "36%",
                    left: "2em",
                    // height: "20px",
                  }}
                  name="terlihat"
                  value={0}
                  checked={formData?.terlihat === 0}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="terlihatTidak"
                >
                  <span className="ms-4 ps-2">Tidak</span>
                </label>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Jadwal Ujian",
      content: (
        <>
          <div className="row my-4 gy-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Dibuka</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                placeholder="Pilih tanggal"
                // disabledDate={(current) =>
                //   current < momentPackage(jalur?.dibuka).startOf("day") ||
                //   current > momentPackage(jalur?.ditutup).endOf("day")
                // }
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Ditutup</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                placeholder="Pilih tanggal"
                // disabledDate={(current) => {
                //   return (
                //     current < formData?.dibuka ||
                //     current < momentPackage(jalur?.dibuka).startOf("day") ||
                //     current > momentPackage(jalur?.ditutup).endOf("day")
                //   );
                // }}
                showTime={{ format: "HH:mm" }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Durasi Ujian</label>
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="0 menit"
              name="durasi"
              value={formData?.durasi}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
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
              value={formData?.gmeet || ""}
              onChange={handleChangeForm}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <ModalStep
        modalId="ModalUjianPenerimaan"
        modalClass="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        buttonSubmit={
          <ReactiveButton
            buttonState={formData.buttonState}
            onClick={_postJadwalPPDB}
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
        isNext={true}
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {isEdit ? "Ubah" : "Tambah"} Ujian Penerimaan
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
              Ujian Penerimaan PPDB
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={
          !formData?.tipe || formData?.tipe == "langsung"
            ? stepsBertemuLangsung
            : formData?.tipe == "online"
            ? stepsOnline
            : formData?.tipe == "ss"
            ? stepsSmarteschool
            : ""
        }
      />
    </>
  );
};

export default ModalUjianPenerimaan;
