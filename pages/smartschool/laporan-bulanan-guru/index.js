import ModalTambahCP from "components/RPP/ModalTambahCP";
import ModalTambahLaporanGuru from "components/RPP/ModalTambahLaporanBulananGuru";
import SideBarRpp from "components/RPP/SideBarRpp";
import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFile, FaPen, FaPlus, FaPrint, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { momentPackage } from "utilities/HelperUtils";
import { ssURL } from "../../../client/clientAxios";
import { deleteRpp, editRpp, getRpp, postRpp } from "../../../client/RppClient";
import Layout from "../../../components/Layout/Layout";
import CardRPP from "../../../components/RPP/CardRPP";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useTa from "../../../hooks/useTa";
import useUser from "../../../hooks/useUser";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import { hideModal } from "../../../utilities/ModalUtils";
import SidebarBukuKerjaGuru from "components/BukuKerjaGuru/SidebarBukuKerjaGuru";

const index = ({ subnav }) => {
  const { ta } = useTa();
  const { user } = useUser();
  const initialFormData = {
    judul: "",
    moda: "",
    deskripsi: "",
    lampiran: "",
    tingkat: "",
    mMataPelajaranId: "",
    buttonState: "idle",
    tipe: "lbg",
  };

  const [isEdit, setIsEdit] = useState(false);

  const [rppData, setRppData] = useState({});
  const { rpp, mataPelajaran, tingkat } = rppData;

  const [formData, setFormData] = useState(initialFormData);
  const handleClickEdit = (data) => {
    setFormData(data);
    setIsEdit(true);
  };

  const handleClickTambah = () => {
    setFormData(initialFormData);
    setIsEdit(false);
  };

  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _postSilabus = async () => {
    if (!formData.judul) {
      toast.error("Isi Judul Laporan Bulanan");
      return;
    }
    if (!formData.lampiran) {
      toast.error("Lampirkan file Laporan Bulanan");
      return;
    }
    // if (!formData.mMataPelajaranId) {
    //   toast.error("Pilih Mata Pelajaran Capaian Pembelajaran");
    //   return;
    // }
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await postRpp({ ...formData, tipe: "lbg" });

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahLaporanBulananGuru");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getSilabus();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _editSilabus = async () => {
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await editRpp(formData.id, formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahLaporanBulananGuru");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getSilabus();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _getSilabus = async () => {
    const { data } = await getRpp({ tipe: "lbg" });

    if (data) {
      setRppData(data);
    } else {
    }
  };

  const _deleteSilabus = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteRpp(id);
        if (data) {
          toast.success(data.message);
          _getSilabus();
        }
      }
    });
  };

  useEffect(() => {
    _getSilabus();
  }, []);

  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navItems = [
    {
      url: `${ssURL}/rpp-saya?subnav=daftar-proyek`,
      as: `${ssURL}/rpp-saya?subnav=daftar-proyek`,
      text: "Daftar Proyek",
      active: subnav == "daftar-proyek" || subnav == undefined,
    },
    {
      url: `${ssURL}/rpp-saya?subnav=daftar-undangan`,
      as: `${ssURL}/rpp-saya?subnav=daftar-undangan`,
      text: "Daftar Undangan",
      active: subnav == "daftar-undangan",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SidebarBukuKerjaGuru activeMenu={activeMenu} />
          </div>
          <div className="col-lg-9">
            <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss w-100 d-flex flex-md-row flex-column p-0 pb-5 ">
              <div className="col-md-12 ">
                <div className="card-header py-4 px-0 card-header-ss">
                  <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column mx-lg-4 mx-0">
                    <div className="d-flex justify-content-between mx-lg-0 mx-4">
                      <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                        Daftar Laporan Bulanan
                      </h4>
                      <button
                        type="button"
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold d-lg-none d-sm-block d-none"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTambahLaporanBulananGuru"
                        // onClick={() => {
                        //   setEditData(null);
                        //   setEditId(null);
                        //   setFormData({
                        //     ...formData,
                        //     tingkat: "",
                        //     mJurusanId: "",
                        //     mUserId: "",
                        //     kode: "",
                        //   });
                        // }}
                        data-joyride="btn-tambah-rombel"
                      >
                        <FaPlus /> Tambah
                      </button>
                    </div>
                    <hr className="d-lg-none d-sm-block d-none" />
                    <div className="row d-lg-none d-sm-flex d-none mx-4">
                      <div className="col-7">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100"
                          id="exampleFormControlInput1"
                          placeholder="Cari laporan"
                          autoComplete="off"
                          // value={search}
                          // onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      {/* <div className="col-5">
                      {" "}
                      <button
                        className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill w-100 h-100 fw-bold color-secondary"
                        onClick={handleClickRombel}
                        data-joyride="unduh-absen"
                      >
                        <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                        Unduh Data
                      </button>
                    </div> */}
                    </div>
                    <div className="d-lg-flex d-sm-none d-flex flex-sm-row flex-column mx-lg-0 mx-4">
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-3 mb-lg-0"
                        id="exampleFormControlInput1"
                        placeholder="Cari laporan"
                        autoComplete="off"
                        // value={search}
                        // onChange={(e) => setSearch(e.target.value)}
                      />
                      {/* <div className="d-flex flex-column flex-lg-row align-items-lg-center mb-2 mb-md-0 mr-0 mr-md-2">
                      <button
                        className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                        onClick={handleClickRombel}
                        data-joyride="unduh-absen"
                      >
                        <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                        Unduh Data
                      </button>
                    </div> */}
                      <button
                        type="button"
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold d-lg-block d-sm-none d-block"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTambahLaporanBulananGuru"
                        // onClick={() => {
                        //   setEditData(null);
                        //   setEditId(null);
                        //   setFormData({
                        //     ...formData,
                        //     tingkat: "",
                        //     mJurusanId: "",
                        //     mUserId: "",
                        //     kode: "",
                        //   });
                        // }}
                        data-joyride="btn-tambah-rombel"
                      >
                        <FaPlus /> Tambah
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="" data-joyride="table-rombel">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Tanggal</th>
                          <th>Detail</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rpp?.map((d, idx) => {
                          return (
                            <tr>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama">
                                <img
                                  src="/img/icon-file.svg"
                                  style={{ width: "40px", height: "40px" }}
                                  className="me-3"
                                />
                                {d?.judul}
                              </td>
                              <td data-th="Tanggal">
                                {momentPackage(d?.deskripsi).format(
                                  "MMMM YYYY"
                                )}
                              </td>
                              <td data-th="Detail">
                                <a
                                  href={getPreviewURL(d?.lampiran)}
                                  target="_blank"
                                  className="rounded-circle bg-soft-primary mx-md-auto color-secondary btn-link btn p-1"
                                  style={{ height: "30px", width: "30px" }}
                                >
                                  <FaFile />
                                </a>
                              </td>
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <button
                                    type="button"
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalTambahLaporanBulananGuru"
                                    onClick={() => handleClickEdit(d)}
                                    data-joyride="edit-gtk"
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => _deleteSilabus(d?.id)}
                                    data-joyride="delete-gtk"
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
            {/* <div className="row gy-4">
              {rpp?.map((d, idx) => {
                return (
                  <div className="col-md-6" key={`${idx}-${new Date().getTime()}`}>
                    <CardRPP
                      isRppSaya={d?.mUserId == user?.id}
                      jenjangData={[`${d?.sekolah?.tingkat}`]}
                      mode={d?.moda}
                      dataDb={d}
                      _deleteRpp={_deleteSilabus}
                      handleClickEdit={handleClickEdit}
                    />
                  </div>
                );
              })}
            </div> */}
          </div>
        </div>
        <ModalTambahLaporanGuru
          _editSilabus={_editSilabus}
          _postSilabus={_postSilabus}
          formData={formData}
          handleChangeForm={handleChangeForm}
          handleChangeSelect={handleChangeSelect}
          tingkat={tingkat}
          mataPelajaran={mataPelajaran}
          isEdit={isEdit}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav } }) {
  return {
    props: {
      subnav: subnav || null,
    },
  };
}

export default index;
