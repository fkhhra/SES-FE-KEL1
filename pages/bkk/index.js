import Layout from "../../components/BKK/Layout";

const Home = () => {
  return (
    <Layout>
      {/* ===== Hero Section Start =====*/}
      <section className="hero-section">
        <div className="container mx-auto pt-5" id="beranda">
          <div className="row mt-5 pt-5">
            <div className="col text-center">
              <div className="section-header mb-5">
                <h1 className="title-section text-white">
                  Pusat Pengembangan Karir Siswa
                </h1>
              </div>
              <h2 className="btn btn-primary rounded-pill mt-5 py-3 px-4">
                Kembangkan Karirmu
              </h2>
            </div>
          </div>
        </div>
      </section>
      {/* ===== Hero Section End =====*/}

      {/* <Slider>
        <div className="slider-body" data-src="/images/bg-slider-1.png">
          <div className="title-border">
            <i>Moto Kami</i>
            <h2 className="font-weight-bold font-italic text-uppercase">
              Belajar
            </h2>
          </div>
          <p className="ml-4 pl-1">Program Pendidikan salama 4 tahun.</p>
        </div>
        <div className="slider-body" data-src="/images/bg-slider-2.png">
          <div className="title-border">
            <i>Moto Kami</i>
            <h2 className="font-weight-bold font-italic text-uppercase">
              Bekerja
            </h2>
          </div>
          <p className="ml-4 pl-1">
            Program PKL 1 tahun membuat siap dengan dunia industri
          </p>
        </div>
        <div className="slider-body" data-src="/images/bg-slider-3.png">
          <div className="title-border">
            <i>Moto Kami</i>
            <h2 className="font-weight-bold font-italic text-uppercase">
              Membangun
            </h2>
          </div>
          <p className="ml-4 pl-1">
            Ikatan alumni yang erat demi memajukan sekolah tercinta
          </p>
        </div>
      </Slider> */}

      {/* <section className="selamat-datang py-5 my-5" id="selamat-datang">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-8">
              <div className="section-header">
                <h3 className="font-weight-bold title-section">
                  Selamat Datang di SMK NEGERI 26 JAKARTA
                </h3>
                <p className="py-2 container">
                  SMK Negeri 26 Jakarta atau yang dulunya dikenal sebagai STM
                  Negeri Pembangunan Jakarta adalah merupakan sebuah Sekolah
                  Menengah Kejuruan Negeri yang mempunyai program pendidikan
                  selama 4 tahun.
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="row mt-5 justify-content-between">
              <div className="col-md-1"></div>
              <div className="col-md-4">
                <h4 className="title-border">Visi</h4>
                <p className="font-italic text-visi py-5 px-4">
                  " Menjadi yang terbaik dengan keunggulan prestasi dan
                  berakhlak mulia. "
                </p>
              </div>
              <div className="col-md-4">
                <h4 className="title-border">Misi</h4>
                <ol className="pl-4">
                  <li>Menerapkan Sistem Manajemen Mutu ISO 9001: 2008.</li>
                  <li>
                    Meningkatkan profesionalisme sumber daya manusia melalui
                    pendidikan dan latihan.
                  </li>
                  <li>
                    Meningkatkan mutu pembelajaran berbasis kompetensi, bekerja
                    sama dengan dunia usaha dan dunia industri.
                  </li>
                  <li>
                    Menanamkan kemandirian, profesionalisme kepada seluruh
                    peserta didik melalui bimbingan yang optimal.
                  </li>
                </ol>
              </div>
              <div className="col-md-1"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 why-us">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6">
              <h3 className="title-border font-weight-bold text-white">
                Mengapa Harus SMK Negeri 26 Jakarta?
              </h3>
              <div className="row mt-4 mb-4">
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/images/icon-siswa.png"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={1436} />
                    <div className="h5 font-weight-bold text-white">Siswa</div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/images/icon-guru.png"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={90} />
                    <div className="h5 font-weight-bold text-white">Guru</div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="text-center">
                    <img
                      src="/images/icon-kelas.png"
                      alt="poto"
                      width="72px"
                      className="d-block mx-auto rounded-circle"
                    />
                    <MyCountUp nilai={40} />
                    <div className="h5 font-weight-bold text-white">Kelas</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="video-profil">
                <img
                  src="/images/video-profil.png"
                  className="img-fluid"
                  alt="video"
                />
                <div className="video-icon">
                  <a href="https://www.youtube.com/watch?v=AZ3sA2RvPZo&t=1s">
                    <img src="/images/button-play.png" alt="button-play" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 kompetensi-keahlian">
        <div className="container">
          <h3 className="font-weight-bold text-center mb-5 title-section">
            Kompetensi Keahlian
          </h3>
          <div className="row">
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="/kgsp">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/kgsp.png"
                    alt="kgsp"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-kgsp.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="/tedk">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/tedk.png"
                    alt="tedk"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-tedk.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="/ttl">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/ttl.png"
                    alt="ttl"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-ttl.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="tflm">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/tflm.png"
                    alt="tflm"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-tflm.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="/tmpo">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/tmpo.png"
                    alt="tmpo"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-tmpo.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
            <div className="col-md-4 d-flex justify-content-center">
              <Link href="/sija">
                <div class="card text-white mb-4 image-jurusan position-relative overflow-hidden">
                  <img
                    src="/images/sija.png"
                    alt="sija"
                    className="position-absolute"
                  />
                  <img
                    src="/images/icon-sija.png"
                    alt="icon"
                    className="icon-jurusan"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="virtual-tour py-5">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <img
                src="/images/icon-virtual-tour.png"
                alt="poto"
                width="75px"
                className="d-block mx-auto rounded-circle"
              />
              <h3 className="font-weight-bold my-3 text-white">
                Mulai Pengalaman Jelajah Sekolah
              </h3>
              <p className="container-small text-white mb-4">
                Ikuti Jelajah Sekolah kami secara online kami untuk melihat secara
                langsung kondisi sarana dan prasarana yang ada di SMK Negeri 26
                Jakarta kapan saja dan dari lokasi mana saja.
              </p>
              <a
                href="https://app.lapentor.com/sphere/smkn-26-1602643278?scene=5f87dd1c362df77f177c1f53"
                target="_blank"
                className="btn btn-primary rounded-pill"
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
          <h3 className="font-weight-bold mb-5 title-section">
            Berita dan literasi
          </h3>
          <div className="row">
            <div className="col-md-4 col-lg-3">
              <CardBerita />
            </div>
            <div className="col-md-4 col-lg-3">
              <CardBerita />
            </div>
            <div className="col-md-4 col-lg-3">
              <CardBerita />
            </div>
            <div className="col-md-4 col-lg-3">
              <CardBerita />
            </div>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Home;
