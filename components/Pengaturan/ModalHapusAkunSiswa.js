import { Select } from "antd";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";

const ModalHapusAkunSiswa = ({
  handleChangeForm,
  formData,
  handleHapus,
  rombel,
  anggotaRombel,
  handleChangeHapusAkun,
}) => {
  return (
    <>
      <NewModal
        modalId="modalHapusAkunSiswa"
        modalSize="lg"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Hapus Akun Siswa</h4>
            <span className="fs-6 fw-normal">
              Isi informasi di bawah untuk menghapus akun siswa
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Hapus Akun Untuk</label>
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
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={formData?.btnBio}
            color={"primary"}
            idleText={"Hapus Akun"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => handleHapus()}
          />
        }
      />
    </>
  );
};

export default ModalHapusAkunSiswa;
