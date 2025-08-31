import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ppdbURL, ssURL, webURL } from "../client/clientAxios";
import { meSekolah } from "../client/SekolahClient";

export default function Home() {
  const [sekolahData, setSekolahData] = useState({});
  const { sekolah } = sekolahData;
  const router = useRouter();

  const meSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data.sekolah?.id == 5 || data.sekolah?.id == 55) {
        router.push("/smartschool/login");
      }

      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          setSekolahData(data);
          return;
        }

        router.push(data?.sekolah?.domainBackup);
      }

      setSekolahData(data);
    }
  };

  useEffect(() => {
    meSekolahData();
    // router.push("/server-maintenance");
  }, []);

  return (
    <div className="landing-app">
      <Head>
        <link rel="shortcut icon" href={sekolah?.favicon} />
        <title>Smarteschool</title>
      </Head>
      <section className="hero">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-xxl-10">
              <h1 className="text-center fw-extrabold color-dark">
                Selamat Datang di <br />{" "}
                <div className="color-primary">Portal {sekolah?.nama}</div>
              </h1>
              <img
                src={`/img/landing/pusat-illustrasi.png`}
                alt="Landing Page"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center button-navigation flex-wrap">
            <Link href={ssURL}>
              <a className="text-decoration-none">
                <div className="mx-4  button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                  <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                    <div className="icon icon-smarteschool "></div>
                  </div>
                  <p className="mt-2 color-dark button-navigation-text fw-bold">
                    Smarteschool
                  </p>
                </div>
              </a>
            </Link>
            {sekolah?.trial &&
            moment(sekolah?.createdAt).format("YYYY-MM-DD") >
              moment("2021-11-12 00:00:00").format("YYYY-MM-DD") ? (
              <a
                href="https://smarteschool.id/event/gpds-mandiri?nav=materi-pelatihan"
                target="_blank"
              >
                <a className="text-decoration-none">
                  <div className="mx-4  button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                    <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                      <div className="icon icon-program-gpds"></div>
                    </div>
                    <p className="mt-2 color-dark button-navigation-text fw-bold">
                      Program GPDS
                    </p>
                  </div>
                </a>
              </a>
            ) : null}
            {/* <Link href={webURL}> */}
            {sekolah?.id == 7 && "https://smkn6tangsel.sch.id"}
            {sekolah?.id != 7 && (
              <Link href={sekolah?.linkWeb || webURL}>
                <a className="text-decoration-none">
                  <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                    <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                      <div className="icon icon-web"></div>
                    </div>
                    <p className="mt-2 color-dark button-navigation-text fw-bold">
                      {/* {sekolah?.id == 7 && "Website SMKN 6"}
                      {sekolah?.id != 7 && `Website ${sekolah?.nama}`} */}
                      Pusat Informasi
                    </p>
                  </div>
                </a>
              </Link>
            )}
            <a
              href={sekolah?.informasi?.virtualTour}
              target="_blank"
              className="text-decoration-none"
            >
              <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                  <div className="icon icon-virtual-tour"></div>
                </div>
                <p className="mt-2 color-dark button-navigation-text fw-bold">
                  Jelajah Sekolah
                </p>
              </div>
            </a>

            <Link href={ppdbURL}>
              <a className="text-decoration-none">
                <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                  <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                    <div className="icon icon-ppdb"></div>
                  </div>
                  <p className="mt-2 color-dark button-navigation-text fw-bold">
                    {sekolah?.tingkat == "kampus"
                      ? "Pendaftaran Mahasiswa"
                      : "PPDB"}
                  </p>
                </div>
              </a>
            </Link>

            {sekolah?.id == 33 && (
              <Link href={"https://smkyadika13-rkm.smarteschool.id"}>
                <a className="text-decoration-none">
                  <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                    <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                      <div className="icon icon-rapor"></div>
                    </div>
                    <p className="mt-2 color-dark button-navigation-text fw-bold text-center">
                      <div>Rapor</div>
                      Kurikulum Merdeka
                    </p>
                  </div>
                </a>
              </Link>
            )}

            {sekolah?.linkRapor ? (
              <a
                href={sekolah?.linkRapor}
                target="_blank"
                className="text-decoration-none"
              >
                <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                  <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                    <div className="icon icon-rapor"></div>
                  </div>
                  <p className="mt-2 color-dark button-navigation-text fw-bold">
                    E Rapor
                  </p>
                </div>
              </a>
            ) : null}

            {sekolah?.linkDapodik ? (
              <a
                href={sekolah?.linkDapodik}
                target="_blank"
                className="text-decoration-none"
              >
                <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                  <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                    <div className="icon icon-dapodik"></div>
                  </div>
                  <p className="mt-2 color-dark button-navigation-text fw-bold">
                    Dapodik
                  </p>
                </div>
              </a>
            ) : null}
            {/* <a href="#bkk" className="text-decoration-none">
              <div className="mx-4 button-navigation-items d-flex flex-column justify-content-center align-items-center ">
                <div className="button-navigation-icon d-flex justify-content-center align-items-center">
                  <div className="icon icon-ppdb"></div>
                </div>
                <p className="mt-2">BKK</p>
              </div>
            </a> */}
          </div>
        </div>
      </section>

      <article className="fitur mt-5" id="fitur">
        <div className="container">
          {/* <section id="buku-tamu" className="rounded-ss">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-8 order-md-1 order-2 fitur-content-text px-5 py-3">
                <h2 className="fw-extrabold color-dark">Buku Tamu</h2>
                <p className="my-4 fs-5 fw-semibold">
                  Silahkan isi buku tamu untuk mendata keperluan anda dengan
                  sekolah
                </p>
                <div className="fitur-content-text-button">
                  <Link href={btURL}>
                    <a className="btn btn-primary">Isi Sekarang</a>
                  </Link>
                </div>
              </div>
              <div className="col-md-4 order-md-2 order-1 text-md-start text-center pb-md-0 pb-4 pt-md-0 pt-4">
                <img
                  src={`/img/landing/icon-buku-tamu.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
            </div>
          </section> */}
          <section id="smart-school" className="my-5">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6 order-lg-2">
                <img
                  src={`/img/landing/Schooline.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5 order-lg-1 fitur-content-text">
                <h3 className="fw-extrabold color-dark">Smarteschool</h3>
                <p className="my-4 fw-semibold">
                  Smarteschool merupakan aplikasi penunjang kegiatan sekolah
                  maupun pendidikan secara digital, dengan memberikan berbagai
                  layanan yang dapat memudahkan segala aktivitas siswa, guru,
                  maupun tenaga ahli sekolah dalam menjalankan kegiatan belajar
                  mengajar yang berbasis online.
                </p>
                <div className="fitur-content-text-button">
                  <Link href={ssURL}>
                    <a className="btn btn-primary">Lihat Lebih Lanjut</a>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section id="pusat-informasi" className="my-5">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6">
                <img
                  src={`/img/landing/web-sekolah.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5 fitur-content-text">
                <h3 className="fw-extrabold color-dark">
                  Pusat Informasi {sekolah?.nama}
                </h3>
                <p className="my-4 fw-semibold">
                  Pusat Informasi {sekolah?.nama} menyediakan berbagai macam
                  informasi berupa, profile, rekam jejak akademis, artikel,
                  berita, kalender pembelajaran, sarana dan prasaranan dan masih
                  banyak layanan informasi lainnya yang dapat diakses secara
                  publik
                </p>
                <div className="fitur-content-text-button">
                  {/* <Link href={webURL}> */}
                  {sekolah?.id == 7 && "https://smkn6tangsel.sch.id"}
                  {sekolah?.id != 7 && (
                    <Link href={webURL}>
                      <a className="btn btn-primary">Lihat Lebih Lanjut</a>
                    </Link>
                  )}
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </section>
          <section id="virtual-tour" className="my-5">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6 order-lg-2">
                <img
                  src={`/img/landing/Virtual Tour.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5 fitur-content-text order-lg-1">
                <h3 className="fw-extrabold color-dark">Jelajah Sekolah</h3>
                <p className="my-4 fw-semibold">
                  Jelajah Sekolah memberikan layanan akses kepada publik untuk
                  dapat melihat secara langsung mengenai kondisi sarana dan
                  prasarana yang ada di {sekolah?.nama} secara online
                </p>
                <div className="fitur-content-text-button">
                  <a href={sekolah?.informasi?.virtualTour} target="_blank">
                    <div className="btn btn-primary">Lihat Lebih Lanjut</div>
                  </a>
                </div>
              </div>
            </div>
          </section>
          {/* <section id="bkk" className="my-5">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6">
                <img
                  src={`/img/landing/PPDB.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5 fitur-content-text">
                <h3 className="fw-extrabold color-dark">Bursa Kerja Khusus</h3>
                <p className="my-4 fw-semibold">
                  Pada fitur ini alumni {sekolah?.nama} dapat dikumpulkan guna
                  mensinergikan ikatan Alumni untuk kemajuan sekolah tercinta.
                  Dan juga info mengenai lowongan pekerjaan
                </p>
                <div className="fitur-content-text-button">
                  <Link href={bkkURL}>
                    <div className="btn btn-primary">Lihat Lebih Lanjut</div>
                  </Link>
                </div>
              </div>
            </div>
          </section> */}

          <section id="ppdb" className="my-5">
            <div className="row justify-content-between align-items-center">
              <div className="col-md-6">
                <img
                  src={`/img/landing/PPDB.png`}
                  alt="Fitur-1"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-5 fitur-content-text">
                <h3 className="fw-extrabold color-dark">PPDB</h3>
                <p className="my-4 fw-semibold">
                  Jadwal Penerimaan Peserta Didik Baru dan Mendaftar ada pada di
                  menu ini
                </p>
                <div className="fitur-content-text-button">
                  <Link href={ppdbURL}>
                    <div className="btn btn-primary">Lihat Lebih Lanjut</div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
      <footer className="bg-light">
        <div className="container py-4 text-center">
          <small>
            &copy;{sekolah?.nama} x Smarteschool 2021. Hak Cipta Dilindungi oleh
            Undang-Undang.
            <br />
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none"
            >
              Powered by Smarteschool.
            </a>
          </small>
        </div>
      </footer>
    </div>
  );
}
