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
  judul: "",
  tingkat: "",
  mTaId: "",
  mMataPelajaranId: "",
  lampiran: "",
};

const ModalTambahSilabus = () => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const editModalData =
    useEditModal((state) => state.editModal?.modalTambahSilabus) || null;
  const setEditModal = useEditModal((state) => state.setEditModal);

  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const { tingkatRombel, mataPelajaran, semuaTA } = bukuKerjaDetailData || {};

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const optionsTingkatRombel = tingkatRombel?.map((tingkat) => {
    return {
      value: tingkat,
      label: tingkat,
    };
  });

  const optionsMataPelajaran = mataPelajaran?.map((mapel) => {
    return {
      label: mapel?.nama,
      value: mapel?.id,
    };
  });

  const optionsSemester = semuaTA?.map((ta) => {
    return {
      label: `${ta?.tahun} - ${
        ta?.semester?.includes("1") ||
        ta?.semester?.includes("ganjil") ||
        ta?.semester?.includes("Ganjil")
          ? "Semester 1"
          : "Semester 2"
      }`,
      value: ta?.id,
    };
  });

  const validateData = () => {
    if (!formData?.judul) {
      toast.error("Anda belum memasukkan judul");
      return false;
    }

    if (!formData?.tingkat) {
      toast.error("Anda belum memilih tingkat");
      return false;
    }

    if (!formData?.mTaId) {
      toast.error("Anda belum memilih semester");
      return false;
    }

    if (!formData?.mMataPelajaranId) {
      toast.error("Anda belum memilih mata pelajaran");
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
      setButtonState("loading");
      let body = {
        ...formData,
        tipe: "silabus",
      };
      const { data } = editModalData
        ? await editBukuKerja(editModalData?.id, body)
        : await postBukuKerja(body);
      if (data) {
        hideModal("modalTambahSilabus");
        refetchBukuKerjaDetail(!refetchData);
        setFormData(initialFormData);
        setEditModal("modalTambahSilabus", null);
      }
      setButtonState("idle");
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        judul: editModalData?.judul,
        tingkat: editModalData?.tingkat,
        mTaId: editModalData?.mTaId,
        mMataPelajaranId: editModalData?.mMataPelajaranId,
        lampiran: editModalData?.lampiran,
      });
    } else {
      setFormData({});
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalTambahSilabus"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {`${
              editModalData ? "Ubah" : "Tambah"
            } Silabus / Alur Tujuan Pembelajaran (ATP)`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              editModalData ? "mengubah" : "membuat"
            } Silabus / Alur Tujuan Pembelajaran (ATP)`}
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
              placeholder="Tuliskan judul"
              value={formData?.judul}
              onChange={(e) => changeFormData("judul", e.target.value)}
            />
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Tingkat</label>
              <SelectShared
                placeholder="Pilih tingkat"
                handleChangeSelect={(e) => changeFormData("tingkat", e.value)}
                value={formData?.tingkat}
                options={optionsTingkatRombel}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Semester</label>
              <SelectShared
                placeholder="Pilih semester"
                handleChangeSelect={(e) => changeFormData("mTaId", e.value)}
                value={formData?.mTaId}
                options={optionsSemester}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Mata Pelajaran</label>
            <SelectShared
              placeholder="Pilih mata pelajaran"
              handleChangeSelect={(e) =>
                changeFormData("mMataPelajaranId", e.value)
              }
              value={formData.mMataPelajaranId}
              options={optionsMataPelajaran}
            />
          </div>
          <div className="form-label">
            Lampiran Silabus / Alur Tujuan Pembelajaran (ATP)
          </div>
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

export default ModalTambahSilabus;
