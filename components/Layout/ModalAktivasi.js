import useWaBot from "hooks/useWhatsappBot";
import router from "next/router";
import React from "react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import InputCode from "../Shared/InputCode/InputCode";
import NewModal from "../Shared/NewModal/NewModal";

const ModalAktivasi = ({
  buttonAktivasi,
  isWhatsapp,
  formData,
  setFormData,
  sendActivation,
  aktifkan,
}) => {
  const { waBot } = useWaBot();
  return (
    <NewModal
      modalId={"modalAktivasi"}
      modalSize="lg"
      removeFooter={true}
      isModalWhite={true}
      isModalVerifikasi={true}
      content={
        <>
          {!formData.terkirim ? (
            <>
              {!isWhatsapp && (
                <h4 className="fw-extrabold text-center color-dark mb-4">
                  {isWhatsapp ? "Verifikasi WhatsApp" : "Verifikasi Email"}
                </h4>
              )}
              <div className="row justify-content-center">
                <div className="col-lg-4 col-6">
                  <img
                    src={
                      isWhatsapp
                        ? `/img/alert-verification.png`
                        : "/img/verification-code-send.png"
                    }
                    alt="illustration"
                    className="img-fluid mb-4"
                    style={{ width: "275px", height: "200px" }}
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div
                  className={`${
                    isWhatsapp ? "col-lg-8" : "col-lg-6"
                  } col-md-8 text-center mb-4`}
                >
                  <h6
                    className={`${
                      isWhatsapp ? "fs-4 mb-4" : "fs-18-ss"
                    } fw-bold color-dark`}
                  >
                    {isWhatsapp
                      ? "Demi keamanan dan kenyamanan Anda tambahkan nomor WhatsApp dan email"
                      : "Masukkan alamat email Anda"}
                  </h6>
                  {isWhatsapp ? (
                    <div>
                      <div className="row mb-4">
                        <div className="d-flex">
                          <img
                            src="/img/bell-whatsapp.svg"
                            alt="Bell"
                            className="img-fluid me-3"
                            style={{ height: "50px", width: "50px" }}
                          />
                          <p className="fw-semibold md-fs-14-ss text-start">
                            Nomor WhatsApp digunakan untuk memberikan notifikasi
                            terkait aktivitas di Smarteschool.
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
                            Email digunakan untuk mendapatkan keamanan lanjutan
                            dan pemulihan akun Anda.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="fw-semibold md-fs-14-ss mb-0">
                      Kami akan mengirimkan 6 digit kode aktivasi melalui{" "}
                      {isWhatsapp ? "WhatsApp." : "email."}
                    </p>
                  )}
                </div>
              </div>
              {!isWhatsapp && (
                <div className="row justify-content-center mb-5">
                  <div className="col-lg-6 col-md-8">
                    {isWhatsapp ? (
                      // <input
                      //   className="form-control"
                      //   autoComplete="off"
                      //   placeholder="Contoh: 0811223344556"
                      //   type="text"
                      //   name="whatsapp"
                      //   value={formData.whatsapp}
                      //   onChange={(e) =>
                      //     setFormData({ ...formData, whatsapp: e.target.value })
                      //   }
                      // />
                      <></>
                    ) : (
                      <input
                        className="form-control"
                        autoComplete="off"
                        placeholder="Contoh: email@email.com"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                  {isWhatsapp ? (
                    <button
                      className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                      type="button"
                      onClick={() => sendActivation(1)}
                    >
                      Lanjutkan
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                      type="button"
                      onClick={() => sendActivation()}
                    >
                      Dapatkan Kode Verifikasi
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {isWhatsapp ? (
                <>
                  <h4 className="fw-extrabold text-center color-dark mb-3">
                    Masukkan Kode Verifikasi
                  </h4>
                  <div className="row justify-content-center mb-2">
                    <div
                      className="col-lg-6 col-md-8 rounded-ss d-flex justify-content-center py-3 position-relative"
                      style={{
                        backgroundColor: "#F4F4F7",
                      }}
                    >
                      {formData?.data}
                      <a
                        className="text-decoration-none color-secondary d-flex align-items-center justify-content-center position-absolute"
                        onClick={() => (
                          navigator.clipboard.writeText(formData?.data),
                          toast.success("Kode tersalin")
                        )}
                        style={{
                          right: "16px",
                          width: "40px",
                          height: "40px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <FaCopy className="fs-4" />
                      </a>
                    </div>
                  </div>
                  <div className="row justify-content-center mb-5">
                    <a
                      onClick={() => sendActivation(1)}
                      className="col-lg-6 col-md-8 color-primary text-decoration-none text-center"
                    >
                      Atur ulang kode verifikasi
                    </a>
                  </div>
                  <div className="row justify-content-center mb-4">
                    <div className="col-lg-6 col-md-8">
                      <p className="fw-bold color-dark mb-3">
                        Langkah - Langkah :
                      </p>
                      <p className="fw-semibold mb-3 d-flex">
                        <span
                          className="rounded-circle fs-12-ss d-flex align-items-center justify-content-center bg-soft-primary color-primary p-2 me-3"
                          style={{ width: "24px", height: "24px" }}
                        >
                          1
                        </span>{" "}
                        Salin kode verifikasi
                      </p>
                      <div className="mb-3 d-flex align-items-center">
                        <span
                          className="fw-semibold rounded-circle fs-12-ss d-flex align-items-center justify-content-center bg-soft-primary color-primary p-2 me-3"
                          style={{ width: "24px", height: "24px" }}
                        >
                          2
                        </span>{" "}
                        <p className="mb-0">
                          Kirim ke WhatsApp
                          <span className="fw-bold"> 0831 8736 0311</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center mb-5">
                    <div
                      className="col-lg-6 col-md-8 rounded-ss d-flex flex-column p-4 position-relative color-warning"
                      style={{
                        backgroundColor: "#FCE8D2",
                      }}
                    >
                      <div className="d-flex align-items-start">
                        <span
                          className="rounded-circle bg-warning p-1"
                          style={{
                            width: "7px",
                            height: "7px",
                            marginTop: "5px",
                          }}
                        ></span>
                        <p className="ms-2 fw-semibold d-flex fs-14-ss">
                          Pastikan mengirim kode verifikasi melalui nomor
                          WhatsApp yang aktif.
                        </p>
                      </div>
                      <div className="d-flex align-items-start">
                        <span
                          className="rounded-circle bg-warning p-1"
                          style={{
                            width: "7px",
                            height: "7px",
                            marginTop: "5px",
                          }}
                        ></span>
                        <p className="ms-2 fw-semibold mb-0 d-flex fs-14-ss">
                          Notifikasi dan Reset Password akan dikirim ke nomor
                          WhatsApp yang Anda berikan.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row justify-content-center mb-5">
                    <div className="col-lg-6 col-md-8 d-flex flex-column">
                      <span className="text-break">
                        Berikut template aktivasi whatsapp anda :{" "}
                        {formData?.data}
                        <a
                          onClick={() =>
                            navigator.clipboard.writeText(formData?.data)
                          }
                          className="color-primary text-decoration-none"
                        >
                          copy
                        </a>
                      </span>
                    </div>
                  </div> */}
                  <div className="row justify-content-center mb-5">
                    <div className="col-lg-6 col-md-8 d-flex flex-column">
                      <ReactiveButton
                        buttonState={buttonAktivasi}
                        idleText={"Sudah Verifikasi"}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss"
                        }
                        onClick={() => router.reload()}
                      />
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <p className="fs-14-ss fw-semibold mb-1">
                      Tidak mendapatkan kode?
                    </p>
                    <p className="fs-14-ss fw-semibold">
                      <a
                        onClick={() => sendActivation(1)}
                        className="color-primary text-decoration-none"
                      >
                        Kirim kode lagi
                      </a>{" "}
                    </p>
                  </div> */}
                </>
              ) : (
                <>
                  <h4 className="fw-extrabold text-center color-dark mb-4">
                    Kode Verifikasi Sudah Terkirim
                  </h4>
                  <div className="row justify-content-center">
                    <div className="col-lg-4 col-6">
                      <img
                        src={`/img/verification-code.png`}
                        alt="illustration"
                        className="img-fluid mb-4"
                      />
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 text-center mb-4">
                      <h6 className="fs-18-ss fw-bold color-dark">
                        Masukkan kode verifikasi
                      </h6>
                      <p className="fw-semibold md-fs-14-ss mb-0">
                        Kode verifikasi telah dikirimkan melalui {""}
                        {isWhatsapp ? "WhatsApp ke nomor" : "email ke"}
                      </p>
                    </div>
                  </div>
                  <div className="row justify-content-center mb-5">
                    <div className="col-lg-6 col-md-8">
                      <form
                        onSubmit={(event) => (
                          event.preventDefault(), aktifkan()
                        )}
                      >
                        <InputCode
                          length={6}
                          label="Kode Verifikasi"
                          loading={buttonAktivasi == "loading"}
                          onComplete={(code) =>
                            setFormData({ ...formData, code: code })
                          }
                        />
                      </form>
                    </div>
                  </div>
                  <div className="row justify-content-center mb-5">
                    <div className="col-lg-6 col-md-8 d-flex flex-column">
                      <ReactiveButton
                        buttonState={buttonAktivasi}
                        idleText={"Verifikasi"}
                        loadingText={"Diproses"}
                        successText={"Berhasil"}
                        errorText={"Gagal"}
                        type={"button"}
                        className={
                          "btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss"
                        }
                        onClick={() => aktifkan()}
                      />
                    </div>
                  </div>
                  {/* <div className="text-center">
                    <p className="fs-14-ss fw-semibold mb-1">
                      Tidak mendapatkan kode?
                    </p>
                    <p className="fs-14-ss fw-semibold">
                      <a
                        onClick={() => sendActivation()}
                        className="color-primary text-decoration-none"
                      >
                        Kirim kode lagi
                      </a>{" "}
                      atau{" "}
                      <a
                        className="color-primary text-decoration-none"
                        onClick={() =>
                          setFormData({ ...formData, terkirim: 0 })
                        }
                      >
                        Ganti {isWhatsapp ? "nomor" : "email"}
                      </a>{" "}
                    </p>
                  </div> */}
                </>
              )}
            </>
          )}
        </>
      }
    />
  );
};

export default ModalAktivasi;
