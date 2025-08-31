import React, { useState, useEffect } from "react";
import { hideModal } from "utilities/ModalUtils";
import {
  postNaikKelasJadwal,
  postNaikKelasJam,
  postNaikKelasJam1,
  postNaikKelasMapel,
  postNaikKelasMapel1,
  postNaikKelasRombel,
  postNaikKelasRombel1,
} from "client/TaClient";

import ctl from "@netlify/classnames-template-literals";
import toast from "react-hot-toast";

import NewModal from "components/Shared/NewModal/NewModal";
import Spinner from "components/Shared/Spinner/Spinner";
import { momentPackage } from "utilities/HelperUtils";

const ModalSiapkanTahunAkademik = ({ getTaData, ta, status, setStatus }) => {
  const [currentStep, setCurrentStep] = useState("Konfirmasi");
  const [
    prosesMenyiapkanDataSedangBerlangsung,
    setProsesMenyiapkanDataSedangBerlangsung,
  ] = useState(false);

  const { jamSinkron, mapelSinkron, rombelSinkron, jadwalSinkron } =
    ta?.[0] || {};
  let sudahSinkronSemua =
    jamSinkron == 1 &&
    mapelSinkron == 1 &&
    rombelSinkron == 1 &&
    jadwalSinkron == 1;

  const changeStatus = (key, value) => {
    setStatus((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onClickPrimaryButton = () => {
    if (currentStep == "Konfirmasi") {
      setCurrentStep("Proses Menyiapkan Data");
      getAllData();
      return;
    }

    if (currentStep == "Proses Menyiapkan Data") {
      hideModal("modalSiapkanTahunAkademik");
      setCurrentStep("Konfirmasi");
    }
  };

  const getAllData = async () => {
    setProsesMenyiapkanDataSedangBerlangsung(true);
    if (status.jamMengajar != "done") {
      await _postNaikKelasJam();
    }

    if (status.mapel != "done") {
      await _postNaikKelasMapel();
    }

    if (status.rombel != "done") {
      await _postNaikKelasRombel();
    }

    if (
      status.jadwalMengajar != "done" &&
      (ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "ganjil" ||
        ta?.[0]?.semester == "Ganjil") &&
      momentPackage().format("MM") >= "01" &&
      momentPackage().format("MM") <= "06"
    ) {
      await _postNaikKelasJadwal();
    }
    setProsesMenyiapkanDataSedangBerlangsung(false);
  };

  const _postNaikKelasJam = async () => {
    changeStatus("jamMengajar", "fetching");

    const { data, error } =
      (ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "ganjil" ||
        ta?.[0]?.semester == "Ganjil") &&
      momentPackage().format("MM") >= "01" &&
      momentPackage().format("MM") <= "06"
        ? await postNaikKelasJam()
        : await postNaikKelasJam1();
    if (data) {
      toast.success(data?.message);
      changeStatus("jamMengajar", "done");
    } else {
      toast.error(error?.message);
    }
  };

  const _postNaikKelasMapel = async () => {
    changeStatus("mapel", "fetching");

    const { data, error } =
      (ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "ganjil" ||
        ta?.[0]?.semester == "Ganjil") &&
      momentPackage().format("MM") >= "01" &&
      momentPackage().format("MM") <= "06"
        ? await postNaikKelasMapel()
        : await postNaikKelasMapel1();
    if (data) {
      toast.success(data?.message);
      changeStatus("mapel", "done");
    } else {
      toast.error(error?.message);
    }
  };

  const _postNaikKelasRombel = async () => {
    changeStatus("rombel", "fetching");

    const { data, error } =
      (ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "ganjil" ||
        ta?.[0]?.semester == "Ganjil") &&
      momentPackage().format("MM") >= "01" &&
      momentPackage().format("MM") <= "06"
        ? await postNaikKelasRombel()
        : await postNaikKelasRombel1();
    if (data) {
      toast.success(data?.message);
      changeStatus("rombel", "done");
    } else {
      toast.error(error?.message);
    }
  };

  const _postNaikKelasJadwal = async () => {
    changeStatus("jadwalMengajar", "fetching");

    const { data, error } = await postNaikKelasJadwal();
    if (data) {
      toast.success(data?.message);
      changeStatus("jadwalMengajar", "done");
    } else {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (
      status.jamMengajar == "done" &&
      status.mapel == "done" &&
      status.rombel == "done" &&
      ((ta?.[0]?.semester == 1 ||
        ta?.[0]?.semester == "ganjil" ||
        ta?.[0]?.semester == "Ganjil") &&
      momentPackage().format("MM") >= "01" &&
      momentPackage().format("MM") <= "06"
        ? status.jadwalMengajar == "done"
        : "")
    ) {
      getTaData();
    }
  }, [status]);

  useEffect(() => {
    if (ta?.length > 0) {
      setStatus({
        jamMengajar: !sudahSinkronSemua && jamSinkron == 1 ? "done" : "waiting",
        mapel: !sudahSinkronSemua && mapelSinkron == 1 ? "done" : "waiting",
        rombel: !sudahSinkronSemua && rombelSinkron == 1 ? "done" : "waiting",
        jadwalMengajar:
          !sudahSinkronSemua && jadwalSinkron == 1 ? "done" : "waiting",
      });
    }
  }, [ta?.length > 0]);

  useEffect(() => {
    if (prosesMenyiapkanDataSedangBerlangsung) {
      const unloadCallback = (event) => {
        event.preventDefault();
        event.returnValue = "";
        return "";
      };

      window.addEventListener("beforeunload", unloadCallback);
      return () => window.removeEventListener("beforeunload", unloadCallback);
    }
  }, [prosesMenyiapkanDataSedangBerlangsung]);

  return (
    <NewModal
      modalId={"modalSiapkanTahunAkademik"}
      modalSize="lg"
      removeFooter
      isModalWhite
      isModalVerifikasi
      content={
        <div style={{ marginTop: "-50px" }}>
          <div className="row justify-content-center">
            <div className="col-lg-4 col-6">
              <img
                src="/img/alert-verification.png"
                alt="illustration"
                className="img-fluid mb-4"
                style={{ width: "275px", height: "200px" }}
              />
            </div>
          </div>

          {currentStep == "Konfirmasi" && (
            <div className="row justify-content-center">
              <div className="col-lg-10 col-md-8 text-center mb-4">
                <h6 className="fs-4 mb-4 fw-bold color-dark">
                  Proses menyiapkan data akan memakan waktu. Pastikan untuk
                  memperhatikan hal - hal ini :
                </h6>
                <div className="row mb-4">
                  <div className="d-flex">
                    <img
                      src="/img/bell-whatsapp.svg"
                      alt="Bell"
                      className="img-fluid me-3"
                      style={{ height: "50px", width: "50px" }}
                    />
                    <p className="fw-semibold md-fs-14-ss text-start">
                      Koneksi internet dalam keadaan baik dan stabil selama
                      proses sinkronisasi berlangsung
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex">
                    <img
                      src="/img/lock-whatsapp.svg"
                      alt="Bell"
                      className="img-fluid me-3"
                      style={{ height: "50px", width: "50px" }}
                    />
                    <p className="fw-semibold md-fs-14-ss text-start">
                      Tidak menutup aplikasi Smarteschool dan menunggu tahapan
                      proses sinkronisasi hingga selesai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep == "Proses Menyiapkan Data" && (
            <div className="row justify-content-center">
              <div
                className="col-lg-10 col-md-8 text-center"
                style={{ marginBottom: "24px" }}
              >
                <h6 className="fs-4 fw-bold color-dark mb-0">
                  Proses menyiapkan data sedang berlangsung
                </h6>
              </div>
              <CardInfo
                text="Jam Mengajar"
                img={
                  status.jamMengajar == "waiting"
                    ? "/img/icon-jam-gray.svg"
                    : status.jamMengajar == "done"
                    ? "/img/icon-jam-green.svg"
                    : "/img/icon-jam-blue.svg"
                }
                status={status.jamMengajar}
                style={{ marginBottom: "16px" }}
              />
              <CardInfo
                text="Mapel"
                img={
                  status.mapel == "waiting"
                    ? "/img/icon-mapel-gray.svg"
                    : status.mapel == "done"
                    ? "/img/icon-mapel-green.svg"
                    : "/img/icon-mapel-blue.svg"
                }
                status={status.mapel}
                style={{ marginBottom: "16px" }}
              />
              <CardInfo
                text="Rombel"
                img={
                  status.rombel == "waiting"
                    ? "/img/icon-rombel-gray.svg"
                    : status.rombel == "done"
                    ? "/img/icon-rombel-green.svg"
                    : "/img/icon-rombel-blue.svg"
                }
                status={status.rombel}
                style={{ marginBottom: "16px" }}
              />
              {(ta?.[0]?.semester == 1 ||
                ta?.[0]?.semester == "ganjil" ||
                ta?.[0]?.semester == "Ganjil") &&
              momentPackage().format("MM") >= "01" &&
              momentPackage().format("MM") <= "06" ? (
                <CardInfo
                  text="Jadwal Mengajar"
                  img={
                    status.jadwalMengajar == "waiting"
                      ? "/img/icon-jadwal-mengajar-gray.svg"
                      : status.jadwalMengajar == "done"
                      ? "/img/icon-jadwal-mengajar-green.svg"
                      : "/img/icon-jadwal-mengajar-blue.svg"
                  }
                  status={status.jadwalMengajar}
                />
              ) : (
                ""
              )}
            </div>
          )}

          <div
            className="row justify-content-center"
            style={{ marginTop: "24px" }}
          >
            <div className="col-lg-6 col-md-8">
              <button
                className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                type="button"
                onClick={onClickPrimaryButton}
                disabled={
                  currentStep == "Proses Menyiapkan Data"
                    ? (ta?.[0]?.semester == 1 ||
                        ta?.[0]?.semester == "ganjil" ||
                        ta?.[0]?.semester == "Ganjil") &&
                      momentPackage().format("MM") >= "01" &&
                      momentPackage().format("MM") <= "06"
                      ? status.jadwalMengajar != "done" ||
                        status.rombel != "done" ||
                        status.jamMengajar != "done" ||
                        status.mapel != "done"
                      : status.rombel != "done" ||
                        status.jamMengajar != "done" ||
                        status.mapel != "done"
                    : false
                }
              >
                {currentStep == "Konfirmasi" ? "Lanjutkan" : "Selesai"}
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
};

// status = waiting, fetching, done

const CardInfo = ({ text, img, status, style = {} }) => {
  const cardContentCN = ctl(`
    d-flex
    align-items-center
    justify-content-between
    rounded-ss
    ${
      status == "waiting"
        ? "bg-soft-secondary"
        : status == "fetching"
        ? "bg-soft-primary"
        : status == "done" && "bg-soft-success"
    }
  `);

  const cardTextCN = ctl(`
    fw-bold
    fs-18-ss
    mb-0
    ${
      status == "waiting"
        ? "color-secondary"
        : status == "fetching"
        ? "color-primary"
        : status == "done" && "color-success"
    }
  `);

  return (
    <div className="col-lg-7 col-md-8 text-center" style={style}>
      <div
        className={cardContentCN}
        style={{ height: 56, padding: "12px 24px" }}
      >
        <div className="d-flex align-items-center">
          <img src={img} style={{ marginRight: "16px" }} />
          <p className={cardTextCN}>{text}</p>
        </div>
        {status == "fetching" ? (
          <Spinner />
        ) : (
          status == "done" && <img src="/img/icon-checklist-green.svg" />
        )}
      </div>
    </div>
  );
};

export default ModalSiapkanTahunAkademik;
