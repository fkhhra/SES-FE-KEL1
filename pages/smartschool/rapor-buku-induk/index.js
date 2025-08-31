import SelectShared from "components/Shared/SelectShared/SelectShared";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getPredikat } from "../../../client/BukuIndukClient";
import { ssURL } from "../../../client/clientAxios";
import CardBukuInduk from "../../../components/BukuInduk/CardBukuInduk";
import SideNavBukuInduk from "../../../components/BukuInduk/SideNavBukuInduk";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import BukuIndukSkeleton from "../../../components/Shared/Skeleton/BukuIndukSkeleton";

const index = ({ subnav, taId }) => {
  const [bukuIndukData, setBukuIndukData] = useState({});
  const { ta } = useTa();
  const { rombel, countMapel, semuaTA } = bukuIndukData;
  const [loading, setLoading] = useState(false);

  const _getBukuInduk = async () => {
    setLoading(true);
    const { data } = await getPredikat({ taId });
    if (data) {
      setBukuIndukData(data);
    }
    setLoading(false);
  };

  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);
  const { user } = useUser();

  useEffect(() => {
    _getBukuInduk();
  }, [taId]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          {user?.role == "admin" ? (
            <div className="col-lg-3 positon-relative">
              <SideNavBukuInduk ssURL={ssURL} />
            </div>
          ) : (
            <div className={`col-lg-2`}></div>
          )}
          {loading && (
            <>
              <div className={`col-lg-9`}>
                <div className="row gy-4">
                  <BukuIndukSkeleton count={3} />
                </div>
              </div>
            </>
          )}
          {!loading && (
            <>
              <div className="col-lg-9">
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="card card-ss">
                      <div className="card-body p-4">
                        <div className="row justify-content-between">
                          <div className="col-lg-4 d-flex align-items-center">
                            <h4 className="fw-extrabold m-0 color-dark mb-lg-0 mb-4">
                              Daftar Rapor
                            </h4>
                          </div>
                          <div className="col-lg-8 d-flex">
                            <div className="row flex-grow-1">
                              <div className="col-md-6 mb-md-0 mb-3 d-md-block d-flex"></div>
                              <div className="col-md-6">
                                <div className="select-akun-keuangan flex-grow-1">
                                  {/* {ledgerData?.semuaTA ? ( */}
                                  <SelectShared
                                    options={semuaTA?.map((d) => {
                                      return {
                                        label: `Tahun ${d?.tahun} - semester ${d?.semester}`,
                                        value: d?.id,
                                      };
                                    })}
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
                                  {/* ) : null} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardBukuInduk
                  dataBukuInduk={rombel}
                  count={countMapel}
                  linkRedirect={`${ssURL}/rapor-buku-induk/`}
                  isRapor
                />
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav, taId } }) {
  return {
    props: {
      taId: taId || null,
      subnav: subnav || null,
    },
  };
}

export default index;
