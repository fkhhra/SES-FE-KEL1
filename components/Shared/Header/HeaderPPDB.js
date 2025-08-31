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
import { momentPackage } from "utilities/HelperUtils";
import { useJalur, useJalurId } from "hooks/useJalur";

const HeaderPPDB = ({ isFrontPage }) => {
  const router = useRouter();
  const [menuAktif, setMenuAktif] = useState(ppdbURL);
  const { jalurData } = useJalur();
  const { setJalurId } = useJalurId();
  const { jalur } = jalurData;

  const { user } = useUser();
  const { sekolah } = useSekolah();

  const headerMenus = [];

  const dropdownItems = jalur?.map((d) => ({
    text: d?.nama,
    function: () => {
      router.push(`${ppdbURL}#jalur-pendaftaran`);
      setJalurId(d?.id)
    },
  }));

  // Tambahkan dropdown untuk menu Biaya
  if (isFrontPage) {
    if (sekolah?.id == 9489) {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}#beranda`,
        },
        {
          isDropdown: false,
          text: "Alur Pendaftaran",
          url: `${ppdbURL}#alur-pendaftaran`,
        },
        {
          isDropdown: true, // Ubah ke dropdown
          text: "Biaya",
          dropdownItems: [
            {
              text: "Jalur Prestasi",
              url: `${ppdbURL}#jalur-prestasi`,
            },
            {
              text: "Jalur Reguler",
              url: `${ppdbURL}#jalur-reguler`,
            },
            {
              text: "Jalur Afirmasi",
              url: `${ppdbURL}#jalur-afirmasi`,
            },
          ],
        },
        {
          isDropdown: false,
          text: "Jadwal",
          url: `${ppdbURL}#jadwal`,
        }
      );
    } else if (sekolah?.id == 70) {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}#beranda`,
        },
        {
          isDropdown: false,
          text: "Alur Pendaftaran",
          url: `${ppdbURL}#alur-pendaftaran`,
        },
        {
          isDropdown: true, // Ubah ke dropdown
          text: "Biaya",
          dropdownItems: dropdownItems
        },
        {
          isDropdown: false,
          text: "Jadwal",
          url: `${ppdbURL}#jadwal`,
        }
      );
    } else {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}#beranda`,
        },
        {
          isDropdown: false,
          text: "Alur Pendaftaran",
          url: `${ppdbURL}#alur-pendaftaran`,
        },
        {
          isDropdown: false,
          text: "Jadwal",
          url: `${ppdbURL}#jadwal`,
        }
      );
    }
  } else {
    if (
      sekolah?.id == 9487 &&
      momentPackage().format("YYYY-MM-DD HH:mm") >=
      momentPackage("2024-05-10 17:00").format("YYYY-MM-DD HH:mm")
    ) {
      // headerMenus.push(
      //   {
      //     isDropdown: false,
      //     text: "Beranda",
      //     url: `${ppdbURL}/dashboard`,
      //   },
      //   {
      //     isDropdown: false,
      //     text: "Pendaftaran",
      //     url: `${ppdbURL}/gelombang-ppdb`,
      //   },
      //   {
      //     isDropdown: false,
      //     text: "Tes Masuk",
      //     url: `${ppdbURL}/ujian`,
      //   },
      //   {
      //     isDropdown: false,
      //     text: "Pengumuman Kelulusan",
      //     url: `${ppdbURL}/pengumuman-kelulusan`,
      //   }
      // );
    } else if (
      sekolah?.id == 9489 &&
      momentPackage().format("YYYY-MM-DD HH:mm") >=
      momentPackage("2024-05-10 17:00").format("YYYY-MM-DD HH:mm")
    ) {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}/dashboard`,
        },
        {
          isDropdown: false,
          text: "Pendaftaran",
          url: `${ppdbURL}/gelombang-ppdb`,
        },
        {
          isDropdown: false,
          text: "Tes Masuk",
          url: `${ppdbURL}/ujian`,
        },
        {
          isDropdown: false,
          text: "Pengumuman Kelulusan",
          url: `${ppdbURL}/pengumuman-kelulusan`,
        }
      );
    } else if (
      sekolah?.id !== 14 &&
      sekolah?.id !== 13 &&
      sekolah?.id !== 121
    ) {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}/dashboard`,
        },
        {
          isDropdown: false,
          text: "Pendaftaran",
          url: `${ppdbURL}/gelombang-ppdb`,
        },
        {
          isDropdown: false,
          text: "Tes Masuk",
          url: `${ppdbURL}/ujian`,
        }
      );
    } else {
      headerMenus.push(
        {
          isDropdown: false,
          text: "Beranda",
          url: `${ppdbURL}/dashboard`,
          aktif: menuAktif == "/ppdb/dashboard",
        },
        {
          isDropdown: false,
          text: "Pembelian",
          url: `${ppdbURL}/pembelian`,
          aktif:
            menuAktif == "/ppdb/pembelian" ||
            menuAktif == "/ppdb/bayar-formulir" ||
            menuAktif == "/ppdb/pilih-jurusan-pembelian" ||
            menuAktif == "/ppdb/kartu-peserta-pembelian",
        },
        {
          isDropdown: false,
          text: "Pengembalian",
          url: `${ppdbURL}/gelombang-ppdb`,
          aktif:
            menuAktif == "/ppdb/kartu-peserta" ||
            menuAktif == "/ppdb/pilih-jurusan" ||
            menuAktif == "/ppdb/bayar-pendaftaran" ||
            menuAktif == "/ppdb/biodata" ||
            menuAktif == "/ppdb/gelombang-ppdb" ||
            menuAktif == "/ppdb/nilai-rapor" ||
            menuAktif == "/ppdb/prestasi",
        },
        {
          isDropdown: false,
          text: "Tes Masuk ",
          url: `${ppdbURL}/ujian`,
        }
      );
    }
  }
  console.log(menuAktif, menuAktif == "/ppdb/bayar-pendaftaran");

  useEffect(() => {
    setMenuAktif(window.location.pathname);
  }, [menuAktif]);

  const handleLogout = (e) => {
    e.preventDefault();

    localStorage.removeItem("ss-token");
    router.push(`${ppdbURL}`);
  };

  // Modifikasi bagian rendering untuk mendukung dropdown
  const renderMenu = () => {
    return headerMenus.map((menu, idx) => {
      if (menu.isDropdown) {
        // Jika menu adalah dropdown
        return (
          <li className="nav-item dropdown" key={`${idx}-${menu.text}`}>
            <a
              href="#"
              className="nav-link dropdown-toggle fw-bold"
              id={`dropdown-${idx}`}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {menu.text}
            </a>
            <ul className="dropdown-menu" aria-labelledby={`dropdown-${idx}`}>
              {menu.dropdownItems?.map((item, subIdx) =>
                sekolah?.id == 70 ? (
                  <li key={`${idx}-${subIdx}`}>
                    <button className="dropdown-item" onClick={item.function}>
                      {item.text}
                    </button>
                  </li>
                ) : (
                  <li key={`${idx}-${subIdx}`}>
                    <a className="dropdown-item" href={item.url}>
                      {item.text}
                    </a>
                  </li>
                )
              )}
            </ul>
          </li>
        );
      } else {
        // Jika menu bukan dropdown
        return (
          <li
            className="nav-item"
            key={`${idx}-${menu.text}`}
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
      }
    });
  };

  return (
    <header>
      {isFrontPage ? (
        <nav className="navbar navbar-expand-lg navbar-light navbar-ppdb active position-fixed w-100 py-3">
          <div className="container-fluid px-lg-5 px-4">
            <Link href={`${ppdbURL}`}>
              <a className="navbar-brand">
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
              <ul className="navbar-nav navbar-nav-ppdb mx-auto mb-2 mb-lg-0">
                {renderMenu()}
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item d-lg-block d-flex flex-lg-row flex-column">
                  <Link href={`${ppdbURL}/login`}>
                    <a className="btn btn-ss btn-outline-primary btn-outline-primary-ss  rounded-pill mt-1 me-lg-4 mb-lg-0 mb-3">
                      Masuk
                    </a>
                  </Link>
                </li>
                <li className="nav-item d-lg-block d-flex flex-lg-row flex-column">
                  <Link href={`${ppdbURL}/login`}>
                    <a className="btn btn-ss btn-primary-ss shadow-primary-ss rounded-pill mt-lg-1">
                      Daftar
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="navbar navbar-ss navbar-expand-lg navbar-dark  bg-gradient-primary position-fixed w-100 ">
          <div className="container-fluid px-lg-5 px-4">
            <Link href={`${ppdbURL}`}>
              <a className="navbar-brand">
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
              <ul className="navbar-nav navbar-nav-ppdb mx-auto mb-2 mb-lg-0">
                {renderMenu()}
              </ul>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown dropdown-ss">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="rounded-circle border border-3">
                      <Avatar
                        name={user?.nama}
                        src={user?.avatar}
                        size={40}
                      />
                    </div>
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link href={`${ssURL}/profil`}>
                        <a className="dropdown-item">Profil</a>
                      </Link>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={(e) => handleLogout(e)}
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default HeaderPPDB;
