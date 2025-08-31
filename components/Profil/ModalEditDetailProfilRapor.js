import { DatePicker } from "antd";
import Link from "next/link";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../client/clientAxios";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import genderData from "../../data/gender";
import agamaData from "../../data/agama";
import { momentPackage } from "../../utilities/HelperUtils";
import UploadFile from "components/Shared/UploadFile/UploadFile";

const ModalEditDetailProfilRapor = ({
  formData,
  _postProfilUser,
  handleChangeSelect,
  handleChangeForm,
  handleChangeDate,
  province,
  regency,
  district,
  village,
  buttonState,
}) => {
  return (
    <>
      <NewModal
        modalId="modalEditDetailProfilRapor"
        modalSize="xl"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Edit Detail Profil</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah detail profil
            </span>
          </>
        }
        content={
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">NISN</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    placeholder="Masukan NISN"
                    name="nisn"
                    value={formData?.nisn}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">NIS</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    placeholder="Masukkan NIS"
                    type="text"
                    name="nis"
                    value={formData?.nis}
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
                    placeholder="Masukkan nomor whatsapp"
                    name="whatsapp"
                    readOnly
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
                    placeholder="Masukkan nama lengkap"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              {/* Di komen dulu soalnya kata bapak ochim belom di simpen di backend */}
              {/* <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nama Panggilan</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="panggilan"
                    value={formData.panggilan}
                    onChange={handleChangeForm}
                  />
                </div>
              </div> */}

              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Gender</label>
                  <SelectShared
                    name="gender"
                    placeholder="Pilih gender"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.gender}
                    options={genderData}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Agama</label>
                  <SelectShared
                    name="agama"
                    placeholder="Pilih agama"
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
                <div className="mb-4">
                  <label className="form-label">Tanggal Lahir</label>
                  <DatePicker
                    onChange={(date, dateString) =>
                      handleChangeDate(dateString, "tanggalLahir")
                    }
                    placeholder="Pilih Tanggal"
                    className="form-control"
                    autoComplete="off"
                    value={momentPackage(
                      formData?.tanggalLahir || momentPackage()
                    )}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
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
                <div className="mb-4">
                  <label className="form-label">Provinsi</label>
                  <SelectShared
                    name="provinceId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.provinceId}
                    placeholder="Pilih provinsi"
                    options={province}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
                  <label className="form-label">Kabupaten/Kota</label>
                  <SelectShared
                    name="regencyId"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.regencyId}
                    placeholder="Pilih Kabupaten/kota"
                    options={regency}
                    isDisabled={!regency.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
                  <label className="form-label">Kecamatan</label>
                  <SelectShared
                    name="districtId"
                    placeholder="Pilih Kecamatan"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.districtId}
                    options={district}
                    isDisabled={!district.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
                  <label className="form-label">Kelurahan</label>
                  <SelectShared
                    name="villageId"
                    placeholder="Pilih Kelurahan"
                    handleChangeSelect={handleChangeSelect}
                    value={formData.villageId}
                    options={village}
                    isDisabled={!village.length}
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="mb-4">
                  <label className="form-label">Kodepos</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="kodepos"
                    placeholder="Masukkan kodepos"
                    value={formData?.kodepos}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="col-md-6 pe-3">
                  <div className="mb-4">
                    <label className="form-label">Alamat Email</label>
                    <input
                      className="form-control"
                      autoComplete="off"
                      placeholder="Anda belum memasukkan alamat email"
                      type="text"
                      name="email"
                      readOnly
                      value={formData?.email}
                    />
                    <div class="form-text">
                      Untuk menambahkan alamat email dapat dilakukan pada bagian{" "}
                      <Link href={`${ssURL}/profil?nav=akun`}>
                        <a
                          className="text-decoration-none color-primary fw-bold"
                          onClick={() => hideModal("modalEditDetailProfil")}
                        >
                          Akun
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nama Ayah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="namaAyah"
                    placeholder="Masukkan nama ayah"
                    value={formData?.namaAyah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nomor Telepon Ayah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="telpAyah"
                    placeholder="Masukkan nomor telepon ayah"
                    value={formData?.telpAyah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Alamat Ayah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="alamatAyah"
                    placeholder="Masukkan alamat ayah"
                    value={formData?.alamatAyah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Pekerjaan Ayah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="pekerjaanAyah"
                    placeholder="Masukkan pekerjaan ayah"
                    value={formData?.pekerjaanAyah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nama Ibu</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="namaIbu"
                    placeholder="Masukkan nama ibu"
                    value={formData?.namaIbu}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nomor Telepon Ibu</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="telpIbu"
                    placeholder="Masukkan nomor telepon ibu"
                    value={formData?.telpIbu}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Alamat Ibu</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="alamatIbu"
                    placeholder="Masukkan alamat ibu"
                    value={formData?.alamatIbu}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Pekerjaan Ibu</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="pekerjaanIbu"
                    placeholder="Masukkan pekerjaan ibu"
                    value={formData?.pekerjaanIbu}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">nama Wali</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="namaWali"
                    placeholder="Masukkan nama wali"
                    value={formData?.namaWali}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nomor Telepon Wali</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="telpWali"
                    placeholder="Masukkan nomor telepon wali"
                    value={formData?.telpWali}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Alamat Wali</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="alamatWali"
                    placeholder="Masukkan alamat wali"
                    value={formData?.alamatWali}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Pekerjaan Wali</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="pekerjaanWali"
                    value={formData?.pekerjaanWali}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Asal Sekolah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="asalSekolah"
                    placeholder="Masukkan asal sekolah"
                    value={formData?.asalSekolah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Alamat Asal Sekolah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    placeholder="Masukkan alamat asal sekolah"
                    name="alamatAsalSekolah"
                    value={formData?.alamatAsalSekolah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">
                    Diterima di Sekolah di Kelas
                  </label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    placeholder="Diterima di kelas ..."
                    name="kelasDiterima"
                    value={formData?.kelasDiterima}
                    onChange={handleChangeForm}
                  />
                  {/* <SelectShared
                        name="kelasDiterima"
                        // handleChangeSelect={handleChangeSelect}
                        // value={formData.villageId}
                        // options={village}
                        // isDisabled={!village.length}
                      /> */}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">
                    Diterima di Sekolah pada Tanggal
                  </label>
                  <DatePicker
                    onChange={(date, dateString) =>
                      handleChangeDate(dateString, "tanggalMasuk")
                    }
                    placeholder="Pilih Tanggal"
                    className="form-control"
                    // autoComplete="off"
                    value={
                      formData?.tanggalMasuk
                        ? momentPackage(formData?.tanggalMasuk)
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Nomor Ijazah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="noIjazah"
                    placeholder="Masukkan nomor ijazah"
                    value={formData?.noIjazah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label className="form-label">Tahun Ijazah</label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    type="text"
                    name="tahunIjazah"
                    placeholder="Masukkan tahun ijazah"
                    value={formData?.tahunIjazah}
                    onChange={handleChangeForm}
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-4">
                  <label className="form-label">File Ijazah</label>
                  <UploadFile />
                </div>
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => _postProfilUser()}
          />
        }
      />
    </>
  );
};

export default ModalEditDetailProfilRapor;
