import { DatePicker } from "antd";
import {
  editBukuKerjaSoal,
  postBukuKerjaSoal,
} from "client/BukuKerjaGuruClient";
import CompleteFileUpload from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import NewModal from "components/Shared/NewModal/NewModal";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useBukuKerjaDetail from "hooks/useBukuKerjaDetail";
import useEditModal from "hooks/useEditModal";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { getFileName } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  judul: "",
  tingkat: "",
  mTaId: "",
  mMataPelajaranId: "",
  mUserId: "",
  tanggal: momentPackage(),
  soal: "",
  waktu: "",
  lampiran: "",
};

const ModalTambahKumpulanSoal = () => {
  const { bukuKerjaDetailData, refetchBukuKerjaDetail, refetchData } =
    useBukuKerjaDetail();
  const editModalData =
    useEditModal((state) => state.editModal?.modalTambahKumpulanSoal) || null;
  const setEditModal = useEditModal((state) => state.setEditModal);

  const [formData, setFormData] = useState({});

  const { tingkatRombel, mataPelajaran, semuaTA, semuaGuru } =
    bukuKerjaDetailData || {};

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

  const optionsGuru = semuaGuru?.map((guru) => {
    return {
      label: guru?.nama,
      value: guru?.id,
    };
  });

  const validateData = () => {
    if (!formData?.tingkat) {
      toast.error("Anda belum memilih tingkat");
      return false;
    }

    if (!formData?.mTaId) {
      toast.error("Anda belum memilih semester");
      return false;
    }

    if (!formData?.judul) {
      toast.error("Anda belum memasukkan nama ujian");
      return false;
    }

    if (!formData?.mMataPelajaranId) {
      toast.error("Anda belum memilih mata pelajaran");
      return false;
    }

    if (!formData?.mUserId) {
      toast.error("Anda belum memilih penyusun");
      return false;
    }

    if (!formData?.soal) {
      toast.error("Anda belum memasukkan jumlah soal");
      return false;
    }

    if (!formData?.waktu) {
      toast.error("Anda belum memasukkan waktu");
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
        tipe: "soal",
      };
      body.tanggal = momentPackage(body.tanggal).format("YYYY-MM-DD");
      const { data } = editModalData
        ? await editBukuKerjaSoal(editModalData?.id, body)
        : await postBukuKerjaSoal(body);
      if (data) {
        hideModal("modalTambahKumpulanSoal");
        refetchBukuKerjaDetail(!refetchData);
        setFormData(initialFormData);
        setEditModal("modalTambahKumpulanSoal", null);
      }
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        judul: editModalData?.judul,
        tingkat: editModalData?.tingkat,
        mTaId: editModalData?.mTaId,
        mMataPelajaranId: editModalData?.mMataPelajaranId,
        mUserId: editModalData?.mUserId,
        tanggal: editModalData?.tanggal,
        soal: editModalData?.soal,
        waktu: editModalData?.waktu,
        lampiran: editModalData?.lampiran,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="modalTambahKumpulanSoal"
      modalSize="lg"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {`${editModalData ? "Ubah" : "Tambah"} Kumpulan Soal`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              editModalData ? "mengubah" : "membuat"
            } kumpulan soal`}
          </span>
        </>
      }
      content={
        <>
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
            <label className="form-label">Nama Ujian</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Tuliskan nama ujian"
              value={formData?.judul}
              onChange={(e) => changeFormData("judul", e.target.value)}
            />
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
          <div className="mb-4">
            <label className="form-label">Penyusun</label>
            <SelectShared
              placeholder="Pilih guru"
              handleChangeSelect={(e) => changeFormData("mUserId", e.value)}
              value={formData.mUserId}
              options={optionsGuru}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Tanggal</label>
            <DatePicker
              className="form-control"
              autoComplete="off"
              value={momentPackage(formData?.tanggal)}
              placeholder="Pilih tanggal"
              onChange={(date) => changeFormData("tanggal", date)}
            />
          </div>
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Jumlah Soal</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan judul"
                value={formData?.soal}
                type="number"
                onChange={(e) => changeFormData("soal", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Jumlah Waktu (Menit)</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan judul"
                value={formData?.waktu}
                type="number"
                onChange={(e) => changeFormData("waktu", e.target.value)}
              />
            </div>
          </div>
          <div className="form-label">Lampiran Kumpulan Soal</div>
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

export default ModalTambahKumpulanSoal;
