import { ppdbURL } from "client/clientAxios";
import Navbar from "components/Shared/Navbar/Navbar";
import dynamic from "next/dynamic";
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
import { getFormatDate } from "../../../utilities/HelperUtils";
const Pdf = dynamic(() => import("react-to-pdf"), { ssr: false });

const options = {
  orientation: "potrait",
  unit: "px",
  format: [3508, 2480],
};

const KartuPesertaPPDB = () => {
  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, gelombangAktif } = gelombangPPDB;

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
    }
  };

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const { sekolah } = useSekolah();
  const { user, setUser } = useUser();

  const kartuRef = createRef();
  const formulirRef = createRef();

  const [userView, setUserView] = useState(true);

  useEffect(() => {
    _getGelombangPPDB();
    _getProfil();
    getMajorsData();
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
      active: activeMenu == `${ppdbURL}/kartu-peserta`,
    },
    {
      url: `${ppdbURL}/formulir-pendaftaran`,
      as: `${ppdbURL}/formulir-pendaftaran`,
      text: "Formulir Pendaftaran",
      active: activeMenu == `${ppdbURL}/formulir-pendaftaran`,
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
                    Cetak Kartu Peserta dan Pendaftaran
                  </h4>
                  <p className="fw-bold color-dark text-center mb-4">
                    Silahkan mencetak kartu peserta dan kartu pendaftaran, lalu
                    simpan untuk melihat hasil pendaftaran
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-6">
                      <Pdf
                        options={options}
                        targetRef={kartuRef}
                        filename="Kartu Peserta.pdf"
                      >
                        {({ toPdf }) => (
                          <div
                            className="w-100 rounded-ss bg-soft-primary p-3 d-flex align-items-center justify-content-center pointer"
                            onClick={() => {
                              setUserView(false);
                              setTimeout(() => {
                                toPdf();
                                setUserView(true);
                              }, 1);
                            }}
                          >
                            <img src="/img/icon-print.svg" alt="" />
                            <h6 className="color-dark fw-bold ms-4 mb-0">
                              Cetak Kartu Peserta Pendaftaran
                            </h6>
                          </div>
                        )}
                      </Pdf>
                    </div>
                  </div>

                  {/* formulir peserta */}
                </div>
              </div>
            </div>
          </div>
          {userView ? (
            <div className="row gy-4 ff-tahoma">
              <div className="col-md-12">
                <div className="card card-ss kartu-peserta-ppdb">
                  <div className="border border-secondary-ss">
                    <div className="p-4 d-flex align-items-center justify-content-between">
                      <img
                        src="/img/ss-logo-icon.png"
                        alt=""
                        height="75px"
                        className="d-md-block d-none"
                      />
                      <div className="text-center fw-bold color-dark text-uppercase">
                        <h5>KARTU PESERTA PENDAFTARAN SISWA BARU </h5>
                        <h5>{sekolah?.nama}</h5>
                        <h5 className="mb-0">TAHUN {ta?.tahun}</h5>
                      </div>
                      <img
                        src="/img/ss-logo-icon.png"
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
                                    {gelombangAktif?.id}
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
                                  <span className="fw-bold">{user?.nama}</span>
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
                            </tr>
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
                        <div className="col-lg-7">
                          <table className="w-100">
                            <tr className="color-dark">
                              <td className="text-uppercase">
                                {" "}
                                <div className="mb-4">JALUR</div>{" "}
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
                                <div className="">KETERANGAN</div>
                              </td>
                              <td className="text-uppercase">
                                {" "}
                                <div className="">
                                  : <span className="fw-bold">-</span>
                                </div>
                              </td>
                            </tr>
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
                              <td className="text-uppercase">
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
                                          d.id == gelombangAktif?.mJurusan1Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
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
                                          d.id == gelombangAktif?.mJurusan2Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
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
                                          d.id == gelombangAktif?.mJurusan3Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
                            <tr className="color-dark">
                              <td className="text-uppercase">
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
                                          d.id == gelombangAktif?.mJurusan4Id
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
                                          d.id == gelombangAktif?.mJurusan5Id
                                      )?.nama
                                    }
                                  </span>
                                </div>
                              </td>
                            </tr>
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
              <div className="col-md-12">
                <div className="card card-ss kartu-peserta-ppdb text-center d-flex flex-column align-items-center">
                  <img
                    src="/img/ss-logo-icon.png"
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
                    NOMOR PESERTA : {gelombangAktif?.id}
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
            </div>
          ) : (
            <>
              <div className="row gy-4 ff-tahoma" ref={kartuRef}>
                <div className="col-md-12">
                  <div className="card card-ss kartu-peserta-ppdb">
                    <div className="border border-secondary-ss">
                      <div className="p-4 d-flex align-items-center justify-content-between">
                        <img
                          src="/img/ss-logo-icon.png"
                          alt=""
                          height="75px"
                          className="d-md-block d-none"
                        />
                        <div className="text-center fw-bold color-dark text-uppercase">
                          <h5>KARTU PESERTA PENDAFTARAN SISWA BARU </h5>
                          <h5>{sekolah?.nama}</h5>
                          <h5 className="mb-0">TAHUN {ta?.tahun}</h5>
                        </div>
                        <img
                          src="/img/ss-logo-icon.png"
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
                                      {gelombangAktif?.id}
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
                              </tr>
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
                          <div className="col-lg-7">
                            <table className="w-100">
                              <tr className="color-dark">
                                <td className="text-uppercase">
                                  {" "}
                                  <div className="mb-4">JALUR</div>{" "}
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
                                  <div className="">KETERANGAN</div>
                                </td>
                                <td className="text-uppercase">
                                  {" "}
                                  <div className="">
                                    : <span className="fw-bold">-</span>
                                  </div>
                                </td>
                              </tr>
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
                                <td className="text-uppercase">
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
                                            d.id == gelombangAktif?.mJurusan1Id
                                        )?.nama
                                      }
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              <tr className="color-dark">
                                <td className="text-uppercase">
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
                                            d.id == gelombangAktif?.mJurusan2Id
                                        )?.nama
                                      }
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              <tr className="color-dark">
                                <td className="text-uppercase">
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
                                            d.id == gelombangAktif?.mJurusan3Id
                                        )?.nama
                                      }
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              <tr className="color-dark">
                                <td className="text-uppercase">
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
                                            d.id == gelombangAktif?.mJurusan4Id
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
                                            d.id == gelombangAktif?.mJurusan5Id
                                        )?.nama
                                      }
                                    </span>
                                  </div>
                                </td>
                              </tr>
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
                <div className="col-md-12">
                  <div className="card card-ss kartu-peserta-ppdb text-center d-flex flex-column align-items-center">
                    <img
                      src="/img/ss-logo-icon.png"
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
                      NOMOR PESERTA : {gelombangAktif?.id}
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
                                {user?. || '-'profil?.tb}cm
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
                                    href={
                                      user?.profil?.suratKeteranganButaWarna
                                    }
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
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default KartuPesertaPPDB;
