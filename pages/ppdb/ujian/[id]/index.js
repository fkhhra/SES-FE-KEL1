import Countdown from "antd/lib/statistic/Countdown";
import { ppdbURL } from "client/clientAxios";
import {
  editJawabanUjianSiswa,
  editPesertaUjian,
  getDetailPesertaUjian,
} from "client/PesertaUjianClient";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import SkeletonSoal from "components/Shared/Skeleton/SkeletonSoal";
import SoalEsai from "components/Ujian/SoalEsai";
import SoalMenjodohkan from "components/Ujian/SoalMenjodohkan";
import SoalPG from "components/Ujian/SoalPG";
import SoalPGKompleks from "components/Ujian/SoalPGKompleks";
import SoalUraian from "components/Ujian/SoalUraian";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft, FaClock } from "react-icons/fa";
import { putJadwalUjianRef } from "services/jadwalUjianService";
import swal from "sweetalert";
import { momentPackage } from "utilities/HelperUtils";

const index = ({ id, soal }) => {
  const initialStateForm = {
    jawabanPg: "",
    ragu: 0,
  };

  const [durasi, setDurasi] = useState(0);

  const [formData, setFormData] = useState(initialStateForm);

  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [detailPesertaUjianData, setDetailPesertaUjianData] = useState({});
  const { soalIds, pesertaUjian, soalSiswa } = detailPesertaUjianData;
  const router = useRouter();

  const [isLoadingUpdateJawaban, setIsLoadingUpdateJawaban] = useState("idle");

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

  const handlePutJawabanSiswa = async ({
    jawabanPg,
    jawabanEsai,
    jawabanOpsiUraian,
    jawabanPgKompleks,
    jawabanMenjodohkan,
    jawabanUraian,
    // jawabanFoto,
  }) => {
    setIsLoadingUpdateJawaban("loading");
    const payload = {
      durasi: new Date().getTime() - durasi,
      jawabanPg: jawabanPg,
    };

    if (jawabanEsai) {
      delete payload.jawabanPg;
      payload.jawabanEsai = jawabanEsai;
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
      putJadwalUjianRef(data);
      setIsLoadingUpdateJawaban("success");
    } else {
      setIsLoadingUpdateJawaban("error");
    }
  };

  const [loading, setLoading] = useState(true);

  const _getDetailPesertaUjianData = async (haveLoading = true) => {
    haveLoading && setLoading(true);
    const { data } = await getDetailPesertaUjian(id, {
      jawabanSiswaId: soal,
      ppdb: 1,
    });

    if (data) {
      setLoading(false);
      if (!soal) {
        router.push(`${ppdbURL}/ujian/${id}?soal=${data?.soalIds?.[0]?.id}`);
      }
      setDetailPesertaUjianData(data);
      setDurasi(new Date().getTime());
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
        //   `${ppdbURL}/ujian/${id}?soal=${
        //     soalIds[currentSoal - 1]?.id
        //   }`
        // );
        window.location.href = `${ppdbURL}/ujian/${id}?soal=${
          soalIds[currentSoal - 1]?.id
        }`;
      }, 600);
    } else {
      router.push(
        `${ppdbURL}/ujian/${id}?soal=${soalIds[currentSoal - 1]?.id}`
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
        //   `${ppdbURL}/ujian/${id}?soal=${
        //     soalIds[currentSoal + 1]?.id
        //   }`
        // );
        window.location.href = `${ppdbURL}/ujian/${id}?soal=${
          soalIds[currentSoal + 1]?.id
        }`;
      }, 600);
    } else {
      router.push(
        `${ppdbURL}/ujian/${id}?soal=${soalIds[currentSoal + 1]?.id}`
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
        // router.push(`${ppdbURL}/ujian/${id}?soal=${soal_id}`);
        window.location.href = `${ppdbURL}/ujian/${id}?soal=${soal_id}`;
      }, 600);
    } else {
      router.push(`${ppdbURL}/ujian/${id}?soal=${soal_id}`);
    }
  };

  const handleFinishUjian = async (checkRagu) => {
    setLoadingButton(true);
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
      router.push(
        redirectUrl ? redirectUrl : `${ppdbURL}/ujian?subnav=berlangsung`
      );
      localStorage.removeItem("redirectUrl");
    }
  };

  // useEffect(() => _getDetailPesertaUjianData(), [soal]);
  useEffect(() => {
    _getDetailPesertaUjianData();
  }, [soal]);

  useEffect(() => {
    if (pesertaUjian) {
      if (
        (pesertaUjian?.jadwalUjian &&
          pesertaUjian?.jadwalUjian?.jadwalUjian &&
          pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup &&
          moment(pesertaUjian?.jadwalUjian?.jadwalUjian?.waktuDitutup) <
            moment()) ||
        pesertaUjian?.waktuSelesai
      ) {
        handleFinishUjian();
        // router.push(`${ssURL}/jadwal-ujian?subnav=berlangsung`);
      }
    }
  }, [pesertaUjian]);

  const HeaderMengerjakanUjian = () => (
    <header>
      <nav className="navbar-mengerjakan-ujian navbar navbar-ss navbar-expand-lg bg-gradient-primary position-fixed w-100 px-sm-4 px-3 py-3">
        <div className="container d-flex flex-lg-row flex-column justify-content-lg-between align-items-lg-center align-items-stretch px-0">
          <div className="d-flex align-items-center">
            <Link href={`${ppdbURL}/ujian/`} as={`${ppdbURL}/ujian/`}>
              <a className="text-white">
                <FaChevronLeft />
              </a>
            </Link>
            <div className="ms-3">
              <h5 className="mb-1 text-white fw-extrabold sm-fs-6">
                {pesertaUjian?.pesertaPPDB?.jadwalPpdb?.soal?.nama}
              </h5>
              <p className="fs-14-ss fw-bold text-white mb-0">
                {pesertaUjian?.pesertaPPDB?.jadwalPpdb?.soal?.tipeFormat}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-lg-0 mt-3">
            <div className="d-flex align-items-center me-4 text-white fw-bold ms-lg-0 ms-1">
              <FaClock className="me-2" />
              <span className="waktu-ujian sm-fs-6">
                {pesertaUjian?.pesertaPPDB?.jadwalPpdb?.waktuDitutup ? (
                  <Countdown
                    value={moment(
                      pesertaUjian?.pesertaPPDB?.jadwalPpdb?.waktuDitutup
                    )}
                    format="HH:mm:ss"
                    onFinish={handleFinishUjian}
                  />
                ) : null}
              </span>
            </div>
            {pesertaUjian?.meta?.totalSoal ==
            pesertaUjian?.meta?.totalDijawab ? (
              <button
                className="btn btn-ss btn-success btn-success-ss rounded-pill fw-bold sm-fs-14-ss"
                onClick={() => handleFinishUjian("checkRagu")}
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
              className="form-check-label btn btn-warning btn-warning-ss rounded-pill p-0 d-md-flex d-none justify-content-center align-items-center fw-bold ps-3 sm-fs-14-ss"
              style={{ width: "160px", height: "40px" }}
              for="checkRaguRagu"
              onClick={handleRagu}
            >
              Ragu Ragu
            </label>
          </div>
          {pesertaUjian?.meta?.totalSoal == pesertaUjian?.meta?.totalDijawab ? (
            <button
              className="btn btn-success btn-success-ss bg-gradient-success shadow-success-ss border-light-secondary-ss rounded-pill p-0 d-flex justify-content-center align-items-center fw-bold mt-md-0 mt-3 sm-fs-14-ss"
              style={{ width: "160px", height: "40px" }}
              onClick={() => handleFinishUjian("checkRagu")}
              disabled={loadingButton}
            >
              Selesai Ujian
            </button>
          ) : (
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

  return (
    <>
      <HeaderMengerjakanUjian />
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
