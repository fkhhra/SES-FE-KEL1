import { postEskul, updateEskul } from "client/EskulClient";
import UploadSuratMasuk from "components/Shared/UploadBanner/UploadSuratMasuk";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import { hideModal } from "../../utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";

const initialFormData = {
  nama: "",
  program: "",
  file: [],
  foto: [],
};

const ModalTambahEkstrakurikuler = ({
  editData = null,
  setEditData,
  _getBarang,
}) => {
  const isEdit = editData !== null;

  const [buttonState, setButtonState] = useState("idle");

  const [formData, setFormData] = useState(initialFormData);

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const setupPayload = () => {
    const payload = {
      ...formData,
    };

    return payload;
  };

  const handleSubmit = async () => {
    if (!formData.nama) {
      toast.error("Anda belum memasukkan nama ekstrakurikuler");
      return;
    } else if (!formData.program) {
      toast.error("Anda belum memasukkan program ekstrakurikuler");
      return;
    } else if (!formData.foto.length) {
      toast.error("Anda belum memasukkan foto ekstrakurikuler");
      return;
    } else if (!formData.file.length) {
      toast.error("Anda belum memasukkan file ekstrakurikuler");
      return;
    }
    const payload = setupPayload();
    const { data, error } = isEdit
      ? await updateEskul(editData?.id, payload)
      : await postEskul(payload);
    if (data) {
      setEditData(null);
      setButtonState("success");
      setFormData(initialFormData);
      hideModal("modalTambahEkstrakurikuler");
      _getBarang();
      toast.success(data?.message);
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (editData !== null) {
      setFormData({
        nama: editData.nama,
        program: editData.program,
        file: editData.file,
        foto: editData.foto,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  return (
    <NewModal
      onCloseModal={() => setEditData(null)}
      modalId="modalTambahEkstrakurikuler"
      modalSize="xl"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Ekstrakurikuler
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            Ekstrakurikuler
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <UploadPhoto
              name="foto"
              id="uploadFotoBarang"
              label="Foto Kegiatan Ekstrakurikuler"
              col="col-md-3"
              titleUnggahan="Foto"
              titleUkuran=""
              titleRasio="1:1"
              isSarpras
              isEskul
              listPhoto={formData.foto || []}
              onChange={(e, uploadedFile) =>
                handleChangeInput({ target: { name: "foto" } }, uploadedFile)
              }
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Nama Ekstrakurikuler</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama Ekstrakurikuler"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChangeInput}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Program Ekstrakurikuler</label>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan Program Ekstrakurikuler"
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChangeInput}
            />
          </div>
          <div>
            <div className="d-flex align-items-md-center flex-md-row flex-column">
              <p className="form-label">File Kegiatan Ekstrakurikuler</p>
            </div>
            <UploadSuratMasuk
              accept="file/*"
              id="file"
              name="file"
              titleUnggahan="file"
              isFile
              // preview={formData.ttd}
              onUpload={(onUpload) =>
                setButtonState(onUpload ? "loading" : "idle")
              }
              onChange={(e, uploadedFile) =>
                handleChangeInput({
                  target: {
                    name: "file",
                    value: [...formData.file, uploadedFile],
                  },
                })
              }
            />

            {/* tampilan ketika file sudah  diinsert */}
            {formData?.file?.map((item) => {
              return (
                <div className="card-lampiran-materi border-0 bg-soft-primary rounded-ss mb-4">
                  <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
                    <a href={getPreviewURL(item)} target="_blank">
                      <div className="d-flex align-items-center flex-wrap">
                        <img src="/img/icon-upload-link.svg" alt="" />
                        <div className="px-4">
                          <p className="fw-bold color-dark mb-0 ">
                            {getFileName(item)}
                          </p>
                          <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                            {getFileName(item)}
                          </span>
                        </div>
                      </div>
                    </a>
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
          buttonState={buttonState}
          onClick={handleSubmit}
          color={"primary"}
          idleText={`${isEdit ? "Ubah" : "Tambah"}`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalTambahEkstrakurikuler;
