import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Ekskul`,
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
              Ekstrakulikuler
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content">Ekstrakulikuler</h2>
              <div className="row mb-5">
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/osis.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">OSIS</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/mpk.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">MPK</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/pik-r.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">PIK R SERSAN</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/paskib.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">PASKIBRA</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/rohis.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Rohis</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/pmr.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">PMR</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/student-company.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Student Company</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/pramuka.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Pramuka</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/taekwondo.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Taekwondo</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/silat.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Pencak Silat</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/tari.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Tari</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/voli.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">Voli</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mb-5">
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/tepepa.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">TEPEPA</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-ekskul mb-5">
                    <img
                      src="/tmp/images/nihon.jpg"
                      alt="card-img"
                      className="card-img"
                    />
                    <div className="card-body bg-primary">
                      <p className="card-text">NIHON</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
