import Navbar from "components/Shared/Navbar/Navbar";
import useUjian from "hooks/useUjian";
import React from "react";
import { FaCloudDownloadAlt, FaPlus, FaCloudUploadAlt } from "react-icons/fa";
import { AiFillFileWord, AiFillFileExcel } from "react-icons/ai";

export const NavUjianDetail = ({
  navItems,
  onChangeDropdownFilter,
  setFormData,
  initialFormData,
  nav,
}) => {
  const { detailUjianData } = useUjian();
  const { bentukSoal, ujian } = detailUjianData;
  return (
    <>
      <Navbar
        nav={navItems}
        isNavDropdown={
          ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? false : true
        }
        handleChangeDropdown={onChangeDropdownFilter}
        defaultDropdownValue={
          bentukSoal?.filter((bentuk) => bentuk?.value === nav)?.[0]?.label
        }
        action={[
          {
            button: (
              <>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    data-joyride="btn-unduh-soal"
                    data-bs-toggle="modal"
                    data-bs-target="#downloadKartuSoal"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Kartu Soal
                  </button>
                </div>
                {/* <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUnggahSoal"
                    data-joyride="btn-unggah-soal"
                  >
                    <FaCloudUploadAlt className="me-2 fs-18-ss" />
                    Unggah Soal
                  </button>
                </div> */}
                <div className="dropdown dropdown-ss d-flex flex-column">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    data-joyride="btn-buat-soal"
                  >
                    <div>
                      <FaCloudUploadAlt className="me-2 fs-18-ss" />
                      Unggah Soal
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li className="mb-2">
                      <a
                        className="dropdown-item pointer color-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalUnggahSoalWord"
                      >
                        <AiFillFileWord className="me-2 fs-18-ss" />
                        <span>Via Word</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item pointer color-success"
                        data-bs-toggle="modal"
                        data-bs-target="#modalUnggahSoalExcel"
                      >
                        <AiFillFileExcel className="me-2 fs-18-ss" />
                        <span>Via Excel</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown dropdown-ss d-flex flex-column">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-joyride="btn-buat-soal"
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Soal
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalAmbilSoal"
                      >
                        <span>Ambil dari Bank Soal</span>
                      </a>
                    </li>
                    <li onClick={() => setFormData(initialFormData)}>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatSoalUjian"
                      >
                        <span>Buat Soal Baru</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );
};
