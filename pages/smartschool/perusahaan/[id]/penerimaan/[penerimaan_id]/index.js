import { DatePicker } from "antd";
import {
  deletePenerimaanPklSiswa,
  getPenerimaanPklSiswa,
} from "client/PenerimaanClient";
import LayoutDetailPenerimaanPerusahaan from "components/Layout/LayoutDetailPenerimaanPerusahaan";
import ModalTambahPenerimaanSiswaPkl from "components/Pkl/ModalTambahPenerimaanSiswaPkl";
import ModalTanggalPkl from "components/Pkl/ModalTanggalPkl";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
const { RangePicker } = DatePicker;

const initialFormData = {
  penerimaanId: "",
};
const index = ({ penerimaan_id }) => {
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [debounceSearch] = useDebounce(search, 400);
  const [penerimaanPkl, setPenerimaanPkl] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [penerimaan, setPenerimaan] = useState([]);
  const [semuaPenerimaan, setsemuaPenerimaan] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [editData, setEditData] = useState(null);

  const _getPenerimaanPkl = async () => {
    const { data, error } = await getPenerimaanPklSiswa(penerimaan_id, {
      search,
    });

    if (data) {
      setPerusahaan(data?.perusahaan);
      setPenerimaan(data?.penerimaan);
      setSiswa(data?.siswa);
      setsemuaPenerimaan(data?.semuaPenerimaan);
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

  const handleChangePenerimaan = (e, name) => {
    // setIsLoading(true);

    setFormData({
      ...formData,
      penerimaanId: e?.value,
    });
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 350);
  };

  useEffect(() => {
    _getPenerimaanPkl();
  }, [debounceSearch, formData?.penerimaanId]);

  return (
    <LayoutDetailPenerimaanPerusahaan
      perusahaan={perusahaan?.nama}
      dataPerusahaan={perusahaan}
      semuaPenerimaan={semuaPenerimaan}
      selectPenerimaan={formData?.penerimaanId}
      urlPenerimaan={handleChangePenerimaan}
    >
      <AnimatePage>
        <ModalTambahPenerimaanSiswaPkl
          id={penerimaan_id}
          data={siswa}
          _detailPenerimaanPkl={_getPenerimaanPkl}
        />
        <ModalTanggalPkl
          editData={editData}
          _getPenerimaanPkl={_getPenerimaanPkl}
        />
        <div className="row">
          <div className="col-12">
            <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss p-0 pb-5">
              <div className="card-header card-header-ss p-4">
                <div className="row">
                  <div className="col-lg-4 col-12 d-flex align-items-center">
                    <h1 className="fw-extrabold fs-4 color-dark mb-0">
                      Daftar Penerimaan
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
                      <button
                        type="button"
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold col-12"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTambahPenerimaanSiswaPkl"
                      >
                        <FaPlus /> Tambah
                      </button>
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
                          {penerimaan?.meta?.siswaCount || 0} Siswa
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {siswa != 0 ? (
                <div className="card-body p-0">
                  <div className="" data-joyride="table-rombel">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th style={{ width: "35%" }}>Nama</th>
                          <th className="text-md-center">Tanggal Mulai</th>
                          <th className="text-md-center">Tanggal Selesai</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {siswa?.map((d, idx) => {
                          return (
                            <tr>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama">{d?.user?.nama}</td>
                              <td data-th="Mulai" className="text-md-center">
                                {momentPackage(d?.tanggalMulai).format(
                                  "DD MMMM YYYY"
                                )}
                              </td>
                              <td data-th="Selesai" className="text-md-center">
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
                                    onClick={() => setEditData(d)}
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
                                    data-joyride="delete-mapel"
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
                  {/* // )} */}
                </div>
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
      </AnimatePage>
    </LayoutDetailPenerimaanPerusahaan>
  );
};

export async function getServerSideProps({ params: { penerimaan_id } }) {
  return {
    props: {
      penerimaan_id: penerimaan_id || null,
    },
  };
}

export default index;
