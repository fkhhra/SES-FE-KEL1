import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { momentPackage } from "utilities/HelperUtils";
import { editTa, postTa } from "client/TaClient";
import { hideModal } from "utilities/ModalUtils";

import toast from "react-hot-toast";
import useEditModal from "hooks/useEditModal";

import ReactiveButton from "reactive-button";
import NewModal from "components/Shared/NewModal/NewModal";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useSekolah from "hooks/useSekolah";

const initialFormData = {
  tahun: "",
  tahunAwal: "",
  tahunAkhir: "",
  aktif: "",
  namaKepsek: "",
  nipKepsek: "",
  semester: "",
  tanggalAwal: "",
  tanggalAkhir: "",
  tanggalRapor: "",
};

const ModalTambahTahunAkademik = ({ getTaData }) => {
  const [buttonState, setButtonState] = useState("idle");

  const [formData, setFormData] = useState(initialFormData);

  const editModalData =
    useEditModal((state) => state.editModal?.modalBuatTahunAkademik) || null;

  const isEdit = editModalData !== null;
  const { sekolah } = useSekolah();

  const semesterOptions = [
    {
      label: "Ganjil",
      value: "1",
    },
    {
      label: "Genap",
      value: "2",
    },
  ];

  const kurikulumOptions = [
    {
      label: "Kurikulum 2013",
      value: "2013",
    },
    {
      label: "Kurikulum Merdeka",
      value: "merdeka",
    },
  ];

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const submitModal = async () => {
    setButtonState("loading");
    let payload = {
      ...formData,
      tahun: `${formData.tahunAwal} / ${formData.tahunAkhir}`,
    };
    delete payload.tahunAwal;
    delete payload.tahunAkhir;
    const { data, error } = isEdit
      ? await editTa(editModalData?.id, payload)
      : await postTa(payload);
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      setFormData(initialFormData);
      getTaData();
      hideModal("modalBuatTahunAkademik");
    } else {
      error?.map((err) => toast.error(err?.message));
      setButtonState("error");
    }
  };

  const getTahunAwalAkhir = (tahun) => {
    return tahun.split("/").map((str) => str.replace(" ", ""));
  };

  useEffect(() => {
    if (editModalData !== null) {
      setFormData({
        tahunAwal: getTahunAwalAkhir(editModalData?.tahun)?.[0] || "",
        tahunAkhir: getTahunAwalAkhir(editModalData?.tahun)?.[1] || "",
        aktif: editModalData?.aktif == 0 ? "0" : "1",
        namaKepsek: editModalData?.namaKepsek,
        nipKepsek: editModalData?.nipKepsek,
        semester: editModalData?.semester,
        tanggalAwal: editModalData?.tanggalAwal
          ? momentPackage(editModalData?.tanggalAwal).format("YYYY-MM-DD")
          : "",
        tanggalAkhir: editModalData?.tanggalAkhir
          ? momentPackage(editModalData?.tanggalAkhir).format("YYYY-MM-DD")
          : "",
        tanggalRapor: editModalData?.tanggalRapor
          ? momentPackage(editModalData?.tanggalRapor).format("YYYY-MM-DD")
          : "",
        tingkat1: editModalData?.tingkat1,
        tingkat2: editModalData?.tingkat2,
        tingkat3: editModalData?.tingkat3,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);
  return (
    <>
      <NewModal
        modalId="modalBuatTahunAkademik"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {`${isEdit ? "Ubah" : "Buat"} Tahun Akademik`}
            </h4>
            <span className="fs-6 fw-normal">
              {`Isi informasi dibawah untuk ${
                isEdit ? "mengubah" : "membuat"
              } tahun akademik`}
            </span>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <h6 className="fs-18-ss fw-bold color-dark mb-3">Status</h6>
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative">
                  <input
                    className="form-check-input form-check-radio position-absolute"
                    type="radio"
                    name="flexRadioDefault"
                    id="radio-modal-tahun-akademik-aktif"
                    style={{
                      top: "36%",
                      left: "2em",
                    }}
                    checked={formData.aktif === "1"}
                    defaultChecked={false}
                    onChange={() => changeFormData("aktif", "1")}
                  />
                  <label
                    className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                    htmlFor="radio-modal-tahun-akademik-aktif"
                  >
                    <span className="ms-4 ps-2">Aktif</span>
                  </label>
                </div>
                <div className="form-check-ss col-md-6 position-relative">
                  <input
                    className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                    type="radio"
                    name="flexRadioDefault"
                    id="radio-modal-tahun-akademik-non-aktif"
                    style={{
                      top: "36%",
                      left: "2em",
                      // height: "20px",
                    }}
                    checked={formData.aktif === "0"}
                    defaultChecked={false}
                    onChange={() => changeFormData("aktif", "0")}
                  />
                  <label
                    className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                    htmlFor="radio-modal-tahun-akademik-non-aktif"
                  >
                    <span className="ms-4 ps-2">Non-Aktif</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative">
                  <h6 className="fs-18-ss fw-bold color-dark mb-3">
                    Tahun Awal
                  </h6>
                  <DatePicker
                    picker="year"
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData.tahunAwal
                        ? momentPackage(formData.tahunAwal)
                        : ""
                    }
                    placeholder="yyyy"
                    onChange={(date) =>
                      changeFormData("tahunAwal", date.format("YYYY"))
                    }
                  />
                </div>
                <div className="form-check-ss col-md-6 position-relative">
                  <h6 className="fs-18-ss fw-bold color-dark mb-3">
                    Tahun Akhir
                  </h6>
                  <DatePicker
                    picker="year"
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData.tahunAkhir
                        ? momentPackage(formData.tahunAkhir)
                        : ""
                    }
                    placeholder="yyyy"
                    onChange={(date) =>
                      changeFormData("tahunAkhir", date.format("YYYY"))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Semester</label>
              <SelectShared
                placeholder="Pilih semester"
                options={semesterOptions}
                value={formData.semester}
                handleChangeSelect={(e) => changeFormData("semester", e.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Nama Kepala Sekolah</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan nama kepala sekolah"
                type="text"
                name="nama"
                value={formData.namaKepsek}
                onChange={(e) => changeFormData("namaKepsek", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">NIP Kepala Sekolah</label>
              <input
                className="form-control"
                autoComplete="off"
                placeholder="Tuliskan NIP  kepala sekolah"
                type="text"
                name="nama"
                value={formData.nipKepsek}
                onChange={(e) => changeFormData("nipKepsek", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative">
                  <h6 className="fs-18-ss fw-bold color-dark mb-3">
                    Tanggal Awal
                  </h6>
                  <DatePicker
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData.tanggalAwal
                        ? momentPackage(formData.tanggalAwal)
                        : ""
                    }
                    placeholder="dd / mm / yyyy"
                    onChange={(date) =>
                      changeFormData("tanggalAwal", date.format("YYYY-MM-DD"))
                    }
                    format="DD / MM / YYYY"
                  />
                </div>
                <div className="form-check-ss col-md-6 position-relative">
                  <h6 className="fs-18-ss fw-bold color-dark mb-3">
                    Tanggal Akhir
                  </h6>
                  <DatePicker
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData.tanggalAkhir
                        ? momentPackage(formData.tanggalAkhir)
                        : ""
                    }
                    placeholder="dd / mm / yyyy"
                    onChange={(date) =>
                      changeFormData("tanggalAkhir", date.format("YYYY-MM-DD"))
                    }
                    format="DD / MM / YYYY"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="row">
                <div className="form-check-ss col-md-6 position-relative">
                  <h6 className="fs-18-ss fw-bold color-dark mb-3">
                    Pembagian Rapor UTS
                  </h6>
                  <DatePicker
                    className="form-control"
                    autoComplete="off"
                    value={
                      formData.tanggalRapor
                        ? momentPackage(formData.tanggalRapor)
                        : ""
                    }
                    placeholder="dd / mm / yyyy"
                    onChange={(date) =>
                      changeFormData("tanggalRapor", date.format("YYYY-MM-DD"))
                    }
                    format="DD / MM / YYYY"
                  />
                </div>
              </div>
            </div>
            {sekolah?.id == 8719 && (
              <>
                <div className="mb-4">
                  <label className="form-label">Kurikulum Kelas X</label>
                  <SelectShared
                    placeholder="Pilih Kurikulum"
                    options={kurikulumOptions}
                    value={formData.tingkat1}
                    handleChangeSelect={(e) =>
                      changeFormData("tingkat1", e.value)
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Kurikulum Kelas XI</label>
                  <SelectShared
                    placeholder="Pilih Kurikulum"
                    options={kurikulumOptions}
                    value={formData.tingkat2}
                    handleChangeSelect={(e) =>
                      changeFormData("tingkat2", e.value)
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Kurikulum Kelas XII</label>
                  <SelectShared
                    placeholder="Pilih Kurikulum"
                    options={kurikulumOptions}
                    value={formData.tingkat3}
                    handleChangeSelect={(e) =>
                      changeFormData("tingkat3", e.value)
                    }
                  />
                </div>
              </>
            )}
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={submitModal}
          />
        }
      />
    </>
  );
};

export default ModalTambahTahunAkademik;
