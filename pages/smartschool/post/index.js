import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  getInformasiSekolah,
  updateInformasiSekolah,
} from "../../../client/InformasiSekolahClient";
import { deletePost, getPost } from "../../../client/PostClient";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import PostinganSkeleton from "../../../components/Shared/Skeleton/PostinganSkeleton";
import Tabs from "../../../components/Shared/Tabs/Tabs";
import UploadBanner from "../../../components/Shared/UploadBanner/UploadBanner";
import useUser from "../../../hooks/useUser";

const initialFormData = {
  bannerBlog: "",
};

const index = () => {
  const { user } = useUser();

  const [postData, setPostData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [updatePublikasi, setUpdatePublikasi] = useState(false);
  const { post } = postData;

  const handleChangeForm = (e, value) => {
    setFormData({
      ...formData,
      [e.target.name]: value || e.target.value,
    });
    setUpdatePublikasi(!updatePublikasi);
  };

  const handlePutPublikasi = async () => {
    const { data } = await updateInformasiSekolah(formData);
    if (data) {
      toast.success(data.message);
      getPostData();
    }
  };

  const getPublikasiData = async () => {
    const params = {
      section: "blog",
    };

    const { data } = await getInformasiSekolah(params);
    if (data) {
      setFormData({ ...formData, ...data.informasiSekolah });
    }
  };

  const getPostData = async () => {
    setLoading(true);
    const { data } = await getPost();
    if (data) {
      setPostData(data);
    }
    setLoading(false);
  };

  const handleDeletePostData = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePost(id);
        if (data) {
          toast.success(data?.message);
          getPostData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    if (formData.bannerBlog) {
      handlePutPublikasi();
    }
  }, [updatePublikasi]);

  useEffect(() => {
    getPostData();
    getPublikasiData();
  }, []);

  const navItemsBlogAdmin = [
    {
      id: "publish",
      nav: "Publish",
      active: true,
      dataJoyride: "publish",
      content: (
        <>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="table-responsive mb-5">
                <table className="table-ss" data-joyride="table-postingan">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto</th>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Penulis</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post
                      ?.filter((detailPost) => detailPost.disembunyikan === 0)
                      .map((post, idx) => (
                        <tr>
                          <td>{idx + 1}</td>
                          <td>
                            <a target="__blank">
                              <img
                                src={post.banner}
                                alt="img"
                                className="img-fit-cover rounded-circle pointer"
                                style={{ width: "50px", height: "50px" }}
                              />
                            </a>
                          </td>
                          <td>{post.judul}</td>
                          <td>Artikel</td>
                          <td>Admin</td>
                          <td>
                            <div className="d-flex flex-lg-row flex-md-column flex-row">
                              <Link
                                href={`${ssURL}/post/[id]/edit`}
                                as={`${ssURL}/post/${post?.id}/edit`}
                              >
                                <a
                                  className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                >
                                  <FaPen className="color-secondary" />
                                </a>
                              </Link>
                              <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
                                <div
                                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  onClick={() => handleDeletePostData(post?.id)}
                                >
                                  <FaTrashAlt className="color-secondary" />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "draf",
      nav: "Draf",
      dataJoyride: "draf",
      content: (
        <>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="table-responsive mb-5">
                <table className="table-ss" data-joyride="table-postingan">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Foto</th>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Penulis</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {post
                      ?.filter((detailPost) => detailPost.disembunyikan === 1)
                      .map((post, idx) => (
                        <tr>
                          <td>{idx + 1}</td>
                          <td>
                            <a target="__blank">
                              <img
                                src={post.banner}
                                alt="img"
                                className="img-fit-cover rounded-circle pointer"
                                style={{ width: "50px", height: "50px" }}
                              />
                            </a>
                          </td>
                          <td>{post.judul}</td>
                          <td>Artikel</td>
                          <td>Admin</td>
                          <td>
                            <div className="d-flex flex-lg-row flex-md-column flex-row">
                              <Link
                                href={`${ssURL}/post/[id]/edit`}
                                as={`${ssURL}/post/${post?.id}/edit`}
                              >
                                <a
                                  className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                >
                                  <FaPen className="color-secondary" />
                                </a>
                              </Link>
                              <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
                                <div
                                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  onClick={() => handleDeletePostData(post?.id)}
                                >
                                  <FaTrashAlt className="color-secondary" />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  const steps = [];

  if (user?.role == "admin") {
    steps.push(
      {
        target: '[data-joyride="section-banner-halaman-blog"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Banner Halaman Postingan</h5>
            <p className="color-secondary fw-semibold">
              Bagian ini merupakan tempat anda untuk mengedit banner halaman
              postingan pada website informasi sekolah.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="banner-halaman-blog"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Ingin Mengedit Banner ?</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol dan pilih foto untuk mengedit banner halaman
              postingan pada website informasi sekolah.
            </p>
          </div>
        ),
      },

      {
        target: '[data-joyride="daftar-postingan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Menu Daftar Postingan</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisikan daftar postingan yang sudah dibuat. Disini
              anda dapat membuat bank soal untuk postingan yang akan diujikan
              kepada siswa anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="button-tambah-postingan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Membuat Postingan Baru ?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol untuk menambahkan postingan baru.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="publish"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Menu Publish</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisikan daftar postingan yang sudah dipublish.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="draf"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Menu Draf</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisikan daftar postingan yang masih didraf.
            </p>
          </div>
        ),
      }
    );
  } else if (user?.role != "admin") {
    steps.push(
      {
        target: '[data-joyride="button-tambah-postingan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Membuat Postingan Baru ?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol untuk menambahkan postingan baru.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="card-postingan"]',
        content: "Text 2",
      },
      {
        target: '[data-joyride="button-lihat-detail"]',
        content: "Text 3",
      },
      {
        target: '[data-joyride="button-edit"]',
        content: "Text 4",
      },
      {
        target: '[data-joyride="button-delete"]',
        content: "Text 5",
      },
      {
        target: '[data-joyride="label-disembunyikan"]',
        content: "Text 6",
      }
    );
  }

  return (
    <Layout>
      <MyJoyride steps={steps} />
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            {user?.role == "admin" && (
              <>
                <div className="card card-ss p-4 mb-4">
                  <div className="card-body p-0">
                    <div data-joyride="section-banner-halaman-blog">
                      <h4 className="fw-extrabold color-dark title-border mb-5">
                        Banner Halaman Blog
                      </h4>
                      <UploadBanner
                        label="Banner"
                        accept="image/*"
                        id="uploadBannerProfil"
                        name="bannerBlog"
                        titleUkuran="1366 x 768"
                        preview={formData.bannerBlog}
                        onChange={(e, uploadedFile) =>
                          handleChangeForm(e, uploadedFile)
                        }
                        dataJoyride="banner-halaman-blog"
                      />
                      <hr className="my-5" />
                    </div>
                    <div data-joyride="daftar-postingan">
                      <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column mb-5">
                        <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
                          Daftar Postingan
                        </h4>
                        <Link href={`${ssURL}/post/tambah`}>
                          <a
                            className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                            data-joyride="button-tambah-postingan"
                          >
                            <FaPlus className="me-2" />{" "}
                            {user?.role == "admin"
                              ? "Tambah Blog Baru"
                              : "Tambah Postingan"}
                          </a>
                        </Link>
                      </div>
                      <Tabs navItems={navItemsBlogAdmin} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {user?.role !== "admin" && (
              <div className="card card-ss">
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                    <h4 className="fw-extrabold color-dark title-border mb-md-0 mb-4">
                      Daftar Postingan
                    </h4>
                    <Link href={`${ssURL}/post/tambah`}>
                      <a
                        className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary rounded-pill fw-bold fs-14-ss shadow-primary-ss"
                        data-joyride="button-tambah-postingan"
                      >
                        <FaPlus className="me-2" /> Tambah Postingan
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="card-body p-4">
                  {loading && <PostinganSkeleton />}
                  {!loading &&
                    post?.map((post) => (
                      <div
                        className="berita mt-3"
                        data-joyride="card-postingan"
                      >
                        <div className="row">
                          <div className="berita-img col-md-6 mb-md-0 mb-4">
                            <img
                              src={`${post?.banner}`}
                              alt="gambar-berita"
                              className="img-fluid w-100 img-fit-contain rounded-ss"
                              style={{
                                height: "305px",
                                background: "var(--soft-gray)",
                              }}
                            />
                          </div>
                          <div className="berita-content col-md-6 ps-md-5 ps-3 d-flex flex-column justify-content-center">
                            <div
                              className="mb-4"
                              style={{
                                maxHeight: "200px",
                                overflowY: "hidden",
                              }}
                            >
                              <h4
                                className="fw-extrabold color-dark mb-2"
                                style={{
                                  maxHeight: "86px",
                                  overflowY: "hidden",
                                }}
                              >
                                {post?.judul}
                              </h4>
                              <p
                                className="berita-content-text font-weight-normal mb-0"
                                dangerouslySetInnerHTML={{
                                  __html: post?.konten,
                                }}
                                style={{
                                  maxHeight: "143px",
                                  overflowY: "hidden",
                                }}
                              />
                            </div>
                            <p>{post?.createdAt}</p>
                            <div className="d-flex align-items-center">
                              <div
                                className="btn btn-primary btn-ss fs-14-ss fw-bold shadow-primary-ss rounded-pill"
                                data-joyride="button-lihat-detail"
                              >
                                Lihat Detail
                              </div>
                              <Link
                                href={`${ssURL}/post/[id]/edit`}
                                as={`${ssURL}/post/${post?.id}/edit`}
                              >
                                <a
                                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 mx-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  data-joyride="button-edit"
                                >
                                  <FaPen className="color-secondary" />
                                </a>
                              </Link>
                              <button
                                className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => handleDeletePostData(post?.id)}
                                data-joyride="button-delete"
                              >
                                <FaTrashAlt className="color-secondary" />
                              </button>
                              {post?.disembunyikan === 1 && (
                                <div
                                  className="label-ss bg-light-primary color-primary fs-12-ss fw-bold rounded-pill"
                                  data-joyride="label-disembunyikan"
                                >
                                  Disembunyikan
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <hr className="my-5" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
