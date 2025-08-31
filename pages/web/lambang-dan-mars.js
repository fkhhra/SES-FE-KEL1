import { NextSeo } from "next-seo";
import AudioPlayer from "../../components/Shared/AudioPlayer/AudioPlayer";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";
import useSekolah from "../../hooks/useSekolah";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Lambang dan Lagu Mars Sekolah`,
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
              Lambang dan Lagu Mars Sekolah
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8 lambang-sekolah">
              <h2 className="title-content fw-extrabold color-dark">
                Lambang Sekolah
              </h2>
              <img
                src={sekolah?.informasi?.fotoLogo}
                alt="lambang-sekolah"
                className="img-fluid"
              />

              <h2 className="title-content fw-extrabold color-dark">
                Lagu Mars Sekolah
              </h2>
              {sekolah?.informasi?.laguMars && (
                <AudioPlayer src={sekolah?.informasi?.laguMars} />
              )}
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: sekolah?.informasi?.lirikMars,
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
