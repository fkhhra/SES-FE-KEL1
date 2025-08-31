import { editBukuKerja, postBukuKerja } from "client/BukuKerjaGuruClient";
import CompleteFileUpload from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import NewModal from "components/Shared/NewModal/NewModal";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { getFileName } from "utilities/FileViewer";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  lampiran: "",
  mRombelId: "",
};

const ModalTambahBukuPeganganGuru = () => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const editModalData =
    useEditModal((state) => state.editModal?.modalTambahBukuPeganganGuru) ||
    null;
  const setEditModal = useEditModal((state) => state.setEditModal);

  const [formData, setFormData] = useState(initialFormData);

  const { semuaTA, rombel } = bukuKerjaDetailData || {};

  const optionsKelas = rombel?.map((data) => {
    return {
      label: data?.nama,
      value: data?.id,
    };
  });

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const validateData = () => {
    if (!formData?.mRombelId) {
      toast.error("Anda belum memilih kelas");
      return false;
    }

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
        tipe: "buku pegangan",
      };
      const { data } = editModalData
        ? await editBukuKerja(editModalData?.id, body)
        : await postBukuKerja(body);
      if (data) {
        hideModal("modalTambahBukuPeganganGuru");
        refetchBukuKerjaDetail(!refetchData);
        setFormData(initialFormData);
        setEditModal("modalTambahBukuPeganganGuru", null);
      }
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        lampiran: editModalData?.lampiran,
        mRombelId: editModalData?.mRombelId,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalTambahBukuPeganganGuru"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {`${editModalData ? "Ubah" : "Tambah"} Buku Pegangan Guru`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              editModalData ? "mengubah" : "membuat"
            } buku pegangan guru`}
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Kelas</label>
            <SelectShared
              placeholder="Pilih semester"
              handleChangeSelect={(e) => changeFormData("mRombelId", e.value)}
              value={formData?.mRombelId}
              options={optionsKelas}
            />
          </div>
          <div className="form-label">Lampiran Buku Pegangan Guru</div>
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

export default ModalTambahBukuPeganganGuru;
