import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import MySlider from "../../components/Web/MySlider";
import { NextSeo } from "next-seo";
import Layout from "../../components/Web/Layout";
import useSekolah from "../../hooks/useSekolah";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Tentang Sekolah`,
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
              Tentang Sekolah
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                Tentang Sekolah
              </h2>
              {sekolah?.informasi?.fotoTentangSekolah?.length ? (
                <MySlider
                  src={sekolah?.informasi?.fotoTentangSekolah?.map((d) => {
                    return d;
                  })}
                />
              ) : null}

              <p
                className="mt-5 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: sekolah?.informasi?.deskripsiSekolah,
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
