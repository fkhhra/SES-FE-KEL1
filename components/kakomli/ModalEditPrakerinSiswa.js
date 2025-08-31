import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";

import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import { putNilaiPenerimaan } from "client/PenerimaanClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import { DatePicker } from "antd";
import { putPrakerin, getDetailPrakerin } from "client/KakomliClient";
import {
  getDistrict,
  getProvince,
  getRegency,
  getVillage,
} from "../../client/LokasiClient";
import { momentPackage } from "utilities/HelperUtils";

const initialFormData = {
  tanggalBerangkat: "",
  tanggalJemput: "",
  pembimbing: "",
  teleponPerusahaan: "",
  kontakNarahubung: "",
  alamatPerusahaan: "",
  namaPerusahaan: "",
  provinceId: "",
  regencyId: "",
  districtId: "",
  villageId: "",
  kodepos: "",
  jurusanId: "",
  rombelId: "",
  nama: "",
  mUserId: "",
  prakerinId: "",
};

const ModalEditPrakerinSiswa = ({ editData, _getPrakerin }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");
  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [village, setVillage] = useState([]);
  const [siswa, setSiswa] = useState([]);

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const _getDetailKakomliPrakerin = async () => {
    const { data } = await getDetailPrakerin(editData?.id, {
      m_ta_id: editData?.mTaId,
    });
    if (data) {
      setSiswa(data?.siswa);
    }
  };

  const _putPrakerin = async () => {
    setBtnState("loading");
    const { data, error } = await putPrakerin(formData?.prakerinId, {
      ...formData,
      m_user_id: formData?.mUserId,
    });

    if (data) {
      setBtnState("success");
      toast.success(data?.message);
      hideModal("modalEditPrakerinSiswa");
      _getPrakerin();
    }
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

  useEffect(() => {
    if (editData) {
      _getDetailKakomliPrakerin();
      _getProvince(),
        editData?.provinceId &&
          _getRegency({ provinceId: editData?.provinceId }),
        editData?.regencyId && _getDistrict({ regencyId: editData?.regencyId }),
        editData?.districtId &&
          _getVillage({ districtId: editData?.districtId });
      setFormData({
        ...formData,
        ...editData,
        prakerinId: editData?.id,
        mUserId: editData?.id,
        nama: editData?.nama,
        namaPerusahaan: editData?.namaPerusahaan,
        alamatPerusahaan: editData?.alamatPerusahaan,
        provinceId: editData?.provinceId,
        regencyId: editData?.regencyId,
        districtId: editData?.districtId,
        kodepos: editData?.kodepos,
        teleponPerusahaan: editData?.teleponPerusahaan,
        kontakNarahubung: editData?.kontakNarahubung,
        pembimbing: editData?.pembimbing,
        tanggalBerangkat: momentPackage(editData?.tanggalBerangkat).format(
          "YYYY-MM-DD"
        ),
        tanggalJemput: momentPackage(editData?.tanggalJemput).format(
          "YYYY-MM-DD"
        ),
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editData]);
  return (
    <>
      <NewModal
        modalId="modalEditPrakerinSiswa"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Edit Prakerin Siswa</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah data prakerin siswa
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <h5 className="fw-bold color-dark fs-18-ss mb-2">
                {siswa?.nama}
              </h5>
              <span className="fw-semibold m-0">
                {siswa?.anggotaRombel?.rombel?.nama}
              </span>
            </div>
            <div className="mb-4">
              <label className="form-label">Perusahaan</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nama perusahaan"
                type="text"
                name="namaPerusahaan"
                value={formData?.namaPerusahaan || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md">
              <label className="form-label">Alamat</label>
            </div>
            <div className="col-md mb-4">
              <TextareaAutosize
                className="form-control"
                placeholder="Alamat Lengkap"
                autoComplete="off"
                name="alamatPerusahaan"
                style={{
                  resize: "none",
                  width: "100%",
                  height: "100%",
                }}
                minRows={4}
                value={formData?.alamatPerusahaan || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <SelectShared
                      name="provinceId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.provinceId || ""}
                      options={province}
                      placeholder="Provinsi"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-4">
                    <SelectShared
                      name="regencyId"
                      handleChangeSelect={handleChangeSelect}
                      value={formData?.regencyId || ""}
                      options={regency}
                      isDisabled={!regency.length}
                      placeholder="Kota / Kabupaten"
                    />
                  </div>
                </div>
                <div className="col-md">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <SelectShared
                          name="districtId"
                          handleChangeSelect={handleChangeSelect}
                          value={formData?.districtId || ""}
                          options={district}
                          isDisabled={!district.length}
                          placeholder="Kecamatan"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="mb-4">
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Kode pos"
                          type="text"
                          name="kodepos"
                          onChange={handleChangeInput}
                          value={formData?.kodepos || ""}
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-4 col-md">
                <label className="form-label">Telepon</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  placeholder="Tuliskan nomor telepon"
                  type="number"
                  name="teleponPerusahaan"
                  value={formData?.teleponPerusahaan || ""}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="mb-4 col-md">
                <label className="form-label">Kontak Narahubung</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  placeholder="Tuliskan kontak narahubung"
                  type="text"
                  name="kontakNarahubung"
                  value={formData?.kontakNarahubung || ""}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className="mb-4 col-md">
              <label className="form-label">Pembimbing</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nama pembimbing"
                type="text"
                name="pembimbing"
                value={formData?.pembimbing || ""}
                onChange={handleChangeInput}
              />
            </div>
            <div className="row">
              <div className="mb-4 col-md-6">
                <label className="form-label">Tanggal Berangkat</label>
                <DatePicker
                  className="form-control"
                  autoComplete="off"
                  value={
                    formData?.tanggalBerangkat
                      ? momentPackage(formData?.tanggalBerangkat)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: {
                        name: "tanggalBerangkat",
                        value: dateString,
                      },
                    })
                  }
                  placeholder="Pilih tanggal berangkat"
                />
              </div>
              <div className="mb-4 col-md-6">
                <label className="form-label">Tanggal Jemput</label>
                <DatePicker
                  className="form-control"
                  autoComplete="off"
                  value={
                    formData?.tanggalJemput
                      ? momentPackage(formData?.tanggalJemput)
                      : ""
                  }
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: {
                        name: "tanggalJemput",
                        value: dateString,
                      },
                    })
                  }
                  placeholder="Pilih tanggal jemput"
                />
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => _putPrakerin()}
          />
        }
      />
    </>
  );
};

export default ModalEditPrakerinSiswa;
