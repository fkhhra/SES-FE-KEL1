import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Jam Sekolah`,
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
                Profil
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Jam Sekolah
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content">Jam Sekolah</h2>
              <p>Menunggu data...</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
