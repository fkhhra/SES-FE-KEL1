import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaDownload,
  FaInfo,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { baseURL, downloadURL, ssURL } from "../../../client/clientAxios";
import {
  deleteGelombangPPDB,
  downloadGelombangPPDB,
  getGelombangPPDB,
} from "../../../client/GelombangPPDB";
import Layout from "../../../components/Layout/Layout";
import ModalFormGelombangPPDB from "../../../components/PPDB/ModalFormGelombangPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import {
  currencyFormatter,
  momentPackage,
} from "../../../utilities/HelperUtils";
import SideNavPPDB from "components/PPDB/SideNavPPDB";
import usePPDB from "hooks/usePPDB";

const GelombangPPDBPage = () => {
  const { ta } = useTa();
  const { setTerdaftar } = usePPDB();

  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage().add(7, "days"),
    tesAkademik: 0,
    buttonState: "idle",
  };

  const [editData, setEditData] = useState(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);

  const handleClickEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
  };

  const handleClickTambah = () => {
    setEditData(initialFormData);
    setIsEdit(false);
  };

  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, jumlahPeserta } = gelombangPPDB;

  const _getGelombangPPDB = async () => {
    setLoading(true);
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setTerdaftar(data);
    }
    setLoading(false);
  };

  const _deleteGelombangPPDB = async (id) => {
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
          _getGelombangPPDB();
        }
      }
    });
  };

  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const handleClickDownloadPPDB = async () => {
    const { data } = await downloadGelombangPPDB();

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavPPDB ssURL={ssURL} />
          </div>

          <div className="col-lg-9 ">
            <h3 className="color-dark fw-extrabold title-page position-relative mb-5">
              Gelombang PPDB
            </h3>
            {ta ? (
              <>
                {gelombang?.length &&
                  gelombang?.map((data, idx) => {
                    return (
                      <div className="col-md-12 mb-4">
                        <div className="card card-ss card-biaya-pendaftaran p-0 ">
                          <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                            <Link href={`${ssURL}/gelombang-ppdb/${data?.id}`}>
                              <div className="pointer">
                                <h4 className="fw-bold color-dark mb-0 mt-1">
                                  {data?.nama}
                                </h4>
                                <p className="fs-14-ss mb-0">
                                  {momentPackage(data?.dibuka).format(
                                    "DD MMMM YYYY"
                                  )}{" "}
                                  -{" "}
                                  {momentPackage(data?.ditutup).format(
                                    "DD MMMM YYYY"
                                  )}
                                </p>
                              </div>
                            </Link>
                            <div className="d-flex">
                              <button
                                type="button"
                                className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                data-bs-toggle="modal"
                                data-bs-target="#ModalFormGelombangPPDB"
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
                                onClick={() => _deleteGelombangPPDB(data?.id)}
                              >
                                <FaTrashAlt className="color-secondary" />
                              </button>
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
                <button
                  className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4 w-100"
                  style={{ minHeight: "84px" }}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="modal"
                  data-bs-target="#ModalFormGelombangPPDB"
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
        <ModalFormGelombangPPDB
          _getGelombangPPDB={_getGelombangPPDB}
          editData={editData}
          isEdit={isEdit}
        />
      </AnimatePage>
    </Layout>
  );
};

export default GelombangPPDBPage;
