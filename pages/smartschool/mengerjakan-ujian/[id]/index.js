import Countdown from "antd/lib/statistic/Countdown";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaClock, FaBell } from "react-icons/fa";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ssURL } from "../../../../client/clientAxios";
import {
  editJawabanUjianSiswa,
  editPesertaUjian,
  editPesertaUjian2,
  getDetailPesertaUjian,
} from "../../../../client/PesertaUjianClient";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import SkeletonSoal from "../../../../components/Shared/Skeleton/SkeletonSoal";
import SoalEsai from "../../../../components/Ujian/SoalEsai";
import SoalIsian from "../../../../components/Ujian/SoalIsian";
import SoalMenjodohkan from "../../../../components/Ujian/SoalMenjodohkan";
import SoalPG from "../../../../components/Ujian/SoalPG";
import SoalPGKompleks from "../../../../components/Ujian/SoalPGKompleks";
import SoalUraian from "../../../../components/Ujian/SoalUraian";
import { putJadwalUjianRef } from "../../../../services/jadwalUjianService";
import { momentPackage } from "../../../../utilities/HelperUtils";
import { hideModal, showModal } from "utilities/ModalUtils";
import NewModal from "components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import { uploadFile } from "client/uploadFileClient";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import ModalLihatPesanPeringatanSiswa from "components/Ujian/ModalLihatPesanPeringatanSiswa";
import ModalPesanPeringatan from "components/Ujian/ModalPesanPeringatan";
import { postDibacaPeringatanUjian } from "client/UjianClient";
import { Badge } from "antd";
import useSekolah from "hooks/useSekolah";
import { meSekolah } from "client/SekolahClient";

const index = ({ id, soal }) => {
  const initialStateForm = {
    jawabanPg: "",
    ragu: 0,
  };

  const [durasi, setDurasi] = useState(0);
  // const { sekolah } = useSekolah();
  const { setSekolah, sekolah } = useSekolah();
  const [formData, setFormData] = useState(initialStateForm);
  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState(0);
  const [pesanPeringatan, setPesanPeringatan] = useState([]);
  const [warningSS, setWarningSS] = useState(0);
  const [width, setWidth] = useState(0);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [detailPesertaUjianData, setDetailPesertaUjianData] = useState({});
  const { soalIds, pesertaUjian, soalSiswa, hariIni } = detailPesertaUjianData;
  const router = useRouter();
  const [isLoadingUpdateJawaban, setIsLoadingUpdateJawaban] = useState("idle");
  // State untuk menyimpan waktu tidak aktif
  const [inactiveTime, setInactiveTime] = useState(0);
  const [waktuUjian, setWaktuUjian] = useState(0);
  const [jumlahSoal, setJumlahSoal] = useState(0);
  const [waktuUjianDitutup, setWaktuUjianDitutup] = useState(0);

  const handleRagu = async () => {
    const { isSuccess } = await editJawabanUjianSiswa(
      {
        ragu: soalSiswa?.ragu == 0 ? 1 : 0,
      },
      soal
    );

    if (isSuccess) {
      setFormData(initialStateForm);
      _getDetailPesertaUjianData();
    }
  };
  // console.log(detailPesertaUjianData);
  const _postDibaca = async () => {
    const { data, error } = await postDibacaPeringatanUjian(
      detailPesertaUjianData?.pesertaUjian?.id
    );
    if (data) {
      toast.success("Terbaca");
    } else {
      toast.error(error.message);
    }
  };
  const handlePutJawabanSiswa = async ({
    jawabanPg,
    jawabanEsai,
    jawabanIsian,
    jawabanOpsiUraian,
    jawabanPgKompleks,
    jawabanMenjodohkan,
    jawabanUraian,
    // jawabanFoto,
  }) => {
    setIsLoadingUpdateJawaban("loading");
    const payload = {
      durasi: new Date(hariIni).getTime() - durasi,
      jawabanPg: jawabanPg,
    };

    if (jawabanEsai) {
      delete payload.jawabanPg;
      payload.jawabanEsai = jawabanEsai;
      // // payload.jawabanFoto = jawabanFoto;
    }
    if (jawabanIsian) {
      delete payload.jawabanPg;
      payload.jawabanIsian = jawabanIsian;
      // // payload.jawabanFoto = jawabanFoto;
    }
    if (jawabanOpsiUraian) {
      delete payload.jawabanPg;
      payload.jawabanOpsiUraian = jawabanOpsiUraian;
      // // payload.jawabanFoto = jawabanFoto;
    }
    if (jawabanPgKompleks) {
      delete payload.jawabanPg;
      payload.jawabanPgKompleks = jawabanPgKompleks;
      // // payload.jawabanFoto = jawabanFoto;
    }
    if (jawabanMenjodohkan) {
      delete payload.jawabanPg;
      payload.jawabanMenjodohkan = jawabanMenjodohkan;
      // // payload.jawabanFoto = jawabanFoto;
    }
    if (jawabanUraian) {
      delete payload.jawabanPg;
      payload.jawabanUraian = jawabanUraian;
      // // payload.jawabanFoto = jawabanFoto;
    }

    const { data } = await editJawabanUjianSiswa(payload, soal);

    if (data) {
      setFormData(initialStateForm);
      _getDetailPesertaUjianData(false);
      putJadwalUjianRef(data); // penggunaan firebase nya setelah fungsi backendnya selesai
      setIsLoadingUpdateJawaban("success");
    } else {
      setIsLoadingUpdateJawaban("error");
    }
  };

  const handleDibacaPeringatan = () => {
    showModal("modalLihatPesanPeringatanSiswa");
    _postDibaca();
    _getDetailPesertaUjianData();
  };

  const [loading, setLoading] = useState(true);

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          return;
        }
        router.push(data?.sekolah?.domainBackup);
      }
      setSekolah(data?.sekolah);
    }
  };

  const _getDetailPesertaUjianData = async (haveLoading = true) => {
    haveLoading && setLoading(true);
    const { data } = await getDetailPesertaUjian(id, {
      jawabanSiswaId: soal,
    });

    if (data) {
      setLoading(false);
      if (!soal) {
        router.push(
          `${ssURL}/mengerjakan-ujian/${id}?soal=${data?.soalIds?.[0]?.id}`
        );
      }
      // Logika countdown ujian
      const waktuSekarangDiServer = new Date(hariIni).getTime();
      const waktuSekarangDiClient = new Date().getTime();
      const selisihWaktu = waktuSekarangDiServer - waktuSekarangDiClient;
      const waktuDitutup = new Date(pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup).getTime();
      const durasiUjian = waktuDitutup - selisihWaktu;
      setWaktuUjianDitutup(durasiUjian);

      setDetailPesertaUjianData(data);
      setDurasi(new Date(hariIni).getTime());
      setWarning(data?.pesertaUjian?.warning);
      setPesanPeringatan(data?.pesertaUjian?.peringatan);
      localStorage.setItem("warning", data?.pesertaUjian?.warning);
      setWarningSS(1);
      setWaktuUjian(data?.pesertaUjian?.jadwalUjian?.jadwalUjian?.durasi);
      setJumlahSoal(data?.pesertaUjian?.jadwalUjian?.jadwalUjian?.jumlahSoal);
    }
  };

  const showReminderToSaveEsai = () => {
    const summernoteEsai = window.$(`#editorJawabanEsai`).summernote("code");

    if (soalSiswa?.jawabanEsai !== summernoteEsai) {
      return true;
    }

    return false;
  };

  const handleClickPrev = () => {
    if (
      showReminderToSaveEsai() &&
      soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai"
    ) {
      toast.error("Klik simpan sebelum mengganti soal");
      return;
    }

    const currentSoal = soalIds.findIndex(
      (soalId) => soalId.id == parseInt(soal)
    );

    if (currentSoal - 1 < 0) {
      return;
    }

    if (soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai") {
      setTimeout(() => {
        // router.push(
        //   `${ssURL}/mengerjakan-ujian/${id}?soal=${
        //     soalIds[currentSoal - 1]?.id
        //   }`
        // );
        window.location.href = `${ssURL}/mengerjakan-ujian/${id}?soal=${
          soalIds[currentSoal - 1]?.id
        }`;
      }, 600);
    } else {
      router.push(
        `${ssURL}/mengerjakan-ujian/${id}?soal=${soalIds[currentSoal - 1]?.id}`
      );
    }
  };

  const handleClickNext = () => {
    if (
      showReminderToSaveEsai() &&
      soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai"
    ) {
      toast.error("Klik simpan sebelum mengganti soal");
      return;
    }

    const currentSoal = soalIds.findIndex(
      (soalId) => soalId.id == parseInt(soal)
    );

    if (currentSoal + 1 > soalIds.length - 1) {
      return;
    }

    if (soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai") {
      setTimeout(() => {
        // router.push(
        //   `${ssURL}/mengerjakan-ujian/${id}?soal=${
        //     soalIds[currentSoal + 1]?.id
        //   }`
        // );
        window.location.href = `${ssURL}/mengerjakan-ujian/${id}?soal=${
          soalIds[currentSoal + 1]?.id
        }`;
      }, 600);
    } else {
      router.push(
        `${ssURL}/mengerjakan-ujian/${id}?soal=${soalIds[currentSoal + 1]?.id}`
      );
    }
  };

  const handleClickNoSoal = (soal_id) => {
    if (
      showReminderToSaveEsai() &&
      soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai"
    ) {
      toast.error("Klik simpan sebelum mengganti soal");
      return;
    }

    if (soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai") {
      setTimeout(() => {
        // router.push(`${ssURL}/mengerjakan-ujian/${id}?soal=${soal_id}`);
        window.location.href = `${ssURL}/mengerjakan-ujian/${id}?soal=${soal_id}`;
      }, 600);
    } else {
      router.push(`${ssURL}/mengerjakan-ujian/${id}?soal=${soal_id}`);
    }
  };

  const handleFinishUjian = async (checkRagu, checkTime) => {
    setLoadingButton(true);
    if (checkTime) {
      if (
        !pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuSelesai?.waktuDitutup ||
        moment(
          pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuSelesai?.waktuDitutup
        ) > moment()
      ) {
        return;
      }
    }
    if (checkRagu) {
      let jumlahRagu = 0;

      soalIds.map((d) => {
        jumlahRagu = jumlahRagu + d.ragu;
      });

      if (jumlahRagu > 0) {
        swal({
          icon: "warning",
          title: `Masih ada ${jumlahRagu} soal yang kamu ragukan nih, cek lagi yuk!`,
        });
        setLoadingButton(false);
        return;
      }
    }

    if (
      showReminderToSaveEsai() &&
      soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai"
    ) {
      toast.error("Klik simpan sebelum mengganti soal");
      setLoadingButton(false);
      return;
    }

    const { data } = await editPesertaUjian(
      {
        waktuSelesai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      },
      id
    );

    if (data) {
      setLoadingButton(false);
      toast.success(data.message);
      const redirectUrl = localStorage.getItem("redirectUrl") || "";
      localStorage.setItem("warning", 0);
      router.push(
        redirectUrl
          ? redirectUrl
          : sekolah?.id == 33
          ? `${ssURL}/hasil-ujian-v2/${id}`
          : `${ssURL}/jadwal-ujian?subnav=berlangsung`
      );
      localStorage.removeItem("redirectUrl");
    }
  };

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setProgress(uploadProgress);
    }
    // if (uploadProgress == 100) setLoading(false);
  };
  const updateWarning = async () => {
    showModal("modalWarning");
    const warningStorage = parseInt(localStorage.getItem("warning"));
    localStorage.setItem("warning", warningStorage + 1);
    const warningStorageData = parseInt(localStorage.getItem("warning"));

    const { data, error } = await editPesertaUjian2(
      { warning: warningStorageData },
      pesertaUjian?.id
    );
    if (data) {
      await putJadwalUjianRef({
        docId: data?.docId,
        tkJadwalUjianId: data?.tkJadwalUjianId,
        userId: data?.userId,
        progress: data?.progress,
        warning: data?.warning,
      });
      setWarning(data?.warning);
    }
  };

  // const handleChange = async (e) => {
  //   window.addEventListener("blur", updateWarning);
  //   if (e.target.files[0]) {
  //     await uploadFile(e.target.files[0], checkProgress, (data) => {
  //       if (data) {
  //         const img = `<img src="${data}"/>`;
  //         // upload image to server and create imgNode...
  //         window.$(`#editorJawabanEsai`).summernote("pasteHTML", img);
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    getMeSekolahData();
    _getDetailPesertaUjianData();
  }, [soal]);

  useEffect(() => {
    if (pesertaUjian) {
      if (pesertaUjian?.block == 1) {
        router.push(`${ssURL}/ujian-diblokir/${pesertaUjian?.id}`);
      }
      if (pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup) {
        if (moment(pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup)) {
          if (
            moment(pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup) <
            moment()
          ) {
            router.push(`${ssURL}/jadwal-ujian?subnav=berlangsung`);
          } else if (pesertaUjian?.waktuSelesai) {
            router.push(`${ssURL}/jadwal-ujian?subnav=berlangsung`);
          } else {
            const inputFile = document.getElementById("input-file-ujian");
            if (inputFile) {
              inputFile.addEventListener("click", (e) => {
                window.removeEventListener("blur", updateWarning);
              });
              inputFile.addEventListener("change", handleChange);
            }
            const videos = document.getElementsByClassName("note-video-clip");
            for (let i = 0; i < videos.length; i++) {
              videos[i].addEventListener("mouseleave", () => {
                window.addEventListener("blur", updateWarning);
              });
              videos[i].addEventListener("mouseenter", () => {
                window.removeEventListener("blur", updateWarning);
              });
            }
          }
        } else {
          router.push(`${ssURL}/jadwal-ujian?subnav=berlangsung`);
        }
        // handleFinishUjian();
      }
    }
  }, [pesertaUjian]);

  useEffect(() => {
    removeEventListener("blur", updateWarning);

    const inputFile = document.getElementById("input-file-ujian");
    if (inputFile) {
      inputFile.removeEventListener("click", (e) => {
        window.removeEventListener("blur", updateWarning);
      });
      inputFile.removeEventListener("change", handleChange);
    }

    const videos = document.getElementsByClassName("note-video-clip");
    for (let i = 0; i < videos.length; i++) {
      videos[i].removeEventListener("mouseleave", () => {
        window.addEventListener("blur", updateWarning);
      });
      videos[i].removeEventListener("mouseenter", () => {
        window.removeEventListener("blur", updateWarning);
      });
    }
    setTimeout(() => {
      pesertaUjian?.user?.mSekolahId == 8123 && window.location.reload();
    }, 500000);
  }, [pesertaUjian]);

  useEffect(() => {
    setWidth(window.screen.width);

    if (pesertaUjian) {
      if (pesertaUjian?.jadwalUjian?.jadwalUjian?.keluarTab == 1) {
        window.addEventListener("blur", () => {
          updateWarning();
        });
      }
    }
  }, [warningSS, width]);

  // useEffect(() => {
  //   const maxInactiveTime = (waktuUjian * 60 * 1000) / jumlahSoal;
  //   let timerId;

  //   const handleUserInactivity = () => {
  //     showModal("modalWarning");
  //     clearTimer();
  //   };

  //   const resetInactiveTime = () => {
  //     setInactiveTime(0);
  //     setTimerState(); // Set the timer again when resetting inactivity time
  //   };

  //   const setTimerState = () => {
  //     if (!timerId) {
  //       timerId = setInterval(checkInactiveTime, 1000);
  //     }
  //   };

  //   const clearTimer = () => {
  //     if (timerId) {
  //       clearInterval(timerId);
  //       timerId = null;
  //     }
  //   };

  //   const handleActivity = () => {
  //     resetInactiveTime();
  //     clearTimer(); // Clear the timer when activity is detected
  //   };

  //   const checkInactiveTime = () => {
  //     setInactiveTime((prevInactiveTime) => prevInactiveTime + 1000);

  //     if (inactiveTime >= maxInactiveTime) {
  //       handleUserInactivity();
  //       clearTimer(); // Clear the timer when inactivity limit is reached
  //     }
  //   };

  //   // Add event listeners for user activity
  //   window.addEventListener("click", handleActivity);
  //   window.addEventListener("scroll", handleActivity);

  //   // Start the timer when the component is mounted
  //   setTimerState();

  //   // Cleanup the timer and event listeners when the component is unmounted
  //   return () => {
  //     clearTimer();
  //     window.removeEventListener("click", handleActivity);
  //     window.removeEventListener("scroll", handleActivity);
  //   };
  // }, [inactiveTime]);

  const onClickClose = () => {
    hideModal("modalWarning");
  };

  const HeaderMengerjakanUjian = () => (
    <header>
      <nav
        className={`navbar-mengerjakan-ujian navbar navbar-ss navbar-expand-lg bg-gradient-primary ${
          width < 900 ? "" : "position-fixed"
        } w-100 px-sm-4 px-3 py-3`}
      >
        <div className="container d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-center align-items-stretch px-0">
          <div className="d-flex align-items-center">
            <Link href={`${ssURL}/jadwal-ujian/`} as={`${ssURL}/jadwal-ujian/`}>
              <a className="text-white">
                <FaChevronLeft />
              </a>
            </Link>
            <div className="ms-3">
              <h5 className="mb-1 text-white fw-extrabold sm-fs-6">
                {pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.nama}
              </h5>
              <p className="fs-14-ss fw-bold text-white mb-0">
                {pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tipeFormat}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-lg-0 mt-3">
            <div className="d-flex align-items-center me-4 text-white fw-bold ms-lg-0 ms-1">
              {detailPesertaUjianData?.pesertaUjian?.peringatan?.[0]?.dibaca ==
              1 ? (
                <FaBell
                  className="me-3"
                  onClick={handleDibacaPeringatan}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <FaBell
                    className="me-3"
                    onClick={handleDibacaPeringatan}
                    style={{ cursor: "pointer" }}
                  />
                  <Badge
                    count={
                      detailPesertaUjianData?.pesertaUjian?.meta?.belumDibaca
                    }
                    className="position-absolute"
                    size="5"
                    style={{ top: "-16px", right: "-6px" }}
                  />
                </div>
              )}
              <FaClock className="me-2" />
              <span className="waktu-ujian sm-fs-6">
                {pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup ? (
                  <>
                    <Countdown
                      value={pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup}
                      format="HH:mm:ss"
                      onFinish={() => handleFinishUjian("", 1)}
                    />
                    {" || "}
                    <Countdown
                      value={waktuUjianDitutup}
                      format="HH:mm:ss"
                      // onFinish={() => handleFinishUjian("", 1)}
                    />
                  </>
                ) : null}
              </span>
            </div>
            {sekolah?.id == 8123 || sekolah?.id == undefined ? (
              pesertaUjian?.meta?.totalSoal ==
              pesertaUjian?.meta?.totalDijawab ? (
                <button
                  className="btn btn-ss btn-success btn-success-ss rounded-pill fw-bold sm-fs-14-ss"
                  onClick={() => {
                    handleFinishUjian("checkRagu");
                    localStorage.removeItem("ss-token");
                  }}
                >
                  Selesai Ujian
                </button>
              ) : (
                <button
                  className="btn btn-ss btn-secondary btn-secondary-disable-ss rounded-pill fw-bold sm-fs-14-ss"
                  disabled
                >
                  Selesai Ujian
                </button>
              )
            ) : pesertaUjian?.meta?.totalSoal ==
              pesertaUjian?.meta?.totalDijawab ? (
              <button
                className="btn btn-ss btn-success btn-success-ss rounded-pill fw-bold sm-fs-14-ss"
                onClick={() => {
                  handleFinishUjian("checkRagu");
                }}
              >
                Selesai Ujian
              </button>
            ) : (
              <button
                className="btn btn-ss btn-secondary btn-secondary-disable-ss rounded-pill fw-bold sm-fs-14-ss"
                disabled
              >
                Selesai Ujian
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );

  const FooterMengerjakanUjian = () => (
    <div
      className="ujian-content-footer w-100 p-md-4 p-3 bg-very-soft-secondary"
      style={{ bottom: "0", zIndex: "100" }}
    >
      <div className="container d-flex flex-column align-items-strech px-0">
        <div className="form-check-ragu-ragu position-relative d-md-none d-flex flex-column">
          <input
            className="form-check-input form-check-input-salah me-3 p-2 rounded-circle position-absolute d-md-none d-inline-block "
            type="checkbox"
            value=""
            id="checkRaguRagu1"
            style={{
              width: "20px",
              height: "20px",
              top: "16%",
              left: "1em",
              transition: ".3s",
            }}
            checked={soalSiswa?.ragu}
          />
          <label
            className="form-check-label btn btn-warning btn-warning-ss rounded-pill p-0 d-md-none d-flex justify-content-center align-items-center fw-bold ps-3 sm-fs-14-ss"
            style={{ height: "40px" }}
            for="checkRaguRagu1"
            onClick={handleRagu}
          >
            Ragu Ragu
          </label>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary-ss border-light-secondary-ss rounded-pill p-0 d-flex justify-content-center align-items-center bg-white color-dark fw-bold me-md-0 me-2 mt-md-0 mt-3 sm-fs-14-ss"
            style={{ width: "160px", height: "40px" }}
            onClick={handleClickPrev}
          >
            Sebelumnya
          </button>
          <div className="form-check-ragu-ragu position-relative d-md-flex d-none">
            <input
              className="form-check-input form-check-input-salah me-3 p-2 rounded-circle position-absolute"
              type="checkbox"
              value=""
              id="checkRaguRagu"
              style={{
                width: "20px",
                height: "20px",
                top: "16%",
                left: "1em",
              }}
              checked={soalSiswa?.ragu}
            />
            <label
              className="form-check-label btn btn-w   arning btn-warning-ss rounded-pill p-0 d-md-flex d-none justify-content-center align-items-center fw-bold ps-3 sm-fs-14-ss"
              style={{ width: "160px", height: "40px" }}
              for="checkRaguRagu"
              onClick={handleRagu}
            >
              Ragu Ragu
            </label>
          </div>
          {pesertaUjian?.meta?.totalSoal == pesertaUjian?.meta?.totalDijawab &&
          soalIds?.[soalIds?.length - 1].id == soal ? (
            <button
              className=""
              style={{ width: "160px", height: "40px", opacity: "0" }}
              // onClick={() => handleFinishUjian("checkRagu")}
              // disabled={loadingButton}
            >
              {/* Selesai Ujian */}
            </button>
          ) : (
            // <></>
            <button
              className="btn btn-primary-ss bg-gradient-primary shadow-primary-ss border-light-secondary-ss rounded-pill p-0 d-flex justify-content-center align-items-center fw-bold mt-md-0 mt-3 sm-fs-14-ss"
              style={{ width: "160px", height: "40px" }}
              onClick={handleClickNext}
            >
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (detailPesertaUjianData?.pesertaUjian?.peringatan?.[0]?.jawaban === null) {
    showModal("modalPesanPeringatan");
  }
  return (
    <>
      <LoadingProgress progress={progress} />
      <HeaderMengerjakanUjian />
      <NewModal
        modalId="modalWarning"
        modalSize="lg"
        removeFooter={true}
        isModalWhite={true}
        isModalVerifikasi={true}
        // title={
        //   <>
        //     <h4 className="mb-1 fw-extrabold">Judul Folder</h4>
        //     <span className="fs-6 fw-normal">
        //      Dibawah ini adalah keterangan yang diberikan untuk siswa
        //    </span>
        //   </>
        // }
        content={
          <>
            <h4 className="fw-extrabold text-center color-dark mb-4">
              Peringatan
            </h4>
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6 col-sm-8">
                <img
                  src={`/img/warning-illustration.png`}
                  alt="illustration"
                  className="img-fluid mb-4"
                  // style={{ width: "275px", height: "200px" }}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={`col-md-8 text-center mb-4`}>
                <h6 className={`fs-18-ss md-fs-6 mb-4 fw-bold color-dark`}>
                  Dilarang Keluar dari Halaman Ujian
                </h6>
                <p className="fw-semibold text-center md-fs-14-ss text-start mb-0">
                  Anda sudah keluar sebanyak{" "}
                  <span className="fw-extrabold color-danger">
                    {warning} kali
                  </span>
                  .
                </p>
                <p className="fw-semibold text-center md-fs-14-ss text-start">
                  Dan akan terekam pada monitoring guru.
                </p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <button
                  className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                  type="button"
                  onClick={onClickClose}
                >
                  Lanjutkan Ujian
                </button>
              </div>
            </div>
          </>
        }
      />
      <AnimatePage>
        <main className="main-mengerjakan-ujian" style={{ paddingTop: "82px" }}>
          <div className="wrapper-fixed">
            <div className="container px-0">
              <div
                className={`list-nomor-ujian-wrapper w-100 bg-soft-primary pb-3 row m-0  ${
                  dropdownOpen ? "h-auto-ss" : ""
                }`}
                style={{ borderRadius: "0 0 10px 10px", transition: "0.3s" }}
              >
                <div
                  className={`list-nomor-ujian-container d-flex p-3 ps-sm-3 ps-2 col-sm-11 col-10 ${
                    dropdownOpen
                      ? "flex-wrap overflow-visible h-auto-ss"
                      : "flex-nowrap overflow-auto"
                  }`}
                  style={{ transition: "0.3s" }}
                >
                  {soalIds?.map((d, idx) => {
                    return (
                      <a
                        onClick={() => handleClickNoSoal(d.id)}
                        className={`${
                          soal == d.id
                            ? "soal-active"
                            : d.ragu
                            ? "bg-yellow text-white"
                            : d.dijawab
                            ? "bg-primary text-white"
                            : "color-secondary"
                        } text-decoration-none rounded-circle fw-bold d-flex justify-content-center align-items-center p-3 ${
                          dropdownOpen ? "mb-3 me-sm-3 me-2" : "me-sm-3 me-2"
                        }`}
                        style={{ width: "35px", height: "35px" }}
                      >
                        {idx + 1}
                      </a>
                    );
                  })}
                </div>
                <div className="list-nomor-ujian-dropdown col-sm-1 col-2 ps-0 py-3 d-flex justify-content-end pe-sm-3 pe-2">
                  <div
                    className="rounded-circle bg-primary shadow-primary-ss pointer text-white fw-bold d-flex justify-content-center align-items-center p-3 me-0"
                    style={{ width: "35px", height: "35px" }}
                    onClick={() => setdropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src="/img/arrow-bottom.svg"
                      alt=""
                      className={`${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                      style={{ transition: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading && <SkeletonSoal />}
          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "pg" && (
              <SoalPG
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
              />
            )}
          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "esai" && (
              <SoalEsai
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
                isLoadingUpdateJawaban={isLoadingUpdateJawaban}
              />
            )}
          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "isian" && (
              <SoalIsian
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
                isLoadingUpdateJawaban={isLoadingUpdateJawaban}
              />
            )}

          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "uraian" && (
              <SoalUraian
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
                isLoadingUpdateJawaban={isLoadingUpdateJawaban}
              />
            )}
          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "pg_kompleks" && (
              <SoalPGKompleks
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
              />
            )}
          {!loading &&
            soalSiswa?.soal?.bentuk?.toLowerCase().trim() == "menjodohkan" && (
              <SoalMenjodohkan
                soalSiswa={soalSiswa}
                handlePutJawabanSiswa={handlePutJawabanSiswa}
              />
            )}

          <FooterMengerjakanUjian />
        </main>
        <ModalLihatPesanPeringatanSiswa
          data1={pesanPeringatan}
          _getDetailPesertaUjianData={_getDetailPesertaUjianData}
        />
        <ModalPesanPeringatan
          peringatan={detailPesertaUjianData?.pesertaUjian?.peringatan?.[0]}
          _getDetailPesertaUjianData={_getDetailPesertaUjianData}
        />
      </AnimatePage>
    </>
  );
};

export async function getServerSideProps({ params: { id }, query: { soal } }) {
  return {
    props: {
      id,
      soal: soal || null,
    },
  };
}

export default index;
