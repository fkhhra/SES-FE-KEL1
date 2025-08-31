import React from "react";
import { ssURL } from "../../../client/clientAxios";
import BobotRaporAkhirSemester from "../../../components/BukuInduk/BobotRaporAkhirSemester";
import BobotRaporTengahSemester from "../../../components/BukuInduk/BobotRaporTengahSemester";
import SideNavBukuInduk from "../../../components/BukuInduk/SideNavBukuInduk";
import TabelBobotNilai from "../../../components/BukuInduk/TabelBobotNilai";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../components/Shared/Navbar/Navbar";

const index = ({ subnav }) => {
  const navItems = [
    {
      url: `${ssURL}/bobot-nilai?subnav=tengah-semester`,
      text: "Rapor Tengah Semester",
      active: subnav == "tengah-semester" || !subnav,
    },
    {
      url: `${ssURL}/bobot-nilai?subnav=akhir-semester`,
      text: "Rapor Akhir Semester",
      active: subnav == "akhir-semester",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavBukuInduk ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            {/* <div className="row">
              <div className="col-md-12">
                <Navbar nav={navItems} />
              </div>
            </div> */}
            {/* {subnav == "tengah-semester" || !subnav ? (
              <BobotRaporTengahSemester />
            ) : (
              <BobotRaporAkhirSemester />
            )} */}
            <TabelBobotNilai />
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
