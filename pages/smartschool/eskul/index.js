import {
  FaCheck,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaDownload,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import Link from "next/link";
import { baseURL, downloadURL, ssURL } from "../../../client/clientAxios";
import ModalTambahBarang from "../../../components/Barang/ModalTambahBarang";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { Pagination } from "antd";
import { useRouter } from "next/router";
import {
  deleteBarang,
  dowloadBarang,
  getBarang,
} from "../../../client/BarangClient";
import ModalImportExcel from "../../../components/Shared/Modal/ModalImportExcel";
import { useDebounce } from "use-debounce";
import { deleteEskul, getEskul } from "client/EskulClient";
import ModalTambahEkstrakurikuler from "components/Ekstrakurikuler/ModalTambahEkstrakurikuler";

const Barang = () => {
  const router = useRouter();

  const { page = 1 } = router.query;

  const { ta } = useTa();

  const [listBarang, setListBarang] = useState([]);
  const [total, setTotal] = useState(1);

  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const handleClickEdit = (editData) => {
    setEditData(editData);
  };

  const _getBarang = async () => {
    const { data } = await getEskul({ page: page, search: debounceSearch });
    if (data) {
      setListBarang(data?.data?.data);
      setTotal(data?.data?.total);
    }
  };

  const handleClickDelete = (deleteId) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteEskul(deleteId);
        if (data) {
          toast.success(data?.message);
          _getBarang();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleClickDownload = async () => {
    const { data } = await dowloadBarang();

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  useEffect(() => {
    _getBarang();
  }, [page, debounceSearch]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-12">
            {ta ? (
              <>
                <div className="card card-ss mb-4">
                  <div className="card-header p-4 card-header-ss">
                    <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                      <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                        Ekstrakurikuler
                      </h4>
                      <div
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalTambahBarang"
                        onClick={() => setEditData(null)}
                      >
                        <FaPlus className="me-2" />
                        Tambah Ekstrakurikuler
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="row">
                      <div className="col-lg-6 col-md-6 mb-3">
                        <input
                          type="text"
                          className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                          style={{ height: "42px", width: "100%" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Ekstrakurikuler"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      {/* <div className="col-lg-3 col-md-6 mb-3">
                        <button
                          className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss w-100"
                          onClick={handleClickDownload}
                        >
                          <FaCloudDownloadAlt className="me-2 fs-5" />
                          Rekap Barang
                        </button>
                      </div>
                      <div className="col-lg-3 col-md-6 mb-3">
                        <button
                          className="btn btn-ss btn-secondary btn-secondary-ss rounded-pill fw-semibold  border border-light-secondary-ss w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalImportExcel"
                          data-joyride="btn-tambah-mapel"
                        >
                          <FaCloudUploadAlt
                            className="me-2 fs-5"
                            color="white"
                          />
                          Unggah Data
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="card card-ss">
                  <div className="row gy-4 px-4 pt-4">
                    {listBarang?.length > 0 &&
                      listBarang?.map((data, idx) => {
                        return (
                          <div className="col-lg-6">
                            <div
                              className={`card rounded-ss pointer`}
                              style={{
                                background: "rgba(244,244,247,.25)",
                                border: "none",
                              }}
                            >
                              <div className="card-body card-body-ss p-4">
                                <div className="row">
                                  <div className="col-md-11 order-md-1 order-2">
                                    {/* <Link href={`${ssURL}/barang/${data?.id}`}> */}
                                    <a>
                                      <div className="row">
                                        <div className="col-md-4">
                                          <img
                                            src={data?.foto?.[0]}
                                            className="img-fluid w-100 img-fit-cover rounded-ss mb-4 mb-md-0"
                                            style={{
                                              height: "131px",
                                            }}
                                          />
                                        </div>
                                        <div className="col-md-8">
                                          <p className="fs-18-ss color-dark fw-extrabold mb-0">
                                            {data?.nama || "-"}
                                          </p>
                                          <p className="fs-14-ss color-dark fw-bold mb-0">
                                            {data?.program || "-"}
                                          </p>
                                        </div>
                                      </div>
                                    </a>
                                    {/* </Link> */}
                                  </div>{" "}
                                  <div className="col-md-1 order-md-3 order-1 mb-md-0 mb-4">
                                    {/* Dropdown Option Start */}

                                    <div className="dropdown dropdown-ss mb-0 d-md-inline d-flex justify-content-end">
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
                                        <li
                                          data-bs-toggle="modal"
                                          data-bs-target="#ModalTambahBarang"
                                          onClick={() => handleClickEdit(data)}
                                        >
                                          <a className="dropdown-item">
                                            <FaPen className="me-2" />
                                            <span>Edit</span>
                                          </a>
                                        </li>
                                        <li
                                          onClick={() =>
                                            handleClickDelete(data?.id)
                                          }
                                        >
                                          <a className="dropdown-item color-danger">
                                            <FaTrashAlt className="me-2" />
                                            <span>Hapus</span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                    {/* Dropdown Option End */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                      <Pagination
                        total={total}
                        showSizeChanger={false}
                        current={page || 1}
                        pageSize={20}
                        onChange={(e) =>
                          router.push(`${ssURL}/lokasi?page=${e}`)
                        }
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card card-ss">
                <div className="p-4">
                  <div className="alert alert-danger">
                    Anda belum mengaktifkan tahun akademik. Klik{" "}
                    <Link href={`${ssURL}/tahun-akademik`}>disini</Link> untuk
                    memilih tahun akademik yang aktif
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ModalTambahEkstrakurikuler
          editData={editData}
          setEditData={setEditData}
          _getBarang={_getBarang}
        />
      </AnimatePage>
    </Layout>
  );
};

export default Barang;
