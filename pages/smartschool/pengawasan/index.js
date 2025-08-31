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
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ page, search: searchQuery, token }) => {
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
    <Layout token={token}>
      <AnimatePage>
        <div className="row mb-4">
          <div className="col-md-12">
            <div
              className="card card-ss bg-white p-4 bg-no-repeat rounded-ss"
              style={{
                background: `url("/img/bg-sekolah-pengawasan.png")`,
                backgroundColor: "#FAFAFA",
                backgroundPositionX: "right",
                backgroundPositionY: "bottom",
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={
                    sekolah?.favicon ||
                    "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1641454372683-Icon-Smart-School.png?alt=media&token=febf1002-9f75-464c-8362-7e4f24ada4b6"
                  }
                  alt="logo-sekolah"
                  className="img-fit-contain"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="ms-4">
                  <h2 className="fw-black color-dark mb-1">{sekolah?.nama}</h2>
                  <h6 className="fw-bold color-secondary mb-0">
                    {sekolah?.alamat || "-"}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row g-4 mb-4">
          <div className="col-md-12">
            <div className="card card-ss p-0">
              <div className="card-header card-header-ss p-4">
                <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-0 title-border">
                    Kehadiran
                  </h4>
                  <div className="d-flex align-items-center mt-md-0 mt-3 mx-md-0 mx-auto">
                    <a
                      className={`btn btn-switch-ss rounded-pill d-flex align-items-center justify-content-center py-2 fw-bold me-3 ${
                        kehadiran == "guru" ? "active" : ""
                      }`}
                      style={{ width: "90px" }}
                      onClick={() => setKehadiran("guru")}
                    >
                      GTK
                    </a>
                    <a
                      className={`btn btn-switch-ss rounded-pill d-flex align-items-center justify-content-center py-2 fw-bold ${
                        kehadiran == "siswa" ? "active" : ""
                      }`}
                      style={{ width: "90px" }}
                      onClick={() => setKehadiran("siswa")}
                    >
                      Siswa
                    </a>
                  </div>
                </div>
              </div>
              <hr className="hr-ss m-0" />
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-lg-3 col-md-6">
                    <div
                      className="p-4 bg-no-repeat rounded-ss"
                      style={{
                        background: `url("/img/bg-kehadiran-pengawasan-hadir.png")`,
                        backgroundColor: "#FAFAFA",
                        backgroundPositionX: "right",
                        backgroundPositionY: "top",
                      }}
                    >
                      <h1 className="fw-extrabold color-primary mb-2">
                        {absen?.[kehadiran]?.hadir}
                      </h1>
                      <h6 className="fs-18-ss fw-bold mb-0">Hadir</h6>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div
                      className="p-4 bg-no-repeat rounded-ss"
                      style={{
                        background: `url("/img/bg-kehadiran-pengawasan-sakit.png")`,
                        backgroundColor: "#FAFAFA",
                        backgroundPositionX: "right",
                        backgroundPositionY: "top",
                      }}
                    >
                      <h1 className="fw-extrabold color-primary mb-2">
                        {absen?.[kehadiran]?.sakit}
                      </h1>
                      <h6 className="fs-18-ss fw-bold mb-0">Sakit</h6>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div
                      className="p-4 bg-no-repeat rounded-ss"
                      style={{
                        background: `url("/img/bg-kehadiran-pengawasan-izin.png")`,
                        backgroundColor: "#FAFAFA",
                        backgroundPositionX: "right",
                        backgroundPositionY: "top",
                      }}
                    >
                      <h1 className="fw-extrabold color-primary mb-2">
                        {absen?.[kehadiran]?.izin}
                      </h1>
                      <h6 className="fs-18-ss fw-bold mb-0">Izin</h6>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div
                      className="p-4 bg-no-repeat rounded-ss"
                      style={{
                        background: `url("/img/bg-kehadiran-pengawasan-alpa.png")`,
                        backgroundColor: "#FAFAFA",
                        backgroundPositionX: "right",
                        backgroundPositionY: "top",
                      }}
                    >
                      <h1 className="fw-extrabold color-primary mb-2">
                        {(kehadiran == "siswa" ? dataSiswa : dataGTK)?.total -
                          absen?.[kehadiran]?.sakit -
                          absen?.[kehadiran]?.izin -
                          absen?.[kehadiran]?.hadir}
                      </h1>
                      <h6 className="fs-18-ss fw-bold mb-0">Alpa</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-4 g-4">
          <div className="col-md-6">
            <div className="card card-ss p-0">
              <div
                className="card-header card-header-ss px-4 py-3 bg-no-repeat bg-cover"
                style={{
                  background: `url("/img/bg-card-pengawasan-jumlah-gtk.png")`,
                  backgroundPositionX: "right",
                  //   backgroundPositionY: "bottom",
                }}
              >
                <h4 className="title-border fw-extrabold color-dark mb-0">
                  Jumlah GTK
                </h4>
              </div>
              <div className="card-body p-4">
                <GrafikGuruPengawas
                  jumlahLaki={jumlahGuru?.laki?.[0]?.total}
                  jumlahPerempuan={jumlahGuru?.wanita?.[0]?.total}
                />
                <hr className="hr-ss my-3" />
                <div className="d-flex">
                  <img
                    src="/img/icon-user.svg"
                    alt="icon-user"
                    className="me-2"
                  />
                  <p className="mb-0 color-dark fw-semibold">
                    Jumlah Total Guru:{" "}
                    <span className="fw-extrabold">{dataGTK?.total} orang</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card card-ss p-0">
              <div
                className="card-header card-header-ss px-4 py-3 bg-no-repeat bg-cover"
                style={{
                  background: `url("/img/bg-card-pengawasan-jumlah-siswa.png")`,
                  backgroundPositionX: "right",
                  //   backgroundPositionY: "bottom",
                }}
              >
                <h4 className="title-border fw-extrabold color-dark mb-0">
                  Jumlah Siswa
                </h4>
              </div>
              <div className="card-body p-4">
                <GrafikSiswaPengawas jurusanData={jumlahSiswa} />
                <hr className="hr-ss my-3" />
                <div className="d-flex">
                  <img
                    src="/img/icon-anggota.svg"
                    alt="icon-user"
                    className="me-2"
                  />
                  <p className="mb-0 color-dark fw-semibold">
                    Jumlah Total Siswa:{" "}
                    <span className="fw-extrabold">
                      {dataSiswa?.total} orang
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row g-4 mb-4">
          <div className="col-md-12">
            <div className="card card-ss p-0">
              <div className="card-header card-header-ss p-4">
                <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-0 title-border">
                    Serapan Penerimaan PKL
                  </h4>
                  <div className="d-flex align-items-center mt-md-0 mt-3 mx-md-0 mx-auto">
                    <a className="btn btn-switch-ss active rounded-pill fw-bold py-2 px-4 me-3">
                      Jurusan
                    </a>
                    <a className="btn btn-switch-ss rounded-pill fw-bold py-2 px-4">
                      Kelas
                    </a>
                  </div>
                </div>
              </div>
              <hr className="hr-ss m-0" />
              <div className="card-body p-4">
                <div className="d-flex align-items-md-center flex-md-row flex-column">
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
                        {dataSiswa?.total} Orang
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
                        187 Orang
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="row">
                  <div className="col-md-6 col-12 d-flex align-items-center">
                    <h4 className="title-border fw-extrabold color-dark mb-0">
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
                            <th>Status</th>
                            <th>Detail</th>
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
                                <td data-th="Status">
                                  <span
                                    className={`label-light-${
                                      countRPP == 27 ? "success" : "danger"
                                    }-ss label-ss fs-12-ss fw-semibold rounded-pill`}
                                  >
                                    {countRPP}
                                    /27 Instrumen
                                  </span>
                                </td>
                                <td data-th="Detail">
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

export async function getServerSideProps({ query: { page, search, token } }) {
  return {
    props: {
      page: page || null,
      search: search || null,
      token: token || null,
    },
  };
}

export default index;
