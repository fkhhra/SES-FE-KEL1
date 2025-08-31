import InputFile from "components/Shared/InputFile/InputFile";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFile, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { getPreviewURL } from "utilities/FileViewer";
import { getProfilUser, postProfilUser } from "../../client/AuthClient";
import useUser from "../../hooks/useUser";
import { checkNomor, momentPackage } from "../../utilities/HelperUtils";

const SectionInformasiOrtu = ({ formData, setFormData, initialStateForm }) => {
  const { user, setUser } = useUser();

  const handleClickSubmit = async () => {
    if (!checkNomor(formData.telpAyah) && formData.telpAyah) {
      toast.error("periksa kembali nomor whatsapp yang anda masukan");
      return;
    }
    if (!checkNomor(formData.telpIbu) && formData.telpIbu) {
      toast.error("periksa kembali nomor whatsapp yang anda masukan");
      return;
    }
    setFormData({ ...formData, btnState: "loading" });
    const payload = {
      ...formData,
      tanggalLahir: momentPackage(formData.tanggalLahir).format("YYYY-MM-DD"),
    };
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

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    }
  };

  useEffect(() => {
    _getProfil();
  }, []);

  return (
    <div className="card card-ss mb-4">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Informasi Keluarga
        </h4>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">Nama Ayah</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="namaAyah"
                value={formData?.namaAyah}
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
                value={formData.namaIbu}
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
                value={formData.pekerjaanAyah}
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
                value={formData.pekerjaanIbu}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">No Telp Ayah</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="telpAyah"
                value={formData.telpAyah}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">No Telp Ibu</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="telpIbu"
                value={formData.telpIbu}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Alamat Ayah</label>
              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                name="alamatAyah"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                minRows={5}
                value={formData.alamatAyah}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Alamat Ibu</label>
              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                name="alamatIbu"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                minRows={5}
                value={formData.alamatIbu}
                onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="">
            <label className="form-label">Lampiran Kartu Keluarga</label>
            <label htmlFor="bukti" className="form-label mb-4 w-100">
              <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                  <img src={`/img/icon-upload-dropfile.svg`} />
                  <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                    Klik untuk mengunggah{" "}
                    <span className="color-primary">File Kartu Keluarga</span>
                  </span>
                </div>
              </div>
            </label>
            <InputFile
              name="bukti"
              id="bukti"
              file
              onChange={(e, data) => {
                if (data) {
                  let parsed = JSON.parse(formData?.filePpdb || "{}");
                  parsed.kk = data;
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
            JSON.parse(formData?.filePpdb || "{}")?.kk ? (
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
                          JSON.parse(formData?.filePpdb || "{}")?.kk
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
                      File Kartu Keluarga
                    </p>
                  </div>
                  <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0">
                    <FaTimes
                      className="pointer fs-4"
                      style={{ color: "#96DAFF" }}
                      onClick={() => {
                        let parsed = JSON.parse(formData?.filePpdb || "{}");
                        parsed.kk = "";
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
          <div className="">
            <label className="form-label">Lampiran Akta</label>
            <label htmlFor="akta" className="form-label mb-4 w-100">
              <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                  <img src={`/img/icon-upload-dropfile.svg`} />
                  <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                    Klik untuk mengunggah{" "}
                    <span className="color-primary">File Akta</span>
                  </span>
                </div>
              </div>
            </label>
            <InputFile
              name="akta"
              id="akta"
              file
              onChange={(e, data) => {
                if (data) {
                  let parsed = JSON.parse(formData?.filePpdb || "{}");
                  parsed.akta = data;
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
            JSON.parse(formData?.filePpdb || "{}")?.akta ? (
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
                          JSON.parse(formData?.filePpdb || "{}")?.akta
                        )
                      )
                    }
                  >
                    <img
                      src="/img/icon-file.svg"
                      alt="icon-file"
                      className="me-3"
                    />
                    <p className="fw-bold color-dark mb-0 py-2">File Akta</p>
                  </div>
                  <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0">
                    <FaTimes
                      className="pointer fs-4"
                      style={{ color: "#96DAFF" }}
                      onClick={() => {
                        let parsed = JSON.parse(formData?.filePpdb || "{}");
                        parsed.akta = "";
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

export default SectionInformasiOrtu;
