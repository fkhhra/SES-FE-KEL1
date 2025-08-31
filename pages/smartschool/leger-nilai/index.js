import { setInterceptor } from "client/Axios";
import { getLedgerNilai } from "client/LedgerClient";
import ListTingkatLedger from "components/LedgerNilai/ListTingkat";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ssURL } from "../../../client/clientAxios";
import SideNavBukuInduk from "../../../components/BukuInduk/SideNavBukuInduk";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ taId, search }) => {
  const { user } = useUser();
  const { ta } = useTa();

  const [ledgerData, setLedgerData] = useState({
    tingkatData: [],
    rombel: [],
    semuaTa: [],
  });

  const [searchNama, setSearchNama] = useState("");
  const [debounceSearch] = useDebounce(searchNama, 400);

  const _getPageData = async () => {
    const { data, error } = await getLedgerNilai({
      search,
      taId,
    });

    if (data) {
      setLedgerData(data);
    }
  };

  useEffect(() => {
    _getPageData();
  }, [taId, search]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  useEffect(() => {
    setInterceptor((error) => {
      return;
    });
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavBukuInduk ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <div className="row">
              <div className="col-md-12">
                <div className="card card-ss">
                  <div className="card-body p-4">
                    <div className="row justify-content-between">
                      <div className="col-lg-4 d-flex align-items-center">
                        <h4 className="fw-extrabold m-0 color-dark mb-lg-0 mb-4">
                          Daftar Leger
                        </h4>
                      </div>
                      <div className="col-lg-8 d-flex">
                        <div className="row flex-grow-1">
                          <div className="col-md-6 mb-md-0 mb-3 d-md-block d-flex">
                            <input
                              type="text"
                              className="form-control form-search rounded-pill fw-semibold border-secondary-ss w-100 flex-grow-1"
                              style={{ height: "42px" }}
                              id="exampleFormControlInput1"
                              placeholder="Cari kelas"
                              onChange={(e) => setSearchNama(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <div className="select-akun-keuangan flex-grow-1">
                              {ledgerData?.semuaTA ? (
                                <SelectShared
                                  options={[
                                    ...ledgerData?.semuaTA?.map((d) => {
                                      return {
                                        label: `Tahun ${d?.tahun} - semester ${d?.semester}`,
                                        value: d?.id,
                                      };
                                    }),
                                  ]}
                                  value={parseInt(taId || ta?.id)}
                                  handleChangeSelect={(e) => {
                                    router.push({
                                      pathname: router.pathname,
                                      query: {
                                        ...router.query,
                                        taId: e?.value,
                                      },
                                    });
                                  }}
                                  isClearable
                                  placeholder="Pilih tahun akademik"
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
            {ledgerData?.tingkatData?.map((d) => {
              return (
                <ListTingkatLedger
                  data={d}
                  rombel={ledgerData?.rombel?.filter(
                    (rombel) => rombel.tingkat == d
                  )}
                  taId={taId ? taId : ta?.id}
                />
              );
            })}
            {/* <div className="row mt-3 g-4 mb-4">
              <div className="col-md-12">
                <div className="w-100 position-relative">
                  <hr
                    className="m-0 w-100 position-absolute"
                    style={{
                      top: "50%",
                      left: "0",
                      transform: "tranlateY(-50%)",
                    }}
                  />
                  <h5
                    className="position-relative fs-14-ss fw-bold bg-main pe-4 py-1 fs-18-ss fw-black color-dark d-inline"
                    style={{ zIndex: "2" }}
                  >
                    Kelas XI
                  </h5>
                </div>
              </div>
              <div className="col-md-3">
                <a href="">
                  <div
                    className="card card-ss p-3 bg-no-repeat"
                    style={{
                      background: `url("/img/bg-card-leger.png")`,
                      backgroundPosition: "right bottom",
                    }}
                  >
                    <h5 className="fw-black color-dark">XI KGSP 1</h5>
                    <div className="d-flex align-items-center">
                      <img
                        src="/img/icon-anggota.svg"
                        alt="icon-user"
                        className="me-2"
                        style={{ width: "24px", heigth: "24px" }}
                      />
                      <span className="fs-14-ss color-primary fw-bold">
                        36 Siswa
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div className="row mt-3 g-4 mb-4">
              <div className="col-md-12">
                <div className="w-100 position-relative">
                  <hr
                    className="m-0 w-100 position-absolute"
                    style={{
                      top: "50%",
                      left: "0",
                      transform: "tranlateY(-50%)",
                    }}
                  />
                  <h5
                    className="position-relative fs-14-ss fw-bold bg-main pe-4 py-1 fs-18-ss fw-black color-dark d-inline"
                    style={{ zIndex: "2" }}
                  >
                    Kelas XII
                  </h5>
                </div>
              </div>
              <div className="col-md-3">
                <a href="">
                  <div
                    className="card card-ss p-3 bg-no-repeat"
                    style={{
                      background: `url("/img/bg-card-leger.png")`,
                      backgroundPosition: "right bottom",
                    }}
                  >
                    <h5 className="fw-black color-dark">XII KGSP 1</h5>
                    <div className="d-flex align-items-center">
                      <img
                        src="/img/icon-anggota.svg"
                        alt="icon-user"
                        className="me-2"
                        style={{ width: "24px", heigth: "24px" }}
                      />
                      <span className="fs-14-ss color-primary fw-bold">
                        36 Siswa
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { taId, search } }) {
  return {
    props: {
      taId: taId || null,
      search: search || null,
    },
  };
}

export default index;
