import { deleteInformasiJalur } from "client/InformasiJalurPpdb";
import { detailJalurPpdb } from "client/JalurPpdbClient";
import JalurPendaftaranLayout from "components/PPDB/JalurPendaftaranLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { currencyFormatter } from "utilities/HelperUtils";
import { ssURL } from "../../../../../client/clientAxios";
import { detailGelombangPPDB } from "../../../../../client/GelombangPPDB";
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

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

  const _detailJalurPpdb = async () => {
    const { data } = await detailJalurPpdb(id);
    if (data) {
      setJalurPpdb(data);
    }
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
        const { data } = await deleteInformasiJalur(id);
        if (data) {
          toast.success(data.message);
          _detailJalurPpdb();
        }
      }
    });
  };

  const handleClickEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
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
            <div className="col-lg-12 ">
              {/* {pendaftar?.length &&
              pendaftar?.map((data, idx) => {
                return ( */}
              {jalur?.informasi?.map((d) => {
                return (
                  <div className="col-md-12 mb-4">
                    <div className="card card-ss card-biaya-pendaftaran p-0">
                      <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                        <h4 className="fw-bold color-dark mb-0">
                          {/* {idx + 1}. {data?.judul} */}
                          {d?.nama}
                        </h4>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            data-bs-toggle="modal"
                            data-bs-target={
                              d?.tipe == "keterangan"
                                ? "#ModalKeterangan"
                                : "#modalTambahBiaya"
                            }
                            onClick={() => handleClickEdit(d)}
                          >
                            <FaPen className="color-secondary" />
                          </button>
                          <button
                            className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => handleDeleteInformasi(d?.id)}
                          >
                            <FaTrashAlt className="color-secondary" />
                          </button>
                          <a
                            data-bs-toggle="collapse"
                            href={`#collapseExample${d?.id}`}
                            role="button"
                            aria-expanded="false"
                            aria-controls={`collapseExample${d?.id}`}
                            className={`btn-collapse ${
                              collapseOpen[d?.id] ? "active" : ""
                            }`}
                            onClick={() =>
                              setcollapseOpen({
                                ...collapseOpen,
                                [d?.id]: !collapseOpen[d?.id],
                              })
                            }
                          >
                            <span
                              class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <img
                                className="dropdown"
                                src="/img/arrow-bottom.svg"
                                alt=""
                              />
                            </span>
                          </a>
                        </div>
                      </div>

                      <div class="collapse" id={`collapseExample${d?.id}`}>
                        <hr className="mb-4 mt-0" />
                        {d?.tipe == "keterangan" ? (
                          <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: d?.deskripsi,
                              }}
                              className="color-dark fw-semibold fs-16-ss"
                            ></p>
                          </div>
                        ) : (
                          <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                            <table className="table-ss">
                              <thead>
                                <tr>
                                  <th>Nama</th>
                                  <th style={{ width: "30%" }}>Jumlah</th>
                                </tr>
                              </thead>
                              <tbody>
                                {d?.biaya
                                  ? JSON.parse(d?.biaya).map((e) => {
                                      return (
                                        <tr>
                                          <td className="py-1 border-end-0">
                                            {e?.nama}
                                          </td>
                                          <td className="py-1 border-start-0 border-end-0">
                                            <span
                                              className={`color-dark fw-bold`}
                                            >
                                              {currencyFormatter(e.biaya)}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  : null}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* );
              })} */}
              <div className="dropdown dropdown-ss d-flex flex-column">
                <button
                  className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4"
                  style={{ minHeight: "84px" }}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1 w-100"
                  aria-labelledby="dropdownMenuLink"
                >
                  {/* <li>
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalUjianPenerimaan"
                    >
                      <img
                        src="/img/icon-ujian-penerimaan-ppdb.svg"
                        alt="icon-kegiatan"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">
                        Ujian Penerimaan
                      </span>
                    </a>
                  </li> */}
                  <li>
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalKeterangan"
                      onClick={() => (setEditData(null), setIsEdit(false))}
                    >
                      <img
                        src="/img/icon-keterangan-ppdb.svg"
                        alt="icon-keterangan-ppdb"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">Keterangan</span>
                    </a>
                  </li>
                  <li
                  //  onClick={() => setInitialFormData()}
                  >
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahBiaya"
                      onClick={() => (setEditData(null), setIsEdit(false))}
                    >
                      <img
                        src="/img/icon-biaya-tambahan-ppdb.svg"
                        alt="icon-biaya-tambahan"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">
                        Biaya Tambahan
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </JalurPendaftaranLayout>

        <ModalUjianPenerimaan
        // _getAlurPPDB={_getAlurPPDB}
        // editData={editData}
        // isEdit={isEdit}
        />
        <ModalTambahBiaya
          _detailJalurPpdb={_detailJalurPpdb}
          editData={editData}
          m_jalur_ppdb_id={id}
          isEdit={isEdit}
        />
        <ModalKeterangan
          editData={editData}
          _detailJalurPpdb={_detailJalurPpdb}
          m_jalur_ppdb_id={id}
          isEdit={isEdit}
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
