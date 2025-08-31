import { getJalurPpdb } from "client/JalurPpdbClient";
import SideNavPPDB from "components/PPDB/SideNavPPDB";
import useSekolah from "hooks/useSekolah";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import swal from "sweetalert";
import { downloadURL, ssURL } from "../../../client/clientAxios";
import {
  deleteGelombangPPDB,
  downloadGelombangPPDB,
  getGelombangPPDB,
} from "../../../client/GelombangPPDB";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import { momentPackage } from "../../../utilities/HelperUtils";

const GelombangPPDBPage = () => {
  const { ta } = useTa();
  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage().add(7, "days"),
    tesAkademik: 0,
    buttonState: "idle",
  };
  const { sekolah } = useSekolah();

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

  const [jalurData, setJalurData] = useState({});
  const { jalur } = jalurData;

  const _getJalurPPDB = async () => {
    setLoading(true);
    const { data } = await getJalurPpdb();
    if (data) {
      setJalurData(data);
    }
    setLoading(false);
  };

  const _deleteGelombangPPDB = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Kontak CS Smartschool jika sengaja terhapus",
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
    _getJalurPPDB();
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
          {/* <div className="col-lg-3 positon-relative">
            <SideNavPPDB ssURL={ssURL} />
          </div> */}

          <div className="col-lg-12">
            <h3 className="color-dark fw-extrabold title-page position-relative mb-5">
              Pendaftar{" "}
              {sekolah?.tingkat == "kampus" ? "Pendaftaran Mahasiswa" : "PPDB"}
            </h3>
            {ta ? (
              <>
                {!jalur?.length
                  ? null
                  : jalur?.map((data, idx) => {
                      console.log(data);
                      return (
                        <>
                          <div className="w-100 position-relative mb-4">
                            <hr
                              className="m-0 w-100 position-absolute"
                              style={{
                                top: "50%",
                                left: "0",
                                transform: "tranlateY(-50%)",
                                height: "1px",
                              }}
                            />
                            <span
                              className="position-relative fs-18-ss color-dark fw-black bg-main pe-3 py-1"
                              style={{ zIndex: "2" }}
                            >
                              {sekolah?.id == 14 ||
                              sekolah?.id == 13 ||
                              sekolah?.id == 121
                                ? `${data?.tipe} Formulir`
                                : "Jalur Seleksi Reguler"}
                            </span>
                          </div>
                          <div className="row g-4 mb-5">
                            {!data?.gelombang?.length
                              ? null
                              : data?.gelombang?.map((d, idx) => {
                                  return (
                                    <div className="col-lg-4 col-md-6 pointer">
                                      <Link
                                        href={`${ssURL}/pendaftar-ppdb/${d?.id}`}
                                      >
                                        <a>
                                          <div className="card card-ss card-biaya-pendaftaran p-3">
                                            <h5 className="fw-extrabold color-dark mb-2">
                                              {d?.nama}
                                            </h5>
                                            <div className="d-flex align-items-center">
                                              <img
                                                src="/img/icon-pendaftar-jalur-pendaftaran.svg"
                                                alt="icon-pendaftar"
                                                className="me-2"
                                              />
                                              <p className="fs-14-ss fw-semibold mb-0 color-primary">
                                                {d?.meta?.jumlahPendaftar}{" "}
                                                Pendaftar
                                              </p>
                                            </div>
                                          </div>
                                        </a>
                                      </Link>
                                    </div>
                                  );
                                })}
                          </div>
                        </>
                      );
                    })}
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
      </AnimatePage>
    </Layout>
  );
};

export default GelombangPPDBPage;
