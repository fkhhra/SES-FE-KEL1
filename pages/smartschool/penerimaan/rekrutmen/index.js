import { DatePicker, Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import { getPenerimaanPkl31 } from "client/PenerimaanClient";
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
import HeaderPenerimaan from "components/Penerimaan/HeaderPenerimaan";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalBerkas from "components/Penerimaan/ModalBerkas";
const index = ({ id }) => {
  const [formData, setFormData] = useState({
    JurusanId: "",
  });
  const router = useRouter();
  const { page = 1 } = router.query;
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [penerimaanSiswa, setPenerimaanSiswa] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [totalSiswa, setTotalSiswa] = useState([]);
  const [totalSemuaSiswa, setTotalSemuaSiswa] = useState([]);
  const [totalPatner, setTotalPatner] = useState([]);
  const [jurusan, setJurusan] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [data, setData] = useState({});
  const [filterGrafik, setFilterGrafik] = useState("jurusan");
  const [tipeRombel, setTipeRombel] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const _getPenerimaanPkl = async () => {
    const { data, error } = await getPenerimaanPkl31({
      page,
      search,
      jurusan_id: formData?.JurusanId,
    });

    if (data) {
      setPenerimaanSiswa(data?.penerimaanSiswa);
      setPerusahaan(data?.perusahaan);
      setJurusan(data?.jurusan);
      setRombel(data?.rombel);
      setTotalSemuaSiswa(data?.totalSemuaSiswa);
      setTotalSiswa(data?.totalSiswa);
      setTotalPatner(data?.totalPatner);
    }
  };

  const changeRombel = (value) => {
    setTipeRombel(value);
  };
  // const _getRombel = async () => {
  //   const { data, error } = await getRombel();

  //   if (data) {
  //     setRombel(data?.rombel);
  //     setJurusan(data?.jurusan);
  //   }
  // };

  // const listOptionsJurusan = tingkatPrestasi?.map(prestasi => {
  //   return {
  //     value: prestasi?.jurusan?.toLowerCase(),
  //     label: prestasi?.jurusan
  //   }
  // });

  // const listDropdownValue = [
  //   {
  //     label: "SIJA",
  //     value: "",
  //   },
  //   {
  //     label: "TEDK",
  //     value: "debit",
  //   },
  //   {
  //     label: "TTL",
  //     value: "kredit",
  //   },
  // ];

  // const onSearch = (e) => {
  //   setIsLoading(true);
  //   setSearch(e.target.value);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 350);
  // }

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

  // const data = {
  //   labels,
  //   // datasets: [
  //   //   {
  //   //     label: "Dataset 1",
  //   //     data: 500,
  //   //     backgroundColor: "rgb(255, 99, 132)",
  //   //   },
  //   //   {
  //   //     label: "Dataset 2",
  //   //     data: 100,
  //   //     backgroundColor: "rgb(75, 192, 192)",
  //   //   },
  //   //   {
  //   //     label: "Dataset 3",
  //   //     data: 500,
  //   //     backgroundColor: "rgb(53, 162, 235)",
  //   //   },
  //   // ],
  // };

  useEffect(() => {
    _getPenerimaanPkl();
  }, [page, debounceSearch, formData?.JurusanId]);

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

  return (
    <Layout modalWrapper={<></>}>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <AnimatePage>
        <>
          <div className="row">
            <div className="col-md-12">
              <HeaderPenerimaan ssURL={ssURL} type={`Praktik Kerja Lapangan`} />
            </div>
            <div className="col-md-12">
              <div className="card card-ss mb-4 p-0">
                <div className="card-body p-4">
                  <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                    <h4 className="fw-extrabold color-dark mb-0">
                      Serapan Penerimaan Rekrutmen
                    </h4>
                    <div className="d-flex align-items-center mt-md-0 mt-3 mx-md-0 mx-auto">
                      <a
                        className={`btn btn-switch-ss rounded-pill fw-bold py-2 px-4 me-3 ${
                          filterGrafik == "jurusan" ? "active" : ""
                        }`}
                        onClick={() => setFilterGrafik("jurusan")}
                      >
                        Jurusan
                      </a>
                      <a
                        className={`btn btn-switch-ss rounded-pill fw-bold py-2 px-4 ${
                          filterGrafik == "kelas" ? "active" : ""
                        }`}
                        onClick={() => setFilterGrafik("kelas")}
                      >
                        Kelas
                      </a>
                    </div>
                  </div>
                  <div className="d-flex align-items-md-center flex-md-row flex-column my-4">
                    <div className="d-flex align-items-center me-md-5 mb-md-0 mb-3">
                      <img
                        src="/img/icon-user.svg"
                        alt="icon-user"
                        style={{ width: "42px", height: "42px" }}
                        className="me-3"
                      />
                      <div className="">
                        <span className="fs-12 ss color-dark fw-semibold">
                          Jumlah Total Siswa
                        </span>
                        <h6 className="color-dark fw-extrabold mb-0">
                          {totalSemuaSiswa || 0} Orang
                        </h6>
                      </div>
                    </div>
                    <div className="d-flex align-items-center me-md-5">
                      <img
                        src="/img/icon-user-pkl.svg"
                        alt="icon-user"
                        style={{ width: "42px", height: "42px" }}
                        className="me-3"
                      />
                      <div className="">
                        <span className="fs-12 ss color-dark fw-semibold">
                          Jumlah Total Penerimaan
                        </span>
                        <h6 className="color-dark fw-extrabold mb-0">
                          {totalSiswa || 0} Orang
                        </h6>
                      </div>
                    </div>
                  </div>
                  <Bar options={options} data={data} />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <div className="row  justify-content-between">
                    <div className="col-lg-4">
                      <h4 className="fw-extrabold m-0 color-dark mb-lg-0 mb-4">
                        Daftar Penerimaan Siswa
                      </h4>
                    </div>
                    <div className="col-lg-8 d-flex flex-sm-row flex-column">
                      <div className="flex-grow-1 me-sm-4 mb-sm-0 mb-3 d-sm-block d-flex">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 flex-grow-1"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Nama Siswa"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="select-perencanaan-analisis-keuangan flex-grow-1">
                        <SelectShared
                          placeholder="Pilih Jurusan"
                          handleChangeSelect={(e, name) => {
                            setIsLoading(true);

                            setFormData({
                              ...formData,
                              JurusanId: e?.value,
                            });
                            setTimeout(() => {
                              setIsLoading(false);
                            }, 350);
                          }}
                          // {changeRombel}
                          value={formData?.JurusanId || "Semua"}
                          options={[
                            { label: "Semua", value: "" },
                            ...jurusan?.map((d) => {
                              return {
                                label: d?.kode,
                                value: d?.id,
                              };
                            }),
                          ]}
                        />
                      </div>
                      {/* <Dropdown
                      listValue={[
                        { label: "Semua", value: "" },
                        ...jurusan?.map((d) => {
                          return {
                            label: d?.kode,
                            value: d?.id,
                          };
                        }),
                      ]}
                      defaultValue={tipeRombel?.label || "Semua"}
                      onChange={changeRombel}
                      isDropdownMutasi
                      dataJoyride="jurusan"
                    /> */}
                    </div>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Siswa</th>
                          <th style={{ width: "35%" }}>Perusahaan</th>
                          <th className="text-md-center">Berkas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <>
                            {" "}
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Perusahaan">
                                <Skeleton />
                              </td>
                              <td data-th="Berkas">
                                <Skeleton />
                              </td>
                            </tr>
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Perusahaan">
                                <Skeleton />
                              </td>
                              <td data-th="Berkas">
                                <Skeleton />
                              </td>
                            </tr>
                            <tr>
                              <td data-th="No">
                                <Skeleton />
                              </td>
                              <td data-th="Nama Siswa">
                                <Skeleton />
                              </td>
                              <td data-th="Perusahaan">
                                <Skeleton />
                              </td>
                              <td data-th="Berkas">
                                <Skeleton />
                              </td>
                            </tr>
                          </>
                        ) : (
                          penerimaanSiswa?.data?.map((d, idx) => (
                            <tr>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama Siswa">
                                <h6 className="fw-semibold color-dark mb-2">
                                  {d?.user?.nama}
                                </h6>
                                <span className="fs-14-ss fw-semibold">
                                  {d?.rombel?.nama || "-"}
                                </span>
                              </td>
                              <td data-th="Perusahaan">
                                <h6 className="fw-semibold color-dark mb-2">
                                  {
                                    d?.penerimaanPerusahaan?.perusahaanSekolah
                                      ?.perusahaan?.nama
                                  }
                                </h6>
                                <span className="fs-14-ss fw-semibold">
                                  2021 - Manager
                                </span>
                              </td>
                              <td data-th="Berkas" className="text-md-center">
                                <button
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalBerkas"
                                  className="btn btn-primary btn-primary-ss fw-semibold fs-14-ss rounded-pill py-1 px-4 shadow-primary-ss hover-shadow-none"
                                >
                                  Lihat
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                      <Pagination
                        total={penerimaanSiswa?.total}
                        showSizeChanger={false}
                        current={page || 1}
                        pageSize={20}
                        onChange={(e) =>
                          router.push(`${ssURL}/pkl/penerimaan?page=${e}`)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        <ModalBerkas isRekrutmen={true} removeFooter={true} />
      </AnimatePage>
    </Layout>
  );
};

// export async function getServerSideProps({ params: { ta } }) {
//   return {
//     props: {
//       ta: ta_id || null,
//     },
//   };
// }

export default index;
