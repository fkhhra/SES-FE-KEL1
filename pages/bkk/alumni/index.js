import { Pagination } from "antd";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { getAlumni } from "../../../client/AlumniClient";
import Layout from "../../../components/BKK/Layout";
import ModalDetailIkatanAlumni from "../../../components/Shared/ModalDetailIkatanAlumni/ModalDetailIkatanAlumni";
import ModalTambahIkatanAlumni from "../../../components/Shared/ModalTambahIkatanAlumni/ModalTambahIkatanAlumni";
import Banner from "../../../components/Web/Banner";
import Breadcrumb from "../../../components/Web/Breadcrumb";

const Index = () => {
  const SEO = {
    title: `SMKN 26 Jakarta | Alumni`,
    description: "hala",
  };

  const router = useRouter();

  const { page = 1 } = router.query;

  const [listAlumni, setListAlumni] = useState([]);
  const [total, setTotal] = useState(0);

  const [detailAlumni, setDetailAlumni] = useState({});

  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const firstRender = useRef(true);

  const _getAlumni = async () => {
    const { data } = await getAlumni({ page: page });
    if (data) {
      setListAlumni(data?.alumni?.data);
      setTotal(data?.alumni?.total);
    }
  };

  const handleClickDetail = (alumni) => {
    setDetailAlumni(alumni);
  };

  useEffect(() => {
    _getAlumni();
  }, [page]);

  return (
    <Layout>
      <NextSeo {...SEO} />
      <Banner src={"/images/banner-alumni.png"} />
      <section className="content-page">
        <div className="wrapper container pb-5">
          <Breadcrumb>
            <li class="breadcrumb-item text-white" aria-current="page">
              Alumni
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-10">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="title-content">Daftar Alumni</h2>
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahIkatanAlumni"
                >
                  Daftar
                </button>
              </div>
              <table class="table table-responsive">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Whatsapp</th>
                    <th scope="col">Email</th>
                    <th scope="col">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {listAlumni?.map((alumni, idx) => (
                    <tr key={`${idx}-${new Date().getTime()}`}>
                      <th scope="row">{idx + 1}</th>
                      <td>{alumni?.nama}</td>
                      <td>
                        <a
                          href={`https://api.whatsapp.com/send?phone=${alumni?.whatsapp}`}
                          target="_blank"
                          className="btn btn-success"
                        >
                          {alumni?.whatsapp}
                        </a>
                      </td>
                      <td>
                        <a
                          href={`mailto:${alumni?.email}`}
                          className="btn btn-danger"
                        >
                          {alumni?.email}
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalDetailIkatanAlumni"
                          onClick={() => handleClickDetail(alumni)}
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-4 text-center">
                <Pagination
                  total={total}
                  showSizeChanger={false}
                  current={page || 1}
                  pageSize={20}
                  onChange={(e) => router.push(`${ssURL}/bkk/alumni?page=${e}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalTambahIkatanAlumni _getAlumni={_getAlumni} />
      <ModalDetailIkatanAlumni alumni={detailAlumni} />
    </Layout>
  );
};

export default Index;
