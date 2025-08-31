import { motion } from "framer-motion";
import Link from "next/link";
import { FaAngleLeft, FaChevronLeft } from "react-icons/fa";

import AuthLayout from "../../../../components/Layout/AuthLayout";
import { useEffect, useState } from "react";
import { axiosInstance, baseURL, ssURL } from "../../../../client/clientAxios";
import ReactiveButton from "reactive-button";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { meSekolah } from "../../../../client/SekolahClient";
import NewModal from "components/Shared/NewModal/NewModal";
import { hideModal, showModal } from "utilities/ModalUtils";
import { changePassword, changePasswordLogin } from "client/sharedClient";
import { momentPackage } from "utilities/HelperUtils";

const initialFormData = {
  konfirmasiPassword: "",
  passwordBaru: "",
  // passwordLama: "",
  lihatPasswordLama: false,
  lihatPasswordBaru: false,
  lihatKonfirmasiPassword: false,
};
const index = ({ role }) => {
  const router = useRouter();

  const currentPath = router.asPath;

  const initialState = { whatsapp: "", btn: "idle" };
  const [trueRole, setTrueRole] = useState("");

  const [stateForm, setStateForm] = useState(initialState);
  const [formData, setFormData] = useState(initialFormData);

  const [meSekolahData, setMeSekolahData] = useState({});
  const { integrasi, sekolah } = meSekolahData;

  const handleChangePassword = (e) => {
    const checkbox = [
      "lihatPasswordLama",
      "lihatPasswordBaru",
      "lihatKonfirmasiPassword",
    ];

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (checkbox.includes(e.target.id)) {
      setFormData({
        ...formData,
        [e.target.id]: !formData[e.target.id],
      });
    }
  };

  const handleSubmitPassword = async () => {
    const { data, error } = await changePasswordLogin({
      whatsapp: stateForm.whatsapp,
      password_baru: formData?.passwordBaru,
    });
    if (data) {
      toast.success(data?.message);
      hideModal("modal-ganti-password");
      router.push(`${ssURL}/login/warga-sekolah/auth`);
    } else {
      toast.error(error?.message);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setMeSekolahData(data);
    }
  };

  useEffect(() => {
    getMeSekolahData();
    
  }, []);

  useEffect(() => {
  
    if (
      window.location.href ==
      `https://sman8jakartadev.smarteschool.id/smartschool/login/siswa`
    ) {
      router.push(`${ssURL}/sman8jakarta`);
    }
  }, [sekolah]);

  const handleChange = (e) => {
    setStateForm({ ...stateForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStateForm({ ...stateForm, btn: "loading" });

    const res = await axiosInstance
      .post("/loginwhatsapp", {
        whatsapp: stateForm.whatsapp,
        role:
          sekolah?.id == 8123 && role == "smandel8-siswa"
            ? "siswa"
            : sekolah?.id == 8123 && role == "smandel8-guru"
            ? "guru"
            : sekolah?.id == 8123 && role == "warga-sekolah"
            ? "salah-role"
            : sekolah?.id == 8123 && role == "siswa"
            ? "salah-role"
            : sekolah?.id == 8123 && role == "guru"
            ? "salah-role"
            : role,
        user_agent: window.navigator.userAgent,
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
        if (sekolah?.id != 8123 && err?.response?.data?.res != null) {
          showModal("modalSalahLogin");
        }
        setTrueRole(err?.response?.data?.res?.role);
        setStateForm({ ...stateForm, btn: "error" });
      });

    if (res) {
      setStateForm({ ...stateForm, btn: "success" });
      localStorage.setItem("ss-tmp", JSON.stringify(res.data));
      if (role == "ortu") {
        router.push(`${ssURL}/login/${role}/auth`);
      }
      //  else if (
      //   sekolah?.id == 8123 &&
      //   role == "siswa" &&
      //   momentPackage().format("DD-MM-YYYY HH:mm") <= "28-11-2023 08:00"
      // ) {
      //   showModal("modal-ganti-password");
      // }
      else {
        router.push(`${ssURL}/login/warga-sekolah/auth`);
      }
    }
  };

  return (
    <>
      <NewModal
        modalId="modalSalahLogin"
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
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={`col-md-8 text-center mb-4`}>
                <h6 className={`fs-18-ss md-fs-6 mb-4 fw-bold color-dark`}>
                  Anda salah masuk akun
                </h6>
                <p className="fw-semibold text-center md-fs-14-ss text-start mb-0">
                  Klik tombol dibawah untuk masuk ke akun yang sesuai.
                </p>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <button
                  className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                  type="button"
                  onClick={() => {
                    router.push(`${ssURL}/login/${trueRole}`);
                    hideModal("modalSalahLogin");
                  }}
                >
                  Masuk
                </button>
              </div>
            </div>
          </>
        }
      />

      <>
        <NewModal
          modalId="modal-ganti-password"
          title={
            <>
              <h4 className="mb-1 fw-extrabold">Ubah Password</h4>
              <span className="fs-6 fw-normal">
                Isi informasi dibawah untuk mengubah password kamu.
              </span>
            </>
          }
          content={
            <>
              {/* <div className="mb-4">
                <label className="form-label">Password Lama</label>
                <input
                  className="form-control mb-2"
                  id="passwordLama"
                  placeholder="Masukkan Password Lama"
                  value={formData.passwordLama}
                  onChange={(e) => handleChangePassword(e)}
                  type={formData.lihatPasswordLama ? "text" : "password"}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lihatPasswordLama"
                    onChange={(e) => handleChangePassword(e)}
                  />
                  <label
                    className="form-check-label fs-14-ss color-secondary fw-semibold"
                    htmlFor="lihatPasswordLama"
                  >
                    Tampilkan password
                  </label>
                </div>
              </div> */}
              <div className="mb-4">
                <label className="form-label">Password Baru</label>
                <input
                  className="form-control mb-2"
                  id="passwordBaru"
                  placeholder="Masukkan Password Baru"
                  value={formData.passwordBaru}
                  onChange={(e) => handleChangePassword(e)}
                  type={formData.lihatPasswordBaru ? "text" : "password"}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lihatPasswordBaru"
                    onChange={(e) => handleChangePassword(e)}
                  />
                  <label
                    className="form-check-label fs-14-ss color-secondary fw-semibold"
                    htmlFor="lihatPasswordBaru"
                  >
                    Tampilkan password
                  </label>
                </div>
              </div>
              <div>
                <label className="form-label">Konfirmasi Password Baru</label>
                <input
                  className={`form-control mb-2 ${
                    formData.passwordBaru !== formData.konfirmasiPassword
                      ? "form-konfirmasi-salah"
                      : ""
                  }`}
                  id="konfirmasiPassword"
                  placeholder="Konfirmasi Password Baru"
                  value={formData.konfirmasiPassword}
                  onChange={(e) => handleChangePassword(e)}
                  type={formData.lihatKonfirmasiPassword ? "text" : "password"}
                />
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="lihatKonfirmasiPassword"
                    onChange={(e) => handleChangePassword(e)}
                  />
                  <label
                    className="form-check-label fs-14-ss color-secondary fw-semibold"
                    htmlFor="lihatKonfirmasiPassword"
                  >
                    Tampilkan password
                  </label>
                </div>
              </div>
            </>
          }
          submitButton={
            <ReactiveButton
              // buttonState={buttonState}
              onClick={handleSubmitPassword}
              color={"primary"}
              idleText={"Ubah Password"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              data-bs-dismiss="modal"
              className={"btn btn-primary"}
            />
          }
        />
      </>

      <AuthLayout>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <img
              src={`/img/smarteschool-logo.png`}
              alt=""
              className="img-fluid mb-3"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-5 mt-4 pt-4">
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-center fw-black color-dark mt-5 mb-3">
                Selamat Datang
              </h1>
              <h5 className="text-center color-secondary fw-semibold mb-5">
                Masuk dengan akun yang terdaftar
              </h5>
              <form className="mt-5 mx-auto form-login" onSubmit={handleSubmit}>
                <div className="form-floating form-floating-ss mb-3">
                  <input
                    className="form-control rounded-ss"
                    id="whatsapp"
                    placeholder={integrasi}
                    value={stateForm.whatsapp}
                    onChange={(e) => handleChange(e)}
                  />
                  <label htmlFor="whatsapp">Nomor { currentPath === "/smartschool/login/siswa" ? "NISN" : [integrasi]}</label>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-5">
                  <Link href={`${ssURL}/login`}>
                    <a className="text-decoration-none fw-bold">
                      <FaAngleLeft /> Kembali
                    </a>
                  </Link>
                  <ReactiveButton
                    buttonState={stateForm.btn}
                    type="submit"
                    idleText="Selanjutnya"
                    errorText="Gagal"
                    className="btn btn-primary bg-gradient-primary rounded-pill px-4 fs-6 fw-bold"
                  />
                </div>
              </form>
            </motion.div>
          </div>
          <div className="col-lg-7 d-none d-lg-block ps-5">
            <img
              src={`/img/smarteschool-illustration.png`}
              alt="Smartschool"
              className="img-fluid"
            />
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export async function getServerSideProps({ params: { role } }) {
  return {
    props: {
      role,
    },
  };
}

export default index;
