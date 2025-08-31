import { editBukuKerja, postBukuKerja } from "client/BukuKerjaGuruClient";
import CompleteFileUpload from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import NewModal from "components/Shared/NewModal/NewModal";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { getFileName } from "utilities/FileViewer";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  lampiran: "",
};

const ModalTambahIkrarGuru = () => {
  const { refetchBukuKerjaDetail, refetchData } = useBukuKerjaDetail();
  const editModalData =
    useEditModal((state) => state.editModal?.modalTambahIkrarGuru) || null;
  const setEditModal = useEditModal((state) => state.setEditModal);

  const [formData, setFormData] = useState(initialFormData);

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const validateData = () => {
    if (!formData?.lampiran) {
      toast.error("Anda belum memasukkan lampiran");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateData()) {
      let body = {
        ...formData,
        tipe: "ikrar",
      };
      const { data } = editModalData
        ? await editBukuKerja(editModalData?.id, body)
        : await postBukuKerja(body);
      if (data) {
        hideModal("modalTambahIkrarGuru");
        refetchBukuKerjaDetail(!refetchData);
        setFormData(initialFormData);
        setEditModal("modalTambahIkrarGuru", null);
      }
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({ lampiran: editModalData?.lampiran });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalTambahIkrarGuru"
      modalSize="md"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {`${editModalData ? "Ubah" : "Tambah"} Ikrar Guru`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              editModalData ? "mengubah" : "membuat"
            } ikrar guru`}
          </span>
        </>
      }
      content={
        <>
          <div className="form-label">Lampiran Ikrar Guru</div>
          <CompleteFileUpload
            name={getFileName(formData?.lampiran)}
            id="buku-kerja-upload-file"
            onChange={(e, url) => {
              changeFormData("lampiran", url);
            }}
            file={formData?.lampiran}
            deleteFile={() => {
              changeFormData("lampiran", "");
            }}
          />
        </>
      }
      submitButton={
        <ReactiveButton
          // buttonState={formData.btnBio}
          color="primary"
          idleText="Simpan"
          loadingText="Diproses"
          successText="Berhasil"
          errorText="Gagal"
          type="button"
          data-bs-dismiss="modal"
          className="btn btn-primary"
          onClick={() => handleSubmit()}
        />
      }
    />
  );
};

export default ModalTambahIkrarGuru;
