import React, { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { meSekolah } from "client/SekolahClient";
import { useRouter } from "next/router";
import { axiosInstance, ssURL } from "client/clientAxios";
import toast from "react-hot-toast";

const Index = () => {
  const [sekolahData, setSekolahData] = useState({});
  const { sekolah } = sekolahData;
  const router = useRouter();
  const initialState = { password: "", btn: "idle", lihatPassword: false };
  const [stateForm, setStateForm] = useState(initialState);

  const meSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data.sekolah?.id == 5 || data.sekolah?.id == 55) {
        router.push("/smartschool/login");
      }

      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          setSekolahData(data);
          return;
        }

        router.push(data?.sekolah?.domainBackup);
      }

      setSekolahData(data);
    }
  };

  useEffect(() => {
    meSekolahData();
    // router.push("/server-maintenance");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStateForm({ ...stateForm, btn: "loading" });

    const res = await axiosInstance
      .post("/login", {
        password: stateForm.password,
        whatsapp: stateForm?.whatsapp,
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
      localStorage.setItem("formReview", true);
      router.push(ssURL);
    }
  };
  const featLinks = [
    {
      icon: "/img/globe-icon.svg",
      text: "Website Sekolah",
      url: "/web",
    },
    {
      icon: "/img/map-icon.svg",
      text: "Jelajah Sekolah",
      url: `${sekolah?.informasi?.virtualTour}`,
    },
    {
      icon: "/img/ppdb-icon.svg",
      text: "PPDB Sekolah",
      url: "/ppdb",
    },
    {
      icon: "/img/icon-rapor-admin-portal.svg",
      text: "E Rapor",
      url: sekolah?.linkRapor || "/",
    },
    {
      icon: "/img/icon-admin-dapodik-portal.svg",
      text: "Dapodik",
      url: sekolah?.linkDapodik || "",
    },
    // {
    //   icon: "/img/ppdb-icon.svg",
    //   text: "PPDB Sekolah",
    //   url: "/ppdb",
    // },
  ];

  const handleChange = (e) => {
    setStateForm({ ...stateForm, [e.target.id]: e.target.value });

    if (e.target.id == "lihatPassword") {
      setStateForm({ ...stateForm, [e.target.id]: !stateForm.lihatPassword });
    }
  };

  return (
    <>
      <section
        className="min-vh-100"
        style={{
          background: "url(/img/bg-login.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="container h-100">
          <div
            className="row justify-content-center align-items-center"
            style={{ marginBottom: "48px", paddingTop: "48px" }}
          >
            <div className="col-md-4 col-6">
              <img
                src="/img/logo-ses.png"
                alt="Logo SES"
                className="img-fluid d-lg-block d-none"
              />
              <img
                src="/img/logo-ses.png"
                alt="Logo SES"
                className="img-fluid d-block d-lg-none"
              />
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col col-xl-10">
              <div
                className="bg-white mb-lg-5"
                style={{
                  borderRadius: "24px",
                  border: "10px solid #FFF",
                  boxShadow: "0px 10px 30px 0px rgba(58, 65, 102, 0.07)",
                  marginBottom: "107px",
                }}
              >
                <div className="row">
                  <div className="col-md-6 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                          <h1
                            className="text-center fw-black color-dark mt-5 mb-3"
                            style={{ fontSize: "32px" }}
                          >
                            Selamat Datang
                          </h1>
                          <h5 className="text-center color-secondary fw-semibold mb-login">
                            Masuk dengan akun yang terdaftar
                          </h5>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control rounded-ss"
                              id="whatsapp"
                              placeholder={"Nomor WhatsApp"}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="whatsapp">Nomor WhatsApp</label>
                          </div>
                        </div>

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

                        <div className="form-check mb-login">
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
                        <div className="mb-4 w-100">
                          <ReactiveButton
                            buttonState={stateForm.btn}
                            type="submit"
                            idleText="Masuk"
                            errorText="Gagal"
                            className="btn btn-primary bg-gradient-primary rounded-pill px-4 fs-6 fw-bold"
                            width={"100%"}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-6 d-none d-md-flex text-center ">
                    <div
                      className="bg-primary-surface d-flex w-100 align-items-center flex-column"
                      style={{
                        background: "url(/img/bg-navigasi.svg)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        paddingTop: "92px",
                      }}
                    >
                      <div
                        className="container"
                        style={{ paddingInline: "55px" }}
                      >
                        <h4 className="fw-bold text-primary">
                          Jelajah Fitur Lainnya
                        </h4>
                        <p className="fw-bold text-primary">
                          Lihat tautan di bawah ini
                        </p>
                        <div
                          className="d-flex flex-column mt-5"
                          style={{ gap: "24px" }}
                        >
                          {featLinks.map((link, index) => (
                            <a href={link.url} target="_blank">
                              <div
                                key={index}
                                className="bg-white d-flex justify-content-between align-items-center rounded"
                                style={{
                                  boxShadow:
                                    "0px 10px 30px 0px rgba(58, 65, 102, 0.10)",
                                  padding: "1rem",
                                  gap: "24px",
                                }}
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={link.icon}
                                    alt={`${link.text} Icon`}
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                  <span className="fw-bold">{link.text}</span>
                                </div>
                                <FaChevronRight
                                  className="me-2"
                                  style={{ color: "#D0D2DA" }}
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="bg-white w-100 position-fixed d-lg-none d-flex"
        style={{
          zIndex: "100",
          bottom: "0",
          boxShadow: "0 -5px 15px rgba(58, 65, 102, 0.1)",
        }}
      >
        <div className="container-fluid px-4 py-2">
          <div className="row">
            {featLinks.map((link, index) => (
              <div
                key={index}
                className="col d-flex align-items-center justify-content-center ps-0"
              >
                <Link href={link.url}>
                  <a className="text-decoration-none">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <img
                        width="40px"
                        height="40px"
                        src={link.icon}
                        alt={link.text}
                        className="mb-2"
                      />
                      <h6 className={`fs-12-ss fw-bold color-dark`}>
                        {link.text}
                      </h6>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
