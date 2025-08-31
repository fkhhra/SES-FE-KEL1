import { Pagination } from "antd";
import axios from "axios";
import { getTunggakan } from "client/TunggakanClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { motion } from "framer-motion";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaPrint } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { useDebounce } from "use-debounce";
import {
  getJumlahBulan,
  getTotalDibayar,
  getTotalDibayarSemua,
  getTotalTagihanSPP,
  getTotalTunggakan,
  getTunggakanLainnya,
  getTunggakanUjian,
} from "utilities/TunggakanUtils";
import { detailAbsen, editAbsen, postAbsen } from "../../../client/AbsenClient";
import { downloadURL, ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import useBagian from "../../../hooks/useBagian";
import useSekolah from "../../../hooks/useSekolah";
import useUser from "../../../hooks/useUser";
import {
  currencyFormatter,
  momentPackage,
} from "../../../utilities/HelperUtils";

const index = ({ page = 1, search_nama = "", tingkat = "", taId }) => {
  const [loading, setLoading] = useState(0);

  const [searchNama, setSearchNama] = useState(search_nama);
  const [debounceNama] = useDebounce(searchNama, 400);

  const [downloaded, setDownloaded] = useState(true);
  const [tunggakanData, setTunggakanData] = useState({});
  const { data: tunggakan } = tunggakanData;

  const [token, setToken] = useState("");
  const [tingkatRombel, setTingkatRombel] = useState([]);
  const [dataTA, setDataTA] = useState([]);

  const _getTunggakan = async () => {
    setLoading(1);
    const { data, error } = await getTunggakan({
      page,
      search_nama,
      tingkat,
      taId,
    });

    if (data) {
      setTunggakanData(data?.tunggakan);
      setTingkatRombel(data?.tingkatRombel);
      setDataTA(data?.semuaTA);
    } else {
    }
    setLoading(0);
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const _downloadTunggakan = async () => {
    setDownloaded(false);
    console.log(taId);
    const body = { ta_id: taId };
    const { data, error } = await axios.post(
      downloadURL + `/download/tunggakan`,
      body,
      config
    );

    if (data) {
      setDownloaded(true);
      // toast.success("Import Berhasil");
      document.getElementById("downloadIframe").src = downloadURL + data;
    } else {
      toast.error("Silahkan coba beberapa saat lagi");
      setDownloaded(true);
    }
  };

  useEffect(() => {
    _getTunggakan();
  }, [page, search_nama, tingkat, taId]);

  useEffect(() => {
    router.push({
      pathname: "/smartschool/tunggakan",
      query: { ...router.query, search_nama: searchNama, page: 1 },
    });
  }, [debounceNama]);
  const steps = [
    {
      target: '[data-joyride="btn-rekap-tunggakan"]',
      content: "Text 1",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="cari-tunggakan"]',
      content: "Text 1",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="dropdown-tunggakan"]',
      content: "Text 1",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="table-tunggakan"]',
      content: "Text 1",
      disableBeacon: true,
    },
  ];
  console.log(dataTA);
  console.log([
    dataTA?.map((e) => {
      return {
        label: `Tahun ${e?.tahun} - semester ${e?.semester}`,
        value: e?.id,
      };
    }),
  ]);

  useEffect(() => {
    setToken(JSON.parse(localStorage.getItem("ss-token")));
  }, []);
  return (
    <Layout isIndex={true} modalWrapper={<></>}>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <MyJoyride steps={steps} />
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss py-4 px-0">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                    <div className="row d-flex flex-md-row grow-1 w-100">
                      <div className="col-md-5">
                        <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                          Daftar Tunggakan
                        </h4>
                      </div>
                      <div className="col-md-4 d-flex justify-content-end">
                        <button
                          className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss ${
                            downloaded ? "" : "disabled"
                          }`}
                          type="button"
                          onClick={
                            () => {
                              _downloadTunggakan();
                            }
                            // console.log("sada")
                          }
                        >
                          <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                          Rekap Tunggakan
                        </button>
                      </div>
                      <div className="col-md-3">
                        {dataTA ? (
                          <SelectShared
                            className="w-100"
                            options={dataTA?.map((e) => {
                              return {
                                label: `Tahun ${e?.tahun} - semester ${e?.semester}`,
                                value: e?.id,
                              };
                            })}
                            value={parseInt(taId)}
                            handleChangeSelect={(e) => {
                              router.push({
                                pathname: router.pathname,
                                query: {
                                  ...router.query,
                                  taId: e?.value,
                                },
                              });
                            }}
                            isClearable
                            placeholder="Pilih tahun akademik"
                          />
                        ) : null}
                      </div>
                    </div>
                    {/* <div
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold ms-lg-3 ms-0 mt-lg-0 mt-3"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahTransaksi"
                      data-joyride="btn-rekap-tunggakan"
                    >
                      <FaCloudDownloadAlt className="me-2" />
                      Rekap Tunggakan
                    </div> */}
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex px-4 flex-sm-row flex-column">
                    <div className="flex-grow-1 me-sm-4 mb-sm-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi form-search-tunggakan rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        onChange={(e) => setSearchNama(e.target.value)}
                        value={searchNama}
                        id="exampleFormControlInput1"
                        placeholder="Cari Nama Siswa"
                        data-joyride="cari-tunggakan"
                      />
                    </div>
                    <div className="">
                      <div
                        className="dropdown dropdown-ss d-flex flex-sm-row flex-column"
                        data-joyride="dropdown-tunggakan"
                      >
                        <button
                          className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-toggle-secondary dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-secondary fw-semibold w-100`}
                          role="button"
                          id="dropdownMenuLink"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {tingkat || "Semua"}
                        </button>
                        <ul
                          className="dropdown-menu dropdown-menu-ss my-1"
                          aria-labelledby="dropdownMenuLink"
                        >
                          <li
                            onClick={() =>
                              router.push({
                                pathname: "/smartschool/tunggakan",
                                query: {
                                  ...router.query,
                                  tingkat: "",
                                  page: 1,
                                },
                              })
                            }
                          >
                            <a className="dropdown-item">Semua</a>
                          </li>
                          {tingkatRombel?.map((d) => {
                            return (
                              <li
                                onClick={() =>
                                  router.push({
                                    pathname: "/smartschool/tunggakan",
                                    query: { ...router.query, tingkat: d },
                                  })
                                }
                              >
                                <a className="dropdown-item">{d}</a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div
                    className="table-responsive"
                    data-joyride="table-tunggakan"
                  >
                    {loading ? <Skeleton count={4} height={50} /> : null}
                    {!loading && (
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th>Nama</th>
                            <th>SPP</th>
                            <th>Ujian</th>
                            <th>Lainnya</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tunggakan?.map((d) => {
                            return (
                              <tr>
                                <td>{d?.nama}</td>
                                <td>
                                  {getJumlahBulan(d?.pembayaran)} bulan :{" "}
                                  <span className="fw-bold">
                                    {currencyFormatter(
                                      getTotalTagihanSPP(d?.pembayaran) -
                                        getTotalDibayar(d?.pembayaran, "spp")
                                    )}
                                  </span>
                                </td>
                                <td>
                                  <ul className="mb-0">
                                    {getTunggakanUjian(d?.pembayaran)}
                                  </ul>
                                </td>
                                <td>
                                  <ul className="mb-0">
                                    {getTunggakanLainnya(d?.pembayaran)}
                                  </ul>
                                </td>
                                <td>
                                  {" "}
                                  <span className="fw-bold">
                                    {currencyFormatter(
                                      getTotalTunggakan(d?.pembayaran) -
                                        getTotalDibayarSemua(d?.pembayaran)
                                    )}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {/* <tr>
                            <td>Aldava Ramanda</td>
                            <td>
                              3 bulan :{" "}
                              <span className="fw-bold">Rp 50.000</span>
                            </td>
                            <td>
                              <ul className="mb-0">
                                <li>
                                  PTS :{" "}
                                  <span className="fw-bold">Rp 50.000</span>
                                </li>
                              </ul>
                            </td>
                            <td>
                              <ul className="mb-0">
                                <li>
                                  Perpisahan kelas XI :{" "}
                                  <span className="fw-bold">Rp 50.000</span>
                                </li>
                                <li>
                                  Perpisahan kelas XI :{" "}
                                  <span className="fw-bold">Rp 50.000</span>
                                </li>
                              </ul>
                            </td>
                            <td>
                              {" "}
                              <span className="fw-bold">Rp 50.000</span>
                            </td>
                            <td>
                              <button
                                className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                //   data-bs-toggle="modal"
                                //   data-bs-target="#modalBuatSoalUjian"
                                //   onClick={() => handleClickEditSoalUjian(soal)}
                              >
                                <FaPrint className="color-secondary fs-18-ss" />
                              </button>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    )}
                    <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                      <Pagination
                        total={tunggakanData?.total}
                        showSizeChanger={false}
                        current={tunggakanData?.page}
                        pageSize={20}
                        onChange={(e) =>
                          router.push({
                            pathname: "/smartschool/tunggakan",
                            query: { ...router.query, page: e },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { page, search_nama, tingkat, taId },
}) {
  return {
    props: {
      page: page || null,
      search_nama: search_nama || null,
      tingkat: tingkat || null,
      taId: taId || null,
    },
  };
}

export default index;
