import { Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import { getAllHistories } from "client/SerClient";
import Layout from "components/Layout/Layout";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import Skeleton from "react-loading-skeleton";
import { whatsappLink } from "../../../utilities/app-helper";
const index = () => {
  const router = useRouter();
  const { page = 1 } = router.query;
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [historySiswa, setHistorySiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const _getSiswaHistories = async () => {
    setIsLoading(true);
    const { data } = await getAllHistories({
      page,
      search,
    });
    if (data) {
      setHistorySiswa(data?.data);
    }
    setIsLoading(false);
  };


  useEffect(() => {
    _getSiswaHistories();
  }, [page, debounceSearch]);

  return (
    <Layout>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mb-4">
                    <div
                      className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-column flex-md-row bg-no-repeat bg-cover"
                      style={{
                        minHeight: "150px",
                        background: `url("/img/bg-header-pkl.png")`,
                        backgroundPositionX: "right",
                        backgroundPositionY: "bottom",
                      }}
                    >
                      <div
                        className="rounded-circle shadow-primary-ss"
                        style={{ width: "86px", height: "86px" }}
                      >
                        <img
                          src="/img/icon-perusahaan.svg"
                          style={{ width: "86px", height: "86px" }}
                          alt=""
                        />
                      </div>
                      <div className="ms-md-4 ms-0 mt-md-0 mt-4">
                        <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                          Smart E Resorce
                        </h2>
                        <p className="fs-6 fw-bold mb-0">Lamaran Pekerjaan Siswa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <div className="row  justify-content-between">
                    <div className="col-lg-4">
                      <h4 className="fw-extrabold m-0 color-dark mb-lg-0 mb-4">
                        Daftar Siswa
                      </h4>
                    </div>
                    <div className="col-lg-8 d-flex flex-sm-row flex-column">
                      <div className="flex-grow-1 me-sm-4 mb-sm-0 mb-3 d-sm-block d-flex">
                        <input
                          type="text"
                          className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100 flex-grow-1"
                          style={{ height: "42px" }}
                          id="exampleFormControlInput1"
                          placeholder="Cari Nama Siswa"
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Siswa</th>
                          <th>WhatsApp</th>
                          <th className="text-center">Detail Lamaran</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td data-th="No">
                              <Skeleton />
                            </td>
                            <td data-th="Nama Siswa">
                              <Skeleton />
                            </td>
                            <td data-th="Kelas">
                              <Skeleton />
                            </td>
                            <td data-th="Detail Lamaran">
                              <Skeleton />
                            </td>
                          </tr>
                        ) : (
                          historySiswa?.data?.map((d, idx) => (
                            <tr>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama Siswa">{d?.nama}</td>
                              <td data-th="WhatsApp">
                                  <a
                                    href={whatsappLink(d?.whatsapp)}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                  >
                                    <div
                                      className="rounded-circle shadow-success-ss"
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                      }}
                                    >
                                      <img
                                        src={`/img/whatsapp.svg`}
                                        width={45}
                                        height={45}
                                      />
                                    </div>
                                  </a>
                              </td>
                              <td data-th="Detail Lamaran" className="text-center">
                                <button 
                                  className="btn btn-ss btn-primary btn-primary-ss rounded-pill fw-bold bg-gradient-primary shadow-primary-ss" 
                                  onClick={() => router.push(`${ssURL}/smarteresource/${d?.id}`)}
                                  >Lihat Detail
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    <div className="d-flex align-items-center justify-content-center mt-5 pb-5">
                      <Pagination
                        total={historySiswa?.total}
                        showSizeChanger={false}
                        current={page || 1}
                        pageSize={20}
                        onChange={(e) =>
                          router.push(`${ssURL}/smarteresource?page=${e}`)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};


export default index;
