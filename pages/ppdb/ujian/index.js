import { ppdbURL, ssURL } from "client/clientAxios";
import { getGelombangPPDB } from "client/GelombangPPDB";
import { gettJadwalPPDB } from "client/JadwalPPDBClient";
import { getJalurPpdb } from "client/JalurPpdbClient";
import { postPesertaUjian } from "client/PesertaUjianClient";
import Navbar from "components/Shared/Navbar/Navbar";
import NewModal from "components/Shared/NewModal/NewModal";
import CardJadwalUjianPenerimaanSiswa from "components/UjianPenerimaanPPDB/CardJadwalUjianPenerimaanSiswa";
import usePPDB from "hooks/usePPDB";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import Layout from "../../../components/PPDB/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ nav, subnav }) => {
  const router = useRouter();
  const { terdaftar, setTerdaftar } = usePPDB();

  const path = router.pathname;

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [jadwalData, setJadwalData] = useState({});
  const [checkPembayaran, setCheckPembayaran] = useState(false);
  const [checkPembayaranTintaEmas, setCheckPembayaranTintaEmas] =
    useState(false);
  const [clickDetailJadwalUjian, setClickDetailJadwalUjian] = useState("");

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

  const handleClickMengerjakanUjian = async (detailJadwalUjian) => {
    // setButtonState("loading");
    const { data } = await postPesertaUjian({
      waktu_mulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      // tk_jadwal_ujian_id: detailJadwalUjian?.id,
      // ujian_id: detailJadwalUjian?.jadwalUjian?.mUjianId,
      jadwal_ppdb: detailJadwalUjian?.id,
      pendaftar_id: terdaftar?.gelombangAktif?.id,
    });

    if (data) {
      // setButtonState("success");
      hideModal("modalInstruksiUjian");
      router.push(
        `${ppdbURL}/ujian/${data.pesertaUjian?.peserta?.id || data.id}`
      );
    }
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
      url: `${ppdbURL}/ujian?nav=jadwal&subnav=berlangsung`,
      as: `${ppdbURL}/ujian?nav=jadwal&subnav=berlangsung`,
      text: "Berlangsung",
      active: subnav == "berlangsung" || subnav == undefined,
      dataJoyride: "jadwal-berlangsung",
    },
    {
      url: `${ppdbURL}/ujian?nav=jadwal&subnav=akan-datang`,
      as: `${ppdbURL}/ujian?nav=jadwal&subnav=akan-datang`,
      text: "Akan Datang",
      active: subnav == "akan-datang",
      dataJoyride: "jadwal-akan-datang",
    },
    {
      url: `${ppdbURL}/ujian?nav=jadwal&subnav=sudah-selesai&page=1`,
      as: `${ppdbURL}/ujian?nav=jadwal&subnav=sudah-selesai&page=1`,
      text: "Sudah Selesai",
      active: subnav == "sudah-selesai",
      dataJoyride: "jadwal-sudah-selesai",
    },
  ];

  const SubNavbarJadwalUjian = () => (
    <>
      <Navbar nav={navItems} />
    </>
  );
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getJadwalUjian();
  }, [subnav]);

  const _getGelombangPPDB = async () => {
    const { data } = await getGelombangPPDB();
    if (data) {
      setTerdaftar(data);
    }
  };

  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  useEffect(() => {
    if (terdaftar) {
      const temp = terdaftar?.gelombangAktif?.gelombang?.jalur
        ? JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.reduce(
            (a, b) => {
              if (b?.diverifikasi) {
                return a + b?.nominal;
              } else {
                return a + 0;
              }
            },
            0
          ) < (terdaftar?.gelombangAktif?.gelombang?.jalur?.biaya || 0)
        : true;
      const tempSmkTintaEmas = terdaftar?.gelombangAktif?.gelombang?.jalur
        ? JSON.parse(terdaftar?.gelombangAktif?.pembayaran || "[]")?.length > 0
        : true;
      setCheckPembayaranTintaEmas(tempSmkTintaEmas);
    }
  }, [terdaftar]);

  useEffect(() => {
    _getJalurPPDB();
  }, []);

  return (
    <Layout
      modalWrapper={
        <>
          <NewModal
            modalId="modalInstruksiUjian"
            title={
              <>
                <h4 className="mb-0 fw-extrabold">
                  {clickDetailJadwalUjian?.jadwalUjian?.ujian?.nama} Kelas{" "}
                  {clickDetailJadwalUjian?.jadwalUjian?.ujian?.tingkat}
                </h4>
              </>
            }
            content={
              <>
                <h6 className="fs-18-ss fw-bold color-dark">Instruksi Ujian</h6>
                <ol className="mb-4">
                  <li>
                    Jika memiliki 2 device silahkan scan barcode dibawah ini.
                    Jika tidak, silahkan klik tombol "Masuk Google Meet".
                  </li>
                  <li>Letakan kamera didepan layar ujian.</li>
                  <li>Saat bergabung di Google Meet nyalakan microphone.</li>
                  <li>
                    Jika handphone tidak memiliki aplikasi scanner silahkan
                    download scanner.
                  </li>
                </ol>
                {/* {clickDetailJadwalUjian?.jadwalUjian?.gmeet ? ( */}
                <div className="text-center">
                  <p className="fs-14-ss fw-semibold color-dark">
                    Scan untuk masuk
                  </p>
                  <QRCode
                    value={clickDetailJadwalUjian?.jadwalUjian?.gmeet || ""}
                    size={200}
                  />
                  <p className="text-uppercase fw-bold color-secondary mt-4">
                    ATAU
                  </p>
                  <a
                    href={clickDetailJadwalUjian?.jadwalUjian?.gmeet}
                    target="_blank"
                  >
                    <div className="btn btn-ss btn-success btn-success-ss rounded-pill shadow-success-ss">
                      Masuk Google Meet
                    </div>
                  </a>
                </div>
                {/* ) : null} */}
              </>
            }
            submitButton={
              <ReactiveButton
                // buttonState={buttonState}
                color={"primary"}
                idleText={"Mulai Ujian"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className="text-decoration-none btn btn-primary"
                onClick={() =>
                  handleClickMengerjakanUjian(clickDetailJadwalUjian)
                }
              />
            }
          />
        </>
      }
    >
      <AnimatePage>
        <div className="container my-5">
          <div className="row gy-4">
            {/* Header */}
            {/* <div className="card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4">
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
            </div> */}
            {/* Nav Jadwal */}
            <SubNavbarJadwalUjian />
            <div className="row">
              {jadwalData?.data?.map((d) => {
                return (
                  <div className="col-md-12">
                    <CardJadwalUjianPenerimaanSiswa
                      ssURL={ppdbURL}
                      mediaTes={d?.tipe}
                      data={d}
                      checkPembayaran={checkPembayaran}
                      checkPembayaranTintaEmas={checkPembayaranTintaEmas}
                      setClickDetailJadwalUjian={setClickDetailJadwalUjian}
                      subnav={subnav}
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
