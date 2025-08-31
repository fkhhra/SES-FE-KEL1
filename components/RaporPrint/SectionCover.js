import { momentPackage } from "../../utilities/HelperUtils";

const SectionCover = ({ isBukuInduk, sekolah, siswa, ta, jenisRapor }) => {
  return (
    <>
      <div className="text-center mt-4" style={{ minHeight: "100vh" }}>
        <div className="mt-5">
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            {isBukuInduk ? "BUKU INDUK" : "RAPOR"} PESERTA DIDIK
          </h6>
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            {sekolah?.id == 15 ? "" : ""}{" "}
            {!jenisRapor || jenisRapor == "tengahSemester" ? "TENGAH" : "AKHIR"}{" "}
            SEMESTER {ta?.semester == 1 ? "GANJIL" : "GENAP"}
          </h6>
          <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            TAHUN PELAJARAN {!ta?.tahun ? `-` : `${ta?.tahun}`}
          </h6>
          {/* <h6 className="fs-18-ss fw-bold mb-2 text-uppercase">
            {!sekolah?.tingkatFormat ? `-` : `${sekolah?.tingkatFormat}`}
          </h6> */}

          <h6 className="fs-18-ss fw-bold mb-0 text-uppercase">
            {!sekolah?.nama ? `-` : `${sekolah?.nama}`}
          </h6>
        </div>
        <div style={{ margin: "100px 0" }}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <img
                src={sekolah?.logo || "/img/logo-tutwurihadayani-rapor.png"}
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
          {ta?.semester == 1
            ? `TAHUN ${ta?.tahun.split(" ")?.[0]}`
            : ta?.semester == 2 || ta?.semester == "Genap"
            ? `TAHUN  ${ta?.tahun.split(" ")?.[2]}`
            : "TAHUN 2023"}
        </h6>
      </div>
    </>
  );
};

export default SectionCover;
