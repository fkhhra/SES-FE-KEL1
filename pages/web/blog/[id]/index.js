import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailBlog, getPost } from "../../../../client/PostClient";
import Banner from "../../../../components/Web/Banner";
import Breadcrumb from "../../../../components/Web/Breadcrumb";
import Layout from "../../../../components/Web/Layout";

const Index = ({ id }) => {
  const SEO = {
    title: `Smartschool Indonesia | Berita Detail`,
    description: "hala",
  };

  const router = useRouter();

  const [post, setPost] = useState({});
  const [kategori, setKategori] = useState([]);
  const [beritaData, setBeritaData] = useState([]);

  const getDetailPostData = async () => {
    const { data } = await getDetailBlog(id);
    if (data) {
      setPost(data.post);
      setKategori(data.kategori);
    }
  };

  const getPostData = async () => {
    const { data } = await getPost({ limit: 3 });
    if (data) {
      setBeritaData(data.post);
    }
  };

  useEffect(() => {
    getDetailPostData();
    getPostData();
  }, [id]);

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
              Berita
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <div className="title-content">
                <h2 className="mb-2 fw-bold color-dark">{post.judul}</h2>
                <p className="mb-3">{post.createdAt}</p>
              </div>
              <img
                src={post.banner}
                alt={post.slug}
                className="mb-5 img-fluid img-berita-detail"
              />
              <div
                className="berita-content-text"
                dangerouslySetInnerHTML={{ __html: post.konten }}
              />
              <hr className="my-5" />
              <div className="row">
                <div className="col">
                  <h4 className="title-border fw-bold color-dark mb-5">
                    Lihat Berita Lainnya
                  </h4>
                </div>
              </div>
              <div className="row berita-lainnya">
                {beritaData?.map((berita) => (
                  <Link href={`[id]`} as={`${berita.id}`}>
                    <a className="col-md-4 berita-lainnya-items">
                      <img
                        src={berita.banner}
                        alt={berita.judul}
                        className="img-fluid"
                      />
                      <p className="mt-3 mb-0 color-dark">{berita.judul}</p>
                      <p className="color-secondary fs-14-ss">
                        {berita.createdAt}
                      </p>
                    </a>
                  </Link>
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

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}
