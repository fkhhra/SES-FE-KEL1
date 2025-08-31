import { NextSeo } from "next-seo";
import Banner from "../../components/Web/Banner";
import Breadcrumb from "../../components/Web/Breadcrumb";
import Layout from "../../components/Web/Layout";
import useSekolah from "../../hooks/useSekolah";

const Index = () => {
  const SEO = {
    title: `Smartschool Indonesia | Kontak`,
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
            <li className="breadcrumb-item text-white" aria-current="page">
              Kontak
            </li>
          </Breadcrumb>

          <div className="row justify-content-center pb-5 wrapper-content">
            <div className="col-md-8">
              <h2 className="title-content fw-extrabold color-dark">Kontak</h2>
              <div className="row">
                <div className="col">
                  <iframe
                    src={sekolah?.informasi?.gmaps}
                    frameborder="0"
                    allowfullscreen=""
                    aria-hidden="false"
                    tabIndex="0"
                    className="container-fluid"
                    height="360px"
                  ></iframe>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h4 className="title-border fw-bold color-dark my-5">
                    Info Kontak
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 kontak-info-content">
                  <ul className="pl-0">
                    <li className="alamat mb-5">
                      {sekolah?.informasi?.alamat}
                    </li>
                    <li className="telepon py-2 mb-5">
                      {sekolah?.informasi?.telp}
                    </li>
                    <li className="email py-2 mb-5">
                      {sekolah?.informasi?.email}
                    </li>
                  </ul>
                </div>
                <div className="col-md-6 kontak-form">
                  <form>
                    <div className="form-group">
                      <label
                        className="form-label"
                        for="exampleFormControlInput1"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleFormControlInput1"
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    <div className="form-group my-4">
                      <label
                        className="form-label"
                        for="exampleFormControlInput1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleFormControlInput1"
                        placeholder="email@email.com"
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label
                        className="form-label"
                        for="exampleFormControlTextarea1"
                      >
                        Pesan
                      </label>
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                      ></textarea>
                    </div>
                    <button
                      className="btn btn-primary btn-primary-ss rounded-pill shadow-primary-ss fw-bold"
                      type="submit"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
