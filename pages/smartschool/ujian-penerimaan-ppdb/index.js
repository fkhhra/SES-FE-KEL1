import { ssURL } from "client/clientAxios";
import { deleteJadwalPPDB, gettJadwalPPDB } from "client/JadwalPPDBClient";
import { getJalurPpdb } from "client/JalurPpdbClient";
import SideNavPPDB from "components/PPDB/SideNavPPDB";
import Navbar from "components/Shared/Navbar/Navbar";
import CardJadwalUjianPenerimaanPPDB from "components/UjianPenerimaanPPDB/CardJadwalUjianPenerimaanPPDB";
import ModalJadwalUjianPenerimaan from "components/UjianPenerimaanPPDB/ModalJadwalUjianPenerimaan";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import swal from "sweetalert";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ nav, subnav }) => {
  const router = useRouter();
  const path = router.pathname;

  const [editData, setEditData] = useState(null);
  const [activeMenu, setActiveMenu] = useState(`/`);
  const [jadwalData, setJadwalData] = useState({});

  const [jalurData, setJalurData] = useState({});
  const { jalur } = jalurData;

  const _getJadwalUjian = async () => {
    const params = { status: subnav };
    const { data, error } = await gettJadwalPPDB(params);

    if (data) {
      setJadwalData(data?.jadwal);
    }
  };

  const _getJalurPPDB = async () => {
    const { data } = await getJalurPpdb();
    if (data) {
      setJalurData(data);
    }
  };

  const handleDeleteJadwalUjianData = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteJadwalPPDB(id);

        if (data) {
          toast.success(data?.message);
          _getJadwalUjian();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const navMenus = [
    {
      href: `${ssURL}/ujian-penerimaan-ppdb`,
      as: `${ssURL}/ujian-penerimaan-ppdb`,
      text: "Jadwal Ujian",
      active: path == `/smartschool/ujian-penerimaan-ppdb`,
      isVisible: true,
      dataJoyride: "Jadwal Ujian",
    },
    {
      href: `${ssURL}/ujian-penerimaan-ppdb/soal`,
      as: `${ssURL}/ujian-penerimaan-ppdb/soal`,
      text: "Bank Soal",
      active: path == `/smartschool/ujian-penerimaan-ppdb/soal`,
      isVisible: true,
      dataJoyride: "Bank Soal",
    },
  ];

  const navItems = [
    {
      url: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=berlangsung`,
      as: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=berlangsung`,
      text: "Berlangsung",
      active: subnav == "berlangsung" || subnav == undefined,
      dataJoyride: "jadwal-berlangsung",
    },
    {
      url: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=akan-datang`,
      as: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=akan-datang`,
      text: "Akan Datang",
      active: subnav == "akan-datang",
      dataJoyride: "jadwal-akan-datang",
    },
    {
      url: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=sudah-selesai&page=1`,
      as: `${ssURL}/ujian-penerimaan-ppdb?nav=jadwal&subnav=sudah-selesai&page=1`,
      text: "Sudah Selesai",
      active: subnav == "sudah-selesai",
      dataJoyride: "jadwal-sudah-selesai",
    },
  ];

  const SubNavbarJadwalUjian = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <button
                className="btn btn-primary bg-gradient-primary shadow-primary-ss fw-bold py-3 rounded-pill btn-ss"
                data-bs-toggle="modal"
                data-bs-target="#ModalJadwalUjianPenerimaan"
                onClick={() => setEditData(null)}
              >
                <FaPlus className="me-2" />
                Buat Jadwal
              </button>
            ),
          },
        ]}
      />
    </>
  );
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getJadwalUjian();
  }, [subnav]);

  useEffect(() => {
    _getJalurPPDB();
  }, []);

  return (
    <Layout
      modalWrapper={
        <>
          <ModalJadwalUjianPenerimaan
            editData={editData}
            isEdit={editData ? 1 : 0}
            jalur={jalur}
            _getJadwalUjian={_getJadwalUjian}
          />
        </>
      }
    >
      <AnimatePage>
        <div className="row gy-4">
          {/* <div className="col-lg-3 positon-relative">
            <SideNavPPDB ssURL={ssURL} />
          </div> */}

          <div className="col-lg-12">
            {/* Header */}
            <div className="card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4">
              <div
                className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0"
                id="bg-rekap-nilai"
              >
                <div className="rounded-circle shadow-primary-ss">
                  <img src="/img/icon-ujian-ppdb.svg" />
                </div>
                <div className="ms-4">
                  <div className="h2 fw-black color-dark text-capitalize position-relative">
                    Ujian Penerimaan
                  </div>
                </div>
              </div>
              <div
                className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch"
                style={{ background: `rgba(244,244,247,0.3)` }}
              >
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {navMenus.map((d) => {
                    return (
                      d.isVisible && (
                        <Link href={d.href} as={d.as}>
                          <a
                            className={`position-relative text-decoration-none fw-bold px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
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
            {/* Nav Jadwal */}
            <SubNavbarJadwalUjian />
            <div className="row">
              {jadwalData?.data?.map((d) => {
                return (
                  <div className="col-md-12">
                    <CardJadwalUjianPenerimaanPPDB
                      ssURL={ssURL}
                      mediaTes={d?.tipe}
                      data={d}
                      setEditData={setEditData}
                      handleDeleteJadwalUjianData={handleDeleteJadwalUjianData}
                    />
                  </div>
                );
              })}
              {/* <div className="col-md-12">
                <CardJadwalUjianPenerimaanPPDB
                  ssURL={ssURL}
                  mediaTes={"bertemu-langsung"}
                />
              </div>
              <div className="col-md-12">
                <CardJadwalUjianPenerimaanPPDB
                  ssURL={ssURL}
                  mediaTes={"tes-online"}
                />
              </div> */}
              {/* <div className="col-md-12">
                <CardJadwalPenerimaanSmarteschool ssURL={ssURL} />
              </div>
              <div className="col-md-12">
                <CardJadwalPenerimaanBertemuLangsung ssURL={ssURL} />
              </div>
              <div className="col-md-12">
                <CardJadwalPenerimaanDiluarSmarteschool ssURL={ssURL} />
              </div> */}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;

export async function getServerSideProps({ query: { nav, subnav } }) {
  return {
    props: {
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}
