import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ssURL } from "../../../client/clientAxios";
import CariGuru from "../../../components/Konsultasi/CariGuru";
import KonsultasiSaya from "../../../components/Konsultasi/KonsultasiSaya";
import BukuKunjungan from "../../../components/Konsultasi/BukuKunjungan";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import SidebarTabMenu from "../../../components/Shared/SidebarTabMenu/SidebarTabMenu";
import useUser from "../../../hooks/useUser";

const PageKonsul = () => {
  const { user } = useUser();

  const router = useRouter();
  const menu = router.query.menu;

  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  const listMenu = [
    {
      url: `${ssURL}/konsultasi?menu=cari-guru`,
      nama: "Cari Guru",
      icon: "/img/user-find.svg",
      isVisible: user?.role === "siswa",
    },
    {
      url: `${ssURL}/konsultasi?menu=buku-kunjungan`,
      nama: "Buku Kunjungan",
      icon: "/img/icon-buku-absen.svg",
      isVisible: user?.role === "guru",
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya`,
      nama: "Konsultasi Saya",
      icon: "/img/comment.svg",
      isVisible: user?.role === "siswa" || user?.role === "guru",
    },
  ].filter((menu) => menu.isVisible); // show menu only if isVisible true

  // find active menu
  useEffect(() => {
    if (router.query.menu && user) {
      const index = listMenu.findIndex((menu) =>
        menu.url.includes(router.query.menu)
      );
      setActiveMenuIndex(index === -1 ? 0 : index);
    }
  }, [router.query.menu, user]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <SidebarTabMenu
            listMenu={listMenu}
            activeMenuIndex={activeMenuIndex}
          />
          {user?.role === "siswa" && (!menu || menu === "cari-guru") && (
            <CariGuru />
          )}
          {menu === "konsultasi-saya" && <KonsultasiSaya />}
          {user?.role === "guru" && (!menu || menu === "buku-kunjungan") && (
            <BukuKunjungan />
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default PageKonsul;
