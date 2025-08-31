import { Pagination, Rate, Select, Tooltip } from "antd";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import Iframe from "react-iframe";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  deletePerpus,
  getPerpus,
  postPerpus,
  putPerpus,
} from "../../../client/PerpusClient";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../components/Shared/Avatar/Avatar";
import Editor from "../../../components/Shared/Editor/Editor";
import PerpustakaanFilter from "../../../components/Shared/Filter/PerpustakaanFilter";
import InputFile from "../../../components/Shared/InputFile/InputFile";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import BukuPerpusSkeleton from "../../../components/Shared/Skeleton/BukuPerpusSkeleton";
import UploadBanner from "../../../components/Shared/UploadBanner/UploadBanner";
import useUser from "../../../hooks/useUser";
import { hideModal } from "../../../utilities/ModalUtils";
const { Option } = Select;

const index = ({ nav, search }) => {
  const initialFormData = {
    judul: "",
    penulis: [],
    noRak: "",
    penerbit: "",
    tahunTerbit: "",
    isbn: "",
    draft: 0,
    buku: "",
    mMataPelajaranId: "",
    tag: [],
    cover: "",
    sumber: "",
  };

  const router = useRouter();

  const { user } = useUser();
  const { sekolah, setSekolah } = useSekolah();
  const [clickPenulis, setClickPenulis] = useState([0]);
  const [buttonStatePostPerpus, setButtonStatePostPerpus] = useState("idle");
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [storeKemdikbud, setStoreKemdikbud] = useState({});
  const [perpusData, setPerpusData] = useState({});
  const { perpus, total, mataPelajaran, tag } = perpusData;

  const handlePostPerpus = async () => {
    if (!formData.judul) {
      toast.error("Judul Buku Belum Ditambahkan");
      return;
    }
    if (!formData.buku) {
      toast.error("File Buku Belum Ditambahkan");
      return;
    }
    if (!formData.penulis) {
      toast.error("Penulis Buku Belum Ditambahkan");
      return;
    }
    if (!formData.cover) {
      toast.error("Cover Buku Belum Ditambahkan");
      return;
    }

    setButtonStatePostPerpus("loading");

    const payload = {
      ...formData,
      deskripsi: window
        .$(`#editorPembahasanBukuPerpustakaan`)
        .summernote("code"),
    };

    const { data, error } = editId
      ? await putPerpus(editId, payload)
      : await postPerpus(payload);

    if (data) {
      setButtonStatePostPerpus("success");
      hideModal("modalTambahBukuPerpustakaan");
      toast.success(data.message);
      getPerpusData();
      setFormData(initialFormData);
      setEditId(null);
    } else {
      setButtonStatePostPerpus("error");
      toast.error(error?.message);
    }
  };

  const onClickEdit = (data) => {
    let tag = [];

    data?.tag &&
      data?.tag?.map((tagData) => {
        tag.push(tagData?.tag?.nama);
      });

    setEditId(data.id);
    setFormData({
      ...formData,
      judul: data.judul,
      penulis: data?.penulis?.split(","),
      penerbit: data.penerbit,
      tahunTerbit: data.tahunTerbit,
      isbn: data.isbn,
      draft: data.draft,
      noRak: data.noRak,
      buku: data.buku.link,
      mMataPelajaranId: data?.mapel?.mMataPelajaranId,
      tag: tag,
      cover: data.cover,
      sumber: data.sumber,
    });
    window
      .$(`#editorPembahasanBukuPerpustakaan`)
      .summernote("code", data.deskripsi);
  };

  const handleChangeForm = (e, value) => {
    if (e.target.name == "penulis") {
      formData.penulis[e.target.id] = e.target.value;

      return;
    }

    setFormData({ ...formData, [e.target.name]: value || e.target.value });
  };

  const handleChangeInputFile = async (e, data) => {
    if (data) {
      setFormData({
        ...formData,
        buku: data,
      });
    }
  };

  const getPerpusData = async () => {
    try {
      setLoading(true);
      const params = {
        nav,
        page,
        search,
        ...router.query,
      };
  
      if (!nav) {
        params.nav = "buku-sekolah";
      }
  
      // if (router.query.tag && !Array.isArray(router.query.tag)) {
      //   params.tag = [router.query.tag];
      // }
  
      // if (!router.query.urutkan) {
      //   params.urutkan = "terbaru";
      // }
      
      const { data } = await getPerpus(params);
      setPerpusData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching perpus data:", error);
    }
  };

  const handleSubmitCariBuku = (e) => {
    e.preventDefault();
    router.push({
      pathname: `${ssURL}/perpustakaan`,
      query: {
        nav: nav,
        search: cariBuku,
      },
    });

    setFormData(initialFormData);
  };

  const handleChangeTag = (value) => {
    setFormData({ ...formData, tag: value });
  };

  const handleChangeMapel = (value) => {
    setFormData({ ...formData, mMataPelajaranId: value });
  };

  const handleDeletePerpus = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePerpus(id);
        if (data) {
          toast.success(data?.message);
          getPerpusData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  let checkMapel = "";

  useEffect(() => {
    getPerpusData();
  }, [nav, page, search, router.query]);

  const [cariBuku, setCariBuku] = useState("");

  const CardBukuPerpustakaan = ({ data, isDraf = false }) => {
    if (nav === "smartlibrary"){
      data = {
        ...data,
        cover: data.image,
        judul: data.title,
        penulis: data.writer,
        user: {
          nama: "Kemdikbud",
          avatar: "https://buku.kemdikbud.go.id/assets/image/logo-sibi.png"
        }
      }
    }
    return (
      <>
        <div className="card-buku-perpustakaan dropdown dropdown-ss position-relative">
          {data?.user?.id == user?.id && (
            <div
              className="rounded-circle shadow-primary-ss position-absolute pointer d-flex justify-content-center align-items-center bg-primary"
              style={{
                right: "5%",
                top: "4%",
                width: "40px",
                height: "40px",
                zIndex: 1,
              }}
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/img/icon-option-horizontal-bg-primary.svg"
                alt="icon-option-vertical"
                style={{ height: "5px" }}
              />
            </div>
          )}
          <ul
            className="dropdown-menu dropdown-menu-ss my-1"
            aria-labelledby="dropdownMenuLink"
          >
            <li
              data-bs-toggle="modal"
              data-bs-target="#modalTambahBukuPerpustakaan"
              onClick={() => onClickEdit(data)}
            >
              <a className="dropdown-item">
                <FaPen className="me-2" />
                <span>Edit</span>
              </a>
            </li>
            <li onClick={() => handleDeletePerpus(data?.id)}>
              <a className="dropdown-item color-danger">
                <FaTrashAlt className="me-2" />
                <span>Hapus</span>
              </a>
            </li>
          </ul>
          <div className="card card-ss pointer">
            <Link
              href={`${ssURL}/perpustakaan/[id]`}
              as={`${ssURL}/perpustakaan/${nav === "smartlibrary" ? data?.slug : data?.id}`}
            >
              <a className="text-decoration-none">
                <img
                  src={data?.cover}
                  className="card-img-top card-header-ss img-fit-cover pdf-ss"
                />
                {isDraf && (
                  <div className="card-img-overlay p-3">
                    <span className="rounded-pill bg-light-secondary px-4 py-1 color-dark fs-14-ss fw-bold">
                      Draft
                    </span>
                  </div>
                )}
                <div className="card-body w-100 p-3">
                  <Tooltip title={data?.judul}>
                    <h5 className="fw-black color-dark mb-1 text-truncate">
                      {data?.judul}
                    </h5>
                  </Tooltip>
                  <Tooltip title={data?.penulis}>
                    <h6 className="mb-0 fw-semibold text-truncate color-secondary">
                      {data?.penulis}
                    </h6>
                  </Tooltip>
                  <div className="d-flex align-items-center color-primary mt-3 fs-14-ss fw-bolder mb-2">
                    <div className="d-flex align-items-center me-4">
                      <img
                        src="/img/icon-lihat.svg"
                        alt="icon-dibaca"
                        className="me-2"
                      />
                      {data?.meta?.totalBaca}
                    </div>
                    <div className="d-flex align-items-center me-4">
                      <img
                        src="/img/icon-komen-primary.svg"
                        alt="icon-komentar"
                        className="me-2"
                      />
                      {data?.meta?.totalKomen}
                    </div>
                    <div className="d-flex align-items-center">
                      <img
                        src="/img/icon-download-primary.svg"
                        alt="icon-download"
                        className="me-2"
                      />
                      {data?.meta?.totalDownload}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Rate disabled defaultValue={5} className="me-2" />
                    <span className="fs-14-ss fw-bold color-secondary mt-1">
                      ( {data?.meta?.totalRating} )
                    </span>
                  </div>
                </div>
              </a>
            </Link>
            <div className="card-footer card-footer-ss w-100 p-0 pb-3">
              <hr className="mt-0 mb-3" />
              <div className="d-flex align-items-center w-100 px-3">
                <Avatar
                  name={data?.user?.nama}
                  src={data?.user?.avatar}
                  size={45}
                  className="me-3"
                />
                <div className="fs-14-ss w-75">
                  {nav === "smartlibrary" ? (
                    <Tooltip title={data?.user?.nama}>
                      <div className="color-dark fw-bold text-truncate">
                        {data?.user?.nama}
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip title={data?.user?.nama}>
                        <div className="color-dark fw-bold text-truncate">
                          {data?.user?.nama}
                        </div>
                      </Tooltip>
                      <Tooltip title={data?.sekolah?.nama}>
                        <div className="fw-semibold text-truncate">
                          {data?.sekolah?.nama}
                        </div>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const steps = [
    {
      target: '[data-joyride="cari-buku"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Cari Buku</h5>
          <p className="color-secondary fw-semibold">
            Cari buku yang ingin {user?.role == "siswa" ? "kamu" : "anda"} baca
            melalui kotak pencarian.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="dropdown-perpustakaan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Perpustakaan</h5>
          <p className="color-secondary fw-semibold">
            Pilih perpustakaan mana yang ingin{" "}
            {user?.role == "siswa" ? "kamu" : "anda"} baca. Tekan pada tombol
            untuk mengganti perpustakaan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="dropdown-perpus-urutkan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Urutan Buku</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "siswa" ? "Kamu" : "Anda"} bisa mengurutkan jenis
            buku yang ingin dibaca berdasarkan buku terbaru, paling populer, dan
            paling dibicarakan. Tekan pada tombol untuk mengurutkan jenis buku.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="filter-perpus-collapse"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Filter Buku</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "siswa" ? "Kamu" : "Anda"} bisa memfilter jenis buku
            yang ingin dibaca berdasarkan filter yang tersedia. Tekan pada
            tombol untuk memfilter jenis buku.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="filter-tag-perpustakaan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rekomendasi Buku</h5>
          <p className="color-secondary fw-semibold">
            Bingung untuk memilih buku ? Tersedia rekomendasi buku yang sering
            dicari untuk membantu {user?.role == "siswa" ? "kamu" : "anda"}{" "}
            mimilih buku.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <MyJoyride steps={steps} />
      <Layout
        modalWrapper={
          <>
            <div
              className="modal modal-ss fade"
              id="modalTambahBukuPerpustakaan"
              tabIndex="-1"
              aria-labelledby="modalTambahBukuPerpustakaan"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex justify-content-between align-items-center">
                            <div
                              className="modal-title"
                              id="modalBuatTugasKuisLabel"
                            >
                              <h4 className="mb-1 fw-extrabold">
                                {editId ? "Edit" : "Tambah"} Buku
                              </h4>
                              <span className="fs-14-ss">
                                Isi informasi dibawah untuk menambahkan buku
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() =>
                                hideModal("modalTambahBukuPerpustakaan")
                              }
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-body">
                    <div className="container">
                      <div className="row justify-content-center gy-4">
                        <div className="col-md-12">
                          <div className="card card-ss">
                            <div className="card-body p-4 pb-5">
                              <div className="d-flex justify-content-between align-md-items-center flex-md-row flex-column bab-detail mb-5">
                                <div className="bab-title w-100 order-md-1 order-2">
                                  <input
                                    className="ps-0 border-0 border-bottom border-2 form-control form-bab-materi shadow-none fs-4 color-dark fw-extrabold"
                                    name="judul"
                                    value={formData.judul}
                                    onChange={handleChangeForm}
                                    placeholder="Tulis judul buku disini"
                                  />
                                </div>
                              </div>
                              <h4 className="fw-extrabold color-dark title-border mb-5">
                                Buku
                              </h4>
                              <div className="row">
                                <div className="col-md-6">
                                  <p className="form-label">File Buku</p>
                                  <div>
                                    <label
                                      htmlFor="inputFileBukuPerpustakaan"
                                      className="form-label mb-4 w-100"
                                    >
                                      <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 py-lg-5 py-md-3 py-5 px-3">
                                        <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                                          <img
                                            src={`/img/icon-upload-dropfile.svg`}
                                          />
                                          <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                                            Klik untuk mengunggah{" "}
                                            <span className="color-primary">
                                              Buku
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </label>
                                    <InputFile
                                      type="file"
                                      id="inputFileBukuPerpustakaan"
                                      name="inputFileBukuPerpustakaan"
                                      onChange={handleChangeInputFile}
                                    />
                                    {formData.buku && (
                                      <Iframe
                                        url={formData.buku}
                                        width="100%"
                                        height="450px"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <UploadBanner
                                    label="Cover Buku"
                                    accept="image/*"
                                    id="uploadCoverBuku"
                                    name="cover"
                                    titleUnggahan="Cover Buku"
                                    preview={formData.cover}
                                    onUpload={(onUpload) =>
                                      setButtonStatePostPerpus(
                                        onUpload ? "loading" : "idle"
                                      )
                                    }
                                    onChange={(e, uploadedFile) =>
                                      handleChangeForm(e, uploadedFile)
                                    }
                                  />
                                </div>
                                <div className="col-12">
                                  <label className="form-label">Sumber Buku</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Tuliskan link atau url sumber buku"
                                    name="sumber"
                                    value={formData.sumber}
                                    onChange={handleChangeForm}
                                  />
                                </div>
                              </div>

                              <hr className="my-5" />
                              <h4 className="fw-extrabold color-dark title-border mb-5">
                                Penulis Buku
                              </h4>
                              {clickPenulis?.map((d) => {
                                return (
                                  <>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <label
                                        htmlFor=""
                                        className="form-label mb-0"
                                      >
                                        Nama Penulis
                                      </label>
                                      {clickPenulis[clickPenulis.length - 1] ==
                                        d && (
                                        <button
                                          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                          }}
                                          onClick={() =>
                                            setClickPenulis(
                                              clickPenulis.filter((e) => {
                                                delete formData.penulis[d];
                                                return e !== d;
                                              })
                                            )
                                          }
                                        >
                                          <FaTrashAlt />
                                        </button>
                                      )}
                                    </div>
                                    <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                                      <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                                        <input
                                          className="form-control"
                                          autoComplete="off"
                                          placeholder="Tuliskan nama penulis buku"
                                          type="text"
                                          name="penulis"
                                          id={d}
                                          value={formData.penulis}
                                          onChange={handleChangeForm}
                                        />
                                      </div>
                                      {clickPenulis[clickPenulis.length - 1] ==
                                        d && (
                                        <button
                                          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                          }}
                                          onClick={() =>
                                            setClickPenulis(
                                              clickPenulis.filter((e) => {
                                                delete formData.penulis[d];
                                                return e !== d;
                                              })
                                            )
                                          }
                                        >
                                          <FaTrashAlt />
                                        </button>
                                      )}
                                    </div>
                                  </>
                                );
                              })}

                              <button
                                onClick={() =>
                                  setClickPenulis([
                                    ...clickPenulis,
                                    Math.max(...clickPenulis) + 1,
                                  ])
                                }
                                className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                              >
                                <FaPlus className="me-2" />
                                Tambah Nama Penulis
                              </button>
                              <hr className="my-5" />
                              <h4 className="fw-extrabold color-dark title-border mb-5">
                                Penerbitan Buku
                              </h4>
                              <div className="mb-4">
                                <label className="form-label">Penerbit</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  autoComplete="off"
                                  placeholder="Tuliskan penerbit buku"
                                  name="penerbit"
                                  value={formData.penerbit}
                                  onChange={handleChangeForm}
                                />
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-sm-0 mb-4">
                                    <label className="form-label">
                                      Tahun Penerbit
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Contoh : 2021"
                                      name="tahunTerbit"
                                      onChange={handleChangeForm}
                                      value={formData.tahunTerbit}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-sm-0 mb-4">
                                    <label className="form-label">
                                      Nomor ISBN
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Contoh : 9789792235708"
                                      name="isbn"
                                      onChange={handleChangeForm}
                                      value={formData.isbn}
                                    />
                                  </div>
                                </div>
                              </div>
                              <hr className="my-5" />
                              <h4 className="fw-extrabold color-dark title-border mb-5">
                                Kategori Buku
                              </h4>
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-sm-0 mb-4">
                                    <label className="form-label">
                                      Mata Pelajaran Terkait
                                    </label>
                                    <Select
                                      className="select-mapel-buku-perpus"
                                      style={{ width: "100%" }}
                                      optionFilterProp="children"
                                      showSearch
                                      filterOption={(input, option) =>
                                        option.children
                                          .toLowerCase()
                                          .indexOf(input.toLowerCase()) >= 0
                                      }
                                      value={formData.mMataPelajaranId}
                                      onChange={handleChangeMapel}
                                      placeholder="Pilih mata pelajaran"
                                    >
                                      {mataPelajaran?.map((d) => {
                                        if (d.nama == checkMapel) {
                                          return;
                                        }

                                        checkMapel = d.nama;

                                        return (
                                          <Option
                                            value={d.id}
                                          >{`${d.nama}`}</Option>
                                        );
                                      })}
                                    </Select>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="mb-sm-0 mb-4">
                                    <label className="form-label">Tag</label>
                                    <Select
                                      mode="tags"
                                      placeholder="Berikan kata kunci"
                                      style={{ width: "100%" }}
                                      onChange={handleChangeTag}
                                      value={formData.tag}
                                    >
                                      <Option value="trigonometri">
                                        Trigonometri
                                      </Option>
                                      <Option value="kalkulus">Kalkulus</Option>
                                      <Option value="teks biografi">
                                        Teks Biografi
                                      </Option>
                                    </Select>
                                  </div>
                                </div>
                                <div className="col-12 mt-2">
                                  <div className="mb-sm-0 mb-4">
                                    <label className="form-label">Nomor Rak Buku</label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      autoComplete="off"
                                      placeholder="Tuliskan nomor rak buku"
                                      name="noRak"
                                      value={formData.noRak}
                                      onChange={handleChangeForm}
                                    />
                                  </div>
                                </div>
                              </div>
                              <hr className="my-5" />
                              <h4 className="fw-extrabold color-dark title-border mb-5">
                                Deskripsi Buku
                              </h4>
                              <Editor id="editorPembahasanBukuPerpustakaan" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer d-flex justify-content-center">
                    <div className="container">
                      <div className="row ">
                        <div className="col-md-12 d-flex justify-content-end">
                          <button
                            type="button"
                            className="btn btn-secondary me-3"
                            data-bs-dismiss="modal"
                          >
                            Draft
                          </button>
                          <ReactiveButton
                            onClick={handlePostPerpus}
                            buttonState={buttonStatePostPerpus}
                            color={"primary"}
                            idleText={`${editId ? "Edit" : "Tambah"} Buku`}
                            loadingText={"Diproses"}
                            successText={"Berhasil"}
                            errorText={"Gagal"}
                            type={"button"}
                            data-bs-dismiss="modal"
                            className="btn btn-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      >
        <AnimatePage>
          <section
            className={`banner position-absolute ${search && "banner-search"}`}
          ></section>
          {!search && (
            <div className="row text-center mb-5">
              <div className="text-white" style={{ zIndex: "1" }}>
                <h1 className="fw-black">Perpus Smarteschool</h1>
                <h6 className="fw-bold">
                  Tingkatkan Literasimu. Baca dan Upload Buku Disini
                </h6>
              </div>
            </div>
          )}
          <div className="row mt-2">
            <div className="col-md-12">
              <div className="card card-ss mb-4">
                <div className="row flex-sm-row flex-column">
                  <div
                    className="col-sm-9 d-flex flex-column"
                    data-joyride="cari-buku"
                  >
                    <form onSubmit={handleSubmitCariBuku}>
                      <input
                        type="text"
                        className="form-control form-search-perpustakaan fs-5 fw-bold ms-4 pe-sm-0 pe-4"
                        style={{ marginTop: "12px" }}
                        placeholder="Cari Buku..."
                        name="cariBuku"
                        value={cariBuku}
                        onChange={(e) => {
                          setCariBuku(e.target.value);
                        }}
                      />
                      <button type="submit" className="d-none">
                        Cari
                      </button>
                    </form>
                  </div>
                  <div className="col-sm-3 d-flex justify-content-end">
                    <div className="dropdown dropdown-ss dropdown-search-perpustakaan text-sm-start text-center">
                      <div
                        className="dropdown-perpustakaan-toggle-container"
                        style={{
                          paddingTop: "40px",
                          paddingRight: "40px",
                          paddingBottom: "40px",
                        }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-joyride="dropdown-perpustakaan"
                      >
                        <div
                          className={`dropdown-toggle dropdown-search-perpustakaan-toggle border-start border-5 border-secondary border-light-secondary-ss ps-4 fs-5 fw-bold color-dark pointer
                    }`}
                        >
                          {nav == "smartlibrary" && "Smartlibrary"}
                          {nav == "buku-saya" && "Buku Saya"}
                          {(nav == "buku-sekolah" || !nav) && "Buku Sekolah"}
                        </div>
                      </div>
                      <ul
                        className="dropdown-menu mt-2"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <Link
                            href={`${ssURL}/perpustakaan?nav=buku-saya${
                              search ? "&search=" + search : ""
                            }`}
                          >
                            <a
                              className={`dropdown-item   ${
                                nav == "buku-saya" && "active"
                              }`}
                              href="#"
                            >
                              <img
                                src="/img/icon-buku-saya.svg"
                                alt="icon-buku-saya"
                                className="me-2"
                              />
                              Buku Saya
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`${ssURL}/perpustakaan?nav=buku-sekolah${
                              search ? "&search=" + search : ""
                            }`}
                          >
                            <a
                              className={`dropdown-item   ${
                                (nav == "buku-sekolah" || !nav) && "active"
                              }`}
                              href="#"
                            >
                              <img
                                src="/img/icon-buku-sekolah.svg"
                                alt="icon-buku-sekolah"
                                className="me-2"
                              />
                              Buku Sekolah
                            </a>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href={`${ssURL}/perpustakaan?nav=smartlibrary${
                              search ? "&search=" + search : ""
                            }`}
                          >
                            <a
                              className={`dropdown-item   ${
                                nav == "smartlibrary" && "active"
                              }`}
                              href="#"
                            >
                              <img
                                src="/img/icon-smartlibrary.svg"
                                alt="icon-smartlibrary"
                                className="me-2"
                              />
                              Smartlibrary
                            </a>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {search && (
                <div className="row mb-5">
                  <div className="col-md-12 text-center">
                    <h1 className="fw-black color-dark">{search}</h1>
                    <p className="mb-0">
                      {total} pencarian untuk kata kunci {search}
                    </p>
                  </div>
                </div>
              )}

              {/* Sort and Filter Start */}
              {/* <PerpustakaanFilter nav={nav} perpusData={perpusData} /> */}

              {/* Sort and Filter End */}

              <div className="row g-4">
                {nav == "buku-saya" && (
                  <div
                    className="col-lg-3 col-md-6"
                    onClick={() => {
                      setFormData(initialFormData);
                      setEditId(null);
                    }}
                  >
                    <div
                      className="rounded-ss bg-soft-primary border border-primary-ss h-100 pointer d-flex flex-column align-items-center justify-content-center p-4"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahBukuPerpustakaan"
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <div
                          className="rounded-circle bg-primary shadow-primary-ss fw-black text-white d-flex justify-content-center align-items-center fs-3 mb-3"
                          style={{ height: "75px", width: "75px" }}
                        >
                          <FaPlus />
                        </div>
                        <h5 className="fs-18-ss fw-bold color-primary">
                          Tambah Buku
                        </h5>
                      </div>
                    </div>
                  </div>
                )}
                {loading && <BukuPerpusSkeleton count={4} />}
                {!loading && sekolah?.id == 8025
                  ? perpus?.filter((e) => e?.mSekolahId == 8025)?.map((d) => {
                      return (
                        <div
                          className="col-lg-3 col-md-6"
                          data-joyride="card-perpustakaan"
                        >
                          <CardBukuPerpustakaan data={d} />
                        </div>
                      );
                    })
                  : !loading &&
                    perpus?.map((d) => {
                      return (
                        <div
                          className="col-lg-3 col-md-6"
                          data-joyride="card-perpustakaan"
                        >
                          <CardBukuPerpustakaan data={d} />
                        </div>
                      );
                    }
                  )
                }
                <div className="my-4 text-center">
                  <Pagination
                    total={total}
                    pageSize={12}
                    current={page}
                    onChange={(e) => setPage(e)}
                    showSizeChanger={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatePage>
      </Layout>
    </div>
  );
};

export async function getServerSideProps({ query: { nav, search } }) {
  return {
    props: {
      nav: nav || null,
      search: search || null,
    },
  };
}

export default index;
