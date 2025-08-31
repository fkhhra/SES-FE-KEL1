import { postPraktikKerja, putPraktikKerja } from "client/PraktikKerjaClient";
import UploadBanner from "components/Shared/UploadBanner/UploadBanner";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const initialFormData = {
  nama: "",
  siswa: "",
  suratTugas: "",
  mou: "",
};

const ModalTambahPKL = ({ editData, _getAlumni }) => {
  const [buttonState, setButtonState] = useState("idle");
  const [formData, setFormData] = useState({ ...initialFormData, ...editData });

  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const _editPKL = async () => {
    if (!formData.nama) {
      toast.error("Isi Nama Perusahaan");
      return;
    }
    if (!formData.siswa) {
      toast.error("Lampirkan file Data Siswa");
      return;
    }
    if (!formData.suratTugas) {
      toast.error("Lampirkan file Surat Tugas");
      return;
    }
    if (!formData.mou) {
      toast.error("Lampirkan file MoU");
      return;
    }
    setButtonState("loading");
    const payload = {
      ...formData,
    };

    const { data, error } = editData?.nama
      ? await putPraktikKerja(payload, editData?.id)
      : await postPraktikKerja(payload);
    if (data) {
      toast.success(data.message);
      _getAlumni();
      hideModal("modalTambahIkatanAlumni");
      setButtonState("success");
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    setFormData({ ...editData });
  }, [editData]);

  return (
    <NewModal
      modalId="modalTambahIkatanAlumni"
      modalSize="xl"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {editData ? "Ubah" : "Tambah"} Praktik Kerja Lapangan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {editData ? "mengubah" : "menambahkan"}{" "}
            Praktik Kerja Lapangan
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama Perusahaan</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama Perusahaan"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChangeForm}
            />
          </div>
          <div className="mb-4">
            <UploadBanner
              isFile={true}
              isUploadedFile={true}
              label="Lampiran Data Siswa"
              titleUnggahan="File"
              id="siswa"
              name="siswa"
              preview={formData.siswa}
              onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
              onClick={() =>
                handleChangeForm({ target: { name: "siswa" } }, "")
              }
            />
          </div>
          <div className="mb-4">
            <UploadBanner
              isFile={true}
              isUploadedFile={true}
              label="Lampiran Surat Tugas Siswa"
              titleUnggahan="File"
              id="suratTugas"
              name="suratTugas"
              preview={formData.suratTugas}
              onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
              onClick={() =>
                handleChangeForm({ target: { name: "suratTugas" } }, "")
              }
            />
          </div>
          <div className="mb-4">
            <UploadBanner
              isFile={true}
              isUploadedFile={true}
              label="Lampiran MoU"
              titleUnggahan="File"
              id="mou"
              name="mou"
              preview={formData.mou}
              onChange={(e, uploadedFile) => handleChangeForm(e, uploadedFile)}
              onClick={() => handleChangeForm({ target: { name: "mou" } }, "")}
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={buttonState}
          onClick={_editPKL}
          color={"primary"}
          idleText={`Simpan`}
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

export default ModalTambahPKL;
