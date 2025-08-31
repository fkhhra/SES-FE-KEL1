import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Literasi`,
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
                Publikasi
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Literasi
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content">Literasi</h2>
              <div className="berita">
                <div className="row">
                  <div className="berita-img col-md-6">
                    <img
                      src="/tmp/images/berita.jpg"
                      alt="gambar-berita"
                      className="img-fluid"
                    />
                  </div>
                  <div className="berita-content col-md-6">
                    <h4 className="font-weight-bold mb-3">
                      Lorem ipsum, dolor sit amet consectetur adipisicing.
                    </h4>
                    <p className="berita-content-text font-weight-normal mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Quaerat facilis nam doloremque nemo id nulla dolorum nobis
                      deleniti aliquid explicabo.
                    </p>
                    <p>15 - 10 - 2020</p>
                    <div className="btn btn-primary rounded-pill">
                      Lihat Detail
                    </div>
                  </div>
                </div>
                <hr className="my-5" />
              </div>
              <div className="berita">
                <div className="row">
                  <div className="berita-img col-md-6">
                    <img
                      src="/tmp/images/berita.jpg"
                      alt="gambar-berita"
                      className="img-fluid"
                    />
                  </div>
                  <div className="berita-content col-md-6">
                    <h4 className="font-weight-bold mb-3">
                      Lorem ipsum, dolor sit amet consectetur adipisicing.
                    </h4>
                    <p className="berita-content-text font-weight-normal mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Quaerat facilis nam doloremque nemo id nulla dolorum nobis
                      deleniti aliquid explicabo.
                    </p>
                    <p>15 - 10 - 2020</p>
                    <div className="btn btn-primary rounded-pill">
                      Lihat Detail
                    </div>
                  </div>
                </div>
                <hr className="my-5" />
              </div>
              <div className="berita">
                <div className="row">
                  <div className="berita-img col-md-6">
                    <img
                      src="/tmp/images/berita.jpg"
                      alt="gambar-berita"
                      className="img-fluid"
                    />
                  </div>
                  <div className="berita-content col-md-6">
                    <h4 className="font-weight-bold mb-3">
                      Lorem ipsum, dolor sit amet consectetur adipisicing.
                    </h4>
                    <p className="berita-content-text font-weight-normal mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Quaerat facilis nam doloremque nemo id nulla dolorum nobis
                      deleniti aliquid explicabo.
                    </p>
                    <p>15 - 10 - 2020</p>
                    <div className="btn btn-primary rounded-pill">
                      Lihat Detail
                    </div>
                  </div>
                </div>
                <hr className="my-5" />
              </div>
              <div className="berita">
                <div className="row">
                  <div className="berita-img col-md-6">
                    <img
                      src="/tmp/images/berita.jpg"
                      alt="gambar-berita"
                      className="img-fluid"
                    />
                  </div>
                  <div className="berita-content col-md-6">
                    <h4 className="font-weight-bold mb-3">
                      Lorem ipsum, dolor sit amet consectetur adipisicing.
                    </h4>
                    <p className="berita-content-text font-weight-normal mb-3">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Quaerat facilis nam doloremque nemo id nulla dolorum nobis
                      deleniti aliquid explicabo.
                    </p>
                    <p>15 - 10 - 2020</p>
                    <div className="btn btn-primary rounded-pill">
                      Lihat Detail
                    </div>
                  </div>
                </div>
                <hr className="my-5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
