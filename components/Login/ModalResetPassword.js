import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";

const ModalResetPassword = ({ _requestResetPassword, success, loading }) => {
  return (
    <>
      <NewModal
        modalId="modalResetPassword"
        modalSize="md"
        isModalWhite={true}
        content={
          <>
            <h4 className="fw-extrabold text-center color-dark mb-4">
              Lupa Password
            </h4>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-8">
                <img
                  src={`/img/${
                    success ? "link-terkirim.png" : "mengirim-link.png"
                  }`}
                  alt="illustration"
                  className="img-fluid mb-4"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-10 text-center mb-5">
                <h6 className="fs-18-ss fw-bold color-dark">
                  {success ? "Cek WhatsApp Anda" : "Atur Ulang Password"}
                </h6>
                <p className="fw-semibold md-fs-14-ss">
                  {success
                    ? "Kami sudah mengirimkan link akses melalui WhatsApp anda."
                    : "Tekan tombol di bawah agar mendapatkan link akses untuk mengatur ulang password anda."}
                </p>
              </div>
              <div className="col-md-10">
                {success ? (
                  <a
                    href="https://web.whatsapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ss btn-primary btn-primary-ss w-100 rounded-ss fw-bold mb-4"
                  >
                    Lihat WhatsApp
                  </a>
                ) : (
                  <button
                    className="btn btn-ss btn-primary btn-primary-ss w-100 rounded-ss fw-bold mb-4"
                    onClick={() => _requestResetPassword()}
                    disabled={loading}
                  >
                    Dapatkan Link Akses
                  </button>
                )}
              </div>
            </div>
            {/* <div className="">
              <div className="mx-auto">
                <p className="mx-auto">Reset Password</p>
                <button
                  className="btn btn-ss btn-primary"
                  onClick={() => _requestResetPassword()}
                >
                  Kirim Link
                </button>
              </div>
            </div> */}
          </>
        }
        removeFooter={true}
      />
    </>
  );
};

export default ModalResetPassword;
