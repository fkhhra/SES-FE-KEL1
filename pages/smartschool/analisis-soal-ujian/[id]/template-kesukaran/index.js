import {
  deleteTemplateKesukaran,
  getAnalisisSoalDetail,
} from "client/AnalisisSoalClient";
import { ssURL } from "client/clientAxios";
import { getNeraca } from "client/NeracaClient";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import HeaderAnalisisSoal from "components/Ujian/HeaderAnalisisSoal";
import ModalTemplateKesukaran from "components/Ujian/ModalTemplateKesukaran";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import {
  hitungKategoriNeraca,
  neracaHitungLevelAkun,
} from "utilities/KeuanganUtils";

const index = ({ id }) => {
  const [analisisData, setAnalisisData] = useState([]);

  const {
    dataSoal,
    bentukSoal,
    jumlahSoalPg,
    jumlahSoalEsai,
    jumlahSoalPgKompleks,
    jumlahSoalUraian,
    jumlahSoalMenjodohkan,
    jumlahBankSoal,
    template,
    materi,
  } = analisisData;

  const _getAnalisisData = async () => {
    const { data } = await getAnalisisSoalDetail(id);

    if (data) {
      setAnalisisData(data);
      // console.log(kategori);
    }
  };

  const [editData, setEditData] = useState(null);
  useEffect(() => {
    _getAnalisisData();
  }, [id]);
  const handleClickEdit = (editData) => {
    setEditData(editData);
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
        const { data, error } = await deleteTemplateKesukaran(deleteId);
        if (data) {
          toast.success(data?.message);
          _getAnalisisData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };
  //   useEffect(() => {
  //     router.push({
  //       pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
  //       query: {
  //         ...router.query,
  //         search: debounceSearch,
  //       },
  //     });
  //   }, [debounceSearch]);

  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [tipe, setTipe] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

  const listDropdownValue = [
    {
      label: "Semua Periode",
      value: "",
    },
    {
      label: "Mingguan",
      value: "mingguan",
    },
    {
      label: "Bulanan",
      value: "bulanan",
    },
    {
      label: "Tahunan",
      value: "tahunan",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <HeaderAnalisisSoal ssURL={ssURL} id={id} materi={materi} />
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss mb-4">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Daftar Template Kesukaran
                  </h4>
                  <button
                    type="button"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-bs-toggle="modal"
                    data-bs-target="#modalTemplateKesukaran"
                    // onClick={() => {
                    //   setEditId(null);
                    // }}
                    data-joyride="btn-tambah-mapel"
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
                        <th>Tingkat Kesukaran</th>
                        <th>Batas Bawah</th>
                        <th>Batas Atas</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {template?.map((data, idx) => (
                        <tr>
                          <td data-th="Tingkat Kesukaran">{data.judul}</td>
                          <td data-th="Batas Bawah">{data.batasBawah}</td>
                          <td data-th="Batas Atas">{data.batasAtas}</td>
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
                                data-bs-target="#modalTemplateKesukaran"
                                onClick={() => handleClickEdit(data)}
                              >
                                <FaPen className="color-secondary" />
                              </button>
                              <button
                                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => handleClickDelete(data?.id)}
                              >
                                <FaTrashAlt className="color-secondary" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalTemplateKesukaran
          editData={editData}
          setEditData={setEditData}
          _getAnalisisData={_getAnalisisData}
          materiId={id}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
