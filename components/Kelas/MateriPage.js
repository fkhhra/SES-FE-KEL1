import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { getDetailTopik } from "client/TopikClient";
import { ssURL } from "client/clientAxios";
import { momentPackage } from "utilities/HelperUtils";
import {
  editMateriKesimpulan,
  postMateriKesimpulan,
} from "client/MateriClient";
import { showModal } from "utilities/ModalUtils";
import { deleteTimeline } from "client/TimelineClient";
import { getFileName } from "utilities/FileViewer";

import useUser from "hooks/useUser";
import toast from "react-hot-toast";
import useEditModal from "hooks/useEditModal";

import ModalKesimpulanAnalisisMateri from "./Materi/ModalKesimpulanAnalisisMateri";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import ModalBagikanMateri from "./ModalBagikanMateri";
import CardLampiran from "./CardLampiran";

const MateriPage = ({ detailData, kegiatanData, _getDetailTimeline }) => {
  const { user } = useUser();
  const { setEditModal } = useEditModal();

  const router = useRouter();

  const { kegiatan_id: kegiatanId, id: kelasId } = router.query || {};

  const singleMateri =
    detailData?.materi?.[0] || detailData?.timeline?.materi?.[0];

  const [detailTopik, setDetailTopik] = useState({});
  const [kesimpulan, setKesimpulan] = useState(null);
  const [buttonState, setButtonState] = useState("idle");

  const { topik, user: userTopik } = detailTopik;

  const _getDetailTopik = async (status) => {
    let params = {
      analisis: true,
      mJadwalMengajarId: kelasId,
    };
    if (status) {
      params.status = status;
    }
    const { data } = await getDetailTopik(singleMateri?.id, params);
    if (data) {
      setDetailTopik(data);
    }
  };

  const updateKesimpulanSiswa = async () => {
    setButtonState("loading");
    let payload = {
      mTopikId: singleMateri?.id,
      kesimpulan: kesimpulan,
      waktuSelesai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    };
    const data = await editMateriKesimpulan(payload, singleMateri?.id);
    if (data) {
      toast.success("Data berhasil disimpan!");
      setButtonState("success");
      _getDetailTimeline(null, false);
    } else {
      setButtonState("error");
    }
  };

  const setWaktuMulaiSiswa = () => {
    let payload = {
      mTopikId: singleMateri?.id,
      waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    };
    postMateriKesimpulan(payload);
  };

  const deleteKegiatan = async () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const activeIndexKegiatanId = kegiatanData?.findIndex(
          (data) => data?.id === +kegiatanId
        );
        let hal = "";
        let targetNextKegiatanId = null;
        if (kegiatanData[activeIndexKegiatanId - 1]) {
          targetNextKegiatanId = kegiatanData[activeIndexKegiatanId - 1]?.id;
          hal = kegiatanData[activeIndexKegiatanId - 1]?.type;
        } else if (kegiatanData[activeIndexKegiatanId + 1]) {
          targetNextKegiatanId = kegiatanData[activeIndexKegiatanId + 1]?.id;
          hal = kegiatanData[activeIndexKegiatanId + 1]?.type;
        }

        const { isSuccess, data } = await deleteTimeline(kegiatanId);
        if (isSuccess) {
          toast.success(data?.message);
          // _getDetailTimeline(targetNextKegiatanId);

          if (targetNextKegiatanId === null) {
            router.push(`${ssURL}/kelas/${kelasId}/kegiatan`);
          } else {
            router.push(
              `${ssURL}/kelas/${kelasId}/kegiatan/${targetNextKegiatanId}?hal=${hal}`
            );
          }
        }
      }
    });
  };

  useEffect(() => {
    if (singleMateri?.id) {
      _getDetailTopik();
    }
  }, [singleMateri?.id]);

  useEffect(() => {
    if (user?.role === "siswa") {
      const kesimpulanSiswa = userTopik?.find(({ id }) => id === user?.id)
        ?.kesimpulan?.[0]?.kesimpulan;
      setKesimpulan(kesimpulanSiswa);
    }
  }, [detailTopik, user]);

  useEffect(() => {
    if (user?.role == "siswa" && singleMateri?.id) {
      setWaktuMulaiSiswa();
    }
  }, [user]);

  return (
    <>
      <div className="card card-ss p-4 mb-4">
        {/* Dropdown Option Start */}

        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-flex justify-content-end">
          {(user?.role == "guru" || user?.role == "admin") && (
            <div
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
            </div>
          )}
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownMenuLink"
          >
            <li
              onClick={() => {
                setEditModal("ModalBagikanMateri", detailTopik);
                showModal("ModalBagikanMateri");
              }}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li onClick={deleteKegiatan}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
        </div>
        {/* Dropdown Option End */}
        <div className="d-flex align-items-center justify-content-md-between mb-4 flex-md-row flex-column">
          <div className="d-flex align-items-center flex-md-row flex-column text-break">
            <img
              src={`/img/icon-kegiatan-materi.svg`}
              alt="icon-kegiatan-materi"
              width="86px"
              height="86px"
            />
            <div className="text-md-start text-center ms-md-4 mt-md-0 mt-4">
              <p className="color-secondary mb-2">
                Kegiatan -{" "}
                {momentPackage(detailData?.tanggalPembagian).format(
                  "DD MMMM YYYY"
                )}
              </p>
              <h2 className="color-dark fw-black mb-0">
                Materi - {topik?.judul}
              </h2>
            </div>
          </div>
        </div>
        {user?.role === "guru" ? (
          <div className="div d-flex flex-md-row flex-column">
            <div
              className="status-info p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
              data-joyride="informasi-materi"
            >
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss fw-bold color-secondary mb-2">
                  Sudah Baca
                </p>
                <p className="fs-18-ss fw-extrabold color-primary m-0">
                  {topik?.meta?.sudahBaca} Siswa
                </p>
              </div>
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss fw-bold color-secondary mb-2">
                  Belum Baca
                </p>
                <p className="fs-18-ss fw-extrabold color-primary m-0">
                  {userTopik?.length - topik?.meta?.sudahBaca} Siswa
                </p>
              </div>
            </div>
            <a
              href={`${ssURL}/kelas/${kelasId}/materi/${singleMateri?.id}?babId=${topik?.bab?.id}`}
              className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center py-3 ps-4 pe-5 ms-md-3"
              data-joyride="btn-pratinjau-materi"
            >
              <div className="d-flex align-items-center">
                <img src={`/img/icon-pratinjau.svg`} alt="icon-pratinjau" />
                <p className="m-0 text-white fw-bold ps-4 pe-5">
                  Pratinjau Materi
                </p>
              </div>
            </a>
          </div>
        ) : (
          user?.role === "siswa" && (
            <div>
              <p>{topik?.konten}</p>
              {topik?.lampiran?.map((data, index) => (
                <CardLampiran
                  customClass="col-md-12 mb-3"
                  text={getFileName(data)}
                  iconLeft="/img/icon-file.svg"
                  key={`${index}-${new Date().getTime()}`}
                  onClick={() => window.open(data, "_blank")}
                />
              ))}
              {topik?.link?.map((data, index) => (
                <CardLampiran
                  customClass="col-md-12 mb-3"
                  text={data}
                  iconLeft="/img/icon-tautan-link.svg"
                  key={`${index}-${new Date().getTime()}`}
                  onClick={() => window.open(data, "_blank")}
                />
              ))}

              <p className="mb-3 text-dark fw-bold">Kesimpulan</p>

              <TextareaAutosize
                className="form-control"
                autoComplete="off"
                style={{ resize: "none", width: "100%" }}
                placeholder="Tuliskan kesimpulan kamu disini"
                minRows={3}
                onChange={({ target }) => setKesimpulan(target.value)}
                value={kesimpulan}
              />

              <hr style={{ margin: "24px -24px 24px -24px" }} />

              <div className="d-flex justify-content-end">
                <ReactiveButton
                  buttonState={buttonState}
                  onClick={updateKesimpulanSiswa}
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
          )
        )}
      </div>

      {user?.role === "guru" && (
        <div className="card card-ss">
          <div className="card-header-ss p-4 d-flex justify-content-between align-items-center">
            <h4 className="fw-extrabold m-0 color-dark">Daftar Siswa</h4>
            <div className="dropdown dropdown-ss">
              <div
                className="rounded-ss shadow-primary-ss"
                style={{
                  width: "32px",
                  height: "32px",
                }}
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src={`/img/icon-filter.svg`} alt="icon-filter" />
              </div>
              <ul
                className="dropdown-menu dropdown-menu-ss my-1"
                aria-labelledby="dropdownMenuLink"
              >
                <li onClick={() => _getDetailTopik()}>
                  <a className="dropdown-item">Semua</a>
                </li>
                <li onClick={() => _getDetailTopik("sudah")}>
                  <a className="dropdown-item">Sudah Baca</a>
                </li>
                <li onClick={() => _getDetailTopik("belum")}>
                  <a className="dropdown-item">Belum Baca</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card-body px-0 pb-4 pt-0">
            <div className="table-responsive">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Waktu Mulai</th>
                    <th>Waktu Selesai</th>
                    <th>Durasi</th>
                    <th>Kesimpulan</th>
                  </tr>
                </thead>
                <tbody>
                  {userTopik?.map((d, idx) => {
                    return (
                      <tr key={`${idx}-${new Date().getTime()}`}>
                        <td data-th="No">{idx + 1}</td>
                        <td data-th="Nama">{d.nama}</td>
                        <td data-th="Waktu Mulai">
                          {d.kesimpulan?.[0]?.waktuMulai}
                        </td>
                        <td data-th="Waktu Selesai">
                          {d.kesimpulan?.[0]?.waktuSelesai}
                        </td>
                        <td data-th="Durasi">
                          {momentPackage(d.kesimpulan?.[0]?.updatedAt).diff(
                            momentPackage(d.kesimpulan?.[0]?.createdAt),
                            "minute"
                          )}{" "}
                          Menit
                        </td>
                        <td data-th="Kesimpulan">
                          {!d?.kesimpulan?.[0]?.kesimpulan && (
                            <button
                              className="btn btn-secondary-disable-ss btn-secondary btn-secondary-ss shadow-secondary-ss rounded-pill fs-14-ss py-1 px-4"
                              data-joyride="btn-kesimpulan"
                              disabled
                            >
                              Detail
                            </button>
                          )}

                          {d?.kesimpulan?.[0]?.kesimpulan &&
                          d?.kesimpulan?.[0]?.dibaca == 0 ? (
                            <button
                              className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4"
                              data-bs-toggle="modal"
                              data-bs-target="#modalKesimpulanAnalisisMateri"
                              onClick={() => setKesimpulan(d)}
                              data-joyride="btn-kesimpulan"
                            >
                              Detail
                            </button>
                          ) : null}

                          {d?.kesimpulan?.[0]?.dibaca == 1 && (
                            <button
                              className="btn btn-success btn-success btn-success-ss shadow-success-ss rounded-pill fs-14-ss py-1 px-4"
                              data-bs-toggle="modal"
                              data-bs-target="#modalKesimpulanAnalisisMateri"
                              onClick={() => setKesimpulan(d)}
                            >
                              Terperiksa
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ModalKesimpulanAnalisisMateri
        kesimpulan={kesimpulan}
        singleMateri={singleMateri}
        _getDetailTopik={_getDetailTopik}
      />

      <ModalBagikanMateri _getDetailTopik={_getDetailTopik} />
    </>
  );
};

export default MateriPage;
