import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { webURL } from "../../../client/clientAxios";
import { getBlog } from "../../../client/PostClient";
import Banner from "../../../components/Web/Banner";
import Breadcrumb from "../../../components/Web/Breadcrumb";
import Layout from "../../../components/Web/Layout";
import useSekolah from "../../../hooks/useSekolah";
import { momentPackage } from "../../../utilities/HelperUtils";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Berita`,
    description: "hala",
  };

  const [postData, setPostData] = useState([]);
  const { sekolah } = useSekolah();

  const getPostData = async () => {
    const { data } = await getBlog();

    if (data) {
      setPostData(data);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={sekolah?.informasi?.bannerBlog} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Publikasi
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              Berita
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">Berita</h2>
              {postData?.post?.map((d, idx) => {
                return (
                  <div
                    className="berita"
                    key={`${idx}-${new Date().getTime()}`}
                  >
                    <div className="row align-items-center">
                      <div className="berita-img col-md-6">
                        <img
                          src={d?.banner}
                          alt="gambar-berita"
                          className="img-fluid"
                        />
                      </div>
                      <div className="berita-content col-md-6">
                        <h4 className="fw-bold color-dark b-3">{d?.judul}</h4>
                        {/* <p className="berita-content-text font-weight-normal mb-3">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Quaerat facilis nam doloremque nemo id nulla
                          dolorum nobis deleniti aliquid explicabo.
                        </p> */}
                        <p>
                          {momentPackage(d?.createdAt).format("DD MMMM YYYY")}
                        </p>
                        <Link href={`${webURL}/blog/${d?.id}`}>
                          <a className="btn btn-primary rounded-pill">
                            Lihat Detail
                          </a>
                        </Link>
                      </div>
                    </div>
                    <hr className="my-4" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
