import { Rate } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { ssURL } from "../../../../client/clientAxios";
import {
  deletePerpusKomen,
  detailPerpus,
  perpusKomen,
  postPerpusAktivitas,
} from "../../../../client/PerpusClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import KomenInput from "../../../../components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "../../../../components/Shared/KomenTimeline/KomenTimeline";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import Tabs from "../../../../components/Shared/Tabs/Tabs";
import useUser from "../../../../hooks/useUser";
import { momentPackage } from "../../../../utilities/HelperUtils";
import { hideModal } from "../../../../utilities/ModalUtils";

function index({ id }) {
  const [detailPerpusData, setDetailPerpusData] = useState({});
  const { perpus, ratingPerpus } = detailPerpusData;
  const [buttonStateBaca, setButtonStateBaca] = useState("idle");
  const [buttonStateDownload, setButtonStateDownload] = useState("idle");
  const [buttonStateRating, setButtonStateRating] = useState("idle");
  const isKemdikbud = isNaN(parseInt(id)) ? true : false;

  const [ratingBuku, setRatingBuku] = useState(3);
  const { user } = useUser();

  const handleChangeRating = async (value) => {
    setRatingBuku(value);
  };

  const handleRatingBuku = async () => {
    try {
      setButtonStateRating("loading");
      const { data } = await postPerpusAktivitas({
        mPerpusId: isNaN(parseInt(id)) ? null : parseInt(id),
        kemdikbudId: isNaN(parseInt(id)) ? perpus?.id : null,
        waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
        aktivitas: "rating",
        rating: ratingBuku,
      });
  
      if (data) {
        setButtonStateRating("success")
        toast.success(data.message);
        getDetailPerpusData();
        hideModal("modalBeriRating");
      }
    } catch(error) {
      setButtonStateRating("error");
    }
  };

  const getDetailPerpusData = async () => {
    if (isNaN(parseInt(id))) {
      isKemdikbud = true;
    } else {
      isKemdikbud = false;
    }

    const { data } = await detailPerpus(id, { isKemdikbud });

    if (data) {
      console.log("data", data);
      setDetailPerpusData(data);
    }
  };

  const handleClickBacaBuku = async (linkBuku) => {
    try {
      setButtonStateBaca("loading");
      const { data } = await postPerpusAktivitas({
        mPerpusId: isNaN(parseInt(id)) ? null : parseInt(id),
        kemdikbudId: isNaN(parseInt(id)) ? perpus?.id : null,
        waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
        aktivitas: "baca",
      });

      if (data) {
        setButtonStateBaca("success");
        getDetailPerpusData();
        window.open(linkBuku, "_blank");
      }
    } catch (error) {
      setButtonStateBaca("error");
    }
  };

  const handleClickDownloadBuku = async (linkBuku) => {
    try {
      setButtonStateDownload("loading");
      const { data } = await postPerpusAktivitas({
        mPerpusId: isNaN(parseInt(id)) ? null : parseInt(id),
        kemdikbudId: isNaN(parseInt(id)) ? perpus?.id : null,
        waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
        aktivitas: "download",
      });

      if (data) {
        setButtonStateDownload("success");
        getDetailPerpusData();
        window.open(linkBuku, "_blank");
      }
    } catch (error) {
      setButtonStateDownload("error");
    }
  };

  const postKomen = async (komen) => {
    const payload = {
      mPerpusId: isNaN(parseInt(id)) ? null : parseInt(id),
      kemdikbudId: isNaN(parseInt(id)) ? perpus?.id : null,
      komen,
    };

    const { data } = await perpusKomen(payload);
    if (data) {
      toast.success(data?.message);
      getDetailPerpusData();
    }
  };

  const deleteKomen = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deletePerpusKomen(id);
        if (data) {
          toast.success(data?.message);
          getDetailPerpusData();
        }
      }
    });
  };

  useEffect(() => {
    getDetailPerpusData();
  }, []);

  const navItemsPerpustakaan = [
    {
      id: "deskripsi",
      nav: "Deskripsi",
      active: true,
      dataJoyride: "deskripsi",
      content: (
        <>
          <div className="row mt-4">
            <div className="col-md-12">
              <div className="deskripsi-buku-container mb-4">
                <p
                  className="dangerous-html"
                  dangerouslySetInnerHTML={{ __html: isKemdikbud ? perpus?.description : perpus?.deskripsi }}
                />
              </div>
              <div className="uploader-container mb-4">
                <h6 className="mb-0 fs-14-ss fw-semibold">
                  Diunggah oleh {isKemdikbud ? 'Kemdikbud' : `${perpus?.user?.nama} - ${perpus?.sekolah?.nama}`}
                </h6>
              </div>
              <div className="tag-container">
                {perpus?.tag?.map((d) => {
                  return (
                    <span className="label-ss rounded-pill bg-soft-primary border border-primary-ss color-primary fs-12-ss me-3 pointer">
                      {d?.tag?.nama}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          {/* {timeline?.komen?.map((komenData, idx) => (
            <KomenTimeline
              idx={idx}
              totalKomen={timeline?.komen?.length}
              komen={komenData?.komen}
              userObj={komenData?.user}
              userId={komenData?.mUserId}
              createdAt={komenData?.createdAt}
              onClickDelete={deleteKomen}
              komenId={komenData?.id}
            />
          ))}
          <KomenInput postKomen={postKomen} /> */}
        </>
      ),
    },
    {
      id: "komentar",
      nav: "Komentar",
      dataJoyride: "komentar",
      content: (
        <div className="mt-4">
          {perpus?.komen?.map((komenData, idx) => (
            <KomenTimeline
              idx={idx}
              totalKomen={perpus?.komen?.length}
              komen={komenData?.komen}
              userObj={komenData?.user}
              userId={komenData?.mUserId}
              createdAt={komenData?.createdAt}
              onClickDelete={deleteKomen}
              komenId={komenData?.id}
            />
          ))}
          <KomenInput postKomen={postKomen} />
        </div>
      ),
    },
  ];

  const desc = ["kurang menarik", "cukup", "lumayan", "bagus!", "keren abis!"];

  const steps = [
    {
      target: '[data-joyride="btn-beri-rating"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Beri Rating</h5>
          <p className="color-secondary fw-semibold">
            Beri rating buku yang sudah{" "}
            {user?.role == "siswa" ? "kamu" : "anda"} baca, untuk memberikan
            penilaian kepada buku tersebut. Tekan tombol untuk memberikan rating
            buku.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="button-baca-buku"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Baca Buku</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika {user?.role == "siswa" ? "kamu" : "anda"} ingin
            membaca buku ini.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="button-download-buku"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Mengunduh Buku ?</h5>
          <p className="color-secondary fw-semibold">
            Bukan hanya bisa membaca buku tetapi{" "}
            {user?.role == "siswa" ? "kamu" : "anda"} juga bisa mengunduh buku.
            Tekan tombol jika {user?.role == "siswa" ? "kamu" : "anda"} ingin
            mengunduh buku.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="deskripsi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Deskripsi Buku</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini berisikan deskripsi dari buku.{" "}
            {user?.role == "siswa" ? "Kamu" : "Anda"} dapat membaca gambaran
            besar dari buku melalui bagian deskripsi buku. Tekan pada bagian ini
            untuk membaca deskripsi buku.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="komentar"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Komentar Buku</h5>
          <p className="color-secondary fw-semibold">
            Bagian ini berisikan komentar komentar dari para pembaca.{" "}
            {user?.role == "siswa" ? "Kamu" : "Anda"} dapat membaca komentar
            dari pembaca dan juga memberikan komentar ataupun ulasan setelah
            membaca buku. Tekan pada bagian untuk memberikan komentar buku.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Layout
        modalWrapper={
          <>
            <div
              className="modal modal-ss fade"
              id="modalBeriRating"
              tabIndex="-1"
              aria-labelledby="modalBeriRating"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title fw-extrabold">Beri Rating</h4>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => hideModal("modalBeriRating")}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body text-center">
                    <h1 className="fw-black color-dark">{ratingBuku}</h1>
                    <Rate
                      allowHalf
                      tooltips={desc}
                      onChange={handleChangeRating}
                      value={ratingBuku}
                    />

                    <p>Klik bintang untuk memberi rating</p>
                  </div>
                  <div className="modal-footer d-flex justify-content-center">
                    <div className="row w-100">
                      <div className="col-6 ps-0">
                        <button
                          type="button"
                          className="btn btn-secondary w-100"
                          data-bs-dismiss="modal"
                        >
                          Batal
                        </button>
                      </div>
                      <div className="col-6 pe-0">
                        <ReactiveButton
                          buttonState={buttonStateRating}
                          onClick={handleRatingBuku}
                          color={"primary"}
                          idleText={`Beri Rating`}
                          loadingText={"Diproses"}
                          successText={"Berhasil"}
                          errorText={"Gagal"}
                          type={"button"}
                          data-bs-dismiss="modal"
                          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      >
        <MyJoyride steps={steps} />
        <AnimatePage>
          <section
            className="banner banner-perpustakaan position-absolute"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(7, 0, 66, 0.6),
                rgba(4, 0, 36, 0.65)
          ), url(${isKemdikbud ? perpus?.image : perpus?.cover})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></section>

          <div className="row">
            <div className="col-md-12">
              <div className="d-flex justify-content-between">
                <Link href={`${ssURL}/perpustakaan`}>
                  <a
                    className="text-decoration-none fw-bolder position-relative text-white pointer"
                    data-joyride="button-kembali"
                  >
                    <FaChevronLeft />
                    <span className="ms-2">Kembali</span>
                  </a>
                </Link>
              </div>

              {/* Card Timeline Detail Start */}

              <div className="card card-ss p-4 pb-5 mt-3 mb-4">
                {/* Dropdown Option Start */}

                {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-flex justify-content-end">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={`/img/icon-dropdown-option.svg`}
                      alt="icon-option"
                    />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a className="dropdown-item">
                        <FaPen className="me-2" />
                        <span>Edit</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item color-danger">
                        <FaTrashAlt className="me-2" />
                        <span>Hapus</span>
                      </a>
                    </li>
                  </ul>
                </div> */}
                {/* Dropdown Option End */}

                <div className="row mb-4 justify-content-lg-start justify-content-center">
                  <div className="col-lg-3 pe-lg-4 mb-lg-0 mb-4">
                    <img
                      src={isKemdikbud ? perpus?.image : perpus?.cover}
                      alt=""
                      className="rounded-ss w-100 img-fit-contain bg-very-soft-secondary"
                      style={{ height: "310px" }}
                    />
                  </div>
                  <div className="col-lg-9 ps-md-4">
                    {/* Judul & Penulis Start */}

                    <div className="row mb-4">
                      <div className="col-md-12">
                        <h2 className="fw-black color-dark mb-2 text-lg-start text-center">
                          {isKemdikbud ? perpus?.title : perpus?.judul}
                        </h2>
                        <div className="d-flex align-items-center fw-bolder justify-content-lg-start justify-content-center">
                          <p className="me-4 mb-0">
                            Ditulis oleh {isKemdikbud ? perpus?.writer : perpus?.penulis}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-12">
                        <div
                          className="d-flex align-items-center color-primary fw-bolder justify-content-lg-start justify-content-center flex-wrap"
                          data-joyride="info"
                        >
                          <div className="d-flex align-items-center me-4">
                            <img
                              src="/img/icon-lihat.svg"
                              alt="icon-dibaca"
                              className="me-2"
                            />
                            {perpus?.meta?.totalBaca} Dibaca
                          </div>
                          <div className="d-flex align-items-center me-4">
                            <img
                              src="/img/icon-download-primary.svg"
                              alt="icon-diunduh"
                              className="me-2"
                            />
                            {perpus?.meta?.totalDownload} Diunduh
                          </div>
                          <div className="d-flex align-items-center me-4">
                            <Rate defaultValue={1} count={1} disabled />
                            <span className="color-dark fw-extrabold ms-2 mb-0 mt-1 ">
                              {ratingPerpus ? ratingPerpus : 0} {""}{" "}
                              <span className="color-secondary fw-semibold">
                                dari {perpus?.meta?.totalRating} Ulasan
                              </span>
                            </span>
                          </div>
                          <button
                            className="btn btn-ss btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-12-ss"
                            style={{ letterSpacing: "1.5px" }}
                            data-bs-toggle="modal"
                            data-bs-target="#modalBeriRating"
                            data-joyride="btn-beri-rating"
                          >
                            Beri Rating
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Judul & Penulis End */}

                    <div className="row">
                      {/* Informasi Buku Start */}

                      <div className="col-md-7">
                        <table className="table mb-0">
                          <tbody className="fw-bolder">
                            <tr>
                              <td className="border-0 color-secondary">
                                Mapel
                              </td>
                              <td className="border-0 color-dark">
                                {(isKemdikbud ? perpus?.subject : perpus?.mapel?.mapel?.nama) || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">
                                Penerbit
                              </td>
                              <td className="border-0 color-dark">
                                {(isKemdikbud ? perpus?.publisher : perpus?.penerbit) || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">
                                Tahun
                              </td>
                              <td className="border-0 color-dark">
                                {(isKemdikbud ? perpus?.published_year : perpus?.tahunTerbit) || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">ISBN</td>
                              <td className="border-0 color-dark">
                                {perpus?.isbn || "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Informasi Buku End */}

                      <div className="col-md-5">
                        <div className="d-flex flex-column">
                          <div
                            data-joyride="button-baca-buku"
                            className="d-flex flex-column"
                          >
                            {(perpus?.buku?.link || perpus?.attachment) && (
                              <ReactiveButton
                                buttonState={buttonStateBaca}
                                onClick={() =>
                                  handleClickBacaBuku(perpus?.buku?.link || perpus?.attachment)
                                }
                                color={"primary"}
                                idleText={`Baca Buku`}
                                loadingText={"Diproses"}
                                successText={"Berhasil"}
                                errorText={"Gagal"}
                                type={"button"}
                                data-bs-dismiss="modal"
                                className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fw-bold"
                              />
                            )}
                            {(isKemdikbud ? perpus?.attachment : perpus?.sumber) && (
                              <div className="text-center w-100 position-relative my-4">
                                <hr
                                  className="m-0 w-100 position-absolute"
                                  style={{
                                    top: "50%",
                                    left: "0",
                                    transform: "translateY(-50%)",
                                  }}
                                />
                                <span
                                  className="position-relative fs-14-ss fw-bold bg-white px-4 py-1"
                                  style={{ zIndex: "2" }}
                                >
                                  ATAU
                                </span>
                                <a
                                  href={isKemdikbud ? `https://buku.kemdikbud.go.id/katalog/${id}` : perpus?.sumber}
                                  className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fw-bold fs-14-ss"
                                  target="_blank"
                                >
                                  Baca dari Sumber
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="text-center w-100 position-relative my-4">
                            <hr
                              className="m-0 w-100 position-absolute"
                              style={{
                                top: "50%",
                                left: "0",
                                transform: "tranlateY(-50%)",
                              }}
                            />
                            <span
                              className="position-relative fs-14-ss fw-bold bg-white px-4 py-1"
                              style={{ zIndex: "2" }}
                            >
                              ATAU
                            </span>
                          </div>
                          <div
                            data-joyride="button-download-buku"
                            className="d-flex flex-column"
                          >
                            <ReactiveButton
                              buttonState={buttonStateDownload}
                              onClick={() =>
                                handleClickDownloadBuku(perpus?.attachment || perpus?.buku?.link)
                              }
                              idleText={`Unduh Buku`}
                              loadingText={"Diproses"}
                              successText={"Berhasil"}
                              errorText={"Gagal"}
                              type={"button"}
                              data-bs-dismiss="modal"
                              className="btn-download-buku-perpus btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill fw-bold"
                              style={{ background: "none" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Tabs navItems={navItemsPerpustakaan} />
              </div>

              {/* Card Timeline Detail End */}
            </div>
          </div>
        </AnimatePage>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id,
    },
  };
}

export default index;
