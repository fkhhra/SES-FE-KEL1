import ctl from "@netlify/classnames-template-literals";
import { Tooltip } from "antd";
import { ssURL } from "client/clientAxios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const SidebarPerangkatPembelajaranDetail = ({ type, tingkat }) => {
  const router = useRouter();
  const pathname = router.asPath;
  const { buku_kerja } = router.query;

  const [navMenus, setNavMenus] = useState([]);

  useEffect(() => {
    setNavMenus(
      tingkat?.tingkatFolder?.map((d) => ({
        href: `${ssURL}/perangkat-pembelajaran/${tingkat?.id}?type=${d?.id}`,
        href: `${ssURL}/perangkat-pembelajaran/${tingkat?.id}?type=${d?.id}`,
        text: d?.judul,
        active: d?.id == type,
      }))
    );
  }, [tingkat, type]);

  return (
    <div className="mb-4 mb-lg-0">
      <ul className="nav side-nav-ss bg-white rounded-ss px-3 py-4 flex-column">
        <h5 className="color-dark fw-bold ms-4">Perangkat</h5>
        {navMenus?.length &&
          navMenus.map((d, idx) => {
            return (
              <li
                className="nav-item w-100"
                key={`${idx}-${new Date().getTime()}`}
                style={{ marginTop: idx != 0 ? "8px" : "0px" }}
              >
                <Link href={d.href} as={d.as}>
                  <a
                    className={`  nav-link color-dark fw-bold
                fs-18-ss d-flex align-items-center
                px-4 ${d.active ? "active" : ""}`}
                    aria-current="page"
                  >
                    <img
                      src={
                        d.active
                          ? "/img/icon-buku-kerja-guru-blue.svg"
                          : "/img/icon-buku-kerja-gray.svg"
                      }
                      className="me-2"
                    />
                    <Tooltip title={d.text}>
                      <p className="text-truncate mb-0">{d.text}</p>
                    </Tooltip>
                  </a>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SidebarPerangkatPembelajaranDetail;
