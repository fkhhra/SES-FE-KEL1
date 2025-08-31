import { getProfil } from "client/sharedClient";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { checkNomor } from "utilities/HelperUtils";
import { daftarPPDB, loginPPDB } from "../../../client/AuthClient";
import { ppdbURL, ssURL } from "../../../client/clientAxios";
import { meSekolah } from "../../../client/SekolahClient";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../hooks/useSekolah";
import { whatsappLink } from "../../../utilities/app-helper";

const LoginPPDBPage = () => {
  const { sekolah, setSekolah } = useSekolah();
  const initialFormData = {
    nama: "",
    namaIbu: "",
    whatsapp: "",
    nisn: null,
    alamat: "",
    asalSekolah: "",
    password: "",
    ulangiPassword: "",
    btnLogin: "idle",
    lihatPassword: false,
  };
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);

  const { setTa } = useTa();
  const { setUser } = useUser();

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200) {
      setUser(data?.user);

      if (data?.user?.role != "ppdb") {
        router.push(ssURL);
      } else {
        if (sekolah?.sekolah?.id == 9487) {
          router.push(`${ppdbURL}/pengumuman-kelulusan`);
        } else {
          router.push(`${ppdbURL}/dashboard`);
        }
      }

      return setTa(data?.ta);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data);
    }
  };

  const _loginPPDB = async (e) => {
    e?.preventDefault();
    if (!checkNomor(formData?.whatsapp)) {
      toast.error("periksa kembali nomor whatsapp yang anda masukan");
      return;
    }

    setFormData({ ...formData, btnLogin: "loading" });

    const { data, error } = await loginPPDB(formData);

    if (data) {
      setFormData({ ...initialFormData, btnLogin: "success" });
      localStorage.setItem("ss-token", JSON.stringify(data?.token));

      router.push(
        sekolah?.sekolah?.id == 9487
          ? `${ppdbURL}/pengumuman-kelulusan`
          : `${ppdbURL}/dashboard`
      );
    } else {
      toast.error(error?.message);
      setFormData({ ...formData, btnLogin: "error" });
    }
  };

  const _daftarPPDB = async (e) => {
    e?.preventDefault();
    if (!checkNomor(formData?.whatsapp)) {
      toast.error("periksa kembali nomor whatsapp yang anda masukan");
      return;
    }

    if (formData.password != formData.ulangiPassword) {
      toast.error("Password tidak sama");

      return;
    }

    setFormData({ ...formData, btnLogin: "loading" });

    const { data, error } = await daftarPPDB(formData);

    if (data) {
      setFormData({ ...initialFormData, btnLogin: "success" });
      localStorage.setItem("ss-token", JSON.stringify(data?.token));
      if (sekolah?.id == 9487) {
        router.push(`${ppdbURL}/pengumuman-kelulusan`);
      } else {
        router.push(`${ppdbURL}/dashboard`);
      }
    } else {
      toast.error(error?.message);
      setFormData({ ...formData, btnLogin: "error" });
    }
  };
  console.log(formData);

  const handleChange = (e) => {
    if (e.target.id == "lihatPassword") {
      setFormData({ ...formData, lihatPassword: !formData.lihatPassword });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  useEffect(() => {
    getMeSekolahData();
  }, []);

  useEffect(() => {
    getProfilData();
  }, []);

  // useEffect(() => {
  //   const warnClick = localStorage.getItem("warnClick");
  //   setTimeout(function () {
  //     if (!warnClick)
  //       swal({
  //         content: (
  //           <div className="d-flex flex-column">
  //             <h4 className="fw-black color-dark mx-auto my-4">
  //               Mohon Perhatian!
  //             </h4>
  //             <p className="text-start color-dark mb-4">
  //               Gedung Data Center Cyber I telah mengalami insiden kebakaran.
  //               Mohon maaf apabila mengalami kendala saat mengakses Smarteschool
  //               pada beberapa provider internet tertentu.
  //             </p>
  //           </div>
  //         ),
  //         buttons: "Tutup",
  //       }).then((success) => {
  //         if (success) {
  //           localStorage.setItem("warnClick", 1);
  //         }
  //       });
  //   }, 1000);
  // }, []);
  return (
    <div className="auth-layout bg-primary bg-gradient py-5">
      <Head>
        <link rel="shortcut icon" href={sekolah?.sekolah?.favicon} />
      </Head>
      <div className="container">
        <div className="card rounded-ss">
          <div className="card-body p-5">
            <AnimatePage>
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <img
                    src={`${
                      sekolah?.sekolah?.id == 7789
                        ? "/img/ppdbannahl/logo-ppdb.png"
                        : sekolah?.logoSs || `/img/ss-logo-icon.png`
                    } `}
                    alt=""
                    className="img-fluid"
                  />
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <h1 className="text-center fw-black color-dark mb-3 mt-5 mt">
                    Selamat Datang
                  </h1>
                  <h5 className="text-center color-secondary fw-semibold mb-4">
                    Calon Peserta{" "}
                    {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Didik"} Baru
                  </h5>
                  <div className="row justify-content-center mb-5">
                    <ul
                      className="switch-nav nav nav-pills d-flex justify-content-center p-2 rounded-pill position-relative"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li
                        className="nav-item position-relative"
                        role="presentation"
                      >
                        <a
                          className="nav-link active fs-14-ss fw-bold rounded-pill px-0 d-flex justify-content-center align-items-center"
                          id="pills-warga-sekolah-tab"
                          data-bs-toggle="pill"
                          href="#pills-warga-sekolah"
                          role="tab"
                          aria-controls="pills-warga-sekolah"
                          aria-selected="true"
                          onClick={() => setFormData(initialFormData)}
                        >
                          Masuk
                        </a>
                        <div className="slider position-absolute rounded-pill bg-gradient-primary"></div>
                      </li>
                      <li
                        className="nav-item position-relative"
                        role="presentation"
                      >
                        <a
                          className="nav-link fs-14-ss fw-bold rounded-pill px-0 d-flex justify-content-center align-items-center"
                          id="pills-lainnya-tab"
                          data-bs-toggle="pill"
                          href="#pills-lainnya"
                          role="tab"
                          aria-controls="pills-lainnya"
                          aria-selected="false"
                          onClick={() => setFormData(initialFormData)}
                        >
                          Daftar
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-warga-sekolah"
                      role="tabpanel"
                      aria-labelledby="pills-warga-sekolah-tab"
                    >
                      <form
                        className="form-login mt-5 mx-auto"
                        onSubmit={_loginPPDB}
                      >
                        <div className="form-floating form-floating-ss mb-3">
                          <input
                            className="form-control"
                            autoComplete="off"
                            id="whatsapp"
                            placeholder="Whatsapp"
                            value={formData.whatsapp}
                            onChange={(e) => handleChange(e)}
                          />
                          <label htmlFor="password">Whatsapp</label>
                        </div>
                        <div className="form-floating form-floating-ss mb-3">
                          <input
                            className="form-control"
                            autoComplete="off"
                            id="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => handleChange(e)}
                            type={formData.lihatPassword ? "text" : "password"}
                          />
                          <label htmlFor="password">Password</label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="lihatPassword"
                            checked={formData.lihatPassword}
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
                            href={whatsappLink(
                              sekolah?.kontak?.tu,
                              "Halo admin, saya lupa password"
                            )}
                            className="text-decoration-none fw-bold"
                          >
                            Lupa Password?
                          </a>
                          <ReactiveButton
                            buttonState={formData.btnLogin}
                            onClick={_loginPPDB}
                            type="submit"
                            idleText="Masuk"
                            errorText="Gagal"
                            className="btn btn-primary bg-gradient-primary rounded-pill px-5 fs-6 fw-bold"
                          />
                        </div>
                      </form>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-lainnya"
                      role="tabpanel"
                      aria-labelledby="pills-lainnya-tab"
                    >
                      {sekolah?.sekolah?.id == 14 || sekolah?.id == 13 ? (
                        <form
                          className="form-login mt-5 mx-auto"
                          onSubmit={_daftarPPDB}
                        >
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="nama"
                              placeholder="Nama Lengkap"
                              value={formData.nama}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="password">Nama Lengkap</label>
                          </div>

                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="whatsapp"
                              placeholder="Whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="password">Whatsapp</label>
                          </div>

                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="alamat"
                              placeholder="Alamat"
                              value={formData.alamat}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="alamat">Alamat</label>
                          </div>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="asalSekolah"
                              placeholder="Asal Sekolah"
                              value={formData.asalSekolah}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="asalSekolah">Asal Sekolah</label>
                          </div>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={(e) => handleChange(e)}
                              type={
                                formData.lihatPassword ? "text" : "password"
                              }
                            />
                            <label htmlFor="password">Password</label>
                          </div>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="ulangiPassword"
                              placeholder="Password"
                              value={formData.ulangiPassword}
                              onChange={(e) => handleChange(e)}
                              type={
                                formData.lihatPassword ? "text" : "password"
                              }
                            />
                            <label htmlFor="password">Ulangi Password</label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="lihatPassword"
                              checked={formData.lihatPassword}
                              onChange={(e) => handleChange(e)}
                            />
                            <label
                              className="form-check-label fs-14-ss color-secondary"
                              htmlFor="lihatPassword"
                            >
                              Tampilkan password
                            </label>
                          </div>
                          <div className="d-flex justify-content-end align-items-center mt-5">
                            <ReactiveButton
                              buttonState={formData.btnLogin}
                              type="submit"
                              idleText="Daftar"
                              errorText="Gagal"
                              className="btn btn-primary bg-gradient-primary rounded-pill px-5 fs-6 fw-bold"
                            />
                          </div>
                        </form>
                      ) : (
                        <form
                          className="form-login mt-5 mx-auto"
                          onSubmit={_daftarPPDB}
                        >
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="nama"
                              placeholder="Nama Lengkap"
                              value={formData.nama}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="password">Nama Lengkap</label>
                          </div>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="namaIbu"
                              placeholder="Nama Ibu"
                              value={formData.namaIbu}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="password">Nama Ibu</label>
                          </div>
                          {(sekolah?.sekolah?.id == 9487 ||
                            sekolah?.sekolah?.id == 9489) && (
                            <div className="form-floating form-floating-ss mb-3">
                              <input
                                className="form-control"
                                autoComplete="off"
                                id="nisn"
                                placeholder="nisn"
                                value={formData.nisn}
                                onChange={(e) => handleChange(e)}
                              />
                              <label htmlFor="password">NISN</label>
                            </div>
                          )}
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="whatsapp"
                              placeholder="Whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor="password">Whatsapp</label>
                          </div>

                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="password"
                              placeholder="Password"
                              value={formData.password}
                              onChange={(e) => handleChange(e)}
                              type={
                                formData.lihatPassword ? "text" : "password"
                              }
                            />
                            <label htmlFor="password">Password</label>
                          </div>
                          <div className="form-floating form-floating-ss mb-3">
                            <input
                              className="form-control"
                              autoComplete="off"
                              id="ulangiPassword"
                              placeholder="Password"
                              value={formData.ulangiPassword}
                              onChange={(e) => handleChange(e)}
                              type={
                                formData.lihatPassword ? "text" : "password"
                              }
                            />
                            <label htmlFor="password">Ulangi Password</label>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="lihatPassword"
                              checked={formData.lihatPassword}
                              onChange={(e) => handleChange(e)}
                            />
                            <label
                              className="form-check-label fs-14-ss color-secondary"
                              htmlFor="lihatPassword"
                            >
                              Tampilkan password
                            </label>
                          </div>
                          <div className="d-flex justify-content-end align-items-center mt-5">
                            <ReactiveButton
                              buttonState={formData.btnLogin}
                              type="submit"
                              idleText="Daftar"
                              errorText="Gagal"
                              className="btn btn-primary bg-gradient-primary rounded-pill px-5 fs-6 fw-bold"
                            />
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatePage>

            <div className="text-center mt-5">
              {sekolah?.id == 5 ? (
                <>
                  &copy;Smarteschool 2020. Hak Cipta Dilindungi oleh
                  Undang-undang.
                </>
              ) : (
                <>
                  &copy;Smartschool {new Date().getFullYear()}. Hak Cipta
                  Dilindungi oleh Undang-undang.
                </>
              )}

              <br />
              <a
                href={`${
                  sekolah?.id == 5
                    ? "https://smarteschool.id/"
                    : "https://smarteschool.id"
                }`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-decoration-none"
              >
                {" "}
                {sekolah?.id == 5
                  ? "Powered by Smartschool"
                  : "Powered by Smart School."}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query: { register } }) {
  return {
    props: {
      register: register || "",
    },
  };
}

export default LoginPPDBPage;
