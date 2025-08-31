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

const Ektrakurikuler = () => {
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
        <div className="row g-4">
          {ta ? (
            <>
              <div className="col-12">
                <div className="card card-ss">
                  <div className="card card-ss p-4">
                    <div className="row justify-content-between">
                      <div className="col-md-3 d-flex align-items-center">
                        <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                          Ekstrakurikuler
                        </h4>
                      </div>
                      <div className="col-lg-6 col-md-8 d-flex align-items-md-center justify-content-end flex-md-row flex-column">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fw-semibold border-secondary-ss flex-grow-1 md-w-100"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Ekstrakurikuler"
                          //   value={search}
                          //   onChange={(e) => setSearch(e.target.value)}
                        />
                        <div
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-md-3 ms-0 mt-md-0 mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#modalTambahEkstrakurikuler"
                          //   onClick={() => setEditData(null)}
                        >
                          <FaPlus className="me-2" />
                          Tambah
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {listBarang?.map((d) => {
                return (
                  <div className="col-md-6">
                    <div
                      className="card card-ss p-4 bg-no-repeat bg-cover"
                      style={{
                        minHeight: "130px",
                        backgroundImage: `url("/img/bg-card-ekstrakurikuler.png")`,
                        backgroundColor: "white",
                        backgroundPosition: "right bottom",
                      }}
                    >
                      <div className="d-flex justify-content-between">
                        <Link
                          href={`${ssURL}/ekstrakurikuler/[id]`}
                          as={`${ssURL}/ekstrakurikuler/${d?.id}`}
                        >
                          <a className="flex-grow-1">
                            <div className="flex-grow-1">
                              <h4 className="fw-extrabold color-dark mb-2">
                                {d?.nama}
                              </h4>
                              <h6 className="fs-14-ss fw-bold mb-0 color-secondary">
                                {d?.anggotaEkskul?.length} Anggota
                              </h6>
                            </div>
                          </a>
                        </Link>

                        <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                          <div
                            role="button"
                            id="dropdownOption"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img
                              src="/img/icon-dropdown-option.svg"
                              alt="icon-dropdown"
                              className="ms-auto mb-auto pb-3 ps-3"
                            />
                          </div>
                          <ul
                            className="dropdown-menu dropdown-menu-ss my-1"
                            aria-labelledby="dropdownOption"
                          >
                            <li
                              onClick={() => handleClickEdit(d)}
                              data-bs-toggle="modal"
                              data-bs-target="#modalTambahEkstrakurikuler"
                            >
                              <a className="dropdown-item">
                                <FaPen className="me-2" />
                                <span>Edit</span>
                              </a>
                            </li>
                            <li onClick={() => handleClickDelete(d?.id)}>
                              <a className="dropdown-item color-danger">
                                <FaTrashAlt className="me-2" />
                                <span>Hapus</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="col-12">
              <div className="card card-ss">
                <div className="p-4">
                  <div className="alert alert-danger">
                    Anda belum mengaktifkan tahun akademik. Klik{" "}
                    <Link href={`${ssURL}/tahun-akademik`}>disini</Link> untuk
                    memilih tahun akademik yang aktif
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default Ektrakurikuler;
