import { FaPlus } from "react-icons/fa";
import { ssURL } from "client/clientAxios";
import { useRouter } from "next/router";
import { postTopik } from "client/TopikClient";

const CardTambahMateri = ({ kelasId, babId }) => {

  const router = useRouter();

  const tambahMateri = async () => {
    let body = { mBabId: babId, kuis: 0, }
    const { data } = await postTopik(body);
    if (data) {
      router.push(`${ssURL}/kelas/${kelasId}/materi/${data.topikId}?babId=${babId}`);
    }
  };

  return (
    <div className="col-md-3">
      <div className="card-detail-materi position-relative tambah-bab" data-joyride="btn-tambah-topik">
        <div className="dropdown dropdown-ss">
          <div
            role="button"
            id="dropdownMenuLink-0"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <a className="text-decoration-none">
              <div className="plus">
                {" "}
                <FaPlus className="text-white" />
              </div>
            </a>
          </div>
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownMenuLink-0"
          >
            <li className="d-flex align-items-center" onClick={() => tambahMateri()}>
              <a className="dropdown-item text-secondary">
                Topik
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CardTambahMateri;