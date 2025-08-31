import { DatePicker } from "antd";
import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadSuratMasuk from "../Shared/UploadBanner/UploadSuratMasuk";
import Editor from "../Shared/Editor/Editor";
import InputFile from "../Shared/InputFile/InputFile";

const ModalTambahSuratKeputusan = ({
  handleChangeForm,
  formData,
  handleSubmit,
  isMasuk,
}) => {
  useEffect(() => {
    window.$("#isi").summernote("reset");
  }, []);
  useEffect(() => {
    window.$("#isi").summernote("code", formData.isi);
  }, [formData.isi]);
  return (
    <>
      <NewModal
        modalId="modalTambahSuratMasuk"
        modalSize="lg"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {formData.id ? "Edit" : "Buat"} Agenda Surat Keputusan
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk {formData.id ? "mengedit" : "membuat"}{" "}
              agenda surat Keputusan
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Isi Ringkasan Surat</label>
              <Editor id="isi" />
            </div>
            <div className="">
              <div className="d-flex align-items-md-center flex-md-row flex-column">
                <p className="form-label">File Surat</p>
              </div>
              <UploadSuratMasuk
                accept="file/*"
                id="file"
                name="file"
                titleUnggahan="file"
                isFile
                // preview={formData.ttd}
                onUpload={(onUpload) =>
                  handleChangeForm({
                    target: {
                      name: "btnBio",
                      value: onUpload ? "loading" : "idle",
                    },
                  })
                }
                onChange={(e, uploadedFile) =>
                  handleChangeForm({
                    target: {
                      name: "file",
                      value: [...formData.file, uploadedFile],
                    },
                  })
                }
              />

              {/* tampilan ketika file sudah  diinsert */}
              {formData?.file?.map((item) => {
                const fileName = item
                  .split("?")[0]
                  .replace(
                    "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/",
                    ""
                  );
                const type =
                  fileName.substring(
                    fileName.lastIndexOf(".") + 1,
                    fileName.length
                  ) || fileName;
                return (
                  <div className="card-lampiran-materi border-0 bg-soft-primary rounded-ss mb-4">
                    <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
                      {/* <a
                  href={isUploadedFile ? preview : URL.createObjectURL(preview)}
                  target="_blank"
                > */}
                      <div className="col-10 d-flex align-items-center flex-wrap">
                        <img src="/img/icon-upload-link.svg" alt="" />
                        <div className="px-4">
                          <p className="fw-bold color-dark mb-0 ">{fileName}</p>
                          <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                            {type}
                          </span>
                        </div>
                      </div>
                      {/* </a> */}
                      <div
                        className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 p-0"
                        onClick={() =>
                          handleChangeForm({
                            target: {
                              name: "file",
                              value: [
                                ...formData.file.filter((file) => file != item),
                              ],
                            },
                          })
                        }
                      >
                        <FaTimes
                          className="pointer fs-4"
                          style={{ color: "#96DAFF" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={formData.btnBio}
            color={"primary"}
            idleText={"Simpan Surat"}
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

export default ModalTambahSuratKeputusan;
