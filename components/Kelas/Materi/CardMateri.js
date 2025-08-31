import { ssURL } from "client/clientAxios";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import swal from "sweetalert";
import { deleteTopik } from "client/TopikClient";
import toast from "react-hot-toast";

const CardMateri = ({ data, index, kelasId, _getDetailMateri, babId }) => {
  const { id: materiId, judul } = data || {};

  const deleteMateri = async () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTopik(materiId);
        if (data) {
          _getDetailMateri();
          toast.success(data?.message);
        }
      }
    });
  };

  return (
    <div className="col-md-3">
      <div className="card-detail-materi position-relative shadow-dark-ss">
        <div className="dropdown dropdown-ss">
          <div
            className="position-absolute ellipsis-h m-0"
            role="button"
            id={`dropdown-card-materi-${materiId}`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-joyride="dropdown-card-bab"
          >
            <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby={`dropdown-card-materi-${materiId}`}
          >
            <li className="d-flex align-items-center">
              <Link
                href={`${ssURL}/kelas/[id]/materi/[materi_id]`}
                as={`${ssURL}/kelas/${kelasId}/materi/${materiId}?babId=${babId}`}
              >
                <a className="dropdown-item color-secondary">
                  <FaPen /> &nbsp; Edit
                </a>
              </Link>
            </li>
            <li onClick={() => deleteMateri(materiId)}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt /> &nbsp; Hapus
              </a>
            </li>
          </ul>
        </div>
        <Link
          href={`${ssURL}/kelas/[id]/materi/[materi_id]`}
          as={`${ssURL}/kelas/${kelasId}/materi/${materiId}?babId=${babId}`}
        >
          <a>
            <span className="circle shadow-primary-ss">{index + 1}</span>
            <p className="text-secondary fw-semibold">{judul}</p>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default CardMateri;
