import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { getSarprasDetail } from "../../../../client/SarprasClient";
import { meSekolah } from "../../../../client/SekolahClient";
import Banner from "../../../../components/Web/Banner";
import Breadcrumb from "../../../../components/Web/Breadcrumb";
import Layout from "../../../../components/Web/Layout";

const Index = ({ id }) => {
  const SEO = {
    title: `Smartschool Indonesia | Pesan Kepala Sekolah`,
    description: "hala",
  };

  const [sarpras, setSarpras] = useState([]);
  const [sekolah, setSekolah] = useState({});

  const _getSarprasDetail = async () => {
    const { data } = await getSarprasDetail(id);
    if (data) {
      setSarpras(data.sarpras);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };
  useEffect(() => {
    _getSarprasDetail();
    getMeSekolahData();
  }, []);

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
              Sarpras
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              {sarpras?.nama}
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                {sarpras?.nama}
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
                  src={sarpras?.foto}
                  className="img-fluid img-fit-cover position-absolute img-frame"
                  height="400px"
                />
              </div>
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: sarpras?.deskripsi,
                }}
              />
              <p>
                Link Virtul Tour:{" "}
                <a href={sarpras?.virtualTour} target="__blank">
                  {sarpras?.virtualTour}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id,
    },
  };
}

export default Index;
