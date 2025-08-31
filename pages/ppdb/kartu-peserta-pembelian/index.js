import { ppdbURL } from "client/clientAxios";
import { meSekolah } from "client/SekolahClient";
import StepPPDBPembelian from "components/PPDB/StepPPDBPembelian";
import Navbar from "components/Shared/Navbar/Navbar";
import usePPDB from "hooks/usePPDB";
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

const KartuPesertaPPDB = ({ subnav }) => {
  const { setTerdaftar } = usePPDB();

  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, gelombangPembelian } = gelombangPPDB;
  const namaGelombang = gelombangPembelian?.gelombang?.nama?.toLowerCase();

  const [majors, setMajors] = useState([]);

  const getMajorsData = async () => {
    const { data } = await getMajors();

    if (data) {
      setMajors(data.jurusan);
    }
  };

  const { ta } = useTa();

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

  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navItems = [
    {
      url: `${ppdbURL}/kartu-peserta-pembelian`,
      as: `${ppdbURL}/kartu-peserta-pembelian`,
      text: "Kartu Peserta",
      active: !subnav,
    },
    // {
    //   url: `${ppdbURL}/kartu-peserta?subnav=formulir-pendaftaran`,
    //   as: `${ppdbURL}/kartu-peserta?subnav=formulir-pendaftaran`,
    //   text: "Formulir Pendaftaran",
    //   active: subnav == "formulir-pendaftaran",
    // },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDBPembelian />

          {/* <Navbar nav={navItems} /> */}

          <div className="row gy-4 mb-4">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4">
                  <h4 className="fw-extrabold color-dark title-border mb-5">
                    {!subnav
                      ? "  Cetak Kartu Peserta"
                      : "  Cetak Formulir Pendaftaran"}
                  </h4>
                  <p className="fw-bold color-dark text-center mb-4">
                    Silahkan mencetak{" "}
                    {!subnav ? "kartu peserta" : "formulir pendaftaran"}, lalu
                    simpan untuk melihat hasil pendaftaran
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <Link
                        href={`${ppdbURL}/${
                          !subnav
                            ? "kartu-peserta-pembelian-print"
                            : "formulir-pendaftaran-print"
                        }`}
                      >
                        <a target="_blank">
                          <div className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer">
                            <img src="/img/icon-print.svg" alt="" />
                            <h6 className="color-dark fw-bold ms-4 mb-0">
                              {!subnav
                                ? "  Cetak Kartu Peserta"
                                : "  Cetak Formulir Pendaftaran"}
                            </h6>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>

                  {/* formulir peserta */}
                </div>
              </div>
            </div>
          </div>
          <div className="row gy-4 ff-tahoma">
            {!subnav ? (
              <div className="col-md-12">
                <div className="card card-ss kartu-peserta-ppdb">
                  <div className="border border-secondary-ss">
                    <div className="p-4 d-flex align-items-center justify-content-between">
                      <img
                        src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
                        alt=""
                        height="150px"
                        className="d-md-block d-none"
                      />
                      <div className="text-center fw-bold color-dark text-uppercase">
                        <h5>KARTU PESERTA PENDAFTARAN SISWA BARU </h5>
                        <h5>{sekolah?.nama}</h5>
                        {user?.mSekolahId == 70 && (
                          <h6>{gelombangPembelian?.gelombang?.jalur?.nama}</h6>
                        )}
                        <h5 className="mb-0">
                          TAHUN{" "}
                          {momentPackage().add(6, "months").format("YYYY")} -{" "}
                          {momentPackage().add(18, "months").format("YYYY")}
                        </h5>
                      </div>
                      <img
                        // src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
                        alt=""
                        height="75px"
                        className="d-md-block d-none"
                      />
                    </div>
                    <div className="px-4 py-3 bg-primary text-white">
                      <h5 className="fw-bold text-uppercase mb-0">
                        Data Peserta
                      </h5>
                    </div>
                    <div className="p-4 pb-5">
                      <div className="row">
                        <div className="col-lg-5 d-flex justify-content-lg-start justify-content-center mb-lg-0 mb-4">
                          <img
                            src={user?.avatar}
                            alt=""
                            className="img-fit-cover d-sm-block d-none"
                            width="270px"
                            height="360px"
                          />

                          <img
                            src={user?.avatar}
                            alt=""
                            className="img-fit-cover w-100 d-block d-sm-none"
                            height="360px"
                          />
                        </div>
                        <div className="col-lg-7">
                          <table className="w-100">
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">NOMOR PESERTA</div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {momentPackage().format("YYYY")} -{" "}
                                    {sekolah?.id == 13 ||
                                    sekolah?.id == 14 ||
                                    sekolah?.id == 121 ? (
                                      <>
                                        {padNumber(
                                          gelombang?.findIndex(
                                            (d) =>
                                              d.id ==
                                              gelombangPembelian?.gelombang?.id
                                          ) + 1,
                                          `${
                                            sekolah?.id == 14
                                              ? 2
                                              : gelombang?.length
                                          }`
                                        )}
                                      </>
                                    ) 
                                    : sekolah?.id == 70 ? (
                                      <>
                                        {namaGelombang?.includes("suluh") || namaGelombang?.includes("khusus")
                                          ? "00"
                                          : namaGelombang?.includes("prestasi")
                                          ? "01"
                                          : namaGelombang?.includes("reguler 1")
                                          ? "02"
                                          : namaGelombang?.includes("reguler 2")
                                          ? "03"
                                          : "04"}{" "}
                                          -{" "}
                                          {padNumber(
                                            gelombangAktif?.gelombang?.pendaftar.findIndex(
                                              (d) => d.id == gelombangAktif?.id
                                            ) + 1,
                                            4
                                          )}
                                      </>
                                    ) :
                                    (
                                      <>
                                        {namaGelombang?.includes("khusus")
                                          ? "00"
                                          : namaGelombang?.includes("reguler 1")
                                          ? "01"
                                          : namaGelombang?.includes("reguler 3")
                                          ? "02"
                                          : "03"}
                                      </>
                                    )}{" "}
                                    -{" "}
                                    {padNumber(
                                      gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                        (d) => d.id == gelombangPembelian?.id
                                      ) + 1,
                                      `${gelombangPembelian?.gelombang?.diterima}`
                                        .length
                                    )}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">NISN</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {user?.profil?.nisn || "-"}
                                  </span>
                                </div>
                              </td>
                            </tr> */}
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">NAMA</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">{user?.nama}</span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">WHATSAPP</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {user?.whatsapp || "-"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">ALAMAT</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {user?.profil?.alamat || "-"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">TANGGAL LAHIR</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {getFormatDate(user?.tanggalLahir)}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">TEMPAT</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {user?.tempatLahir}
                                  </span>
                                </div>
                              </td>
                            </tr> */}
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="">ASAL SEKOLAH</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="">
                                  :{" "}
                                  <span className="fw-bold">
                                    {user?.profil?.asalSekolah || "-"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-primary text-white">
                      <h5 className="fw-bold text-uppercase mb-0">
                        Data Seleksi
                      </h5>
                    </div>
                    <div className="p-4 pb-5">
                      <div className="row">
                        <div className="col-lg-12">
                          <table className="w-100">
                            <tr className="color-dark">
                              <td
                                className="text-uppercase"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                <div className="mb-4">Jalur</div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {gelombangPembelian?.gelombang?.nama}
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="">KETERANGAN</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="">
                                  : <span className="fw-bold">-</span>
                                </div>
                              </td>
                            </tr> */}
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-primary text-white">
                      <h5 className="fw-bold text-uppercase mb-0">
                        Pilihan Jurusan
                      </h5>
                    </div>
                    <div className="p-4 pb-5">
                      <div className="row">
                        <div className="col-md-12">
                          <table className="w-100">
                            <tr className="color-dark">
                              <td
                                className="text-uppercase"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                <div className="mb-4">
                                  Pilihan Jurusan 1
                                </div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id ==
                                          gelombangPembelian?.mJurusan1Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td
                                className="text-uppercase"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                <div className="mb-4">
                                  Pilihan Jurusan 2
                                </div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id ==
                                          gelombangPembelian?.mJurusan2Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {/* <tr className="color-dark">
                              <td
                                className="text-uppercase"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                <div className="mb-4">
                                  Pilihan Jurusan 3
                                </div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id ==
                                          gelombangPembelian?.mJurusan3Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td
                                className="text-uppercase"
                                style={{ width: "30%" }}
                              >
                                {" "}
                                <div className="mb-4">
                                  Pilihan Jurusan 4
                                </div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">
                                  :{" "}
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id ==
                                          gelombangPembelian?.mJurusan4Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="">Pilihan Jurusan 5</div>{" "}
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="">
                                  :{" "}
                                  <span className="fw-bold">
                                    {
                                      majors.find(
                                        (d) =>
                                          d.id ==
                                          gelombangPembelian?.mJurusan5Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr> */}
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* <div className="px-4 py-3 bg-primary text-white">
                      <h5 className="fw-bold text-uppercase mb-0">
                        Informasi Lainnya
                      </h5>
                    </div>
                    <div className="p-4 pb-5">
                      <div className="row">
                        <div className="col-md-12">
                          <p className="fs-18-ss color-dark">
                            Pengumuman Kelulusan dapat diakses melalui
                            https://smarteschool.id/kelulusan-ppdb
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="col-md-12">
                  <div className="card card-ss kartu-peserta-ppdb text-center d-flex flex-column align-items-center">
                    <img
                      src={`${sekolah?.logoSs}` || `/img/ss-logo-icon.png`}
                      alt=""
                      style={{ width: "125px", marginBottom: "100px" }}
                    />
                    <h2 className="fw-bold color-dark text-uppercase mb-4">
                      Formulir Pendaftaran Siswa Baru
                    </h2>
                    <h2 className="fw-bold color-dark text-uppercase mb-4">
                      {sekolah?.nama}
                    </h2>
                    <h2
                      className="fw-bold color-dark text-uppercase"
                      style={{ marginBottom: "150px" }}
                    >
                      Tahun {ta?.tahun}
                    </h2>
                    <h4
                      className="fw-bold color-dark text-uppercase"
                      style={{ marginBottom: "150px" }}
                    >
                      JALUR SELEKSI : {gelombangPembelian?.gelombang?.nama}
                    </h4>
                    <h2 className="fw-bold color-dark text-uppercase mb-4">
                      NAMA : {user?.nama}
                    </h2>
                    <h2 className="fw-bold color-dark text-uppercase mb-4">
                      NISN : {user?.profil?.nisn || "-"}
                    </h2>
                    <h2
                                          className="fw-bold color-dark text-uppercase"
                                          style={{ marginBottom: "150px" }}
                                        >
                                          NOMOR PESERTA :{" "}
                                          {sekolah?.id == 14 ||
                                          sekolah?.id == 13 ||
                                          sekolah?.id == 121 ? (
                                            <>
                                              {momentPackage().format("YYYY")} -{" "}
                                              {padNumber(
                                                semuaGelombangPengembalian?.findIndex(
                                                  (d) => d == gelombangAktif?.gelombang?.id
                                                ) + 1,
                                                `2`
                                              )}{" "}
                                              {"-"}{" "}
                                              {padNumber(
                                                gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                                  (d) => d.id == gelombangPembelian?.id
                                                ) + 1,
                                                `${gelombangPembelian?.gelombang?.diterima}`.length
                                              )}
                                            </>
                                          ) : sekolah?.id == 9487 || sekolah?.id == 9489 ? (
                                            <>
                                              REG
                                              {gelombangAktif?.gelombang?.nama?.indexOf("SD") !== -1
                                                ? "SD"
                                                : "MI"}
                                              {padNumber(
                                                gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                  (d) => d.id == gelombangAktif?.id
                                                ) + 1,
                                                `${gelombangAktif?.gelombang?.diterima}`.length
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
                                                      (d) => d.id == gelombangAktif?.gelombang?.id
                                                    ) + 1,
                                                    `${sekolah?.id == 14 ? 2 : gelombang?.length}`
                                                  )}
                                                </>
                                              )  : sekolah?.id == 70 ? (
                                                <>
                                                  {namaGelombang?.includes("suluh") || namaGelombang?.includes("khusus")
                                                    ? "00"
                                                    : namaGelombang?.includes("prestasi")
                                                    ? "01"
                                                    : namaGelombang?.includes("reguler 1")
                                                    ? "02"
                                                    : namaGelombang?.includes("reguler 2")
                                                    ? "03"
                                                    : "04"}{" "}
                                                    -{" "}
                                                    {padNumber(
                                                      gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                        (d) => d.id == gelombangAktif?.id
                                                      ) + 1,
                                                      4
                                                    )}
                                                </>
                                              ) :
                                              (
                                                <>
                                                  {namaGelombang?.includes("khusus")
                                                    ? "00"
                                                    : namaGelombang?.includes("reguler 1")
                                                    ? "01"
                                                    : namaGelombang?.includes("reguler 3")
                                                    ? "02"
                                                    : "03"}{" "}
                                                    -{" "}
                                                    {padNumber(
                                                      gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                        (d) => d.id == gelombangAktif?.id
                                                      ) + 1,
                                                      `${gelombangAktif?.gelombang?.diterima}`.length
                                                    )}
                                                </>
                                              )}
                                            </>
                                          )}
                                        </h2>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card card-ss kartu-peserta-ppdb">
                    <div className="row">
                      <div className="col-md-12 text-center d-flex flex-column align-items-center justify-content-center mb-5">
                        <h2 className="color-dark fw-bold text-uppercase mb-5">
                          Formulir Pendaftaran
                        </h2>
                        <img
                          src={user?.avatar}
                          alt=""
                          className="img-fit-cover d-sm-block d-none"
                          width="270px"
                          height="360px"
                        />
                        <img
                          src={user?.avatar}
                          alt=""
                          className="img-fit-cover w-100 d-block d-sm-none"
                          height="360px"
                        />
                      </div>
                      <div className="col-md-12">
                        <h3 className="color-dark fw-bold text-uppercase mb-5">
                          Data Diri
                        </h3>
                        <table className="w-100">
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                1. NISN
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.nisn || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                2. NOMOR HANDPHONE
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.whatsapp}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                3. NAMA LENGKAP
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.nama}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                4. NAMA PANGGILAN
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.nama}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                5. JENIS KELAMIN
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.genderText}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                6. AGAMA
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.agama}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                7. TEMPAT LAHIR
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.tempatLahir}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                8. TANGGAL LAHIR
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.tanggalLahir}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                9. ALAMAT
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.alamat || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                10. ASAL SEKOLAH
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.asalSekolah || "-"}
                              </h5>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card card-ss kartu-peserta-ppdb">
                    <div className="row">
                      <div className="col-md-12 mb-5">
                        <h3 className="color-dark fw-bold text-uppercase mb-5">
                          Informasi Orang Tua
                        </h3>
                        <table className="w-100">
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                1. NAMA AYAH
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.namaAyah || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                2. PEKERJAAN AYAH
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.pekerjaanAyah || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                3. NOMOR HANDPHONE
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.telpAyah || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                4. ALAMAT AYAH
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.alamatAyah || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                5. NAMA IBU
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.namaIbu || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                6. PEKERJAAN IBU
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.pekerjaanIbu || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                7. NOMOR HANDPHONE
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.telpIbu || "-"}
                              </h5>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                8. ALAMAT IBU
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                :
                              </h5>
                            </td>
                            <td>
                              <h5 className="mb-4 color-dark text-uppercase">
                                {user?.profil?.alamatIbu || "-"}
                              </h5>
                            </td>
                          </tr>
                        </table>
                      </div>
                      {/* <div className="col-md-12 mb-5">
                      <h3 className="color-dark fw-bold text-uppercase mb-5">
                        Informasi Kesehatan
                      </h3>
                      <table className="w-100">
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              1. TINGGI BADAN
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark">
                              {user?.profil?.tb || '-'}cm
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              2. BERAT BADAN
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.bb || '-'}kg
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              3. GOLONGAN DARAH
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.golDarah || '-'}
                            </h5>
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              4. KACAMATA
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.kacamata || '-'}
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              5. BUTA WARNA
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.butaWarna || '-'}
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              6. DISABILITAS
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.disabilitas || '-'}
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              7. SURAT KETERANGAN KESEHATAN
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            {user?.profil?.suratKeteranganSehat ? (
                              <a href={user?.profil?.suratKeteranganSehat}>
                                <h5 className="mb-4 color-dark text-uppercase">
                                  {user?.profil?.suratKeteranganSehat}
                                </h5>
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              8. SURAT KETERANGAN TIDAK BUTA WARNA
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              :
                            </h5>
                          </td>
                          <td>
                            <h5 className="mb-4 color-dark text-uppercase">
                              {user?.profil?.suratKeteranganButaWarna ? (
                                <a
                                  href={user?.profil?.suratKeteranganButaWarna}
                                >
                                  <h5 className="mb-4 color-dark text-uppercase">
                                    {user?.profil?.suratKeteranganButaWarna}
                                  </h5>
                                </a>
                              ) : (
                                "-"
                              )}
                            </h5>
                          </td>
                        </tr>
                      </table>
                    </div> */}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
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

export default KartuPesertaPPDB;
