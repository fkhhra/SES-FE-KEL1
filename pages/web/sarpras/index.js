import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { webURL } from "../../../client/clientAxios";
import { getSarpras } from "../../../client/SarprasClient";
import { meSekolah } from "../../../client/SekolahClient";
import Banner from "../../../components/Web/Banner";
import Breadcrumb from "../../../components/Web/Breadcrumb";
import Layout from "../../../components/Web/Layout";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Sarana Prasarana`,
    description: "hala",
  };

  const [sarpras, setSarpras] = useState([]);
  const [sekolah, setSekolah] = useState({});

  const _getSarpras = async () => {
    const { data } = await getSarpras();
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
    _getSarpras();
    getMeSekolahData();
  }, []);

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={sekolah?.informasi?.bannerSarpras} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Fasilitas
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Sarana Prasarana
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                Sarana Prasarana
              </h2>
              <div className="row mb-5">
                {sarpras?.map((sarprasData, idx) => (
                  <div
                    className="col-md-4"
                    key={`${idx}-${new Date().getTime()}`}
                  >
                    <Link href={`${webURL}/sarpras/${sarprasData?.id}`}>
                      <a target="_blank">
                        <div className="card-ekskul card-sarpras mb-5 position-relative overflow-hidden">
                          <div className="btn btn-primary rounded-pill">
                            Lihat Detail
                          </div>
                          <img
                            src={sarprasData.foto}
                            alt="card-img"
                            className="card-img"
                          />
                          <div className="card-body bg-primary">
                            <p className="card-text">{sarprasData.nama}</p>
                          </div>
                        </div>
                      </a>
                      {/* <a target="_blank" href={sarprasData.virtualTour}>
                        <div className="card-ekskul card-sarpras mb-5 position-relative overflow-hidden">
                          <div className="btn btn-primary rounded-pill">
                            Lihat Detail
                          </div>
                          <img
                            src={sarprasData.foto}
                            alt="card-img"
                            className="card-img"
                          />
                          <div className="card-body bg-primary">
                            <p className="card-text">{sarprasData.nama}</p>
                          </div>
                        </div>
                      </a> */}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
