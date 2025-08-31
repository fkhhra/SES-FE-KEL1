import ctl from "@netlify/classnames-template-literals";
import { ssURL } from "client/clientAxios";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const SidebarBukuKerjaGuru = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const { sekolah } = useSekolah();

  const listMenu = [
    {
      url: `${ssURL}/buku-kerja-guru`,
      text: "Buku Kerja",
      icon: "/img/icon-buku-kerja.svg",
    },
    {
      url: `${ssURL}/laporan-bulanan-guru`,
      text: "Laporan Bulanan",
      icon: "/img/icon-rpp-saya.svg",
    },
    {
      url: `${ssURL}/rpp`,
      text: "Cari RPP",
      icon: "/img/icon-cari-rpp.svg",
    },
    // {
    //   url: `${ssURL}/perangkat-pembelajaran`,
    //   text: "P. Pembelajaran",
    //   icon: "/img/icon-perangkat-pembelajaran.svg",
    // },
  ];

  const listMenuCN = (url) => {
    return ctl(`
      nav-link color-dark fw-bold
      fs-18-ss d-flex align-items-center
      px-4 mb-3
      ${url?.includes(pathname) && "active"}
    `);
  };

  return (
    <div>
      <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 pt-4 pb-5 flex-column">
        {listMenu.map((menu, index) => {
          if (sekolah?.trial && menu.text == "P. Pembelajaran") {
            return (
              <li className="nav-item" key={`${index}-${new Date().getTime()}`}>
                <Link href={menu.url}>
                  <a className={listMenuCN(menu.url)} aria-current="page">
                    <img src={menu.icon} className="me-2" />
                    {menu.text}
                  </a>
                </Link>
              </li>
            );
          }

          return (
            <li className="nav-item" key={`${index}-${new Date().getTime()}`}>
              <Link href={menu.url}>
                <a className={listMenuCN(menu.url)} aria-current="page">
                  <img src={menu.icon} className="me-2" />
                  {menu.text}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarBukuKerjaGuru;
