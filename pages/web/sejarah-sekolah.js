import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";
import useSekolah from "../../hooks/useSekolah";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Sejarah Sekolah`,
    description: "hala",
  };

  const { sekolah } = useSekolah();

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={sekolah?.informasi?.bannerProfil} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Profil
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Sejarah Sekolah
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                Sejarah Sekolah
              </h2>
              <div className="foto-pesan-kepsek position-relative img-fluid">
                <img
                  src="/img/frame-foto.svg"
                  alt="frame-foto"
                  className="mb-5 img-fluid"
                  width="720px"
                  height="477px"
                />
                <img
                  src={sekolah?.informasi?.fotoSejarah}
                  alt="foto kepala sekolah"
                  className="img-fluid img-fit-cover position-absolute img-frame"
                  height="400px"
                />
              </div>
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: sekolah?.informasi?.sejarah,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
