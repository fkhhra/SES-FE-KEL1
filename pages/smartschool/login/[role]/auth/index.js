import { motion } from "framer-motion";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

import AuthLayout from "../../../../../components/Layout/AuthLayout";
import { useState, useEffect } from "react";
import {
  axiosInstance,
  baseURL,
  ssURL,
} from "../../../../../client/clientAxios";
import ReactiveButton from "reactive-button";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { meSekolah } from "../../../../../client/SekolahClient";
import { whatsappLink } from "../../../../../utilities/app-helper";
import useSekolah from "../../../../../hooks/useSekolah";
import ModalResetPassword from "../../../../../components/Login/ModalResetPassword";
import { requestResetPassword } from "../../../../../client/UserClient";

const index = ({ role }) => {
  const router = useRouter();

  const [userActive, setUserActive] = useState(null);

  const { sekolah, setSekolah } = useSekolah();
  const [success, setSuccess] = useState(0);
  const [loading, setLoading] = useState(false);

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data);
    }
  };

  const _requestResetPassword = async () => {
    toast.loading("Mengirim Kode link whatsapp", { id: "loadingWa" });
    setLoading(true);
    const { data, error } = await requestResetPassword({
      whatsapp: userActive?.whatsapp,
    });

    if (data) {
      toast.success(" Kode link whatsapp terkirim", { id: "loadingWa" });
      toast.success("Silahkan cek Whatsapp anda");
      setLoading(false);
      setSuccess(1);
    } else {
      toast.error("gagal mengirim link", { id: "loadingWa" });
      toast.error(
        error.message.message == "The number is not registered"
          ? "Nomor Whatsapp tidak valid"
          : error.message.message
      );
    }
  };

  useEffect(() => {
    getMeSekolahData();
  }, []);

  useEffect(() => {
    if (!window.localStorage.getItem("ss-tmp")) {
      router.push(`${ssURL}/login/warga-sekolah`);
    } else {
      if (!userActive) {
        setUserActive(JSON.parse(localStorage.getItem("ss-tmp")));
      }
    }
  }, [userActive]);

  const initialState = { password: "", btn: "idle", lihatPassword: false };

  const [stateForm, setStateForm] = useState(initialState);

  const handleChange = (e) => {
    setStateForm({ ...stateForm, [e.target.id]: e.target.value });

    if (e.target.id == "lihatPassword") {
      setStateForm({ ...stateForm, [e.target.id]: !stateForm.lihatPassword });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStateForm({ ...stateForm, btn: "loading" });

    const res = await axiosInstance
      .post("/login", {
        password: stateForm.password,
        whatsapp: userActive?.whatsapp,
        domain: window.location.hostname,
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setStateForm({ ...stateForm, btn: "error" });
      });

    if (res) {
      setStateForm({ ...stateForm, btn: "success" });
      toast.success(res.data?.message);
      localStorage.removeItem("ss-tmp");
      localStorage.setItem("ss-token", JSON.stringify(res.data?.token));
      localStorage.setItem('formReview', true)
      router.push(ssURL);
    }
  };

  return (
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
            <h5 className="text-center color-secondary fw-semibold mb-5 text-capitalize">
              {userActive?.nama}
            </h5>
            <form className="form-login mt-5 mx-auto" onSubmit={handleSubmit}>
              <div className="form-floating form-floating-ss mb-3">
                <input
                  className="form-control"
                  autoComplete="off"
                  id="password"
                  placeholder="Password"
                  value={stateForm.password}
                  onChange={(e) => handleChange(e)}
                  type={stateForm.lihatPassword ? "text" : "password"}
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="lihatPassword"
                  onChange={(e) => handleChange(e)}
                />
                <label
                  className="form-check-label fs-14-ss color-secondary"
                  htmlFor="lihatPassword"
                >
                  Tampilkan password
                </label>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-5">
                <a
                  className="text-decoration-none fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalResetPassword"
                >
                  Lupa Password?
                </a>
                <ReactiveButton
                  buttonState={stateForm.btn}
                  type="submit"
                  idleText="Masuk"
                  errorText="Gagal"
                  className="btn btn-primary bg-gradient-primary rounded-pill px-5 fs-6 fw-bold"
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
      <ModalResetPassword
        _requestResetPassword={_requestResetPassword}
        success={success}
        loading={loading}
      />
    </AuthLayout>
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
