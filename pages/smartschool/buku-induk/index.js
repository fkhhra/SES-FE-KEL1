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

const index = ({ subnav }) => {
  const [bukuIndukData, setBukuIndukData] = useState({});
  const { rombel, countMapel } = bukuIndukData;
  const [loading, setLoading] = useState(false);

  const _getBukuInduk = async () => {
    setLoading(true);
    const { data } = await getPredikat();
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

  useEffect(() => {
    _getBukuInduk();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavBukuInduk ssURL={ssURL} />
          </div>
          {loading && (
            <>
              <div className="col-lg-9">
                <div className="row gy-4">
                  <BukuIndukSkeleton count={3} />
                </div>
              </div>
            </>
          )}
          {!loading && (
            <>
              <div className="col-lg-9">
                <CardBukuInduk
                  dataBukuInduk={rombel}
                  linkRedirect={`${ssURL}/buku-induk/`}
                  count={countMapel}
                />
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav } }) {
  return {
    props: {
      subnav: subnav || null,
    },
  };
}

export default index;
