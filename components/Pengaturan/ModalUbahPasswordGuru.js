import AsyncSelect from "react-select/async";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import { Select } from "antd";

const ModalUbahPasswordGuru = ({
  handleChangeForm,
  formData,
  handleSubmit,
  handleChangePassword,
  listGuru,
  loadOptions,
}) => {
  return (
    <>
      <NewModal
        modalId="modalUbahPasswordGuru"
        modalSize="lg"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Ubah Password Guru</h4>
            <span className="fs-6 fw-normal">
              Isi informasi di bawah untuk mengubah password guru
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Ubah Password Untuk</label>
              {/* <AsyncSelect
                // disabled={editId}
                isMulti
                value={
                  formData?.listGuru == "semua"
                    ? { label: "Semua Guru", value: "semua" }
                    : listGuru
                        ?.filter((d) => formData?.listGuru?.includes(d?.id))
                        ?.map((d) => {
                          return {
                            label: d?.nama,
                            value: d?.id,
                          };
                        })
                }
                defaultOptions={[
                  { label: "Semua Guru", value: "semua" },
                ].concat(
                  listGuru?.map((d) => {
                    return {
                      label: d?.nama,
                      value: d?.id,
                    };
                  })
                )}
                loadOptions={loadOptions}
                onChange={(e) => {
                  e.some((d) => d.value == "semua")
                    ? handleChangeForm({
                        target: {
                          name: "listGuru",
                          value: "semua",
                        },
                      })
                    : handleChangeForm({
                        target: {
                          name: "listGuru",
                          value: e.map((d) => d.value),
                        },
                      });
                }}
                placeholder="Pilih guru"
                style={{ width: "100%" }}
                maxTagCount="responsive"
              /> */}
              <Select
                mode="multiple"
                value={
                  formData?.listGuru == "semua"
                    ? { label: "Semua Guru", value: "semua" }
                    : listGuru
                        ?.filter((d) => formData?.listGuru?.includes(d?.id))
                        ?.map((d) => {
                          return {
                            label: d?.nama,
                            value: d?.id,
                          };
                        })
                }
                options={[{ label: "Semua Guru", value: "semua" }].concat(
                  listGuru?.map((d) => {
                    return {
                      label: d?.nama,
                      value: d?.id,
                    };
                  })
                )}
                placeholder="Pilih Guru.."
                style={{ width: "100%" }}
                onChange={
                  //   (e) => {
                  //   e.some((d) => d.value == "semua")
                  //     ? handleChangeForm({
                  //         target: {
                  //           name: "listGuru",
                  //           value: "semua",
                  //         },
                  //       })
                  //     : handleChangeForm({
                  //         target: {
                  //           name: "listGuru",
                  //           value: e.map((d) => d.value),
                  //         },
                  //       });
                  // }
                  (e) => {
                    handleChangeForm({
                      target: {
                        name: "listGuru",
                        value: e.some((d) => d == "semua")
                          ? listGuru?.map((d) => d.id)
                          : e,
                      },
                    });
                  }
                } // disabled={listRombel.length === 0 || listRombel.length > 1}
                maxTagCount="responsive"
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password Baru</label>
              <input
                className="form-control mb-2"
                id="password"
                placeholder="Masukkan Password Baru"
                autoComplete="new-password"
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

export default ModalUbahPasswordGuru;
