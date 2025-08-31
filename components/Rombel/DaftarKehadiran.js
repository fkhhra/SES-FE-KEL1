import ModalUnggahData from "components/Shared/ModalUnggahData/ModalUnggahData";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaPen, FaCloudDownloadAlt, FaCloudUploadAlt } from "react-icons/fa";
import { editKeteranganRapor } from "../../client/RaporClient";
import { hideModal } from "../../utilities/ModalUtils";
import ModalKehadiranSiswa from "./ModalKehadiranSiswa";

const DaftarKehadiran = ({
  keterangan,
  getDetailRombelData,
  rombel_id,
  dataTA,
}) => {
  const initialKehadiranData = {
    catatan: "",
    kelulusan: "",
    sakit: 0,
    izin: 0,
    alpa: 0,
    keteranganRaporId: "",
  };
  const [kehadiranData, setKehadiranData] = useState(initialKehadiranData);

  const _putKehadiranSiswa = async () => {
    const { data, error } = await editKeteranganRapor(
      kehadiranData.keteranganRaporId,
      {
        catatan: kehadiranData.catatan,
        kelulusan: kehadiranData.kelulusan,
        sakit: kehadiranData.sakit,
        izin: kehadiranData.izin,
        alpa: kehadiranData.alpa,
        tipe: !jenisRapor || jenisRapor == "tengahSemester" ? "uts" : "uas",
      }
    );

    if (data) {
      toast.success(data.message);
      hideModal("modalKehadiranSiswa");
      setKehadiranData(initialKehadiranData);
      getDetailRombelData();
    }
  };

  const handleChangeForm = (e) => {
    setKehadiranData({ ...kehadiranData, [e.target.name]: e.target.value });
  };

  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  return (
    <>
      <ModalKehadiranSiswa
        formData={kehadiranData}
        handleChangeForm={handleChangeForm}
        _putKehadiranSiswa={_putKehadiranSiswa}
      />
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="d-flex flex-md-row flex-column justify-content-between align-items-sm-center">
            <h4 className="fw-extrabold color-dark  mb-3">
              Daftar Kehadiran Siswa
            </h4>
            <div className="d-flex flex-sm-row flex-column ">
              {/* <label
                className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3 "
                // onClick={() =>
                //   handleDownload(daftarSiswa[0]?.rombel?.id, mapelId)
                // }
              >
                <FaCloudDownloadAlt className="me-2 fs-5" />
                <p className="mb-0">Download Template</p>
              </label> */}
              <label
                data-bs-toggle="modal"
                data-bs-target="#modalUnggahData"
                className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 "
              >
                <FaCloudUploadAlt className="me-2 fs-5" />
                <p className="mb-0">Unggah Data</p>
              </label>
              <ModalUnggahData
                id={"modalUnggahData"}
                onSuccess={() => getDetailRombelData()}
                endpoint={"/import/absensi-siswa/"}
                body={[
                  {
                    name: "tipe",
                    value:
                      !jenisRapor || jenisRapor == "tengahSemester"
                        ? "uts"
                        : "uas",
                  },
                  {
                    name: "ta_id",
                    value: dataTA?.id,
                  },
                ]}
                downloadEndpoint={"/absen-siswa2/rekapdownload"}
                downloadBody={[
                  {
                    name: "tipe",
                    value:
                      !jenisRapor || jenisRapor == "tengahSemester"
                        ? "uts"
                        : "uas",
                  },
                  {
                    name: "rombel_id",
                    value: rombel_id,
                  },
                  {
                    name: "ta_id",
                    value: dataTA?.id,
                  },
                ]}
                fileType={["xlsx", "xlsm", "xlsb", "xls", "xltx"]}
              />
              <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
                <button
                  className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4 mt-sm-0 mt-3`}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-joyride="btn-filter-kelas"
                >
                  {!jenisRapor || jenisRapor == "tengahSemester"
                    ? "Tengah Semester"
                    : "Akhir Semester"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        setJenisRapor("tengahSemester");
                        localStorage.setItem("jenisRapor", "tengahSemester");
                      }}
                    >
                      Tengah Semester
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={(e) => {
                        setJenisRapor("akhirSemester");
                        localStorage.setItem("jenisRapor", "akhirSemester");
                      }}
                    >
                      Akhir Semester
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0 pb-5">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  {/* <th>KKM</th>
                <th>Nilai</th> */}
                  {/* <th className="text-md-center text-start">Telat</th> */}
                  <th className="text-md-center text-start">Sakit</th>
                  <th className="text-md-center text-start">Izin</th>
                  <th className="text-md-center text-start">Alpa</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {keterangan
                  ?.sort((a, b) =>
                    ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                  )
                  ?.map((d, idx) => {
                    const keterangan =
                      !jenisRapor || jenisRapor == "tengahSemester"
                        ? d?.user?.keteranganRapor
                        : d?.user?.keteranganRaporUas;
                    return (
                      <tr>
                        <td data-th="No">{idx + 1}</td>
                        <td data-th="Nama">
                          <span className="fw-semibold">{d?.user?.nama}</span>
                        </td>
                        {/* <td
                          data-th="Telat"
                          className="fw-semibold text-md-center text-start"
                        >
                          {keterangan?.telat}
                        </td> */}
                        <td
                          data-th="Sakit"
                          className="fw-semibold text-md-center text-start"
                        >
                          {keterangan?.sakit}
                        </td>
                        <td
                          data-th="Izin"
                          className="fw-semibold text-md-center text-start"
                        >
                          {keterangan?.izin}
                        </td>
                        <td
                          data-th="Alpa"
                          className="fw-semibold text-md-center text-start"
                        >
                          {keterangan?.alpa}
                        </td>
                        <td>
                          {keterangan && (
                            <button
                              type="button"
                              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#modalKehadiranSiswa"
                              onClick={() =>
                                setKehadiranData({
                                  kelulusan: keterangan?.kelulusan,
                                  catatan: keterangan?.catatan,
                                  sakit: keterangan?.sakit,
                                  izin: keterangan?.izin,
                                  alpa: keterangan?.alpa,
                                  keteranganRaporId: d?.user?.id,
                                })
                              }
                              data-joyride="edit-gtk"
                            >
                              <FaPen className="color-secondary" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DaftarKehadiran;
