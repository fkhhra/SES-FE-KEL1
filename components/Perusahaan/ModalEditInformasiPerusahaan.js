import { DatePicker } from "antd";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";
import jumlahKaryawanData from "../../data/jumlahkaryawan.json";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "../../client/LokasiClient";
import { putInformasiPerusahaan } from "client/PerusahaanClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  nama: "",
  bidang: "",
  keselarasan: 0,
  istd: 0,
  telepon: "",
  situs: "",
  jumlahPekerja: "",
  didirikan: "",
  alamat: "",
  provinceId: "",
  regencyId: "",
  districtId: "",
  villageId: "",
  kodepos: "",
};
const ModalEditInformasiPerusahaan = ({
  editData,
  handleSubmit,
  _getDetailPerusahaan,
  id,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);
  const [buttonState, setButtonState] = useState("idle");

  const _putInformasiPerusahaan = async () => {
    setButtonState("loading");
    const { data, error } = await putInformasiPerusahaan(id, {
      ...formData,
      didirikan: momentPackage(formData?.didirikan).format("YYYY"),
      keselarasan: formData?.keselarasan == true ? 1 : 0,
      istd: formData?.istd == true ? 1 : 0,
    });

    if (data) {
      setButtonState("success");

      toast.success(data?.message);
      hideModal("modalInformasiPerusahaan");
      // setFormData({ ...initialFormData });
      _getDetailPerusahaan();
    }
  };

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const handleChangeFormChecked = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: !formData[e.target.name],
    });
  };

  const handleChangeSelect = (e, name) => {
    if (name == "provinceId") {
      _getRegency({
        provinceId: e?.value,
      });
    }

    if (name == "regencyId") {
      _getDistrict({
        regencyId: e?.value,
      });
    }

    if (name == "districtId") {
      _getVillage({
        districtId: e?.value,
      });
    }

    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _getProvince = async () => {
    const { data } = await getProvince();

    if (data) {
      setProvince(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getRegency = async (params) => {
    const { data } = await getRegency(params);

    if (data) {
      setRegency(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getDistrict = async (params) => {
    const { data } = await getDistrict(params);

    if (data) {
      setDistrict(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  const _getVillage = async (params) => {
    const { data } = await getVillage(params);

    if (data) {
      setVillage(
        data.map((d) => {
          return { value: d.id, label: d.name };
        })
      );
    }
  };

  useEffect(() => {
    if (editData) {
      _getProvince(),
        editData.provinceId && _getRegency({ provinceId: editData.provinceId }),
        editData.regencyId && _getDistrict({ regencyId: editData.regencyId }),
        editData.districtId && _getVillage({ districtId: editData.districtId }),
        setFormData({
          ...editData,
          ...editData?.informasi,
          didirikan: momentPackage(editData?.informasi.didirikan).format(
            "YYYY"
          ),
          keselarasan: editData?.informasi.keselarasan == true ? 1 : 0,
          istd: editData?.informasi.istd == true ? 1 : 0,
        });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);
  return (
    <>
      <NewModal
        // onCloseModal={() => setEditIndex(null)}
        modalId="modalInformasiPerusahaan"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Ubah Informasi Perusahaan</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah Informasi perusahaan
            </span>
          </>
        }
        content={
          <>
            <div className="row g-4">
              <div className="col-lg-6">
                <label className="form-label">Nama Perusahaan</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="nama"
                  placeholder="Contoh : PT. Smartschool"
                  value={formData?.nama}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-lg-6">
                <label className="form-label">Bidang Perusahaan</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="bidang"
                  placeholder="Masukkan bidang perusahaan"
                  value={formData?.bidang}
                  onChange={handleChangeInput}
                />
              </div>

              <div className="col-lg-6">
                <label className="form-label">Keselarasan</label>

                <div className="row g-4">
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio position-absolute"
                      type="checkbox"
                      name="keselarasan"
                      id="keselarasanYa"
                      style={{
                        top: "36%",
                        left: "2em",
                      }}
                      checked={formData?.keselarasan == 1}
                      onChange={handleChangeFormChecked}
                    />
                    <label
                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="keselarasanYa"
                    >
                      <span className="ms-4 ps-2">Ya</span>
                    </label>
                  </div>
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                      type="checkbox"
                      name="keselarasan"
                      id="keselarasanTidak"
                      style={{
                        top: "36%",
                        left: "2em",
                      }}
                      checked={formData?.keselarasan == 0}
                      onChange={handleChangeFormChecked}
                    />
                    <label
                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="keselarasanTidak"
                    >
                      <span className="ms-4 ps-2">Tidak</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <label className="form-label">Mengikuti Program ISTD?</label>

                <div className="row g-4">
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio position-absolute"
                      type="checkbox"
                      name="istd"
                      id="programIstdYa"
                      style={{
                        top: "36%",
                        left: "2em",
                      }}
                      checked={formData?.istd == 1}
                      onChange={handleChangeFormChecked}
                    />
                    <label
                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="programIstdYa"
                    >
                      <span className="ms-4 ps-2">Ya</span>
                    </label>
                  </div>
                  <div className="form-check-ss col-md-6 position-relative">
                    <input
                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                      type="checkbox"
                      name="istd"
                      id="programIstdTidak"
                      style={{
                        top: "36%",
                        left: "2em",
                      }}
                      checked={formData?.istd == 0}
                      onChange={handleChangeFormChecked}
                    />
                    <label
                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                      htmlFor="programIstdTidak"
                    >
                      <span className="ms-4 ps-2">Tidak</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <label className="form-label">Nomor Telepon Perusahaan</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="telepon"
                  placeholder="Masukkan nomor perusahaan"
                  value={formData?.telepon}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-lg-6">
                <label className="form-label">Website</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="situs"
                  placeholder="Masukkan link website perusahaaan"
                  value={formData?.situs}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-lg-6">
                <label className="form-label">Jumlah Karyawan</label>
                <SelectShared
                  placeholder="Pilih jumlah karyawan"
                  options={jumlahKaryawanData?.map((d) => {
                    return {
                      label: `${d?.label}`,
                      value: d?.value,
                    };
                  })}
                  handleChangeSelect={(e, name) => {
                    setFormData({
                      ...formData,
                      jumlahPekerja: e?.value,
                    });
                  }}
                  // {changeRombel}
                  value={formData?.jumlahPekerja || ""}
                />
              </div>
              <div className="col-lg-6">
                <label className="form-label">Didirikan pada Tahun</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: {
                        name: "didirikan",
                        value: dateString,
                      },
                    })
                  }
                  placeholder="Pilih Tahun"
                  className="form-control"
                  autoComplete="off"
                  picker="year"
                  value={
                    formData?.didirikan
                      ? momentPackage(formData?.didirikan)
                      : ""
                  }
                />
              </div>

              <div className="col-md-12">
                <div className="row g-4">
                  <div className="col-lg-6">
                    <label className="form-label">Alamat</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      type="text"
                      name="alamat"
                      placeholder="Nama Jalan, Gedung, Nomor Rumah"
                      value={formData?.alamat}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Provinsi</label>
                    <SelectShared
                      name="provinceId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.provinceId}
                      options={province}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Kabupaten/Kota</label>
                    <SelectShared
                      name="regencyId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.regencyId}
                      options={regency}
                      isDisabled={
                        !regency.length && formData?.regencyId != null
                      }
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Kecamatan</label>
                    <SelectShared
                      name="districtId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.districtId}
                      options={district}
                      isDisabled={!district.length}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Kelurahan</label>
                    <SelectShared
                      name="villageId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.villageId}
                      options={village}
                      isDisabled={!village.length}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Kodepos</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      type="text"
                      name="kodepos"
                      maxLength={5}
                      value={formData?.kodepos}
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={`Simpan`}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={_putInformasiPerusahaan}
          />
        }
      />
    </>
  );
};

export default ModalEditInformasiPerusahaan;
