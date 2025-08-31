import { NextSeo } from "next-seo";
import Link from "next/link";
import Layout from "../../../../components/BKK/Layout";
import Banner from "../../../../components/Web/Banner";
import Breadcrumb from "../../../../components/Web/Breadcrumb";

const Index = () => {
  const SEO = {
    title: `SMKN 26 Jakarta | Alumni`,
    description: "hala",
  };

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={"/images/banner-alumni.png"} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <Link href="/alumni">
              <li class="breadcrumb-item text-white" aria-current="page">
                Alumni
              </li>
            </Link>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content alumni-detail">
            <div className="col-md-10">
              <h2 className="title-content">Daftar Alumni</h2>
              <table class="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col" colSpan="2">
                      <h4 className="font-weight-bold">Harmony Ginting</h4>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">No Telpon / Whatsapp</th>
                    <td>081218002682</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>gintingh@gmail.com</td>
                  </tr>
                  <tr>
                    <th scope="row">Jenis Kelamin</th>
                    <td>Laki-Laki</td>
                  </tr>
                  <tr>
                    <th scope="row">Angkatan</th>
                    <td>Angkatan 4 (1978/1979)</td>
                  </tr>
                  <tr>
                    <th scope="row">Jurusan</th>
                    <td>Bangunan Gedung</td>
                  </tr>
                  <tr>
                    <th scope="row">Sekolah Lanjutan</th>
                    <td>
                      <ul className="pl-0">
                        <li>1979 -1986 Sarjana Muda STTN Jakarta - Sipil.</li>
                        <li>1986 -1990 Sarjana STTN Jakarta - Struktur</li>
                        <li>
                          1992 - 1992 Colorado University - Finite Element.
                        </li>
                        <li>
                          1993 - 1995 Cleveland State University - Structural
                          Engineering
                        </li>
                        <li>1995 - 1996 Case Western University - Marketing</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Sertifikasi Keahlian</th>
                    <td>1990 Struktur HAKI DKI 1991 AMDAL</td>
                  </tr>
                  <tr>
                    <th scope="row">Industri</th>
                    <td>Alat Angkat Konstruksi</td>
                  </tr>
                  <tr>
                    <th scope="row">Wiraswasta</th>
                    <td>
                      <ul className="pl-0">
                        <li>
                          (1988 - 1992) PT Shasanatana Adyaconsult - Housing
                          Design.
                        </li>
                        <li>
                          (1997 - 2015) PT Shasanatama Consult, Building
                          Consultant and Designer. Wooden Products and Outdoor
                          Furniture Exporter with brand ITHO Furniture.
                        </li>
                        <li>
                          (2002 - 2015) PT ITHO INDOSTOCK, Stock Marker IT
                          Developer and Education System.
                        </li>
                        <li>
                          (2012 - Present) PT ZZF Industri Indonesia: Perusahaan
                          Alat Berat Konstruksi, Tower Crane, Passenger Hoist,
                          Mobile Crane, Concrete Batching Plant, Scaffolding
                          dll.
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Profesional</th>
                    <td>
                      <ul className="pl-0">
                        <li>(1979 - 1981) PT CIRIAJASA TOTAL DESIGN</li>
                        <li>
                          (1981 - 1983) PT TJIRIADHARMA Building Construction
                        </li>
                        <li>
                          (1984 - 1985) PT DUTA INDONESIA - Sunter Agung
                          Podomoro.
                        </li>
                        <li>
                          (1985 - 1988) PT Nalakarya Pratama - Dumas Shipyard
                          Graving Dock Project Tj Perak
                        </li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Purnakarya</th>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
