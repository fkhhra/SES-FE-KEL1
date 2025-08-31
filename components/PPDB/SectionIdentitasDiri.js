import React, { useEffect, useState } from "react";
import SelectShared from "../Shared/SelectShared/SelectShared";
import { DatePicker } from "antd";
import genderData from "../../data/gender";
import agamaData from "../../data/agama";
import { checkNomor, momentPackage } from "../../utilities/HelperUtils";
import {
  getProvince,
  getRegency,
  getDistrict,
  getVillage,
} from "../../client/LokasiClient";
import ReactiveButton from "reactive-button";
import { postProfilUser, getProfilUser } from "../../client/AuthClient";
import toast from "react-hot-toast";
import useUser from "../../hooks/useUser";
import UploadProfilePicture from "../Shared/UploadProfilePicture/UploadProfilePicture";
import { FaTimes } from "react-icons/fa";
import { getPreviewURL } from "utilities/FileViewer";
import InputFile from "components/Shared/InputFile/InputFile";
import useSekolah from "hooks/useSekolah";

const SectionIdentitasDiri = ({ formData, setFormData, initialStateForm }) => {
  const { user, setUser } = useUser();
  const { sekolah } = useSekolah();

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

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

  const handleClickSubmit = async () => {
    if (!checkNomor(formData.whatsapp)) {
      toast.error("periksa kembali nomor whatsapp yang anda masukan");
      return;
    }
    const payload = {
      ...formData,
      tanggalLahir: formData.tanggalLahir
        ? momentPackage(formData.tanggalLahir).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
    };
    setFormData({ ...formData, btnState: "loading" });
    const { data, error } = await postProfilUser(payload);

    if (data) {
      setFormData({ ...formData, btnState: "success" });
      toast.success(data?.message);
      _getProfil();
    } else {
      setFormData({ ...formData, btnState: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeForm = (e, data) => {
    if (data) {
      setFormData({ ...formData, [e.target.name]: data });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChangeDate = (e, name) => {
    setFormData({
      ...formData,
      [name]: e,
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

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
      setFormData({
        ...initialStateForm,
        ...data?.profil?.profil,
        ...data.profil,
      });
      if (data.profil?.profil?.provinceId) {
        _getRegency({ provinceId: data.profil?.profil?.provinceId });
      }

      if (data.profil?.profil?.regencyId) {
        _getDistrict({ regencyId: data.profil?.profil?.regencyId });
      }

      if (data.profil?.profil?.districtId) {
        _getVillage({ districtId: data.profil?.profil?.districtId });
      }
    }
  };

  useEffect(() => {
    _getProvince();
    _getProfil();
  }, []);

  return (
    <div className="card card-ss mb-4">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Identitas Diri
        </h4>

        <div className="row">
          <div className="col-md-12 text-center mb-4">
            <div className="text-center">
              <h5 className="fs-18-ss color-dark fw-bold mb-3">Foto Profil</h5>
            </div>
            <UploadProfilePicture
              name="avatar"
              id="uploadFotoGuruJurusan"
              preview={formData.avatar}
              onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
            />
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">NISN</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="nisn"
                value={formData?.nisn}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nomor Whatsapp</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="whatsapp"
                pattern="^(^62|^08)(\d{3,4}-?){2}\d{3,4}$"
                value={formData.whatsapp}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nama Lengkap</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nama Panggilan</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="namaPanggilan"
                value={formData.namaPanggilan}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <SelectShared
                name="gender"
                handleChangeSelect={handleChangeSelect}
                value={formData.gender}
                options={genderData}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Agama</label>
              <SelectShared
                name="agama"
                handleChangeSelect={handleChangeSelect}
                value={formData.agama}
                options={agamaData}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Tempat Lahir</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Nama Kota"
                type="text"
                name="tempatLahir"
                value={formData?.tempatLahir}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tanggal Lahir</label>
              <DatePicker
                onChange={(date, dateString) =>
                  handleChangeDate(dateString, "tanggalLahir")
                }
                placeholder="Pilih Tanggal"
                className="form-control"
                autoComplete="off"
                value={
                  formData?.tanggalLahir
                    ? momentPackage(formData?.tanggalLahir)
                    : momentPackage()
                }
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Alamat</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="alamat"
                    placeholder="Nama Jalan, Gedung, Nomor Rumah"
                    value={formData?.alamat}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Provinsi</label>
                  <SelectShared
                    name="provinceId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.provinceId}
                    options={province}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Kabupaten/Kota</label>
                  <SelectShared
                    name="regencyId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.regencyId}
                    options={regency}
                    isDisabled={!regency.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Kecamatan</label>
                  <SelectShared
                    name="districtId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.districtId}
                    options={district}
                    isDisabled={!district.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Kelurahan</label>
                  <SelectShared
                    name="villageId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.villageId}
                    options={village}
                    isDisabled={!village.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-3">
                  <label className="form-label">Kodepos</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="kodepos"
                    value={formData?.kodepos}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Asal Sekolah</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Nama Kota"
                type="text"
                name="asalSekolah"
                value={formData?.asalSekolah}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="">
            <label className="form-label">
              Lampiran{" "}
              {sekolah?.id == 9487 || sekolah?.id == 9489
                ? "NISN"
                : "Kartu Pelajar"}
            </label>
            <label htmlFor="kp" className="form-label mb-4 w-100">
              <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                  <img src={`/img/icon-upload-dropfile.svg`} />
                  <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                    Klik untuk mengunggah{" "}
                    <span className="color-primary">
                      File{" "}
                      {sekolah?.id == 9487 || sekolah?.id == 9489
                        ? "NISN"
                        : "Kartu Pelajar"}
                    </span>
                  </span>
                </div>
              </div>
            </label>
            <InputFile
              name="kp"
              id="kp"
              file
              onChange={(e, data) => {
                if (data) {
                  let parsed = JSON.parse(formData?.filePpdb || "{}");
                  parsed.kartuPelajar = data;
                  setFormData({
                    ...formData,
                    file_ppdb: JSON.stringify(parsed),
                    filePpdb: JSON.stringify(parsed),
                  });
                }
              }}
              accept="image/png, image/gif, image/jpeg, application/pdf"
            />
            {formData?.filePpdb &&
            JSON.parse(formData?.filePpdb || "{}")?.kartuPelajar ? (
              <div
                className="px-4 py-3 border-0 bg-soft-primary rounded-ss mb-4"
                style={{ minHeight: "79px" }}
              >
                <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
                  <div
                    className="d-flex align-items-center flex-wrap pointer"
                    onClick={() =>
                      window.open(
                        getPreviewURL(
                          JSON.parse(formData?.filePpdb || "{}")?.kartuPelajar
                        )
                      )
                    }
                  >
                    <img
                      src="/img/icon-file.svg"
                      alt="icon-file"
                      className="me-3"
                    />
                    <p className="fw-bold color-dark mb-0 py-2">
                      File{" "}
                      {sekolah?.id == 9487 || sekolah?.id == 9489
                        ? "NISN"
                        : "Kartu Pelajar"}
                    </p>
                  </div>
                  <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0">
                    <FaTimes
                      className="pointer fs-4"
                      style={{ color: "#96DAFF" }}
                      onClick={() => {
                        let parsed = JSON.parse(formData?.filePpdb || "{}");
                        parsed.kartuPelajar = "";
                        setFormData({
                          ...formData,
                          file_ppdb: JSON.stringify(parsed),
                          filePpdb: JSON.stringify(parsed),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="card-footer-ss pb-4">
        <div className="mb-4">
          <hr className="m-0" />
        </div>
        {/* <div className="d-flex justify-content-end align-items-center px-4 pb-3">
          <div data-joyride="btn-simpan">
            <ReactiveButton
              buttonState={formData.btnState}
              onClick={handleClickSubmit}
              color={"primary"}
              idleText={"Simpan"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              className={
                "btn-save-admin btn btn-primary rounded-pill fs-5 fw-bolder py-2 px-5 bg-gradient-primary"
              }
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SectionIdentitasDiri;
