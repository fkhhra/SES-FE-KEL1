import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { getProfilUser, postProfilUser } from "client/AuthClient";
import { ssURL } from "client/clientAxios";
import { uploadFile } from "client/uploadFileClient";

import useUser from "hooks/useUser";
import toast from "react-hot-toast";

import Link from "next/link";
import LayoutDetail from "components/Layout/LayoutDetail";
import SectionBio from "components/Profil/SectionBio";
import SectionDetailProfil from "components/Profil/SectionDetailProfil";
import SectionInformasiKesehatan from "components/Profil/SectionInformasiKesehatan";
import SectionKartuPelajar from "components/Profil/SectionKartuPelajar";
import SectionKeahlian from "components/Profil/SectionKeahlian";
import SectionKemampuanBahasa from "components/Profil/SectionKemampuanBahasa";
import SectionKontakOrangTua from "components/Profil/SectionKontakOrangTua";
import SectionPendidikan from "components/Profil/SectionPendidikan";
import SectionPengalaman from "components/Profil/SectionPengalaman";
import SectionPortofolio from "components/Profil/SectionPortofolio";
import SectionPrestasiDanSertifikasi from "components/Profil/SectionPrestasiDanSertifikasi";
import SectionUbahEmail from "components/Profil/SectionUbahEmail";
import SectionUbahPassword from "components/Profil/SectionUbahPassword";
import SectionUbahWhatsapp from "components/Profil/SectionUbahWhatsapp";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Avatar from "components/Shared/Avatar/Avatar";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import CardRapor from "components/Profil/CardRapor";
import SectionUbahSekolah from "components/Profil/SectionUbahSekolah";
import SectionSuratKeputusan from "components/Profil/SectionSuratKeputusan";

const index = ({ nav, subnav }) => {
  const { user, setUser } = useUser();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadBanner, setIsUploadBanner] = useState(null);

  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const checkProgress = (uploadProgress) => {
    if (uploadProgress <= 100) {
      setUploadProgress(uploadProgress);
    }
  };

  const uploadFileToServer = async (e, isUploadBanner = false) => {
    setIsUploadBanner(isUploadBanner);
    await uploadFile(e.target.files[0], checkProgress, (fileUrl) => {
      if (fileUrl) {
        setUploadedFile(fileUrl);
      }
    });
  };

  const postProfile = async (isUploadBanner) => {
    const payload = {
      [isUploadBanner ? "home" : "avatar"]: uploadedFile,
    };
    const { data, error } = await postProfilUser(payload);
    if (data) {
      toast.success(data?.message);
      setUser({ ...user, ...payload });
    } else {
      toast.error(error?.message);
    }
    setUploadedFile(null);
    setIsUploadBanner(null);
  };

  useEffect(() => {
    if (uploadedFile) {
      postProfile(isUploadBanner);
    }
  }, [uploadedFile, isUploadBanner]);

  useEffect(() => {
    _getProfil();
  }, []);

  const ProfilLayout = ({ children }) => {
    const navMenus = [
      {
        href: `${ssURL}/profil?nav=tentang`,
        as: `${ssURL}/profil?nav=tentang`,
        text: "Tentang",
        active: nav == "tentang" || !nav,
        isVisible: user?.role != "admin",
        dataJoyride: "tentang",
      },
      {
        href: `${ssURL}/profil?nav=portofolio`,
        as: `${ssURL}/profil?nav=portofolio`,
        text: "Portofolio",
        active: nav == "portofolio",
        isVisible: user?.role != "admin",
        dataJoyride: "portofolio",
      },
      {
        href: `${ssURL}/profil?nav=akun`,
        as: `${ssURL}/profil?nav=akun`,
        text: "Akun",
        active: nav == "akun",
        isVisible: true,
        dataJoyride: "akun",
      },
      {
        href: `${ssURL}/profil?nav=kartu-pelajar`,
        as: `${ssURL}/profil?nav=kartu-pelajar`,
        text: "Kartu Pelajar",
        active: nav == "kartu-pelajar",
        isVisible: user?.role == "siswa",
        dataJoyride: "kartu-pelajar",
      },
      {
        href: `${ssURL}/profil?nav=rapor`,
        as: `${ssURL}/profil?nav=rapor`,
        text: "Rapor",
        active: nav == "rapor",
        isVisible: user?.role == "siswa",
        dataJoyride: "rapor",
      },
      {
        href: `${ssURL}/profil?nav=sekolah`,
        as: `${ssURL}/profil?nav=sekolah`,
        text: "Akun sekolah",
        active: nav == "sekolah",
        isVisible: user?.role == "admin",
        dataJoyride: "sekolah",
      },
      {
        href: `${ssURL}/profil?nav=surat-keputusan`,
        as: `${ssURL}/profil?nav=surat-keputusan`,
        text: "Surat Keputusan",
        active: nav == "surat-keputusan",
        isVisible: user?.role == "guru",
        dataJoyride: "sekolah",
      },
    ];
    return (
      <>
        <LoadingProgress progress={uploadProgress} />
        <div className="row">
          <div className="col-md-12">
            <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mt-3 mb-4 ">
              <img
                src={user?.home || "https://picsum.photos/1920/1080"}
                className="card-img-top card-header-ss img-fit-cover bg-detail-partner-kolaborasi mb-lg-0 mb-3"
              />
              <div className="card-img-overlay p-lg-4 px-3 pt-4">
                <div className="d-flex justify-content-end">
                  <label
                    htmlFor="formFileBanner"
                    className="rounded-circle bg-soft-secondary color-secondary d-flex align-items-center justify-content-center pointer fs-5 shadow-dark-ss"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaCamera />
                  </label>
                </div>
                <input
                  accept="image/*"
                  className="form-control d-none"
                  type="file"
                  id="formFileBanner"
                  onChange={(e) => uploadFileToServer(e, true)}
                ></input>
              </div>
              <div className="name-user-profil p-4 position-relative d-flex justify-content-lg-start justify-content-center text-center">
                <div className="position-absolute img-user-profil">
                  <div className="position-relative rounded-circle border border-5 border-white">
                    <Avatar name={user?.nama} size={120} src={user?.avatar} />
                    <div
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
                        id="formFile"
                        accept="image/*"
                        className="form-control d-none"
                        type="file"
                        onChange={(e) => uploadFileToServer(e, false)}
                      ></input>
                    </div>
                  </div>
                </div>
                <h4 className="fw-extrabold color-dark mb-0">{user?.nama}</h4>
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
    <LayoutDetail
      title={"Profil"}
      modalWrapper={<></>}
      backProps="/smartschool"
    >
      <AnimatePage>
        <ProfilLayout>
          {(nav == "tentang" || !nav) && user?.role != "admin" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionBio />
                </div>

                <div className="col-md-10">
                  <SectionDetailProfil />
                </div>

                <div className="col-md-10">
                  <SectionPendidikan />
                </div>

                <div className="col-md-10">
                  <SectionInformasiKesehatan />
                </div>

                {user?.role == "siswa" || user?.role == "guru" ? (
                  <div className="col-md-10">
                    <SectionKontakOrangTua />
                  </div>
                ) : null}
              </div>
            </>
          )}
          {nav == "portofolio" && user?.role != "admin" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionKeahlian />
                </div>
                <div className="col-md-10">
                  <SectionPengalaman />
                </div>
                <div className="col-md-10">
                  <SectionPrestasiDanSertifikasi />
                </div>
                <div className="col-md-10">
                  <SectionPortofolio />
                </div>
                <div className="col-md-10">
                  <SectionKemampuanBahasa />
                </div>
              </div>
            </>
          )}
          {nav == "akun" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionUbahWhatsapp />
                </div>
                <div className="col-md-10">
                  <SectionUbahPassword />
                </div>
                <div className="col-md-10">
                  <SectionUbahEmail />
                </div>
              </div>
            </>
          )}
          {nav == "sekolah" && user?.role == "admin" ? (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionUbahSekolah />
                </div>
              </div>
            </>
          ) : null}
          {nav == "kartu-pelajar" && user?.role == "siswa" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionKartuPelajar />
                </div>
              </div>
            </>
          )}
          {nav == "rapor" && user?.role == "siswa" && (
            <>
              <h2 className="fw-black mb-4 color-dark">Rapor ( 4 )</h2>
              <CardRapor />
            </>
          )}
          {nav == "surat-keputusan" && user?.role == "guru" && (
            <SectionSuratKeputusan />
          )}
        </ProfilLayout>
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({ query: { nav, subnav } }) {
  return {
    props: {
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}

export default index;
