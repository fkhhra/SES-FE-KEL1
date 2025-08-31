import React from "react";
import AnimatePage from "../components/Shared/AnimatePage/AnimatePage";

function index() {
  return (
    <AnimatePage>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <img
            src="/img/lost-connection.png"
            alt="lost-connection"
            className="img-fluid mt-md-0 mt-5"
          />
        </div>
        <div className="col-md-12 text-center">
          <h1 className="color-dark fw-black mb-4 mt-md-4 mt-5">
            Maaf terjadi kesalahan
          </h1>
          <p className="fs-5 color-secondary fw-semibold mb-4">
            Silahkan klik tombol berikut untuk kembali ke halaman utama.
          </p>
          <div className="text-center d-flex justify-content-center">
            <a
              // href="/smartschool"
              onClick={() => window.location.reload()}
              className="btn btn-ss p-0 btn-primary-ss shadow-primary-ss rounded-pill d-flex justify-content-center align-items-center fs-18-ss fw-bold"
              style={{ width: "168px" }}
            >
              Coba lagi
            </a>
          </div>
        </div>
      </div>
    </AnimatePage>
  );
}

export default index;
