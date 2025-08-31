import { detailProfilUser, postDetailProfilUser } from "client/AuthClient";
import { ssURL } from "client/clientAxios";
import { uploadFile } from "client/uploadFileClient";
import LayoutDetail from "components/Layout/LayoutDetail";
import CardRapor from "components/Profil/CardRapor";
import SectionBioOrangLain from "components/Profil/ProfilOrangLain/SectionBioOrangLain";
import SectionDetailProfilOrangLain from "components/Profil/ProfilOrangLain/SectionDetailProfilOrangLain";
import SectionInformasiKesehatanOrangLain from "components/Profil/ProfilOrangLain/SectionInformasiKesehatanOrangLain";
import SectionKemampuanBahasaOrangLain from "components/Profil/ProfilOrangLain/SectionKemampuanBahasaOrangLain";
import SectionKontakOrangTuaOrangLain from "components/Profil/ProfilOrangLain/SectionKontakOrangTuaOrangLain";
import SectionPendidikanOrangLain from "components/Profil/ProfilOrangLain/SectionPendidikanOrangLain";
import SectionPengalamanOrangLain from "components/Profil/ProfilOrangLain/SectionPengalamanOrangLain";
import SectionPortofolioOrangLain from "components/Profil/ProfilOrangLain/SectionPortofolioOrangLain";
import SectionPrestasiDanSertifikasiOrangLain from "components/Profil/ProfilOrangLain/SectionPrestasiDanSertifikasiOrangLain";
import SectionKartuPelajar from "components/Profil/SectionKartuPelajar";
import SectionKeahlian from "components/Profil/SectionKeahlian";
import SectionUbahEmail from "components/Profil/SectionUbahEmail";
import SectionUbahPassword from "components/Profil/SectionUbahPassword";
import SectionUbahSekolah from "components/Profil/SectionUbahSekolah";
import SectionUbahWhatsapp from "components/Profil/SectionUbahWhatsapp";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Avatar from "components/Shared/Avatar/Avatar";
import LoadingProgress from "components/Shared/LoadingProgress/LoadingProgress";
import useUser from "hooks/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";

const index = ({ nav, subnav, id }) => {
  const { user, setUser } = useUser();

  const [userData, setUserData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploadBanner, setIsUploadBanner] = useState(null);

  const _getProfil = async () => {
    const { data } = await detailProfilUser(id);

    if (data) {
      setUser(data.profil);
      setUserData({ user: data.profil });
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
    const { data, error } = await postDetailProfilUser(id, payload);
    if (data) {
      toast.success(data?.message);
      setUser({ ...user, ...payload });
      _getProfil();
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
        href: `${ssURL}/profil/${id}?nav=tentang`,
        as: `${ssURL}/profil/${id}?nav=tentang`,
        text: "Tentang",
        active: nav == "tentang" || !nav,
        isVisible: userData?.user?.role != "admin" ? true : false,
        dataJoyride: "tentang",
      },
      {
        href: `${ssURL}/profil/${id}?nav=portofolio`,
        as: `${ssURL}/profil/${id}?nav=portofolio`,
        text: "Portofolio",
        active: nav == "portofolio",
        isVisible: userData?.user?.role != "admin" ? true : false,
        dataJoyride: "portofolio",
      },
      {
        href: `${ssURL}/profil/${id}?nav=akun`,
        as: `${ssURL}/profil/${id}?nav=akun`,
        text: "Akun",
        active: nav == "akun",
        isVisible: false && user?.role != "siswa",
        dataJoyride: "akun",
      },
      {
        href: `${ssURL}/profil/${id}?nav=kartu-pelajar`,
        as: `${ssURL}/profil/${id}?nav=kartu-pelajar`,
        text: "Kartu Pelajar",
        active: nav == "kartu-pelajar",
        isVisible: userData?.user?.role == "siswa" ? true : false,
        dataJoyride: "kartu-pelajar",
      },
      {
        href: `${ssURL}/profil/${id}?nav=rapor`,
        as: `${ssURL}/profil/${id}?nav=rapor`,
        text: "Rapor",
        active: nav == "rapor",
        isVisible: userData?.user?.role == "siswa" ? false : false,
        dataJoyride: "rapor",
      },
      {
        href: `${ssURL}/profil/${id}?nav=sekolah`,
        as: `${ssURL}/profil/${id}?nav=sekolah`,
        text: "Akun sekolah",
        active: nav == "sekolah",
        isVisible: userData?.user?.role == "admin" ? true : false,
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
                src={userData?.user?.home || "https://picsum.photos/1920/1080"}
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
                    <Avatar
                      name={userData?.user?.nama}
                      size={120}
                      src={userData?.user?.avatar}
                    />
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
    <LayoutDetail
      title={"Profil"}
      modalWrapper={<></>}
      backProps="/smartschool"
    >
      <AnimatePage>
        <ProfilLayout>
          {(nav == "tentang" || !nav) && userData?.user?.role != "admin" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionBioOrangLain data={userData} id={id} />
                </div>

                <div className="col-md-10">
                  <SectionDetailProfilOrangLain data={userData} id={id} />
                </div>

                <div className="col-md-10">
                  <SectionPendidikanOrangLain data={userData} id={id} />
                </div>

                <div className="col-md-10">
                  <SectionInformasiKesehatanOrangLain data={userData} id={id} />
                </div>

                {userData?.user?.role == "siswa" && (
                  <div className="col-md-10">
                    <SectionKontakOrangTuaOrangLain data={userData} id={id} />
                  </div>
                )}
              </div>
            </>
          )}
          {nav == "portofolio" && userData?.user?.role != "admin" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionKeahlian data={userData} />
                </div>
                <div className="col-md-10">
                  <SectionPengalamanOrangLain data={userData} />
                </div>
                <div className="col-md-10">
                  <SectionPrestasiDanSertifikasiOrangLain data={userData} />
                </div>
                <div className="col-md-10">
                  <SectionPortofolioOrangLain data={userData} />
                </div>
                <div className="col-md-10">
                  <SectionKemampuanBahasaOrangLain data={userData} />
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
          {nav == "sekolah" && userData?.user?.role == "admin" ? (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionUbahSekolah />z
                </div>
              </div>
            </>
          ) : null}
          {nav == "kartu-pelajar" && userData?.user?.role == "siswa" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionKartuPelajar data={userData} />
                </div>
              </div>
            </>
          )}
          {nav == "rapor" && userData?.user?.role == "siswa" && (
            <>
              <h2 className="fw-black mb-4 color-dark">Rapor ( 4 )</h2>
              <CardRapor />
            </>
          )}
        </ProfilLayout>
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  query: { nav, subnav },
  params: { id },
}) {
  return {
    props: {
      nav: nav || null,
      subnav: subnav || null,
      id: id || null,
    },
  };
}

export default index;
