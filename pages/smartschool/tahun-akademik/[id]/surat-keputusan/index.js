import { useEffect, useState } from "react";
import {
  FaPen,
  FaPlus,
  FaPrint,
  FaTrashAlt,
  FaChevronLeft,
} from "react-icons/fa";
import { Tooltip } from "antd";
import { ssURL } from "client/clientAxios";
import { useDebounce } from "use-debounce";
import {
  deleteSuratKeputusan,
  getSuratKeputusan,
} from "client/SuratKeputusanClient";
import { momentPackage } from "utilities/HelperUtils";
import { showModal } from "utilities/ModalUtils";

import swal from "sweetalert";
import toast from "react-hot-toast";

import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalTambahSuratKeputusanTA from "components/TahunAkademik/ModalTambahSuratKeputusanTA";
import Avatar from "components/Shared/Avatar/Avatar";
import ModalPenerimaSuratKeputusan from "components/TahunAkademik/ModalPenerimaSuratKeputusan";
import Link from "next/link";
import useEditModal from "hooks/useEditModal";
import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import LayoutDetailTahunAkademik from "components/Layout/LayoutDetailTahunAkademik";

const index = () => {
  const { setEditModal } = useEditModal();

  const [suratKeputusanData, setSuratKeputusanData] = useState(null);
  const [listSemuaPenerima, setListSemuaPenerima] = useState([]);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const { surat: daftarSurat } = suratKeputusanData || {};

  const _getSuratKeputusan = async () => {
    let params = {};
    search && (params.search = search);
    const { data } = await getSuratKeputusan(params);
    if (data) {
      setSuratKeputusanData(data);
    }
  };

  const onClickDeleteSuratKeputusan = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteSuratKeputusan(id);
        if (data) {
          toast.success(data?.message);
          _getSuratKeputusan();
        }
      }
    });
  };

  const onClickEdit = (editData) => {
    showModal("modal-surat-keputusan-ta");
    setEditModal("modalSuratKeputusanTa", editData);
  };

  useEffect(() => {
    _getSuratKeputusan();
  }, [debounceSearch]);

  return (
    <LayoutDetailTahunAkademik>
      <AnimatePage>
        <div
          className="row mb-4 mt-md-0 mt-4 sticky-top md-position-static"
          style={{ top: "101px" }}
        >
          <div className="col-md-12">
            <Link href={`${ssURL}/tahun-akademik-v2/`}>
              <a
                className="text-decoration-none fw-bolder position-relative color-primary pointer"
                data-joyride="button-kembali"
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="row  pb-4">
          <div className="col-lg-3">
            <SideNavTahunAkademik ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss w-100 d-flex flex-md-row flex-column p-0 pb-5 ">
              <div className="col-md-12 ">
                <div className="row p-4">
                  <div className="col-lg-4 col-12 d-flex align-items-center">
                    <h1 className="fw-extrabold fs-4 color-dark mb-0">
                      Surat Keputusan
                    </h1>
                  </div>
                  <div className="col-lg-8 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-lg-0 mt-3">
                    <div className="flex-grow-1 me-md-4 mb-md-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari Surat"
                        autoComplete="off"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="">
                      <button
                        type="button"
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold col-12"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-surat-keputusan-ta"
                        onClick={() =>
                          setEditModal("modalSuratKeputusanTa", null)
                        }
                      >
                        <FaPlus /> Tambah
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="" data-joyride="table-rombel">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Penerima</th>
                          <th className="text-md-center">Tanggal</th>
                          <th className="text-md-center">Detail</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {daftarSurat?.map((surat, index) => {
                          const allSuratUser = surat?.suratUser || [];

                          const displayedPenerima =
                            allSuratUser?.slice(0, 2) || [];
                          const remainingPenerima =
                            allSuratUser?.slice(2, 5) || [];

                          return (
                            <tr key={`${index}-${new Date().getTime()}`}>
                              <td data-th="No">{index + 1}</td>
                              <td data-th="Nama">{surat?.nama}</td>
                              <td
                                data-th="Penerima"
                                className="list-penerima-surat-keputusan"
                              >
                                <div className="pointer position-relative">
                                  <div className="d-flex">
                                    {displayedPenerima?.map((user, index) => (
                                      <>
                                        {index == 0 ? (
                                          <Avatar
                                            name={user?.user?.nama}
                                            //   src={""}
                                            size={40}
                                          />
                                        ) : (
                                          <div
                                            className=""
                                            style={{
                                              marginLeft: "-16px",
                                            }}
                                          >
                                            <Avatar
                                              name={user?.user?.nama}
                                              //   src={""}
                                              size={40}
                                            />
                                          </div>
                                        )}
                                      </>
                                    ))}

                                    {remainingPenerima?.length > 0 && (
                                      <div
                                        className="rounded-circle bg-white shadow-primary-ss d-flex justify-content-center align-items-center color-primary fw-bold fs-12-ss position-relative"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          marginLeft: "-16px",
                                          // zIndex: "1",
                                        }}
                                      >
                                        {remainingPenerima?.length >= 3
                                          ? `+${allSuratUser?.length}`
                                          : `+${remainingPenerima?.length}`}
                                      </div>
                                    )}
                                  </div>
                                  <ul className="list-penerima-surat-keputusan-menu my-1">
                                    {remainingPenerima?.map((user, index) => (
                                      <li
                                        className="pointer list-penerima-surat-keputusan-item"
                                        key={`${index}-${new Date().getTime()}`}
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="d-flex align-items-center  w-75">
                                            <Avatar
                                              name={user?.user?.nama}
                                              src=""
                                              size={30}
                                              className="me-3"
                                            />
                                            <Tooltip title={user?.user?.nama}>
                                              <p className="fs-16-ss mb-0 fw-bold text-truncate">
                                                {user?.user?.nama}
                                              </p>
                                            </Tooltip>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                    {remainingPenerima?.length == 3 && (
                                      <li
                                        className="pointer list-penerima-surat-keputusan-item"
                                        onClick={() =>
                                          setListSemuaPenerima(allSuratUser)
                                        }
                                      >
                                        <a
                                          data-bs-toggle="modal"
                                          data-bs-target="#modalPenerimaSuratKeputusan"
                                          className="fw-bold mb-0"
                                        >
                                          Tampilkan Semua
                                        </a>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </td>
                              <td data-th="Tanggal" className="text-md-center">
                                {momentPackage(surat?.createdAt).format(
                                  "DD MMM YYYY"
                                )}
                              </td>
                              <td data-th="Detail" className="text-md-center">
                                <a
                                  href={surat?.file}
                                  target="_blank"
                                  className="rounded-circle bg-soft-primary mx-md-auto color-secondary d-flex align-items-center justify-content-center btn-link btn p-1"
                                  style={{ height: "30px", width: "30px" }}
                                >
                                  <FaPrint />
                                </a>
                              </td>
                              <td>
                                <div className="dropdown dropdown-ss">
                                  <div
                                    role="button"
                                    id="dropdownOption"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <img
                                      src={`/img/icon-dropdown-option.svg`}
                                      alt="icon-option"
                                    />
                                  </div>
                                  <ul
                                    className="dropdown-menu dropdown-menu-ss my-1"
                                    aria-labelledby="dropdownOption"
                                  >
                                    <li onClick={() => onClickEdit(surat)}>
                                      <a className="dropdown-item">
                                        <FaPen className="me-2" />
                                        <span>Edit</span>
                                      </a>
                                    </li>
                                    <li
                                      onClick={() =>
                                        onClickDeleteSuratKeputusan(surat.id)
                                      }
                                    >
                                      <a className="dropdown-item color-danger">
                                        <FaTrashAlt className="me-2" />
                                        <span>Hapus</span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* // )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalTambahSuratKeputusanTA _getSuratKeputusan={_getSuratKeputusan} />
        <ModalPenerimaSuratKeputusan users={listSemuaPenerima} />
      </AnimatePage>
    </LayoutDetailTahunAkademik>
  );
};

export default index;
