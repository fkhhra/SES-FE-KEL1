import { DatePicker, Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import {
  getPenerimaanPkl,
  getPenerimaanPkl31,
  getTambahPenerimaanPkl31,
} from "client/PenerimaanClient";
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
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaDownload,
  FaFileImport,
  FaPen,
  FaPlus,
  FaTrash,
  FaTrashAlt,
  FaWhatsapp,
} from "react-icons/fa";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalBerkas from "components/Penerimaan/ModalBerkas";
import ModalNilaiPklSiswa from "components/Penerimaan/ModalNilaiPklSiswa";
import ModalEditPenerimaanSiswa from "components/Penerimaan/ModalEditPenerimaanSiswa";
import ModalTambahPenerimaanSiswaPkl from "components/Penerimaan/ModalTambahPenerimaanSiswaPkl";

const index = ({ id }) => {
  const [formData, setFormData] = useState({
    JurusanId: "",
    TaId: ""
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
  const [ta, setTa] = useState([]);
  const [rombel, setRombel] = useState([]);
  const [data, setData] = useState({});
  const [filterGrafik, setFilterGrafik] = useState("jurusan");
  const [tipeRombel, setTipeRombel] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [listJurusan, setListJurusan] = useState([]);
  const [listRombel, setListRombel] = useState([]);
  const [listPerusahaan, setListPerusahaan] = useState([]);
  const [editDataSiswa, setEditDataSiswa] = useState(null);
  const [editDataNilai, setEditDataNilai] = useState(null);
  const [editDataBerkas, setEditDataBerkas] = useState(null);

  const _getPenerimaanPkl31 = async () => {
    const { data, error } = await getPenerimaanPkl31({
      page,
      search,
      jurusan_id: formData?.JurusanId,
      m_ta_id: formData?.TaId
    });

    if (data) {
      setPenerimaanSiswa(data?.penerimaanSiswa);
      setPerusahaan(data?.perusahaan);
      setJurusan(data?.jurusan);
      setTa(data?.semuaTA);
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
    _getPenerimaanPkl31();
  }, [page, debounceSearch, formData?.JurusanId, formData?.TaId]);

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
                      Serapan Penerimaan PKL
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
                <div className="card-header p-0 card-header-ss">
                  <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column p-4">
                    <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                      Daftar Penerimaan Siswa
                    </h4>
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahPenerimaanSiswaPklPenerimaan"
                      // onClick={() => {
                      //   setEditId(null);
                      // }}
                      data-joyride="btn-tambah-mapel"
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                  <hr className="m-0" />
                  <div className="p-4">
                    <div className="row g-4">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 flex-grow-1"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari siswa"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <div className="select-perencanaan-analisis-keuangan flex-grow-1">
                          <SelectShared
                            placeholder="Pilih jurusan"
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
                      </div>
                      <div className="col-md-3">
                        <div className="select-perencanaan-analisis-keuangan flex-grow-1">
                          <SelectShared
                            placeholder="Pilih tahun akademik"
                            handleChangeSelect={(e, name) => {
                              setIsLoading(true);

                              setFormData({
                                ...formData,
                                TaId: e?.value,
                              });
                              setTimeout(() => {
                                setIsLoading(false);
                              }, 350);
                            }}
                            // {changeRombel}
                            value={formData?.TaId || "Semua"}
                            options={[
                              { label: "Semua", value: "" },
                              ...ta?.map((d) => {
                                return {
                                  label: `${d?.tahun} - ${d?.semester === "1" ? "Ganjil" : "Genap"}`,
                                  value: d?.id,
                                };
                              }),
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="card-header-ss p-4">
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
                    </div>
                  </div>
                </div> */}
                {penerimaanSiswa?.data?.length != 0 ? (
                  <div className="card-body p-0 pb-4">
                    <div className="table-responsive">
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Nama Siswa</th>
                            <th>Perusahaan</th>
                            <th className="text-md-center">Nilai</th>
                            <th className="text-md-center">Detail</th>
                            <th className="text-md-center">Berkas</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {isLoading ? (
                            <>
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
                                <td data-th="Nilai">
                                  <Skeleton />
                                </td>
                                <td data-th="Detail">
                                  <Skeleton />
                                </td>
                                <td data-th="Berkas">
                                  <Skeleton />
                                </td>
                                <td>
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
                                <td data-th="Nilai">
                                  <Skeleton />
                                </td>
                                <td data-th="Detail">
                                  <Skeleton />
                                </td>
                                <td data-th="Berkas">
                                  <Skeleton />
                                </td>
                                <td>
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
                                <td data-th="Nilai">
                                  <Skeleton />
                                </td>
                                <td data-th="Detail">
                                  <Skeleton />
                                </td>
                                <td data-th="Berkas">
                                  <Skeleton />
                                </td>
                                <td>
                                  <Skeleton />
                                </td>
                              </tr>
                            </>
                          ) : (
                            // penerimaanSiswa?.data?.map((d, idx) => (
                            //   <tr>
                            //     <td data-th="No">{idx + 1}</td>
                            //     <td data-th="Nama Siswa">{d?.user?.nama}</td>
                            //     <td data-th="Kelas">{d?.rombel?.nama || "-"}</td>
                            //     <td data-th="Perusahaan">
                            //       {
                            //         d?.penerimaanPerusahaan?.perusahaanSekolah
                            //           ?.perusahaan?.namaPt
                            //       }
                            //     </td>
                            //     <td data-th="Lama PKL">{d?.lamaPkl} Bulan</td>
                            //   </tr>
                            // ))
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
                                    {d?.lamaPkl} Bulan
                                  </span>
                                </td>
                                <td data-th="Nilai" className="text-md-center">
                                  <h6
                                    className={`fw-bold ${
                                      d?.user?.keteranganPkl1?.nilai == "A" ||
                                      (d?.user?.keteranganPkl1?.nilai == "B" &&
                                        d?.user?.keteranganPkl1?.nilai != null)
                                        ? `color-dark`
                                        : `color-danger`
                                    }`}
                                  >
                                    {d?.user?.keteranganPkl1?.nilai ||
                                      "belum dinilai"}
                                  </h6>
                                </td>
                                <td data-th="Detail" className="text-md-center">
                                  <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalNilaiPklSiswa"
                                    className="btn btn-primary btn-primary-ss fw-semibold fs-14-ss rounded-pill py-1 px-4 shadow-primary-ss hover-shadow-none"
                                    onClick={() => setEditDataNilai(d)}
                                  >
                                    Lihat
                                  </button>
                                </td>
                                <td data-th="Berkas" className="text-md-center">
                                  <button
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalBerkas"
                                    className="btn btn-primary btn-primary-ss fw-semibold fs-14-ss rounded-pill py-1 px-4 shadow-primary-ss hover-shadow-none"
                                    onClick={() => setEditDataBerkas(d)}
                                  >
                                    Lihat
                                  </button>
                                </td>
                                <td data-th="Aksi">
                                  <div className="d-flex flex-lg-row flex-md-column flex-row">
                                    <button
                                      type="button"
                                      className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-3 mb-lg-0 mb-md-3 mb-0"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalEditPenerimaanSiswa"
                                      onClick={() => setEditDataSiswa(d)}
                                      data-joyride="edit-mapel"
                                    >
                                      <FaPen className="color-secondary" />
                                    </button>
                                  </div>
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
                          pageSize={25}
                          onChange={(e) =>
                            router.push(`${ssURL}/penerimaan/pkl?page=${e}`)
                          }
                        />
                      </div>
                    </div>
                  </div>
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
                )}
              </div>
            </div>
          </div>
        </>
        <ModalEditPenerimaanSiswa
          editDataSiswa={editDataSiswa}
          _getPenerimaanPkl31={_getPenerimaanPkl31}
          penerimaanSiswa={penerimaanSiswa}
        />
        <ModalNilaiPklSiswa
          editDataNilai={editDataNilai}
          _getPenerimaanPkl31={_getPenerimaanPkl31}
          penerimaanSiswa={penerimaanSiswa}
        />
        <ModalTambahPenerimaanSiswaPkl
          _getPenerimaanPkl31={_getPenerimaanPkl31}
          data={penerimaanSiswa}
          dataPerusahaan={perusahaan}
        />
        <ModalBerkas
          editDataBerkas={editDataBerkas}
          _getPenerimaanPkl31={_getPenerimaanPkl31}
          penerimaanSiswa={penerimaanSiswa}
        />
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
