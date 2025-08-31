import Layout from "components/Layout/Layout";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaDownload,
  FaFilter,
  FaPen,
  FaPlus,
  FaPrint,
  FaTrashAlt,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { DatePicker, Pagination } from "antd";
import GrafikMutasi from "components/Mutasi/GrafikMutasi";
import ModalTambahTransaksi from "components/Shared/ModalTambahTransaksi/ModaTambahTransaksi";
import {
  getPenerimaanPklSiswa,
  postPenerimaanPklSiswa,
  putPenerimaanPklSiswa,
  deletePenerimaanPklSiswa,
} from "client/PenerimaanClient";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import { useRouter } from "next/router";
import ModalDownloadMutasi from "components/Mutasi/ModalDownloadMutasi";
import dataHari from "data/hari.json";
import dataBulan from "data/bulan.json";
import {
  getTotalPemasukan,
  getTotalPengeluaran,
  getTotalSaldo,
} from "utilities/TagihanUtils";
import { getRekeningSekolah } from "client/RekeningSekolahClient";
import GrafikKeuangan from "components/Rekening/GrafikKeuangan";
import { baseURL, downloadURL, ssURL } from "client/clientAxios";
import NewModalTambahTransaksi from "components/Shared/NewModalTambahTransaksi/NewModaTambahTransaksi";
import ListTransaksi from "components/Mutasi/ListTransaksi";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import HeaderPkl from "components/Pkl/HeaderPkl";
import ModalPenerimaanPkl from "components/Pkl/ModalPenerimaanPkl";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import LayoutDetail from "components/Layout/LayoutDetail";
import ModalTambahPenerimaanSiswaPkl from "components/Pkl/ModalTambahPenerimaanSiswaPkl";
import ModalTanggalPkl from "components/Pkl/ModalTanggalPkl";
import { hideModal } from "utilities/ModalUtils";
import { getPreviewURL } from "utilities/FileViewer";

const { RangePicker } = DatePicker;

const index = ({ id }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [penerimaanPkl, setPenerimaanPkl] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [penerimaan, setPenerimaan] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [editData, setEditData] = useState(null);

  const _getPenerimaanPkl = async () => {
    const { data, error } = await getPenerimaanPklSiswa(id, { search });

    if (data) {
      setPerusahaan(data?.perusahaan);
      setPenerimaan(data?.penerimaan);
      setSiswa(data?.siswa);
    }
  };

  const _putPenerimaanPkl = async (formData) => {
    const { data, error } = await putPenerimaanPklSiswa(formData?.id, {
      ...formData,
      tanggalSelesai: momentPackage(formData?.tanggalSelesai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggalMulai: momentPackage(formData?.tanggalMulai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    if (data) {
      toast.success(data?.message);
      hideModal("ModalTanggalPkl");
      // setFormData({ ...initialFormData });
      _getPenerimaanPkl();
    }
  };

  const _deletePenerimaanPkl = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePenerimaanPklSiswa(id);
        if (data) {
          toast.success(data.message);
          _getPenerimaanPkl();
        }
      }
    });
  };

  useEffect(() => {
    _getPenerimaanPkl();
  }, [debounceSearch]);

  return (
    <LayoutDetail title={`${penerimaan?.nama} - ${penerimaan?.tahun}`}>
      <AnimatePage>
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
                <div className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover">
                  <img
                    src={perusahaan?.logo}
                    style={{ width: "86px", height: "86px" }}
                    alt=""
                    className="img-fit-contain align-items-stretch mb-3"
                  />
                  <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                    <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                      {perusahaan?.namaPt}
                    </h2>
                    <p className="fs-6 fw-bold mb-0">{perusahaan?.bidang}</p>
                  </div>
                </div>
                <div className="row px-4 mb-4">
                  <div className="col-lg-4 mb-lg-0 mb-4">
                    <div
                      className="status-info p-3 rounded-ss d-flex flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100 "
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5">
                        <h6 className="fw-bold color-secondary mb-2">
                          Penerimaan
                        </h6>
                        <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                          {siswa?.length} Siswa
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <a
                          className="file-attachment-ss d-flex align-items-center p-3 rounded-ss w-100 pointer"
                          href={getPreviewURL(penerimaan?.dataSiswa)}
                          target="_blank"
                        >
                          <img src="/img/icon-file-download.svg" alt="file" />
                          <h6 className="fw-bold color-dark ms-3 mb-0">
                            File Data Siswa
                          </h6>
                        </a>
                      </div>
                      <div className="col-md-4">
                        <a
                          className="file-attachment-ss d-flex align-items-center p-3 rounded-ss w-100 pointer"
                          href={getPreviewURL(penerimaan?.suratTugas)}
                          target="_blank"
                        >
                          <img src="/img/icon-file-download.svg" alt="file" />
                          <h6 className="fw-bold color-dark ms-3 mb-0">
                            File Surat Tugas
                          </h6>
                        </a>
                      </div>
                      <div className="col-md-4">
                        <a
                          className="file-attachment-ss d-flex align-items-center p-3 rounded-ss w-100 pointer"
                          href={getPreviewURL(penerimaan?.mou)}
                          target="_blank"
                        >
                          <img src="/img/icon-file-download.svg" alt="file" />
                          <h6 className="fw-bold color-dark ms-3 mb-0">
                            File MoU
                          </h6>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Siswa
                  </h4>
                  <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-4 mb-sm-0 mb-3"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari Nama Siswa"
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalTambahPenerimaanSiswaPkl"
                      // onClick={() => setEditData({ nama: "" })}
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Tanggal Mulai</th>
                          <th>Tanggal Selesai</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siswa?.map((d, idx) => {
                          return (
                            <tr>
                              <td>{idx + 1}</td>
                              <td data-th="Nama">{d?.user?.nama}</td>
                              <td data-th="Mulai">
                                {momentPackage(d?.tanggalMulai).format(
                                  "DD MMMM YYYY"
                                )}
                              </td>
                              <td data-th="Selesai">
                                {momentPackage(d?.tanggalSelesai).format(
                                  "DD MMMM YYYY"
                                )}
                              </td>
                              <td data-th="Aksi">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <button
                                    type="button"
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#ModalTanggalPkl"
                                    onClick={() => setEditData({ ...d })}
                                    data-joyride="edit-mapel"
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => _deletePenerimaanPkl(d?.id)}
                                    data-joyride="delete-siswapkl"
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalTambahPenerimaanSiswaPkl
            id={id}
            data={siswa}
            _detailPenerimaanPkl={_getPenerimaanPkl}
          />
          <ModalTanggalPkl
            editData={editData}
            // id={id}
            handleSubmit={(data) => (editData ? _putPenerimaanPkl(data) : null)}
            // data={siswa}
            // _detailPenerimaanPkl={_getPenerimaanPkl}
          />
        </>
      </AnimatePage>
    </LayoutDetail>
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
