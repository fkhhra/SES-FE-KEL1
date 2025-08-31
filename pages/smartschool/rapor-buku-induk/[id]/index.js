import { getDetailRombel } from "client/RombelClient";
import DaftarNilaiPengetahuanWalas from "components/Rombel/DaftarNilaiPengetahuanWalas";
import DaftarRapor from "components/Rombel/DaftarRapor";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getBukuIndukRapor } from "../../../../client/BukuIndukClient";
import { ssURL } from "../../../../client/clientAxios";
import KKMPage from "../../../../components/BukuInduk/KKMPage";
import TemplateRaporPage from "../../../../components/BukuInduk/TemplateRaporPage";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import useUser from "../../../../hooks/useUser";
import useSekolah from "hooks/useSekolah";

const index = ({ id, nav, subnav, rombel_id }) => {
  const [raporBukuInduk, setraporBukuInduk] = useState({});
  const [loading, setLoading] = useState(true);
  const { sekolah } = useSekolah();
  const { rombel, kategoriMapel, totalMapel } = raporBukuInduk;

  const _getRaporBukuInduk = async () => {
    setLoading(true);
    const { data } = await getBukuIndukRapor(id);
    if (data) {
      setraporBukuInduk(data);
    }
    setLoading(false);
  };

  const { user } = useUser();

  useEffect(() => {
    _getRaporBukuInduk();
  }, []);

  // ======= TIMELINE STATE =======

  // ======= Fitur E-Rapor =======
  const keterangan = rombel?.[0]?.anggotaRombel;

  // ======= USE EFFECT =======

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [nav]);

  const TemplateLayout = ({ children }) => {
    const navMenus = [
      {
        href: `${ssURL}/rapor-buku-induk/[id]?nav=template-rapor`,
        as: `${ssURL}/rapor-buku-induk/${id}?nav=template-rapor`,
        text: "Template Rapor",
        active: nav == "template-rapor" || !nav,
        isVisible: user?.role == "admin",
        dataJoyride: "template-rapor",
      },
      {
        href: `${ssURL}/rapor-buku-induk/[id]?nav=kkm`,
        as: `${ssURL}/rapor-buku-induk/${id}?nav=kkm`,
        text: [9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM",
        active: nav == "kkm",
        isVisible: user?.role == "admin",
        dataJoyride: "kkm",
      },
      {
        href: `${ssURL}/rapor-buku-induk/[id]?nav=semua-nilai`,
        as: `${ssURL}/rapor-buku-induk/${id}?nav=semua-nilai`,
        text: "Semua Nilai",
        active: nav == "semua-nilai" || (!nav && user?.role == "kepsek"),
        isVisible: user?.role == "admin" || user?.role == "kepsek",
        dataJoyride: "semua-nilai",
      },
      {
        href: `${ssURL}/rapor-buku-induk/[id]?nav=lihat-rapor`,
        as: `${ssURL}/rapor-buku-induk/${id}?nav=lihat-rapor`,
        text: "Lihat Rapor",
        active: nav == "lihat-rapor",
        isVisible: user?.role == "admin" || user?.role == "kepsek",
        dataJoyride: "lihat-rapor",
      },
    ];
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div
              className={`${
                user?.role == "guru" && "d-flex justify-content-between"
              }`}
            >
              <Link href={`${ssURL}/rapor-buku-induk`}>
                <a className="text-decoration-none fw-bolder color-primary">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            {/* Card Kelas Start */}
            <div
              className="
            card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4"
            >
              <div
                className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row"
                id="bg-rekap-nilai"
                style={{ minHeight: "150px" }}
              >
                <div
                  className="rounded-circle shadow-primary-ss"
                  style={{ width: "86px", height: "86px" }}
                >
                  <img src="/img/icon-rapor-buku-induk-detail.svg" alt="" />
                </div>
                <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                  <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                    Rapor Kelas {rombel?.[0]?.nama}
                  </h2>
                  <p className="fs-6 fw-bold mb-0">
                    {rombel?.[0]?.jurusan?.nama}
                  </p>
                </div>
              </div>
              <div
                className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
                style={{ background: `rgba(244,244,247,0.3)` }}
              >
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
    <Layout isIndex>
      <AnimatePage>
        <TemplateLayout>
          {((!nav && user?.role == "kepsek") ||
            (nav == "semua-nilai" && user?.role == "kepsek")) && (
            <>
              <DaftarNilaiPengetahuanWalas
                keterangan={keterangan}
                // jadwalMengajar={jadwalMengajar}
                rombel_id={id}
                kkm={kategoriMapel}
                user={user}
                totalMapel={totalMapel}
                getDetailRombelData={_getRaporBukuInduk}
                admin={1}
              />
            </>
          )}
          {(!nav || nav == "template-rapor") && (
            <>
              <TemplateRaporPage
                kategoriMapel={kategoriMapel}
                _getRaporBukuInduk={_getRaporBukuInduk}
                id={id}
              />
            </>
          )}
          {nav == "kkm" && (
            <>
              <KKMPage
                kategoriMapel={kategoriMapel}
                _getRaporBukuInduk={_getRaporBukuInduk}
              />
            </>
          )}
          {nav == "semua-nilai" && (
            <>
              <DaftarNilaiPengetahuanWalas
                keterangan={keterangan}
                // jadwalMengajar={jadwalMengajar}
                rombel_id={id}
                kkm={kategoriMapel}
                user={user}
                totalMapel={totalMapel}
                getDetailRombelData={_getRaporBukuInduk}
                admin={1}
              />
            </>
          )}
          {nav == "lihat-rapor" && (
            <>
              <DaftarRapor
                rombel_id={id}
                keterangan={keterangan}
                jadwalMengajar={id}
                totalMapel={totalMapel}
                kkm={kategoriMapel}
              />
            </>
          )}
        </TemplateLayout>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id }, query: { nav } }) {
  return {
    props: {
      id,
      nav: nav || null,
    },
  };
}

export default index;
