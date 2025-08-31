import { DatePicker } from "antd";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadPhoto from "../Shared/UploadPhoto.js/UploadPhoto";
import { postBerkasMou, putBerkasMou } from "client/MouSuratPerusahaanClient";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import { momentPackage } from "utilities/HelperUtils";
const initialFormData = {
  nama: "",
  mulaiKontrak: "",
  akhirKontrak: "",
  kerjasama: "",
  fasilitas: "",
  lampiran: "",
};
const ModalTambahBerkasMoU = ({ editData, _getDetailBerkas, id }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");

  const _postBerkasMou = async () => {
    setButtonState("loading");
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }
    const { data, error } = await postBerkasMou({
      ...formData,
      mPerusahaanId: id,
      mulaiKontrak: momentPackage(formData?.mulaiKontrak).format("YYYY-MM-DD"),
      akhirKontrak: momentPackage(formData?.akhirKontrak).format("YYYY-MM-DD"),
    });

    if (data) {
      setButtonState("success");
      toast.success(data?.message);
      hideModal("modalTambahBerkasMoU");
      _getDetailBerkas();
    }
  };

  const _putBerkasMou = async () => {
    setButtonState("loading");
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }
    const { data, error } = await putBerkasMou(formData?.id, {
      ...formData,
      keselarasan: formData?.keselarasan == true ? 1 : 0,
      istd: formData?.istd == true ? 1 : 0,
      mulaiKontrak: momentPackage(formData?.mulaiKontrak).format("YYYY-MM-DD"),
      akhirKontrak: momentPackage(formData?.akhirKontrak).format("YYYY-MM-DD"),
    });

    if (data) {
      setButtonState("success");
      toast.success(data?.message);
      hideModal("modalTambahBerkasMoU");
      _getDetailBerkas();
    }
  };

  const formValidation = (formData) => {
    if (!formData?.nama) {
      return "Harap Memasukan Nama Mou";
    }
    if (!formData?.mulaiKontrak) {
      return "Harap Mengatur Mulai Kontrak";
    }
    if (!formData?.akhirKontrak) {
      return "Harap Mengatur Akhir Kontrak";
    }
    if (!formData?.kerjasama?.length) {
      return "Harap Memilih ruang lingkup kerjasama";
    }
    if (!formData?.fasilitas?.length) {
      return "Harap Memilih fasilitas perusahaan";
    }
    if (!formData?.lampiran) {
      return "Harap Mengupload file mou";
    }
    return "";
  };

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const handleChangeFormCheck = (e) => {
    const kerjasamaValue = formData?.[e.target.name]?.split(",");

    let kerjasamaValueFilter = [];

    if (kerjasamaValue?.findIndex((v) => v == e.target.value) > -1) {
      kerjasamaValueFilter = kerjasamaValue?.filter(
        (v) => v !== e.target.value
      );
    } else {
      kerjasamaValueFilter?.push(...kerjasamaValue, e.target.value);
    }

    setFormData({
      ...formData,
      [e.target.name]:
        kerjasamaValueFilter?.toString()?.search(",") == 0
          ? kerjasamaValueFilter?.toString().substring(1)
          : kerjasamaValueFilter?.toString(),
    });
  };

  const ruangLingkupKerjasama = [
    { name: "PKL/Magang Siswa" },
    { name: "Sinkronisasi Kurikulum" },
    { name: "Magang Guru" },
    { name: "Narasumber Guru Tamu" },
    { name: "Kelas Industri" },
    { name: "TEFA" },
  ];

  const fasilitasPerusahaan = [
    { name: "Jaminan Kesehatan" },
    { name: "Keselamatan Kerja" },
    { name: "Alat Bantu / Media" },
    { name: "Uang Saku" },
    { name: "Uang Transportasi" },
    { name: "Makan" },
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        mulaiKontrak: momentPackage(editData?.mulaiKontrak).format(
          "YYYY-MM-DD"
        ),
        akhirKontrak: momentPackage(editData?.akhirKontrak).format(
          "YYYY-MM-DD"
        ),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);
  return (
    <>
      <NewModal
        // onCloseModal={() => setEditIndex(null)}
        modalId="modalTambahBerkasMoU"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {editData ? "Ubah" : "Tambah"} Berkas MoU
            </h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk {editData ? "mengubah" : "menambah"}{" "}
              berkas MoU
            </span>
          </>
        }
        content={
          <>
            <div className="row g-4">
              <div className="col-md-12">
                <label className="form-label">Nama</label>
                <input
                  className="form-control"
                  autoComplete="off"
                  type="text"
                  name="nama"
                  placeholder="Contoh: MoU Smarteschool"
                  value={formData?.nama}
                  onChange={handleChangeInput}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Mulai Kontrak</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: { name: "mulaiKontrak", value: dateString },
                    })
                  }
                  placeholder="Pilih tahun"
                  className="form-control"
                  autoComplete="off"
                  value={
                    formData?.mulaiKontrak
                      ? momentPackage(formData?.mulaiKontrak)
                      : ""
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Akhir Kontrak</label>
                <DatePicker
                  onChange={(date, dateString) =>
                    handleChangeInput({
                      target: { name: "akhirKontrak", value: dateString },
                    })
                  }
                  placeholder="Pilih tahun"
                  className="form-control"
                  autoComplete="off"
                  value={
                    formData?.akhirKontrak
                      ? momentPackage(formData?.akhirKontrak)
                      : ""
                  }
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Ruang Lingkup Kerjasama</label>
                <div className="row">
                  {ruangLingkupKerjasama?.map((d, idx) => {
                    return (
                      <div className="col-md-4 col-6">
                        <div class="form-check mb-3">
                          <input
                            class="form-check-input"
                            name="kerjasama"
                            type="checkbox"
                            value={d?.name}
                            id={d?.name}
                            onChange={handleChangeFormCheck}
                            checked={formData?.kerjasama?.search(d?.name) > -1}
                          />
                          <label
                            class="form-check-label fw-bold fs-14-ss color-secondary"
                            for={d?.name}
                          >
                            {d?.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-12">
                <label className="form-label">Fasilitas Perusahaan</label>
                <div className="row">
                  {fasilitasPerusahaan?.map((d, idx) => {
                    return (
                      <div className="col-md-4 col-6">
                        <div class="form-check mb-3">
                          <input
                            class="form-check-input"
                            name="fasilitas"
                            type="checkbox"
                            value={d?.name}
                            id={d?.name}
                            onChange={handleChangeFormCheck}
                            checked={formData?.fasilitas?.search(d?.name) > -1}
                          />
                          <label
                            class="form-check-label fw-bold fs-14-ss color-secondary"
                            for={d?.name}
                          >
                            {d?.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-12">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label mb-0"
                >
                  Lampiran
                </label>
              </div>
              <UploadFileComplete
                id="fileLampiran"
                onChange={(e, fileUrl) => {
                  handleChangeInput({
                    target: {
                      name: "lampiran",
                      value: fileUrl,
                    },
                  });
                }}
                file={formData?.lampiran}
                deleteFile={() => {
                  handleChangeInput({
                    target: {
                      name: "lampiran",
                      value: "",
                    },
                  });
                }}
                name="Berkas Mou"
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={editData ? `Ubah` : `Simpan`}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={editData ? _putBerkasMou : _postBerkasMou}
          />
        }
      />
    </>
  );
};

export default ModalTambahBerkasMoU;
