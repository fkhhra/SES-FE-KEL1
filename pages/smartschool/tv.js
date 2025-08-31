import { Pagination } from "antd";
import { LayoutContext } from "antd/lib/layout/layout";
import { getDashboardPengawas } from "client/PengawasClient";
import { meSekolah } from "client/SekolahClient";
import { getProfil } from "client/sharedClient";
import GrafikGuruPengawas from "components/Dinas/GrafikGuru";
import GrafikSiswaPengawas from "components/Dinas/GrafikSiswa";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { useDebounce } from "use-debounce";
import { ssURL, webURL } from "../../client/clientAxios";
import Layout from "../../components/Layout/Layout";
import AnimatePage from "../../components/Shared/AnimatePage/AnimatePage";
import Slider from './../../components/Web/Slider';
import TvSlider from './../../components/Web/TvSlider';
import { getBlog } from "client/PostClient";
import { momentPackage } from "utilities/HelperUtils";
import { getPerpus } from "client/PerpusClient";

const tv = ({ page, search: searchQuery }) => {
  const { sekolah, setSekolah } = useSekolah();

  const [kehadiranGuru, setKehadiranGuru] = useState("guru");
  const [kehadiranSiswa, setKehadiranSiswa] = useState("guru");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);

  const [absen, setAbsen] = useState({});
  const [dataGTK, setDataGTK] = useState({});
  const [dataSiswa, setDataSiswa] = useState({});
  const [jumlahGuru, setJumlahGuru] = useState({});
  const [jumlahSiswa, setJumlahSiswa] = useState([]);
  const [postData, setPostData] = useState([]);
  const [perpusData, setPerpusData] = useState([]);

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200) {
      if (data.user?.role == "ppdb") {
        router.push(`${ppdbURL}`);
      }
    }

    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          return;
        }
        router.push(data?.sekolah?.domainBackup);
      }
      setSekolah(data.sekolah);
    }
  };

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

  const getPostData = async () => {
    const { data } = await getBlog();

    if (data) {
      setPostData(data);
    }
  };

  const getPerpusData = async () => {
    setLoading(true);

    const { data } = await getPerpus({nav: 'buku-sekolah', urutkan: 'terbaru'});
    if (data) {
      setPerpusData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // getProfilData();
    getMeSekolahData();
    getPostData();
    getPerpusData();
  }, []);

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
    // <Layout>
    <AnimatePage>
      <div className="row mb-4">
        <div className="col-md-12">
          <div
            className="card card-ss bg-white p-4 bg-no-repeat rounded-ss "
            style={{
              background: `url("/img/bg-sekolah-pengawasan.png")`,
              backgroundColor: "#FAFAFA",
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div className="d-flex align-items-center">
              <Link href={`${ssURL}`}>
                <a
                  className="text-decoration-none fw-bolder position-relative color-primary pointer"
                  data-joyride="button-kembali"
                >
                  <FaChevronLeft />
                </a>
              </Link>
              <div className="d-flex align-items-center ms-3">
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
      </div>
      <TvSlider>
        {postData?.post?.map((d) => {
          return (
            <div className='w-100 h-100 bg-white d-flex justify-content-center align-items center px-5' key={d?.id}>
              <div className='w-100 h-100'>
                    <div className='d-flex align-items-center justify-content-center w-100 h-100 gap-5'>
                    <img src={d?.banner} className='img-fluid' style={{minHeight: '400px'}}/>
                      <div>
                        <h4 className='fw-black color-primary'>BERITA</h4>
                        <h5 className='fw-black text-uppercase'>{d?.judul}</h5>
                        <p className='fw-bold'>{momentPackage(d?.createdAt).format("DD MMMM YYYY")}</p>
                        <div className='fs-14-ss my-4' dangerouslySetInnerHTML={{__html: d?.konten}} />
                        <Link href={`${webURL}/blog/${d?.id}`}>
                          <button className='btn btn-ss btn-primary btn-primary-ss fs-18-ss fw-bold rounded-pill shadow-primary-ss'>Lihat Berita</button>
                        </Link>
                      </div>
                  </div>
              </div>
            </div>
          )
        })}
        </TvSlider>
        <div className="row mb-4">
        <div className="col-md-12">
          <div
            className="card card-ss bg-white p-4 bg-no-repeat rounded-ss "
            style={{
              background: `url("/img/bg-sekolah-pengawasan.png")`,
              backgroundColor: "#FAFAFA",
              backgroundPositionX: "right",
              backgroundPositionY: "bottom",
            }}
          >
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center ms-3 w-100">
                <img
                  src={
                    sekolah?.favicon ||
                    "https://firebasestorage.googleapis.com/v0/b/smart-school-300211.appspot.com/o/1641454372683-Icon-Smart-School.png?alt=media&token=febf1002-9f75-464c-8362-7e4f24ada4b6"
                  }
                  alt="logo-sekolah"
                  className="img-fit-contain"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="w-100 text-center">
                  <h2 className="fw-black color-dark mb-1 text-uppercase">selamat datang di perpustakaan</h2>
                  <h3 className="fw-black color-dark mb-1 text-uppercase">{sekolah?.id == 8027 && 'muhammad yamin'} {sekolah?.nama}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <TvSlider>
          {perpusData?.perpus?.map((d) => {
            return (
            <div className='w-100 h-100 bg-white d-flex justify-content-center align-items center px-5' key={d?.id}>
              <div className='w-100 h-100'>
                <div className='d-flex align-items-center justify-content-center w-100 h-100 gap-5'>
                    <img src={d?.cover} className='img-fluid' style={{maxHeight: '400px'}}/>
                    <div style={{maxWidth: '600px'}}>
                      <h4 className='fw-black color-primary'>PERPUSTAKAAN</h4>
                      <h5 className='fw-black text-uppercase'>{d?.judul}</h5>
                      <p className='fw-bold'>{d?.penulis}</p>
                      <p className='fs-14-ss my-4'>NOMOR RAK : {d?.noRak || '-'}</p>
                      <Link href={`${ssURL}/perpustakaan/${d?.id}`}>
                        <button className='btn btn-ss btn-primary btn-primary-ss fs-18-ss fw-bold rounded-pill shadow-primary-ss'>Lihat Buku</button>
                      </Link>
                    </div>
                </div>
              </div>
            </div>
            )
          })}
        </TvSlider>
      <div className="row mb-4 g-4">
        <div className="col-md-6">
          <div className="card card-ss p-0 h-100">
            <div className="card-header card-header-ss p-4 ">
              <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                <h4 className="fw-extrabold color-dark mb-0 title-border">
                  Kehadiran GTK
                </h4>
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
                      {absen?.[kehadiranGuru]?.hadir}
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
                      {absen?.[kehadiranGuru]?.sakit}
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
                      {absen?.[kehadiranGuru]?.izin}
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
                      {dataGTK?.total -
                        absen?.[kehadiranGuru]?.sakit -
                        absen?.[kehadiranGuru]?.izin -
                        absen?.[kehadiranGuru]?.hadir}
                    </h1>
                    <h6 className="fs-18-ss fw-bold mb-0">Alpa</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                height={60}
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
      </div>
      <div className="row g-4" style={{paddingBottom: '100px'}}>
        <div className="col-md-6">
          <div className="card card-ss p-0 h-100">
            <div className="card-header card-header-ss p-4">
              <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column">
                <h4 className="fw-extrabold color-dark mb-0 title-border">
                  Kehadiran Siswa
                </h4>
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
                      {absen?.[kehadiranSiswa]?.hadir}
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
                      {absen?.[kehadiranSiswa]?.sakit}
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
                      {absen?.[kehadiranSiswa]?.izin}
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
                      {dataSiswa?.total -
                        absen?.[kehadiranSiswa]?.sakit -
                        absen?.[kehadiranSiswa]?.izin -
                        absen?.[kehadiranSiswa]?.hadir}
                    </h1>
                    <h6 className="fs-18-ss fw-bold mb-0">Alpa</h6>
                  </div>
                </div>
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
              <GrafikSiswaPengawas height={60} jurusanData={jumlahSiswa} />
              <hr className="hr-ss my-3" />
              <div className="d-flex">
                <img
                  src="/img/icon-anggota.svg"
                  alt="icon-user"
                  className="me-2"
                />
                <p className="mb-0 color-dark fw-semibold">
                  Jumlah Total Siswa:{" "}
                  <span className="fw-extrabold">{dataSiswa?.total} orang</span>
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
    </AnimatePage>
    // </Layout>
  );
};

export async function getServerSideProps({ query: { page, search } }) {
  return {
    props: {
      page: page || null,
      search: search || null,
      //   token: token || null,
    },
  };
}

export default tv;
