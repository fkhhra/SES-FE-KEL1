import { DatePicker } from "antd";
import React from "react";
import { FaLink, FaPaperclip } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import EmptyStateFile from "../Shared/EmptyState/EmptyStateFile";
import ModalTautanLink from "../Shared/ModalTautanLink/ModalTautanLink";
import NewModal from "../Shared/NewModal/NewModal";
import SelectShared from "../Shared/SelectShared/SelectShared";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import modaData from "../../data/moda-rpp.json";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import { momentPackage } from "utilities/HelperUtils";

const ModalTambahLaporanGuru = ({
  isEdit,
  formData,
  handleChangeForm,
  _editSilabus,
  _postSilabus,
  handleChangeSelect,
  tingkat,
  mataPelajaran,
}) => {
  return (
    <>
      <NewModal
        modalId="modalTambahLaporanBulananGuru"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Tambah Laporan Bulanan</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk membuat laporan bulanan
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Judul</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="judul"
                placeholder="Tulis judul"
                value={formData?.judul}
                onChange={handleChangeForm}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Tanggal</label>
              <DatePicker
                picker="month"
                className="form-control"
                autoComplete="off"
                value={
                  formData?.deskripsi ? momentPackage(formData?.deskripsi) : ""
                }
                placeholder="MM-YYYY"
                onChange={(date, datestring) =>
                  handleChangeForm({
                    target: {
                      name: "deskripsi",
                      value: datestring,
                    },
                  })
                }
              />
            </div>
            {/* <div className="mb-4">
              <label className="form-label">Mata Pelajaran</label>
              <SelectShared
                name="mMataPelajaranId"
                placeholder="Pilih mata pelajaran"
                handleChangeSelect={handleChangeSelect}
                value={formData.mMataPelajaranId}
                options={mataPelajaran?.map((d) => {
                  return { label: d?.nama, value: d?.id };
                })}
              />
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="exampleFormControlTextarea1"
                className="form-label mb-3"
              >
                Lampiran Laporan Bulanan
              </label>
              <UploadFileComplete
                id="file"
                onChange={(e, fileUrl) => {
                  handleChangeForm({
                    target: {
                      name: "lampiran",
                      value: fileUrl,
                    },
                  });
                }}
                file={formData?.lampiran}
                deleteFile={() => {
                  handleChangeForm({
                    target: {
                      name: "lampiran",
                      value: "",
                    },
                  });
                }}
                name="Lampiran File Bulanan"
                // handleChange={({ target }) => setFile(target.files[0])}
                // file={file}
                // deleteFile={() => setFile("")}
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={formData.buttonState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => (isEdit ? _editSilabus() : _postSilabus())}
          />
        }
      />
    </>
  );
};

export default ModalTambahLaporanGuru;
