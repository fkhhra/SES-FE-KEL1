import { DatePicker, Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import {
  getPenerimaanPkl,
  getPenerimaanPkl31,
  getTambahPenerimaanPkl31,
} from "client/PenerimaanClient";
import Layout from "components/Layout/Layout";
import HeaderPkl from "components/Pkl/HeaderPkl";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { motion } from "framer-motion";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDebounce } from "use-debounce";
const { RangePicker } = DatePicker;
import Skeleton from "react-loading-skeleton";
import HeaderPenerimaan from "components/Penerimaan/HeaderPenerimaan";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaDownload,
  FaFileImport,
  FaPen,
  FaPlus,
  FaPrint,
  FaTrash,
  FaTrashAlt,
  FaWhatsapp,
  FaFile,
} from "react-icons/fa";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalBerkas from "components/Penerimaan/ModalBerkas";
import ModalNilaiPklSiswa from "components/Penerimaan/ModalNilaiPklSiswa";
import ModalEditPenerimaanSiswa from "components/Penerimaan/ModalEditPenerimaanSiswa";
import ModalTambahPrakerinSiswa from "components/kakomli/ModalTambahPrakerinSiswa";
import HeaderKakomli from "components/kakomli/HeaderKakomli";
import ModalEditUkkSiswa from "components/kakomli/ModalEditUkkSiswa";
import Link from "next/link";
import { getUkkSiswa, deleteUkkSiswa } from "client/KakomliClient";
import useTa from "hooks/useTa";
import { momentPackage } from "utilities/HelperUtils";
import swal from "sweetalert";
import toast from "react-hot-toast";
const initialFormData = {
  jurusanId: "",
};
const index = ({ m_ta_id }) => {
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  const { page = 1 } = router.query;

  const [siswa, setSiswa] = useState([]);
  const { ta } = useTa();
  const [ukk, setUkk] = useState({});
  const { semuaTA } = ukk;
  const [tipeTa, setTipeTA] = useState({ value: m_ta_id });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [jurusan, setJurusan] = useState([]);
  const [editData, setEditData] = useState(null);

  const _getUkkSiswa = async () => {
    setIsLoading(true);
    const { data, error } = await getUkkSiswa({
      m_ta_id: tipeTa?.value || ta.id,
      page,
      search,
      jurusan_id: formData?.jurusanId,
    });

    if (data) {
      setSiswa(data?.siswa);
      setUkk(data);
      setJurusan(data?.jurusan);
    }
    setIsLoading(false);
  };

  const _deleteUkk = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteUkkSiswa(id);
        if (data) {
          toast.success(data.message);
          _getUkkSiswa();
        }
      }
    });
  };

  const changeTA = (value) => {
    setTipeTA(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, m_ta_id: value?.value },
    });
  };

  useEffect(() => {
    _getUkkSiswa();
  }, [page, debounceSearch, formData?.jurusanId]);

  return (
    <Layout modalWrapper={<></>}>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <AnimatePage>
        <>
          <div className="row">
            <div className="col-md-12">
              <HeaderKakomli
                ssURL={ssURL}
                semuaTA={semuaTA}
                ta={ta}
                tipeTa={tipeTa}
                changeTA={changeTA}
              />
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header p-0 card-header-ss">
                  <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column p-4">
                    <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                      Daftar Uji Kompetensi Keahlian Siswa
                    </h4>
                  </div>
                  <hr className="m-0" />
                  <div className="p-4">
                    <div className="row g-4">
                      <div className="col-md-9">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 flex-grow-1"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari siswa atau perusahaan"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <div className="select-perencanaan-analisis-keuangan flex-grow-1">
                          <SelectShared
                            placeholder="Pilih jurusan"
                            handleChangeSelect={(e, name) => {
                              setIsLoading(true);

                              setFormData({
                                ...formData,
                                jurusanId: e?.value,
                              });
                              setTimeout(() => {
                                setIsLoading(false);
                              }, 350);
                            }}
                            value={formData?.jurusanId || "Semua"}
                            options={[
                              { label: "Semua", value: "" },
                              ...jurusan?.map((d) => {
                                return {
                                  label: d?.kode,
                                  value: d?.id,
                                };
                              }),
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Siswa</th>
                          <th>Penguji</th>
                          <th className="text-md-center">Tanggal</th>
                          <th className="text-md-center">Detail</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <>
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Penguji">
                                <Skeleton />
                              </td>
                              <td data-th="Tanggal">
                                <Skeleton />
                              </td>
                              <td data-th="Detail">
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Penguji">
                                <Skeleton />
                              </td>
                              <td data-th="Tanggal">
                                <Skeleton />
                              </td>
                              <td data-th="Detail">
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Penguji">
                                <Skeleton />
                              </td>
                              <td data-th="Tanggal">
                                <Skeleton />
                              </td>
                              <td data-th="Detail">
                                <Skeleton />
                              </td>
                              <td>
                                <Skeleton />
                              </td>
                            </tr>
                          </>
                        ) : siswa?.data?.length ? (
                          siswa?.data?.map((d, idx) => {
                            return (
                              <tr>
                                <td data-th="No">{idx + 1}</td>
                                <td data-th="Nama Siswa">
                                  <h6 className="fw-semibold color-dark mb-2">
                                    {d?.nama}
                                  </h6>
                                  <span className="fs-14-ss fw-semibold">
                                    {d?.anggotaRombel?.rombel?.nama || "-"}
                                  </span>
                                </td>
                                <td data-th="Penguji">
                                  <h6 className="fw-semibold color-dark mb-2">
                                    {d?.ukkSiswa?.pembimbing || "-"}
                                  </h6>
                                </td>
                                <td
                                  data-th="Tanggal"
                                  className="text-md-center"
                                >
                                  <h6 className="fw-semibold color-dark">
                                    {d?.ukkSiswa?.tanggal != null
                                      ? momentPackage(
                                          d?.ukkSiswa?.tanggal
                                        ).format("DD MMM YYYY")
                                      : "-"}
                                  </h6>
                                </td>
                                <td data-th="Detail" className="text-md-center">
                                  <Link
                                    href={`${ssURL}/kakomli/ukk/[ukk_id]`}
                                    as={`${ssURL}/kakomli/ukk/${d?.id}`}
                                  >
                                    <a className="btn btn-ss btn-primary btn-primary-ss rounded-pill fw-bold fs-12-ss bg-gradient-primary shadow-primary-ss">
                                      Lihat
                                    </a>
                                  </Link>
                                </td>
                                <td data-th="Aksi">
                                  <div className="d-flex flex-lg-row flex-md-column flex-row">
                                    {/* <button
                                      type="button"
                                      className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-5 me-3 mb-lg-0 mb-md-3 mb-0 p-1"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalEditPenerimaanSiswa"
                                      // onClick={() => setEditDataSiswa(d)}
                                      data-joyride="edit-mapel"
                                    >
                                      <FaPrint className="color-secondary fs-5" />
                                    </button> */}
                                    <button
                                      type="button"
                                      className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-5 me-3 mb-lg-0 mb-md-3 mb-0 p-1"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalEditUkkSiswa"
                                      onClick={() => setEditData(d)}
                                      data-joyride="edit-mapel"
                                    >
                                      <FaPen className="color-secondary fs-5" />
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-5 me-3 mb-lg-0 mb-md-3 mb-0 p-1"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      onClick={() =>
                                        _deleteUkk(d?.ukkSiswa?.id)
                                      }
                                      data-joyride="edit-mapel"
                                    >
                                      <FaTrashAlt className="color-secondary fs-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6}>
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
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                  <Pagination
                    total={siswa?.total}
                    showSizeChanger={false}
                    current={page || 1}
                    pageSize={25}
                    onChange={(e) =>
                      router.push(`${ssURL}/kakomli/ukk?page=${e}`)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <ModalTambahPrakerinSiswa />
          <ModalEditUkkSiswa
            editData={editData}
            _getUkkSiswa={_getUkkSiswa}
            id={tipeTa?.value || ta.id}
          />
        </>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { m_ta_id } }) {
  return {
    props: {
      m_ta_id: m_ta_id || "",
    },
  };
}

export default index;
