import { Badge } from "antd";
import { resetPesertaUjian } from "client/PesertaUjianClient";
import {
  postDibacaPeringatanUjianGuru,
  updateNilaiPesertaJadwal,
} from "client/UjianClient";
import ModalHistoryPeringatan from "components/Ujian/ModalHistoryPeringatan";
import ModalTambahPeringatan from "components/Ujian/ModalTambahPeringatan";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronCircleDown,
  FaChevronDown,
  FaChevronLeft,
  FaChevronUp,
  FaCloudDownloadAlt,
  FaLink,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import {
  getStatusPengerjaan,
  tablePesertaData,
  getKeluarTabSiswa,
} from "utilities/JadwalUjian";
import { showModal } from "utilities/ModalUtils";
import { downloadURL, ssURL } from "../../../../client/clientAxios";
import {
  downloadBeritaAcaraUjian,
  downloadJadwalUjian,
  downloadJawabanJadwalUjian,
  getDetailJadwalUjian,
} from "../../../../client/JadwalUjianClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import ModalStep from "../../../../components/Shared/ModalStep/ModalStep";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import WhatsappLink from "../../../../components/Shared/WhatsappLink/WhatsappLink";
import { getDetailJadwalUjianRef } from "../../../../services/jadwalUjianService";
import { momentPackage } from "../../../../utilities/HelperUtils";
import Swal from "sweetalert2";
import useSekolah from "hooks/useSekolah";
import ModalRekapNilai from "components/ModalRekapNilai/ModalRekapNilai";

const initialFormData = {
  rombelId: "",
};
const index = ({ id, rombel_peserta_id }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { nav } = useRouter().query;
  const { sekolah } = useSekolah();
  const [jadwalUjianRef, setJadwalUjianRef] = useState([]);
  const [statusSort, setStatusSort] = useState(0);
  const [sortKeluarTab, setSortKeluarTab] = useState(0);
  const [sortNilai, setSortNilai] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(`/`);
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const [detailJadwalUjianData, setDetailJadwalUjianData] = useState({});
  const { jadwalUjian, pesertaUjian, rombel } = detailJadwalUjianData;

  const getDetailJadwalUjianData = async () => {
    const { data } = await getDetailJadwalUjian(id, {
      tkJadwalUjianId: rombel_peserta_id,
    });
    if (data) {
      if (!rombel_peserta_id) {
        router.push(
          `${ssURL}/jadwal-ujian/${id}?rombel_peserta_id=${data.jadwalUjian?.rombelUjian?.[0]?.id}`
        );
      }
      setDetailJadwalUjianData(data);
    }
  };

  const [peringatan, setPeringatan] = useState([]);
  const [dataPeserta, setDataPeserta] = useState({});
  const handleClickDataPeserta = (dataPeserta) => {
    setDataPeserta(dataPeserta);
  };

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleClickPeringatan = (peringatan) => {
    setPeringatan(peringatan);
  };

  const handleClickDownloadRekapNilai = async () => {
    const { data } = await downloadJadwalUjian({
      tkJadwalUjianId: formData?.rombelId,
      mJadwalUjianId: id,
    });
    if (data) {
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
  };

  const handleClickDownloadBeritaAcara = async () => {
    const { data } = await downloadBeritaAcaraUjian({
      tkJadwalUjianId: rombel_peserta_id,
    });
    if (data) {
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
  };

  const handleClickDownloadRekapHasilUjian = async () => {
    const { data } = await downloadJawabanJadwalUjian(
      {
        tkJadwalUjianId: formData?.rombelId,
        mJadwalUjianId: id,
      },
      id
    );
    if (data) {
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
  };

  const swalLoading = () => {
    Swal.fire({
      title: "Data Sedang di Update",
      // html: "I will close in <b></b> milliseconds.",
      timer: 10000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        // clearInterval(timerInterval);
      },
    });
  };

  const handleUpdateNilai = async () => {
    setLoading(true);
    // if (momentPackage().hour() < 12) {
    //   toast.error("Fitur aktif setelah jam 12 siang");
    //   return;
    // }
    const { data } = await updateNilaiPesertaJadwal({
      mJadwalUjianId: id,
      tkJadwalUjianId: rombel_peserta_id,
    });
    // Swal.fire({
    //   title: "Data Sedang di Update",
    //   // html: "I will close in <b></b> milliseconds.",
    //   timer: 2000,
    //   timerProgressBar: true,
    //   allowOutsideClick: false,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    //   willClose: () => {
    //     // clearInterval(timerInterval);
    //   },
    // }).then((result) => {
    //   /* Read more about handling dismissals below */
    //   if (data) {
    //     console.log("Plus timer");
    //   } else {
    //     Swal.increaseTimer(1000);
    //   }
    //   if (result.dismiss === Swal.DismissReason.timer) {
    //     console.log("I was closed by the timer");
    //   }
    // });
    if (data) {
      setLoading(false);
      Swal.fire({
        title: "Finished!",
        type: "success",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    await getDetailJadwalUjianData();
  };

  const handleResetUjian = async (id, hapus) => {
    swal({
      title: hapus
        ? "Siswa akan Mengulang ujian dari awal"
        : "Siswa dapat melanjutkan ujian apabila masih berlangsung",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await resetPesertaUjian(
          { hapus, reset: !hapus },
          id
        );

        if (data) {
          toast.success(data.message);
          getDetailJadwalUjianData();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  const handleBlockUjian = async (id, block) => {
    swal({
      title:
        "Siswa akan dikeluarkkan dari ujian dan tidak bisa masuk kembali kedalam ujian",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await resetPesertaUjian({ block }, id);

        if (data) {
          toast.success(data.message);
          getDetailJadwalUjianData();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  const handleUnblockUjian = async (id, block) => {
    swal({
      title: "Siswa bisa melanjutkan kembali ujian",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await resetPesertaUjian({ block }, id);

        if (data) {
          toast.success(data.message);
          getDetailJadwalUjianData();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  useEffect(() => {
    if (loading == true) {
      swalLoading();
    }
  }, [loading]);

  useEffect(() => {
    getDetailJadwalUjianData();
  }, []);

  useEffect(() => {
    getDetailJadwalUjianData();
    getDetailJadwalUjianRef(rombel_peserta_id, setJadwalUjianRef);
    document.getElementById("downloadIframe").src = "";
  }, [rombel_peserta_id]);

  const handleBack = () => {
    router.back();
  };

  const navItems = [
    {
      url: `${ssURL}/jadwal-ujian/[id]?nav=ujian`,
      as: `${ssURL}/jadwal-ujian/${id}?nav=ujian`,
      text: "Ujian",
      active: nav == "ujian" || nav == undefined,
      dataJoyride: "ujian",
    },
    // {
    //   url: `${ssURL}/jadwal-ujian/[id]?nav=remedial`,
    //   as: `${ssURL}/jadwal-ujian/${id}?nav=remedial`,
    //   text: "Remedial",
    //   active: nav == "remedial",
    //   dataJoyride: "remedial",
    // },
    // {
    //   url: `${ssURL}/jadwal-ujian/[id]?nav=susulan`,
    //   as: `${ssURL}/jadwal-ujian/${id}?nav=susulan`,
    //   text: "Susulan",
    //   active: nav == "susulan",
    //   dataJoyride: "susulan",
    // },
  ];

  const NavJadwalUjianDetail = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalRekapNilai"
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    // onClick={handleClickDownloadRekapNilai}
                    data-joyride="button-rekap-nilai"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Nilai
                  </button>
                  <ModalRekapNilai
                    id={"modalRekapNilai"}
                    onSuccess={() => getDetailRombelData()}
                    endpoint={"/import/absensi-siswa/"}
                    rombel_peserta_id={rombel_peserta_id}
                    rombel={rombel}
                    jadwalUjian={jadwalUjian}
                  />
                </div>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#modalRekapHasilUjian"
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    // onClick={handleClickDownloadRekapHasilUjian}
                    data-joyride="button-rekap-hasil-ujian"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Hasil Ujian
                  </button>
                  <ModalRekapNilai
                    id={"modalRekapHasilUjian"}
                    onSuccess={() => getDetailRombelData}
                    endpoint={"/import/absensi-siswa/"}
                    rombel_peserta_id={rombel_peserta_id}
                    rombel={rombel}
                    jadwalUjian={jadwalUjian}
                  />
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    onClick={handleClickDownloadBeritaAcara}
                    data-joyride="button-rekap-nilai"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Berita Acara Ujian
                  </button>
                </div>
                {/* <div className="dropdown dropdown-ss d-flex flex-column">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-joyride="button-buat-jadwal"
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Jadwal
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianRemedial"
                      >
                        <span>Remedial</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianSusulan"
                      >
                        <span>Susulan</span>
                      </a>
                    </li>
                  </ul>
                </div> */}
              </>
            ),
          },
        ]}
      />
    </>
  );

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      target: '[data-joyride="detail-info-ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Informasi Ujian</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat melihat informasi singkat mengenai kegiatan ujian.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="mengawas"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengawas Ujian ?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk mengawas ujian secara tatap muka.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Siswa Ujian</h5>
          <p className="color-secondary fw-semibold">
            Berisikan daftar siswa yang mengikuti ujian, klik pada menu jika
            anda ingin melihat daftar siswa yang mengikuti ujian.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="remedial"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Siswa Remedial</h5>
          <p className="color-secondary fw-semibold">
            Berisikan daftar siswa yang remedial, klik pada menu jika anda ingin
            melihat daftar siswa yang remedial.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="susulan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Siswa Susulan</h5>
          <p className="color-secondary fw-semibold">
            Berisikan daftar siswa yang susulan, klik pada menu jika anda ingin
            melihat daftar siswa yang susulan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="button-rekap-nilai"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rekap Nilai Ujian</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat merekap nilai ujian siswa menjadi file excel. Tekan
            tombol untuk merekap nilai ujian siswa.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="button-buat-jadwal"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambahkan Jadwal Remedial atau Susulan?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol apabila anda ingin menambahkan jadwal ujian baru untuk
            melakukan remedial ataupun susulan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="button-buat-jadwal"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Filter Kelas</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengganti kelas untuk dimonitoring.
          </p>
        </div>
      ),
    },
  ];

  if (nav == "ujian" || nav == undefined) {
    return (
      <Layout
        isFluid
        modalWrapper={
          <>
            <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
            <ModalStep
              buttonSubmit={
                <ReactiveButton
                  buttonState={"idle"}
                  color={"primary"}
                  idleText={"Buat Jadwal Ujian"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  data-bs-dismiss="modal"
                  className={"btn btn-primary"}
                />
              }
              isNext={true}
              modalId="modalBuatJadwalUjianRemedial"
              title={
                <>
                  <h4 className="mb-1 fw-extrabold">
                    Buat Jadwal Ujian Remedial
                  </h4>
                </>
              }
              current={current}
              next={next}
              prev={prev}
              steps={[
                {
                  title: "Pilih Daftar Ujian",
                  content: (
                    <>
                      <div className="mt-4 mb-3">
                        <label className="form-label">Daftar Ujian</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          placeholder="Pilih daftar ujian yang akan diujikan"
                        >
                          <option hidden>
                            Pilih daftar ujian yang akan diujikan{" "}
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas X
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas XI
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas XII
                          </option>
                        </select>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-md-0 mb-3">
                          <label className="form-label">Jumlah Soal PG </label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="0 Soal"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Jumlah Soal Esai</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="0 Soal"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jumlah Semua </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0 Soal"
                        />
                      </div>
                      <div className="mb-3">
                        <h6 className="fs-18-ss fw-bold color-dark mb-3">
                          Acak Soal
                        </h6>
                        <div className="row">
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio position-absolute"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioYa"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                            />
                            <label
                              className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioYa"
                            >
                              <span className="ms-4 ps-2">Ya</span>
                            </label>
                          </div>
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioTidak"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                            />
                            <label
                              className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioTidak"
                            >
                              <span className="ms-4 ps-2">Tidak</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"} </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0"
                        />
                      </div>
                    </>
                  ),
                },
                {
                  title: "Atur Waktu Ujian",
                  content: (
                    <>
                      <div className="mt-4 mb-3">
                        <label
                          htmlFor="example-date-input"
                          className="form-label"
                        >
                          Tanggal
                        </label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          type="date"
                          id="example-date-input"
                          placeholder="dd / mm / yyyy"
                        />
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-md-0 mb-3">
                          <label className="form-label">Waktu Dibuka </label>
                          <input
                            type="time"
                            className="form-control"
                            autoComplete="off"
                            // placeholder="0Soal"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Durasi</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan waktu dalam menit"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                          <label className="form-label mb-0">
                            Link Google Meet
                          </label>
                          <a
                            href="https://meet.google.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="py-1 px-3 bg-soft-primary rounded-pill fs-12-ss color-primary text-decoration-none fw-semibold"
                          >
                            <FaLink className="me-2" />
                            Ambil Link Google Meet
                          </a>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          id="exampleFormControlInput1"
                          placeholder="Tempel link Google Meet disini"
                        />
                      </div>
                      <div className="mb-3">
                        <h6 className="fs-18-ss fw-bold color-dark mb-3">
                          Pilih Kelas
                        </h6>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII KGSP 1 (1)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 3 (3)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII KGSP 2 (3)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEDK 1 (4)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 1 (5)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEDK 2 (1)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 2 (6)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEMPO 1 (1)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ),
                },
              ]}
            />
            <ModalStep
              buttonSubmit={
                <ReactiveButton
                  buttonState={"idle"}
                  color={"primary"}
                  idleText={"Buat Jadwal Ujian"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  data-bs-dismiss="modal"
                  className={"btn btn-primary"}
                />
              }
              isNext={true}
              modalId="modalBuatJadwalUjianSusulan"
              title={
                <>
                  <h4 className="mb-1 fw-extrabold">
                    Buat Jadwal Ujian Susulan
                  </h4>
                </>
              }
              current={current}
              next={next}
              prev={prev}
              steps={[
                {
                  title: "Pilih Daftar Ujian",
                  content: (
                    <>
                      <div className="mt-4 mb-3">
                        <label className="form-label">Daftar Ujian</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          placeholder="Pilih daftar ujian yang akan diujikan"
                        >
                          <option hidden>
                            Pilih daftar ujian yang akan diujikan{" "}
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas X
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas XI
                          </option>
                          <option>
                            P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas XII
                          </option>
                        </select>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-md-0 mb-3">
                          <label className="form-label">Jumlah Soal PG </label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="0 Soal"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Jumlah Soal Esai</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="0 Soal"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jumlah Semua </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0 Soal"
                        />
                      </div>
                      <div className="mb-3">
                        <h6 className="fs-18-ss fw-bold color-dark mb-3">
                          Acak Soal
                        </h6>
                        <div className="row">
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio position-absolute"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioYa"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                            />
                            <label
                              className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioYa"
                            >
                              <span className="ms-4 ps-2">Ya</span>
                            </label>
                          </div>
                          <div className="form-check-ss col-md-6 position-relative">
                            <input
                              className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                              type="radio"
                              name="flexRadioDefault"
                              id="radioTidak"
                              style={{
                                top: "36%",
                                left: "2em",
                                // height: "20px",
                              }}
                            />
                            <label
                              className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                              htmlFor="radioTidak"
                            >
                              <span className="ms-4 ps-2">Tidak</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"} </label>
                        <input
                          type="number"
                          className="form-control"
                          autoComplete="off"
                          placeholder="0"
                        />
                      </div>
                    </>
                  ),
                },
                {
                  title: "Atur Waktu Ujian",
                  content: (
                    <>
                      <div className="mt-4 mb-3">
                        <label
                          htmlFor="example-date-input"
                          className="form-label"
                        >
                          Tanggal
                        </label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          type="date"
                          id="example-date-input"
                          placeholder="dd / mm / yyyy"
                        />
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6 mb-md-0 mb-3">
                          <label className="form-label">Waktu Dibuka </label>
                          <input
                            type="time"
                            className="form-control"
                            autoComplete="off"
                            // placeholder="0Soal"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Durasi</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan waktu dalam menit"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                          <label className="form-label mb-0">
                            Link Google Meet
                          </label>
                          <a
                            href="https://meet.google.com/"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="py-1 px-3 bg-soft-primary rounded-pill fs-12-ss color-primary text-decoration-none fw-semibold"
                          >
                            <FaLink className="me-2" />
                            Ambil Link Google Meet
                          </a>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          id="exampleFormControlInput1"
                          placeholder="Tempel link Google Meet disini"
                        />
                      </div>
                      <div className="mb-3">
                        <h6 className="fs-18-ss fw-bold color-dark mb-3">
                          Pilih Kelas
                        </h6>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII KGSP 1 (1)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 3 (3)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII KGSP 2 (3)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEDK 1 (4)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 1 (5)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEDK 2 (1)
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-4 col-6">
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TFLM 2 (6)
                              </label>
                            </div>
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label
                                className="form-check-label fs-14-ss fw-semibold"
                                htmlFor="flexCheckDefault"
                              >
                                XII TEMPO 1 (1)
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ),
                },
              ]}
            />
          </>
        }
      >
        <MyJoyride steps={steps} />
        <AnimatePage>
          <div className="row">
            {/* Header Jadwal Ujian Detail End */}
            <div className="col-md-12">
              <Link href={`${ssURL}/jadwal-ujian/`}>
                <a
                  className="text-decoration-none fw-bolder position-relative color-primary pointer"
                  data-joyride="button-kembali"
                >
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>

              <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
                {/* Card Label & Option Start */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Jadwal Ujian Label Start */}

                  <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                    {jadwalUjian?.ujian?.tipeFormat}
                  </div>

                  {/* Jadwal Ujian Label End */}

                  {/* Dropdown Option Start */}

                  <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                    {/* <div
                      role="button"
                      id="dropdownOption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                        data-joyride="dropdown"
                    >
                      <img
                        src={`/img/icon-dropdown-option.svg`}
                        alt="icon-option"
                      />
                    </div> */}
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownOption"
                    >
                      <li>
                        <a className="dropdown-item">
                          <FaPen className="me-2" />
                          <span>Edit</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item color-danger">
                          <FaTrashAlt className="me-2" />
                          <span>Hapus</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Dropdown Option End */}
                </div>
                {/* Card Label & Option End */}
                {/* Jadwal Ujian Title Start */}
                <div className="w-75 text-break" data-joyride="title-ujian">
                  <h2 className="color-dark fw-black mb-4">
                    {jadwalUjian?.ujian?.nama}
                  </h2>
                </div>
                {/* Jadwal Ujian Title End */}
                {/* Jadwal Ujian Info Start */}
                <div className="row mt-4">
                  <div
                    className="col-md-9 pe-2"
                    data-joyride="detail-info-ujian"
                  >
                    <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {jadwalUjian?.soal} Soal
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {jadwalUjian?.kkm} Poin
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Durasi</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {jadwalUjian?.durasi} Menit
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Tanggal</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {jadwalUjian?.tanggalUjian}
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Waktu</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {jadwalUjian?.waktuUjian}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 ps-2" data-joyride="mengawas">
                    <a
                      href={jadwalUjian?.gmeet}
                      className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100"
                    >
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-tatap-muka.svg`}
                          alt="icon-tatap-muka"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Mengawas
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Jadwal Ujian Info End */}
              </div>
            </div>
            {/* Header Jadwal Ujian Detail End */}

            {/* Nav Jadwal Ujian Detail Start */}
            <div className="col-md-12">
              <NavJadwalUjianDetail />
            </div>
            {/* Nav Jadwal Ujian Detail End */}

            {/* Tabel Streaming Ujian Start*/}

            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Peserta{" "}
                    {!rombel_peserta_id ? "Semua Siswa" : rombel?.nama}
                  </h4>
                  <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-4 mb-sm-0 mb-3"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari Nama Siswa"
                    />

                    <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column me-4">
                      <button
                        className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold`}
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-joyride="btn-filter-kelas"
                      >
                        {!rombel_peserta_id ? "Semua Siswa" : rombel?.nama}
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-ss my-1"
                        aria-labelledby="dropdownMenuLink"
                      >
                        {/* <li>
                          <a href={`${ssURL}/jadwal-ujian/${id}`}>
                            <a className="dropdown-item">Pilih Semua Siswa</a>
                          </a>
                        </li> */}
                        {jadwalUjian?.rombelUjian?.map((rombelUjian, idx) => {
                          return (
                            <li key={`${idx}-${new Date().getTime()}`}>
                              <a
                                href={`${ssURL}/jadwal-ujian/${id}?rombel_peserta_id=${rombelUjian?.id}`}
                              >
                                <a className="dropdown-item">
                                  {rombelUjian?.rombel?.nama}
                                </a>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {momentPackage(jadwalUjian?.waktuDitutup).toDate() <
                    momentPackage().toDate() ? (
                      <button
                        className="btn btn-ss btn-primary btn-primary-ss rounded-pill shadow-primary-ss fs-12-ss fw-bold"
                        onClick={handleUpdateNilai}
                      >
                        Refresh Nilai
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="card-body px-0 pb-4 pt-0">
                  <div className=" table-stream-ujian">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th className="text-md-center">Mulai</th>
                          <th className="text-md-center">Selesai</th>
                          <th className="text-md-center">Progres</th>
                          <th
                            className="text-md-center pointer"
                            onClick={() => setStatusSort(!statusSort)}
                          >
                            Status
                            {statusSort == 0 ? (
                              <FaChevronDown className="ms-2" />
                            ) : (
                              <FaChevronUp className="ms-2" />
                            )}
                          </th>
                          <th
                            className="text-md-center pointer"
                            onClick={() => setSortNilai(!sortNilai)}
                          >
                            Nilai{" "}
                            {sortNilai == 0 ? (
                              <FaChevronDown className="ms-2" />
                            ) : (
                              <FaChevronUp className="ms-2" />
                            )}
                          </th>
                          <th
                            className="text-md-center pointer"
                            onClick={() => setSortKeluarTab(!sortKeluarTab)}
                          >
                            Keluar Tab
                            {sortKeluarTab == 0 ? (
                              <FaChevronDown className="ms-2" />
                            ) : (
                              <FaChevronUp className="ms-2" />
                            )}
                          </th>
                          <th className="text-md-center">Hasil</th>
                          <th className="text-md-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tablePesertaData(
                          pesertaUjian?.sort((a, b) =>
                            ("" + a?.nama).localeCompare(b?.nama)
                          ),
                          jadwalUjian,
                          jadwalUjianRef,
                          search,
                          statusSort,
                          sortKeluarTab,
                          sortNilai
                        )
                          ?.filter((e) => e?.dihapus == 0)
                          ?.map((peserta, idx) => {
                            const siswaRef = jadwalUjianRef.find(
                              (x) => x?.user_id === peserta?.id
                            );
                            // console.log({
                            //   jam: momentPackage(jadwalUjian?.waktuDitutup),
                            //   jem: momentPackage(),
                            // });
                            const pesertaUjian = peserta?.pesertaUjian?.[0];
                            // console.log(siswaRef);
                            // console.log(pesertaUjian);

                            // getKeluarTabSiswa(siswaRef);

                            return (
                              <tr key={`${idx}-${new Date().getTime()}`}>
                                <td>{idx + 1}</td>
                                <td data-th="Nama">
                                  {peserta?.nama}{" "}
                                  <div className="fw-bold">
                                    {!rombel_peserta_id
                                      ? peserta?.anggotaRombel?.rombel?.nama
                                      : ""}
                                  </div>
                                </td>
                                <td data-th="Mulai" className="text-md-center">
                                  {momentPackage(jadwalUjian?.waktuDitutup) <=
                                    momentPackage() && pesertaUjian?.id
                                    ? momentPackage(
                                        pesertaUjian?.waktuMulai
                                      ).format("HH:mm:ss")
                                    : siswaRef?.waktu_mulai && pesertaUjian?.id
                                    ? momentPackage(
                                        siswaRef?.waktu_mulai
                                      ).format("HH:mm:ss")
                                    : "-"}
                                  {}
                                </td>
                                <td
                                  data-th="Selesai"
                                  className="text-md-center"
                                >
                                  {momentPackage(jadwalUjian?.waktuDitutup) <=
                                    momentPackage() && pesertaUjian?.id
                                    ? momentPackage(
                                        pesertaUjian?.waktuSelesai
                                          ? pesertaUjian?.waktuSelesai
                                          : jadwalUjian?.waktuDitutup
                                      ).format("HH:mm:ss")
                                    : siswaRef?.waktu_selesai == undefined ||
                                      !pesertaUjian?.id
                                    ? "-"
                                    : momentPackage(
                                        siswaRef?.waktu_selesai
                                      ).format("HH:mm:ss")}
                                </td>
                                <td
                                  data-th="Progres"
                                  className="text-md-center"
                                >
                                  <div
                                    className="progress rounded-pill bg-light-secondary pointer mx-md-auto"
                                    style={{
                                      width: "100px",
                                      height: "10px",
                                    }}
                                    dataBsToogle={"tooltip"}
                                    dataBsPlacement={"bottom"}
                                    title={`${
                                      siswaRef?.progress == undefined ||
                                      !pesertaUjian?.id
                                        ? 0
                                        : siswaRef?.progress
                                    } / ${jadwalUjian?.jumlahSoal}`}
                                  >
                                    <div
                                      className="progress-bar bg-primary"
                                      role="progressbar"
                                      style={{
                                        width:
                                          (100 / jadwalUjian?.jumlahSoal) *
                                          (pesertaUjian?.id
                                            ? siswaRef?.progress
                                            : 0),
                                      }}
                                      // ariaValueNow={"75"}
                                      ariaValueMin={"0"}
                                      ariaValueMax={"100"}
                                    ></div>
                                  </div>
                                </td>
                                <td data-th="Status" className="text-md-center">
                                  {getStatusPengerjaan(
                                    jadwalUjian,
                                    jadwalUjianRef,
                                    peserta
                                  )}
                                </td>
                                {/* Nilai Peserta Ujian */}
                                <td data-th="Nilai" className="text-md-center">
                                  <span className="fw-bold">
                                    {pesertaUjian?.nilai}
                                  </span>
                                </td>
                                <td
                                  data-th="Keluar Tab"
                                  className="text-md-center"
                                >
                                  <span className="fw-bold">
                                    {momentPackage(jadwalUjian?.waktuDitutup) <=
                                    momentPackage()
                                      ? pesertaUjian?.warning
                                      : siswaRef?.user_id
                                      ? siswaRef?.warning || 0
                                      : ""}
                                  </span>
                                </td>
                                {/* Nilai Peserta Ujian END */}
                                <td data-th="Nilai" className="text-md-center">
                                  {(siswaRef?.waktu_mulai != undefined && pesertaUjian?.id) ||
                                  (momentPackage(jadwalUjian?.waktuDitutup) <= momentPackage() && siswaRef?.waktu_mulai) ||
                                  ((momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") <
                                        momentPackage().format("YYYY-MM-DD HH:mm:ss") ||
                                        jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_selesai !=
                                          undefined) &&
                                        jadwalUjianRef.find((x) => x?.user_id === peserta?.id)?.waktu_mulai !=
                                          undefined &&
                                        peserta?.pesertaUjian?.[0]?.id) ||
                                      (momentPackage(jadwalUjian?.waktuDitutup).format("YYYY-MM-DD HH:mm:ss") <
                                        momentPackage().format("YYYY-MM-DD HH:mm:ss") &&
                                        peserta?.pesertaUjian?.[0]?.id) ? (
                                    <Link
                                      href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                                      as={`${ssURL}/peserta-ujian/${pesertaUjian?.id}?subnav=detail-jawaban`}
                                    >
                                      <button
                                        className={`btn btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4`}
                                      >
                                        Detail
                                      </button>
                                    </Link>
                                  ) : (
                                    <WhatsappLink
                                      phoneNumber={peserta?.whatsapp}
                                      text={`Halo nak ${peserta?.nama}, ujian sudah dimulai. Segera bergabung yaa, terimakasih`}
                                    >
                                      <button className="btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center fs-14-ss py-1 px-4 mx-md-auto">
                                        Hubungi Siswa
                                      </button>
                                    </WhatsappLink>
                                  )}
                                </td>
                                <td data-th="Aksi" className="text-md-center">
                                  {pesertaUjian?.id ? (
                                    <div className="dropdown dropdown-ss">
                                      <button
                                        className={`btn btn-outline-primary btn-outline-primary-ss rounded-pill fs-14-ss py-1 px-4`}
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        Opsi
                                        <Badge
                                          count={parseInt(
                                            pesertaUjian?.meta?.belumDibaca
                                          )}
                                          className="position-absolute"
                                          style={{
                                            top: "-15px",
                                            right: "-10px",
                                          }}
                                        />
                                      </button>
                                      <ul
                                        className="dropdown-menu dropdown-menu-ss my-1"
                                        aria-labelledby="dropdownMenuLink"
                                      >
                                        <li
                                          onClick={() =>
                                            handleResetUjian(
                                              pesertaUjian?.id,
                                              1
                                            )
                                          }
                                        >
                                          <a className="dropdown-item">
                                            Ulangi Ujian
                                          </a>
                                        </li>
                                        {(momentPackage(
                                          jadwalUjian?.waktuDitutup
                                        ).format("YYYY-MM-DD HH:mm:ss") <
                                          momentPackage().format(
                                            "YYYY-MM-DD HH:mm:ss"
                                          ) ||
                                          siswaRef?.waktu_selesai !=
                                            undefined) &&
                                        siswaRef?.waktu_mulai != undefined ? (
                                          <li
                                            onClick={() =>
                                              handleResetUjian(
                                                pesertaUjian?.id,
                                                0
                                              )
                                            }
                                          >
                                            <a className="dropdown-item">
                                              Lanjutkan Ujian
                                            </a>
                                          </li>
                                        ) : null}
                                        <li>
                                          <WhatsappLink
                                            phoneNumber={peserta?.whatsapp}
                                            text={`Halo nak ${peserta?.nama},`}
                                          >
                                            <a className="dropdown-item">
                                              Hubungi Siswa
                                            </a>
                                            {/* <button className="btn btn-outline-secondary rounded-pill d-flex justify-content-center align-items-center fs-14-ss py-1 px-4 mx-md-auto">
                                            Hubungi Siswa
                                          </button> */}
                                          </WhatsappLink>
                                        </li>
                                        <li
                                        // onClick={() =>
                                        //   showModal("ModalTambahPeringatan")
                                        // }
                                        >
                                          <a
                                            className="dropdown-item"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalTambahPeringatan"
                                            onClick={() =>
                                              handleClickDataPeserta(
                                                peserta?.pesertaUjian?.[0]
                                              )
                                            }
                                          >
                                            Peringati Siswa
                                          </a>
                                        </li>
                                        <li>
                                          <a
                                            className="dropdown-item"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalHistoryPeringatan"
                                            onClick={() =>
                                              handleClickPeringatan(
                                                peserta?.pesertaUjian?.[0]
                                                  ?.peringatan
                                              )
                                            }
                                          >
                                            Histori Peringatan
                                          </a>
                                        </li>
                                        {pesertaUjian?.block == 1 ? (
                                          <li>
                                            <a
                                              className="dropdown-item"
                                              onClick={() =>
                                                handleUnblockUjian(
                                                  pesertaUjian?.id,
                                                  0
                                                )
                                              }
                                            >
                                              Batalkan Block Ujian
                                            </a>
                                          </li>
                                        ) : (
                                          <li>
                                            <a
                                              className="dropdown-item"
                                              onClick={() =>
                                                handleBlockUjian(
                                                  pesertaUjian?.id,
                                                  1
                                                )
                                              }
                                            >
                                              Block Ujian
                                            </a>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  ) : null}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Streaming Ujian End*/}
          </div>
          <ModalTambahPeringatan dataPeserta={dataPeserta} />
          <ModalHistoryPeringatan
            peringatan={peringatan}
            getDetailJadwalUjianData={getDetailJadwalUjianData}
          />
        </AnimatePage>
      </Layout>
    );
  } else if (nav == "remedial") {
    return (
      <Layout
        modalWrapper={
          <>
            <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
          </>
        }
      >
        <AnimatePage>
          <div className="row">
            {/* Header Jadwal Ujian Detail End */}
            <div className="col-md-12">
              <Link href={`${ssURL}/jadwal-ujian/`}>
                <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>

              <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
                {/* Card Label & Option Start */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Jadwal Ujian Label Start */}

                  <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                    Penilaian Akhir Semester 1
                  </div>

                  {/* Jadwal Ujian Label End */}

                  {/* Dropdown Option Start */}

                  <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                    {/* <div
                      role="button"
                      id="dropdownOption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`/img/icon-dropdown-option.svg`}
                        alt="icon-option"
                      />
                    </div> */}
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownOption"
                    >
                      <li>
                        <a className="dropdown-item">
                          <FaPen className="me-2" />
                          <span>Edit</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item color-danger">
                          <FaTrashAlt className="me-2" />
                          <span>Hapus</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Dropdown Option End */}
                </div>
                {/* Card Label & Option End */}
                {/* Jadwal Ujian Title Start */}
                <div className="w-75 text-break">
                  <h2 className="color-dark fw-black mb-4">
                    P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas X
                  </h2>
                </div>
                {/* Jadwal Ujian Title End */}
                {/* Jadwal Ujian Info Start */}
                <div className="row mt-4">
                  <div className="col-md-9 pe-2">
                    <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          40 Soal
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          75 Poin
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Durasi</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          90 Menit
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Tanggal</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          Jum'at, 4 Des 2020
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Waktu</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          07:00 - 09:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 ps-2">
                    <div className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100">
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-tatap-muka.svg`}
                          alt="icon-tatap-muka"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Mengawas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jadwal Ujian Info End */}
              </div>
            </div>
            {/* Header Jadwal Ujian Detail End */}

            {/* Nav Jadwal Ujian Detail Start */}
            <div className="col-md-12">
              <NavJadwalUjianDetail />
            </div>
            {/* Nav Jadwal Ujian Detail End */}

            {/* Tabel Streaming Ujian Start*/}

            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4 d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold m-0 color-dark mb-sm-0 mb-4">
                    Daftar Peserta
                  </h4>
                  <div className="d-flex justify-content-sm-start justify-content-between">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-4"
                      id="exampleFormControlInput1"
                      placeholder="Cari Nama Siswa"
                    />
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
                        <li>
                          <a className="dropdown-item">Semua</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X SIJA 1</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X SIJA 2</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X KGSP 1</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X KGSP 2</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body px-0 pb-4 pt-0">
                  <div className="table-responsive table-stream-ujian">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Mulai</th>
                          <th>Selesai</th>
                          <th>Progres</th>
                          <th>Status</th>
                          <th>Nilai</th>
                          <th>Hasil</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Lorem Ipsum Dolor.</td>
                          <td>07 : 00 : 00</td>
                          <td>09 : 00 : 00</td>
                          <td>
                            <div
                              className="progress rounded-pill bg-light-secondary pointer"
                              style={{
                                width: "100px",
                                height: "10px",
                              }}
                              dataBsToogle={"tooltip"}
                              dataBsPlacement={"bottom"}
                              title={"40 / 40"}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                  width: "100%",
                                }}
                                ariaValueNow={"100"}
                                ariaValueMin={"0"}
                                ariaValueMax={"100"}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="label-ss bg-soft-success color-success rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center">
                              Selesai
                            </div>
                          </td>
                          <td>
                            <span className="color-danger fw-bold">70</span>
                          </td>
                          <td>
                            <Link
                              href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                              as={`${ssURL}/peserta-ujian/${id}?subnav=detail-jawaban`}
                            >
                              <a className=" text-decoration-none">
                                <button className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4">
                                  Detail
                                </button>
                              </a>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Lorem Ipsum Dolor.</td>
                          <td>07 : 00 : 00</td>
                          <td>09 : 00 : 00</td>
                          <td>
                            <div
                              className="progress rounded-pill bg-light-secondary pointer"
                              style={{
                                width: "100px",
                                height: "10px",
                              }}
                              dataBsToogle={"tooltip"}
                              dataBsPlacement={"bottom"}
                              title={"40 / 40"}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                  width: "100%",
                                }}
                                ariaValueNow={"100"}
                                ariaValueMin={"0"}
                                ariaValueMax={"100"}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="label-ss bg-soft-success color-success rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center">
                              Selesai
                            </div>
                          </td>
                          <td>
                            <span className="color-danger fw-bold">70</span>
                          </td>
                          <td>
                            <Link
                              href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                              as={`${ssURL}/peserta-ujian/${id}?subnav=detail-jawaban`}
                            >
                              <a className=" text-decoration-none">
                                <button className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4">
                                  Detail
                                </button>
                              </a>
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>Lorem Ipsum Dolor.</td>
                          <td>07 : 00 : 00</td>
                          <td>09 : 00 : 00</td>
                          <td>
                            <div
                              className="progress rounded-pill bg-light-secondary pointer"
                              style={{
                                width: "100px",
                                height: "10px",
                              }}
                              dataBsToogle={"tooltip"}
                              dataBsPlacement={"bottom"}
                              title={"40 / 40"}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                  width: "100%",
                                }}
                                ariaValueNow={"100"}
                                ariaValueMin={"0"}
                                ariaValueMax={"100"}
                              ></div>
                            </div>
                          </td>
                          <td>
                            <div className="label-ss bg-soft-success color-success rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center">
                              Selesai
                            </div>
                          </td>
                          <td>
                            <span className="color-danger fw-bold">70</span>
                          </td>
                          <td>
                            <Link
                              href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                              as={`${ssURL}/peserta-ujian/${id}?subnav=detail-jawaban`}
                            >
                              <a className=" text-decoration-none">
                                <button className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4">
                                  Detail
                                </button>
                              </a>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel Streaming Ujian End*/}
          </div>
          {/* <ModalTambahPeringatan /> */}
        </AnimatePage>
      </Layout>
    );
  } else if (nav == "susulan") {
    return (
      <Layout>
        <AnimatePage>
          {/* <ModalTambahPeringatan /> */}

          <div className="row">
            {/* Header Jadwal Ujian Detail End */}
            <div className="col-md-12">
              <Link href={`${ssURL}/jadwal-ujian/`}>
                <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>

              <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
                {/* Card Label & Option Start */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {/* Jadwal Ujian Label Start */}

                  <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                    Penilaian Akhir Semester 1
                  </div>

                  {/* Jadwal Ujian Label End */}

                  {/* Dropdown Option Start */}

                  <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                    {/* <div
                      role="button"
                      id="dropdownOption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`/img/icon-dropdown-option.svg`}
                        alt="icon-option"
                      />
                    </div> */}
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownOption"
                    >
                      <li>
                        <a className="dropdown-item">
                          <FaPen className="me-2" />
                          <span>Edit</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item color-danger">
                          <FaTrashAlt className="me-2" />
                          <span>Hapus</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {/* Dropdown Option End */}
                </div>
                {/* Card Label & Option End */}
                {/* Jadwal Ujian Title Start */}
                <div className="w-75 text-break">
                  <h2 className="color-dark fw-black mb-4">
                    P.A.S - BAHASA INDONESIA RAYON JT-1 Kelas X
                  </h2>
                </div>
                {/* Jadwal Ujian Title End */}
                {/* Jadwal Ujian Info Start */}
                <div className="row mt-4">
                  <div className="col-md-9 pe-2">
                    <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          40 Soal
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          75 Poin
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Durasi</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          90 Menit
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Tanggal</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          Jum'at, 4 Des 2020
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Waktu</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          07:00 - 09:00 AM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 ps-2">
                    <div className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100">
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-tatap-muka.svg`}
                          alt="icon-tatap-muka"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Mengawas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jadwal Ujian Info End */}
              </div>
            </div>
            {/* Header Jadwal Ujian Detail End */}

            {/* Nav Jadwal Ujian Detail Start */}
            <div className="col-md-12">
              <NavJadwalUjianDetail />
            </div>
            {/* Nav Jadwal Ujian Detail End */}

            {/* Tabel Streaming Ujian Start*/}

            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4 d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold m-0 color-dark mb-sm-0 mb-4">
                    Daftar Peserta
                  </h4>
                  <div className="d-flex justify-content-sm-start justify-content-between">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-4"
                      id="exampleFormControlInput1"
                      placeholder="Cari Nama Siswa"
                    />
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
                        <li>
                          <a className="dropdown-item">Semua</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X SIJA 1</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X SIJA 2</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X KGSP 1</a>
                        </li>
                        <li>
                          <a className="dropdown-item">X KGSP 2</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body px-0 pb-4 pt-0">
                  <div className="table-responsive table-stream-ujian">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Mulai</th>
                          <th>Selesai</th>
                          <th>Progres</th>
                          <th>Status</th>
                          <th>Nilai</th>
                          <th>Hasil</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Lorem Ipsum Dolor.</td>
                          <td></td>
                          <td></td>
                          <td>
                            {/* <div
                              className="progress rounded-pill bg-light-secondary pointer"
                              style={{
                                width: "100px",
                                height: "10px",
                              }}
                              dataBsToogle={"tooltip"}
                              dataBsPlacement={"bottom"}
                              title={"0 / 0"}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                  width: "0",
                                }}
                                ariaValueNow={"0"}
                                ariaValueMin={"0"}
                                ariaValueMax={"100"}
                              ></div>
                            </div> */}
                          </td>
                          <td></td>
                          <td>
                            <span className="fw-bold"></span>
                          </td>
                          <td>
                            {/* <button
                              className="btn btn-secondary btn-secondary btn-secondary-disable-ss shadow-secondary-ss rounded-pill fs-14-ss py-1 px-4"
                              disabled
                            >
                              Detail
                            </button> */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Tabel Streaming Ujian End*/}
          </div>
        </AnimatePage>
      </Layout>
    );
  }
};

export async function getServerSideProps({
  params: { id },
  query: { rombel_peserta_id },
}) {
  return {
    props: {
      id,
      rombel_peserta_id: rombel_peserta_id || null,
    },
  };
}

export default index;
