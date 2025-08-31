import { getJadwalMengajarPertemuanV2 } from "client/JadwalMengajarClient";
import CardKelasKBM from "components/Kbm/CardKelas";
import HeaderKbm from "components/Kbm/HeaderKbm";
import Navbar from "components/Shared/Navbar/Navbar";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { momentPackage } from "utilities/HelperUtils";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { Bar } from "react-chartjs-2";
import { DatePicker } from "antd";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import toast from "react-hot-toast";
import { getGTK } from "client/GTKClient";
import { getAbsenData } from "client/AbsenClient";
const { RangePicker } = DatePicker;


const index = ({ subnav }) => {
  const router = useRouter();
  const [activeData, setActiveData] = useState({});
  const [tanggal, setTanggal] = useState([]);

  const guruId = router.query.guruId;

  const [timelineData, setTimelineData] = useState({});
  const [total, setTotal] = useState(0);
  const [userGuru, setUserGuru] = useState([]);
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(false);

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
    elements: {
      bar: {
        borderWidth: 2,
        borderSkipped: "middle",
      },
    },
  };

  const _getAbsenDataGuru = async () => {
    const { data } = await getAbsenData({
      role: "guru",
      tanggalAwal: tanggal?.[0]
        ? momentPackage(tanggal?.[0]).format("YYYY-MM-DD")
        : "",
      tanggalAkhir: tanggal?.[1]
        ? momentPackage(tanggal?.[1]).format("YYYY-MM-DD")
        : "",
      absen: "hadir",
    });
    if (data) {
      setData({
        labels: data?.listHari,
        datasets: [
          {
            label: "Kehadiran",
            data: data?.data?.map((d) => d.absen),
            total: data?.total,
            backgroundColor: "rgb(38, 128, 235)",
          },
        ],
      });
    } else {
      toast.error("No Data");
    }
  };

  useEffect(() => {
    _getAbsenDataGuru();
  }, [tanggal]);

  const nav = [
    {
      url: `${ssURL}/rekap-kegiatan`,
      as: `${ssURL}/rekap-kegiatan`,
      text: "Rekap Kegiatan",
      active: true,
    },
    {
      url: `${ssURL}/kbm`,
      as: `${ssURL}/kbm`,
      text: "Detail Kegiatan",
      active: false,
    },
  ];

  const _getDataGuru = async (search = "") => {
    const { data } = await getGTK({
      page: "all",
      search: search,
    });
    if (data) {
      const options = [
        { value: "", label: "Semua" },
        ...data?.guru?.map((item) => {
          return { value: item?.id, label: item?.nama };
        }),
      ];
      setUserGuru(options);
      return options;
    } else {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    _getDataGuru();
  }, []);

  console.log("ini opsi:", options, "ini data:", data )
  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-lg-12">
            <Navbar nav={nav} />
          </div>
          <div className="col-md-12">
            <div className="card card-ss mb-4 p-0">
              <div className="card-body p-4">
                <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-0">
                    Rekap Kegiatan Guru
                  </h4>
                  <div className="d-flex align-items-center mt-md-0 mt-3 mx-md-0 mx-auto">
                    <RangePicker
                      className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi"
                      style={{
                        height: "42px",
                        paddingLeft: "14px",
                        paddingRight: "14px",
                      }}
                      placeholder={["Tanggal Mulai", "Tanggal Selesai"]}
                      value={
                        tanggal?.length > 0
                          ? [
                              momentPackage(tanggal[0]),
                              momentPackage(tanggal[1]),
                            ]
                          : ""
                      }
                      onChange={(date) => {
                        console.log(date);

                        date?.length > 0
                          ? setTanggal([date[0], date[1]])
                          : setTanggal([]);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-md-center flex-md-row flex-column my-4 flex-grow-1 row">
                  <div className="d-flex align-items-center me-md-5 mb-md-0 mb-3 flex-grow-1 col-4">
                    <SelectShared
                      className="me-4 flex-grow-1"
                      options={userGuru}
                      value={guruId}
                      handleChangeSelect={(e) => {
                        router.push({
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            guruId: e?.value,
                          },
                        });
                      }}
                      isClearable
                      placeholder="Pilih Guru"
                    />
                  </div>
                  {/* <div className="d-flex align-items-center me-md-5">""""</div> */}
                </div>

                <Bar options={options} data={data} />
               
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav } }) {
  return {
    props: {
      subnav: subnav || null,
    },
  };
}

export default index;
