import Link from "next/link";
import React, { useState } from "react";
import { FaClone, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { ssURL } from "../../client/clientAxios";
import useUser from "../../hooks/useUser";
import ModalKeteranganKelulusan from "./ModalKeteranganKelulusan";
import {
  postKeteranganRapor,
  editKeteranganRapor,
} from "../../client/RaporClient";
import toast from "react-hot-toast";
import { hideModal } from "../../utilities/ModalUtils";
import {
  checkKeteranganLulus,
  checkLabelLulus,
} from "../../utilities/RaporUtils";
import ModalCatatanSiswa from "./ModalCatatanSiswa";
import { useEffect } from "react";

const DaftarCatatanSiswa = ({ keterangan, getDetailRombelData }) => {
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
        })
      : await postKeteranganRapor(
          {
            catatan: formData.catatan,
            kelulusan: formData.kelulusan,
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
      if (data?.user?.keteranganRapor == null) {
        setFormData({
          id: data?.user?.id,
          catatan: "",
          kelulusan: "",
        });
      } else {
        setFormData({
          id: data?.user?.keteranganRapor?.mUserId,
          catatan: data?.user?.keteranganRapor?.catatan,
          kelulusan: data?.user?.keteranganRapor?.kelulusan,
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

  const [jenisRapor, setJenisRapor] = useState("");

  useEffect(() => {
    if (localStorage.getItem("jenisRapor")) {
      setJenisRapor(localStorage.getItem("jenisRapor"));
    }
  }, []);
  return (
    <>
      <div className="card card-ss">
        <div className="card-header p-4 card-header-ss">
          <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              Daftar Catatan Siswa
            </h4>
            <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column">
              <button
                className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-md-4 mt-md-0 mt-3 w-100`}
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-joyride="btn-filter-kelas"
              >
                {!jenisRapor || jenisRapor == "akhirSemester"
                  ? "Akhir Semester"
                  : "Tengah Semester"}
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
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th className="text-md-center text-start">Status</th>
                  <th className="text-md-center text-start">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {keterangan
                  ?.sort((a, b) =>
                    ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                  )
                  ?.map((d, idx) => {
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
                          {d?.user?.keteranganRapor?.catatan?.length == null &&
                          d?.user?.keteranganRapor?.kelulusan?.length !=
                            null ? (
                            <span className="label-ss rounded-pill bg-soft-danger color-danger fs-12-ss fw-semibold text-capitalize">
                              Belum Diberikan
                            </span>
                          ) : !d?.user?.keteranganRapor?.catatan?.length ? (
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
                          <a
                            className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none"
                            data-bs-toggle="modal"
                            data-bs-target="#modalCatatanSiswa"
                            onClick={() => onClickEdit(d)}
                          >
                            Beri Catatan
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
      <ModalCatatanSiswa
        handleChangeForm={handleChangeForm}
        formData={formData}
        _postKeteranganKelulusan={_postKeteranganKelulusan}
        handleChangeSelect={handleChangeSelect}
      />
    </>
  );
};

export default DaftarCatatanSiswa;
