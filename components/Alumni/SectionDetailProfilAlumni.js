import { FaPaperclip, FaPen } from "react-icons/fa";
import { momentPackage } from "../../utilities/HelperUtils";

const SectionDetailProfilAlumni = ({
  isReadOnly = false,
  data,
  dataDetailAlumni,
}) => {
  return (
    <>
      <div className="card card-ss">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-extrabold color-dark mb-0">Detail Profil</h4>
            {!isReadOnly && (
              <button
                type="button"
                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center p-1"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                data-bs-toggle="modal"
                data-bs-target="#modalEditDetailProfil"
              >
                <FaPen className="color-secondary fs-5" />
              </button>
            )}
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nama Lengkap</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {dataDetailAlumni?.user?.nama || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Jenis Kelamin</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {dataDetailAlumni?.user?.genderText || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Nomor Whatsapp</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {dataDetailAlumni?.user?.whatsapp || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Alamat Email</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {dataDetailAlumni?.user?.email || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Usia</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0 text-uppercase">
                {momentPackage().diff(
                  dataDetailAlumni?.user?.tanggalLahir,
                  "years"
                ) || "-"}{" "}
                tahun
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Tinggi Badan</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {dataDetailAlumni?.user?.profil?.tb || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Buta Warna</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {dataDetailAlumni?.user?.profil?.butaWarna || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Kacamata</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {dataDetailAlumni?.user?.profil?.kacamata || "-"}
              </p>
            </li>
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Disabilitas</h6>
              <p className="color-secondary fs-18-ss fw-semibold mb-0">
                {dataDetailAlumni?.user?.profil?.disabilitas || "-"}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SectionDetailProfilAlumni;
