import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import {
  FaClone,
  FaFile,
  FaFolder,
  FaInbox,
  FaPaperPlane,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaUserFriends,
} from "react-icons/fa";
import { getMateri } from "../../../client/MateriClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../client/clientAxios";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import ReactiveButton from "reactive-button";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import { getPredikat } from "../../../client/BukuIndukClient";

import toast from "react-hot-toast";
import swal from "sweetalert";
import React from "react";
import CardBukuInduk from "../../../components/BukuInduk/CardBukuInduk";
import BukuIndukSkeleton from "../../../components/Shared/Skeleton/BukuIndukSkeleton";
import SuratMasuk from "../../../components/SuratMasuk/SuratMasuk";
import CardDisposisi from "../../../components/Disposisi/CardDisposisi";
import NavbarDisposisi from "../../../components/Shared/Navbar/NavbarDisposisi";
import { Badge } from "antd";
import { getSurel } from "../../../client/SurelClient";

const index = ({ nav }) => {
  const [surelData, setSurelData] = useState({});
  const { jumlahMasuk, surel, arsip, jumlahDraft, pin } = surelData;
  const [loading, setLoading] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const initialStateForm = {
    id: "",
    nama: "",
    btnBio: "idle",
  };

  const [formData, setFormData] = useState(initialStateForm);
  const _getKotakMasukSurel = async () => {
    setLoading(true);
    const { data } = await getSurel({
      tipe: "masuk",
    });
    if (data) {
      setSurelData(data);
    }
    setLoading(false);
  };

  const pinArsip = arsip?.filter((d) => {
    return d?.pin == 1;
  });
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [show, setShow] = React.useState(true);

  const handleEditPinArsip = async (id, pinValue) => {
    if (pinValue == 1) {
      swal({
        title: "Yakin ingin melepas tanda ?",
        text: "Folder akan hilang dari pintasan apabila tanda dilepas",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          const { data, error } = await editPinArsip(id);
          if (data) {
            _getKotakMasukSurel();
            toast.success(data?.message);
          } else {
            // error?.map((err) => toast.error(err?.message));
            setButtonState("error");
          }
        }
      });
    } else {
      if (pin?.[0]?.total >= 3) {
        swal({
          title: "Anda sudah memasang 3 tanda",
          text: "Lepas tanda lainnya jika ingin memasang tanda",
          icon: "error",
          buttons: true,
          dangerMode: true,
        });
        return;
      }
      const { data, error } = await editPinArsip(id);
      if (data) {
        _getKotakMasukSurel();
        toast.success(data?.message);
      } else {
        // error?.map((err) => toast.error(err?.message));
        setButtonState("error");
      }
    }
  };

  const handleDeleteArsip = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteArsip(id);
        if (data) {
          _getKotakMasukSurel();
          toast.success(data?.message);
        } else {
          // error?.map((err) => toast.error(err?.message));
          setButtonState("error");
        }
      }
    });
  };

  const _postArsip = async () => {
    setFormData({ ...formData, btnBio: "loading" });

    const { data, error } = formData.id
      ? await editArsip(formData.id, {
          nama: formData.nama,
        })
      : await postArsip({
          nama: formData.nama,
        });

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getKotakMasukSurel();
      hideModal("modalTambahArsip");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const onClickEdit = (data) => {
    if (data) {
      setFormData({
        id: data.id,
        nama: data.nama,
      });
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getKotakMasukSurel();
  }, []);

  const navItems = [
    {
      url: `${ssURL}/disposisi?nav=semua`,
      as: `${ssURL}/disposisi?nav=semua`,
      text: "Semua",
      active: nav == "semua" || !nav,
      // dataJoyride: "disposisi",
    },
    {
      url: `${ssURL}/disposisi?nav=belum-selesai`,
      as: `${ssURL}/disposisi?nav=belum-selesai`,
      text: "Belum Selesai",
      active: nav == "belum-selesai",
      // dataJoyride: "disposisi",
    },
    {
      url: `${ssURL}/disposisi?nav=selesai`,
      as: `${ssURL}/disposisi?nav=selesai`,
      text: "Selesai",
      active: nav == "selesai",
      // dataJoyride: "surat-masuk",
    },
  ];
  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <div className="row">
              <div className="col-md-12">
                <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 pt-4 flex-column">
                  <li className="nav-item">
                    <Link href={`${ssURL}/kotak-masuk-surel`}>
                      <a
                        className={`nav-link ${
                          activeMenu == `${ssURL}/kotak-masuk-surel` && "active"
                        } fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                        aria-current="page"
                      >
                        <div className="d-flex">
                          <div>
                            {activeMenu == `${ssURL}/kotak-masuk-surel` ? (
                              <FaInbox color="#2680EB" />
                            ) : (
                              <FaInbox color="#80849C" />
                            )}
                          </div>
                          <div
                            className={`ms-2 ${
                              activeMenu == `${ssURL}/kotak-masuk-surel`
                                ? "color-dark"
                                : "color-secondary"
                            }`}
                          >
                            Kotak Masuk
                          </div>
                        </div>

                        <Badge
                          count={jumlahMasuk?.[0]?.total}
                          className="badge-primary-ss"
                        />
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`${ssURL}/terkirim-surel`}>
                      <a
                        className={`nav-link ${
                          activeMenu == `${ssURL}/terkirim-surel` && "active"
                        } fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                        aria-current="page"
                      >
                        <div className="d-flex">
                          <div>
                            {activeMenu == `${ssURL}/terkirim-surel` ? (
                              <FaPaperPlane color="#2680EB" />
                            ) : (
                              <FaPaperPlane color="#80849C" />
                            )}
                          </div>
                          <div
                            className={`ms-2 ${
                              activeMenu == `${ssURL}/terkirim-surel`
                                ? "color-dark"
                                : "color-secondary"
                            }`}
                          >
                            Terkirim
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`${ssURL}/draft-surel`}>
                      <a
                        className={`nav-link ${
                          activeMenu == `${ssURL}/draft-surel` && "active"
                        }  fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                        aria-current="page"
                      >
                        <div className="d-flex">
                          <div>
                            {activeMenu == `${ssURL}/draft-surel` ? (
                              <FaFile color="#2680EB" />
                            ) : (
                              <FaFile color="#80849C" />
                            )}
                          </div>

                          <div
                            className={`ms-2 ${
                              activeMenu == `${ssURL}/draft-surel`
                                ? "color-dark"
                                : "color-secondary"
                            }`}
                          >
                            Draft
                          </div>
                        </div>
                        <Badge
                          count={jumlahDraft?.[0]?.total}
                          className="badge-primary-ss"
                        />
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`${ssURL}/arsip-surel`}>
                      <a
                        className={`nav-link ${
                          activeMenu == `${ssURL}/arsip-surel` && "active"
                        }  fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                        aria-current="page"
                      >
                        <div className="d-flex">
                          <div>
                            {activeMenu == `${ssURL}/arsip-surel` ? (
                              <FaFolder color="#2680EB" />
                            ) : (
                              <FaFolder color="#80849C" />
                            )}
                          </div>

                          <div
                            className={`ms-2 ${
                              activeMenu == `${ssURL}/arsip-surel`
                                ? "color-dark"
                                : "color-secondary"
                            }`}
                          >
                            Arsip
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href={`${ssURL}/disposisi-surel`}>
                      <a
                        className={`nav-link ${
                          activeMenu == `${ssURL}/disposisi-surel` && "active"
                        }  fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                        aria-current="page"
                      >
                        <div className="d-flex">
                          <div>
                            {activeMenu == `${ssURL}/disposisi-surel` ? (
                              <FaUserFriends color="#2680EB" />
                            ) : (
                              <FaUserFriends color="#80849C" />
                            )}
                          </div>

                          <div
                            className={`ms-2 ${
                              activeMenu == `${ssURL}/disposisi-surel`
                                ? "color-dark"
                                : "color-secondary"
                            }`}
                          >
                            Disposisi
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <ul
                  className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 pt-4 flex-column mt-4"
                  style={{
                    top: "425px",
                  }}
                >
                  <div className="px-3 pb-4">
                    <p className="fs-5 fw-bold m-0 color-dark">Folder Arsip</p>
                  </div>
                  {pinArsip?.map((d, idx) => {
                    return (
                      <li className="nav-item">
                        <Link href={`${ssURL}/arsip-surel/${d?.id}`}>
                          <a
                            className={`nav-link fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between`}
                            aria-current="page"
                          >
                            <div className="d-flex">
                              <div>
                                <FaFolder color="#80849C" />
                              </div>

                              <div className={`ms-2 color-secondary`}>
                                {d?.nama}
                              </div>
                            </div>
                          </a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          {loading && (
            <>
              <div className="col-lg-9">
                <div className="row gy-4">
                  <BukuIndukSkeleton count={3} />
                </div>
              </div>
            </>
          )}
          {!loading && (
            <>
              <div className="col-lg-9">
                <div className="row justify-content-between">
                  <NavbarDisposisi nav={navItems} />
                </div>
                {(nav == undefined || nav === "semua") && <CardDisposisi />}
                {nav == "belum-selesai" && <CardDisposisi />}
                {nav == "selesai" && <CardDisposisi />}
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav } }) {
  return {
    props: {
      nav: nav || null,
    },
  };
}

export default index;
