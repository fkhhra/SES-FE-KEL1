import React from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { TwitterPicker } from "react-color";

const ModalKategoriTemplateLaporanKeuangan = ({
  formData,
  handleChangeForm,
  _postKategori,
}) => {
  return (
    <NewModal
      modalSize="md"
      modalId="modalBuatKategoriTemplateLaporanKeuangan"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {/* {formData?.idKategori ? "Edit" : "Buat"} */}
            Kategori
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk{" "}
            {/* {formData?.idKategori ? "mengedit" : "membuat"} */}
            membuat kategori
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama Kategori</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              placeholder="Contoh : Aktiva Lancar"
              value={formData?.nama}
              name="nama"
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <h6 className="fs-18-ss fw-bold color-dark mb-3">Kategori</h6>
            <div className="row">
              <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="lainnya"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  name="kategori"
                  value="Lainnya"
                  checked={formData?.kategori == "Lainnya"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="lainnya"
                >
                  <span className="ms-4 ps-2">Lainnya</span>
                </label>
              </div>
              <div className="form-check-ss col-md-6 position-relative mb-3 mb-md-0">
                <input
                  className="form-check-input form-check-radio position-absolute"
                  type="radio"
                  id="beban"
                  style={{
                    top: "36%",
                    left: "2em",
                  }}
                  value="Beban"
                  name="kategori"
                  checked={formData?.kategori == "Beban"}
                  onChange={handleChangeForm}
                />
                <label
                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                  htmlFor="beban"
                >
                  <span className="ms-4 ps-2">Beban</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Warna</label>
            <TwitterPicker
              color={formData?.warna ? formData?.warna : ""}
              triangle="hide"
              className="w-100"
              onChange={(color) => {
                handleChangeForm({
                  target: { name: "warna", value: color.hex },
                });
              }}
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData?.btnBio}
          color={"primary"}
          idleText={"Simpan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={_postKategori}
        />
      }
    />
  );
};

export default ModalKategoriTemplateLaporanKeuangan;
