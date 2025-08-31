import { Badge, Tooltip } from "antd";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaEnvelopeOpen,
  FaFile,
  FaFolder,
  FaInbox,
  FaPaperclip,
  FaPaperPlane,
  FaPlus,
  FaTasks,
  FaTrashAlt,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteSurel,
  editSurelDibaca,
  getSurel,
  postSurel,
  postSurelDiarsip,
} from "../../../client/SurelClient";
import ModalTulisSurel from "../../../components/KotakMasukSurel/ModalTulisSurel";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import ModalArsipSurel from "../../../components/Shared/ModalArsipSurel/ModalArsipSurel";
import PesanSurelSkeleton from "../../../components/Shared/Skeleton/PesanSurelSkeleton";
import { momentPackage } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";

const index = ({ subnav }) => {
  const [surelData, setSurelData] = useState({});
  const { jumlahMasuk, surel, arsip, jumlahDraft } = surelData;
  const [loading, setLoading] = useState(false);
  const [showTool, setShowTool] = useState(false);
  const initialStateForm = {
    id: "",
    surelDicheck: [1],
    arsip: "",
    btnBio: "idle",
    nama: "",
    perihal: "",
    isi: "",
    email: "",
    lampiran: "",
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

  const dataSurel = surel?.data.filter((d) => {
    return d?.surel != null;
  });
  const pinArsip = arsip?.filter((d) => {
    return d?.pin == 1;
  });

  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [show, setShow] = React.useState(true);

  const handleChangeFormCheck = (e) => {
    const parse = JSON.parse(e.target.value);

    const check = formData[e.target.name].findIndex((d) => d == parse);

    if (check >= 0) {
      const filtered = formData[e.target.name].filter((d) => d != parse);

      setFormData({
        ...formData,
        [e.target.name]: [...filtered],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: [...formData[e.target.name], parse],
      });
    }
  };
  const _postSurel = async () => {
    setFormData({ ...formData, btnBio: "loading" });

    const { data, error } = await postSurel({
      nama: formData.nama,
      perihal: formData.perihal,
      isi: window.$(`#isi`).summernote("code", data?.isi),
      email: formData.email,
    });

    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getKotakMasukSurel();
      hideModal("modalTulisSurel");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };
  const handleDeleteSurel = async () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteSurel({
          tipe_surel_id: formData.surelDicheck,
        });
        if (data) {
          _getKotakMasukSurel();
          toast.success(data?.message);
        } else {
          setButtonState("error");
        }
      }
    });
  };

  const handleSurelDibaca = async () => {
    const { data, error } = await editSurelDibaca({
      tipe_surel_id: formData.surelDicheck,
    });
    if (data) {
      _getKotakMasukSurel();
      toast.success(data?.message);
    } else {
      toast.error(error?.message);
    }
  };

  const _postSurelDiarsip = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postSurelDiarsip({
      tipe_surel_id: formData.surelDicheck,
      arsip_id: formData.arsip,
    });
    if (data) {
      setFormData({ ...formData, btnBio: "success" });
      _getKotakMasukSurel();
      hideModal("modalArsipSurel");
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
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
                    </Link>{" "}
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
          <div className="col-lg-9 ">
            <div className="row gy-4">
              <div className="card card-ss">
                {!formData.surelDicheck.length ? (
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
                ) : (
                  <div className="d-flex justify-content-center align-items-md-center flex-column px-4 py-4">
                    <div
                      className="d-flex justify-content-between"
                      style={{ width: "60%" }}
                    >
                      <div
                        style={{
                          width: "39px",
                          height: "39px",
                        }}
                        className="rounded-circle bg-soft-secondary mx-2 d-flex justify-content-center align-items-center icon-surel"
                      >
                        <Tooltip title="Pilih Semua">
                          <FaTasks className="fs-5" />
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          width: "39px",
                          height: "39px",
                        }}
                        className="rounded-circle bg-soft-secondary mx-2 d-flex justify-content-center align-items-center icon-surel"
                        onClick={() => handleSurelDibaca()}
                      >
                        <Tooltip title="Tandai sudah dibaca">
                          <FaEnvelopeOpen className="fs-5 " />
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          width: "39px",
                          height: "39px",
                        }}
                        className="rounded-circle bg-soft-secondary mx-2 d-flex justify-content-center align-items-center icon-surel"
                        data-bs-toggle="modal"
                        data-bs-target="#modalArsipSurel"
                      >
                        <Tooltip title="Arsip">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="20"
                              viewBox="0 0 22 20"
                              class="icon-surel-arsip"
                            >
                              <path
                                id="icon-button-arsip"
                                d="M19.25,20H2.75a1.325,1.325,0,0,1-.536-.112,1.366,1.366,0,0,1-.437-.306,1.425,1.425,0,0,1-.294-.454,1.471,1.471,0,0,1-.108-.557V5.714h19.25V18.572a1.471,1.471,0,0,1-.108.557,1.425,1.425,0,0,1-.294.454,1.366,1.366,0,0,1-.437.306A1.325,1.325,0,0,1,19.25,20ZM7.36,13a.434.434,0,0,0-.408.283.463.463,0,0,0,.1.5l3.63,3.771a.429.429,0,0,0,.623,0l3.63-3.771a.466.466,0,0,0,.094-.5.433.433,0,0,0-.405-.28H12.163V8.582a.449.449,0,0,0-.44-.457H10.256a.449.449,0,0,0-.44.457V13ZM21.313,4.286H.688A.67.67,0,0,1,.2,4.076a.723.723,0,0,1-.2-.5V1.429A1.471,1.471,0,0,1,.108.872,1.426,1.426,0,0,1,.4.418,1.366,1.366,0,0,1,.839.112,1.325,1.325,0,0,1,1.375,0h19.25a1.325,1.325,0,0,1,.536.112A1.366,1.366,0,0,1,21.6.418a1.426,1.426,0,0,1,.294.454A1.471,1.471,0,0,1,22,1.429V3.571a.723.723,0,0,1-.2.5A.67.67,0,0,1,21.313,4.286Z"
                                transform="translate(0 0)"
                                fill="#80849c"
                                class="icon-surel-arsip"
                              />
                            </svg>
                          </div>
                        </Tooltip>
                      </div>
                      <div
                        style={{
                          width: "39px",
                          height: "39px",
                        }}
                        className="rounded-circle bg-soft-secondary mx-2 d-flex justify-content-center align-items-center  icon-surel"
                        onClick={() => handleDeleteSurel()}
                      >
                        <Tooltip title="Hapus">
                          <FaTrashAlt className="fs-5" />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {loading && <PesanSurelSkeleton count={3} />}
            {!loading && (
              <>
                {dataSurel?.map((d, idx) => {
                  return (
                    <div className="row gy-4 mt-2">
                      <div className="col-md-12 px-0">
                        <div className="form-check-surel position-relative">
                          <input
                            className="form-check-input position-absolute"
                            type="checkbox"
                            // value={d?.id}
                            name="surelDicheck"
                            // id={`ditunjukkan-${d?.id}`}
                            onChange={handleChangeFormCheck}
                            // checked={
                            //   formData?.surelDicheck?.findIndex(
                            //     (data) => data == d?.id
                            //   ) >= 0
                            // }
                            // onClick={() => setShowTool(true)}
                          />

                          <div
                            className="card card-ss form-check-label"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <Link href={`${ssURL}/kotak-masuk-surel/${d?.id}`}>
                              <div className="card-body py-4 px-4 fp">
                                <div className="ps-5">
                                  <div className="d-flex justify-content-between ">
                                    <div>
                                      <p className="fs-14-ss fw-bold m-0">
                                        {d?.surel?.userPengirim?.nama}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="fs-14-ss fw-bold m-0">
                                        {momentPackage(
                                          d?.surel?.create_at
                                        ).format("DD MMMM YYYY")}
                                      </p>
                                    </div>
                                  </div>
                                  <p
                                    className={`fs-18-ss fw-extrabold m-0  ${
                                      d?.dibaca == 0 && "color-dark"
                                    }
                                    `}
                                  >
                                    {d?.surel?.perihal}
                                  </p>

                                  <p
                                    className={`fs-6 fw-extrabold m-0 text-truncate ${
                                      d?.dibaca == 0 && "color-dark"
                                    }`}
                                  >
                                    {d?.surel?.isi}
                                  </p>
                                  <div className="d-flex mt-4">
                                    <div className="me-4 d-flex">
                                      <FaPaperclip className="me-2" />
                                      <p className="fs-14-ss fw-semibold m-0">
                                        1 Lampiran
                                      </p>
                                    </div>
                                    <div className="me-4 d-flex">
                                      <FaComment className="me-2" />
                                      <p className="fs-14-ss fw-semibold m-0">
                                        3 Percakapan
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <ModalTulisSurel
          _postSurel={_postSurel}
          formData={formData}
          handleChangeForm={handleChangeForm}
        />
        <ModalArsipSurel
          arsip={arsip}
          _postSurelDiarsip={_postSurelDiarsip}
          formData={formData}
          handleChangeForm={handleChangeForm}
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
