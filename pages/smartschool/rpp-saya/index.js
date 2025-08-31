import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import { FaClone, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { getMateri } from "../../../client/MateriClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../client/clientAxios";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { hideModal } from "../../../utilities/ModalUtils";
import React from "react";
import CardRPP from "../../../components/RPP/CardRPP";
import ModalTambahRPP from "../../../components/RPP/ModalTambahRPP";
import { deleteRpp, editRpp, getRpp, postRpp } from "../../../client/RppClient";
import useTa from "../../../hooks/useTa";
import useUser from "../../../hooks/useUser";
import SideBarRpp from "components/RPP/SideBarRpp";

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

  const _postRpp = async () => {
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await postRpp(formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahRPP");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getRpp();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _editRpp = async () => {
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await editRpp(formData.id, formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahRPP");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getRpp();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _getRpp = async () => {
    const { data } = await getRpp();

    if (data) {
      setRppData(data);
    } else {
    }
  };

  const _deleteRpp = async (id) => {
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
          _getRpp();
        }
      }
    });
  };

  useEffect(() => {
    _getRpp();
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
            <SideBarRpp activeMenu={activeMenu} />
          </div>
          <div className="col-lg-9">
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="card card-ss d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
                  <h4 className="fw-extrabold color-dark d-flex justify-content-center justify-content-md-start ms-3 mb-0 mt-lg-0 mt-3">
                    Daftar RPP
                  </h4>
                  <div className="my-3 my-lg-0 px-3 px-lg-0 me-lg-3 d-flex flex-column flex-lg-row align-items-lg-center">
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                      <div className="flex-grow-1 me-lg-3 mb-3 mb-lg-0">
                        <input
                          type="text"
                          className="form-control form-search form-search-mutasi form-search-tunggakan rounded-pill fw-semibold border-secondary-ss w-100"
                          style={{ height: "42px", width: "100%" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari..."
                        />
                      </div>
                    </div>
                    <button
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold my-lg-3 my-0"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahRPP"
                      onClick={handleClickTambah}
                      data-joyride="btn-buat-pertemuan"
                    >
                      <FaPlus className="me-2" />
                      Buat RPP
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row gy-4">
              {rpp?.map((d, idx) => {
                return (
                  <div
                    className="col-md-6"
                    key={`${idx}-${new Date().getTime()}`}
                  >
                    <CardRPP
                      isRppSaya={d?.mUserId == user?.id}
                      jenjangData={[`${d?.sekolah?.tingkat}`]}
                      mode={d?.moda}
                      dataDb={d}
                      _deleteRpp={_deleteRpp}
                      handleClickEdit={handleClickEdit}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ModalTambahRPP
          _editRpp={_editRpp}
          _postRpp={_postRpp}
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
