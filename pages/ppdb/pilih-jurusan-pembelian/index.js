import StepPPDBPembelian from "components/PPDB/StepPPDBPembelian";
import InputFile from "components/Shared/InputFile/InputFile";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { getPreviewURL } from "utilities/FileViewer";
import { ppdbURL } from "../../../client/clientAxios";
import { getGelombangPPDB } from "../../../client/GelombangPPDB";
import { getMajors } from "../../../client/MajorsClient";
import { editPendaftarPPDB } from "../../../client/PendaftarPPDBClient";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SelectShared from "../../../components/Shared/SelectShared/SelectShared";
import usePPDB from "../../../hooks/usePPDB";

const PilihJurusanPPDB = () => {
  const [majors, setMajors] = useState([]);
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, gelombangPembelian } = gelombangPPDB;
  const { setTerdaftar } = usePPDB();

  const initialStateForm = {
    mJurusan1Id: "",
    mJurusan2Id: "",
    mJurusan3Id: "",
    mJurusan4Id: "",
    mJurusan5Id: "",
  };
  const [formData, setFormData] = useState(initialStateForm);

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(
        data?.jurusan?.map((d) => {
          return { value: d.id, label: d.nama };
        })
      );
    }
  };

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setFormData({ ...formData, ...data?.gelombangPembelian });

      setTerdaftar(data);
    }
  };

  const _editPendaftarPPDB = async () => {
    const payload = {
      mJurusan_1Id: formData.mJurusan1Id,
      mJurusan_2Id: formData.mJurusan2Id,
      mJurusan_3Id: formData.mJurusan3Id,
      mJurusan_4Id: formData.mJurusan4Id,
      mJurusan_5Id: formData.mJurusan5Id,
      suratRekomendasi: formData.suratRekomendasi,
    };

    const { data, error } = await editPendaftarPPDB(
      gelombangPembelian?.id,
      payload
    );

    if (data) {
      setFormData({ ...formData, btnState: "success" });
      toast.success(data?.message);
      _getGelombangPPDB();
    } else {
      setFormData({ ...formData, btnState: "error" });
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getMajorsData();
    _getGelombangPPDB();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDBPembelian />

          <div className="card card-ss mb-4">
            <div className="card-body p-4">
              <h4 className="fw-extrabold color-dark title-border mb-4">
                Pilihan Gelombang dan Jalur
              </h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                  <h6 className="color-dark fw-bold mb-2">
                    Nama Gelombang dan Jalur
                  </h6>
                  <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                    {gelombangPembelian?.gelombang?.nama}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="card card-ss mb-4">
            <div className="card-body p-4">
              <h4 className="fw-extrabold color-dark title-border">
                Pilihan Jurusan
              </h4>
              <p className="color-dark mb-4">
                Wajib memilih minimal 1 pilihan jurusan dan dapat memilih 5
                pilihan jurusan sekaligus dalam sekali pendaftaran
              </p>
              <div className="mb-3">
                <label className="form-label">Pilihan Pertama</label>
                <SelectShared
                  name="mJurusan1Id"
                  handleChangeSelect={handleChangeSelect}
                  value={formData.mJurusan1Id}
                  options={majors}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pilihan Kedua</label>
                <SelectShared
                  name="mJurusan2Id"
                  handleChangeSelect={handleChangeSelect}
                  value={formData.mJurusan2Id}
                  options={majors}
                />
              </div>
              {/*
              <div className="mb-3">
                <label className="form-label">Pilihan Ketiga</label>
                <SelectShared
                  name="mJurusan3Id"
                  handleChangeSelect={handleChangeSelect}
                  value={formData.mJurusan3Id}
                  options={majors}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pilihan Keempat</label>
                <SelectShared
                  name="mJurusan4Id"
                  handleChangeSelect={handleChangeSelect}
                  value={formData.mJurusan4Id}
                  options={majors}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pilihan Kelima</label>
                <SelectShared
                  name="mJurusan5Id"
                  handleChangeSelect={handleChangeSelect}
                  value={formData.mJurusan5Id}
                  options={majors}
                />
              </div> */}
              <div className="">
                <label className="form-label">
                  Surat Rekomendasi Jurusan (Opsional)
                </label>
                <label htmlFor="bukti" className="form-label mb-4 w-100">
                  <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                    <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                      <img src={`/img/icon-upload-dropfile.svg`} />
                      <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                        Klik untuk mengunggah{" "}
                        <span className="color-primary">
                          Surat Rekomendasi Jurusan
                        </span>
                      </span>
                    </div>
                  </div>
                </label>
                <InputFile
                  name="bukti"
                  id="bukti"
                  file
                  onChange={(e, data) => {
                    if (data) {
                      setFormData({
                        ...formData,
                        suratRekomendasi: data,
                      });
                    }
                  }}
                  accept="image/png, image/gif, image/jpeg, application/pdf"
                />
                {formData?.suratRekomendasi ? (
                  <div
                    className="px-4 py-3 border-0 bg-soft-primary rounded-ss mb-4"
                    style={{ minHeight: "79px" }}
                  >
                    <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-row">
                      <div
                        className="d-flex align-items-center flex-wrap pointer"
                        onClick={() =>
                          window.open(getPreviewURL(formData.suratRekomendasi))
                        }
                      >
                        <img
                          src="/img/icon-file.svg"
                          alt="icon-file"
                          className="me-3"
                        />
                        <p className="fw-bold color-dark mb-0 py-2">
                          Surat Rekomendasi Jurusan
                        </p>
                      </div>
                      <div className="d-flex justify-content-end align-items-center ms-auto pt-md-2 pb-md-2 pe-0 p-0">
                        <FaTimes
                          className="pointer fs-4"
                          style={{ color: "#96DAFF" }}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              suratRekomendasi: "",
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="d-flex justify-content-end">
                <ReactiveButton
                  buttonState={formData.btnState}
                  onClick={_editPendaftarPPDB}
                  color={"primary"}
                  idleText={"Simpan"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  className={
                    "btn btn-primary rounded-pill fs-14-ss fw-bolder py-2 px-4 d-flex align-items-center bg-gradient-primary"
                  }
                />
              </div>
            </div>
          </div>
          <div className="card card-ss">
            <div className="card-body p-4 text-center">
              <p className="fw-bold color-dark">
                Pastikan data yang anda cantumkan di atas adalah benar dan dapat
                dipertanggungjawabkan.
              </p>
              <Link href={`${ppdbURL}/kartu-peserta-pembelian`}>
                <button className="btn btn-primary btn-primary-ss shadow-primary-ss bg-gradient-primary rounded-pill px-5 py-2 fw-bold">
                  Selanjutnya
                </button>
              </Link>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default PilihJurusanPPDB;
