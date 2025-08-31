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

const KartuPesertaPPDB = ({ subnav }) => {
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
    console.log("gelombang:", namaGelombang);
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
      url: `${ppdbURL}/kartu-peserta`,
      as: `${ppdbURL}/kartu-peserta`,
      text: "Kartu Peserta",
      active: !subnav,
    },
    {
      url: `${ppdbURL}/kartu-peserta?subnav=formulir-pendaftaran`,
      as: `${ppdbURL}/kartu-peserta?subnav=formulir-pendaftaran`,
      text: "Formulir Pendaftaran",
      active: subnav == "formulir-pendaftaran",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="container my-5">
          <StepPPDB />

          <Navbar nav={navItems} />

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
                            ? "kartu-peserta-suluh-print"
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
                        src={
                          sekolah?.id == 9487 || sekolah?.id == 9489
                            ? `${sekolah?.logo}`
                            : `${sekolah?.logoSs}` || `/img/ss-logo-icon.png`
                        }
                        alt=""
                        height={sekolah?.id !== 14 ? "75px" : "150px"}
                        className="d-md-block d-none"
                      />
                      <div className="text-center fw-bold color-dark text-uppercase">
                        <h5>KARTU PESERTA PENDAFTARAN SISWA BARU </h5>
                        <h5>{sekolah?.nama}</h5>
                        {user?.mSekolahId == 70 && (
                          <h6>{gelombangAktif?.gelombang?.jalur?.nama}</h6>
                        )}
                        {sekolah?.id == 70 ||
                        sekolah?.id == 9487 ||
                        sekolah?.id == 9489 ? (
                          <h5 className="mb-0">
                            TAHUN{" "}
                            {momentPackage().add(6, "months").format("YYYY")} -{" "}
                            {momentPackage().add(18, "months").format("YYYY")}
                          </h5>
                        ) : (
                          <h5 className="mb-0">
                            TAHUN{" "}
                            {momentPackage().add(0, "months").format("YYYY")} -{" "}
                            {momentPackage().add(6, "months").format("YYYY")}
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
                    <div className="px-4 py-3 bg-primary text-white">
                      <h5 className="fw-bold text-uppercase mb-0">
                        {sekolah?.id == 9489
                          ? "Registrasi Calon Peserta Didik"
                          : "Data Peserta"}
                      </h5>
                    </div>
                    <div className="p-4 pb-5">
                      <div className="row">
                        {sekolah?.id != 9489 && (
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
                        )}
                        {sekolah?.id == 9489 ? (
                          <div className="col-lg-6">
                            <table className="w-100">
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
                                                gelombangAktif?.gelombang?.id
                                            ) + 1,
                                            `2`
                                          )}{" "}
                                          {"-"}{" "}
                                          {padNumber(
                                            gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                              (d) =>
                                                d.id == gelombangPembelian?.id
                                            ) + 1,
                                            `${gelombangPembelian?.gelombang?.diterima}`
                                              .length
                                          )}
                                        </>
                                      ) : sekolah?.id == 9487 ||
                                        sekolah?.id == 9489 ? (
                                        <>
                                          REG
                                          {gelombangAktif?.gelombang?.nama?.indexOf(
                                            "SD"
                                          ) !== -1
                                            ? "SD"
                                            : "MI"}
                                          {padNumber(
                                            gelombangAktif?.gelombang?.pendaftar.findIndex(
                                              (d) => d.id == gelombangAktif?.id
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
                                                    gelombangAktif?.gelombang
                                                      ?.id
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
                                              {namaGelombang?.includes("khusus")
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
                                              (d) => d.id == gelombangAktif?.id
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
                                  <div className="mb-4">NO UJIAN</div>
                                </td>
                                <td className="text-uppercase">
                                  {" "}
                                  <div className="mb-4">
                                    : <span className="fw-bold"></span>
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
                        ) : (
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
                                      {sekolah?.id == 14 ||
                                      sekolah?.id == 13 ||
                                      sekolah?.id == 121 ? (
                                        <>
                                          {momentPackage().format("YYYY")} -{" "}
                                          {padNumber(
                                            semuaGelombangPengembalian?.findIndex(
                                              (d) =>
                                                d ==
                                                gelombangAktif?.gelombang?.id
                                            ) + 1,
                                            `2`
                                          )}{" "}
                                          {"-"}{" "}
                                          {padNumber(
                                            gelombangPembelian?.gelombang?.pendaftar.findIndex(
                                              (d) =>
                                                d.id == gelombangPembelian?.id
                                            ) + 1,
                                            `${gelombangPembelian?.gelombang?.diterima}`
                                              .length
                                          )}
                                        </>
                                      ) : sekolah?.id == 9487 ||
                                        sekolah?.id == 9489 ? (
                                        <>
                                          REG
                                          {gelombangAktif?.gelombang?.nama?.indexOf(
                                            "SD"
                                          ) !== -1
                                            ? "SD"
                                            : "MI"}
                                          {padNumber(
                                            gelombangAktif?.gelombang?.pendaftar.findIndex(
                                              (d) => d.id == gelombangAktif?.id
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
                                                    gelombangAktif?.gelombang
                                                      ?.id
                                                ) + 1,
                                                `${
                                                  sekolah?.id == 14
                                                    ? 2
                                                    : gelombang?.length
                                                }`
                                              )}
                                            </>
                                          ) : sekolah?.id == 70 ? (
                                            <>
                                              {namaGelombang?.includes("suluh") || namaGelombang?.includes("khusus")
                                                ? "00"
                                                : namaGelombang?.includes("prestasi")
                                                ? "01"
                                                : namaGelombang?.includes("reguler 1")
                                                ? "02"
                                                : namaGelombang?.includes("reguler 2")
                                                ? "03"
                                                : "04"}
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
                                                : namaGelombang?.includes(
                                                    "reguler 1"
                                                  )
                                                ? "01"
                                                : namaGelombang?.includes(
                                                    "reguler 3"
                                                  )
                                                ? "02"
                                                : "03"}
                                                {" "}
                                                -{" "}
                                                {padNumber(
                                                  gelombangAktif?.gelombang?.pendaftar.findIndex(
                                                    (d) => d.id == gelombangAktif?.id
                                                  ) + 1,
                                                  `${gelombangAktif?.gelombang?.diterima}`
                                                    .length
                                                )}
                                            </>
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
                              </tr>
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
                                    {sekolah?.id == 14 && `TEMPAT, `}TANGGAL
                                    LAHIR
                                  </div>
                                </td>
                                <td className="text-uppercase">
                                  {" "}
                                  <div className="mb-4">
                                    :{" "}
                                    <span className="fw-bold">
                                      {sekolah?.id == 14 && (
                                        <>
                                          {user?.tempatLahir
                                            ? `${user?.tempatLahir}, `
                                            : `${
                                                user?.profil?.tempatLahir
                                                  ? user?.profil?.tempatLahir
                                                  : ""
                                              }, `}
                                        </>
                                      )}
                                      {user?.tanggalLahir
                                        ? getFormatDate(user?.tanggalLahir)
                                        : "-"}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              {sekolah?.id == 14 ? (
                                <>
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
                                          {user?.profil?.alamat}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              ) : (
                                <>
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
                                  </tr>
                                </>
                              )}
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
                              {(sekolah?.id == 9487 || sekolah?.id == 9489) && (
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
                              )}
                              {sekolah?.id == 70 && (
                                <>
                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="">Tanggal Ujian</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="">
                                        :{" "}
                                        <span className="fw-bold">
                                          {user?.mSekolahId == 70
                                            ? gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ujian
                                                ?.waktuDibuka
                                              ? momentPackage(
                                                  gelombangAktif?.gelombang
                                                    ?.informasi?.[0]?.ujian
                                                    ?.waktuDibuka
                                                ).format(
                                                  "dddd, DD MMMM YYYY HH:mm"
                                                )
                                              : "-"
                                            : gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.dibuka
                                            ? momentPackage(
                                                gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.dibuka
                                              ).format("dddd, DD MMMM YYYY")
                                            : "-"}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="color-dark">
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="">
                                        Keterangan Ujian
                                      </div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="">
                                        :{" "}
                                        <pre
                                          className="fw-bold"
                                          dangerouslySetInnerHTML={{
                                            __html: gelombangAktif?.gelombang
                                              ?.informasi?.[0]?.ujian
                                              ?.keterangan
                                              ? gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.ujian
                                                  ?.keterangan
                                              : "-",
                                          }}
                                        ></pre>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )}
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                    {sekolah?.id != 70 &&
                      sekolah?.id != 9487 &&
                      sekolah?.id != 9489 && (
                        <>
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
                                          {gelombangAktif?.gelombang?.nama}
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
                        </>
                      )}
                    {sekolah?.id == 9487 && (
                      <>
                        <div className="px-4 py-3 bg-primary text-white">
                          <h5 className="fw-bold text-uppercase mb-0">
                            Data Ujian
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
                                    <div className="mb-4">
                                      Kelas IV (Ganjil)
                                    </div>{" "}
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.profil?.semester1}
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
                                      Kelas V (Ganjil)
                                    </div>{" "}
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.profil?.semester2}
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
                                      Kelas VI (Ganjil)
                                    </div>{" "}
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.profil?.semester3}
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
                                      Rata-Rata Kumulatif
                                    </div>{" "}
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {(
                                          ((user?.profil?.semester1
                                            ? parseFloat(
                                                user?.profil?.semester1
                                              )
                                            : 0) +
                                            (user?.profil?.semester2
                                              ? parseFloat(
                                                  user?.profil?.semester2
                                                )
                                              : 0) +
                                            (user?.profil?.semester3
                                              ? parseFloat(
                                                  user?.profil?.semester3
                                                )
                                              : 0)) /
                                          3
                                        ).toFixed(2)}
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
                      </>
                    )}
                    {sekolah?.id == 9489 && (
                      <>
                        <div className="px-4 py-3 bg-primary text-white">
                          <h5 className="fw-bold text-uppercase mb-0">
                            Biodata Calon Peserta Didik
                          </h5>
                        </div>
                        <div className="p-4 pb-5">
                          <div className="row">
                            <div className="col-lg-7">
                              <table className="w-100">
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">NAMA LENGKAP</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.nama || "-"}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">JENIS KELAMIN</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.gender || "-"}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
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
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">NIK</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.profil?.nik || "-"}
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
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">TANGGAL LAHIR</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.tanggalLahir
                                          ? getFormatDate(user?.tanggalLahir)
                                          : "-"}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">NO. HP</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      :{" "}
                                      <span className="fw-bold">
                                        {user?.whatsapp}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">JALUR</div>
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
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-primary text-white">
                          <h5 className="fw-bold text-uppercase mb-0">
                            Materi Tes kemampuan
                          </h5>
                        </div>
                        <div className="p-4 pb-5">
                          <div className="row">
                            <div className="col-lg-4">
                              <table className="w-100">
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">BACA TULIS</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      : <span className="fw-bold"></span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      PRAKTIK IBADAH SHALAT
                                    </div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      : <span className="fw-bold"></span>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="color-dark">
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">DIAGNOSTIK</div>
                                  </td>
                                  <td className="text-uppercase">
                                    {" "}
                                    <div className="mb-4">
                                      : <span className="fw-bold"></span>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 py-3 bg-primary text-white"></div>
                        <div className="p-4 pb-5">
                          <h6 className="fs-16-ss">
                            saya yang bertanda tangan dibawah ini menyatakan
                            bahwa data yang tertera diatas adalah yang
                            sebenarnya.
                          </h6>
                        </div>
                        <div className="d-flex justify-content-between align-items-start px-4 mb-4">
                          <div className="color-dark">
                            <h6 className="fs-16-ss mb-2">Mengetahui,</h6>
                            <h6
                              className="fs-16-ss"
                              style={{ marginBottom: "85px" }}
                            >
                              Panitia PPDB,
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
                              Padang, 13-05-2024
                            </h6>
                            <h6
                              className="fs-16-ss"
                              style={{ marginBottom: "85px" }}
                            >
                              Orang tua/Wali Peserta PPDB
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
                      </>
                    )}

                    {sekolah?.id != 70 &&
                      sekolah?.id != 9489 &&
                      gelombangAktif?.gelombang?.informasi?.[0]?.nama && (
                        <>
                          <div className="px-4 py-3 bg-primary text-white">
                            <h5 className="fw-bold text-uppercase mb-0">
                              Keterangan Ujian
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
                                      <div className="mb-4">Nama</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {
                                            gelombangAktif?.gelombang
                                              ?.informasi?.[0]?.nama
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
                                      <div className="mb-4">Tanggal</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {user?.mSekolahId == 70
                                            ? ""
                                            : gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.dibuka
                                            ? momentPackage(
                                                gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.dibuka
                                              ).format("dddd, DD MMMM YYYY")
                                            : "-"}
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
                                      <div className="mb-4">Waktu</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div className="mb-4">
                                        :{" "}
                                        <span className="fw-bold">
                                          {user?.mSekolahId == 70
                                            ? // gelombangAktif?.gelombang
                                              //     ?.informasi?.[0]?.ujian
                                              //     ?.waktuDibuka
                                              //   ? momentPackage(
                                              //       gelombangAktif?.gelombang
                                              //         ?.informasi?.[0]?.ujian
                                              //         ?.waktuDibuka
                                              //     ).format("HH:mm")
                                              //   : "-"
                                              ""
                                            : gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ujian?.durasi
                                            ? gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ujian
                                                ?.durasi + " Menit"
                                            : user?.mSekolahId == 14 &&
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.dibuka &&
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ditutup
                                            ? `${momentPackage(
                                                gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.dibuka
                                              ).format("HH:ss")} -
                                            ${momentPackage(
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ditutup
                                            ).format("HH:ss")}`
                                            : gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.dibuka &&
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ditutup
                                            ? `${momentPackage(
                                                gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.dibuka
                                              ).format("DD MMMM YYYY HH:ss")} -
                                      ${momentPackage(
                                        gelombangAktif?.gelombang
                                          ?.informasi?.[0]?.ditutup
                                      ).format("DD MMMM YYYY HH:ss")}`
                                            : "-"}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  {gelombangAktif?.gelombang?.informasi?.[0]
                                    ?.ujian?.lokasi ? (
                                    <tr className="color-dark">
                                      <td
                                        className="text-uppercase"
                                        style={{ width: "30%" }}
                                      >
                                        {" "}
                                        <div className="mb-4">Lokasi</div>{" "}
                                      </td>
                                      <td className="text-uppercase">
                                        {" "}
                                        <div className="mb-4">
                                          :{" "}
                                          <span className="fw-bold">
                                            {
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ujian?.lokasi
                                            }
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : gelombangAktif?.gelombang?.informasi?.[0]
                                      ?.ujian?.link ? (
                                    <tr className="color-dark">
                                      <td
                                        className="text-uppercase"
                                        style={{ width: "30%" }}
                                      >
                                        {" "}
                                        <div className="mb-4">Link</div>{" "}
                                      </td>
                                      <td className="text-uppercase">
                                        {" "}
                                        <div className="mb-4">
                                          :{" "}
                                          <span className="fw-bold">
                                            {
                                              gelombangAktif?.gelombang
                                                ?.informasi?.[0]?.ujian?.link
                                            }
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : null}
                                  <tr className="color-dark">
                                    <td
                                      className="text-uppercase align-text-top"
                                      style={{ width: "30%" }}
                                    >
                                      {" "}
                                      <div className="">Keterangan</div>{" "}
                                    </td>
                                    <td className="text-uppercase">
                                      {" "}
                                      <div
                                        className={`${
                                          user?.mSekolahId == 70 ? "d-flex" : ""
                                        }`}
                                      >
                                        :{" "}
                                        {user?.mSekolahId == 70 ? (
                                          <span
                                            className={`fw-bold ${
                                              user?.mSekolahId == 70
                                                ? "ms-1"
                                                : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.ujian
                                                  ?.keterangan,
                                            }}
                                          />
                                        ) : (
                                          <span className="fw-bold">
                                            {gelombangAktif?.gelombang
                                              ?.informasi?.[0]?.ujian?.tipe ==
                                            "langsung"
                                              ? "Tes Langsung"
                                              : gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.ujian
                                                  ?.tipe == "online"
                                              ? "Tes Online"
                                              : gelombangAktif?.gelombang
                                                  ?.informasi?.[0]?.ujian
                                                  ?.tipe == "ss"
                                              ? "Tes Online di Smarteschool"
                                              : ""}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                    {sekolah?.id !== 7789 ||
                      (sekolah?.id != 70 && (
                        <>
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
                                                gelombangAktif?.mJurusan1Id
                                            )?.nama
                                          }
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  {sekolah?.id !== 14 && (
                                    <>
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
                                                    gelombangAktif?.mJurusan2Id
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
                                                    gelombangAktif?.mJurusan3Id
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
                                                    gelombangAktif?.mJurusan4Id
                                                )?.nama
                                              }
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr className="color-dark">
                                        <td className="text-uppercase">
                                          {" "}
                                          <div className="">
                                            Pilihan Jurusan 5
                                          </div>{" "}
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
                                                    gelombangAktif?.mJurusan5Id
                                                )?.nama
                                              }
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
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
                      Tahun {momentPackage().add(6, "months").format("YYYY")} -{" "}
                      {momentPackage().add(18, "months").format("YYYY")}
                    </h2>
                    <h4
                      className="fw-bold color-dark text-uppercase"
                      style={{ marginBottom: "150px" }}
                    >
                      JALUR SELEKSI : {gelombangAktif?.gelombang?.nama}
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
                                {user?.profil?.namaPanggilan
                                  ? user?.profil?.namaPanggilan
                                  : user?.nama}
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
                                {moment(user?.tanggalLahir).format(
                                  "dddd, DD MMMM YYYY"
                                )}
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
