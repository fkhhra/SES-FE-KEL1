import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import { NextSeo } from "next-seo";
import Layout from "../../components/Web/Layout";
import Link from "next/link";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Kegiatan Jum'at`,
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
              <h2 className="title-content">Produk Technopark</h2>
              <div className="row mb-5">
                <Link href="smart-hand-wash">
                  <div className="col-md-4 pointer">
                    <div className="card-ekskul mb-5">
                      <img
                        src="/tmp/images/smart-hand-wash.png"
                        alt="card-img"
                        className="card-img"
                      />
                      <div className="card-body bg-primary">
                        <p className="card-text">Smart Hand Washing Machine</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
