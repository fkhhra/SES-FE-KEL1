import { Pagination } from "antd";
import { LayoutContext } from "antd/lib/layout/layout";
import { getDashboardPengawas } from "client/PengawasClient";
import GrafikGuruPengawas from "components/Dinas/GrafikGuru";
import GrafikSiswaPengawas from "components/Dinas/GrafikSiswa";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { useDebounce } from "use-debounce";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ page, search: searchQuery }) => {
  const { sekolah } = useSekolah();

  const [kehadiran, setKehadiran] = useState("guru");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const [absen, setAbsen] = useState({});
  const [dataGTK, setDataGTK] = useState({});
  const [dataSiswa, setDataSiswa] = useState({});
  const [jumlahGuru, setJumlahGuru] = useState({});
  const [jumlahSiswa, setJumlahSiswa] = useState([]);

  const _getDashboard = async () => {
    setLoading(true);
    const { data } = await getDashboardPengawas({ search, page });

    if (data) {
      setAbsen(data?.absen);
      setDataGTK(data?.gtk);
      setDataSiswa(data?.siswa);
      setJumlahSiswa(data?.jumlahSiswa);
      setJumlahGuru(data?.jumlahGuru);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getDashboard();
  }, [searchQuery, page]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: debounceSearch,
        page: 1,
      },
    });
  }, [debounceSearch]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="row">
                  <div className="col-md-6 col-12 d-flex align-items-center">
                    <h4 className="fw-extrabold color-dark mb-0">
                      Rekapitulasi Buku Guru
                    </h4>
                  </div>
                  <div className="col-md-6 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-md-0 mt-3">
                    <div className="flex-grow-1 mb-md-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari guru"
                        autoComplete="off"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <>
                    <div className="p-4">
                      <Skeleton
                        width={"90%"}
                        height={75}
                        className="rounded-ss mb-3"
                      />
                      <Skeleton
                        width={"85%"}
                        height={75}
                        className="rounded-ss mb-3"
                      />
                      <Skeleton
                        width={"90%"}
                        height={75}
                        className="rounded-ss mb-3"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="table-responsive"
                      data-joyride="table-rombel"
                    >
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th className="text-md-center">Status</th>
                            <th className="text-md-center">Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataGTK?.data?.map((d, idx) => {
                            const temp = [];
                            const countRPP = d?.rpp?.filter((e) => {
                              if (!temp.includes(e?.tipe)) {
                                temp.push(e?.tipe);
                                return 1;
                              } else {
                                return 0;
                              }
                            })?.length;
                            return (
                              <tr>
                                <td data-th="No">{idx + 1}</td>
                                <td data-th="Nama">{d?.nama}</td>
                                <td data-th="Status" className="text-md-center">
                                  <span
                                    className={`label-light-${
                                      countRPP == 27 ? "success" : "danger"
                                    }-ss label-ss fs-12-ss fw-semibold rounded-pill`}
                                  >
                                    {countRPP}
                                    /27 Instrumen
                                  </span>
                                </td>
                                <td data-th="Detail" className="text-md-center">
                                  <Link
                                    href={`${ssURL}/pengawasan/buku-kerja-1?user_id=${d?.id}`}
                                  >
                                    <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                                      Lihat
                                    </a>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                          {/* <tr>
                        <td data-th="No">2</td>
                        <td data-th="Nama">Armando Salazar</td>
                        <td data-th="Status">
                          {" "}
                          <span className="label-light-danger-ss label-ss fs-12-ss fw-semibold rounded-pill">
                            4/27 Instrumen
                          </span>
                        </td>
                        <td data-th="Detail">
                          <Link href={`${ssURL}/rombel/`}>
                            <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr> */}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-center my-4">
                      <Pagination
                        total={dataGTK?.total}
                        showSizeChanger={false}
                        current={parseInt(page) || 1}
                        pageSize={20}
                        onChange={(e) =>
                          router.push({
                            pathname: router.pathname,
                            query: { ...router.query, page: e },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { page, search } }) {
  return {
    props: {
      page: page || null,
      search: search || null,
    },
  };
}

export default index;
