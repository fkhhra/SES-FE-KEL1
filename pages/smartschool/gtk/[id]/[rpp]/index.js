import { Rate } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { ssURL } from "../../../../../client/clientAxios";
import {
  deletePerpusKomen,
  perpusKomen,
  postPerpusAktivitas,
} from "../../../../../client/PerpusClient";
import { getDetailRpp } from "../../../../../client/RppClient";
import Layout from "../../../../../components/Layout/Layout";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import KomenInput from "../../../../../components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "../../../../../components/Shared/KomenTimeline/KomenTimeline";
import useUser from "../../../../../hooks/useUser";
import { momentPackage } from "../../../../../utilities/HelperUtils";
import { hideModal } from "../../../../../utilities/ModalUtils";
const Heart = dynamic(() => import("react-animated-heart"), { ssr: false });

function index({ id, idRpp }) {
  const [detailRpp, setDetailRpp] = useState({});
  const { rpp, perpus } = detailRpp;
  const [buttonStateBaca, setButtonStateBaca] = useState("idle");
  const [buttonStateDownload, setButtonStateDownload] = useState("idle");

  const [ratingBuku, setRatingBuku] = useState(3);
  const { user } = useUser();

  const handleChangeRating = async (value) => {
    setRatingBuku(value);
  };

  const handleRatingBuku = async () => {
    const { data } = await postPerpusAktivitas({
      mPerpusId: id,
      waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      aktivitas: "rating",
      rating: ratingBuku,
    });

    if (data) {
      toast.success(data.message);
      _getDetailRpp();
    }
  };

  const _getDetailRpp = async () => {
    const { data } = await getDetailRpp(idRpp, { user_id: id });
    if (data) {
      setDetailRpp(data);
    }
  };

  const handleClickLampiran = async (linkLampiran) => {
    // setButtonStateBaca("loading");
    // const { data } = await postPerpusAktivitas({
    //   mPerpusId: id,
    //   waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    //   aktivitas: "baca",
    // });

    // if (data) {
    //   setButtonStateBaca("success");
    window.open(linkLampiran, "_blank");
    // }
  };

  const handleClickDownloadLampiran = async (linkLampiran) => {
    // const { data } = await postPerpusAktivitas({
    //   mPerpusId: id,
    //   waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    //   aktivitas: "download",
    // });

    // if (data) {
    window.open(linkLampiran, "_blank");
    // }
  };

  const postKomen = async (komen) => {
    const payload = {
      mPerpusId: parseInt(id),
      komen,
    };

    const { data } = await perpusKomen(payload);
    if (data) {
      toast.success(data?.message);
      _getDetailRpp();
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
          _getDetailRpp();
        }
      }
    });
  };

  useEffect(() => {
    _getDetailRpp();
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
                  dangerouslySetInnerHTML={{ __html: perpus?.deskripsi }}
                />
              </div>
              <div className="uploader-container mb-4">
                <h6 className="mb-0 fs-14-ss fw-semibold">
                  Diunggah oleh {perpus?.user?.nama} - {perpus?.sekolah?.nama}
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

  //   const steps = [
  //     {
  //       target: '[data-joyride="btn-beri-rating"]',
  //       content: (
  //         <div className="text-start">
  //           <h5 className="color-dark fw-black">Beri Rating</h5>
  //           <p className="color-secondary fw-semibold">
  //             Beri rating buku yang sudah {user?.role == "siswa" ? "kamu" : "anda"}{" "}
  //             baca, untuk memberikan penilaian kepada buku tersebut. Tekan tombol
  //             untuk memberikan rating buku.
  //           </p>
  //         </div>
  //       ),
  //       disableBeacon: true,
  //     },
  //     {
  //       target: '[data-joyride="button-baca-buku"]',
  //       content: (
  //         <div className="text-start">
  //           <h5 className="color-dark fw-black">Baca Buku</h5>
  //           <p className="color-secondary fw-semibold">
  //             Tekan tombol jika {user?.role == "siswa" ? "kamu" : "anda"} ingin
  //             membaca buku ini.
  //           </p>
  //         </div>
  //       ),
  //     },
  //     {
  //       target: '[data-joyride="button-download-buku"]',
  //       content: (
  //         <div className="text-start">
  //           <h5 className="color-dark fw-black">Ingin Mengunduh Buku ?</h5>
  //           <p className="color-secondary fw-semibold">
  //             Bukan hanya bisa membaca buku tetapi{" "}
  //             {user?.role == "siswa" ? "kamu" : "anda"} juga bisa mengunduh buku.
  //             Tekan tombol jika {user?.role == "siswa" ? "kamu" : "anda"} ingin
  //             mengunduh buku.
  //           </p>
  //         </div>
  //       ),
  //     },
  //     {
  //       target: '[data-joyride="deskripsi"]',
  //       content: (
  //         <div className="text-start">
  //           <h5 className="color-dark fw-black">Deskripsi Buku</h5>
  //           <p className="color-secondary fw-semibold">
  //             Bagian ini berisikan deskripsi dari buku.{" "}
  //             {user?.role == "siswa" ? "Kamu" : "Anda"} dapat membaca gambaran
  //             besar dari buku melalui bagian deskripsi buku. Tekan pada bagian ini
  //             untuk membaca deskripsi buku.
  //           </p>
  //         </div>
  //       ),
  //     },
  //     {
  //       target: '[data-joyride="komentar"]',
  //       content: (
  //         <div className="text-start">
  //           <h5 className="color-dark fw-black">Komentar Buku</h5>
  //           <p className="color-secondary fw-semibold">
  //             Bagian ini berisikan komentar komentar dari para pembaca.{" "}
  //             {user?.role == "siswa" ? "Kamu" : "Anda"} dapat membaca komentar dari
  //             pembaca dan juga memberikan komentar ataupun ulasan setelah membaca
  //             buku. Tekan pada bagian untuk memberikan komentar buku.
  //           </p>
  //         </div>
  //       ),
  //     },
  //   ];

  const [isClick, setClick] = useState(false);

  return (
    <>
      <Layout>
        {/* <MyJoyride steps={steps} /> */}
        <AnimatePage>
          <section
            className="banner banner-perpustakaan position-absolute"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(7, 0, 66, 0.25),
                rgba(4, 0, 36, 0.25)
          ), url("/img/bg-sma-smk-large.svg")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></section>

          <div className="row">
            <div className="col-md-12 mb-5">
              <div className="d-flex justify-content-between">
                <Link href={`${ssURL}/gtk/${id}?nav=rpp`}>
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

                <div className="row mb-5 justify-content-lg-start justify-content-center">
                  <div className="col-12">
                    <div className="d-lg-none d-flex justify-content-end love-rpp-responsive">
                      {/* <Heart
                        isClick={isClick}
                        onClick={() => setClick(!isClick)}
                      /> */}
                    </div>
                  </div>
                  <div className="col-lg-3 pe-lg-4 mb-lg-0 mb-4 d-flex flex-column cover-rpp">
                    <img
                      src="/img/cover-sma-smk.svg"
                      alt=""
                      className="rounded-ss w-100 img-fit-cover mb-3"
                      style={{ height: "257px" }}
                    />
                    <div className="px-4 py-1 fw-bold rounded-pill bg-warning shadow-dark-ss text-white text-center">
                      Daring
                    </div>
                  </div>
                  <div className="col-lg-9 ps-md-4">
                    {/* Judul & Penulis Start */}

                    <div className="row">
                      <div className="col-lg-11">
                        <h2 className="fw-black color-dark mb-2 text-lg-start text-center">
                          {rpp?.judul}
                        </h2>
                        <div className="d-flex align-items-center fw-bolder justify-content-lg-start justify-content-center">
                          <p className="me-4 mb-0">
                            Ditulis oleh {rpp?.user?.nama}
                          </p>
                        </div>
                      </div>
                      <div className="col-lg-1">
                        <div className="d-lg-block d-none">
                          {/* <Heart
                            isClick={isClick}
                            onClick={() => setClick(!isClick)}
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4 rpp-meta-data">
                      <div className="col-md-12">
                        <div
                          className="d-flex align-items-center color-primary fw-bolder justify-content-lg-start justify-content-center flex-wrap"
                          data-joyride="info"
                        >
                          {/* <div className="d-flex align-items-center me-4">
                            <img
                              src="/img/icon-love-primary.svg"
                              alt="icon-diunduh"
                              className="me-2"
                            />
                            100 Disukai
                          </div>
                          <div className="d-flex align-items-center me-4">
                            <img
                              src="/img/icon-download-primary.svg"
                              alt="icon-diunduh"
                              className="me-2"
                            />
                            100 Diunduh
                          </div>
                          <div className="d-flex align-items-center me-4">
                            <img
                              src="/img/icon-lihat.svg"
                              alt="icon-dibaca"
                              className="me-2"
                            />
                            100 Dibaca
                          </div> */}

                          {/* <button
                            className="btn btn-ss btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-12-ss"
                            style={{ letterSpacing: "1.5px" }}
                            data-bs-toggle="modal"
                            data-bs-target="#modalBeriRating"
                            data-joyride="btn-beri-rating"
                          >
                            Beri Rating
                          </button> */}
                        </div>
                      </div>
                    </div>

                    {/* Judul & Penulis End */}

                    <div className="row">
                      {/* Informasi Buku Start */}

                      <div className="col-md-7 mb-md-0 mb-4">
                        <table className="table mb-0">
                          <tbody className="fw-bolder">
                            <tr>
                              <td className="border-0 color-secondary">
                                Mapel
                              </td>
                              <td className="border-0 color-dark">
                                {rpp?.mataPelajaran?.nama || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">
                                Jenjang
                              </td>
                              <td className="border-0 color-dark">
                                {rpp?.sekolah?.tingkat}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">
                                Kelas
                              </td>
                              <td className="border-0 color-dark">
                                {rpp?.tingkat}
                              </td>
                            </tr>
                            <tr>
                              <td className="border-0 color-secondary">
                                Diunggah
                              </td>
                              <td className="border-0 color-dark">
                                {momentPackage(rpp?.createdAt).format(
                                  "DD MMMM YYYY"
                                )}
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
                            <ReactiveButton
                              buttonState={buttonStateBaca}
                              onClick={() => handleClickLampiran(rpp?.lampiran)}
                              color={"primary"}
                              idleText={`Lihat RPP`}
                              loadingText={"Diproses"}
                              successText={"Berhasil"}
                              errorText={"Gagal"}
                              type={"button"}
                              data-bs-dismiss="modal"
                              className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fw-bold"
                            />
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
                                handleClickDownloadLampiran(rpp?.lampiran)
                              }
                              idleText={`Unduh RPP`}
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
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Deskripsi
                    </h5>
                    <p>{rpp?.deskripsi}</p>
                  </div>
                </div>
              </div>

              {/* Card Timeline Detail End */}
            </div>
          </div>
        </AnimatePage>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params: { id, rpp } }) {
  return {
    props: {
      id: id,
      idRpp: rpp,
    },
  };
}

export default index;
