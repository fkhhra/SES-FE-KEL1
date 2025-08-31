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
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { getSarana } from "client/SaranaPrasaranaClient";
var Barcode = require("react-barcode");

const initialFormData = {
  lokasiId: null,
};

const Barang = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);

  const { page = 1 } = router.query;

  const { ta } = useTa();

  const [listBarang, setListBarang] = useState([]);
  const [total, setTotal] = useState(1);

  const [editData, setEditData] = useState(null);
  const [listLokasi, setListLokasi] = useState([]);

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const handleClickEdit = (editData) => {
    setEditData(editData);
  };

  const _getBarang = async () => {
    const { data } = await getBarang({
      page: page,
      search: debounceSearch,
      lokasi_id: formData?.lokasiId,
    });
    if (data) {
      setListBarang(data?.barang?.data);
      setTotal(data?.barang?.total);
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
        const { data, error } = await deleteBarang(deleteId);
        if (data) {
          toast.success(data?.message);
          _getBarang();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e.value,
    });
  };

  const getLokasiData = async (page = 1) => {
    const { data } = await getSarana({ page: page });

    const tempData = data?.lokasi?.data;

    if (data) {
      if (data?.lokasi?.lastPage > page) {
        return tempData.concat(await getLokasiData(page + 1));
      } else {
        return tempData;
      }
    }
  };

  useEffect(() => {
    (async () => {
      const lokasi = await getLokasiData();
      if (lokasi?.length > 0) {
        const newLokasi = lokasi?.map((lo) => ({
          value: lo.id,
          label: lo.nama,
        }));
        setListLokasi(newLokasi);
      }
    })();
  }, []);

  const handleClickDownload = async () => {
    const { data } = await dowloadBarang();

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  useEffect(() => {
    _getBarang();
  }, [page, debounceSearch, formData?.lokasiId]);

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
                        Barang
                      </h4>
                      <div
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalTambahBarang"
                        onClick={() => setEditData(null)}
                      >
                        <FaPlus className="me-2" />
                        Tambah Barang
                      </div>
                    </div>
                    <hr className="my-4" />
                    <div className="d-flex align-items-md-center flex-md-row flex-column">
                      <div className="flex-grow-1 me-md-3 mb-md-0 mb-3">
                        <input
                          type="text"
                          className="form-control form-search w-100 rounded-pill fw-semibold border-secondary-ss"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Barang"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="me-sm-3 mb-sm-0 mb-3 w-25">
                        <SelectShared
                          placeholder="Lokasi"
                          handleChangeSelect={(e) =>
                            handleChangeSelect(e, "lokasiId")
                          }
                          value={formData.lokasiId}
                          options={listLokasi}
                        />
                      </div>

                      <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                        <button
                          className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 mb-sm-0 mb-3 md-w-100"
                          onClick={handleClickDownload}
                        >
                          <FaCloudDownloadAlt className="me-2 fs-5" />
                          Rekap Barang
                        </button>
                        <button
                          className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold  border border-light-secondary-ss  md-w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalImportExcel"
                          data-joyride="btn-tambah-mapel"
                        >
                          <FaCloudUploadAlt className="me-2 fs-5" />
                          Unggah Data
                        </button>
                      </div>
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
                                    <Link href={`${ssURL}/barang/${data?.id}`}>
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
                                              Jumlah Barang :{" "}
                                              {data?.jumlah || "-"}
                                            </p>
                                            <p className="fs-14-ss color-primary fw-bold mb-4">
                                              {data?.merk || "-"}
                                            </p>
                                            <p className="fs-14-ss color-dark fw-bold mb-0">
                                              Kondisi
                                            </p>
                                            <div className="d-flex">
                                              <div className="me-4 d-flex">
                                                <span
                                                  style={{
                                                    height: "16px",
                                                    width: "16px",
                                                    marginTop: "2px",
                                                  }}
                                                  className="bg-soft-success rounded-circle me-2 d-flex align-items-center p-1"
                                                >
                                                  <FaCheck className="fs-10-ss color-success" />
                                                </span>
                                                <p className="fs-14-ss color-dark mb-0">
                                                  Baik :{" "}
                                                  <span className="fw-bold">
                                                    {data?.baik || "-"}
                                                  </span>
                                                </p>
                                              </div>
                                              <div className="me-4 d-flex">
                                                <span
                                                  style={{
                                                    height: "16px",
                                                    width: "16px",
                                                    marginTop: "2px",
                                                  }}
                                                  className="bg-soft-danger rounded-circle me-2 d-flex align-items-center p-1"
                                                >
                                                  <FaTimes className="fs-10-ss color-danger" />
                                                </span>

                                                <p className="fs-14-ss color-dark mb-0">
                                                  Rusak :{" "}
                                                  <span className="fw-bold">
                                                    {data?.rusak || "-"}
                                                  </span>
                                                </p>
                                              </div>
                                            </div>
                                            <Barcode
                                              value={data?.id}
                                              height={20}
                                            />
                                          </div>
                                        </div>
                                      </a>
                                    </Link>
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
        <ModalTambahBarang
          editData={editData}
          setEditData={setEditData}
          _getBarang={_getBarang}
        />
        <ModalImportExcel
          fileTemplate="/import/template-import-barang.xlsx"
          name="Barang"
          endpointUrl="barang/import"
        />
      </AnimatePage>
    </Layout>
  );
};

export default Barang;
