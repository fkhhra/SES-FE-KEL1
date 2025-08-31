import { downloadURL } from "client/clientAxios";
import { downloadKartuSoal } from "client/UjianClient";
import NewModal from "components/Shared/NewModal/NewModal";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { momentPackage } from "utilities/HelperUtils";

const ModalDownloadKartuSoal = ({ id }) => {
  const [downloadingKartu, setDownloadingKartu] = useState(false);

  const handleClickDownloadKartuSoal = async (tipe) => {
    // if (
    //   momentPackage().hour() > 11 ||
    //   momentPackage().hour() < 6 ||
    //   tipe == "template" ||
    //   momentPackage().day() == 0 ||
    //   momentPackage().day() == 6
    // ) {
    setDownloadingKartu(true);
    const toastloading = toast.loading("Downloading");
    const { data, error } = await downloadKartuSoal(id, tipe);

    if (data) {
      document.getElementById("downloadIframe").src = `${downloadURL}/${data}`;
      setDownloadingKartu(false);
      toast.success("Downloaded", { id: toastloading });
    } else if (error) {
      toast.error("silahkan Coba beberapa saat lagi");
      toast.error("Error", { id: toastloading });
      setDownloadingKartu(false);
    }
    // } else {
    //   toast.error("Fitur Aktif Pukul 12.00 - 06.00");
    //   return false;
    // }
  };
  return (
    <NewModal
      modalId="downloadKartuSoal"
      removeFooter={1}
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Kartu Soal</h4>
          {/* <span className="fs-6 fw-normal">Fitur Aktif 12.00 - 06.00</span> */}
        </>
      }
      content={
        <>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Template import Soal</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("template")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">
                    Template import soal
                  </span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">
                    Template import soal
                  </span>
                </p>
              </a>
            )}
          </div>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Kartu Soal PG</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("pg")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kartu Soal PG</span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kartu Soal PG</span>
                </p>
              </a>
            )}
          </div>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Kartu Soal Esai</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("esai")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kartu Soal Esai</span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kartu Soal Esai</span>
                </p>
              </a>
            )}
          </div>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Kisi-kisi Soal</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("kisi")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kisi-kisi Soal</span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Kisi-kisi Soal</span>
                </p>
              </a>
            )}
          </div>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Naskah Soal</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("naskah")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Naskah Soal</span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Naskah Soal</span>
                </p>
              </a>
            )}
          </div>
          <div className="mb-3">
            <h5 className="fw-bold color-dark">Rumusan Soal</h5>
            {!downloadingKartu ? (
              <a
                className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                onClick={() => handleClickDownloadKartuSoal("rumusan")}
                disabled={downloadingKartu}
              >
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Rumusan Soal</span>
                </p>
              </a>
            ) : (
              <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                <img src="/img/icon-file-download.svg" alt="" />
                <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                  Klik untuk mengunduh{" "}
                  <span className="color-primary fw-bold">Rumusan Soal</span>
                </p>
              </a>
            )}
          </div>
        </>
      }
    />
  );
};

export default ModalDownloadKartuSoal;
