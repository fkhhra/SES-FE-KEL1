import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { deleteAlurPPDB, getAlurPPDB } from "../../../client/AlurPPDB";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import ModalFormAlurPPDB from "../../../components/PPDB/ModalFormAlurPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import SideNavPPDB from "components/PPDB/SideNavPPDB";
import useSekolah from "hooks/useSekolah";

const AlurPPDBPage = () => {
  const { ta } = useTa();
  const initialFormData = {
    judul: "",
    deskripsi: "",
    buttonState: "idle",
  };
  const { sekolah } = useSekolah();

  const [editData, setEditData] = useState(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [collapseOpen, setcollapseOpen] = useState({});

  const [activeMenu, setActiveMenu] = useState(`/`);
  const handleClickEdit = (data) => {
    setEditData(data);
    window.$(`#editorDeskripsi`).summernote("code", data?.deskripsi);
    setIsEdit(true);
  };

  const handleClickTambah = () => {
    setEditData(initialFormData);
    setIsEdit(false);
  };

  const [AlurPPDB, setAlurPPDB] = useState({});
  const { alur } = AlurPPDB;

  const _getAlurPPDB = async () => {
    setLoading(true);
    const { data } = await getAlurPPDB();
    if (data) {
      setAlurPPDB(data);
    }
    setLoading(false);
  };

  const _deleteAlurPPDB = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteAlurPPDB(id);
        if (data) {
          toast.success(data.message);
          _getAlurPPDB();
        }
      }
    });
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getAlurPPDB();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          {/* <div className="col-lg-3 positon-relative">
            <SideNavPPDB ssURL={ssURL} />
          </div> */}

          <div className="col-lg-12">
            <h3 className="color-dark fw-extrabold title-page position-relative mb-5">
              Alur {sekolah?.tingkat == "kampus" ? "Pendaftaran Mahasiswa" : "PPDB"}
            </h3>
            {ta ? (
              <>
                {alur?.length > 0 &&
                  alur?.map((data, idx) => {
                    return (
                      <div className="col-md-12 mb-4">
                        <div className="card card-ss card-biaya-pendaftaran p-0">
                          <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                            <h4 className="fw-bold color-dark mb-0 mt-1">
                              {idx + 1}. {data?.judul}
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
                                data-bs-target="#ModalFormAlurPPDB"
                                onClick={() => handleClickEdit(data)}
                              >
                                <FaPen className="color-secondary" />
                              </button>
                              <button
                                className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => _deleteAlurPPDB(data?.id)}
                              >
                                <FaTrashAlt className="color-secondary" />
                              </button>
                              <a
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseExample${data?.id}`}
                                role="button"
                                aria-expanded="false"
                                aria-controls={`collapseExample${data?.id}`}
                                className={`btn-collapse ${
                                  collapseOpen[data?.id] ? "active" : ""
                                }`}
                                onClick={() =>
                                  setcollapseOpen({
                                    ...collapseOpen,
                                    [data?.id]: !collapseOpen[data?.id],
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

                          <div
                            class="collapse"
                            id={`collapseExample${data?.id}`}
                          >
                            <hr className="mb-4 mt-0" />
                            <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: data?.deskripsi,
                                }}
                                className="color-dark fw-semibold fs-16-ss"
                              ></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {alur?.length == 0 && (
                  <div className="row justify-content-center mb-4">
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
                      <p className="fw-bold">
                        Klik tombol{" "}
                        <a
                          role="button"
                          id="dropdownMenuLink"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalFormAlurPPDB"
                          onClick={() => handleClickTambah()}
                          aria-expanded="false"
                          className="color-primary"
                        >
                          Tambah
                        </a>{" "}
                        di bawah untuk menambahkan Alur PPDB.
                      </p>
                    </div>
                  </div>
                )}
                <button
                  className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4 w-100"
                  style={{ minHeight: "84px" }}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="modal"
                  data-bs-target="#ModalFormAlurPPDB"
                  onClick={() => handleClickTambah()}
                  aria-expanded="false"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
              </>
            ) : (
              <div className="p-4">
                <div className="alert alert-danger">
                  Anda belum mengaktifkan tahun akademik. Klik{" "}
                  <Link href={`${ssURL}/tahun-akademik`}>disini</Link> untuk
                  memilih tahun akademik yang aktif
                </div>
              </div>
            )}
          </div>
        </div>
        <ModalFormAlurPPDB
          _getAlurPPDB={_getAlurPPDB}
          editData={editData}
          isEdit={isEdit}
        />
      </AnimatePage>
    </Layout>
  );
};

export default AlurPPDBPage;
