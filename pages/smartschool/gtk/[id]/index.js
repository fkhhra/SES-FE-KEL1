import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCamera, FaFile } from "react-icons/fa";
import toast from "react-hot-toast";
import { getProfilUser, postProfilUser } from "../../../../client/AuthClient";
import { ssURL } from "../../../../client/clientAxios";
import { getRppGuru } from "../../../../client/RppClient";
import { uploadFile } from "../../../../client/uploadFileClient";
import LayoutDetail from "../../../../components/Layout/LayoutDetail";
import SectionBio from "../../../../components/Profil/SectionBio";
import SectionDetailProfil from "../../../../components/Profil/SectionDetailProfil";
import SectionInformasiKesehatan from "../../../../components/Profil/SectionInformasiKesehatan";
import SectionInformasiPendidik from "../../../../components/Profil/SectionInformasiPendidik";
import SectionKeahlian from "../../../../components/Profil/SectionKeahlian";
import SectionKemampuanBahasa from "../../../../components/Profil/SectionKemampuanBahasa";
import SectionPendidikan from "../../../../components/Profil/SectionPendidikan";
import SectionPengalaman from "../../../../components/Profil/SectionPengalaman";
import SectionPortofolio from "../../../../components/Profil/SectionPortofolio";
import SectionPrestasiDanSertifikasi from "../../../../components/Profil/SectionPrestasiDanSertifikasi";
import CardRPP from "../../../../components/RPP/CardRPP";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../../components/Shared/Avatar/Avatar";
import LoadingProgress from "../../../../components/Shared/LoadingProgress/LoadingProgress";
import CardRPPSkeleton from "../../../../components/Shared/Skeleton/CardRRPSkeleton";
import useUser from "../../../../hooks/useUser";
import Navbar from "components/Shared/Navbar/Navbar";
import BukuKerja from "components/RPP/BukuKerja";
import { momentPackage } from "utilities/HelperUtils";
import { getPreviewURL } from "utilities/FileViewer";
import SectionSuratKeputusan from "components/Profil/SectionSuratKeputusan";

const index = ({ nav, id, subnav }) => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);

  const [rppData, setRppData] = useState({});
  const { bukuKerja, userAuthor, sekolah } = rppData;
  const _getRpp = async () => {
    setLoading(true);
    const { data } = await getRppGuru(id);
    if (data) {
      setRppData(data);
    }
    setLoading(false);
  };
  const _getProfil = async () => {
    const { data } = await getProfilUser();

    if (data) {
      setUser(data.profil);
    }
  };

  const navItemsBukuKerja = [
    {
      url: `${ssURL}/gtk/${id}?nav=rpp`,
      as: `${ssURL}/gtk/${id}?nav=rpp`,
      text: "RPP",
      active: !subnav,
      // dataJoyride: "rekap-tugas",
    },
    {
      url: `${ssURL}/gtk/${id}?nav=rpp&subnav=silabus`,
      as: `${ssURL}/gtk/${id}?nav=rpp&subnav=silabus`,
      text: "Silabus",
      active: subnav == "silabus",
      // dataJoyride: "rekap-ujian-harian",
    },
    {
      url: `${ssURL}/gtk/${id}?nav=rpp&subnav=perangkat`,
      as: `${ssURL}/gtk/${id}?nav=rpp&subnav=perangkat`,
      text: "Perangkat Pembelajaran",
      active: subnav == "perangkat",
      // dataJoyride: "rekap-ujian-harian",
    },
    {
      url: `${ssURL}/gtk/${id}?nav=rpp&subnav=modul`,
      as: `${ssURL}/gtk/${id}?nav=rpp&subnav=modul`,
      text: "Modul",
      active: subnav == "modul",
      // dataJoyride: "rekap-ujian-harian",
    },
    {
      url: `${ssURL}/gtk/${id}?nav=rpp&subnav=atp`,
      as: `${ssURL}/gtk/${id}?nav=rpp&subnav=atp`,
      text: "Alur Tujuan Pembelajaran",
      active: subnav == "atp",
      // dataJoyride: "rekap-ujian-harian",
    },
    {
      url: `${ssURL}/gtk/${id}?nav=rpp&subnav=cp`,
      as: `${ssURL}/gtk/${id}?nav=rpp&subnav=cp`,
      text: "Capaian Pembelajaran",
      active: subnav == "cp",
      // dataJoyride: "rekap-ujian-harian",
    },
  ];

  useEffect(() => {
    _getProfil(), _getRpp();
  }, []);

  const ProfilLayout = ({ children }) => {
    const navMenus = [
      {
        href: `${ssURL}/gtk/${id}?nav=tentang`,
        as: `${ssURL}/gtk/${id}?nav=tentang`,
        text: "Tentang",
        active: nav == "tentang" || !nav,
        isVisible:
          user?.role == "admin" || user?.role == "pengawas" ? true : false,
        dataJoyride: "tentang",
      },
      {
        href: `${ssURL}/gtk/${id}?nav=rpp`,
        as: `${ssURL}/gtk/${id}?nav=rpp`,
        text: "RPP",
        active: nav == "rpp",
        isVisible:
          user?.role == "admin" || user?.role == "pengawas" ? true : false,
        dataJoyride: "rpp",
      },
      {
        href: `${ssURL}/gtk/${id}?nav=jurnal-harian`,
        as: `${ssURL}/gtk/${id}?nav=jurnal-harian`,
        text: "Jurnal Harian",
        active: nav == "jurnal-harian",
        isVisible:
          user?.role == "admin" || user?.role == "pengawas" ? true : false,
        dataJoyride: "jurnal-harian",
      },
      {
        href: `${ssURL}/gtk/${id}?nav=laporan-bulanan`,
        as: `${ssURL}/gtk/${id}?nav=laporan-bulanan`,
        text: "Laporan Bulanan",
        active: nav == "laporan-bulanan",
        isVisible:
          user?.role == "admin" || user?.role == "pengawas" ? true : false,
        dataJoyride: "laporan-bulanan",
      },
      {
        href: `${ssURL}/gtk/${id}?nav=surat-keputusan`,
        as: `${ssURL}/gtk/${id}?nav=surat-keputusan`,
        text: "Surat Keputusan",
        active: nav == "surat-keputusan",
        isVisible:
          user?.role == "admin" || user?.role == "pengawas" ? true : false,
        dataJoyride: "surat-keputusan",
      },
    ];
    return (
      <>
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
                    <Avatar
                      name={userAuthor?.nama}
                      size={120}
                      src={userAuthor?.avatar}
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
                  {userAuthor?.nama}
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
      backProps="/smartschool/gtk"
    >
      <AnimatePage>
        <ProfilLayout>
          {(nav == "tentang" || !nav) && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionBio isReadOnly data={{ user: userAuthor }} />
                </div>
                <div className="col-md-10">
                  <SectionDetailProfil isReadOnly data={{ user: userAuthor }} />
                </div>
                <div className="col-md-10">
                  <SectionInformasiPendidik
                    isReadOnly
                    data={{ user: { ...userAuthor, sekolah: sekolah } }}
                  />
                </div>
                <div className="col-md-10">
                  <SectionPendidikan isReadOnly data={{ user: userAuthor }} />
                </div>
                <div className="col-md-10">
                  <SectionPengalaman isReadOnly data={{ user: userAuthor }} />
                </div>
                <div className="col-md-10">
                  <SectionInformasiKesehatan
                    isReadOnly
                    data={{ user: userAuthor }}
                  />
                </div>
                <div className="col-md-10">
                  <SectionPrestasiDanSertifikasi
                    isReadOnly
                    data={{ user: userAuthor }}
                  />
                </div>
                <div className="col-md-10">
                  <SectionPortofolio isReadOnly data={{ user: userAuthor }} />
                </div>
                <div className="col-md-10">
                  <SectionKemampuanBahasa
                    isReadOnly
                    data={{ user: userAuthor }}
                  />
                </div>
              </div>
            </>
          )}
          {nav == "portofolio" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <SectionKeahlian data={{ user: userAuthor }} />
                </div>
              </div>
            </>
          )}
          {nav == "rpp" && (
            <>
              <Navbar nav={navItemsBukuKerja} />
              <BukuKerja
                loading={loading}
                bukuKerja={bukuKerja}
                sekolah={sekolah}
                active={
                  !subnav ||
                  ["silabus", "perangkat", "modul", "cp", "atp"].includes(
                    subnav
                  )
                }
                subnav={subnav}
                userAuthor={userAuthor}
              />
            </>
          )}
          {nav == "laporan-bulanan" && (
            <>
              <div className="row justify-content-center gy-4">
                <div className="col-md-10">
                  <div className="card-ss bg-white shadow-dark-ss card-body rounded-ss w-100 d-flex flex-md-row flex-column p-0 pb-5 ">
                    <div className="col-md-12 ">
                      <div className="card-header py-4 px-0 card-header-ss">
                        <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column mx-lg-4 mx-0">
                          <div className="d-flex justify-content-between mx-lg-0 mx-4">
                            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                              Daftar Laporan Bulanan
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="card-body p-0">
                        <div className="" data-joyride="table-rombel">
                          <table className="table-ss">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Tanggal</th>
                                <th>Detail</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bukuKerja?.lbg?.map((d, idx) => {
                                return (
                                  <tr>
                                    <td data-th="No">{idx + 1}</td>
                                    <td data-th="Nama">
                                      <img
                                        src="/img/icon-file.svg"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        className="me-3"
                                      />
                                      {d?.judul}
                                    </td>
                                    <td data-th="Tanggal">
                                      {momentPackage(d?.deskripsi).format(
                                        "MMMM YYYY"
                                      )}
                                    </td>
                                    <td data-th="Detail">
                                      <a
                                        href={getPreviewURL(d?.lampiran)}
                                        target="_blank"
                                        className="rounded-circle bg-soft-primary mx-md-auto color-secondary btn-link btn p-1"
                                        style={{
                                          height: "30px",
                                          width: "30px",
                                        }}
                                      >
                                        <FaFile />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {nav == "surat-keputusan" && (
            <SectionSuratKeputusan userId={userAuthor?.id} />
          )}
        </ProfilLayout>
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nav, subnav },
}) {
  return {
    props: {
      id,
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}

export default index;
