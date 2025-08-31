import { deleteInformasiGelombang } from "client/InformasiGelombang";
import { detailJalurPpdb } from "client/JalurPpdbClient";
import JalurPendaftaranLayout from "components/PPDB/JalurPendaftaranLayout";
import ListGelombang from "components/PPDB/ListGelombang";
import ModalGelombangPPDB from "components/PPDB/ModalGelombangPPDB";
import ModalKegiatanPPDB from "components/PPDB/ModalKegiatanPPDB";
import ModalPengumumanPPDB from "components/PPDB/ModalPengumumanPPDB";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import swal from "sweetalert";
import { ssURL } from "../../../../../client/clientAxios";
import { deleteGelombangPPDB } from "../../../../../client/GelombangPPDB";
import Layout from "../../../../../components/Layout/Layout";
import ModalKeterangan from "../../../../../components/PPDB/ModalKeterangan";
import ModalTambahBiaya from "../../../../../components/PPDB/ModalTambahBiaya";
import ModalUjianPenerimaan from "../../../../../components/PPDB/ModalUjianPenerimaan";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ id }) => {
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [gelombangId, setGelombangId] = useState(0);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

  const _detailJalurPpdb = async () => {
    const { data } = await detailJalurPpdb(id);
    if (data) {
      setJalurPpdb(data);
    }
  };

  const handleDeleteGelombang = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteGelombangPPDB(id);
        if (data) {
          toast.success(data.message);
          _detailJalurPpdb();
        }
      }
    });
  };

  const handleDeleteInformasi = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteInformasiGelombang(id);
        if (data) {
          toast.success(data.message);
          _detailJalurPpdb();
        }
      }
    });
  };

  const handleClickEdit = (data) => {
    setEditData(data);
    if (data) {
      setIsEdit(true);
    } else {
      setIsEdit(false);
    }
  };

  // useEffect(() => {
  //   _detailJalurPpdb();
  // }, []);

  useEffect(() => {
    _detailJalurPpdb();
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <Layout>
      <AnimatePage>
        <JalurPendaftaranLayout ssURL={ssURL} id={id} jalur={jalur}>
          <div className="row gy-4">
            <div className="col-md-12">
              {/* <div className="d-flex align-items-md-start align-items-stretch justify-content-start flex-md-row flex-column mb-4"> */}
              <div className=" d-flex flex-column flex-md-row justify-content-between align-items-md-center bg-white rounded-ss shadow-dark-ss">
                <h4
                  className={
                    "fw-extrabold color-dark d-flex justify-content-md-center justify-content-md-start ms-3 mb-0 mt-md-0 mt-3"
                  }
                >
                  Daftar Gelombang
                </h4>
                <div className="my-3 my-lg-0 px-3 px-lg-0 me-lg-3 d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold my-lg-3 my-0"
                    data-bs-toggle="modal"
                    data-bs-target="#modalGelombangPPDB"
                    onClick={() => {
                      setIsEdit(false);
                      setEditData(null);
                    }}
                    // data-joyride="btn-buat-ujian"
                    // disabled={jadwalMengajar?.absen ? false : true}
                  >
                    <FaPlus className="me-2" />
                    Tambah Gelombang
                  </button>
                </div>
              </div>
            </div>
            {/* {pendaftar?.length &&
              pendaftar?.map((data, idx) => {
                return ( */}
            {jalur?.gelombang?.map((d) => {
              return (
                <ListGelombang
                  d={d}
                  handleDeleteGelombang={handleDeleteGelombang}
                  setcollapseOpen={setcollapseOpen}
                  collapseOpen={collapseOpen}
                  handleClickEdit={handleClickEdit}
                  setGelombangId={setGelombangId}
                  handleDeleteInformasi={handleDeleteInformasi}
                />
              );
            })}
            {/* );
              })} */}
          </div>
        </JalurPendaftaranLayout>

        <ModalUjianPenerimaan
          m_gelombang_ppdb_id={gelombangId}
          _detailJalurPpdb={_detailJalurPpdb}
          editData={editData}
          isEdit={isEdit}
          jalur={jalur}
        />
        <ModalTambahBiaya />
        <ModalKeterangan />
        <ModalGelombangPPDB
          _detailJalurPpdb={_detailJalurPpdb}
          editData={editData}
          m_jalur_ppdb_id={id}
          isEdit={isEdit}
          jalur={jalur}
        />
        <ModalPengumumanPPDB
          m_gelombang_ppdb_id={gelombangId}
          _detailJalurPpdb={_detailJalurPpdb}
          editData={editData}
          isEdit={isEdit}
          jalur={jalur}
        />
        <ModalKegiatanPPDB
          m_gelombang_ppdb_id={gelombangId}
          _detailJalurPpdb={_detailJalurPpdb}
          editData={editData}
          isEdit={isEdit}
          jalur={jalur}
        />

        {/* <div className="card card-ss my-4">
          <nav className="d-flex justify-content-between align-items-center p-4">
            <h5 className="fw-bold">Pendaftar</h5>
          </nav>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>No Telp</th>
                    <th>Tanggal Mendaftar</th>
                    <th>Status</th>
                    <th>Cek Berkas</th>
                    <th>Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendaftar?.map((data, idx) => {
                    return (
                      <tr key={`${idx}-${new Date().getTime()}`}>
                        <td data-th="Nama">{data.user?.nama}</td>
                        <td data-th="No Telp">{data.user?.whatsapp}</td>
                        <td data-th="Tanggal Mendaftar">
                          {getTimeFromNow(data.createdAt)}
                        </td>
                        <td data-th="Status">
                          {statusKonfirmasi(gelombang?.biayaPendaftaran, data)}
                        </td>
                        <td data-th="Berkas">
                          <Link href={`${ssURL}/pendaftar-ppdb/${data?.id}`}>
                            <button className="btn btn-primary rounded-circle">
                              <FaFileDownload />
                            </button>
                          </Link>
                        </td>
                        <td className="actions">
                          <button
                            className={`btn btn-${
                              data.diverifikasi ? "success" : "danger"
                            } rounded-circle`}
                          >
                            {data.diverifikasi ? <FaCheck /> : <FaTimes />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
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
