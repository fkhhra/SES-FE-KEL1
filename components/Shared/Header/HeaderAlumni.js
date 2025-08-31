import Link from "next/link";
import { useEffect, useState } from "react";
import { baseURL, ppdbURL, ssURL } from "../../../client/clientAxios";

import { useRouter } from "next/router";
import { getProfil } from "../../../client/sharedClient";
import useUser from "../../../hooks/useUser";
import useSekolah from "../../../hooks/useSekolah";
import Avatar from "../Avatar/Avatar";
import { FaBell } from "react-icons/fa";
import { Badge } from "antd";

const HeaderPPDB = ({ isFrontPage }) => {
  const router = useRouter();
  const [menuAktif, setMenuAktif] = useState(ppdbURL);

  const { user } = useUser();
  const { sekolah } = useSekolah();

  // const _get

  const headerMenus = [];

  if (sekolah.id == 17) {
    headerMenus.push({
      isDropdown: false,
      text: "Pengumuman",
      url: `${ppdbURL}#pengumuman`,
    });
  }

  if (isFrontPage) {
    headerMenus.push(
      {
        isDropdown: false,
        text: "Beranda",
        url: `/`,
      },
      {
        isDropdown: false,
        text: "Jelajah Sekolah",
        url: sekolah?.informasi?.virtualTour,
      },
      {
        isDropdown: false,
        text: "Daftar",
        url: `/alumni#daftarSekarang`,
      }
    );
  }

  useEffect(() => {
    setMenuAktif(window.location.pathname);
  }, [menuAktif]);

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("ss-token");
    router.push(`${ppdbURL}`);
  };

  return (
    <header>
      {isFrontPage ? (
        <>
          <nav className="navbar navbar-expand-lg navbar-light navbar-ppdb active position-fixed w-100 py-3">
            <div className="container-fluid px-lg-5 px-4">
              <Link href={`/`}>
                <a className="navbar-brand">
                  {/* <div
                    // className="logo-ss"
                    // style={{ width: "40px", height: "40px" }}
                  >
                  </div> */}
                  <img src={sekolah?.logoSs} width={40} height={40} />
                </a>
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav navbar-nav-ppdb ms-auto mb-2 mb-lg-0">
                  {headerMenus?.map((menu, idx) => {
                    return (
                      <li
                        className="nav-item"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <a
                          href={menu.url}
                          {...(menuAktif == menu.url
                            ? {
                                className: "nav-link fw-bold active",
                                "aria-current": "page",
                              }
                            : { className: "nav-link fw-bold" })}
                          onClick={() => setMenuAktif(menu.url)}
                        >
                          {menu.text}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
};

export default HeaderPPDB;
