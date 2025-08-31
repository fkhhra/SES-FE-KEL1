import useEditModal from "hooks/useEditModal";
import { FaBook, FaPlus } from "react-icons/fa";

const HeaderMateri = ({ totalBab=0 }) => {

  const { setEditModal } = useEditModal();

  return (
    <div className="card card-ss px-4 py-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="color-primary d-flex align-items-center me-4">
            <div className="rounded-circle bg-light-primary d-flex justify-content-center align-items-center me-2 fs-4" style={{ height: "35px", width: "35px" }}>
              <FaBook />
            </div>
            <p className="mb-0 fs-18-ss fw-bold">
              {totalBab} BAB
            </p>
          </div>
        </div>
        <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold" data-bs-toggle="modal" data-bs-target="#modalBuatBab" onClick={() => setEditModal("modalBuatBab", null)}>
          <FaPlus className="me-2" />
          Buat BAB
        </button>
      </div>
    </div>
  )
}

export default HeaderMateri;