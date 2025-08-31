import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import { ssURL } from "../../../../client/clientAxios";
import { getUser } from "../../../../client/UserClient";
import CardProyekKolaborasi from "../../../../components/Kolaborasi/CardProyekKolaborasi";
import Layout from "../../../../components/Layout/Layout";
import SectionBio from "../../../../components/Profil/SectionBio";
import SectionDetailProfil from "../../../../components/Profil/SectionDetailProfil";
import SectionKeahlian from "../../../../components/Profil/SectionKeahlian";
import SectionKemampuanBahasa from "../../../../components/Profil/SectionKemampuanBahasa";
import SectionPendidikan from "../../../../components/Profil/SectionPendidikan";
import SectionPengalaman from "../../../../components/Profil/SectionPengalaman";
import SectionPortofolio from "../../../../components/Profil/SectionPortofolio";
import SectionPrestasiDanSertifikasi from "../../../../components/Profil/SectionPrestasiDanSertifikasi";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../../components/Shared/Avatar/Avatar";
import useSekolah from "../../../../hooks/useSekolah";

const index = ({ userId, nav, subnav }) => {
  // states
  const [userData, setUserData] = useState({});

  // states end

  // fetch start
  const getUserData = async () => {
    const { data, error } = await getUser({
      userId: userId,
    });

    if (data) {
      setUserData(data);
    } else {
      toast.error(error.message);
    }
  };

  // fetch end

  // effects
  useEffect(() => {
    getUserData();
  }, []);

  // effects end

  // nav layout
  const ProfilLayout = ({ children }) => {
    const navMenus = [
      {
        href: `${ssURL}/partner/[id]?nav=tentang`,
        as: `${ssURL}/partner/1?nav=tentang`,
        text: "Tentang",
        active: nav == "tentang" || !nav,
        isVisible: true,
        dataJoyride: "tentang",
      },
      {
        href: `${ssURL}/partner/[id]?nav=proyek`,
        as: `${ssURL}/partner/1?nav=proyek`,
        text: "Proyek",
        active: nav == "proyek",
        isVisible: true,
        dataJoyride: "proyek",
      },
    ];
    return (
      <>
        <div className="row">
          <Link href={`${ssURL}/partner`}>
            <a className="text-decoration-none fw-bolder color-primary">
              <FaChevronLeft />
              <span className="ms-2">Kembali</span>
            </a>
          </Link>
          <div className="col-md-12">
            <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mt-3 mb-4 ">
              <img
                src="https://picsum.photos/1920/1080"
                className="card-img-top card-header-ss img-fit-cover bg-detail-partner-kolaborasi mb-lg-0 mb-3"
              />
              {/* <div className="card-img-overlay p-lg-4 px-3 pt-4">
                <div className="d-flex justify-content-end">
                  <label
                    htmlFor="formFile"
                    className="rounded-circle bg-soft-secondary color-secondary d-flex align-items-center justify-content-center pointer fs-5 shadow-dark-ss"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaCamera />
                  </label>
                </div>
                <input
                  class="form-control d-none"
                  type="file"
                  id="formFile"
                ></input>
              </div> */}
              <div className="name-user-profil p-4 position-relative d-flex justify-content-lg-start justify-content-center text-center">
                <div className="position-absolute img-user-profil">
                  <div className="position-relative rounded-circle border border-5 border-white">
                    <Avatar name={userData?.user?.nama} size={120} />
                    {/* <div
                      className="position-absolute"
                      style={{ bottom: "0", right: "0" }}
                    >
                      <div
                        className="d-flex justify-content-end position-relative"
                        style={{ zIndex: "1" }}
                      >
                        <label
                          htmlFor="formFile"
                          className="rounded-circle bg-soft-secondary color-secondary d-flex align-items-center justify-content-center pointer fs-6 shadow-dark-ss"
                          style={{ width: "30px", height: "30px" }}
                        >
                          <FaCamera />
                        </label>
                      </div>
                      <input
                        class="form-control d-none"
                        type="file"
                        id="formFile"
                      ></input>
                    </div> */}
                  </div>
                </div>
                <h4 className="fw-extrabold color-dark mb-0">
                  {userData?.user?.nama}
                </h4>
              </div>
              <hr className="m-lg-0 mt-0 mb-3" />
              <div className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch">
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {navMenus.map((d) => {
                    return (
                      d.isVisible && (
                        <Link href={d.href} as={d.as}>
                          <a
                            className={`position-relative text-decoration-none fw-bold fs-18-ss px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                              d.active ? "color-primary" : "color-secondary"
                            }`}
                            data-joyride={d.dataJoyride || ""}
                          >
                            {d?.withBadge?.show && (
                              <Badge
                                count={parseInt(d?.withBadge?.text)}
                                className="position-absolute"
                                style={{ top: "-18px", right: "-40px" }}
                              />
                            )}
                            {d.text}
                          </a>
                        </Link>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  };

  return (
    <Layout title={"Profil"} modalWrapper={<></>}>
      <AnimatePage>
        <ProfilLayout>
          {(nav == "tentang" || !nav) && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionBio isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionDetailProfil isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionPendidikan isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionKeahlian isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionPengalaman isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionPrestasiDanSertifikasi isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionPortofolio isReadOnly data={userData} />
                </div>

                <div className="col-md-10">
                  <SectionKemampuanBahasa isReadOnly data={userData} />
                </div>
              </div>
            </>
          )}
          {nav == "proyek" && (
            <>
              <div className="row">
                <div className="col-md-12">
                  <h2 className="fw-black color-dark mb-5">
                    Daftar Proyek (3)
                  </h2>
                </div>
              </div>
              <div className="row gy-4">
                <div className="col-md-3">
                  <CardProyekKolaborasi
                    data={{
                      nama: "Smartschool",
                      deskripsi:
                        "Smartschool adalah sistem yang mengintegrasikan Manajemen Perpustakaan dan Materi Pembelajaran dengan sistim Pengawasan kegiatan belajar/Tugas siswa yang effektif serta terdata, dengan Google Meet dan CCTV yang lebih effektif daripada Tatap Muka.Sistim Ujian Berbasis Komputer yang dilengkapi Kecerdasan Buatan untuk mengeffektifkan pendataan kemandirian siswa/pengawasan ditambah sistim Manajemen Nilai sampai fitur Pelaporan yang memudahkan Guru, Manajemen Sekolah, Orang Tua Murid dan Murid memantau data2 Belajar, Ujian serta Kegiatan terkait lainnya Mengenal Smart E School lebih jauh, cukup klik tautan ini",
                      anggota: "5",
                    }}
                    status="perencanaan-produk"
                  />
                </div>
                <div className="col-md-3">
                  <CardProyekKolaborasi
                    data={{
                      nama: "Aplikasi Smart Green Garden",
                      deskripsi:
                        "Teknologi smart garden berfungsi dan mempunyai manfaat bagi para petani atau pemilik tanaman sekaligus solusi untuk berkomunikasi dengan tanaman. Artinya berkomunikasi dengan tanaman adalah pemilik tanaman mengetahui kondisi tanaman seperti nutrisi dan kebutuhan- kebutuhannya. Terutama dalam penyiraman tanaman.",
                      anggota: "5",
                    }}
                    status="perencanaan-produk"
                  />
                </div>
                <div className="col-md-3">
                  <CardProyekKolaborasi
                    data={{
                      nama: "Pengembangan Game Edukasi",
                      deskripsi:
                        "Proyek kolaborasi ini adalah proyek untuk membuat sebuah aplikasi game edukasi yang bertemakan budaya Indonesia. Disini kita akan membuat game edukasi dengan mengangkat cerita cerita rakyat yang ada di Indonesia.",
                      anggota: "7",
                    }}
                    status="menyusun-jadwal"
                    isPrivat
                  />
                </div>
              </div>
            </>
          )}
        </ProfilLayout>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nav, subnav },
}) {
  return {
    props: {
      userId: id,
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}

export default index;
