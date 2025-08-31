import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import { baseURL, downloadURL } from "../../client/clientAxios";
import { downloadRekapSikap, postRekapSikap } from "../../client/RekapClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import {
  checkLabelSikapDinilai,
  checkStatusSikapDinilai,
} from "../../utilities/RekapUtils";
import ModalTambahSikap from "./ModalTambahSikap";

const SikapPage = ({
  mMateriId,
  mRombelId,
  mapelId,
  predikat,
  daftarSiswa,
  rombel_id,
  _getDetailRekap,
  sikapsosial,
  setRombel_id,
}) => {
  const router = useRouter();

  const { user } = useUser();

  const initialStateForm = {
    id: "",
    mSikapDitunjukkanId: [],
    mSikapDitingkatkanId: [],
    mPredikatNilaiId: "",
  };

  console.log("sikap sosial: ", sikapsosial)

  const [formData, setFormData] = useState(initialStateForm);

  const handleChangeFormCheck = (e) => {
    const parse = JSON.parse(e.target.value);

    const check = formData[e.target.name].findIndex((d) => d == parse);

    if (check >= 0) {
      const filtered = formData[e.target.name].filter((d) => d != parse);

      setFormData({
        ...formData,
        [e.target.name]: [...filtered],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: [...formData[e.target.name], parse],
      });
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  //cek ketika rombel_id kosong di url
  if (rombel_id == undefined) {
    setRombel_id(mRombelId);
  }

  const _postSikap = async () => {
    // perubahan post sikap
    // if (!formData.mSikapDitunjukkanId.length) {
    //   toast.error("Anda belum memasukkan sikap yang ditunjukkan");
    //   return;
    // } else if (!formData.mSikapDitingkatkanId.length) {
    //   toast.error("Anda belum memasukkan sikap yang ditingkatkan");
    //   return;
    // }
    if (!formData.mSikapDitunjukkanId.length && !formData.mSikapDitingkatkanId.length) {
      toast.error("Anda belum memasukkan sikap yang ditunjukkan atau ditingkatkan");
      return;
    } else if (!formData.mPredikatNilaiId) {
      toast.error("Anda belum memasukkan predikat");
      return;
    }
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postRekapSikap(
      {
        m_sikap_ditunjukkan_id: formData.mSikapDitunjukkanId,
        m_sikap_ditingkatkan_id: formData.mSikapDitingkatkanId,
        m_predikat_nilai_id: formData.mPredikatNilaiId,
      },
      rombel_id,
      formData.id,
      mapelId
    );

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getDetailRekap();
      hideModal("modalTambahSikap");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleDownload = async (rombelId, mapelId) => {
    const { data, error } = await downloadRekapSikap(rombelId, mapelId);

    if (data) {
      document.getElementById("downloadIframe").src = downloadURL + data;
    } else {
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };

  const handleImport = async (e, rombelId, mapelId) => {
    if (!e.target.files[0]) {
      return;
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const { data } = await axios.post(
      `${baseURL}/import/rekap-sikap/${rombelId}/${mapelId}`,
      formData
    );

    if (data) {
      toast.success("Import Berhasil");
      _getDetailRekap();
    } else {
      toast.error("Silahkan coba beberapa saat lagi");
    }
  };

  const onClickEdit = (data) => {
    if (data) {
      if (data?.user?.rekapSikap == null) {
        setFormData({
          ...initialStateForm,
          id: data?.user?.id,
        });
      } else {
        let mSikapDitunjukkanId = data?.user?.rekapSikap?.mSikapDitunjukkanId
          ?.split(",")
          ?.map(function (item) {
            return parseInt(item, 10);
          });
        let mSikapDitingkatkanId = data?.user?.rekapSikap?.mSikapDitingkatkanId
          ?.split(",")
          ?.map(function (item) {
            return parseInt(item, 10);
          });
        setFormData({
          ...initialStateForm,
          id: data?.mUserId,
          mSikapDitunjukkanId: mSikapDitunjukkanId,
          mSikapDitingkatkanId: mSikapDitingkatkanId,
          mPredikatNilaiId: data?.user?.rekapSikap?.mPredikatNilaiId,
        });
      }
    }
  };

  return (
    <div className="card card-ss">
      <div className="card-body p-0">
        <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
        {/* {!dataRekapUjian?.length && (
          <div className="row justify-content-center my-4">
            <div className="col-sm-3 col-8">
              <img
                src="/img/empty-state-daftar-soal.png"
                alt="empty-state"
                className="img-fluid mb-2"
              />
            </div>
            <div className="col-12 text-center">
              <h5 className="color-dark fw-black">Ujian Belum Ditambahkan</h5>
              <p className="fw-bold fs-14-ss">
                Tekan tombol{" "}
                <a
                  className="text-decoration-none color-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahMateriRekap"
                  onClick={() => setFormData(initialStateForm)}
                >
                  {" "}
                  di bawah ini
                </a>{" "}
                untuk membuat soal
              </p>
              <button
                type="button"
                className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modalTambahMateriRekap"
                onClick={() => {
                  setEditId(null);
                }}
                data-joyride="btn-tambah-mapel"
              >
                Tambah Tugas
              </button>
            </div>
          </div>
        )} */}

        {daftarSiswa?.length && (
          <div className="card-body p-0">
            <div className="card-header p-4 card-header-ss">
              <div className="d-flex flex-md-row flex-column justify-content-between align-items-sm-center">
                <h4 className="fw-extrabold color-dark mb-lg-0 mb-3">
                  Daftar Sikap Siswa{" "}
                </h4>
                <div className="d-flex flex-sm-row flex-column ">
                  <label
                    className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                    onClick={() =>
                      handleDownload(daftarSiswa[0]?.rombel?.id, mapelId)
                    }
                  >
                    <FaCloudDownloadAlt className="me-2 fs-5" />
                    <p className="mb-0">Download Template</p>
                  </label>
                  <label
                    htmlFor="inputGuruLampiranMateri"
                    className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                  >
                    <FaCloudUploadAlt className="me-2 fs-5" />
                    <p className="mb-0">Unggah Data</p>
                  </label>
                  <input
                    type="file"
                    className="form-control d-none"
                    name="inputGuruLampiranMateri"
                    id="inputGuruLampiranMateri"
                    onChange={(e) =>
                      handleImport(e, daftarSiswa[0]?.rombel?.id, mapelId)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th className="text-center">predikat</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Rekap Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {daftarSiswa[0]?.rombel?.anggotaRombel
                    ?.sort((a, b) =>
                      ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                    )
                    ?.map((d, idx) => {
                      return (
                        <tr key={`${idx}-${new Date().getTime()}`}>
                          <td data-th="No">{idx + 1}</td>
                          <td data-th="Nama">{d?.user?.nama}</td>
                          <td data-th="Nama" className="text-center">
                            {
                              predikat?.find(
                                (item) =>
                                  item?.id ==
                                  d?.user?.rekapSikap?.mPredikatNilaiId
                              )?.predikat
                            }
                          </td>
                          <td data-th="Status" className="text-center">
                            <span
                              className={checkLabelSikapDinilai(
                                d?.user?.rekapSikap?.status
                              )}
                            >
                              {checkStatusSikapDinilai(
                                d?.user?.rekapSikap?.status
                              )}
                            </span>
                          </td>
                          <td data-th="Rekap Nilai" className="text-center">
                            <a
                              className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1"
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahSikap"
                              onClick={() => onClickEdit(d)}
                            >
                              Detail
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ModalTambahSikap
        handleChangeFormCheck={handleChangeFormCheck}
        handleChangeSelect={handleChangeSelect}
        formData={formData}
        _postSikap={_postSikap}
        sikapsosial={sikapsosial}
        predikat={predikat}
      />
    </div>
  );
};

export default SikapPage;
