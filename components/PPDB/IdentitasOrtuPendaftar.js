import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { getPreviewURL } from "utilities/FileViewer";

const IdentitasOrtuPendaftar = ({ initialState = {} }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    setFormData({ ...initialState.profil });
  }, [initialState]);
  return (
    <div className="card card-ss mb-4">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark title-border mb-5">
          Informasi Orang Tua
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
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.namaIbu}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.pekerjaanAyah}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.pekerjaanIbu}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.telpAyah}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.telpIbu}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.alamatAyah}
                disabled
                // onChange={handleChangeForm}
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
                value={formData?.alamatIbu}
                disabled
                // onChange={handleChangeForm}
              />
            </div>
          </div>
          <div className="">
            <label className="form-label">Lampiran Kartu Keluarga</label>
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
                  <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0"></div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="">
            <label className="form-label">Lampiran Akta</label>
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
                  <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0"></div>
                </div>
              </div>
            ) : null}
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

export default IdentitasOrtuPendaftar;
