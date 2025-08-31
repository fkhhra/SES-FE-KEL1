import { DatePicker } from "antd";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import HeaderPkl from "components/Pkl/HeaderPkl";
import ModalTambahPerusahaan from "components/Pkl/ModalTambahPerusahaan";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  deletePerusahaanSekolah,
  getPerusahaanSekolah,
  postPerusahaan,
  postPerusahaanSekolah,
  putPerusahaanSekolah,
  getPerusahaan,
} from "client/PerusahaanClient";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import swal from "sweetalert";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import HeaderPerusahaan from "components/Perusahaan/HeaderPerusahaan";

const { RangePicker } = DatePicker;
const initialFormData = {
  nama: "",
  logo: "",
  namaPt: "",
  bidang: "",
};

const index = () => {
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [perusahaan, setPerusahaan] = useState([]);
  const [editData, setEditData] = useState(null);

  const _getPerusahaan = async () => {
    const { data, error } = await getPerusahaan({ search });

    if (data) {
      setPerusahaan(data?.perusahaanSekolah);
    }
  };

  const _deletePerusahaan = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePerusahaanSekolah(id);
        if (data) {
          toast.success(data.message);
          _getPerusahaan();
        }
      }
    });
  };

  const handleClickEdit = (editData) => {
    setEditData(editData);
  };

  useEffect(() => {
    _getPerusahaan();
  }, [debounceSearch]);

  const router = useRouter();

  // const perusahaan = [
  //   {
  //     img: "https://cdn.pixabay.com/photo/2016/08/09/21/54/lake-1581879__340.jpg",
  //     namaPerusahaan: "ITHO Indostock",
  //     namaPT: "PT ITHO Indostock",
  //     bidang: "Teknologi Edukasi",
  //     jumlahSiswa: 4,
  //   },
  //   {
  //     img: "/img/063-japan.png",
  //     namaPerusahaan: "ITHO Indostock",
  //     namaPT: "PT ITHO Indostock",
  //     bidang: "Teknologi Edukasi",
  //     jumlahSiswa: 4,
  //   },
  //   {
  //     img: "/img/063-japan.png",
  //     namaPerusahaan: "ITHO Indostock",
  //     namaPT: "PT ITHO Indostock",
  //     bidang: "Teknologi Edukasi",
  //     jumlahSiswa: 4,
  //   },
  //   {
  //     img: "/img/063-japan.png",
  //     namaPerusahaan: "ITHO Indostock",
  //     namaPT: "PT ITHO Indostock",
  //     bidang: "Teknologi Edukasi",
  //     jumlahSiswa: 4,
  //   },
  // ];

  return (
    <Layout
      modalWrapper={
        <>
          <ModalTambahPerusahaan
            editData={editData}
            setEditData={setEditData}
            _getPerusahaan={_getPerusahaan}
          />
        </>
      }
    >
      <AnimatePage>
        <>
          <div className="row">
            <div className="col-md-12">
              <HeaderPerusahaan ssURL={ssURL} judul={`Perusahaan`} />
            </div>
            <div className="col-md-12">
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card card-ss">
                    <div className="card-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                      <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                        Daftar Perusahaan
                      </h4>
                      <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-4 mb-sm-0 mb-3"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Perusahaan"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                          data-bs-toggle="modal"
                          data-bs-target="#modalTambahPerusahaan"
                          onClick={() => setEditData(null)}
                        >
                          <FaPlus /> Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-4 gy-4">
                {perusahaan != 0 ? (
                  perusahaan?.map((d) => {
                    return (
                      <div className="col-md-3">
                        <div className="card card-ss">
                          <div className="card-ss p-4 d-flex justify-content-center align-items-md-center flex-column">
                            <div className="dropdown dropdown-ss mb-2 ms-auto">
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
                                  data-bs-target="#modalTambahPerusahaan"
                                  onClick={() => setEditData(d?.perusahaan)}
                                >
                                  <a className="dropdown-item">
                                    <FaPen className="me-2" />
                                    <span>Edit</span>
                                  </a>
                                </li>
                                <li onClick={() => _deletePerusahaan(d?.id)}>
                                  <a className="dropdown-item color-danger">
                                    <FaTrashAlt className="me-2" />
                                    <span>Hapus</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
                              <img
                                src={d?.perusahaan?.logo}
                                alt="Logo-Server"
                                style={{ width: `69px`, height: `69px` }}
                                className="img-fit-contain align-items-stretch mb-3"
                              />
                              <h4 className="text-center fw-extrabold m-0 color-dark mb-2 fs-18-ss">
                                {d?.perusahaan?.nama}
                              </h4>
                              <h6 className="fw-semibold m-0  mb-3 fs-14-ss">
                                {d?.perusahaan?.bidang}
                              </h6>
                              {/* <h6 className="fw-semibold m-0  mb-2 fs-12-ss">
                              {d?.perusahaan?.bidang}
                            </h6> */}
                              <h6 className="fw-semibold m-0 fs-14-ss color-primary">
                                {d?.penerimaan?.reduce(
                                  (before, after) =>
                                    before + after?.meta?.total,
                                  0
                                ) || 0}{" "}
                                Siswa
                              </h6>
                            </div>
                            <Link
                              href={`${ssURL}/perusahaan/${d?.perusahaan?.id}/profil`}
                              as={`${ssURL}/perusahaan/${d?.perusahaan?.id}/profil`}
                            >
                              <a className="btn btn-ss btn-primary btn-primary-ss rounded-pill fw-bold fs-12-ss bg-gradient-primary shadow-primary-ss">
                                Detail
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="card-body p-4">
                    <div className="row justify-content-center">
                      <div className="col-md-6 col-sm-8 col-10 text-center">
                        <img
                          src="/img/empty-state-data.svg"
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-12 text-center">
                        <h4 className="color-dark fw-black mt-4 mb-2">
                          Tidak Ada Data
                        </h4>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      </AnimatePage>
    </Layout>
  );
};

export default index;
