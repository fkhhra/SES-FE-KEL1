import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import PredikatNilaiPage from "../../../components/BukuInduk/PredikatNilai";
import SideNavBukuInduk from "../../../components/BukuInduk/SideNavBukuInduk";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ subnav }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavBukuInduk ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <PredikatNilaiPage />
          </div>
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
