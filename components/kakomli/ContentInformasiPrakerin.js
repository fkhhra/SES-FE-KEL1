import React, { useEffect } from "react";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import { formatAngkaTitik, momentPackage } from "utilities/HelperUtils";
import TextareaAutosize from "react-textarea-autosize";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { DatePicker } from "antd";

const ContentInformasiPrakerin = ({
  formData,
  handleChangeInput,
  handleChangeSelect,
  province,
  regency,
  district,
  village,
}) => {
  return (
    <>
      <div className="card card-ss p-4 mb-4">
        <div className="row">
          <h4 className="fw-extrabold color-dark mb-3">Informasi Prakerin</h4>
          <div className="mb-4 col-md-12">
            <label className="form-label">Perusahaan</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama perusahaan"
              type="text"
              name="namaPerusahaan"
              value={formData?.namaPerusahaan}
              onChange={handleChangeInput}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Alamat</label>
          </div>
          <div className="col-md-6 mb-4">
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
              value={formData?.alamatPerusahaan}
              onChange={handleChangeInput}
            />
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <SelectShared
                    name="provinceId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData?.provinceId}
                    options={province}
                    placeholder="Pilih Provinsi"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <SelectShared
                    name="regencyId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData?.regencyId}
                    options={regency}
                    isDisabled={!regency.length}
                    placeholder="Pilih Kota / Kabupaten"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <SelectShared
                    name="districtId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData?.districtId}
                    options={district}
                    isDisabled={!district.length}
                    placeholder="Kecamatan"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Kode pos"
                    type="text"
                    name="kodepos"
                    onChange={handleChangeInput}
                    value={formData?.kodepos}
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 col-md-6">
            <label className="form-label">Telepon</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nomor telepon"
              type="number"
              name="teleponPerusahaan"
              value={formData?.teleponPerusahaan}
              onChange={handleChangeInput}
            />
          </div>
          <div className="mb-4 col-md-6">
            <label className="form-label">Kontak Narahubung</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan kontak narahubung"
              type="text"
              name="kontakNarahubung"
              value={formData?.kontakNarahubung}
              onChange={handleChangeInput}
            />
          </div>
          <div className="mb-4 col-md-12">
            <label className="form-label">Pembimbing</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama pembimbing"
              type="text"
              name="pembimbing"
              value={formData?.pembimbing}
              onChange={handleChangeInput}
            />
          </div>
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
      </div>
    </>
  );
};

export default ContentInformasiPrakerin;
