import { DatePicker } from "antd";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "client/LokasiClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import { momentPackage } from "utilities/HelperUtils";
import genderData from "data/gender.json";
import agamaData from "data/agama.json";
import { getPreviewURL } from "utilities/FileViewer";

const IdentitasPembelian = ({ initialState }) => {
  const [formData, setFormData] = useState(initialState);

  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);

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
    _getProvince();
  }, []);

  useEffect(() => {
    if (initialState?.profil?.provinceId) {
      _getRegency({ provinceId: initialState?.profil?.provinceId });
    }

    if (initialState?.profil?.regencyId) {
      _getDistrict({ regencyId: initialState?.profil?.regencyId });
    }

    if (initialState?.profil?.districtId) {
      _getVillage({ districtId: initialState?.profil?.districtId });
    }
    setFormData({ ...initialState?.profil, ...initialState });
  }, [initialState]);
  return (
    <div className="card card-ss mb-4">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Identitas Diri
        </h4>

        <div className="row">
          <div className="col-md-12">
            <div className="mb-4">
              <label className="form-label">Nomor Whatsapp</label>
              <input
                disabled
                className="form-control"
                autoComplete="off"
                type="text"
                name="whatsapp"
                pattern="^(^62|^08)(\d{3,4}-?){2}\d{3,4}$"
                value={formData?.whatsapp}
                // onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-4">
              <label className="form-label">Nama Lengkap</label>
              <input
                disabled
                className="form-control"
                autoComplete="off"
                type="text"
                name="nama"
                value={formData?.nama}
                // onChange={handleChangeForm}
              />
            </div>
          </div>
          {/* <div className="col-md-12">
            <div className="mb-4">
              <label className="form-label">Nama Panggilan</label>
              <input
                disabled
                className="form-control"
                autoComplete="off"
                type="text"
                name="namaPanggilan"
                value={formData?.namaPanggilan}
                // onChange={handleChangeForm}
              />
            </div>
          </div> */}
          {/* <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <SelectShared
                name="gender"
                isDisabled
                // handleChangeSelect={handleChangeSelect}
                value={formData?.gender}
                options={genderData}
              />
            </div>
          </div> */}
          {/* <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Agama</label>
              <SelectShared
                name="agama"
                isDisabled
                // handleChangeSelect={handleChangeSelect}
                value={formData?.agama}
                options={agamaData}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Tempat Lahir</label>
              <input
                disabled
                className="form-control"
                autoComplete="off"
                placeholder="Nama Kota"
                type="text"
                name="tempatLahir"
                value={formData?.tempatLahir}
                // onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Tanggal Lahir</label>
              <DatePicker
                // onChange={(date, dateString) =>
                //   handleChangeDate(dateString, "tanggalLahir")
                // }
                disabled
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
          </div> */}
          <div className="col-md-12">
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">Alamat</label>
                  <input
                    disabled
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="alamat"
                    placeholder="Nama Jalan, Gedung, Nomor Rumah"
                    value={formData?.alamat}
                    // onChange={handleChangeForm}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-4">
              <label className="form-label">Asal Sekolah</label>
              <input
                disabled
                className="form-control"
                autoComplete="off"
                placeholder="Nama Kota"
                type="text"
                name="asalSekolah"
                value={formData?.asalSekolah}
                // onChange={handleChangeForm}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="card-footer-ss pb-4">
        <div className="mb-4">
          <hr className="m-0" />
        </div>
        <div className="d-flex justify-content-end align-items-center px-4 pb-3">
          <div data-joyride="btn-simpan">
            <ReactiveButton
              buttonState={formData?.btnState}
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
        </div>
      </div> */}
    </div>
  );
};

export default IdentitasPembelian;
