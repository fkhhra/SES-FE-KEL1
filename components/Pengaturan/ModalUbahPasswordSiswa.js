import { Select } from "antd";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";

const ModalUbahPasswordSiswa = ({
  handleChangeForm,
  formData,
  handleSubmit,
  rombel,
  anggotaRombel,
  handleChangePassword,
}) => {
  return (
    <>
      <NewModal
        modalId="modalUbahPasswordSiswa"
        modalSize="lg"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Ubah Password Siswa</h4>
            <span className="fs-6 fw-normal">
              Isi informasi di bawah untuk mengubah password siswa
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Ubah Password Untuk</label>
              <div className="row">
                <div className="col-md-6 mb-md-0 mb-2">
                  <Select
                    // disabled={editId}
                    mode="multiple"
                    value={formData?.listRombel}
                    options={[{ label: "Semua Rombel", value: "semua" }].concat(
                      rombel?.map((d) => {
                        return {
                          label: d?.nama,
                          value: d?.id,
                        };
                      })
                    )}
                    onChange={(e) => {
                      handleChangeForm({
                        target: {
                          name: "listRombel",
                          value: e.some((d) => d == "semua")
                            ? rombel?.map((d) => d.id)
                            : e,
                        },
                      });
                    }}
                    placeholder="Pilih Kelas.."
                    style={{ width: "100%" }}
                    maxTagCount="responsive"
                  />
                </div>
                <div className="col-md-6">
                  <Select
                    mode="multiple"
                    value={formData?.listAnggota}
                    options={[{ label: "Semua Siswa", value: "semua" }].concat(
                      anggotaRombel?.map((d) => {
                        return { value: d?.id, label: d?.nama };
                      })
                    )}
                    placeholder="Pilih Siswa.."
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      handleChangeForm({
                        target: {
                          name: "listAnggota",
                          value: e.some((d) => d == "semua")
                            ? anggotaRombel?.map((d) => d.id)
                            : e,
                        },
                      });
                    }} // disabled={listRombel.length === 0 || listRombel.length > 1}
                    maxTagCount="responsive"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Password Baru</label>
              <input
                className="form-control mb-2"
                id="password"
                autoComplete="new-password"
                placeholder="Masukkan Password Baru"
                value={formData?.password}
                onChange={(e) => handleChangePassword(e)}
                type={formData?.lihatPassword ? "text" : "password"}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="lihatPassword"
                  onChange={(e) => handleChangePassword(e)}
                  checked={formData?.lihatPassword}
                />
                <label
                  className="form-check-label fs-14-ss color-secondary fw-semibold"
                  htmlFor="lihatPassword"
                >
                  Tampilkan password
                </label>
              </div>
            </div>
            <div>
              <label className="form-label">Konfirmasi Password Baru</label>
              <input
                className={`form-control mb-2 ${
                  formData?.password !== formData?.konfirmasiPassword
                    ? "form-konfirmasi-salah"
                    : ""
                }`}
                // className={`form-control mb-2`}
                id="konfirmasiPassword"
                placeholder="Konfirmasi Password Baru"
                value={formData?.konfirmasiPassword}
                onChange={(e) => handleChangePassword(e)}
                type={formData?.lihatKonfirmasiPassword ? "text" : "password"}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="lihatKonfirmasiPassword"
                  onChange={(e) => handleChangePassword(e)}
                  checked={formData?.lihatKonfirmasiPassword}
                />
                <label
                  className="form-check-label fs-14-ss color-secondary fw-semibold"
                  htmlFor="lihatKonfirmasiPassword"
                >
                  Tampilkan password
                </label>
              </div>
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
            onClick={() => handleSubmit()}
          />
        }
      />
    </>
  );
};

export default ModalUbahPasswordSiswa;
