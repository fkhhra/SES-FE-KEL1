import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "client/clientAxios";
import { getDetailTimeline } from "client/TimelineClient";
import NavTypeKegiatan from "components/Kelas/NavTypeKegiatan";
import TatapMayaPage from "components/Kelas/TatapMayaPage";
import MateriPage from "components/Kelas/MateriPage";
import TugasPage from "components/Kelas/TugasPage";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import useTugasSiswa from "hooks/useTugasSiswa";
import useUser from "hooks/useUser";
import { getDetailRombel } from "client/RombelClient";
import TugasKuisPage from "components/Kelas/TugasKuisPage";
import SkeletonDetailKegiatan from "components/Kelas/Skeleton/SkeletonDetailKegiatan";
import isEmpty from "lodash/isEmpty";

const index = ({ kegiatanId, kelasId }) => {
  const { user } = useUser();
  const { tugasSiswa, setTugasSiswa } = useTugasSiswa();
  const router = useRouter();

  const [page, setPage] = useState(kegiatanId);

  const hal = router.query.hal;
  const isGuru = user?.role == "guru";

  const [kegiatanData, setKegiatanData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [detailRombel, setDetailRombel] = useState({});

  const [loadingTimeline, setLoadingTimeline] = useState(false);

  const handleBack = () => {
    router.push(`${ssURL}/kelas/${kelasId}/kegiatan`);
  };

  const getType = (timeline) => {
    if (timeline?.tipe === "absen") {
      return "pertemuan"
    } else if (timeline?.tipe === "tugas" && (timeline?.tugas?.soal?.length > 0 || timeline?.timeline?.tugas?.soal?.length > 0)) {
      return "tugas-kuis"
    } else {
      return timeline?.tipe
    }
  }

  const getTuntasStatus = (type, timeline) => {
    switch (type) {
      case "pertemuan":
        return user?.role === "guru" ? (timeline?.meta?.totalAbsen === timeline?.meta?.totalSiswa) : !isEmpty(timeline?.absen);
      case "tugas":
        return user?.role === "guru" ? timeline?.meta?.totalRespon === timeline?.meta?.totalSiswa : timeline?.dikumpulkan === 1;
      case "materi":
        return user?.role === "guru" ? timeline?.meta?.totalSiswa === timeline?.materi?.[0]?.meta?.totalKesimpulan : (timeline?.timeline?.materi?.[0]?.materiKesimpulan?.kesimpulan || false)
      default:
        return false;
    }
  }

  const _getDetailTimeline = async (id, withLoading=true) => {
    withLoading && setLoadingTimeline(true);

    const { data: { timelines, timeline } } = await getDetailTimeline(id ? id : kegiatanId);
    
    if (timelines) {
      const timelinesData = timelines?.map(timeline => {

        const type = getType(timeline);

        return {
          id: timeline?.id,
          type: type,
          ...((type === "tugas" || type === "tugas-kuis") && { judulTugas: timeline?.tugas?.judul || timeline?.timeline?.tugas?.judul }),
          ...(type === "materi" && { judulMateri: timeline?.materi?.[0]?.judul || timeline?.timeline?.materi?.[0]?.judul }),
          tuntas: getTuntasStatus(type, timeline)
        }
      });

      setKegiatanData(timelinesData);
    }

    if (timeline) {
      setDetailData(timeline);
      setTugasSiswa(
        timeline?.listSiswaTerkumpul?.find((d) => d.id == tugasSiswa?.id)
      );
    }
    setLoadingTimeline(false);
  }

  const getDetailRombelData = async () => {
    let params = { kode_hari: new Date().getDay() }
    const { data } = await getDetailRombel(kelasId, params);

    if (data) {
      setDetailRombel(data);
    }
  };

  useEffect(() => {
    _getDetailTimeline();
  }, [kegiatanId]);

  useEffect(() => {
    getDetailRombelData();
  }, []);

  // useEffect(() => {
  //   if (page === null && hal && kegiatanData?.length > 0) {
  //     const pageId = kegiatanData?.find(item => item?.type === hal)?.id;
  //     setPage(pageId);
  //   }
  // }, [hal, kegiatanData]);

  useEffect(() => {
    setPage(kegiatanId);
  }, [kegiatanId]);

  const isSudahBacaSemuaMateri = kegiatanData?.filter(kegiatan => kegiatan?.type == "materi" && kegiatan?.tuntas == false)?.length == 0;

  const materiId = kegiatanData?.filter(kegiatan => kegiatan.type == "materi" && kegiatan.tuntas == false)?.[0]?.id;

  return (
    <Layout>
      <AnimatePage>
        <section className="banner banner-kegiatan position-absolute"></section>
        <div className="row mb-4">
          <div className="col-md-12">
            <a
              className="text-decoration-none fw-bolder position-relative text-white pointer"
              onClick={handleBack}
            >
              <FaChevronLeft />
              <span className="ms-2">Kembali</span>
            </a>
          </div>
        </div>
        <div className="row">
          {kegiatanData.length > 0 ? (
            <>
              <div className="col-md-12">
                <NavTypeKegiatan
                  data={kegiatanData}
                  kelasId={kelasId}
                  page={page}
                  setPage={setPage}
                  isSudahBacaSemuaMateri={isSudahBacaSemuaMateri}
                  isGuru={isGuru}
                />
              </div>
              
              { !loadingTimeline
                ? (
                  <div className="col-md-12">
                    { hal === "pertemuan" && (
                      <TatapMayaPage
                        detailData={detailData}
                        setDetailData={setDetailData}
                        _getDetailTimeline={_getDetailTimeline}
                        kelasId={kelasId}
                        kegiatanId={kegiatanId}
                        kegiatanData={kegiatanData}
                      />
                    )}
                    { hal === "materi" && (
                      <MateriPage
                        detailData={detailData}
                        detailRombel={detailRombel}
                        kegiatanData={kegiatanData}
                        _getDetailTimeline={_getDetailTimeline}
                        kelasId={kelasId}
                      />
                    )}
                    { hal === "tugas" && (
                      <TugasPage 
                        detailData={detailData}
                        detailRombel={detailRombel}
                        setDetailData={setDetailData}
                        _getDetailTimeline={_getDetailTimeline}
                        disabled={isGuru ? false : !isSudahBacaSemuaMateri}
                        materiId={materiId}
                        kelasId={kelasId}
                      />
                    )}
                    { hal === "tugas-kuis" && (
                      <TugasKuisPage
                        detailData={detailData}
                        detailRombel={detailRombel}
                        setDetailData={setDetailData}
                        _getDetailTimeline={_getDetailTimeline}
                        disabled={isGuru ? false : !isSudahBacaSemuaMateri}
                        materiId={materiId}
                        kelasId={kelasId}
                      />
                    )}
                  </div>
                ) : <SkeletonDetailKegiatan />
              }
            </>
          ) : (
            <>Page Kosong</>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { kegiatan_id, id } }) {
  return {
    props: {
      kelasId: id,
      kegiatanId: kegiatan_id
    },
  };
}

export default index;