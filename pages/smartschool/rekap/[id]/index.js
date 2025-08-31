import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";
import { hideModal } from "utilities/ModalUtils";
import { ssURL } from "../../../../client/clientAxios";
import { detailRekap, putPindahRekap } from "../../../../client/RekapClient";
import Layout from "../../../../components/Layout/Layout";
import DaftarRekapTugas from "../../../../components/Rekap/DaftarRekapTugas";
import DaftarRekapUjian from "../../../../components/Rekap/DaftarRekapUjian";
import KelasRekap from "../../../../components/Rekap/KelasRekap";
import KeterampilanPage from "../../../../components/Rekap/KeterampilanPage";
import SikapPage from "../../../../components/Rekap/SikapPage";
import TemplateDeskripsiKeterampilan from "../../../../components/Rekap/TemplateDeskripsiKeterampilan";
import TemplateDeskripsiPengetahuan from "../../../../components/Rekap/TemplateDeskripsiPengetahuan";
import TemplateDeskripsiSikap from "../../../../components/Rekap/TemplateDeskripsiSikap";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import CardHeaderSkeleton from "../../../../components/Shared/Skeleton/CardHeaderSkeleton";
import NavSkeleton from "../../../../components/Shared/Skeleton/NavSkeleton";
import useUser from "../../../../hooks/useUser";

const MemoizedKelasRekap = React.memo(
  ({ rombelKelas, rombel_id, setRombel_id }) => (
    <KelasRekap
      isSikapPage
      rombelKelas={rombelKelas}
      rombel_id={rombel_id}
      setRombel_id={setRombel_id}
    />
  )
);

const RekapSSPageDetail = ({ id, nav, subnav }) => {
  const rombelIds = [];
  const [dataDetailRekap, setdataDetailRekap] = useState({});
  // const [dataSikap, setdataSikap] = useState({});
  const [rombel_id, setRombel_id] = useState();
  const [loading, setLoading] = useState(false);
  const initialStateFormPindah = {
    m_ta_id: "",
  };
  // const [putPindahRekapData, setPutPindahRekapData] = useState();
  const [pindahRekapData, setPindahRekapData] = useState({
    ...initialStateFormPindah,
  });

  const { predikat, rekap, materirombel, sikapsosial, semuaTA } =
    dataDetailRekap;
  // const { rekap, materirombel } = dataSikap;

  const [buttonState, setButtonState] = useState("idle");
  const _getdetailRekap = async () => {
    setLoading(true);
    const { data } = await detailRekap(id);
    if (data) {
      setdataDetailRekap(data);
    }
    setLoading(false);
  };

  const handlePindahTahun = (e) => {
    setPindahRekapData({
      [e.name]: e.value,
      label: e.label,
      idRekap: e.idRekap,
    });
  };

  const _putPindahRekap = async () => {
    const toastloading = toast.loading("Downloading");
    const { data, error } = await putPindahRekap(pindahRekapData?.idRekap, {
      m_ta_id: pindahRekapData.m_ta_id,
    });

    if (data) {
      toast.success(data?.message, { id: toastloading });
      setButtonState("success");
      _getdetailRekap();
      hideModal("modalPindahData");
      // toast.success(data?.message);
    } else {
      setButtonState("error");
      toast.error("Error", { id: toastloading });
    }
  };

  const idRekap = rekap?.id;

  const rekapTugas = rekap?.rekap.filter((d) => {
    return d?.tipe == "tugas";
  });

  const rekapUjian = rekap?.rekap.filter((d) => {
    return d?.tipe == "ujian";
  });
  const keterampilan = rekap?.rekap.filter((d) => {
    return d?.tipe == "keterampilan";
  });
  const daftarSiswa = materirombel?.filter((d) => {
    return d?.rombel?.id == rombel_id;
  });
  const rombelKelas = materirombel
    ?.filter((d) => {
      if (!rombelIds.includes(d.rombel.id)) {
        rombelIds.push(d.rombel.id);
        return true;
      } else {
        return false;
      }
    })
    ?.map((data, idx) => {
      const kelas = data?.rombel?.nama;
      const tingkat = data?.rombel?.tingkat;
      return {
        id: `${data?.rombel?.id}`,
        // url: `${ssURL}/rekap/${idRekap}?nav=sikap&rombel_id=${data?.rombel?.id}`,
        kelas: `${kelas}`,
        tingkat: `${tingkat}`,
        // active: rombel_id == data?.rombel?.id,
      };
    });

  const { user } = useUser();

  useEffect(() => {
    _getdetailRekap();
  }, []);

  const RekapLayout = () => {
    const navMenus = [
      {
        href: `${ssURL}/rekap/[id]?nav=pengetahuan`,
        as: `${ssURL}/rekap/${id}?nav=pengetahuan`,
        text: "Pengetahuan",
        active: nav == "pengetahuan" || !nav,
        isVisible: true,
        dataJoyride: "pengetahuan",
      },
      {
        href: `${ssURL}/rekap/[id]?nav=keterampilan`,
        as: `${ssURL}/rekap/${id}?nav=keterampilan`,
        text: "Keterampilan",
        active: nav == "keterampilan",
        isVisible: user?.role !== "siswa",
        dataJoyride: "keterampilan",
      },
      {
        href: `${ssURL}/rekap/[id]?nav=sikap`,
        as: `${ssURL}/rekap/${id}?nav=sikap`,
        text: "Sikap",
        active: nav == "sikap",
        isVisible: user?.role !== "siswa",
        dataJoyride: "sikap",
      },
      {
        href: `${ssURL}/rekap/[id]?nav=template-deskripsi`,
        as: `${ssURL}/rekap/${id}?nav=template-deskripsi`,
        text: "Template Deskripsi",
        active: nav == "template-deskripsi",
        isVisible: user?.role !== "siswa",
        dataJoyride: "template-deskripsi",
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
              <Link href={`${ssURL}/rekap`}>
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
              {loading ? (
                <div>
                  <CardHeaderSkeleton />
                </div>
              ) : (
                <div
                  className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-md-row flex-column"
                  id="bg-rekap-nilai"
                  style={{ minHeight: "150px" }}
                >
                  <div
                    className="rounded-circle shadow-primary-ss mb-md-0 mb-3"
                    style={{ width: "69px", height: "69px" }}
                  >
                    <img src="/img/icon-rekap-nilai.svg" alt="" />
                  </div>
                  <div className="ms-4">
                    <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                      Rekap Nilai Kelas {rekap?.tingkat}
                    </h2>
                    <p className="fs-6 fw-bold mb-0">
                      {rekap?.mataPelajaran?.nama}
                    </p>
                  </div>
                </div>
              )}
              <div
                className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
                style={{ background: `rgba(244,244,247,0.3)` }}
              >
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {loading ? (
                    <div>
                      <NavSkeleton totalMenu={4} />
                    </div>
                  ) : (
                    navMenus.map((d) => {
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
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const navItemsTemplateDeskripsi = [
    {
      url: `${ssURL}/rekap/[id]?nav=template-deskripsi&subnav=deskripsi-pengetahuan`,
      as: `${ssURL}/rekap/${id}?nav=template-deskripsi&subnav=deskripsi-pengetahuan`,
      text: "Pengetahuan",
      active: subnav == "deskripsi-pengetahuan" || !subnav,
      dataJoyride: "deskripsi-pengetahuan",
    },
    {
      url: `${ssURL}/rekap/[id]?nav=template-deskripsi&subnav=deskripsi-keterampilan`,
      as: `${ssURL}/rekap/${id}?nav=template-deskripsi&subnav=deskripsi-keterampilan`,
      text: "Keterampilan",
      active: subnav == "deskripsi-keterampilan",
      dataJoyride: "deskripsi-keterampilan",
    },
    {
      url: `${ssURL}/rekap/[id]?nav=template-deskripsi&subnav=deskripsi-sikap`,
      as: `${ssURL}/rekap/${id}?nav=template-deskripsi&subnav=deskripsi-sikap`,
      text: "Sikap",
      active: subnav == "deskripsi-sikap",
      dataJoyride: "deskripsi-sikap",
    },
  ];

  const navItemsPengetahuan = [
    {
      url: `${ssURL}/rekap/[id]?nav=pengetahuan&subnav=rekap-tugas`,
      as: `${ssURL}/rekap/${id}?nav=pengetahuan&subnav=rekap-tugas`,
      text: "Rekap Tugas",
      active: subnav == "rekap-tugas" || !subnav,
      dataJoyride: "rekap-tugas",
    },
    {
      url: `${ssURL}/rekap/[id]?nav=pengetahuan&subnav=rekap-ujian-harian`,
      as: `${ssURL}/rekap/${id}?nav=pengetahuan&subnav=rekap-ujian-harian`,
      text: "Rekap Ujian",
      active: subnav == "rekap-ujian-harian",
      dataJoyride: "rekap-ujian-harian",
    },
  ];

  return (
    <Layout isIndex>
      <AnimatePage>
        <RekapLayout></RekapLayout>
        {(!nav || nav == "pengetahuan") && (
          <>
            <Navbar nav={navItemsPengetahuan} />
            {(subnav == undefined || subnav === "rekap-tugas") && (
              <DaftarRekapTugas
                dataRekapTugas={rekapTugas}
                idRekap={id}
                _getDetailRekap={_getdetailRekap}
                rombelKelas={materirombel}
                loading={loading}
                semuaTA={semuaTA}
                handlePindahTahun={handlePindahTahun}
                _putPindahRekap={_putPindahRekap}
                buttonState={buttonState}
                pindahRekapData={pindahRekapData}
              />
            )}
            {subnav == "rekap-ujian-harian" && (
              <>
                <DaftarRekapUjian
                  dataRekapUjian={rekapUjian}
                  idRekap={id}
                  _getDetailRekap={_getdetailRekap}
                  rombelKelas={materirombel}
                  loading={loading}
                  semuaTA={semuaTA}
                  handlePindahTahun={handlePindahTahun}
                  _putPindahRekap={_putPindahRekap}
                  buttonState={buttonState}
                  pindahRekapData={pindahRekapData}
                />
              </>
            )}
          </>
        )}
        {nav == "keterampilan" && (
          <>
            <KeterampilanPage
              dataKeterampilan={keterampilan}
              idRekap={id}
              _getDetailRekap={_getdetailRekap}
              semuaTA={semuaTA}
              handlePindahTahun={handlePindahTahun}
              _putPindahRekap={_putPindahRekap}
              buttonState={buttonState}
              pindahRekapData={pindahRekapData}
            />
          </>
        )}
        {nav == "sikap" && (
          <>
            <div className="row">
              <div className="col-md-12">
                <MemoizedKelasRekap
                  setRombel_id={setRombel_id}
                  rombel_id={rombel_id}
                  rombelKelas={rombelKelas}
                />
              </div>
            </div>
            <SikapPage
              mMateriId={materirombel?.[0]?.mMateriId}
              mRombelId={materirombel?.[0]?.mRombelId}
              mapelId={rekap?.mataPelajaran?.id}
              predikat={predikat}
              daftarSiswa={daftarSiswa}
              rombel_id={rombel_id}
              _getDetailRekap={_getdetailRekap}
              sikapsosial={sikapsosial}
              setRombel_id={setRombel_id}
            />
          </>
        )}
        {nav == "template-deskripsi" && (
          <>
            <Navbar nav={navItemsTemplateDeskripsi} />
            {(subnav == undefined || subnav == "deskripsi-pengetahuan") && (
              <>
                <TemplateDeskripsiPengetahuan
                  dataTemplatePengetahuan={
                    dataDetailRekap?.dataTemplatePengetahuan
                  }
                />
              </>
            )}
            {subnav == "deskripsi-keterampilan" && (
              <>
                <TemplateDeskripsiKeterampilan
                  dataTemplateKeterampilan={
                    dataDetailRekap?.dataTemplateKeterampilan
                  }
                />
              </>
            )}
            {subnav == "deskripsi-sikap" && (
              <>
                <TemplateDeskripsiSikap
                  dataTemplateSikap={dataDetailRekap?.dataTemplateSikap}
                />
              </>
            )}
          </>
        )}
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nav, subnav, rombel_id },
}) {
  return {
    props: {
      id,
      nav: nav || null,
      subnav: subnav || null,
      rombel_id: rombel_id || null,
    },
  };
}

export default RekapSSPageDetail;
