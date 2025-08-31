import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Sejarah Sekolah`,
    description: "hala",
  };

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={"/tmp/images/banner-1.png"} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Kegiatan
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Technopark
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content">Smart Hand Washing Machine</h2>
              <img
                src="/tmp/images/smart-hand-wash-detail.png"
                alt="smart-hand-wash"
                className="mb-5 img-fluid"
                width="720px"
                height="477px"
              />
              <img
                src="/tmp/images/smart-hand-wash-detail-2.jpeg"
                alt="smart-hand-wash"
                className="mb-5 img-fluid"
                width="720px"
              />
              <p>
                Smart Hand Washing Machine merupakan produk ciptaan siswa siswa
                Smartschool dalam program Technopark. Produk ini mempunyai 3
                keistimewaan. Pertama, produk ini menggabungkan 2 protokol
                kesehatan yaitu mencuci tangan dan mengecek suhu tubuh, jadi
                dengan menggunakan produk ini pengguna dapat melakukan 2
                kegiatan protokol kesehatan secara bersamaan yang mana dapat
                mencuci tangan dan mengecek suhu tubuh secara otomatis.
                Keistimewaan yang kedua dari produk ini adalah alat ini dapat
                melakukan semuanya serba otomatis, pengguna hanya perlu
                mendekatkan tangan ke depan produk ini maka alat akan secara
                otomatis mengeluarkan air untuk mencuci tangan, disamping itu
                alat juga dapat secara otomatis mengecek suhu badan pengguna.
                Keistimewaan yang ketiga dari alat ini yaitu alat ini
                menggunakan tenaga surya. Dengan begitu alat ini sangat ramah
                lingkungan karena menggunakan energi yang berasal dari energi
                matahari.
              </p>
              <p>
                Ide produk ini didasari oleh keadaan pandemik covid - 19, dengan
                keadaan pandemik ini sebagai anak bangsa kami ingin turut andil
                dalam pencegahan covid - 19, dan mendapatkan ide untuk
                menggabungkan 2 protokol kesehatan menjadi satu yang mana dapat
                dilakukan secara bersamaan. Atas dasar ide tersebut akhirnya
                produk ini dikembangkan dengan tujuan untuk mendukung pencegahan
                covid - 19. Produk ini terbuat dengan mengkolaborasikan 3
                kompetensi Keahlian yang ada di Smartschool, yang diantaranya
                yaitu : Teknik Fabrikasi Logam dan Manufaktur, Teknik Tenaga
                Listrik, dan Teknik Elektronika Daya dan Aplikasi. Dengan
                mengkolaborasikan 3 kompetensi Keahlian tersebut produk Smart
                Hand Washing Machine ini pun akhirnya dapat dikembangkan dan
                dapat diwujudkan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
