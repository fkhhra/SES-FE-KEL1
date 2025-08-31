import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { getInformasiJurusan } from "../../../../client/InformasiJurusanClient";
import Banner from "../../../../components/Web/Banner";
import Breadcrumb from "../../../../components/Web/Breadcrumb";
import Layout from "../../../../components/Web/Layout";
import MySlider from "../../../../components/Web/MySlider";

const Index = ({ id }) => {
  const [informasiJurusan, setInformasiJurusan] = useState({});

  const getDetailJurusan = async () => {
    const { data } = await getInformasiJurusan({
      jurusanId: id,
    });
    if (data) {
      setInformasiJurusan(data);
    }
  };

  useEffect(() => {
    getDetailJurusan();
  }, []);

  return (
    <Layout>
      <Banner src={informasiJurusan?.informasiJurusan?.banner} />
      <section className="content-page">
        <div className="wrapper container">
          <Breadcrumb>
            <li className="breadcrumb-item">
              <a href="#" className="text-white text-decoration-none">
                Kompetensi Keahlian
              </a>
            </li>
            <li className="breadcrumb-item text-white" aria-current="page">
              {informasiJurusan?.informasiJurusan?.jurusan?.nama}
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">
                Sambutan Ketua Kompetensi Keahlian
              </h2>
              <p
                className="dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: informasiJurusan?.informasiJurusan?.sambutan,
                }}
              />
              <h2 className="title-content fw-extrabold color-dark my-5">
                Deskripsi Kompetensi Keahlian
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
                  src={informasiJurusan?.informasiJurusan?.cover}
                  alt="foto deskripsi jurusan"
                  className="img-fluid img-fit-cover position-absolute img-frame img-frame-jurusan"
                  style={{ width: "85%" }}
                />
              </div>
              <p
                className="dangerous"
                dangerouslySetInnerHTML={{
                  __html: informasiJurusan?.informasiJurusan?.deskripsi,
                }}
              />
              <h2 className="title-content fw-extrabold color-dark my-5">
                Prestasi Kompetensi Keahlian
              </h2>
              <p>Menunggu data...</p>
              <h2 className="title-content fw-extrabold color-dark my-5">
                Guru Kompetensi Keahlian
              </h2>
              {/* Row Start */}
              {/* <div className="row justify-content-center mb-4">
                <div className="guru col-md-4 text-center">
                  <img
                    src="/tmp/images/guru/bu-dede.png"
                    alt="Dra. Hj. Dede Yudhiaty"
                    width="165px"
                    height="165px"
                    classNama="rounded-circle"
                  />
                  <p className="p-0 mt-3 mb-1">Dra. Hj. Dede Yudhiaty</p>
                  <div className="btn btn-outline-primary rounded-pill">
                    Ketua Kompetensi Keahlian
                  </div>
                </div>
              </div> */}
              {/* Row End */}
              {/* Row Start */}
              <div className="row justify-content-center mb-4">
                {informasiJurusan?.guruJurusan?.map((d, idx) => {
                  return (
                    <div
                      key={`${idx}-${new Date().getTime()}`}
                      className="guru col-lg-4 col-md-6 d-flex justify-content-center align-items-center flex-column mb-4"
                    >
                      <div
                        className="rounded-circle border border-primary-ss d-flex justify-content-center align-items-center"
                        style={{ width: "150px", height: "150px" }}
                      >
                        <img
                          src={d?.foto}
                          alt={d?.user?.nama}
                          width="140px"
                          height="140px"
                          className="rounded-circle img-fit-cover"
                        />
                      </div>
                      <h5 className="p-0 mt-3 mb-1 color-dark fw-bold fs-18-ss">
                        {d?.user?.nama}
                      </h5>
                      <h6 className="color-primary fw-bold fs-14-ss">
                        {d?.jabatan}
                      </h6>
                    </div>
                  );
                })}
                {/* <div className="guru col-md-4 text-center">
                  <img
                    src="/tmp/images/guru/bu-kuri.png"
                    alt="Kuri Asih, S.E., S.Kom."
                    width="165px"
                    height="165px"
                    classNama="rounded-circle"
                  />
                  <p className="p-0 mt-3 mb-1">Kuri Asih, S.E., S.Kom.</p>
                  <div className="btn btn-outline-primary rounded-pill">
                    Pengawas Internal
                  </div>
                </div>
                <div className="guru col-md-4 text-center">
                  <img
                    src="/tmp/images/guru/pak-danial.png"
                    alt="Danial Ahadian S. Pd."
                    width="165px"
                    height="165px"
                    classNama="rounded-circle"
                  />
                  <p className="p-0 mt-3 mb-1">Danial Ahadian S. Pd.</p>
                  <div className="btn btn-outline-primary rounded-pill">
                    Guru
                  </div>
                </div> */}
              </div>
              {/* Row End */}
              {/* Row Start */}
              {/* <div className="row justify-content-center mb-4">
                <div className="guru col-md-4 text-center">
                  <img
                    src="/tmp/images/guru/bu-sevia.png"
                    alt="Sevia Helena Kiranti S. Kom."
                    width="165px"
                    height="165px"
                    classNama="rounded-circle"
                  />
                  <p className="p-0 mt-3 mb-1">Sevia Helena Kiranti S. Kom.</p>
                  <div className="btn btn-outline-primary rounded-pill">
                    Guru
                  </div>
                </div>
                <div className="guru col-md-4 text-center">
                  <img
                    src="/tmp/images/guru/pak-samsul.png"
                    alt="Samrul Bahri S. Pd."
                    width="165px"
                    height="165px"
                    classNama="rounded-circle"
                  />
                  <p className="p-0 mt-3 mb-1">Samrul Bahri S. Pd.</p>
                  <div className="btn btn-outline-primary rounded-pill">
                    Guru
                  </div>
                </div>
              </div> */}
              {/* Row End */}
              <h2 className="title-content fw-extrabold color-dark my-5">
                Galeri Kompetensi Keahlian
              </h2>
              {informasiJurusan?.informasiJurusan?.galeri?.length && (
                <MySlider
                  src={informasiJurusan?.informasiJurusan?.galeri?.map((d) => {
                    return d;
                  })}
                />
              )}
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
      id,
    },
  };
}

export default Index;
