import { useEffect, useRef, useState } from "react";
import { FaFile, FaPaperclip, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { editAbsen, postAbsen } from "client/AbsenClient";
import { uploadFile } from "client/uploadFileClient";
import useSekolah from "hooks/useSekolah";
import { momentPackage, imageCompression } from "utilities/HelperUtils";
import { hideModal, showModal } from "utilities/ModalUtils";
import InputFile from "../InputFile/InputFile";
import LoadingProgress from "../LoadingProgress/LoadingProgress";
import ModalStep from "../ModalStep/ModalStep";
import ModalAmbilGambar from "./ModalAmbilGambar";
import ModalAbsensiPonsel from "components/Absensi/ModalAbsensiPonsel";

const initialFormData = {
  lampiran: [],
  lokasiMasuk: null,
  lokasiPulang: null,
};

const ModalAbsen = ({
  absenData,
  getDetailAbsenData,
  isModalAbsenOpen,
  setIsModalAbsenOpen,
}) => {
  const inputFileRef = useRef(null);
  const { sekolah } = useSekolah();

  const [formData, setFormData] = useState(initialFormData);
  const [current, setCurrent] = useState(0);
  const [buttonState, setButtonState] = useState("idle");
  const [compressFileProgress, setCompressFileProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ambilFotoMasuk, setAmbilFotoMasuk] = useState(false);
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [location, setLocation] = useState([]);
  // const [isGeoLocationEnabled, setIsGeoLocationEnabled] = useState(false);


  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setProgress(uploadProgress);
    }
  };

  const handleChangeInputFile = async (e, data) => {
    if (data) {
      setFormData({
        ...formData,
        lampiran: [...formData.lampiran, data],
      });
    }
  };

  const imageCompressOptions = {
    onProgress: (e) => {
      if (e <= 100) {
        setCompressFileProgress(e);
      }
    },
  };

  const uploadFotoMasuk = async (e) => {
    // Get image
    const imageFile = e.target.files[0];

    // Compress image
    // const compressedFile = await imageCompression(
    //   imageFile,
    //   imageCompressOptions
    // );

    // Upload image
    await uploadFile(imageFile, checkProgress, (fileUrl) => {
      if (fileUrl) {
        setFormData({
          ...formData,
          fotoMasuk: fileUrl,
        });
      }
    });
  };

  const uploadFotoPulang = async (e) => {
    if (momentPackage().format("HH:mm") <= "12:00") {
      return toast.error("Absen pulang dibuka pukul 12:00");
    }

    // Get image
    const imageFile = e.target.files[0];

    // Compress image
    // const compressedFile = await imageCompression(
    //   imageFile,
    //   imageCompressOptions
    // );

    // Upload image
    await uploadFile(imageFile, checkProgress, (fileUrl) => {
      if (fileUrl) {
        setFormData({
          ...formData,
          fotoPulang: fileUrl,
        });
      }
    });
  };

  const handleSubmitAbsenData = async (smarteschool) => {
    setButtonState("loading");

    // check sekolah for location
    // if (sekolah?.id == 8977 || sekolah?.id == 121) {
    // if (!isGeoLocationEnabled) {
    //   toast.error(
    //     "Harap beri akses Smarteschool mendapatkan lokasi Anda untuk melakukan absen"
    //   );
    //   setButtonState("idle");
    //   return;
    // }
    // }

    // Langsung cek apakah lokasi sudah diambil (tanpa cek isGeoLocationEnabled)
    if (!location?.latitude || !location?.longitude) {
      toast.error("Lokasi belum terdeteksi. Harap aktifkan GPS.");
      setButtonState("idle");
      return;
    }

    let payload = {
      ...formData,
      waktuMasuk: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    };

    // Absen Masuk
    if (!payload?.lokasiMasuk && !formData?.id) {
      payload.lokasiMasuk = location;
    }

    // Absen Pulang
    const isAbsenPulang =
      payload?.id &&
      payload?.createdAt &&
      payload?.waktuMasuk &&
      !payload?.waktuPulang;

    if (isAbsenPulang) {
      payload.waktuPulang = momentPackage().format("YYYY-MM-DD HH:mm:ss");
      payload.lokasiPulang = location;

      if (momentPackage().format("HH:mm") <= "12:00") {
        setButtonState("idle");
        return toast.error("Absen pulang dibuka pukul 12:00");
      }
    }

    if (formData.id) {
      const { data, error } = await editAbsen(formData.id, payload);
      if (data) {
        hideModal("modalAbsen2");
        toast.success(data?.message);
        setButtonState("success");
        getDetailAbsenData();
      } else {
        error?.map((err) => toast.error(err?.message));
        setButtonState("error");
      }
    } else {
      const { data, error } = await postAbsen(smarteschool || payload);
      if (data) {
        hideModal("modalAbsen2");
        toast.success(data?.message);
        setButtonState("success");
        getDetailAbsenData();
      } else {
        error?.map((err) => toast.error(err?.message));
        setButtonState("error");
      }
    }
    setButtonState("idle");
    setIsModalAbsenOpen(false);
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

  const saveFoto = (fileUrl) => {
    setFormData({
      ...formData,
      [ambilFotoMasuk ? "fotoMasuk" : "fotoPulang"]: fileUrl,
      ...(!ambilFotoMasuk && {
        waktu_pulang: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      }),
    });

    hideModal("modalAmbilGambar");
  };

  const openCamera = ({ isAbsenMasuk = false }) => {
    showModal("modalAmbilGambar");
    setAmbilFotoMasuk(isAbsenMasuk);
    setIsReadyToCapture(true);
  };

  const showPosition = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setIsGeoLocationEnabled(true);
    setLocation({
      latitude,
      longitude,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      ...absenData,
    });
    setCurrent(absenData?.absen ? 1 : 0);
  }, [absenData]);

  useEffect(() => {
    // kondisi getlocation 
    // if (isModalAbsenOpen && absenData?.absen && current == 1) {
    if (current == 1 && formData.absen == 'hadir') {
      getLocation();
    }
  }, [isModalAbsenOpen, absenData, current]);

  useEffect(() => {
    if (progress === 100) {
      setProgress(0);
    }
  }, [progress]);

  //get location yang lama
  // const getLocation = () => {
  //   // return;
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(showPosition);
  //   } else {
  //     setIsGeoLocationEnabled(false);
  //   }
  // };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Peramban Anda tidak mendukung geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        showPosition(position); // Jika sukses
        toast.success("Lokasi berhasil diambil.");
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Izin lokasi ditolak. Silakan izinkan akses lokasi di pengaturan.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Informasi lokasi tidak tersedia. Periksa pengaturan lokasi perangkat.");
            break;
          case error.TIMEOUT:
            toast.error("Permintaan lokasi timeout. Coba nyalakan ulang GPS.");
            break;
          default:
            toast.error("Terjadi kesalahan saat mendapatkan lokasi.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  };
  // kondisi current yang diperbaiki
  useEffect(() => {
    if (!isModalAbsenOpen) {
      setCurrent(0);
    }
  }, [isModalAbsenOpen]);


  return (
    <>
      <LoadingProgress key={"progress-1"} progress={progress} />
      <LoadingProgress
        key={"progress-2"}
        progress={compressFileProgress}
        loadingText="Sedang mengkompres file"
        successText="Berhasil mengkompres file"
      />
      <ModalStep
        onClose={() => {
          setIsModalAbsenOpen(false)
          setCurrent(0);
        }}
        modalClass="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        buttonSubmit={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={"Submit"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => handleSubmitAbsenData()}
          />
        }
        disabledSecondaryButton={
          absenData?.absen === "izin" || absenData?.absen === "sakit"
        }
        isNext={false}
        modalId="modalAbsen2"
        title={
          <>
            <h4 className="fw-extrabold mb-0">Presensi Harian</h4>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={[
          {
            title: "Keterangan Presensi",
            content: (
              <div className="p-2 pt-5">
                <h6 className="fs-18-ss fw-bold color-dark mb-4">
                  Pilih Keterangan Presensi
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
                        fotoMasuk: "smarteschool",
                        waktu_masuk: momentPackage().format(
                          "YYYY-MM-DD HH:mm:ss"
                        ),
                      });

                      if (sekolah.id == 7)
                        window.open(
                          `https://wa.me/62087876672140?text=Selamat ${momentPackage().format("HH") < 12
                            ? "pagi"
                            : momentPackage().format("HH") > 14
                              ? "siang"
                              : "sore"
                          } pak, ${user?.nama} hari ${momentPackage().format(
                            "DD MMMM YYYY HH:mm:ss"
                          )} %0A Keterangan absen: ${!formData.waktu_masuk ? "Hadir" : "Pulang"
                          }`
                        );

                      return;
                    }

                    setFormData({ ...formData, absen: "hadir" });
                    if (sekolah?.id == 8977 || sekolah?.id == 121) {
                      showModal("modalAbsensiPonsel");
                      getLocation();
                    }
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
                      Kirimkan Foto Time Stamp untuk Presensi Harian
                    </h6>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold mb-3">
                          Presensi Masuk
                        </span>
                        {!formData.fotoMasuk && sekolah?.id != 7 ? (
                          <label
                            // htmlFor="absenMasuk"
                            className="form-label mt-3 mb-4 w-100"
                            onClick={() => openCamera({ isAbsenMasuk: true })}
                          >
                            <div className="drop-file bg-soft-primary rounded d-flex justify-content-center align-items-center pointer w-100 py-lg-5 py-md-3 py-5">
                              <div className="label-input d-flex align-items-center py-5 px-4 flex-column m-3 m-md-0">
                                <img
                                  src={`/img/icon-upload-dropfile.svg`}
                                  alt=""
                                />
                                <span className="fs-18-ss fw-semibold color-secondary m-0 mt-4 text-center">
                                  Tekan untuk mengupload{" "}
                                  <span className="color-primary">Foto</span>{" "}
                                  (Opsional)
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
                          {formData.fotoMasuk && sekolah?.id != 7 ? (
                            <>
                              <img
                                width="100%"
                                src={`${formData.fotoMasuk}`}
                                className="rounded"
                              />
                              <label
                                className="rounded-circle shadow-primary-ss position-absolute pointer"
                                // htmlFor="absenMasuk"
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
                                onClick={() =>
                                  openCamera({ isAbsenMasuk: true })
                                }
                              ></label>
                            </>
                          ) : null}

                          {/* <input
                            className="form-control d-none"
                            type="file"
                            id="absenMasuk"
                            accept="image/*"
                            onChange={uploadFotoMasuk}
                          /> */}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <span className="jadwal-ujian-label label-ss border border-2 border-primary-ss color-primary rounded-pill fs-12-ss fw-bold mb-3">
                          Presensi Pulang
                        </span>
                        {!formData.fotoPulang && (
                          <label
                            // htmlFor="absenPulang"
                            className="form-label mt-3 mb-4 w-100"
                            onClick={() => openCamera({ isAbsenMasuk: false })}
                          >
                            <div className="drop-file bg-soft-primary rounded d-flex justify-content-center align-items-center pointer w-100 py-lg-5 py-md-3 py-5">
                              <div className="label-input d-flex align-items-center py-5 px-4 flex-column m-3 m-md-0">
                                <img
                                  src={`/img/icon-upload-dropfile.svg`}
                                  alt=""
                                />
                                <span className="fs-18-ss fw-semibold color-secondary m-0 mt-4 text-center">
                                  Tekan untuk mengupload{" "}
                                  <span className="color-primary">Foto</span>{" "}
                                  (Opsional)
                                </span>
                              </div>
                            </div>
                          </label>
                        )}
                        {/* <input
                          className="form-control d-none"
                          type="file"
                          id="absenPulang"
                          accept="image/*"
                          onChange={uploadFotoPulang}
                        /> */}
                        <div
                          className="position-relative mx-auto mt-3 mb-4"
                          style={{
                            width: "100%",
                          }}
                        >
                          {formData.fotoPulang && (
                            <>
                              <img
                                width="100%"
                                src={`${formData.fotoPulang}`}
                                className="rounded"
                              />

                              <label
                                className="rounded-circle shadow-primary-ss position-absolute pointer"
                                // htmlFor="absenPulang"
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
                                onClick={() =>
                                  openCamera({ isAbsenMasuk: false })
                                }
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
                        <InputFile
                          name="lampiran"
                          id="lampiran"
                          onChange={handleChangeInputFile}
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

      <input
        ref={inputFileRef}
        className="form-control d-none"
        type="file"
        accept="image/*"
        onChange={(e) =>
          ambilFotoMasuk ? uploadFotoMasuk(e) : uploadFotoPulang(e)
        }
      />

      <ModalAbsensiPonsel />

      <ModalAmbilGambar
        onClickPrimaryBtn={(fileUrl) => saveFoto(fileUrl)}
        isReady={isReadyToCapture}
        setIsReady={setIsReadyToCapture}
        inputFileRef={inputFileRef}
      />
    </>
  );
};

export default ModalAbsen;
