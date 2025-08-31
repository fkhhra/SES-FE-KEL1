import { DatePicker } from "antd";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import HeaderDetailPerusahaan from "components/Perusahaan/HeaderDetailPerusahaan";
import ModalTambahBerkasMoU from "components/Perusahaan/ModalTambahBerkasMoU";
import ModalTambahBerkasSurat from "components/Perusahaan/ModalTambahBerkasSurat";
import ModalPenerimaanPkl from "components/Pkl/ModalPenerimaanPkl";
import ModalTambahPenerimaanSiswaPkl from "components/Pkl/ModalTambahPenerimaanSiswaPkl";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { showModal } from "utilities/ModalUtils";
import { detailPerusahaan } from "client/PerusahaanClient";
import {
  getPenerimaanPerusahaan,
  deletePenerimaanPerusahaan,
} from "client/PKLClient";
import swal from "sweetalert";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;
const initialFormData = {
  nama: "",
  logo: "",
  namaPt: "",
  bidang: "",
};

const index = ({ id }) => {
  const [editData, setditData] = useState(null);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [dataDetailPerusahaan, setDataDetailPerusahaan] = useState([]);
  const [penerimaanPerusahaan, setPenerimaanPerusahaan] = useState([]);
  const [status, setStatus] = useState(0);
  const [totalPenerimaanSiswa, setTotalPenerimaanSiswa] = useState(0);

  const _getDetailPerusahaan = async () => {
    const { data, error } = await detailPerusahaan(id);

    if (data) {
      setDataDetailPerusahaan(data?.perusahaan);
    }
  };
  const _getPenerimaanPerusahaan = async () => {
    const { data, error } = await getPenerimaanPerusahaan(id, { search });

    if (data) {
      setPenerimaanPerusahaan(data?.penerimaan);
      setStatus(data?.status);
      setTotalPenerimaanSiswa(data?.totalSiswa);
    }
  };

  const _deletePenerimaanPerusahaan = async (id) => {
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
          _getPenerimaanPerusahaan();
        }
      }
    });
  };

  useEffect(() => {
    _getDetailPerusahaan();
    _getPenerimaanPerusahaan();
  }, [debounceSearch]);

  return (
    <Layout
      modalWrapper={
        <>
          <ModalPenerimaanPkl
            editData={editData}
            _getPenerimaanPerusahaan={_getPenerimaanPerusahaan}
            id={id}
          />
        </>
      }
    >
      <AnimatePage>
        <>
          <div className="row gy-4">
            <div className="col-12">
              <HeaderDetailPerusahaan
                ssURL={ssURL}
                id={id}
                dataPerusahaan={dataDetailPerusahaan}
                _getDetailPerusahaan={_getDetailPerusahaan}
              />
            </div>
            <div className="col-12">
              <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss p-4">
                <div className="row">
                  <div className="col-lg-4 col-12 d-flex align-items-center">
                    <h1 className="fw-extrabold fs-4 color-dark mb-0">
                      Daftar Surat
                    </h1>
                  </div>
                  <div className="col-lg-8 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-lg-0 mt-3">
                    <div className="flex-grow-1 me-md-4 mb-md-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari penerimaan"
                        autoComplete="off"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="">
                      {status != 1 && (
                        <button
                          type="button"
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold col-12"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPenerimaanPkl"
                          onClick={() => setditData(null)}
                        >
                          <FaPlus /> Tambah
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-12 ">
                  <div
                    className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between mt-4"
                    style={{ backgroundColor: "#f8f8fb" }}
                  >
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                      <h6 className="fw-bold color-secondary mb-2">
                        Penerimaan
                      </h6>
                      <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                        {totalPenerimaanSiswa || 0} Siswa
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {penerimaanPerusahaan?.length != 0 ? (
              penerimaanPerusahaan?.map((d) => {
                return (
                  <div className="col-lg-6 mb-4">
                    <div className="card card-ss p-3">
                      <div className="d-flex flex-column flex-grow-1">
                        <div className="d-flex flex-sm-row flex-column">
                          <h1 className="fw-extrabold fs-5 color-dark mb-2 order-sm-1 order-2">
                            {d?.nama} - Tahun Ajaran {d?.ta?.tahun}
                            {/* Tahun Ajaran 2018/2019 */}
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
                                onClick={() => setditData(d)}
                              >
                                <a className="dropdown-item">
                                  <FaPen className="me-2" />
                                  <span>Edit</span>
                                </a>
                              </li>
                              <li
                                onClick={() =>
                                  _deletePenerimaanPerusahaan(d?.id)
                                }
                              >
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
                        <div className="d-flex justify-content-end flex-md-row flex-column">
                          {/* <div className="d-flex flex-wrap">
                      <a
                        className="text-decoration-none d-flex align-items-center me-3 mb-md-0 mb-2"
                        // href={getPreviewURL(d?.dataSiswa)}
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
                        // href={getPreviewURL(d?.suratTugas)}
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
                        // href={getPreviewURL(d?.mou)}
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
                    </div> */}
                          <Link
                            href={`${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/penerimaan/${d?.id}`}
                            as={`${ssURL}/perusahaan/${dataDetailPerusahaan?.id}/penerimaan/${d?.id}`}
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
        </>
      </AnimatePage>
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
