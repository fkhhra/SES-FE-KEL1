import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { webURL } from "../../../../client/clientAxios";
import { getKegiatan } from "../../../../client/KegiatanClient";
import Banner from "../../../../components/Web/Banner";
import Breadcrumb from "../../../../components/Web/Breadcrumb";
import Layout from "../../../../components/Web/Layout";

const Index = ({ id }) => {
  const SEO = {
    title: `Smartschool Indonesia | Ekskul`,
    description: "hala",
  };

  const [informasiKegiatan, setInformasiKegiatan] = useState({});

  const router = useRouter();

  const _getKegiatan = async () => {
    const params = {
      kegiatanId: router.query.id,
    };

    const { data } = await getKegiatan(params);
    if (data) {
      setInformasiKegiatan(data.informasiKegiatan);
    }
  };

  useEffect(() => {
    _getKegiatan();
  }, [router.query.id]);

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={informasiKegiatan?.banner} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Kegiatan
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              {informasiKegiatan?.nama}
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                {informasiKegiatan?.nama}
              </h2>
              <div className="row mb-5">
                {informasiKegiatan?.galeri?.map((galeriData, idx) => (
                  <div className="col-md-4">
                    <Link href={`${webURL}/kegiatan-galeri/${galeriData?.id}`}>
                      <a>
                        <div className="card-ekskul mb-5">
                          <img
                            src={galeriData.foto}
                            alt="card-img"
                            className="card-img"
                          />
                          <div className="card-body bg-primary">
                            <p className="card-text">{galeriData.nama}</p>
                          </div>
                        </div>
                      </a>
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
