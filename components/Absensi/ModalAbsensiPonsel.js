import useWaBot from "hooks/useWhatsappBot";
import router from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import InputCode from "../Shared/InputCode/InputCode";
import NewModal from "../Shared/NewModal/NewModal";

const ModalAbsensiPonsel = ({}) => {
  const { waBot } = useWaBot();
  return (
    <NewModal
      modalId={"modalAbsensiPonsel"}
      modalSize="lg"
      removeFooter={true}
      isModalWhite={true}
      isModalVerifikasi={true}
      content={
        <>
          {/* <h4 className="fw-extrabold text-center color-dark mb-4">
            Verifikasi WhatsApp
          </h4> */}
          <div className="row justify-content-center">
            <div className="col-lg-4 col-6">
              <img
                src={`/img/absensi-ponsel.png`}
                alt="illustration"
                className="img-fluid mb-4"
                // style={{ width: "275px", height: "200px" }}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className={`col-lg-8 col-md-8 text-center mb-4`}>
              <h6 className={`fs-4 mb-4 fw-bold color-dark`}>
                Lakukan Absensi Pada Ponsel Anda
              </h6>
              <div>
                <div className="row mb-4">
                  <div className="d-flex">
                    <img
                      src="/img/icon-gps.svg"
                      alt="Bell"
                      className="img-fluid me-3"
                      style={{ height: "50px", width: "50px" }}
                    />
                    <p className="fw-semibold md-fs-14-ss text-start">
                      Aktifkan fitur GPS yang terdapat di ponsel Anda untuk
                      mendapatkan lokasi yang lebih akurat.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex align-items-center">
                    <img
                      src="/img/icon-setting-browser.svg"
                      alt="Bell"
                      className="img-fluid me-3"
                      style={{ height: "50px", width: "50px" }}
                    />
                    <p className="fw-semibold md-fs-14-ss text-start mb-0">
                      Mengizinkan browser untuk mengakses lokasi Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <button
                className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                type="button"
                onClick={() => hideModal("modalAbsensiPonsel")}
              >
                Lanjutkan
              </button>
            </div>
          </div>
        </>
      }
    />
  );
};

export default ModalAbsensiPonsel;
