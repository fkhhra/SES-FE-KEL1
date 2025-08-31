import Link from "next/link";
import { useEffect, useState } from "react";
import { webURL } from "../../client/clientAxios";
import { getInformasiSekolah } from "../../client/InformasiSekolahClient";
import { getPost } from "../../client/PostClient";
import { meSekolah } from "../../client/SekolahClient";
import { getSlider } from "../../client/SliderClient";
import CardBerita from "../../components/Web/CardBerita";
import Layout from "../../components/Web/Layout";
import MyCountUp from "../../components/Web/MyCountUp";
import Slider from "../../components/Web/Slider";
import useInformasiJurusan from "../../hooks/useInformasiJurusan";

const Home = () => {
  const [informasiSekolahData, setInformasiSekolahData] = useState({});
  const [sliderData, setSliderData] = useState([]);
  const [beritaData, setBeritaData] = useState([]);
  const { slider } = sliderData;

  const [sekolah, setSekolah] = useState({});
  const { informasiJurusan } = useInformasiJurusan();

  const getPublikasiData = async () => {
    const params = {
      section: "beranda",
    };

    const { data } = await getInformasiSekolah(params);
    if (data) {
      setInformasiSekolahData(data);
    }
  };

  const getSlidersData = async () => {
    const { data } = await getSlider();
    if (data) {
      setSliderData(data);
    }
  };

  const getPostData = async () => {
    const { data } = await getPost();
    if (data) {
      setBeritaData(data.post);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  useEffect(() => {
    getPublikasiData();
    getSlidersData();
    getPostData();
    getMeSekolahData();
  }, []);

  return (
    <Layout>
      <Slider>
        {slider?.map((d, idx) => (
          <div
            key={`${idx}-${new Date().getTime()}`}
            className="slider-body"
            data-src={d?.banner}
          >
            <div className="title-border">
              {/* <i>Moto Kami</i> */}
              <h1 className="fw-black font-italic fst-italic text-uppercase">
                {d?.judul}
              </h1>
            </div>
            <p className="ms-3">{d?.deskripsi}</p>
          </div>
        ))}
      </Slider>
      <section className="selamat-datang py-5 my-5" id="selamat-datang">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-8">
              <div className="section-header">
                <h3 className="color-dark fw-extrabold title-section">
                  Selamat Datang di {sekolah?.nama}
                </h3>
                <p
                  className="py-2 container dangerous-html color-secondary fw-semibold"
                  dangerouslySetInnerHTML={{
                    __html: sekolah?.informasi?.deskripsiSingkat,
                  }}
                  style={{ fontFamily: "Nunito Sans" }}
                />
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="row mt-5 justify-content-between">
              <div className="col-md-1"></div>
              <div className="col-md-4">
                <h4 className="title-border color-dark fw-extrabold">Visi</h4>
                <p
                  className="font-italic text-visi py-5 px-4 dangerous-html"
                  dangerouslySetInnerHTML={{ __html: sekolah?.informasi?.visi }}
                />
              </div>
              <div className="col-md-4">
                <h4 className="title-border color-dark fw-extrabold">Misi</h4>
                <div
                  className="dangerous-html"
                  dangerouslySetInnerHTML={{ __html: sekolah?.informasi?.misi }}
                />
              </div>
              <div className="col-md-1"></div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-5 why-us"
        style={{
          background: `linear-gradient(
        to bottom,
        rgba(7, 0, 66, 0.6),
        rgba(4, 0, 36, 0.65)
  ), url(${sekolah?.informasi?.backgroundSectionMengapa})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="row justify-content-between flex-lg-row flex-column">
            <div className="col-md-6">
              <h3 className="title-border fw-extrabold text-white">
                Mengapa Harus {sekolah?.nama}?
              </h3>
              <div className="row mt-4 mb-4">
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/img/icon-siswa.svg"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={sekolah?.informasi?.jumlahSiswa} />
                    <div className="h5 fw-bold text-white">Siswa</div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/img/icon-guru.svg"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={sekolah?.informasi?.jumlahGuru} />
                    <div className="h5 fw-bold text-white">Guru</div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/img/icon-kelas.svg"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={sekolah?.informasi?.jumlahKelas} />
                    <div className="h5 fw-bold text-white">Kelas</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="video-profil"
                style={{
                  width: "387px",
                  height: "314px",
                  backgroundImage: `url(/img/frame-video.svg)`,
                }}
              >
                <img
                  src={sekolah?.informasi?.thumbnailProfil}
                  alt="video"
                  style={{
                    width: "300px",
                    height: "250px",
                    top: "11.5%",
                    left: "12.25%",
                  }}
                  className="img-fit-cover position-absolute"
                />
                <div className="video-icon">
                  <a href={sekolah?.informasi?.videoProfil}>
                    <img src="/img/button-play.png" alt="button-play" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 kompetensi-keahlian">
        <div className="container">
          <h3 className="fw-extrabold color-dark text-center mb-5 title-section">
            Kompetensi Keahlian
          </h3>
          <div className="row">
            {informasiJurusan?.jurusan?.map((d, idx) => (
              <div
                key={`${idx}-${new Date().getTime()}`}
                className="col-md-4 d-flex justify-content-center"
              >
                <Link
                  href={`${webURL}/jurusan/[id]`}
                  as={`${webURL}/jurusan/${d?.id}`}
                >
                  <div className="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                    <img
                      src={d?.informasi?.cover}
                      alt="kgsp"
                      className="position-absolute"
                    />
                    {d?.informasi?.logo && (
                      <img
                        src="/tmp/images/icon-kgsp.png"
                        alt="icon"
                        className="icon-jurusan"
                      />
                    )}
                    {!d?.informasi?.logo && (
                      // <div className="icon-jurusan">{d?.nama}</div>
                      <div className="icon-jurusan btn btn-ss btn-primary btn-primary-ss rounded-pill shadow-primary-ss">
                        Lihat Detail
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="virtual-tour py-5"
        style={{
          background: `linear-gradient(
        to bottom,
        rgba(7, 0, 66, 0.6),
        rgba(4, 0, 36, 0.65)
  ), url(${sekolah?.informasi?.backgroundSectionVirtualTour})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <img
                src="/img/icon-virtual-tour.png"
                alt="poto"
                width="75px"
                className="d-block mx-auto rounded-circle"
              />
              <h3 className="fw-extrabold my-3 text-white">
                Mulai Pengalaman Jelajah Sekolah
              </h3>
              <p className="container-small text-white mb-4">
                Ikuti Jelajah Sekolah kami secara online kami untuk melihat
                secara langsung kondisi sarana dan prasarana yang ada di{" "}
                {sekolah?.nama} kapan saja dan dari lokasi mana saja.
              </p>
              <a
                href={sekolah?.informasi?.virtualTour}
                target="_blank"
                className="btn btn-ss btn-primary-ss btn-primary rounded-pill shadow-primary-ss"
              >
                Mulai Tour
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="berita-dan-literasi py-5">
        <div className="container">
          <div className="btn btn-outline-primary rounded-pill info-terbaru mb-4">
            Informasi Terbaru
          </div>
          <h3 className="fw-extrabold color-dark  mb-5 title-section">
            Berita dan literasi
          </h3>
          <div className="row">
            {beritaData?.map((berita) => (
              <div className="col-md-4 col-lg-3">
                <CardBerita
                  judul={berita.judul}
                  createdAt={berita.createdAt}
                  banner={berita.banner}
                  id={berita.id}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
