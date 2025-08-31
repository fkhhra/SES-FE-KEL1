import { ppdbURL } from "client/clientAxios";
import { meSekolah } from "client/SekolahClient";
import Navbar from "components/Shared/Navbar/Navbar";
import usePPDB from "hooks/usePPDB";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { createRef, useEffect, useState } from "react";
import { getProfilUser } from "../../../client/AuthClient";
import { getGelombangPPDB } from "../../../client/GelombangPPDB";
import { getMajors } from "../../../client/MajorsClient";
import Layout from "../../../components/PPDB/Layout";
import StepPPDB from "../../../components/PPDB/StepPPDB";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../hooks/useSekolah";
import useTa from "../../../hooks/useTa";
import useUser from "../../../hooks/useUser";
import {
  getFormatDate,
  momentPackage,
  padNumber,
} from "../../../utilities/HelperUtils";
const Pdf = dynamic(() => import("react-to-pdf"), { ssr: false });

const options = {
  orientation: "potrait",
  unit: "px",
  format: [3508, 2480],
};

const PengumumanKelulusan = ({ subnav }) => {
  const { setTerdaftar } = usePPDB();

  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const {
    gelombang,
    gelombangAktif,
    gelombangPembelian,
    semuaGelombangPengembalian,
  } = gelombangPPDB;
  const namaGelombang = gelombangAktif?.gelombang?.nama?.toLowerCase();

  const [majors, setMajors] = useState([]);

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(data.jurusan);
    }
  };

  const { ta } = useTa();
  const { terdaftar } = gelombangPPDB;

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setGelombangPPDB(data);
      setTerdaftar(data);
    }
  };

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const { sekolah, setSekolah } = useSekolah();
  const { user, setUser } = useUser();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const kartuRef = createRef();
  const formulirRef = createRef();

  const [userView, setUserView] = useState(true);

  useEffect(() => {
    _getGelombangPPDB();
    _getProfil();
    getMajorsData();
    getMeSekolahData();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        {momentPackage().format("YYYY-MM-DD HH:mm") >=
        momentPackage("2024-05-22 18:00").format("YYYY-MM-DD HH:mm") ? (
          <div className="container my-5">
            <div className="row gy-4 mb-4">
              <div className="col-md-12">
                <div className="card card-ss">
                  <div className="card-body p-4">
                    {/* <h3
                    className="text-center bg-success p-3 text-white fw-bold mb-4"
                    style={{ borderRadius: "4px" }}
                  >
                    SELAMAT ANDA LULUS TAHAP ADMINISTRASI BERKAS
                  </h3> */}
                    {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
                    terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                      ?.status == "berkasTerkonfirmasi" ? (
                      <>
                        <div className="rounded-ss bg-soft-success p-5 position-relative d-flex justify-content mb-4  d-lg-block">
                          <>
                            <div className="alert-hallo-content-admin">
                              <h1 className="fw-extrabold color-dark text-capitalize mb-1">
                                SELAMAT! ANANDA LULUS TAHAP ADMINISTRASI BERKAS
                              </h1>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                      terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                        ?.status == "menungguSeleksiBerkas" ? (
                      <>
                        <div className="rounded-ss bg-soft-danger p-5 position-relative d-flex justify-content mb-4  d-lg-block">
                          <>
                            <div className="alert-hallo-content-admin">
                              <h1 className="fw-bold color-dark text-capitalize mb-1">
                                MOHON MAAF, ANANDA TIDAK LULUS TAHAP
                                ADMINISTRASI KARENA BELUM MEMENUHI PERSYARATAN
                              </h1>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
                    terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                      ?.status == "lulusSeleksi" ? (
                      <>
                        <div className="rounded-ss bg-soft-success p-5 position-relative d-flex justify-content mb-4 d-lg-block">
                          <>
                            <div className="alert-hallo-content-admin">
                              <h1 className="fw-extrabold color-dark text-capitalize mb-1 text-center">
                                SELAMAT! ANANDA DITERIMA DI MTsN{" "}
                                {sekolah?.id == 9487 ? "1" : "3"} KOTA PADANG
                              </h1>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                      terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                        ?.status == "tidakLulusSeleksi" ? (
                      <>
                        <div className="rounded-ss bg-soft-danger p-5 position-relative d-flex justify-content mb-4  d-lg-block">
                          <>
                            <div className="alert-hallo-content-admin">
                              <h1 className="fw-bold color-dark text-capitalize mb-1 text-center">
                                MOHON MAAF! ANANDA TIDAK DITERIMA{" "}
                                <div>
                                  DI MTsN {sekolah?.id == 9487 ? "1" : "3"} KOTA
                                  PADANG
                                </div>
                              </h1>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                      terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                        ?.status == "cadangan" ? (
                      <>
                        <div className="rounded-ss bg-soft-secondary p-5 position-relative d-flex justify-content mb-4  d-lg-block">
                          <>
                            <div className="alert-hallo-content-admin">
                              <h1 className="fw-bold color-dark text-capitalize mb-1 text-center">
                                CADANGAN, AKAN DIHUBUNGI PANITIA PADA TANGGAL 1
                                JUNI JIKA ADA FORMASI{" "}
                                {/* <div>
                                DI MTsN {sekolah?.id == 9487 ? "1" : "3"} KOTA
                                PADANG
                              </div> */}
                              </h1>
                            </div>
                          </>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
                      (terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                        ?.status == "berkasTerkonfirmasi" ||
                        terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1
                          ?.status == "lulusSeleksi") && (
                        <>
                          {/* <h4 className="fw-extrabold color-dark title-border mb-5">
                            Unduh Pengumuman
                          </h4>
                          <p className="fw-bold color-dark text-center mb-4">
                            Silahkan mengunduh lampiran pengumuman di bawah ini
                          </p>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <a
                                href="/import/pengumuman-kelulusan-mtsn-1-kota-padang.docx"
                                target="_blank"
                              >
                                <div className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer">
                                  <img src="/img/icon-print.svg" alt="" />
                                  <h6 className="color-dark fw-bold ms-4 mb-0">
                                    Unduh Pengumuman
                                  </h6>
                                </div>
                              </a>
                            </div>
                          </div> */}
                          <h4 className="fw-extrabold color-dark title-border mb-5 mt-5">
                            Unduh Biodata Siswa
                          </h4>
                          <p className="fw-bold color-dark text-center mb-4">
                            Silahkan mengunduh lampiran biodata siswa di bawah
                            ini
                          </p>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <a
                                href="/import/biodata-siswa-baru-mtsn-1-kota-padang.docx"
                                target="_blank"
                              >
                                <div className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer">
                                  <img src="/img/icon-print.svg" alt="" />
                                  <h6 className="color-dark fw-bold ms-4 mb-0">
                                    Unduh Biodata SIswa
                                  </h6>
                                </div>
                              </a>
                            </div>
                          </div>
                          <h4 className="fw-extrabold color-dark title-border mb-5 mt-5">
                            Unduh Surat Pernyataan Orang Tua
                          </h4>
                          <p className="fw-bold color-dark text-center mb-4">
                            Silahkan mengunduh lampiran surat pernyataan orang
                            tua di bawah ini
                          </p>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <a
                                href="/import/surat-pernyataan-orang-tua-mtsn-1-kota-padang.docx"
                                target="_blank"
                              >
                                <div className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer">
                                  <img src="/img/icon-print.svg" alt="" />
                                  <h6 className="color-dark fw-bold ms-4 mb-0">
                                    Unduh Surat Pernyataan Orang Tua
                                  </h6>
                                </div>
                              </a>
                            </div>
                          </div>
                          <h4 className="fw-extrabold color-dark title-border mb-5 mt-5">
                            Unduh Surat Pernyataan Pesdik
                          </h4>
                          <p className="fw-bold color-dark text-center mb-4">
                            Silahkan mengunduh lampiran surat pernyataan pesdik
                            di bawah ini
                          </p>
                          <div className="row justify-content-center">
                            <div className="col-md-6">
                              <a
                                href="/import/surat-pernyataan-pesdik-mtsn-1-kota-padang.docx"
                                target="_blank"
                              >
                                <div className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer">
                                  <img src="/img/icon-print.svg" alt="" />
                                  <h6 className="color-dark fw-bold ms-4 mb-0">
                                    Unduh Surat Pernyataan Pesdik
                                  </h6>
                                </div>
                              </a>
                            </div>
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
            {/* {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
              (terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                "berkasTerkonfirmasi" ||
                terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                  "lulusSeleksi") && (
                <>
                  <div className="row gy-4 ff-tahoma">
                    <div className="col-md-12">
                      <div className="card card-ss kartu-peserta-ppdb">
                        <div className="border border-secondary-ss">
                          <div className="p-4 d-flex align-items-center justify-content-between">
                            <img
                              src={
                                sekolah?.id == 9487
                                  ? `${sekolah?.logo}`
                                  : `${sekolah?.logoSs}` ||
                                    `/img/ss-logo-icon.png`
                              }
                              alt=""
                              height={sekolah?.id !== 14 ? "75px" : "150px"}
                              className="d-md-block d-none"
                            />
                            <div className="text-center fw-bold color-dark text-uppercase">
                              <h5>BUKTI MENGIKUTI TES </h5>
                              <h5>CALON PESERTA DIDIK BARU </h5>
                              <h5>{sekolah?.nama}</h5>
                              {sekolah?.id == 70 || sekolah?.id == 9487 ? (
                                <h5 className="mb-0">
                                  TAHUN{" "}
                                  {momentPackage()
                                    .add(6, "months")
                                    .format("YYYY")}{" "}
                                  -{" "}
                                  {momentPackage()
                                    .add(18, "months")
                                    .format("YYYY")}
                                </h5>
                              ) : (
                                <h5 className="mb-0">
                                  TAHUN{" "}
                                  {momentPackage()
                                    .add(0, "months")
                                    .format("YYYY")}{" "}
                                  -{" "}
                                  {momentPackage()
                                    .add(6, "months")
                                    .format("YYYY")}
                                </h5>
                              )}
                            </div>
                            {sekolah?.id === 121 && (
                              <img
                                src="/img/smk-bisa-hebat.png"
                                alt="Logo SMK Bisa Hebat"
                                height="75px"
                                className="d-md-block d-none"
                              />
                            )}
                            {sekolah?.id !== 14 && sekolah?.id !== 121 && (
                              <img
                                src={`${
                                  sekolah?.id == 7789
                                    ? "/img/ppdbannahl/logo-kementerian-agama.png"
                                    : sekolah?.logoSs || `/img/ss-logo-icon.png`
                                } `}
                                alt=""
                                height="75px"
                                className="d-md-block d-none"
                              />
                            )}
                          </div>
                          <div className="px-4 py-3 bg-primary text-white"></div>
                          <div className="p-4 pb-5">
                            <div className="row">
                              <div className="col-lg-12">
                                <table className="w-100">
                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">NAMA</div>
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {user?.nama}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>

                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        NOMOR PENDAFTARAN
                                      </div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {sekolah?.id == 14 ||
                                          sekolah?.id == 13 ||
                                          sekolah?.id == 121 ? (
                                            <>
                                              {momentPackage().format("YYYY")} -{" "}
                                              {padNumber(
                                                semuaGelombangPengembalian?.findIndex(
                                                  (d) =>
                                                    d ==
                                                    gelombangAktif?.gelombang
                                                      ?.id
                                                ) + 1,
                                                `2`
                                              )}{" "}
                                              {"-"}{" "}
                                              {padNumber(
                                                gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                                  (d) =>
                                                    d.id ==
                                                    gelombangPembelian?.id
                                                ) + 1,
                                                `${gelombangPembelian?.gelombang?.diterima}`
                                                  .length
                                              )}
                                            </>
                                          ) : sekolah?.id == 9487 ? (
                                            <>
                                              REG
                                              {gelombangAktif?.gelombang?.nama?.indexOf(
                                                "SD"
                                              ) !== -1
                                                ? "SD"
                                                : "MI"}
                                              {padNumber(
                                                gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                  (d) =>
                                                    d.id == gelombangAktif?.id
                                                ) + 1,
                                                `${gelombangAktif?.gelombang?.diterima}`
                                                  .length
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {momentPackage().format("YYYY")} -{" "}
                                              {sekolah?.id == 13 ||
                                              sekolah?.id == 14 ||
                                              sekolah?.id == 121 ? (
                                                <>
                                                  {padNumber(
                                                    gelombang?.findIndex(
                                                      (d) =>
                                                        d.id ==
                                                        gelombangAktif
                                                          ?.gelombang?.id
                                                    ) + 1,
                                                    `${
                                                      sekolah?.id == 14
                                                        ? 2
                                                        : gelombang?.length
                                                    }`
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  {namaGelombang?.includes(
                                                    "khusus"
                                                  )
                                                    ? "00"
                                                    : namaGelombang?.includes(
                                                        "reguler 1"
                                                      )
                                                    ? "01"
                                                    : namaGelombang?.includes(
                                                        "reguler 3"
                                                      )
                                                    ? "02"
                                                    : "03"}
                                                </>
                                              )}{" "}
                                              -{" "}
                                              {padNumber(
                                                gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                  (d) =>
                                                    d.id == gelombangAktif?.id
                                                ) + 1,
                                                `${gelombangAktif?.gelombang?.diterima}`
                                                  .length
                                              )}
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">Jalur</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {gelombangAktif?.gelombang?.nama}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">ASAL SEKOLAH</div>
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {user?.profil?.asalSekolah || "-"}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <div className="d-flex justify-content-between align-items-start px-4 mb-4">
                                <div className="color-dark">
                                  <h6 className="fs-16-ss mb-2">
                                    Parah penguji
                                  </h6>

                                  <h6
                                    className="fs-16-ss"
                                    style={{ marginBottom: "85px" }}
                                  >
                                    Baca Qur'an
                                  </h6>
                                  <div
                                    className="w-100 mb-1"
                                    style={{
                                      height: "1px",
                                      borderTop: "1.35px dashed #000000",
                                    }}
                                  ></div>
                                </div>

                                <div className="color-dark">
                                  <h6 className="fs-16-ss mb-2">
                                    Parah penguji
                                  </h6>
                                  <h6
                                    className="fs-16-ss"
                                    style={{ marginBottom: "85px" }}
                                  >
                                    Wawancara
                                  </h6>
                                  <h6 className="fs-16-ss mb-0"></h6>
                                  <div
                                    className="w-100 mb-1"
                                    style={{
                                      height: "1px",
                                      borderTop: "1.35px dashed #000000",
                                    }}
                                  ></div>
                                </div>

                                <div className="color-dark">
                                  <h6 className="fs-16-ss mb-2">
                                    Paraf Pengawas
                                  </h6>
                                  <h6
                                    className="fs-16-ss"
                                    style={{ marginBottom: "85px" }}
                                  >
                                    Tes Akademik
                                  </h6>
                                  <h6 className="fs-16-ss mb-0"></h6>
                                  <div
                                    className="w-100 mb-1"
                                    style={{
                                      height: "1px",
                                      borderTop: "1.35px dashed #000000",
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="d-flex justify-content-end align-items-start px-4 mb-4">
                                <div className="">
                                  <h6 className="fs-16-ss mb-2">
                                    Padang, {moment().format("DD")} Mei 2024
                                  </h6>
                                  <h6
                                    className="fs-16-ss"
                                    style={{ marginBottom: "85px" }}
                                  >
                                    Ketua Panitia PPDB
                                  </h6>
                                  {ta?.namaKepsek ? (
                                    <h6 className="fs-16-ss mb-0">
                                      {ta?.namaKepsek}
                                    </h6>
                                  ) : (
                                    <div
                                      className="w-100 mb-1"
                                      style={{
                                        height: "1px",
                                        borderTop: "1.35px dashed #000000",
                                      }}
                                    ></div>
                                  )}
                                  <h6 className="fs-16-ss text-uppercase mb-0">
                                    {sekolah?.id == 33 ? "NUKS." : "NIP."}{" "}
                                    {!ta?.nipKepsek ? `-` : `${ta?.nipKepsek}`}
                                  </h6>
                                </div>
                              </div>
                              <div className="d-flex justify-content-start align-items-start px-4 mb-4">
                                <div className="">
                                  <h6 className="fs-16-ss mb-2">Catatan :</h6>
                                  <h6 className="fs-16-ss">
                                    <span className="fw-bold">Mintalah</span>{" "}
                                    paraf tim Penguji Tes Baca Al Qur'an dan
                                    Wawancara serta Pengawas Tes Akademik
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )} */}
          </div>
        ) : (
          <div className="container my-5">
            <div className="row gy-4 mb-4">
              <div className="col-md-12">
                <div className="card card-ss">
                  <div className="card-body p-4">
                    {/* <h3
                className="text-center bg-success p-3 text-white fw-bold mb-4"
                style={{ borderRadius: "4px" }}
              >
                SELAMAT ANDA LULUS TAHAP ADMINISTRASI BERKAS
              </h3> */}

                    <div className="rounded-ss bg-soft-warning p-5 position-relative d-flex justify-content mb-4  d-lg-block">
                      <>
                        <div className="alert-hallo-content-admin">
                          <h1 className="fw-extrabold color-dark text-capitalize mb-1 text-center">
                            Pengumuman Kelulusan belum dibuka, silahkan buka
                            kembali pukul 18:00 WIB
                          </h1>
                        </div>
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default PengumumanKelulusan;
