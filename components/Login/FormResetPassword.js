import { useState } from "react";
import toast from "react-hot-toast";
import { resetPassword } from "../../client/UserClient";

const FormResetPassword = ({ formData, setFormData, handleSubmit }) => {
  const handleChangePassword = (e) => {
    const checkbox = ["lihatPasswordBaru", "lihatKonfirmasiPassword"];

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
  return (
    <>
      <div style={{ background: `url("/img/bg-buku-tamu.png")` }}>
        <div className="container">
          <div
            className="row justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <div
              className="p-4 col-md-8 rounded-ss"
              style={{ background: `rgba(255, 255, 255, .15)` }}
            >
              <div className="card card-ss">
                <div className="card-header-ss p-4 pb-0 fw-extrabold color-dark">
                  <h4 className="m-0">Ubah Password</h4>
                </div>
                <form>
                  <div className="card-body p-4 pb-0">
                    <div className="mb-4">
                      <label className="form-label">Password Baru</label>
                      <input
                        className="form-control mb-2"
                        id="passwordBaru"
                        placeholder="Masukkan Password Baru"
                        value={formData.passwordBaru}
                        onChange={(e) => handleChangePassword(e)}
                        type={formData.lihatPasswordBaru ? "text" : "password"}
                        autocomplete="new-password"
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
                      <label className="form-label">
                        Konfirmasi Password Baru
                      </label>
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
                        type={
                          formData.lihatKonfirmasiPassword ? "text" : "password"
                        }
                        autocomplete="new-password"
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
                  </div>
                  <div className="card-footer-ss">
                    <div className="container p-4 ">
                      <div className="row ">
                        <div className="col-md-12 d-flex justify-content-md-end flex-md-row flex-column">
                          <button
                            type="submit"
                            className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                            onClick={handleSubmit}
                            onSubmit={handleSubmit}
                          >
                            Ubah Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-gradient-primary text-white">
        <div className="container py-4 text-center">
          <small>
            &copy;Smartschool {new Date().getFullYear()}. Hak Cipta Dilindungi
            oleh undang-undang. | {""}
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none fw-bold text-white"
            >
              Powered by Smartschool Indonesia.
            </a>
          </small>
        </div>
      </section>
    </>
  );
};

export default FormResetPassword;
