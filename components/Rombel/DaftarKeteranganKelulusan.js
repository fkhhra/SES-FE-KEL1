import ModalUnggahData from "components/Shared/ModalUnggahData/ModalUnggahData";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaCloudUploadAlt } from "react-icons/fa";
import {
  editKeteranganRapor,
  postKeteranganRapor,
} from "../../client/RaporClient";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import { checkLabelLulus } from "../../utilities/RaporUtils";
import ModalKeteranganKelulusan from "./ModalKeteranganKelulusan";

const DaftarKeteranganKelulusan = ({
  keterangan,
  getDetailRombelData,
  rombel_id,
  sekolah,
  dataTA,
}) => {
  const [jenisRapor, setJenisRapor] = useState("");
  const { user } = useUser();
  const initialStateForm = {
    id: "",
    catatan: "",
    kelulusan: "",
    active: "",
    btnBio: "idle",
  };
  const [formData, setFormData] = useState({
    ...initialStateForm,
  });

  const _postKeteranganKelulusan = async () => {
    setFormData({ ...formData, btnBio: "loading" });

    const { data, error } = formData.active
      ? await editKeteranganRapor(formData.id, {
          catatan: formData.catatan,
          kelulusan: formData.kelulusan,
          tipe: !jenisRapor || jenisRapor == "tengahSemester" ? "uts" : "uas",
        })
      : await postKeteranganRapor(
          {
            catatan: formData.catatan,
            kelulusan: formData.kelulusan,
            tipe: !jenisRapor || jenisRapor == "tengahSemester" ? "uts" : "uas",
            taId: dataTA.id,
          },
          formData.id
        );

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      getDetailRombelData();
      hideModal("modalKeteranganKelulusan");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      const keterangan =
        !jenisRapor || jenisRapor == "tengahSemester"
          ? data?.user?.keteranganRapor
          : data?.user?.keteranganRaporUas;
      if (keterangan == null) {
        setFormData({
          id: data?.user?.id,
          catatan: "",
          kelulusan: "",
        });
      } else {
        setFormData({
          id: keterangan?.mUserId,
          catatan: keterangan?.catatan,
          kelulusan: keterangan?.kelulusan,
          active: "active",
        });
      }
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="d-flex flex-lg-row flex-column justify-content-between align-items-sm-center">
            <h4 className="fw-extrabold color-dark mb-lg-0 mb-3">
              Daftar Keterangan Kelulusan Siswa
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
                endpoint={"/import/catatan-rapor/"}
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
                downloadEndpoint={`/download/catatan-rapor/${rombel_id}`}
                downloadBody={[
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
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th className="text-md-center text-start">Catatan</th>
                  <th className="text-md-center text-start">Kelulusan</th>
                  <th className="text-md-center text-start">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {keterangan
                  ?.sort((a, b) =>
                    ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                  )
                  ?.map((d, idx) => {
                    const catatan =
                      !jenisRapor || jenisRapor == "tengahSemester"
                        ? d?.user?.keteranganRapor?.catatan
                        : d?.user?.keteranganRaporUas?.catatan;
                    const kelulusan =
                      !jenisRapor || jenisRapor == "tengahSemester"
                        ? d?.user?.keteranganRapor?.kelulusan
                        : d?.user?.keteranganRaporUas?.kelulusan;
                    return (
                      <tr>
                        <td data-th="No">{idx + 1}</td>
                        <td data-th="Nama">
                          <span className="fw-semibold">{d?.user?.nama}</span>
                        </td>
                        <td
                          data-th="Catatan"
                          className="text-md-center text-start"
                        >
                          {catatan?.length == null &&
                          kelulusan?.length != null ? (
                            <span className="label-ss rounded-pill bg-soft-danger color-danger fs-12-ss fw-semibold text-capitalize">
                              Belum Diberikan
                            </span>
                          ) : !catatan?.length ? (
                            <span className=""> </span>
                          ) : (
                            <span className="label-ss rounded-pill bg-soft-success color-success fs-12-ss fw-semibold text-capitalize">
                              Sudah Diberikan
                            </span>
                          )}
                        </td>
                        <td
                          data-th="Kelulusan"
                          className="text-md-center text-start"
                        >
                          {!kelulusan?.length ? (
                            <span></span>
                          ) : (
                            <span className={checkLabelLulus(kelulusan)}>
                              {kelulusan}
                            </span>
                          )}
                        </td>
                        <td
                          data-th="Kelulusan"
                          className="text-md-center text-start"
                        >
                          <a
                            className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none"
                            data-bs-toggle="modal"
                            data-bs-target="#modalKeteranganKelulusan"
                            onClick={() => onClickEdit(d)}
                          >
                            Detail
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ModalKeteranganKelulusan
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postKeteranganKelulusan={_postKeteranganKelulusan}
        handleChangeSelect={handleChangeSelect}
        sekolah={sekolah}
      />
    </>
  );
};

export default DaftarKeteranganKelulusan;
