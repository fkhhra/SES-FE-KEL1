import { Badge } from "antd";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FaFile,
  FaFolder,
  FaInbox,
  FaPaperPlane,
  FaPen,
  FaPlus,
  FaThumbtack,
  FaTrashAlt,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteArsip,
  editArsip,
  editPinArsip,
  getSurel,
  postArsip,
} from "../../../client/SurelClient";
import ModalTambahArsip from "../../../components/ArsipSurel/ModalTambahArsip";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import ArsipSurelSkeleton from "../../../components/Shared/Skeleton/ArsipSurelSkeleton";
import { hideModal } from "../../../utilities/ModalUtils";

const index = ({ subnav }) => {
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
                  <ArsipSurelSkeleton count={4} />
                </div>
              </div>
            </>
          )}
          {!loading && (
            <>
              {/* <CardBukuInduk
                dataBukuInduk={rombel}
                linkRedirect={`${ssURL}/buku-induk/`}
              /> */}
              <div className="col-lg-9 ">
                <div className="row gy-4">
                  <div className="card card-ss">
                    <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4 py-4">
                      <div className="col-lg col-md">
                        <input
                          type="text"
                          className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                          style={{ height: "42px", width: "100%" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Surel"
                          // value={searchTransaksi}
                          // onChange={(e) => setSearchTransaksi(e.target.value)}
                        />
                      </div>
                      <div
                        className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-md-3 ms-0 mt-md-0 mt-3"
                        data-bs-toggle="modal"
                        data-bs-target="#modalTulisSurel"
                        // onClick={() => setEditData(null)}
                      >
                        <FaPlus className="me-2" />
                        Tulis Surel
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row gy-4 mt-2">
                  <div className="col-md-12 px-0">
                    <div className="card card-ss p-4 justify-content-between d-flex">
                      <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column mb-4">
                        <h4 className="fw-extrabold m-0 color-dark fs-3">
                          Daftar Folder Arsip
                        </h4>
                      </div>
                      <div className="row gy-4">
                        <div
                          className="col-md-3 pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#modalTambahArsip"
                          onClick={() => setFormData(initialStateForm)}
                        >
                          <div className="card-tambah-arsip-ss card card-ss px-0 ">
                            <div
                              className="card-body p-4 "
                              style={{
                                marginTop: "-25px",
                              }}
                            >
                              <div className="d-flex justify-content-center">
                                <img src="/img/icon-tambah-folder.svg" />
                              </div>
                              <div
                                style={{
                                  marginTop: "-30px",
                                }}
                              >
                                <p className="fs-6 fw-extrabold m-0 color-primary text-center">
                                  Tambah Folder
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {arsip?.map((d, idx) => {
                          return (
                            <div className="col-md-3">
                              <div className="card-arsip-ss card card-ss px-0 ">
                                <div className="card-body p-4">
                                  <div className="justify-content-between d-flex">
                                    {d?.pin == 1 ? (
                                      <img src="/img/icon-folder-pin.svg" />
                                    ) : (
                                      <img src="/img/icon-folder.svg" />
                                    )}
                                    <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                                      <div
                                        role="button"
                                        id="dropdownOption"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <img
                                          src={`/img/icon-option-vertical.svg`}
                                          alt="icon-option"
                                        />
                                      </div>
                                      <ul
                                        className="dropdown-menu dropdown-menu-ss my-1"
                                        aria-labelledby="dropdownOption"
                                      >
                                        <li
                                          onClick={() => onClickEdit(d)}
                                          data-bs-toggle="modal"
                                          data-bs-target="#modalTambahArsip"
                                        >
                                          <a className="dropdown-item">
                                            <FaPen className="me-2" />
                                            <span>Edit</span>
                                          </a>
                                        </li>
                                        <li
                                          onClick={() =>
                                            handleEditPinArsip(d?.id, d?.pin)
                                          }
                                        >
                                          <a className="dropdown-item">
                                            {d?.pin == 1 ? (
                                              <>
                                                <img
                                                  src={`/img/icon-unpin.svg`}
                                                  className="me-2"
                                                />
                                                <span>Lepas Tanda</span>
                                              </>
                                            ) : (
                                              <>
                                                <FaThumbtack className="me-2" />
                                                <span>Pasang Tanda</span>
                                              </>
                                            )}
                                          </a>
                                        </li>
                                        <li
                                          onClick={() =>
                                            handleDeleteArsip(d?.id)
                                          }
                                        >
                                          <a className="dropdown-item color-danger">
                                            <FaTrashAlt className="me-2" />
                                            <span>Hapus</span>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="fs-6 fw-extrabold m-0 color-dark">
                                      {d?.nama}
                                    </p>
                                    <p className="fs-14-ss fw-bold m-0">
                                      {d?.meta?.total} Surat
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <ModalTambahArsip
          handleChangeForm={handleChangeForm}
          formData={formData}
          _postArsip={_postArsip}
        />
      </AnimatePage>
    </Layout>
  );
};

// export async function getServerSideProps({ query: { subnav } }) {
//   return {
//     props: {
//       subnav: subnav || null,
//     },
//   };
// }

export default index;
