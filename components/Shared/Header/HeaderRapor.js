import { useRouter } from "next/router";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import { ssURL } from "../../../client/clientAxios";

const HeaderRapor = ({
  title,
  backProps = false,
  href,
  jenisRapor,
  setTengahSemester,
  setAkhirSemester,
}) => {
  const router = useRouter();

  return (
    <header>
      <nav className="navbar navbar-ss navbar-expand-lg bg-primary position-fixed w-100 p-4 position-fixed">
        <div className="container">
          <div className="w-100">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-md-center">
                  <div class="dropdown dropdown-ss dropdown-rapor mx-auto order-md-1 order-2 mt-md-0 mt-3">
                    <a
                      className="mb-0 fw-extrabold text-white  dropdown-toggle px-3 dropdown-search-perpustakaan-toggle dropdown-toggle-rapor"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {!jenisRapor || jenisRapor == "akhirSemester"
                        ? "Rapor Akhir Semester"
                        : "Rapor Tengah Semester"}
                    </a>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={setTengahSemester}
                        >
                          Rapor Tengah Semester
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={setAkhirSemester}
                        >
                          Rapor Akhir Semester
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="order-md-2 order-1 d-flex justify-content-md-start justify-content-end">
                    <Link href={href}>
                      <a className="ms-md-0 ms-auto">
                        <img src="/img/btn-close.svg" alt="" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderRapor;
