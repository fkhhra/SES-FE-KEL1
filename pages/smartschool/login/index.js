import { motion } from "framer-motion";
import Link from "next/link";

import AuthLayout from "../../../components/Layout/AuthLayout";
import { baseURL, ssURL } from "../../../client/clientAxios";
import { FaGlobe, FaInfo, FaWhatsapp } from "react-icons/fa";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import { useEffect, useState } from "react";
import { meSekolah } from "../../../client/SekolahClient";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Swal = withReactContent(swal);

const index = () => {
  const [meSekolahData, setMeSekolahData] = useState({});
  const { sekolah } = meSekolahData;

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setMeSekolahData(data);
    }
  };

  useEffect(() => {
    getMeSekolahData();
  }, []);

  const initialState = {
    nama: "",
    nama2: "",
    nama3: "",
    jabatan: "",
    jabatan2: "",
    jabatan3: "",
    noWhatsapp: "",
    noWhatsapp2: "",
    noWhatsapp3: "",
    namaSekolah: "",
    alamatSekolah: "",
    hariPresentasi: "",
    sesiPresentasi: "",
  };

  const [stateForm, setStateForm] = useState(initialState);

  const handleChange = (e) => {
    setStateForm({ ...stateForm, [e.target.name]: e.target.value });
  };

  const handleClickSendWhatsapp = () => {
    if (!stateForm.nama) {
      toast.error("Kamu belum mengisi nama kamu");
      return;
    } else if (!stateForm.jabatan) {
      toast.error("Kamu belum mengisi jabatan kamu");
      return;
    } else if (!stateForm.namaSekolah) {
      toast.error("Kamu belum mengisi nama sekolah kamu");
      return;
    } else if (!stateForm.alamatSekolah) {
      toast.error("Kamu belum mengisi alamat sekolah kamu");
      return;
    }

    window.open(
      `https://api.whatsapp.com/send?phone=6281284538354&text=Halo, Saya ingin memiliki akun untuk mencoba sistem Simulasi Sekolah Online Virtual by Smartschool.%0ANama : ${stateForm.nama}%0AJabatan : ${stateForm.jabatan}%0ANama Sekolah : ${stateForm.namaSekolah}%0AAlamat Sekolah : ${stateForm.alamatSekolah}`
    );
  };

  const handleClickSendWhatsappPresentasiOnline = () => {
    if (!stateForm.nama) {
      toast.error("Kamu belum mengisi nama kamu");
      return;
    } else if (!stateForm.jabatan) {
      toast.error("Kamu belum mengisi jabatan kamu");
      return;
    } else if (!stateForm.namaSekolah) {
      toast.error("Kamu belum mengisi nama sekolah kamu");
      return;
    } else if (!stateForm.hariPresentasi) {
      toast.error("Kamu belum mengisi hari presentasi");
      return;
    } else if (!stateForm.sesiPresentasi) {
      toast.error("Kamu belum mengisi sesi presentasi");
      return;
    }

    window.open(
      `https://api.whatsapp.com/send?phone=6281284538354&text=Halo, Saya ingin mengikuti presentasi online Smartschool.%0A%0AHari : ${stateForm.hariPresentasi}%0ASesi : ${stateForm.sesiPresentasi}%0A%0ANama Sekolah : ${stateForm.namaSekolah}%0A%0APeserta 1%0ANama : ${stateForm.nama}%0AJabatan : ${stateForm.jabatan}%0ANomor Whatsapp : ${stateForm.noWhatsapp}%0A%0APeserta 2%0ANama : ${stateForm.nama2}%0AJabatan : ${stateForm.jabatan2}%0ANomor Whatsapp : ${stateForm.noWhatsapp2}%0A%0APeserta 3%0ANama : ${stateForm.nama3}%0AJabatan : ${stateForm.jabatan3}%0ANomor Whatsapp : ${stateForm.noWhatsapp3}`
    );
  };

  const steps = [
    {
      target: '[data-joyride="login-warga-sekolah"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Masuk Sebagai Warga Sekolah</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat masuk sebagai warga sekolah untuk masuk sebagai akun
            guru, siswa, dan juga manajemen sekolah.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="login-orang-tua"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Masuk Sebagai Orang Tua</h5>
          <p className="color-secondary fw-semibold">
            Jika anda ingin masuk sebagai akun orang tua anda pada menekan
            tombol "Saya Seorang Orang Tua".
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="info"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Info</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk mengetahui informasi mengenai Smartschool.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="web"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Website Informasi</h5>
          <p className="color-secondary fw-semibold">
            Ingin mengetahui lebih lanjut mengenai Smartschool ? Tekan tombol
            untuk mengunjungi website informasi Smartschool.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="whatsapp"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Kontak Kami</h5>
          <p className="color-secondary fw-semibold">
            Ingin mendaftar sekolah anda menjadi Smartschool atau ingin
            mendapatkan akun virtual ? Tekan tombol whatsapp untuk menghubungi
            kami via whatsapp.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="jadwal-presentasi-online"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jadwal Presentasi Online</h5>
          <p className="color-secondary fw-semibold">
            Ingin mengikuti presentasi online kami ? Silahkan reservasi sesuai
            jadwal untuk mengikuti presentasi online Smartschool.
          </p>
        </div>
      ),
    },
  ];

  return (
    <AuthLayout>
      {sekolah?.id == 5 ? (
        <>
          <MyJoyride steps={steps} />
          <div className="row justify-content-center">
            <div className="col-md-5 text-center">
              <img
                src={`/img/smarteschool-logo.png`}
                alt=""
                className="img-fluid mb-3"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h1 className="text-center fw-black color-dark mb-3 mt-5">
                  Selamat Datang
                </h1>
                <h5 className="text-center color-secondary fw-semibold mb-4">
                  Pilih akun untuk masuk
                </h5>
                <div className="row justify-content-center mb-4">
                  <div className="col-md-5">
                    <Link href={`${ssURL}/login/warga-sekolah`}>
                      <a
                        className="text-decoration-none mb-4"
                        data-joyride="login-warga-sekolah"
                      >
                        <div className="card-role card mb-4 pointer rounded-ss border-2">
                          <div className="card-body card-role-orang-tua p-4">
                            <div className="d-flex align-items-center">
                              <img
                                src="/img/icon-role-manajemen-sekolah.svg"
                                alt="icon-role-manajemen-sekolah"
                              />
                              <div className="ms-4 color-secondary">
                                <p className="mb-1 fs-14-ss">Saya Seorang</p>
                                <h5 className="m-0 fw-bold">
                                  Warga{" "}
                                  {sekolah?.tingkat == "kampus"
                                    ? "Kampus"
                                    : "Sekolah"}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="col-md-5">
                    <Link href={`${ssURL}/login/ortu`}>
                      <a
                        className="text-decoration-none mb-4"
                        data-joyride="login-orang-tua"
                      >
                        <div className="card-role card mb-4 pointer rounded-ss border-2">
                          <div className="card-body card-role-orang-tua p-4">
                            <div className="d-flex align-items-center">
                              <img
                                src="/img/icon-role-orang-tua.svg"
                                alt="icon-role-orang-tua"
                              />
                              <div className="ms-4 color-secondary">
                                <p className="mb-1 fs-14-ss">Saya Seorang</p>
                                <h5 className="m-0 fw-bold">Orang Tua</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                </div>
                <div
                  className="text-center my-4"
                  style={{
                    marginTop: "-32px",
                  }}
                >
                  <h5 className="text-center color-dark fw-semibold me-2">
                    <span className="text-uppercase color-primary fw-bold">
                      Gratis
                    </span>{" "}
                    untuk mencoba fitur warga sekolah.
                  </h5>
                  <h5 className="text-center color-dark fw-semibold mb-0 me-2">
                    Dengan cara {""}
                    <a
                      className="color-primary fs-5 text-center fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#modalDapatkanAkun"
                    >
                      whatsapp kami
                    </a>{" "}
                    untuk mendapatkan instan akun.
                  </h5>
                </div>
                <div className="row mb-4 justify-content-center">
                  <div className="col-md-6 d-flex justify-content-sm-between flex-sm-row flex-column">
                    <div
                      className="bg-primary shadow-primary-ss rounded-circle text-white d-flex align-items-center justify-content-center fs-1 btn btn-primary"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#modalPengertianSmartschool"
                      data-joyride="info"
                    >
                      <FaInfo />
                    </div>
                    <a
                      href="https://smarteschool.id/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <div
                        className="bg-primary shadow-primary-ss rounded-circle text-white d-flex align-items-center justify-content-center btn btn-primary"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                        data-joyride="web"
                      >
                        <FaGlobe
                          style={{
                            fontSize: "52px",
                          }}
                        />
                      </div>
                    </a>
                    <a
                      data-bs-toggle="modal"
                      data-bs-target="#modalDapatkanAkun"
                    >
                      <div
                        className="bg-primary shadow-primary-ss rounded-circle text-white d-flex align-items-center justify-content-center btn btn-primary"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                        data-joyride="whatsapp"
                      >
                        <FaWhatsapp
                          style={{
                            fontSize: "56px",
                          }}
                        />
                      </div>
                    </a>
                  </div>
                </div>{" "}
                <NewModal
                  modalId="modalPengertianSmartschool"
                  title={
                    <>
                      <h4 className="mb-0 fw-extrabold">Smartschool</h4>
                    </>
                  }
                  content={
                    <>
                      <h3 className="color-primary text-center mb-3 fw-extrabold">
                        Smart E School - Paperless School{" "}
                      </h3>
                      <h4 className="color-primary text-center mb-5 fw-bold">
                        Integrated Learning, Exam, Management and more{" "}
                      </h4>
                      <p className="color-dark text-center mb-3 fs-18-ss">
                        Sistim terintegrasi seluruh Proses Pembelajaran Daring
                        maupun Tatap Muka, Sekolah Tanpa Kertas.
                        Mengintegrasikan Manajemen Perpustakaan dan Materi
                        Pembelajaran dengan sistim Pengawasan kegiatan
                        belajar/Tugas siswa yang effektif serta terdata, dengan
                        Google Meet dan CCTV yang lebih effektif daripada Tatap
                        Muka. Sistim Ujian Berbasis Komputer yang dilengkapi
                        Kecerdasan Buatan untuk mengeffektifkan pendataan
                        kemandirian siswa/pengawasan ditambah sistim Manajemen
                        Nilai sampai fitur Pelaporan yang memudahkan Guru,
                        Manajemen Sekolah, Orang Tua Siswa dan Siswa memantau
                        data2 Belajar, Ujian serta Kegiatan terkait lainnya.
                      </p>
                    </>
                  }
                  submitButton={
                    <ReactiveButton
                      buttonState={"idle"}
                      color={"primary"}
                      idleText={"Tandai Sudah Dibaca"}
                      loadingText={"Diproses"}
                      successText={"Berhasil"}
                      errorText={"Gagal"}
                      type={"button"}
                      data-bs-dismiss="modal"
                      className={"btn btn-primary"}
                    />
                  }
                />
                <NewModal
                  modalId="modalDapatkanAkun"
                  title={
                    <>
                      <h4 className="mb-1 fw-extrabold">
                        Informasi Data Diri{" "}
                      </h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi untuk mendapatkan akun virtual secara
                        instan, berupa 1 akun guru dan 2 akun siswa.
                      </span>
                    </>
                  }
                  content={
                    <>
                      <div className="mb-4">
                        <label className="form-label">Nama</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama kamu disini"
                          type="text"
                          name="nama"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Jabatan</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama jabatan kamu di sekolahmu"
                          type="text"
                          name="jabatan"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Nama Sekolah</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama sekolahmu"
                          type="text"
                          name="namaSekolah"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Alamat Sekolah</label>
                        <TextareaAutosize
                          className="form-control"
                          autoComplete="off"
                          style={{
                            resize: "none",
                            width: "100%",
                          }}
                          placeholder="Tuliskan alamat sekolahmu"
                          minRows={3}
                          name="alamatSekolah"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </>
                  }
                  submitButton={
                    <button
                      onClick={handleClickSendWhatsapp}
                      className="btn btn-primary"
                    >
                      <FaWhatsapp className="fs-4 me-2" />
                      <span className="mt-2">Kirim</span>
                    </button>
                  }
                />
                <NewModal
                  modalId="modalInputJadwalPresentasiOnline"
                  title={
                    <>
                      <h4 className="mb-1 fw-extrabold">
                        Informasi Jadwal Presentasi
                      </h4>
                      <span className="fs-6 fw-normal">
                        Isi informasi dibawah untuk mengikuti presentasi online.
                      </span>
                    </>
                  }
                  content={
                    <>
                      <div className="mb-4">
                        <label className="form-label">Nama Sekolah</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama sekolahmu"
                          type="text"
                          name="namaSekolah"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Nama Peserta 1</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama kamu disini"
                          type="text"
                          name="nama"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Jabatan Peserta 1</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama jabatan kamu di sekolahmu"
                          type="text"
                          name="jabatan"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">
                          No Whatsapp Peserta 1
                        </label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nomor whatsapp yang bisa dihubungi"
                          type="text"
                          name="noWhatsapp"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Nama Peserta 2</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama kamu disini"
                          type="text"
                          name="nama2"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Jabatan Peserta 2</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama jabatan kamu di sekolahmu"
                          type="text"
                          name="jabatan2"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">
                          No Whatsapp Peserta 2
                        </label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nomor whatsapp yang bisa dihubungi"
                          type="text"
                          name="noWhatsapp2"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Nama Peserta 3</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama kamu disini"
                          type="text"
                          name="nama3"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Jabatan Peserta 3</label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nama jabatan kamu di sekolahmu"
                          type="text"
                          name="jabatan3"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">
                          No Whatsapp Peserta 3
                        </label>
                        <input
                          className="form-control"
                          autoComplete="off"
                          placeholder="Tuliskan nomor whatsapp yang bisa dihubungi"
                          type="text"
                          name="noWhatsapp3"
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Hari</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          placeholder="Pilih hari presentasi"
                          name="hariPresentasi"
                          // onChange={handleChangeForm}
                          onChange={(e) => handleChange(e)}
                        >
                          <option hidden>Pilih hari presentasi</option>
                          <option value="Selasa">Selasa</option>
                          <option value="Kamis">Kamis</option>
                        </select>
                      </div>
                      {/* <div className="mb-4">
                        <label className="form-label">Sesi</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          placeholder="Pilih sesi presentasi"
                          name="sesiPresentasi"
                          // onChange={handleChangeForm}
                          onChange={(e) => handleChange(e)}
                        >
                          <option hidden>Pilih sesi presentasi</option>
                          <option value="Sesi 1  09:00 - 10:00">
                            Sesi 1 09:00 - 10:00
                          </option>
                          <option value="Sesi 2  15:00 - 16:00">
                            Sesi 2 13:00 - 14:00
                          </option>
                          <option value="Sesi 3  19:00 - 20:00">
                            Sesi 3 16:00 - 17:00
                          </option>
                        </select>
                      </div> */}
                    </>
                  }
                  submitButton={
                    <button
                      onClick={handleClickSendWhatsappPresentasiOnline}
                      className="btn btn-primary"
                    >
                      <FaWhatsapp className="fs-4 me-2" />
                      <span className="mt-2">Kirim</span>
                    </button>
                  }
                />
              </motion.div>
            </div>
            {/* <div className="col-lg-7 d-none d-lg-block ps-5">
          <img
            src={`/img/ss-background.png`}
            alt="Smartschool"
            height="400"
            width="400"
            layout="responsive"
            objectFit="contain"
          />
        </div> */}
          </div>
        </>
      ) : (
        <>
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              {sekolah?.id == 8517 ||
              sekolah?.id == 8518 ||
              sekolah?.id == 8519 ||
              sekolah?.id == 8520 ? (
                <img src={sekolah?.logo} alt="" className="img-fluid mb-3" />
              ) : (
                <img
                  src={`/img/smarteschool-logo.png`}
                  alt=""
                  className="img-fluid mb-3"
                />
              )}
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h1 className="text-center fw-black color-dark mb-3 mt-5 mt">
                  Selamat Datang
                </h1>
                <h5 className="text-center color-secondary fw-semibold mb-4">
                  Pilih akun untuk masuk
                </h5>
                <div className="row justify-content-center mb-5">
                  <ul
                    className="switch-nav nav nav-pills d-flex justify-content-center p-2 rounded-pill position-relative"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li
                      className="nav-item position-relative"
                      role="presentation"
                    >
                      <a
                        className="nav-link active fs-14-ss fw-bold rounded-pill px-0 d-flex justify-content-center align-items-center"
                        id="pills-warga-sekolah-tab"
                        data-bs-toggle="pill"
                        href="#pills-warga-sekolah"
                        role="tab"
                        aria-controls="pills-warga-sekolah"
                        aria-selected="true"
                      >
                        Warga{" "}
                        {sekolah?.tingkat == "kampus" ? "Kampus" : "Sekolah"}
                      </a>
                      <div className="slider position-absolute rounded-pill bg-gradient-primary"></div>
                    </li>
                    <li
                      className="nav-item position-relative"
                      role="presentation"
                    >
                      <a
                        className="nav-link fs-14-ss fw-bold rounded-pill px-0 d-flex justify-content-center align-items-center"
                        id="pills-lainnya-tab"
                        data-bs-toggle="pill"
                        href="#pills-lainnya"
                        role="tab"
                        aria-controls="pills-lainnya"
                        aria-selected="false"
                      >
                        Lainnya
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-warga-sekolah"
                    role="tabpanel"
                    aria-labelledby="pills-warga-sekolah-tab"
                  >
                    <div className="row">
                      <div
                        className={`${
                          sekolah?.id == 8123 ? "col-lg-12" : "col-lg-6"
                        }`}
                      >
                        <Link href={`${ssURL}/login/kepsek`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-warga-sekolah p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-kepala-sekolah.svg"
                                    alt="icon-role-kepala-sekolah"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      {sekolah?.tingkat == "kampus"
                                        ? "Rektor"
                                        : "Kepala Sekolah"}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                        <Link href={`${ssURL}/login/admin`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-orang-tua p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-manajemen-sekolah.svg"
                                    alt="icon-role-manajemen-sekolah"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      Manajemen{" "}
                                      {sekolah?.tingkat == "kampus"
                                        ? "Kampus"
                                        : "Sekolah"}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                      {sekolah?.id != 8123 && (
                        <div className="col-lg-6">
                          <Link href={`${ssURL}/login/guru`}>
                            <a className="text-decoration-none mb-4">
                              <div className="card-role card mb-4 pointer rounded-ss border-2">
                                <div className="card-body card-role-warga-sekolah p-sm-4 p-3">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src="/img/icon-role-guru.svg"
                                      alt="icon-role-guru"
                                    />
                                    <div className="ms-sm-4 ms-3 color-secondary">
                                      <p className="mb-1 fs-14-ss">
                                        Saya Seorang
                                      </p>
                                      <h5 className="m-0 fw-bold sm-fs-6">
                                        {sekolah?.tingkat == "kampus"
                                          ? "Dosen"
                                          : "GTK"}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </Link>
                          <Link
                            href={
                              sekolah?.id == 8123
                                ? `${ssURL}/sman8jakarta`
                                : `${ssURL}/login/siswa`
                            }
                          >
                            <a className="text-decoration-none mb-4">
                              <div className="card-role card mb-4 pointer rounded-ss border-2">
                                <div className="card-body card-role-orang-tua p-sm-4 p-3">
                                  <div className="d-flex align-items-center">
                                    <img
                                      src="/img/icon-role-murid.svg"
                                      alt="icon-role-murid"
                                    />
                                    <div className="ms-sm-4 ms-3 color-secondary">
                                      <p className="mb-1 fs-14-ss">
                                        Saya Seorang
                                      </p>
                                      <h5 className="m-0 fw-bold sm-fs-6">
                                        {sekolah?.tingkat == "kampus"
                                          ? "Mahasiswa"
                                          : "Siswa"}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pills-lainnya"
                    role="tabpanel"
                    aria-labelledby="pills-lainnya-tab"
                  >
                    <div className="row">
                      <div className="col-lg-6">
                        <Link href={`${ssURL}/login/ortu`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-orang-tua p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-orang-tua.svg"
                                    alt="icon-role-orang-tua"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      Orang Tua
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                        <Link href={`${ssURL}/login/alumni`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-warga-sekolah p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-alumni.svg"
                                    alt="icon-role-alumni"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      Alumni
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                      <div className="col-lg-6">
                        <Link href={`${ssURL}/login/industri`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-warga-sekolah p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-industri.svg"
                                    alt="icon-role-industri"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      Industri
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                        <Link href={`${ssURL}/login/kewiraswastaan`}>
                          <a className="text-decoration-none mb-4">
                            <div className="card-role card mb-4 pointer rounded-ss border-2">
                              <div className="card-body card-role-orang-tua p-sm-4 p-3">
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/img/icon-role-kewirausahaan.svg"
                                    alt="icon-role-kewirausahaan"
                                  />
                                  <div className="ms-sm-4 ms-3 color-secondary">
                                    <p className="mb-1 fs-14-ss">
                                      Saya Seorang
                                    </p>
                                    <h5 className="m-0 fw-bold sm-fs-6">
                                      Kewiraswastaan
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* <div className="col-lg-7 d-none d-lg-block ps-5">
              <img
                src={`/img/ss-background.png`}
                alt="Smartschool"
                height="400"
                width="400"
                layout="responsive"
                objectFit="contain"
              />
            </div> */}
          </div>
        </>
      )}
    </AuthLayout>
  );
};

export default index;
