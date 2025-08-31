import { FaPlus } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import { showModal } from "utilities/ModalUtils";

import useEditModal from "hooks/useEditModal";
import useUser from "hooks/useUser";

const EmptyStateKelasKegiatan = ({ showButtonTambahKegiatan=true, setModalTugasType }) => {

  const { user } = useUser();
  const { setEditModal } = useEditModal();

  return (
    <div className="col-lg-10">
      <div className="card card-ss p-4">
        <div className="d-flex align-items-center flex-sm-row flex-column">
          <div
            className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-3"
            style={{ width: "50px", height: "50px" }}
          >
            <img src="/img/icon-kegiatan.svg" alt="icon-kegiatan" />
          </div>
          <h5 className="fw-extrabold color-dark mb-0">
            {`Kegiatan - ${momentPackage().format("DD MMMM YYYY")}`}
          </h5>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-5 col-sm-8 col-9">
            <img
              src="/img/empty-state-timeline.png"
              alt="empty-state"
              className="img-fluid mb-3"
            />
          </div>
          <div className="col-md-8 text-center">
            <h5 className="color-dark fw-black">
              {user?.role == "guru"
                ? "Belum Ada Kegiatan di Kelas"
                : "Guru Belum Memberikan Kegiatan Kelas"}
            </h5>
            <p className="fw-bold fs-14-ss">
              {user?.role == "guru"
                ? "Sepertinya anda belum menambahkan kegiatan untuk saat ini"
                : "Sepertinya kamu belum diberikan materi, tugas, ataupun kuis untuk saat ini"}
            </p>
          </div>
        </div>
        { showButtonTambahKegiatan && (
          <div className="dropdown dropdown-ss d-flex flex-column">
            {user?.role == "guru" && (
              <button
                className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none"
                style={{ minHeight: "84px" }}
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaPlus className="me-2" /> Tambah
              </button>
            )}
            <ul
              className="dropdown-menu dropdown-menu-ss my-1 w-100"
              aria-labelledby="dropdownMenuLink"
            >
              <li onClick={() => { setEditModal("ModalBuatPertemuan", null); showModal("ModalBuatPertemuan") }}>
                <a className="dropdown-item pointer d-flex align-items-center">
                  <img
                    src="/img/icon-kegiatan-tatap-maya.svg"
                    alt="icon-kegiatan"
                    className="me-2"
                  />
                  <span className="color-dark fw-semibold">
                    Tatap Maya
                  </span>
                </a>
              </li>
              <li onClick={() => showModal("ModalBagikanMateri")}>
                <a className="dropdown-item pointer d-flex align-items-center">
                  <img
                    src="/img/icon-kegiatan-materi.svg"
                    alt="icon-kegiatan"
                    className="me-2"
                  />
                  <span className="color-dark fw-semibold">Materi</span>
                </a>
              </li>
              <li onClick={() => { setModalTugasType("tugas"); showModal("modalBuatTugas") }}>
                <a className="dropdown-item pointer d-flex align-items-center">
                  <img
                    src="/img/icon-kegiatan-tugas.svg"
                    alt="icon-kegiatan"
                    className="me-2"
                  />
                  <span className="color-dark fw-semibold">Tugas</span>
                </a>
              </li>
              <li onClick={() => { setModalTugasType("kuis"); showModal("modalBuatTugas") }}>
                <a className="dropdown-item pointer d-flex align-items-center">
                  <img
                    src="/img/icon-kegiatan-tugas.svg"
                    alt="icon-kegiatan"
                    className="me-2"
                  />
                  <span className="color-dark fw-semibold">
                    Tugas Kuis
                  </span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyStateKelasKegiatan;