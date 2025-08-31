import { Tooltip } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaPen } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import { editStudentFoto } from "../../client/StudentClient";
import { hideModal } from "../../utilities/ModalUtils";
import {
  checkIconLihatRapor,
  checkLabelStatusTuntasRaporWalas,
  checkLabelStatusTuntasWalas,
  checkStatusTuntasWalas,
  jumlahNilaiDibawah,
} from "../../utilities/RaporUtils";
import ModalUbahFotoProfil from "./ModalUbahFotoProfil";
import useSekolah from "hooks/useSekolah";

const DaftarRapor = ({
  rombel_id,
  jadwalMengajar,
  keterangan,
  totalMapel,
  kkm,
}) => {
  const initialFormData = {
    avatar: "",
    userId: 0,
    button: "idle",
  };
  const [search, setSearch] = useState("");
  const [jenisRapor, setJenisRapor] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const listKKM = [];
  kkm?.map((item) => {
    item?.mapelRapor?.map((mapel) => {
      listKKM.push({
        mMataPelajaranId: mapel?.mMataPelajaranId,
        kkm2: mapel?.kkm2,
        kkm: mapel.mataPelajaran.kkm,
      });
    });
  });

  const changeFoto = (event, url) => {
    setFormData({ ...formData, avatar: url });
  };

  const putFoto = async () => {
    const { data, error } = await editStudentFoto(formData.userId, {
      avatar: formData.avatar,
    });

    if (data) {
      toast.success(data?.message);
      keterangan.find((item) => item?.user?.id == formData.userId).user.avatar =
        formData.avatar;
      setFormData(initialFormData);
      hideModal("modalUbahFotoProfil");
    } else {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  const { sekolah } = useSekolah(); 
  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="row d-flex justify-content-between align-items-center">
            <div className="col-lg-6 col-md-6 mb-3 d-flex align-items-center">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Rapor{" "}
                {!jenisRapor || jenisRapor == "tengahSemester"
                  ? "Tengah"
                  : "Akhir"}{" "}
                Semester
              </h4>
            </div>
            <div className="col-lg-6 mb-3">
              <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                <input
                  type="text"
                  className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                  style={{ height: "42px", width: "100%" }}
                  id="exampleFormControlInput1"
                  placeholder="Cari nama siswa.."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
                  <button
                    className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4 mt-sm-0 mt-3`}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-joyride="btn-filter-kelas"
                  >
                    {!jenisRapor || jenisRapor == "tengahSemester"
                      ? "Tengah Semester"
                      : "Akhir Semester"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          setJenisRapor("tengahSemester");
                          localStorage.setItem("jenisRapor", "tengahSemester");
                        }}
                      >
                        Tengah Semester
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          setJenisRapor("akhirSemester");
                          localStorage.setItem("jenisRapor", "akhirSemester");
                        }}
                      >
                        Akhir Semester
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="row gy-3 px-4 pb-4">
            {keterangan
              ?.filter((item) => item?.user?.nama.includes(search))
              ?.sort((a, b) =>
                ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
              )
              ?.map((d, idx) => {
                const siswa = d?.user;
                return (
                  <div className="col-lg-4 col-md-6">
                    <div className="border border-1 border-light-secondary rounded-ss p-3 position-relative card-rapor-siswa pointer h-100">
                      <div
                        className="position-absolute icon-edit-rapor-siswa"
                        style={{
                          top: "10px",
                          right: "10px",
                        }}
                      >
                        <div
                          className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                          style={{
                            width: "30px",
                            height: "30px",
                            boxShadow: "0 5px 15px rgba(58,65,102,.2)",
                          }}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              userId: d?.user?.id,
                              avatar: d?.user?.avatar,
                            })
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#modalUbahFotoProfil"
                        >
                          <FaPen />
                        </div>
                      </div>
                      <Link
                        href={`${ssURL}/rapor/${d?.user?.id}?rombel=${rombel_id}&jadwal_mengajar=${jadwalMengajar}`}
                      >
                        <div className="d-flex">
                          <img
                            src={d?.user?.avatar || "/img/cover-sma-smk.svg"}
                            className="me-3 rounded-ss img-fit-cover"
                            width="75px"
                            height="100px"
                            alt=""
                          />
                          <div className="text-truncate">
                            <div className="text-truncate">
                              <Tooltip title={d?.user?.name}>
                                <p className="fs-18-ss fw-extrabold mb-0 color-dark text-truncate">
                                  {d?.user?.nama}
                                </p>
                              </Tooltip>
                              {/* <p className="fs-14-ss fw-semi-bold ">
                            Tidak ada dibawah KKM
                          </p> */}
                              <p className="fs-14-ss fw-semi-bold mb-0">
                                <span className="fw-semibold">
                                  {" "}
                                  {[9349, 9350].includes(sekolah?.id) ? "Dibawah KKTP :" : "Dibawah KKM :"} {""}
                                </span>
                                <span className="fw-bold">
                                  {/* {checkDibawahKKM(
                                d?.user?.meta?.kkmKeterampilan,
                                d?.user?.meta?.kkmPengetahuan
                              )}{" "} */}
                                  {jumlahNilaiDibawah(
                                    d,
                                    listKKM,
                                    siswa,
                                    jenisRapor
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="d-flex align-items-center mt-4">
                              {checkIconLihatRapor(d, listKKM, totalMapel)}
                              <span
                                className={checkLabelStatusTuntasRaporWalas(
                                  d,
                                  listKKM,
                                  totalMapel,
                                  jenisRapor,
                                  siswa
                                )}
                              >
                                {checkStatusTuntasWalas(
                                  d,
                                  listKKM,
                                  totalMapel,
                                  jenisRapor,
                                  siswa
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <ModalUbahFotoProfil
        formData={formData}
        onSubmit={putFoto}
        changeFoto={changeFoto}
      />
    </>
  );
};

export default DaftarRapor;
