import moment from "moment";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteProyek,
  editProyek,
  getProyek,
  postProyek,
  putAnggotaProyek,
} from "../../../client/ProyekClient";
import CardProyekKolaborasi from "../../../components/Kolaborasi/CardProyekKolaborasi";
import Layout from "../../../components/Layout/Layout";
import ModalFormProyek from "../../../components/Proyek/ModalFormProyek";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import { db } from "../../../config/config";
import useUser from "../../../hooks/useUser";
import { hideModal } from "../../../utilities/ModalUtils";

const kolaborasiRef = db.collection("kolaborasi");

const index = ({ subnav }) => {
  const { user } = useUser();
  const initialStateForm = {
    nama: "",
    privasi: "",
    deskripsi: "",
    banner: "",
    mStatusProyekId: "",
    btnLoading: "idle",
  };

  const [proyekData, setProyekData] = useState({});
  const [proyek, setProyek] = useState([]);
  const [undangan, setUndangan] = useState([]);

  const postNewLog = (data) => {
    kolaborasiRef.doc(`${data.proyekId}`).collection("logs").doc().set({
      message: data.message,
      by: user.nama,
      tanggal: moment().toDate(),
    });
  };

  const handleClickUndangan = async (d) => {
    const { data } = await putAnggotaProyek(d.anggotaId, { status: d.status });

    if (data) {
      const message =
        d.status === "menerima"
          ? `${user.nama} menerima undangan`
          : `${user.nama} menolak undangan`;
      postNewLog({ proyekId: d.proyekId, message: message });
      toast.success(data?.message);
      _getProyek();
    }
  };
  const [formData, setFormData] = useState(initialStateForm);

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

  const _postProyek = async () => {
    setFormData({ ...formData, btnLoading: "loading" });
    const { data } = await postProyek(formData);

    if (data) {
      kolaborasiRef
        .doc(`${data?.proyek?.id}`)
        .set({ ...data?.proyek, anggota: [user.id] });
      data?.kategori?.map((d) => {
        kolaborasiRef
          .doc(`${data?.proyek?.id}`)
          .collection("kategori")
          .doc(`${d.id}`)
          .set({ ...d, pekerjaan: [] });
      });
      kolaborasiRef
        .doc(`${data?.proyek?.id}`)
        .collection("roles")
        .doc("Anggota")
        .set({
          Edit_Proyek: 0,
          Delete_Proyek: 0,
          Undang_Anggota: 0,
          Kick_Anggota: 0,
          Buat_Postingan: 1,
          Edit_Postingan: 1,
          Delete_Postingan: 1,
          Buat_Kategori: 0,
          Edit_Kategori: 0,
          Delete_Kategori: 0,
          Buat_Pekerjaan: 1,
          Edit_Pekerjaan: 1,
          Delete_Pekerjaan: 1,
        });
      kolaborasiRef
        .doc(`${data?.proyek?.id}`)
        .collection("roles")
        .doc("Pemilik")
        .set({ pemilik: 1 });
      postNewLog({
        proyekId: data?.proyek?.id,
        message: `${user.nama} membuat proyek ${data?.proyek.nama}`,
      });
      toast.success(data?.message);
      hideModal("modalBuatProyek");
      setFormData({ ...formData, btnLoading: "success" });
      setFormData(initialStateForm);
      _getProyek();
    } else {
      toast.error(data?.message);
      setFormData({ ...formData, btnLoading: "error" });
    }
  };

  const _editProyek = async () => {
    setFormData({ ...formData, btnLoading: "loading" });
    const { data } = await editProyek(formData?.id, formData);
    kolaborasiRef.doc(`${formData.id}`).update({
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      banner: formData.banner,
      privasi: formData.privasi,
    });

    if (data) {
      postNewLog({
        proyekId: formData.id,
        message: `${user.nama} mengedit detail proyek`,
      });
      toast.success(data?.message);
      hideModal("modalBuatProyek");
      setFormData({ ...formData, btnLoading: "success" });
      setFormData(initialStateForm);
      _getProyek();
    } else {
      toast.error(data?.message);
      setFormData({ ...formData, btnLoading: "error" });
    }
  };

  const _deleteProyek = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteProyek(id);
        if (data) {
          postNewLog({
            proyekId: id,
            message: `${user.nama} menghapus proyek`,
          });
          toast.success(data?.message);
          _getProyek();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const _getProyek = async () => {
    const { data } = await getProyek();

    if (data) {
      setProyekData(data);
      setUndangan(data?.undangan);
      setProyek(data?.proyek);
    } else {
    }
  };

  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navItems = [
    {
      url: `${ssURL}/proyek-saya?subnav=daftar-proyek`,
      as: `${ssURL}/proyek-saya?subnav=daftar-proyek`,
      text: "Daftar Proyek",
      active: subnav == "daftar-proyek" || subnav == undefined,
    },
    {
      url: `${ssURL}/proyek-saya?subnav=daftar-undangan`,
      as: `${ssURL}/proyek-saya?subnav=daftar-undangan`,
      text: "Daftar Undangan",
      active: subnav == "daftar-undangan",
    },
  ];

  const handleClickEdit = (data) => {
    setFormData({ ...formData, ...data });
  };

  const handleClickAdd = () => {
    setFormData(initialStateForm);
  };

  const SubNavbarProyekSaya = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <button
                className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modalBuatProyek"
                onClick={() => handleClickAdd()}
                data-joyride="btn-buat-jadwal"
              >
                <FaPlus className="me-2" />
                Buat Proyek
              </button>
            ),
          },
        ]}
      />
    </>
  );

  useEffect(() => {
    _getProyek();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
              <li className="nav-item">
                <Link href={`${ssURL}/proyek-saya`}>
                  <a
                    className={`nav-link ${
                      activeMenu == `${ssURL}/proyek-saya` && "active"
                    } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                    aria-current="page"
                  >
                    <img
                      src={`/img/icon-proyek-saya.svg`}
                      alt=""
                      className="me-2"
                    />
                    Proyek Saya
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`${ssURL}/proyek`}>
                  <a
                    className={`nav-link ${
                      activeMenu == `${ssURL}/proyek` && "active"
                    } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                    aria-current="page"
                  >
                    <img
                      src={`/img/icon-cari-proyek.svg`}
                      alt=""
                      className="me-2"
                    />
                    Cari Proyek
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`${ssURL}/partner`}>
                  <a
                    className={`nav-link ${
                      activeMenu == `${ssURL}/partner` && "active"
                    } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                    aria-current="page"
                  >
                    <img
                      src={`/img/icon-cari-partner.svg`}
                      alt=""
                      className="me-2"
                    />
                    Cari Partner
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-9">
            <div className="row">
              <div className="col-md-12">
                <SubNavbarProyekSaya />
              </div>
            </div>
            <div className="row gy-4">
              {(subnav == "daftar-proyek" || !subnav) && (
                <>
                  {proyek?.data?.map((d, idx) => {
                    return (
                      <div
                        className="col-md-4"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <CardProyekKolaborasi
                          handleClickEdit={handleClickEdit}
                          data={d}
                          status="perencanaan-produk"
                          isPrivat={d?.privasi}
                          _deleteProyek={_deleteProyek}
                        />
                      </div>
                    );
                  })}
                </>
              )}
              {subnav == "daftar-undangan" && (
                <>
                  {undangan?.map((d) => {
                    return (
                      <div className="col-md-4">
                        <CardProyekKolaborasi
                          data={{ ...d.proyek, anggotaId: d.id }}
                          isUndangan
                          status="perencanaan-produk"
                          handleSubmit={handleClickUndangan}
                        />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
        <ModalFormProyek
          setFormData={setFormData}
          handleChangeForm={handleChangeForm}
          formData={formData}
          _postProyek={_postProyek}
          _editProyek={_editProyek}
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
