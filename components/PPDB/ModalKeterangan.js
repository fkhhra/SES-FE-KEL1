import {
  postInformasiJalur,
  putInformasiJalur,
} from "client/InformasiJalurPpdb";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { hideModal } from "../../utilities/ModalUtils";
import Editor from "../Shared/Editor/Editor";
import NewModal from "../Shared/NewModal/NewModal";

const ModalKeterangan = ({
  editData,
  _detailJalurPpdb,
  isEdit,
  m_jalur_ppdb_id,
}) => {
  const initialFormData = {
    nama: "",
    deskripsi: "",
  };

  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData?.tipe == "keterangan") {
      window.$(`#editorDeskripsi`).summernote("code", editData?.deskripsi);
    } else {
      window.$(`#editorDeskripsi`).summernote("reset");
    }
    setFormData({
      ...editData,
    });
  }, [editData]);

  const _postInformasiPpdb = async () => {
    setButtonState("loading");

    const payload = {
      ...formData,
      deskripsi: window.$(`#editorDeskripsi`).summernote("code"),
      m_jalur_ppdb_id,
      tipe: "keterangan",
    };

    const { data } = isEdit
      ? await putInformasiJalur(editData?.id, payload)
      : await postInformasiJalur(payload);

    if (data) {
      setButtonState("success");
      toast.success(data.message);
      hideModal("ModalKeterangan");
      _detailJalurPpdb();
    } else {
      setButtonState("error");
      toast.error(data.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <NewModal
      modalId="ModalKeterangan"
      modalSize="xl"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Keterangan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            Keterangan PPDB
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Contoh : Daftar Akun"
              type="text"
              name="nama"
              value={formData.nama || ""}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Deskripsi Keterangan</label>
            <Editor id="editorDeskripsi" defaultValue={editData?.deskripsi} />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={_postInformasiPpdb}
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

export default ModalKeterangan;
