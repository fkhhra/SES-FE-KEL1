import { getJadwalMengajarPertemuanV2 } from "client/JadwalMengajarClient";
import CardKelasKBM from "components/Kbm/CardKelas";
import HeaderKbm from "components/Kbm/HeaderKbm";
import Navbar from "components/Shared/Navbar/Navbar";
import router from "next/router";
import { useEffect, useState } from "react";
import { momentPackage } from "utilities/HelperUtils";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ subnav, tanggal }) => {
  const [activeData, setActiveData] = useState({});

  const [timelineData, setTimelineData] = useState({});
  const [total, setTotal] = useState(0);
  const [listBerlangsung, setListBerlangsung] = useState([]);
  const [listAkanDatang, setListAkanDatang] = useState([]);
  const [listSudahSelesai, setListSudahSelesai] = useState([]);
  const [loading, setLoading] = useState(false);

  const _getData = async () => {
    setLoading(true);
    const { data, error } = await getJadwalMengajarPertemuanV2({
      tanggal: momentPackage(tanggal).format("YYYY-MM-DD"),
    });

    setLoading(false);
    if (data) {
      const temp = {};
      const berlangsung = {};
      const akanDatang = {};
      const sudahSelesai = {};
      data.pertemuan?.map((d) => {
        if (temp[d?.mRombelId]) {
          temp[d?.mRombelId] = [...temp[d?.mRombelId], d];
        } else {
          temp[d?.mRombelId] = [d];
        }
        if (d?.status == 2) {
          akanDatang[d?.mRombelId] = 1;
        } else if (d?.status == 1) {
          berlangsung[d?.mRombelId] = 1;
        } else {
          sudahSelesai[d?.mRombelId] = 1;
        }
      });
      setTimelineData(temp);
      setListBerlangsung(Object.keys(berlangsung));
      setListAkanDatang(Object.keys(akanDatang));
      setListSudahSelesai(Object.keys(sudahSelesai));
      setTotal(data?.total?.length);
    }
  };

  const navItems = [
    {
      url: `${ssURL}/kbm?subnav=saat-ini`,
      onClick: () => {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            subnav: "saat-ini",
          },
        });
      },
      text: "Saat Ini",
      active: subnav == "saat-ini" || !subnav,
    },
    {
      url: `${ssURL}/kbm?subnav=akan-datang`,
      onClick: () => {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            subnav: "akan-datang",
          },
        });
      },
      text: "Akan Datang",
      active: subnav == "akan-datang",
    },
    {
      url: `${ssURL}/kbm?subnav=sudah-selesai`,
      onClick: () => {
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            subnav: "sudah-selesai",
          },
        });
      },
      text: "Sudah Selesai",
      active: subnav == "sudah-selesai",
    },
  ];

  useEffect(() => {
    _getData();
  }, [tanggal]);

  useEffect(() => {
    const temp = {};
    if (!subnav || subnav == "saat-ini") {
      listBerlangsung.map((d) => {
        temp[d] = timelineData[d];
        return timelineData[d];
      });
    } else if (subnav == "akan-datang") {
      listAkanDatang.map((d) => {
        temp[d] = timelineData[d];
        return timelineData[d];
      });
    } else if (subnav == "sudah-selesai") {
      listSudahSelesai.map((d) => {
        temp[d] = timelineData[d];
        return timelineData[d];
      });
    }
    setActiveData(temp);
  }, [subnav, listBerlangsung, listAkanDatang, listSudahSelesai]);

  const nav = [
    {
      url: `${ssURL}/rekap-kegiatan`,
      as: `${ssURL}/rekap-kegiatan`,
      text: "Rekap Kegiatan",
      active: false,
    },
    {
      url: `${ssURL}/kbm`,
      as: `${ssURL}/kbm`,
      text: "Detail Kegiatan",
      active: true,
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="col-lg-12">
          <Navbar nav={nav} />
        </div>
        <HeaderKbm
          tanggal={tanggal}
          data={timelineData}
          total={total}
          listAkanDatang={listAkanDatang}
          listSudahSelesai={listSudahSelesai}
          listBerlangsung={listBerlangsung}
        />
        <div className="row justify-content-center">
          <div className="col-md-10">
            <Navbar nav={navItems} />
          </div>
          {loading ? (
            ""
          ) : Object.keys(activeData).length ? (
            <>
              {Object.keys(activeData).map((d) => {
                return (
                  <CardKelasKBM
                    tanggalKegiatan={momentPackage(tanggal).format(
                      "DD MMMM YYYY"
                    )}
                    data={timelineData[d]}
                  />
                );
              })}
            </>
          ) : (
            <>
              <div className="row justify-content-center mt-3">
                <div className="col-md-6 col-8">
                  <img
                    src="/img/empty-state-timeline.png"
                    alt="empty-state"
                    className="img-fluid"
                  />
                </div>
                <div className="col-12 text-center mt-3">
                  {/* <h5 className="color-dark fw-black">kosong</h5>
                  <p className="fw-bold fs-14-ss">kosong</p> */}
                </div>
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { tanggal, subnav } }) {
  return {
    props: {
      tanggal: tanggal || momentPackage().format("YYYY-MM-DD"),
      subnav: subnav || null,
    },
  };
}

export default index;
