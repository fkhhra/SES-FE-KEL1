import React from "react";
import ReactiveButton from "reactive-button";
import { hideModal } from "../../utilities/ModalUtils";

const ModalPengaturanInformasi = ({
  formData,
  buttonState,
  _updateInformasi,
  handleChangeForm,
}) => {
  return (
    <div
      className="modal modal-ss fade"
      id="modalPengaturanInformasi"
      tabIndex="-1"
      aria-labelledby="modalPengaturanInformasiLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="modal-title" id="modalBuatTugasKuisLabel">
                      <h4 className="mb-1 fw-extrabold">Edit Informasi</h4>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => hideModal("modalPengaturanInformasi")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <div className="card card-ss">
                    <div className="card-body p-4 pb-5">
                      <h4 className="fw-extrabold color-dark mb-4">Kontak</h4>
                      <div className="mb-4">
                        <label className="form-label">Alamat Sekolah</label>
                        <input
                          type="tel"
                          className="form-control"
                          autoComplete="off"
                          value={formData?.alamat}
                          name="alamat"
                          onChange={(e) => handleChangeForm(e)}
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <div className="container">
              <div className="row ">
                <div className="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-4"
                    data-bs-dismiss="modal"
                  >
                    Batal
                  </button>
                  <ReactiveButton
                    buttonState={buttonState}
                    onClick={_updateInformasi}
                    color={"primary"}
                    idleText={"Simpan"}
                    loadingText={"Diproses"}
                    successText={"Berhasil"}
                    errorText={"Gagal"}
                    type={"button"}
                    className={
                      "btn btn-primary rounded-pill fs-14-ss fw-bolder py-2 px-4 d-flex align-items-center bg-gradient-primary"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPengaturanInformasi;
