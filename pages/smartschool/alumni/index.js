import { DatePicker, Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import { getAlumni } from "client/AlumniV2Client";
import Layout from "components/Layout/Layout";
import HeaderPkl from "components/Pkl/HeaderPkl";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { motion } from "framer-motion";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDebounce } from "use-debounce";
const { RangePicker } = DatePicker;
import Skeleton from "react-loading-skeleton";
import HeaderAlumni from "components/Alumni/HeaderAlumni";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";
import CardDaftarAlumni from "components/Alumni/CardDaftarAlumni";
import useSekolah from "hooks/useSekolah";
import SkeletonDataAlumni from "components/Shared/Skeleton/SkeletonDataAlumni";
import AnalisisJumlahPesertaDidik from "../../../components/Analisis/AnalisisJumlahPesertaDidik";
import AnalisisJumlahPesertaDidikPerJurusan from "components/Analisis/AnalisisJumlahPesertaDidikPerJurusan";
import AnalisisJumlahPesertaDidikAlumni from "components/Analisis/AnalisisJumlahPesertadidikAlumni";

const index = ({ subnav }) => {
  const [formData, setFormData] = useState({
    TahunData: "",
    JurusanData: "",
    StatusAlumni: "",
    Verifikasi: 1,
  });
  const router = useRouter();
  const { page = 1 } = router.query;
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [penerimaanSiswa, setPenerimaanSiswa] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [data, setData] = useState({});
  const [filterGrafik, setFilterGrafik] = useState("jurusan");
  const [tipeRombel, setTipeRombel] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dataAlumni, setDataAlumni] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [datajurusan, setDataJurusan] = useState([]);
  const [tahunData, setTahunData] = useState([]);
  const [total, setTotal] = useState();
  const [alumniData, setAlumniData] = useState({
    alumni: [],
  });

  const {
    siswa,
    integrasi,
    jumlahLaki,
    jumlahPerempuan,
    statusAlumni,
    jumlahBekerja,
    jumlahKuliah,
    jumlahBerwirausaha,
    jumlahMencariKerja,
    totalAlumni,
  } = alumniData;
  const _getAlumni = async () => {
    setIsLoading(true);
    const { data, error } = await getAlumni({
      search,
      jurusan: formData?.JurusanData,
      status: formData?.StatusAlumni,
      tahun_masuk: formData?.TahunData,
      verifikasi: subnav == "terverifikasi" || subnav == null ? 1 : 0,
    });

    if (data) {
      setIsLoading(false);
      setDataAlumni(data?.alumni);
      setDataStatus(data?.statusAlumni);
      setDataJurusan(data?.jurusanData);
      setTahunData(data?.tahunData);
      setTotal(data?.jumlahTotal);
      setAlumniData({
        ...data,
        alumni: data?.alumni,
        total: data?.jumlahTotal,
      });
    }
  };
  const terverifikasi = () => {
    setFormData({
      ...formData,
      Verifikasi: 1,
    });
  };

  const belumTerverifikasi = () => {
    setFormData({
      ...formData,
      Verifikasi: 0,
    });
  };

  const changeRombel = (value) => {
    setTipeRombel(value);
  };

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

  useEffect(() => {
    _getAlumni();
  }, [
    debounceSearch,
    formData?.TahunData,
    formData?.JurusanData,
    formData?.StatusAlumni,
    formData?.Verifikasi,
    subnav,
  ]);

  useEffect(() => {
    if (jurusan.length > 0 && filterGrafik == "jurusan") {
      setData({
        labels: jurusan.map((d) => {
          return d?.kode;
        }),
        datasets: [
          {
            label: "Siswa Diterima",
            data: jurusan.map((d) => {
              return d?.meta?.total;
            }),
            backgroundColor: "rgb(217, 238, 255)",
          },
          {
            label: "Jumlah Siswa",
            data: jurusan.map((d) => {
              return d?.rombel?.reduce((a, b) => a + b.meta?.totalRombel, 0);
            }),
            backgroundColor: "rgb(38, 128, 235)",
          },
        ],
      });
    }
    if (rombel.length > 0 && filterGrafik == "kelas") {
      setData({
        labels: rombel.map((d) => {
          return d?.nama;
        }),
        datasets: [
          {
            label: "Siswa Diterima",
            data: rombel.map((d) => {
              return d?.meta?.total;
            }),
            backgroundColor: "rgb(217, 238, 255)",
          },
          {
            label: "Jumlah Siswa",
            data: rombel.map((d) => {
              return d?.meta?.totalRombel;
            }),
            backgroundColor: "rgb(38, 128, 235)",
          },
        ],
      });
    }
  }, [jurusan, filterGrafik]);

  const listDropdownValue = [
    {
      label: "Tingkat X",
      value: "X",
    },
    {
      label: "Tingkat XI",
      value: "XI",
    },
    {
      label: "Tingkat XII",
      value: "XII",
    },
    {
      label: "Tingkat XIII",
      value: "XIII",
    },
  ];

  const { sekolah } = useSekolah();

  const alumni = [
    { status: "bekerja" },
    { status: "kuliah" },
    { status: "mencari-kerja" },
    { status: "berwirausaha" },
  ];

  return (
    <Layout modalWrapper={<></>}>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row g-4">
            <div className="col-md-12">
              <HeaderAlumni
                ssURL={ssURL}
                sekolah={sekolah?.nama}
                subnav={subnav}
              />
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-sm-row flex-column">
                      <h4 className="fw-extrabold color-dark mb-sm-0">
                        Jumlah Alumni
                      </h4>
                      <Dropdown
                        listValue={tahunData?.map((d) => {
                          return {
                            label: `Angkatan ${d?.nama}`,
                            value: d?.nama,
                          };
                        })}
                        defaultValue={tahunData?.label || "Semua Angkatan"}
                        // onChange={handleChangeDropdown}
                        isDropdownMutasi
                      />
                    </div>
                    <div
                      className="col-md-6 mb-md-0 mb-5"
                      data-joyride="jumlah-peserta-didik"
                    >
                      <div className="d-md-block d-none">
                        <AnalisisJumlahPesertaDidik
                          jumlahLaki={jumlahLaki}
                          jumlahPerempuan={jumlahPerempuan}
                        />
                      </div>
                      <div className="d-md-none d-block">
                        <AnalisisJumlahPesertaDidik
                          jumlahLaki={jumlahLaki}
                          jumlahPerempuan={jumlahPerempuan}
                          isLegendBottom
                        />
                      </div>
                    </div>
                    <div
                      className="col-md-6"
                      data-joyride="jumlah-peserta-didik-per-angkatan"
                    >
                      <div className="d-md-block d-none">
                        <AnalisisJumlahPesertaDidikAlumni
                          jumlahBekerja={jumlahBekerja}
                          jumlahKuliah={jumlahKuliah}
                          jumlahBerwirausaha={jumlahBerwirausaha}
                          jumlahMencariKerja={jumlahMencariKerja}
                        />
                      </div>
                      <div className="d-md-none d-block">
                        <AnalisisJumlahPesertaDidikAlumni
                          jumlahBekerja={jumlahBekerja}
                          jumlahBerkuliah={jumlahKuliah}
                          jumlahBerwirausaha={jumlahBerwirausaha}
                          jumlahMencariKerja={jumlahMencariKerja}
                          isLegendBottom
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="hr-ss my-3" />
                  <div className="d-flex">
                    <img
                      src="/img/icon-role-alumni.svg"
                      alt="icon-user"
                      className="me-2"
                      style={{
                        width: "24px",
                        height: "24px",
                      }}
                    />
                    <p className="mb-0 color-dark fw-semibold">
                      Jumlah Total Alumni:{" "}
                      <span className="fw-extrabold">{total} Orang</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss p-4">
                <div className="row g-4">
                  <div className="col-lg-3 col-md-6 d-flex">
                    <input
                      type="text"
                      className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari alumni"
                      //   value={searchTransaksi}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="select-akun-keuangan">
                      <SelectShared
                        options={tahunData?.map((d) => {
                          return {
                            label: `${d?.nama}`,
                            value: d?.nama,
                          };
                        })}
                        handleChangeSelect={(e, name) => {
                          setIsLoading(true);

                          setFormData({
                            ...formData,
                            TahunData: e?.value,
                          });
                          setTimeout(() => {
                            setIsLoading(false);
                          }, 350);
                        }}
                        // {changeRombel}
                        value={formData?.TahunData || ""}
                        isClearable
                        isDropdownMutasi
                        placeholder="Pilih tahun"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="select-akun-keuangan">
                      <SelectShared
                        options={datajurusan?.map((d) => {
                          return {
                            label: `${d?.nama}`,
                            value: d?.nama,
                          };
                        })}
                        handleChangeSelect={(e, name) => {
                          setIsLoading(true);

                          setFormData({
                            ...formData,
                            JurusanData: e?.value,
                          });
                          setTimeout(() => {
                            setIsLoading(false);
                          }, 350);
                        }}
                        value={formData?.JurusanData || ""}
                        isClearable
                        isDropdownMutasi
                        placeholder="Pilih jurusan"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="select-akun-keuangan">
                      <SelectShared
                        options={dataStatus?.map((d) => {
                          return {
                            label: `${d}`,
                            value: d,
                          };
                        })}
                        handleChangeSelect={(e, name) => {
                          setIsLoading(true);

                          setFormData({
                            ...formData,
                            StatusAlumni: e?.value,
                          });
                          setTimeout(() => {
                            setIsLoading(false);
                          }, 350);
                        }}
                        value={formData?.StatusAlumni || ""}
                        isClearable
                        isDropdownMutasi
                        placeholder="Pilih status"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {dataAlumni?.length == 0 ? (
              isLoading ? (
                <SkeletonDataAlumni />
              ) : (
                <div className="card-body p-4">
                  <div className="row justify-content-center">
                    <div className="col-md-6 col-sm-8 col-10 text-center">
                      <img
                        src="/img/empty-state-data.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-12 text-center">
                      <h4 className="color-dark fw-black mt-4 mb-2">
                        Tidak Ada Data
                      </h4>
                    </div>
                  </div>
                </div>
              )
            ) : isLoading ? (
              <SkeletonDataAlumni />
            ) : (
              dataAlumni?.map((d, idx) => {
                return (
                  <div
                    className="col-md-4"
                    key={`${idx}-${new Date().getTime()}`}
                  >
                    <CardDaftarAlumni dataAlumni={d} status={d?.status} />
                  </div>
                );
              })
            )}
          </div>
        </>
      </motion.div>
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
