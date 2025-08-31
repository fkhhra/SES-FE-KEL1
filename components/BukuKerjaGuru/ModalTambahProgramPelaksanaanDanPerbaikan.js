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
  mMataPelajaranId: "",
  lampiran: "",
  mTaId: "",
  mRombelId: "",
  // tanggal: momentPackage()
};

const ModalTambahProgramPelaksanaanDanPerbaikan = () => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const editModalData =
    useEditModal(
      (state) => state.editModal?.modalTambahProgramPelaksanaanDanPerbaikan
    ) || null;
  const setEditModal = useEditModal((state) => state.setEditModal);

  const [formData, setFormData] = useState(initialFormData);

  const { semuaTA, rombel, mataPelajaran } = bukuKerjaDetailData || {};

  const optionsKelas = rombel?.map((data) => {
    return {
      label: data?.nama,
      value: data?.id,
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
      let body = {
        ...formData,
        tipe: "program perbaikan",
      };
      // body.tanggal = momentPackage(body.tanggal).format("YYYY-MM-DD");
      const { data } = editModalData
        ? await editBukuKerja(editModalData?.id, body)
        : await postBukuKerja(body);
      if (data) {
        hideModal("modalTambahProgramPelaksanaanDanPerbaikan");
        refetchBukuKerjaDetail(!refetchData);
        setFormData(initialFormData);
        setEditModal("modalTambahProgramPelaksanaanDanPerbaikan", null);
      }
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        mMataPelajaranId: editModalData?.mMataPelajaranId,
        lampiran: editModalData?.lampiran,
        mTaId: editModalData?.mTaId,
        mRombelId: editModalData?.mRombelId,
        // tanggal: editModalData?.tanggal
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalTambahProgramPelaksanaanDanPerbaikan"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {`${
              editModalData ? "Ubah" : "Tambah"
            } Prog. Pelaks Perbaikan & Pengayaan`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              editModalData ? "mengubah" : "membuat"
            } prog. pelaks erbaikan & pengayaan`}
          </span>
        </>
      }
      content={
        <>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Kelas</label>
              <SelectShared
                placeholder="Pilih semester"
                handleChangeSelect={(e) => changeFormData("mRombelId", e.value)}
                value={formData?.mRombelId}
                options={optionsKelas}
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
            Lampiran Prog. Pelaks Perbaikan & Pengayaan
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

export default ModalTambahProgramPelaksanaanDanPerbaikan;
