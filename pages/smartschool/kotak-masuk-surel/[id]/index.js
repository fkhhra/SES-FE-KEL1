import Link from "next/link";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import {
  FaChevronLeft,
  FaClipboard,
  FaClone,
  FaCloudDownloadAlt,
  FaComment,
  FaFile,
  FaFileDownload,
  FaInbox,
  FaLink,
  FaPaperclip,
  FaPaperPlane,
  FaPen,
  FaPlus,
  FaReply,
  FaTrashAlt,
  FaTrashRestoreAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../../client/clientAxios";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import ReactiveButton from "reactive-button";
import NewModal from "../../../../components/Shared/NewModal/NewModal";

import toast from "react-hot-toast";
import swal from "sweetalert";
import React from "react";
import { Badge } from "antd";
import { detailSurel } from "../../../../client/SurelClient";

import Avatar from "../../../../components/Shared/Avatar/Avatar";
import Editor from "../../../../components/Shared/Editor/Editor";
import SectionImport from "../../../../components/Dapodik/SectionImport";
import UploadBanner from "../../../../components/Shared/UploadBanner/UploadBanner";
// import UploadSurel from "../../../../components/Shared/UploadSurel/UploadSurel";
import { uploadFile } from "../../../../client/uploadFileClient";
import LoadingProgress from "../../../../components/Shared/LoadingProgress/LoadingProgress";
import { momentPackage } from "../../../../utilities/HelperUtils";

const index = ({
  id,
  preview = "",
  onChange = () => {},
  onUpload = () => {},
  onClick = () => {},
  name = "",
  label = "Lampiran",
  titleUnggahan = "Foto Banner",
  titleUkuran = "",
  titleRasio = "",
  disabled = false,
  accept,
  dataJoyride,
  isFile = true,
  isImport = true,
}) => {
  //   const [bukuIndukData, setBukuIndukData] = useState({});
  //   const { rombel } = bukuIndukData;
  const [clickSurel, setClickSurel] = useState(false);
  const [balasPesan, setBalasPesan] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [surelData, setSurelData] = useState({});
  const { surel } = surelData;
  const _getDetailSurel = async () => {
    setLoading(true);
    const { data } = await detailSurel(id);
    if (data) {
      setSurelData(data);
    }
    setLoading(false);
  };
  const [activeMenu, setActiveMenu] = useState(`/`);
  const [show, setShow] = React.useState(true);
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const toggleClass = () => {
    setClickSurel(!clickSurel);
  };
  const initialStateForm = {
    file: "",
    btnImport: "idle",
  };

  const [formData, setFormData] = useState({
    ...initialStateForm,
  });

  const _importRombel = async () => {
    setFormData({ ...formData, btnImport: "loading" });

    var fd = new FormData();
    for (var key in formData) {
      fd.append(key, formData[key]);
    }

    const { data, error } = await axios.post("rombel/import-rombel", fd);

    if (data) {
      setFormData({ ...formData, btnImport: "success" });
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnImport: "error" });
      toast.error(error?.message);
    }
  };

  const handleClickSubmit = () => {
    _importRombel();
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
  const [progress, setProgress] = useState(0);

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      return setProgress(uploadProgress);
    }

    setTimeout(() => {
      setProgress(0);
    }, 500);
  };

  const getFileUrl = (fileUrl, e) => {
    if (fileUrl) {
      onChange(e, fileUrl);
    }
  };
  const uploadFileToServer = async (e) => {
    if (isImport) {
      getFileUrl(e.target.files[0], e);
    } else {
      onUpload(true);
      await uploadFile(e.target.files[0], checkProgress, (fileUrl) =>
        getFileUrl(fileUrl, e)
      );
      onUpload(false);
    }
  };

  //   const _getBukuInduk = async () => {
  //     setLoading(true);
  //     const { data } = await getPredikat();
  //     if (data) {
  //       setBukuIndukData(data);
  //     }
  //     setLoading(false);
  //   };

  useEffect(() => {
    _getDetailSurel();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 pt-4 flex-column">
              <li className="nav-item">
                <Link href={`${ssURL}/kotak-masuk-surel`}>
                  <a
                    className="nav-link fw-bold fs-18-ss d-flex active align-items-center px-3 mb-3 d-flex justify-content-between"
                    aria-current="page"
                  >
                    <div className="d-flex">
                      <div>
                        <FaInbox color="#2680EB" />
                      </div>
                      <div className="color-dark ms-2">Kotak Masuk</div>
                    </div>

                    <Badge count={"10"} className="badge-primary-ss" />
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`${ssURL}/terkirim-surel`}>
                  <a
                    className="nav-link fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between"
                    aria-current="page"
                  >
                    <div className="d-flex">
                      <div>
                        <FaPaperPlane color="#80849C" />
                      </div>
                      <div className="ms-2 color-secondary">Terkirim</div>
                    </div>
                    <Badge count={"10"} className="badge-primary-ss" />
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={`${ssURL}/draft-surel`}>
                  <a
                    className="nav-link fw-bold fs-18-ss d-flex align-items-center px-3 mb-3 d-flex justify-content-between"
                    aria-current="page"
                  >
                    <div className="d-flex">
                      <div>
                        <FaFile color="#80849C" />
                      </div>

                      <div className="ms-2 color-secondary">Draft</div>
                    </div>
                    <Badge count={"10"} className="badge-primary-ss" />
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          {loading && (
            <>
              <div className="col-lg-9">
                <div className="row gy-4">
                  {/* <BukuIndukSkeleton count={3} /> */}
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
                        data-bs-target="#modalTambahTransaksi"
                        onClick={() => setEditData(null)}
                      >
                        <FaPlus className="me-2" />
                        Tulis Surel
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between my-4
                  "
                >
                  <Link href={`${ssURL}/kotak-masuk-surel`}>
                    <a className="text-decoration-none fw-bolder color-primary">
                      <FaChevronLeft />
                      <span className="ms-2">Kembali</span>
                    </a>
                  </Link>
                </div>
                <div className="row gy-4">
                  <div className="col-md-12 px-0">
                    <div className="card card-ss">
                      <div className="card-header-ss py-4 px-0">
                        <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                          <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4 fs-3">
                            {surel?.perihal}
                          </h4>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        {surel?.komen?.map((d, idx) => {
                          return (
                            <div
                              className="p-4"
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={toggleClass}
                            >
                              <div className="me-3 position-absolute">
                                <Avatar name={d?.user?.nama} size={42} />
                              </div>
                              <div className="ms-5 ps-3">
                                <div className="d-flex justify-content-between  ">
                                  <div>
                                    <p className="fs-6 fw-extrabold m-0 color-dark">
                                      {d?.user?.nama}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="fs-12-ss fw-bold m-0">
                                      {momentPackage(d?.create_at).format(
                                        "DD MMMM YYYY"
                                      )}
                                      {/* 1 Februari 2020 11.34 */}
                                    </p>
                                  </div>
                                </div>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: d?.komen,
                                  }}
                                  className="fs-14-ss m-0 text-truncate"
                                ></p>
                                {/* <p className="fs-14-ss m-0 text-truncate">
                                  {d?.komen}
                                </p> */}
                                {clickSurel && (
                                  <div className="my-4" id={`id-${id}`}>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: d?.komen,
                                      }}
                                      className="mb-0 color-secondary"
                                    ></p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <hr className="m-0" />
                        {!balasPesan && (
                          <div className="d-flex justify-content-end">
                            <button
                              className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill m-sm-3  mb-3 fw-bold color-secondary fs-14-ss "
                              onClick={() => setBalasPesan(true)}
                            >
                              <FaReply className="me-2 fs-6" />
                              Balas Pesan
                            </button>
                          </div>
                        )}
                        {balasPesan && (
                          <div className="p-4" data-joyride="form-sejarah">
                            <Editor
                              id="sejarah"
                              //   defaultValue={formData?.sejarah}
                            />
                            <hr />
                            <div>
                              {preview && isFile && (
                                <div className="card-lampiran-materi border-0 bg-soft-primary rounded-ss mt-4">
                                  <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                                    <a
                                      href={URL.createObjectURL(preview)}
                                      target="_blank"
                                    >
                                      <div className="d-flex align-items-center flex-wrap">
                                        <img
                                          src="/img/icon-file-xls.svg"
                                          alt=""
                                        />
                                        <div className="p-2">
                                          <p className="fw-bold color-dark mb-0">
                                            Template Import {name}
                                          </p>
                                          <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                                            {/* PDF */}
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                    <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                                      <FaTimes
                                        className="pointer fs-4"
                                        style={{ color: "#96DAFF" }}
                                        onClick={onClick}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* <UploadSurel
                                label="Lampiran"
                                id="file"
                                name="file"
                                preview={formData.file}
                                onChange={(e, uploadedFile) =>
                                  handleChangeForm(e, uploadedFile)
                                }
                                isFile={true}
                                onClick={() =>
                                  setFormData({ ...formData, file: "" })
                                }
                                isImport={true}
                              /> */}
                            </div>
                            <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column mt-4">
                              <div className="d-flex">
                                <div
                                  style={{
                                    width: "39px",
                                    height: "39px",
                                  }}
                                  className="rounded-circle bg-soft-secondary me-4 d-flex justify-content-center align-items-center"
                                >
                                  <label for={1}>
                                    <input
                                      className="form-control d-none"
                                      type="file"
                                      // accept={accept}
                                      id={1}
                                      // name={name}
                                      onChange={uploadFileToServer}
                                    />
                                    <FaPaperclip className="fs-5" />
                                  </label>
                                </div>
                                <div
                                  style={{
                                    width: "39px",
                                    height: "39px",
                                  }}
                                  className="rounded-circle bg-soft-secondary me-4 d-flex justify-content-center align-items-center"
                                >
                                  <FaLink className="fs-5" />
                                </div>
                                <div
                                  style={{
                                    width: "39px",
                                    height: "39px",
                                  }}
                                  className="rounded-circle bg-soft-secondary me-4 d-flex justify-content-center align-items-center"
                                >
                                  <FaTrashAlt className="fs-5" />
                                </div>
                              </div>
                              <div>
                                <div
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold color-secondary fs-14-ss me-3"
                                  //   data-bs-toggle="modal"
                                  //   data-bs-target="#modalTambahTransaksi"
                                  //   onClick={() => setEditData(null)}
                                >
                                  Draft
                                </div>

                                <div
                                  className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold "
                                  //   data-bs-toggle="modal"
                                  //   data-bs-target="#modalTambahTransaksi"
                                  //   onClick={() => setEditData(null)}
                                >
                                  Kirim
                                  <FaPaperPlane className="ms-2" />
                                </div>
                              </div>
                            </div>

                            <div className="d-flex justify-content-between">
                              <div></div>
                              <div></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
