import Layout from "../../components/Layout/Layout";
import { motion } from "framer-motion";
import {
  FaAngleRight,
  FaClock,
  FaFile,
  FaFilePdf,
  FaPaperclip,
  FaPen,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { baseURL, ssURL } from "../../client/clientAxios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ModalStep from "../../components/Shared/ModalStep/ModalStep";
import { uploadFile } from "../../client/uploadFileClient";
import { postAbsen, detailAbsen, editAbsen } from "../../client/AbsenClient";
import { momentPackage } from "../../utilities/HelperUtils";
import useBagian from "../../hooks/useBagian";
import useUser from "../../hooks/useUser";
import Link from "next/link";
import useSekolah from "../../hooks/useSekolah";
import KeuanganDashboard from "../../components/Dashboard/KeuanganDashboard";
import MyJoyride from "../../components/Shared/MyJoyride/MyJoyride";
import Avatar from "../../components/Shared/Avatar/Avatar";
import { Tooltip } from "antd";
import NewDashboardSmartSchool from "../../components/Dashboard/NewDashboardSmartschool";
import AllertHelloDashboard from "../../components/Dashboard/AlertHelloDashboard";
import { CardBerandaAbsensi } from "../../components/monitoring/CardBerandaAbsensi";
import KesiswaanDashboard from "../../components/Dashboard/KesiswaanDashboard";
import swal from "sweetalert2";
import KurikulumDashboard from "components/Dashboard/KurikulumDashboard";
import useTa from "hooks/useTa";
import { Steps } from "antd";
import NewModal from "components/Shared/NewModal/NewModal";
import { hideModal, showModal } from "utilities/ModalUtils";

const { Step } = Steps;

const index = () => {
  const initialStateForm = {
    absen: 0,
    id: 0,
    keterangan: "",
    lampiran: [],
    foto_masuk: "",
    waktu_masuk: "",
    foto_pulang: "",
    waktu_pulang: "",
  };

  const { user } = useUser();
  const { sekolah } = useSekolah();
  const { ta } = useTa();

  const { setBagian, bagian } = useBagian();

  useEffect(() => {
    localStorage.setItem("bagian", bagian);
  }, [bagian]);

  const [formData, setFormData] = useState(initialStateForm);

  const [current, setCurrent] = useState(formData.absen && 1);

  const [jadwalMengajarSaatIni, setJadwalMengajarSaatIni] = useState(null);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getDetailAbsenData = async () => {
    const { data } = await detailAbsen({
      hari_ini: momentPackage().format("YYYY-MM-DD"),
      kode_hari: new Date().getDay(),
      jam_saat_ini: momentPackage().format("HH:mm"),
    });
    if (!data?.absen) {
      return;
    }
    if (data) {
      setFormData({
        ...formData,
        absen: data?.absen?.absen,
        foto_masuk: data?.absen?.fotoMasuk,
        waktu_masuk: data?.absen?.waktuMasuk,
        foto_pulang: data?.absen?.fotoPulang,
        waktu_pulang: data?.absen?.waktuPulang,
        id: data?.absen?.id,
        lampiran: [...formData.lampiran, data?.absen?.lampiran],
        keterangan: data?.absen?.keterangan,
      });
      setJadwalMengajarSaatIni(data.jadwalMengajar);
      setCurrent(1);
    }
  };

  const uploadFileToServer = async (e) => {
    const data = await uploadFile(e.target.files[0]);
    if (data) {
      setFormData({
        ...formData,
        lampiran: [...formData.lampiran, data],
      });
    }
  };

  const uploadFotoMasuk = async (e) => {
    const data = await uploadFile(e.target.files[0]);
    if (data) {
      setFormData({
        ...formData,
        foto_masuk: data,
      });
    }
  };

  const uploadFotoPulang = async (e) => {
    if (momentPackage().format("HH:mm") <= "12:00") {
      return toast.error("Absen pulang dibuka pukul 12:00");
    }
    const data = await uploadFile(e.target.files[0]);
    if (data) {
      setFormData({
        ...formData,
        foto_pulang: data,
      });
    }
  };

  const [buttonState, setButtonState] = useState("idle");

  const handleSubmitAbsenData = async (smarteschool) => {
    setButtonState("loading");
    if (formData.id) {
      const { data, error } = await editAbsen(formData.id, {
        ...formData,
        waktu_pulang: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      });
      if (data) {
        const modalAbsen = document.getElementById("modalAbsen");
        new bootstrap.Modal(modalAbsen).hide();
        modalAbsen.classList.remove("show");
        modalAbsen.style = "display: none";
        document.getElementsByClassName("modal-backdrop")[0].className = "";
        document.getElementsByClassName("modal-open")[0].className = "";
        toast.success(data?.message);
        setButtonState("success");
        setFormData(initialStateForm);
        getDetailAbsenData();
      } else {
        error?.map((err) => toast.error(err?.message));
        setButtonState("error");
      }
    } else {
      const { data, error } = await postAbsen(
        smarteschool || {
          ...formData,
          waktu_masuk: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      if (data) {
        const modalAbsen = document.getElementById("modalAbsen");
        new bootstrap.Modal(modalAbsen).hide();
        modalAbsen.classList.remove("show");
        modalAbsen.style = "display: none";
        document.getElementsByClassName("modal-backdrop")[0].className = "";
        document.getElementsByClassName("modal-open")[0].className = "";
        toast.success(data?.message);
        setButtonState("success");
        setFormData(initialStateForm);
        getDetailAbsenData();
      } else {
        error?.map((err) => toast.error(err?.message));
        setButtonState("error");
      }
    }
  };

  const deleteLampiran = (lampiran) => {
    const modifiedLampiran = formData?.lampiran?.filter(
      (val) => val !== lampiran
    );
    setFormData({
      ...formData,
      lampiran: [...modifiedLampiran],
    });
  };

  const steps = [
    // admin
    {
      target: '[data-joyride="tata-usaha"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Tata Usaha</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            tata usaha dan juga administrasi data. Tekan icon Tata Usaha untuk
            masuk ke menu admin tata usaha.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="keuangan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Keuangan</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            bagiana keuangan sekolah. Tekan icon Keuangan untuk masuk ke menu
            admin keuangan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="kurikulum"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Kurikulum</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            kurikulum sekolah. Tekan icon Kurikulum untuk masuk ke menu admin
            kurikulum.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="kesiswaan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            {sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"}
          </h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            bagian{" "}
            {sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"}{" "}
            sekolah. Tekan icon{" "}
            {sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"} untuk
            masuk ke menu admin{" "}
            {sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"}.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="sarpras"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Sarpras</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            bagian sarpras dan administrasi barang sekolah. Tekan icon Sarpras
            untuk masuk ke menu admin sarpras.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="humas"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Humas</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            humas, kemitraan sekolah dan juga industri. Tekan icon Humas untuk
            masuk ke menu admin humas.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="publikasi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Publikasi</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            bagian publikasi yang mana terhubung langsung dengan website
            informasi sekolah. Tekan icon Publikasi untuk masuk ke menu admin
            publikasi.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ujian</h5>
          <p className="color-secondary fw-semibold">
            Pada bagian ini anda dapat mengatur semua hal yang berkaitan dengan
            kegiatan ujian besar yang ada di sekolah, seperti ujian tengah
            semester, akhir semester, ujian sekolah dan juga ujian lainnya.
            Tekan icon Ujian untuk masuk ke menu admin ujan.
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (user?.id) {
      getDetailAbsenData();
    }
  }, [user]);

  // useEffect(() => {
  //   var myModal = new bootstrap.Modal(document.getElementById("modalAktivasi"));
  //   if ((!user.waReal || !user.email) && Object.keys(user).length != 0) {
  //     return myModal.show();
  //   } else {
  //     return;
  //   }
  // }, [user]);

  // useEffect(() => {
  //   setTimeout(function () {
  //     swal(
  //       <div className="d-flex flex-column">
  //         <h4 className="fw-black color-dark mx-auto my-4">Mohon Perhatian!</h4>
  //         <p className="text-start color-dark mb-4">
  //           Gedung Data Center Cyber I telah mengalami insiden kebakaran. Mohon maaf
  //           apabila mengalami kendala saat mengakses Smarteschool pada beberapa
  //           provider internet tertentu.
  //         </p>
  //       </div>,
  //       { buttons: "Tutup" }
  //     );
  //   }, 1000);
  // }, []);

  useEffect(() => {
    if((user?.role === "siswa" || user?.role === "guru") && localStorage.getItem('formReview')){
      showModal('modalReview')
    }
  }, [user])

  return (
    <>
    <NewModal
        modalId="modalReview"
        modalSize="lg"
        removeFooter={true}
        isModalWhite={true}
        // title={
        //   <>
        //     <h4 className="mb-1 fw-extrabold"></h4>
        //     <span className="fs-6 fw-normal">
        //      Dibawah ini adalah keterangan yang diberikan untuk siswa
        //    </span>
        //   </>
        // }
        content={
          <>
            <h4 className="fw-extrabold text-center color-dark mb-4">
              Feedback Pengerjaan Ujian
            </h4>
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6 col-sm-8">
                <img
                  src={`/img/landing/icon-buku-tamu.png`}
                  alt="illustration"
                  className="img-fluid mb-4"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={`col-md-8 text-center mb-4`}>
                <h6 className={`fs-18-ss md-fs-6 mb-4 fw-bold color-dark`}>
                  Terima kasih telah menggunakan smarteschool untuk mengerjakan ujian.
                </h6>
                <p className="fw-semibold text-center md-fs-14-ss text-start mb-0">
                  <span className="fw-extrabold color-primary">
                    Silahkan berikan feedbackmu selama pengerjaan ujian untuk pengembangan smarteschool.
                  </span>
                </p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <a
                  className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                  href="https://forms.gle/JawhJhv9oYjK7aBy5"
                  target="_blank"
                  onClick={()=>{
                    localStorage.removeItem('formReview')
                    hideModal('modalReview')}}
                >
                  Berikan Feedback Disini
                </a>
              </div>
            </div>
          </>
        }
      />
    <Layout
      isIndex={true}
      isDashboard={true}
      modalWrapper={
        <>
          <ModalStep
            modalClass="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            buttonSubmit={
              <ReactiveButton
                buttonState={buttonState}
                color={"primary"}
                idleText={"Absen"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
                onClick={() => handleSubmitAbsenData()}
              />
            }
            isNext={false}
            modalId="modalAbsen"
            title={
              <>
                <h4 className="fw-extrabold mb-0">Absen Harian</h4>
              </>
            }
            current={current}
            next={next}
            prev={prev}
            steps={[
              {
                title: "Keterangan Absen",
                content: (
                  <div className="p-2 pt-5">
                    <h6 className="fs-18-ss fw-bold color-dark mb-4">
                      Pilih Keterangan Absen
                    </h6>
                    <div
                      className="card-absen-hadir card mb-4 pointer rounded-ss border-2"
                      onClick={() => {
                        if (
                          !formData.waktu_masuk &&
                          (sekolah.id == 5 || sekolah.id == 7)
                        ) {
                          handleSubmitAbsenData({
                            absen: "hadir",
                            foto_masuk: "smarteschool",
                            waktu_masuk: momentPackage().format(
                              "YYYY-MM-DD HH:mm:ss"
                            ),
                          });

                          if (sekolah.id == 7)
                            window.open(
                              `https://wa.me/62087876672140?text=Selamat ${
                                momentPackage().format("HH") < 12
                                  ? "pagi"
                                  : momentPackage().format("HH") > 14
                                  ? "siang"
                                  : "sore"
                              } pak, ${
                                user?.nama
                              } hari ${momentPackage().format(
                                "DD MMMM YYYY HH:mm:ss"
                              )} %0A Keterangan absen: ${
                                !formData.waktu_masuk ? "Hadir" : "Pulang"
                              }`
                            );

                          return;
                        }

                        setFormData({ ...formData, absen: "hadir" });
                        next();
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={`/img/icon-absen-hadir.svg`}
                            alt="icon-absen-hadir"
                          />
                          <div className="ms-4 color-secondary">
                            <p className="mb-1 fs-14-ss">Hari ini</p>
                            <h5 className="m-0 fw-bold">Saya Hadir</h5>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div
                      className="card-absen-izin card mb-4 pointer rounded-ss border-2"
                      onClick={() => {
                        setFormData({ ...formData, absen: "izin" });
                        next();
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={`/img/icon-absen-izin.svg`}
                            alt="icon-absen-izin"
                          />
                          <div className="ms-4 color-secondary">
                            <p className="mb-1 fs-14-ss">Hari ini</p>
                            <h5 className="m-0 fw-bold">Saya Izin</h5>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div
                      className="card-absen-sakit card mb-4 pointer rounded-ss border-2"
                      onClick={() => {
                        setFormData({ ...formData, absen: "sakit" });
                        next();
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <img
                            src={`/img/icon-absen-sakit.svg`}
                            alt="icon-absen-sakit"
                          />
                          <div className="ms-4 color-secondary">
                            <p className="mb-1 fs-14-ss">Hari ini</p>
                            <h5 className="m-0 fw-bold">Saya Sakit</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Bukti Keterangan",
                content: (
                  <>
                    {formData.absen == "hadir" && (
                      <div className="p-2 pt-4">
                        <h6 className="fs-18-ss fw-bold color-dark mb-4">
                          Kirimkan Foto Time Stamp untuk Absen Harian
                        </h6>
                        <div className="row g-4">
                          <div className="col-md-6">
                            <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold mb-3">
                              Absen Masuk
                            </span>
                            {!formData.foto_masuk && sekolah?.id != 7 ? (
                              <label
                                htmlFor="absenMasuk"
                                className="form-label mt-3 mb-4 w-100"
                              >
                                <div className="drop-file bg-soft-primary rounded d-flex justify-content-center align-items-center pointer w-100 py-lg-5 py-md-3 py-5">
                                  <div className="label-input d-flex align-items-center py-5 px-4 flex-column m-3 m-md-0">
                                    <img
                                      src={`/img/icon-upload-dropfile.svg`}
                                      alt=""
                                    />
                                    <span className="fs-18-ss fw-semibold color-secondary m-0 mt-4 text-center">
                                      Tekan untuk mengupload{" "}
                                      <span className="color-primary">
                                        Foto
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </label>
                            ) : null}
                            <div
                              className="position-relative mx-auto mt-3 mb-4"
                              style={{
                                width: "100%",
                              }}
                            >
                              {formData.foto_masuk && sekolah?.id != 7 ? (
                                <>
                                  <img
                                    width="100%"
                                    src={`${formData.foto_masuk}`}
                                    className="rounded"
                                  />
                                  <label
                                    className="rounded-circle shadow-primary-ss position-absolute pointer"
                                    htmlFor="absenMasuk"
                                    style={{
                                      right: "5%",
                                      top: "5%",
                                      width: "50px",
                                      height: "50px",
                                      background: `
                        url(/img/icon-edit-foto.svg)`,
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                    }}
                                  ></label>
                                </>
                              ) : null}

                              <input
                                className="form-control d-none"
                                type="file"
                                id="absenMasuk"
                                accept="image/*"
                                onChange={uploadFotoMasuk}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold mb-3">
                              Absen Pulang
                            </span>
                            {!formData.foto_pulang && (
                              <label
                                htmlFor="absenPulang"
                                className="form-label mt-3 mb-4 w-100"
                              >
                                <div className="drop-file bg-soft-primary rounded d-flex justify-content-center align-items-center pointer w-100 py-lg-5 py-md-3 py-5">
                                  <div className="label-input d-flex align-items-center py-5 px-4 flex-column m-3 m-md-0">
                                    <img
                                      src={`/img/icon-upload-dropfile.svg`}
                                      alt=""
                                    />
                                    <span className="fs-18-ss fw-semibold color-secondary m-0 mt-4 text-center">
                                      Tekan untuk mengupload{" "}
                                      <span className="color-primary">
                                        Foto
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </label>
                            )}
                            <input
                              className="form-control d-none"
                              type="file"
                              id="absenPulang"
                              accept="image/*"
                              onChange={uploadFotoPulang}
                            />
                            <div
                              className="position-relative mx-auto mt-3 mb-4"
                              style={{
                                width: "100%",
                              }}
                            >
                              {formData.foto_pulang && (
                                <>
                                  <img
                                    width="100%"
                                    src={`${formData.foto_pulang}`}
                                    className="rounded"
                                  />

                                  <label
                                    className="rounded-circle shadow-primary-ss position-absolute pointer"
                                    htmlFor="absenPulang"
                                    style={{
                                      right: "5%",
                                      top: "5%",
                                      width: "50px",
                                      height: "50px",
                                      background: `
                        url(/img/icon-edit-foto.svg)`,
                                      backgroundSize: "cover",
                                      backgroundRepeat: "no-repeat",
                                      backgroundPosition: "center",
                                    }}
                                  ></label>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {formData.absen !== "hadir" && (
                      <div className="p-2 pt-4">
                        <h6 className="fs-18-ss fw-bold color-dark mb-4">
                          Kirimkan Bukti Surat Keterangan Dokter atau Lainnya
                        </h6>
                        <TextareaAutosize
                          className="form-control"
                          autoComplete="off"
                          name="keterangan"
                          style={{
                            resize: "none",
                            width: "100%",
                          }}
                          placeholder="Tuliskan keterangan absen harian"
                          minRows={3}
                          onChange={handleChangeForm}
                          value={formData.keterangan}
                        />
                        <div className="d-flex justify-content-between align-items-center my-4 flex-wrap">
                          <h6 className="mt-0 fw-bold color-dark">Lampiran</h6>
                          <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between">
                            <label
                              htmlFor="lampiran"
                              className="btn btn-ss fs-12-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold form-label"
                            >
                              <FaPaperclip className="me-2" />
                              Unggah File
                            </label>
                            <input
                              className="form-control d-none"
                              type="file"
                              name="lampiran"
                              id="lampiran"
                              onChange={uploadFileToServer}
                            />
                          </div>
                        </div>
                        {formData?.lampiran?.map((lampiran) => (
                          <div className="mt-3">
                            <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                              <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                                <div className="d-flex align-items-center flex-wrap">
                                  <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                                    <FaFile className="text-white fs-3" />
                                  </div>
                                  <div className="p-2">
                                    <p className="fw-bold color-dark mb-0">
                                      {lampiran}
                                    </p>
                                    <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                                      {/* PDF */}
                                    </span>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                                  >
                                    Pratinjau
                                  </button>
                                  <FaTimes
                                    className="text-secondary"
                                    onClick={() => deleteLampiran(lampiran)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ),
              },
            ]}
          />
        </>
      }
    >
      {!bagian && <MyJoyride steps={steps} />}
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {user?.role == "admin" && (
          <>
            {sekolah?.trial ? (
              <div className="mt-4 mb-5">
                <Steps current={ta !== 404 ? 1 : 0}>
                  <Step title="Aktifkan Tahun Akademik" description="" />
                  <Step title="Membuat Akun Guru dan Siswa" description="" />
                  <Step title="Melakukan Aktivitas E-Learning" description="" />
                  <Step title="Melakukan Aktivitas E-Exam" description="" />
                </Steps>
              </div>
            ) : null}

            {!bagian && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Operator ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang Operator"
                name={user?.sekolah?.nama}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "tata-usaha" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Tata Usaha ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Tata Usaha ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "ppdb" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Operator ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Operator ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "keuangan" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Keuangan ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Keuangan ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-keuangan.png`}
              />
            )}
            {bagian == "kurikulum" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Kurikulum ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Kurikulum ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "kesiswaan" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang ${
                  sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"
                } ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`${
                  sekolah?.tingkat == "kampus" ? "Kemahasiswaan" : "Kesiswaan"
                } ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "sarpras" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Sarpras ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Sarpras ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "humas" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Humas ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Humas ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "publikasi" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Publikasi ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Publikasi ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-publikasi.png`}
              />
            )}
            {(bagian == "ujian" || bagian == "pengawas") && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Operator Ujian ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Operator Ujian ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "dapodik" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Operator ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Operator ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "marketplace" && (
              <AllertHelloDashboard
                greeting1={` Halo, Selamat Datang Operator ${user?.sekolah?.nama}`}
                desc=" Sudah siap beroperasi hari ini ?"
                greeting2="Halo, Selamat Datang"
                name={`Operator ${user?.sekolah?.nama}`}
                img={`/img/illustrasi-dashboard-operator.png`}
              />
            )}
            {bagian == "absensi" && (
              <>
                <AllertHelloDashboard
                  greeting1={` Halo, Selamat Datang Operator Absen ${user?.sekolah?.nama}`}
                  desc=" Sudah siap beroperasi hari ini ?"
                  greeting2="Halo, Selamat Datang"
                  name={`Operator ${user?.sekolah?.nama}`}
                  img={`/img/illustrasi-dashboard-operator.png`}
                />
                <CardBerandaAbsensi />
              </>
            )}

            {bagian == "keuangan" && <KeuanganDashboard />}

            {bagian === "kesiswaan" && <KesiswaanDashboard />}
            {bagian === "kurikulum" && (
              <KurikulumDashboard sekolah={sekolah} ta={ta} />
            )}

            {(!bagian || bagian == "absensi") && (
              <>
                <div className="row text-center">
                  <div className="col-md-12">
                    <span className="fs-2 fw-extrabold color-dark position-relative title-page-center">
                      Pilih Bagian Dibawah Ini
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="card card-ss py-lg-5 px-lg-3 py-4 px-2 mt-5">
                      <div className="row">
                        <div className="col-md-12 d-flex justify-content-sm-arround justify-content-center align-items-center flex-wrap flex-row">
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("tu") > -1) && (
                            <a
                              onClick={() => setBagian("tata-usaha")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="tata-usaha"
                            >
                              <img
                                src="/img/icon-tata-usaha.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Tata Usaha
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("ppdb") > -1) && (
                            <a
                              onClick={() => setBagian("ppdb")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="dapodik"
                            >
                              <img
                                src="/img/icon-ppdb.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                {" "}
                                {sekolah?.tingkat == "kampus"
                                  ? "Pendaftaran Mahasiswa"
                                  : "PPDB"}
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("keuangan") > -1 ||
                            user?.bagian?.split(";").indexOf("aproval") > -1 ||
                            user?.bagian?.split(";").indexOf("yayasan") >
                              -1) && (
                            <a
                              onClick={() => setBagian("keuangan")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="keuangan"
                            >
                              <img
                                src="/img/icon-keuangan.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Keuangan
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("kurikulum") >
                              -1) && (
                            <a
                              onClick={() => setBagian("kurikulum")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="kurikulum"
                            >
                              <img
                                src="/img/icon-kurikulum.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Kurikulum
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("kesiswaan") >
                              -1) && (
                            <a
                              onClick={() => setBagian("kesiswaan")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="kesiswaan"
                            >
                              <img
                                src="/img/icon-kesiswaan.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                {sekolah?.tingkat == "kampus"
                                  ? "Kemahasiswaan"
                                  : "Kesiswaan"}
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("sarpras") >
                              -1) && (
                            <a
                              onClick={() => setBagian("sarpras")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="sarpras"
                            >
                              <img
                                src="/img/icon-sarpras.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Sarpras
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("humas") > -1) && (
                            <a
                              onClick={() => setBagian("humas")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5 d-md-none d-block"
                              data-joyride="humas"
                            >
                              <img
                                src="/img/icon-humas.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Humas</h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("ujian") > 1) && (
                            <a
                              onClick={() => setBagian("publikasi")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5 d-md-none d-block"
                              data-joyride="publikasi"
                            >
                              <img
                                src="/img/icon-publikasi.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Publikasi
                              </h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("ujian") > -1) && (
                            <a
                              onClick={() => setBagian("ujian")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5 d-md-none d-block"
                              data-joyride="ujian"
                            >
                              <img
                                src="/img/icon-admin-ujian.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Ujian</h6>
                            </a>
                          )}
                          {user?.bagian?.split(";").indexOf("pengawas") >
                            -1 && (
                            <a
                              onClick={() => setBagian("pengawas")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5 d-md-none d-block"
                              data-joyride="ujian"
                            >
                              <img
                                src="/img/icon-admin-ujian.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Ujian</h6>
                            </a>
                          )}
                          {!user?.bagian && (
                            <a
                              onClick={() => setBagian("dapodik")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5 d-lg-none d-block"
                              data-joyride="dapodik"
                            >
                              <img
                                src="/img/icon-admin-dapodik.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Dapodik
                              </h6>
                            </a>
                          )}
                        </div>
                        <div className="col-md-12 justify-content-sm-arround justify-content-center align-items-center flex-wrap flex-row d-md-flex d-none">
                          {!user?.bagian && (
                            <a
                              onClick={() => setBagian("humas")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="humas"
                            >
                              <img
                                src="/img/icon-humas.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Humas</h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("pengawas") >
                              1) && (
                            <>
                              <a
                                onClick={() => setBagian("publikasi")}
                                className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                                data-joyride="publikasi"
                              >
                                <img
                                  src="/img/icon-publikasi.svg"
                                  alt="icon-navigasi"
                                  className="icon-navigasi-operator"
                                />
                                <h6 className="fw-bold color-dark mt-3">
                                  Publikasi
                                </h6>
                              </a>
                            </>
                          )}
                          {user?.bagian?.split(";").indexOf("pengawas") >
                            -1 && (
                            <a
                              onClick={() => setBagian("pengawas")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="ujian"
                            >
                              <img
                                src="/img/icon-admin-ujian.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Ujian</h6>
                            </a>
                          )}
                          {(!user?.bagian ||
                            user?.bagian?.split(";").indexOf("ujian") > -1) && (
                            <a
                              onClick={() => setBagian("ujian")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="ujian"
                            >
                              <img
                                src="/img/icon-admin-ujian.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">Ujian</h6>
                            </a>
                          )}
                          {!user?.bagian && (
                            <a
                              onClick={() =>
                                sekolah?.linkDapodik
                                  ? window.open(sekolah?.linkDapodik)
                                  : setBagian("dapodik")
                              }
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="dapodik"
                            >
                              <img
                                src="/img/icon-admin-dapodik.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Dapodik
                              </h6>
                            </a>
                          )}
                          {!user?.bagian && (
                            <a
                              onClick={() => setBagian("marketplace")}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="dapodik"
                            >
                              <img
                                src="/img/icon-marketplace.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                Marketplace
                              </h6>
                            </a>
                          )}

                          {!user?.bagian && sekolah?.linkRapor ? (
                            <a
                              onClick={() => window.open(sekolah?.linkRapor)}
                              className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                              data-joyride="dapodik"
                            >
                              <img
                                src="/img/icon-rapor-admin.svg"
                                alt="icon-navigasi"
                                className="icon-navigasi-operator"
                              />
                              <h6 className="fw-bold color-dark mt-3">
                                E-Rapor
                              </h6>
                            </a>
                          ) : null}
                          {/* <a
                            onClick={() => setBagian("absensi")}
                            className="text-decoration-none navigasi-items d-flex flex-column justify-content-center align-items-center p-3 px-5"
                            data-joyride="absensi"
                          >
                            <img
                              src="/img/icon-admin-dapodik.svg"
                              alt="icon-navigasi"
                              className="icon-navigasi-operator"
                            />
                            <h6 className="fw-bold color-dark mt-3">absensi</h6>
                          </a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {user?.role !== "admin" && (
          <>
            {/* <div className="row">
              {formData.waktu_masuk && formData.waktu_pulang ? null : (
                <div className="col-md-12 mb-3">
                  <div
                    className="d-flex bg-gradient-primary-2 px-4 py-3 rounded-ss align-items-lg-end justify-content-between flex-wrap flex-lg-row flex-column"
                    data-joyride="card-absen"
                  >
                    <div className="text-white">
                      <div className="d-flex align-items-center mb-1">
                        <img
                          src={`/img/icon-warning-alert.svg`}
                          alt=""
                          style={{
                            width: "18px",
                            height: "18px",
                          }}
                        />
                        <h6 className="fs-18-ss fw-bold ms-2 mb-0">Absen</h6>
                      </div>

                      <p className="mb-0">
                        {formData.foto_masuk
                          ? sekolah.id == 5
                            ? "Silahkan ke menu kelas untuk mengajar"
                            : "Anda sudah absen masuk, untuk absen pulang dibuka pukul 15.00"
                          : "Anda belum absen hari ini, tekan tombol absen untuk melakukan absen hari ini"}
                      </p>
                    </div>
                    {formData.foto_masuk && sekolah.id == 5 ? null : (
                      <button
                        className="btn btn-light rounded-pill py-1 px-4 py-1 fs-12-ss fw-bold color-primary mt-3 mt-lg-0"
                        data-bs-toggle="modal"
                        data-bs-target="#modalAbsen"
                      >
                        <span>Absen</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div> */}

            <NewDashboardSmartSchool />
          </>
        )}
      </motion.div>
    </Layout>
    </>
  );
};

export default index;
