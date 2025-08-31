import { DatePicker } from "antd";
import { ssURL } from "client/clientAxios";
import {
  getPenerimaanPerusahaan,
  postPenerimaanPerusahaan,
  putPenerimaanPerusahaan,
  deletePenerimaanPerusahaan,
} from "client/PKLClient";
import Layout from "components/Layout/Layout";
import ModalPenerimaanPkl from "components/Pkl/ModalPenerimaanPkl";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { hideModal } from "utilities/ModalUtils";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { getPreviewURL } from "utilities/FileViewer";
const { RangePicker } = DatePicker;
const initialFormData = {
  nama: "",
  dataSiswa: "",
  suratTugas: "",
  mou: "",
};

const index = ({ id }) => {
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [debounceSearch] = useDebounce(search, 400);
  const [penerimaan, setPenerimaan] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [status, setStatus] = useState(false);
  const [totalSiswa, setTotalSiswa] = useState("");
  const [formData, setFormData] = useState({ ...initialFormData });
  const _getPenerimaan = async () => {
    const { data, error } = await getPenerimaanPerusahaan(id, { search });

    if (data) {
      setPenerimaan(data?.penerimaan);
      setPerusahaan(data?.perusahaan);
      setStatus(data?.status);
      setTotalSiswa(data?.totalSiswa);
    }
  };

  const _postPenerimaan = async (formData) => {
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }

    const payload = {
      ...formData,
      tkPerusahaanSekolahId: id,
    };

    const { data, error } = await postPenerimaanPerusahaan(payload);

    if (data) {
      toast.success(data?.message);
      hideModal("modalPenerimaanPkl");
      // setFormData({ ...initialFormData });
      _getPenerimaan();
    }
  };

  const _putPenerimaan = async (formData) => {
    const validate = formValidation(formData);
    if (validate) {
      toast.error(validate);
      return;
    }

    const payload = {
      ...formData,
      tkPerusahaanSekolahId: id,
    };

    const { data, error } = await putPenerimaanPerusahaan(
      formData?.id,
      payload
    );

    if (data) {
      toast.success(data?.message);
      hideModal("modalPenerimaanPkl");
      // setFormData({ ...initialFormData });
      _getPenerimaan();
    }
  };

  const formValidation = (formData) => {
    if (!formData?.nama) {
      return "Harap Memasukan Nama penerimaan";
    }
    if (!formData?.dataSiswa) {
      return "Harap Mengupload data siswa";
    }
    if (!formData?.suratTugas) {
      return "Harap Mengupload surat tugas";
    }
    if (!formData?.mou) {
      return "Harap Mengupload file mou";
    }
    return "";
  };

  const _deletePenerimaan = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePenerimaanPerusahaan(id);
        if (data) {
          toast.success(data.message);
          _getPenerimaan();
        }
      }
    });
  };

  useEffect(() => {
    _getPenerimaan();
  }, [debounceSearch]);

  return (
    <Layout
      modalWrapper={
        <>
          <ModalPenerimaanPkl
            editData={editData}
            handleSubmit={(data) =>
              editData ? _putPenerimaan(data) : _postPenerimaan(data)
            }
          />
        </>
      }
    >
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12 mb-4">
              <Link href={`${ssURL}/pkl/perusahaan`}>
                <a
                  className="text-decoration-none fw-bolder position-relative color-primary pointer"
                  data-joyride="button-kembali"
                >
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>
            <div className="col-md-12">
              <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
                <div
                  className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
                  style={{
                    minHeight: "150px",
                    background: `url("/img/bg-header-pkl.png")`,
                    backgroundPositionX: "right",
                    backgroundPositionY: "bottom",
                  }}
                >
                  <img
                    src={perusahaan?.logo}
                    style={{ width: "86px", height: "86px" }}
                    alt=""
                    className="img-fit-contain align-items-stretch mb-3"
                  />
                  <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                    <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                      {/* PT ITHO INDOSTOCK */} {perusahaan?.namaPt}
                    </h2>
                    <p className="fs-6 fw-bold mb-0">{perusahaan?.bidang}</p>
                  </div>
                </div>
                <div className="row px-4">
                  <div className="mb-4 order-3">
                    <div
                      className="rounded-ss px-4 py-3 h-100"
                      style={{ backgroundColor: `#F8F8FB` }}
                    >
                      <div className="d-flex flex-sm-row flex-column justify-content-md-start justify-content-between">
                        <div className="d-flex flex-md-row flex-column me-md-0 me-auto">
                          <div className="pe-4">
                            <h1 className="fs-6 fw-bold mb-1 ">Penerimaan</h1>
                            <h1
                              className="fw-extrabold fs-18-ss mb-md-0 mb-3"
                              style={{ color: `#4890fe` }}
                            >
                              {totalSiswa} Siswa
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card card-ss">
                    <div className="card-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                      <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                        Daftar Penerimaan
                      </h4>
                      <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-4 mb-sm-0 mb-3"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Penerimaan"
                          onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                          type="button"
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPenerimaanPkl"
                          onClick={() => setEditData(null)}
                        >
                          <FaPlus /> Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {penerimaan?.map((d) => {
                  return (
                    <div className="col-lg-6 mb-4">
                      <div className="card card-ss p-3">
                        <div className="d-flex flex-column flex-grow-1">
                          <div className="d-flex flex-sm-row flex-column">
                            <h1 className="fw-extrabold fs-5 color-dark mb-2 order-sm-1 order-2">
                              {d?.nama} - Tahun Ajaran {d?.ta?.tahun}
                            </h1>
                            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end ms-auto order-md-2 order-1">
                              <div
                                role="button"
                                id="dropdownx`x`Option"
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
                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalPenerimaanPkl"
                                  onClick={() => setEditData({ ...d })}
                                >
                                  <a className="dropdown-item">
                                    <FaPen className="me-2" />
                                    <span>Edit</span>
                                  </a>
                                </li>
                                <li onClick={() => _deletePenerimaan(d?.id)}>
                                  <a className="dropdown-item color-danger">
                                    <FaTrashAlt className="me-2" />
                                    <span>Hapus</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <h4 className="fw-semibold color-secondary fs-14-ss mb-4">
                            {d?.meta?.siswa} Siswa diterima
                          </h4>
                          <div className="d-flex justify-content-between flex-md-row flex-column">
                            <div className="d-flex flex-wrap">
                              <a
                                className="text-decoration-none d-flex align-items-center me-3 mb-md-0 mb-2"
                                href={getPreviewURL(d?.dataSiswa)}
                                target="_blank"
                              >
                                <img
                                  src="/img/file-solid.svg"
                                  alt="Logo-Server"
                                  style={{ width: `14px`, height: `14px` }}
                                  className="img-fit-contain"
                                />
                                <h1 className="fw-semibold color-primary fs-14-ss ps-2 mb-0">
                                  {" "}
                                  File Data Siswa
                                </h1>
                              </a>
                              <a
                                className="text-decoration-none d-flex align-items-center me-3 mb-md-0 mb-2"
                                href={getPreviewURL(d?.suratTugas)}
                                target="_blank"
                              >
                                <img
                                  src="/img/file-solid.svg"
                                  alt="Logo-Pengguna"
                                  style={{ width: `14px`, height: `14px` }}
                                  className="img-fit-contain"
                                />
                                <h1 className="fw-semibold color-primary fs-14-ss ps-2 mb-0 ">
                                  {" "}
                                  File Surat Tugas
                                </h1>
                              </a>
                              <a
                                className="text-decoration-none d-flex align-items-center me-3 mb-md-0 mb-2"
                                href={getPreviewURL(d?.mou)}
                                target="_blank"
                              >
                                <img
                                  src="/img/file-solid.svg"
                                  alt="Logo-Kalender"
                                  style={{ width: `14px`, height: `14px` }}
                                  className="img-fit-contain"
                                />
                                <h1 className="fw-semibold color-primary fs-14-ss ps-2 mb-0">
                                  {" "}
                                  File MoU
                                </h1>
                              </a>
                            </div>
                            <Link
                              href={`${ssURL}/pkl/penerimaan/${d?.id}`}
                              as={`${ssURL}/pkl/penerimaan/${d?.id}`}
                            >
                              <a className="bg-primary shadow-primary-ss hover-shadow-none rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 ms-auto">
                                Detail
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
