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

const ModalTambahModul = ({
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
        modalId="modalTambahRPP"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Buat Modul</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk membuat Modul
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <label className="form-label">Judul Modul</label>
              <input
                className="form-control"
                autoComplete="off"
                type="text"
                name="judul"
                placeholder="Masukkan judul"
                value={formData?.judul}
                onChange={handleChangeForm}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Deskripsi</label>
              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                style={{
                  resize: "none",
                  width: "100%",
                }}
                placeholder="Tuliskan deskripsi Modul"
                minRows={3}
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChangeForm}
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
              <UploadBanner
                isFile={true}
                isUploadedFile={true}
                label="Lampiran"
                titleUnggahan="File"
                id="lampiran"
                name="lampiran"
                preview={formData.lampiran}
                onChange={(e, uploadedFile) =>
                  handleChangeForm(e, uploadedFile)
                }
                onClick={() =>
                  handleChangeForm({ target: { name: "lampiran" } }, "")
                }
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

export default ModalTambahModul;
