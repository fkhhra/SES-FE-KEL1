import { getJalurPpdb } from "client/JalurPpdbClient";
import React, { useEffect, useState } from "react";
import { currencyFormatter, momentPackage } from "utilities/HelperUtils";
import { getAlurPPDB } from "../../client/AlurPPDB";
import Layout from "../../components/PPDB/Layout";
import AnimatePage from "../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../hooks/useSekolah";
import { useJalur, useJalurId } from "../../hooks/useJalur";
import useTa from "../../hooks/useTa";
import { ppdbURL } from "client/clientAxios";
import { checkJadwalJalurGelombang } from "../../utilities/PPDBUtils";
import Link from "next/link";
import { useRouter } from "next/router";


const IndexPPDBPage = () => {
  const router = useRouter();
  const { sekolah } = useSekolah();

  const [alurPPDB, setAlurPPDB] = useState({});
  const { alur } = alurPPDB;
  const { ta } = useTa();

  const [collapseOpen, setcollapseOpen] = useState({});
  const [collapseOpenGelombang, setcollapseOpenGelombang] = useState({});

  const { jalurId, setJalurId } = useJalurId();

  const { jalurData, setJalurData } = useJalur();
  // console.log(jalurData);
  const { jalur } = jalurData;

  const currentJalur = jalurId
    ? jalur?.find((d) => d?.id == jalurId)
    : { gelombang: [] };

  const _getAlurPPDB = async () => {
    const { data } = await getAlurPPDB({ isPublic: true });
    if (data) {
      setAlurPPDB(data);
    }
  };

  const _getJalurPPDB = async () => {
    const { data } = await getJalurPpdb();
    if (data) {
      setJalurData(data);
      setJalurId(data?.jalur?.[0]?.id);
    }
  };

  let beranda = "beranda"
  if (sekolah.id === 70) {
    beranda = "beranda-suluh"
  }

  useEffect(() => {
    _getAlurPPDB();
    _getJalurPPDB();
  }, []);
  // useEffect(() => {
  //   if (sekolah?.id == 9487 || sekolah?.id == 9489) {
  //     router.push("/");
  //   }
  // }, [sekolah]);

  return (
    <Layout isFrontPage={true}>
      <AnimatePage>
        <section
          id={beranda}
          className="position-relative"

          style={{ paddingTop: "82px" }}
        >
          <div className="container py-5">
            <div className="row justify-content-center text-center text-white">
              <div className="col-md-12 mb-4"
                style={{
                  textTransform: sekolah?.id == 70 ? "uppercase" : "none",
                }}
              >
                <h2 className="fw-black mb-2">
                  {sekolah?.id === 70 ? (
                    <>
                      {sekolah?.tingkat === "kampus"
                        ? "Pendaftaran Mahasiswa"
                        : (
                          <>
                            PENERIMAAN PESERTA DIDIK BARU <br />
                            TAHUN PELAJARAN 2025/2026
                          </>
                        )}
                    </>
                  ) : (
                    <>
                      {sekolah?.tingkat === "kampus"
                        ? "Pendaftaran Mahasiswa"
                        : "PPDB"}{" "}
                      ONLINE
                    </>
                  )}
                </h2>


                <h1 className="fw-black mb-0 uppercase">
                  {sekolah?.nama}
                </h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  {sekolah?.id === 70 ? (
                    <p className="fs-5 mb-5">
                      Dapatkan kesempatan mengembangkan prestasi lebih baik di sini
                      {sekolah?.id === 9487 || sekolah?.id === 9489
                        ? ""
                        : " dengan fasilitas dan kualitas belajar yang bagus."}
                    </p>
                  ) : (
                    <p className="fs-5 mb-5">
                      Untuk calon pendaftar bisa mendaftar melalui website ini
                      {sekolah?.id === 9487 || sekolah?.id === 9489
                        ? ""
                        : " atau langsung datang ke tempat pendaftaran."}
                    </p>
                  )}
                </div>
              </div>

              {sekolah?.id !== 70 && (
                <div className="row justify-content-center">
                  <div className="col-md-4 d-flex flex-column">
                    <Link href={`${ppdbURL}/login`}>
                      <a
                        className="btn btn-ss btn-light rounded-pill fw-extrabold color-primary fs-4"
                      >
                        Daftar
                      </a>
                    </Link>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-md-12">
                  {
                    sekolah?.id === 70
                      ? <img
                        src="/img/ppdb-landing-page-suluh.png"
                        alt=""
                        className="img-fluid"
                        width="1024px"
                        top="1000px"

                      />
                      : <img
                        src="/img/ppdb-landing-page-illustration.png"
                        alt=""
                        className="img-fluid mt-5"
                        width="772px"
                      />
                  }
                </div>

              </div>
            </div>
          </div>
        </section>

        {sekolah.id == 17 ? (
          <section id="pengumuman">
            <div className="container py-5">
              <h1 className="color-dark fw-extrabold title-page position-relative mb-5">
                Pengumuman
              </h1>

              <div className="py-4">
                <h4 className="fw-bold">PENGUMUMAN 1</h4>
                <p className="mb-0 fs-5 fw-semibold">
                  Bagi Calon Peserta Didik yang telah mendaftar{" "}
                  {sekolah?.tingkat == "kampus"
                    ? "Pendaftaran Mahasiswa"
                    : "PPDB"}{" "}
                  Online SMA, Silakan cek nama Anda pada Jalur yang dipilih pada
                  saat pendaftaran. Nama yang tercantum pada daftar tersebut
                  dinyatakan DITERIMA sebagai Calon peserta Didik Baru Kelas X
                  SMA Negeri 1 Jatinom Tahun Pelajaran 2021/2022
                </p>
                <ol>
                  {jalur?.map((d) => {
                    return (
                      <li>
                        <button onClick={() => setJalurId(d?.id)}>
                          {d?.nama}
                        </button>
                      </li>
                    )
                  })}

                </ol>
              </div>

              <div className="py-4">
                <h4 className="fw-bold">PENGUMUMAN 2</h4>
                <p className="mb-0 fs-5 fw-semibold">
                  Selamat bagi calon Peserta Didik yang dinyatakan DITERIMA di
                  SMA Negeri 1 Jatinom sebagai Siswa kelas X Tahun Pelajaran
                  2021/2022,, Selamat bergabung semoga bisa menyesuaikan dengan
                  peraturan yang ada di SMA N 1 JATINOM.
                </p>
              </div>

              <div className="py-4 text-break">
                <h4 className="fw-bold">PENGUMUMAN 3</h4>
                <p className="mb-0 fs-5 fw-semibold">
                  Bagi Calon peserta Didik Yang Dinyatakan Diterima sebagai
                  siswa baru SMA N 1 Jatinom Untuk Informasi Pelakasanaan DAFTAR
                  ULANG pada tanggal 28 Juni 2020 - 2 Juli 2021, Calon peserta
                  didik untuk bisa bergabung pada SALAH SATU grup WA untuk
                  memudahkan penyampaian Informasi selanjutnya melalui Link
                  berikut
                </p>
                <p>Grup 1</p>
                <p>
                  <a href="https://chat.whatsapp.com/FjMPEuS371I8v7CWSpI0RG">
                    {" "}
                    https://chat.whatsapp.com/FjMPEuS371I8v7CWSpI0RG
                  </a>
                </p>
                <p>Grup 2</p>
                <p>
                  <a href="https://chat.whatsapp.com/DyzsgzGQT61KRankUkk69Z">
                    {" "}
                    https://chat.whatsapp.com/DyzsgzGQT61KRankUkk69Z
                  </a>
                </p>
                <p>
                  Silahkan pilih salah satu Grup WA tersebut Berkaitan dengan
                  informasi DAFTAR ULANG akan disampaikan melalui Grup Tersebut.
                  Terima Kasih
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section id="alur-pendaftaran">
          <div className="container py-5">
            <div className="row align-items-center mb-5">
              <div className="col-md-7">
                <h1 className="color-dark fw-extrabold title-page position-relative mb-5">
                  Alur Pendaftaran
                </h1>
                <div className="row">
                  <div className="col-md-8">
                    <p className="mb-0 fs-5 fw-semibold">
                      Untuk calon pendaftar bisa mendaftar melalui website ini
                      {sekolah?.id == 9487 || sekolah?.id == 9489
                        ? ""
                        : " atau langsung datang ke tempat pendaftaran."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <img
                  src="/img/ppdb-alur-pendaftaran-section-illustration.png"
                  alt=""
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="row mb-5">
              {alur?.map((d, idx) => {
                return (
                  <div className="col-md-12 position-relative alur-pendaftaran-items pb-5">
                    {sekolah?.id == 70 ? (
                      <div className="row alur-pendaftaran-items-content">
                        <div className="col-md-12">
                          <div className="card card-ss card-alur-pendaftaran p-4 alur-pendaftaran-items-card">
                            <h4 className="color-dark fw-extrabold mb-4 title-border">
                              {d.judul}
                            </h4>
                            <div className="color-dark">
                              <p
                                className=""
                                dangerouslySetInnerHTML={{ __html: d?.deskripsi }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="row alur-pendaftaran-items-content">
                          <div className="col-md-2 d-flex justify-content-center ">
                            <div
                              className="rounded-circle mx-auto bg-very-soft-secondary alur-pendaftaran-items-number d-flex justify-content-center align-items-center"
                              style={{ width: "100px", height: "100px" }}
                            >
                              <div
                                className="rounded-circle bg-primary shadow-primary-ss d-flex align-items-center justify-content-center text-white fw-black fs-3 p-3"
                                style={{ width: "75px", height: "75px" }}
                              >
                                {idx + 1}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-10">
                            <div className="card card-ss card-alur-pendaftaran p-4 alur-pendaftaran-items-card">
                              <h4 className="color-dark fw-extrabold mb-4 title-border">
                                {d.judul}
                              </h4>
                              <div className="color-dark">
                                <p
                                  className=""
                                  dangerouslySetInnerHTML={{ __html: d?.deskripsi }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {idx != alur?.length - 1 && (
                          <span className="alur-pendaftaran-items-stripe position-absolute"></span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="jalur-pendaftaran">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="row mb-4">
                  <div className="col-md-12 text-center">
                    <h1 className="fw-extrabold color-dark mb-2">
                      Jalur Pendaftaran{" "}
                      {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "PPDB"}
                    </h1>
                    <h4 className="color-secondary fw-bold mb-4">
                      Tahun Ajaran{" "}
                      {momentPackage().add(6, "months").format("YYYY")} -{" "}
                      {momentPackage().add(18, "months").format("YYYY")}
                    </h4>
                    <h5 className="color-dark fw-semibold mb-0">
                      Pilih Jalur Pendaftaran dibawah ini untuk melihat{" "}
                      {sekolah?.status == "N" ? "Jadwal " : "Biaya dan Jadwal "}
                      {sekolah?.tingkat == "kampus"
                        ? "Pendaftaran Mahasiswa"
                        : "PPDB"}
                    </h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 d-sm-block d-flex justify-content-center">
                    {/* <ul
                      class="nav nav-pills nav-jalur-pendaftaran mb-3 d-flex justify-content-sm-between justify-content-center align-items-stretch"
                      id="pills-tab"
                      role="tablist"
                    > */}
                    <ul
                      class="nav nav-pills nav-jalur-pendaftaran mb-3 d-flex justify-content-center align-items-stretch"
                      id="pills-tab"
                      role="tablist"
                    >
                      {jalur?.map((d) => {
                        return (
                          <li
                            class="nav-item d-flex align-items-stretch m-4"
                            role="presentation"
                          >
                            <button
                              class={`nav-link mb-4 ${jalurId == d?.id ? "active" : ""
                                }`}
                              onClick={() => setJalurId(d?.id)}
                              id="pills-home-tab"
                              data-bs-toggle="pill"
                              data-bs-target="#pills-home"
                              type="button"
                              role="tab"
                              aria-controls="pills-home"
                              aria-selected="true"
                            >
                              {d?.nama}
                            </button>
                          </li>
                        );
                      })}
                      {/* <li
                        class="nav-item d-flex align-items-stretch"
                        role="presentation"
                      >
                        <button
                          class="nav-link mb-4"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          Jalur Prestasi Akademik
                        </button>
                      </li>
                      <li
                        class="nav-item d-flex align-items-stretch"
                        role="presentation"
                      >
                        <button
                          class="nav-link mb-4"
                          id="pills-contact-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-contact"
                          type="button"
                          role="tab"
                          aria-controls="pills-contact"
                          aria-selected="false"
                        >
                          Jalur Bidik Misi
                        </button>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
              <section id="biaya">
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-md-10">
                      <div className="mb-4">
                        <h2 className="fw-black color-dark mb-2">
                          {sekolah?.id == 70
                            ? "Ketentuan Pendaftaran"
                            : "Biaya"}{" "}
                          {currentJalur?.nama}
                        </h2>
                        {/* <p className="fs-18-ss color-dark mb-0">
                        Berikut ini jadwal yang akan dilaksanakan jika memilih{" "}
                        {currentJalur?.nama}.
                      </p> */}
                      </div>
                      {currentJalur?.informasi?.map((d, idx) => {
                        if (d?.tipe == "biaya") {
                          const biaya = JSON.parse(d?.biaya);
                          return (
                            <div className="col-md-12 mb-4">
                              <div className="card card-ss card-biaya-pendaftaran p-0 mb-3">
                                <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                                  <h4 className="fw-extrabold color-dark mb-0 mt-1">
                                    {d?.nama}
                                  </h4>
                                  <div
                                    className={`btn-collapse ${collapseOpen[idx + 1] ? "active" : ""
                                      }`}
                                    onClick={() =>
                                      setcollapseOpen({
                                        ...collapseOpen,
                                        [idx + 1]: !collapseOpen[idx + 1],
                                      })
                                    }
                                  >
                                    <a
                                      data-bs-toggle="collapse"
                                      href={`#faq-${idx + 1}`}
                                      role="button"
                                      aria-expanded="false"
                                      aria-controls={`faq-${idx + 1}`}
                                    >
                                      <span
                                        class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                      >
                                        <img
                                          className="dropdown"
                                          src="/img/arrow-bottom.svg"
                                          alt=""
                                        />
                                      </span>
                                    </a>
                                  </div>
                                </div>

                                <div class="collapse" id={`faq-${idx + 1}`}>
                                  <hr className="mb-4 mt-0" />
                                  <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                                    <table className="w-100">
                                      {biaya?.map((e) => (
                                        <tr className="mb-3">
                                          <td>
                                            <div className="d-flex align-items-center mb-3">
                                              <img
                                                src="/img/list-secondary.svg"
                                                alt=""
                                              />
                                              <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                                {e?.nama}
                                              </h4>
                                            </div>
                                          </td>
                                          <td>
                                            <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                              {currencyFormatter(e?.biaya)}
                                            </h4>
                                          </td>
                                        </tr>
                                      ))}
                                      {/* <tr className="mb-3">
                                        <td>
                                          <div className="d-flex align-items-center mb-3">
                                            <img
                                              src="/img/list-secondary.svg"
                                              alt=""
                                            />
                                            <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                              Teknik Elektronika
                                            </h4>
                                          </div>
                                        </td>
                                        <td>
                                          <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                            Rp 20.000.00,-
                                          </h4>
                                        </td>
                                      </tr>
                                      <tr className="mb-3">
                                        <td>
                                          <div className="d-flex align-items-center mb-3">
                                            <img
                                              src="/img/list-secondary.svg"
                                              alt=""
                                            />
                                            <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                              Teknik Elektronika
                                            </h4>
                                          </div>
                                        </td>
                                        <td>
                                          <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                            Rp 20.000.00,-
                                          </h4>
                                        </td>
                                      </tr> */}
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="col-md-12 mb-4">
                              <div className="card card-ss card-biaya-pendaftaran p-0 mb-3">
                                <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                                  <h4 className="fw-extrabold color-dark mb-0 mt-1">
                                    {d?.nama}
                                  </h4>
                                  <div
                                    className={`btn-collapse ${collapseOpen[idx + 1] ? "active" : ""
                                      }`}
                                    onClick={() =>
                                      setcollapseOpen({
                                        ...collapseOpen,
                                        [idx + 1]: !collapseOpen[idx + 1],
                                      })
                                    }
                                  >
                                    <a
                                      data-bs-toggle="collapse"
                                      href={`#faq-${idx + 1}`}
                                      role="button"
                                      aria-expanded="false"
                                      aria-controls={`faq-${idx + 1}`}
                                    >
                                      <span
                                        class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                      >
                                        <img
                                          className="dropdown"
                                          src="/img/arrow-bottom.svg"
                                          alt=""
                                        />
                                      </span>
                                    </a>
                                  </div>
                                </div>

                                <div class="collapse" id={`faq-${idx + 1}`}>
                                  <hr className="mb-4 mt-0" />
                                  <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: d?.deskripsi,
                                      }}
                                    ></p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section id="jadwal" className="py-5">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <div className="mb-4">
                      <h2 className="fw-black color-dark mb-2">
                        Jadwal {currentJalur?.nama}
                      </h2>
                      <p className="fs-18-ss color-dark mb-0">
                        Berikut ini jadwal yang akan dilaksanakan jika memilih{" "}
                        {currentJalur?.nama}.
                      </p>
                    </div>
                    <div className="col-md-12 mb-4">
                      {currentJalur?.gelombang?.map((d, idx) => {
                        return (
                          <div className="card card-ss card-jadwal-pendaftaran p-0 mb-4">
                            {/* <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4"> */}
                            <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-center px-4 py-4">
                              <div className="div">
                                <h4 className="fw-bold color-dark mb-1">
                                  {d?.nama}
                                </h4>
                                <div className="d-flex">
                                  <div
                                    className={checkJadwalJalurGelombang(
                                      d?.keterangan
                                    )}
                                    style={{ width: "15px", height: "15px" }}
                                  ></div>
                                  <h6 className="fw-extrabold color-secondary mb-0">
                                    {d?.keterangan}
                                  </h6>
                                </div>
                              </div>
                              <div
                                className={`btn-collapse ${collapseOpenGelombang[idx + 1] ? "active" : ""
                                  }`}
                                onClick={() =>
                                  setcollapseOpenGelombang({
                                    ...collapseOpenGelombang,
                                    [idx + 1]: !collapseOpenGelombang[idx + 1],
                                  })
                                }
                              >
                                <a
                                  data-bs-toggle="collapse"
                                  href={"#gelombangPpdb" + d?.id}
                                  role="button"
                                  aria-expanded="false"
                                  aria-controls={"gelombangPpdb" + d?.id}
                                >
                                  <span
                                    class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                                    style={{ width: "40px", height: "40px" }}
                                  >
                                    <img
                                      className="dropdown"
                                      src="/img/arrow-bottom.svg"
                                      alt=""
                                    />
                                  </span>
                                </a>
                              </div>
                              {/* {d?.keterangan == "Daftar" && (
                                <div>
                                  <Link href={`${ppdbURL}/login`}>
                                    <div
                                      className={checkGelombang(d?.keterangan)}
                                    >
                                      {d?.keterangan}
                                    </div>
                                  </Link>
                                </div>
                              )}
                              {d?.keterangan != "Daftar" && (
                                <div>
                                  <div
                                    className={checkGelombang(d?.keterangan)}
                                  >
                                    {d?.keterangan}
                                  </div>
                                </div>
                              )} */}
                            </div>

                            <div class="collapse" id={"gelombangPpdb" + d?.id}>
                              <hr className="mb-4 mt-0" />
                              <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                                <table className="w-100">
                                  <tr className="mb-3">
                                    <td>
                                      <div className="d-flex align-items-center mb-3">
                                        <img
                                          src="/img/list-secondary.svg"
                                          alt=""
                                        />
                                        <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                          Pendaftaran Gelombang
                                        </h4>
                                      </div>
                                    </td>
                                    <td>
                                      <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                        {momentPackage(d?.dibuka)
                                          .startOf("day")
                                          .format("DD MMMM")}{" "}
                                        -{" "}
                                        {momentPackage(d?.ditutup)
                                          .endOf("day")
                                          .format("DD MMMM YYYY")}{" "}
                                      </h4>
                                    </td>
                                  </tr>
                                  {d?.informasi?.map((e) => {
                                    const tanggal =
                                      e?.tipe == "pengumuman"
                                        ? momentPackage(d?.pengumuman).format(
                                          "DD MMMM YYYY"
                                        )
                                        : `${momentPackage(e?.dibuka)
                                          .startOf("day")
                                          .format("DD MMMM")}
                                    -
                                    ${momentPackage(e?.ditutup)
                                          .endOf("day")
                                          .format("DD MMMM YYYY")}`;
                                    return (
                                      <tr className="mb-3">
                                        <td>
                                          <div className="d-flex align-items-center mb-3">
                                            <img
                                              src="/img/list-secondary.svg"
                                              alt=""
                                            />
                                            <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                              {e?.nama}
                                            </h4>
                                          </div>
                                        </td>
                                        <td>
                                          <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                            {tanggal}
                                          </h4>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {/* <tr className="mb-3">
                                    <td>
                                      <div className="d-flex align-items-center mb-3">
                                        <img
                                          src="/img/list-secondary.svg"
                                          alt=""
                                        />
                                        <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                          Tes Online
                                        </h4>
                                      </div>
                                    </td>
                                    <td>
                                      <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                        17 April - 20 April 2021
                                      </h4>
                                    </td>
                                  </tr>
                                  <tr className="mb-3">
                                    <td>
                                      <div className="d-flex align-items-center mb-3">
                                        <img
                                          src="/img/list-secondary.svg"
                                          alt=""
                                        />
                                        <h4 className="color-dark fw-semibold fs-18-ss ms-3 mb-0">
                                          Tes Wawancara
                                        </h4>
                                      </div>
                                    </td>
                                    <td>
                                      <h4 className="color-dark fs-18-ss fw-extrabold mb-0 mb-3">
                                        25 April - 29 Desember 2021
                                      </h4>
                                    </td>
                                  </tr> */}
                                </table>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div
            class="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            {/* <section id="biaya">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <div className="mb-4">
                      <h2 className="fw-black color-dark mb-2">
                        Biaya Jalur Seleksi Reguler
                      </h2>
                      <p className="fs-18-ss color-dark mb-0">
                        Berikut ini biaya yang harus dibayarkan jika memilih
                        jalur seleksi reguler
                      </p>
                    </div>
                    <div className="col-md-12 mb-4">
                      <div className="card card-ss card-biaya-pendaftaran p-0">
                        <div className="card-header-ss d-flex justify-content-between align-items-between px-4 py-4">
                          <h4 className="fw-extrabold color-dark mb-0">
                            Biaya Tes Masuk dan Pendaftaran
                          </h4>
                          <a
                            data-bs-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                          >
                            <span
                              class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <img
                                className="dropdown"
                                src="/img/arrow-bottom.svg"
                                alt=""
                              />
                            </span>
                          </a>
                        </div>

                        <div class="collapse" id="collapseExample">
                          <hr className="mb-4 mt-0" />
                          <div
                            class="card-body card-footer-ss pb-4 px-4 pt-0"
                            style={{ minHeight: "150px" }}
                          >
                            Some placeholder content for the collapse component.
                            This panel is hidden by default but revealed when
                            the user activates the relevant trigger.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
          </div>
          <div
            class="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
          >
            ...
          </div>
        </div>

        {/*   
        <div className="container my-5 py-5">
          <h2 className="fw-bold">Alur Pendaftaran</h2>
          <p>
            Untuk calon pendaftar bisa mendaftar melalui website ini atau
            langsung datang ke tempat pendaftaran
          </p>
          <div className="row">
            <div className="col-md-8">
              <div className="d-flex flex-wrap">
                {alur?.map((d, idx) => {
                  return (
                    <button
                      className={`btn p-2 px-3 text-center d-flex align-items-center shadow me-3 mb-3 ${
                        alurIdx == idx
                          ? "btn-primary"
                          : "btn-link text-decoration-none"
                      }`}
                      onClick={() => setAlurIdx(idx)}
                    >
                      <h4 className="fw-bold m-0">{idx + 1}</h4>
                      <span className="fw-light ms-3">{d?.judul}</span>
                    </button>
                  );
                })}
              </div>
              {
                <div
                  className="dangerous-html mt-5"
                  dangerouslySetInnerHTML={{
                    __html: alur?.[alurIdx]?.deskripsi,
                  }}
                />
              }
            </div>
          </div>
        </div>
        <div className="container my-5 py-5" id="jadwal">
          <h2 className="fw-bold">Jadwal Gelombang PPDB</h2>
          {gelombang?.map((d) => {
            return (
              <div className="row justify-content-between align-items-center bg-soft-secondary rounded p-4">
                <div className="col-md-6">
                  <h4 className="fw-bold">{d?.nama}</h4>
                  <span className="d-flex align-items-center">
                    <FaCalendarDay />
                    <span className="ms-2">{`${momentPackage(d?.dibuka).format(
                      "DD MMMM"
                    )} - ${momentPackage(d?.ditutup).format(
                      "DD MMMM YYYY"
                    )}`}</span>
                  </span>
                </div>
                <div className="col-md-2">
                  <div className={checkJadwalJalurGelombang(d?.keterangan)}>
                    {d?.keterangan}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
     */}
      </AnimatePage>
    </Layout>
  );
};

export default IndexPPDBPage;
