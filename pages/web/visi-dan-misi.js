import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import { NextSeo } from "next-seo";
import Layout from "../../components/Web/Layout";
import useSekolah from "../../hooks/useSekolah";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Visi dan Misi`,
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
              Visi dan Misi
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">Visi</h2>
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{ __html: sekolah?.informasi?.visi }}
              />

              <h2 className="title-content fw-extrabold color-dark">Misi</h2>
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{ __html: sekolah?.informasi?.misi }}
              />

              {/* <MySlider /> */}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
