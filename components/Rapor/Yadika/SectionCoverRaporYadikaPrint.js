import { momentPackage } from "../../../utilities/HelperUtils";

const SectionCoverRaporYadikaPrint = ({ isBukuInduk, sekolah, siswa, ta }) => {
  return (
    <>
      <div className="text-center mt-4" style={{ minHeight: "100vh" }}>
        <div className="mt-5">
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            RAPOR PESERTA DIDIK
          </h6>
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            SEKOLAH MENENGAH KEJURUAN
          </h6>
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">(SMK)</h6>
          {/* <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            {!sekolah?.tingkatFormat ? `-` : `${sekolah?.tingkatFormat}`}
          </h6> */}

          {/* <h6 className="fs-18-ss fw-bold mb-0 text-uppercase">
            {!sekolah?.nama ? `-` : `${sekolah?.nama}`}
          </h6> */}
        </div>
        <div style={{ margin: "100px 0" }}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <img
                src={"/img/logo-tutwurihadayani-rapor.png"}
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "150px" }}>
          <div className="row text-center justify-content-center">
            <div className="col-7">
              <div className="mb-5">
                <h5 className=" fs-12-ss mb-2">Nama Peserta Didik :</h5>
                <div
                  className="w-100 border border-dark border-3 p-2 text-center fs-12-ss fw-bold "
                  style={{ borderColor: "##3A4166" }}
                >
                  {!siswa?.nama ? `-` : `${siswa?.nama}`}
                </div>
              </div>
              <h5 className=" fs-12-ss mb-2">N I S N :</h5>
              <div
                className="w-100 border border-dark border-3 p-2 text-center fs-12-ss fw-bold "
                style={{ borderColor: "##3A4166" }}
              >
                {!siswa?.profil?.nisn ? `-` : `${siswa?.profil?.nisn}`}
              </div>
            </div>
          </div>
        </div>
        <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
          KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN
        </h6>
        <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
          REPUBLIK INDONESIA
        </h6>
        <h6 className="fs-18-ss fw-bold mb-0 text-uppercase">
          TAHUN {momentPackage().format("YYYY")}
        </h6>
      </div>
    </>
  );
};

export default SectionCoverRaporYadikaPrint;
