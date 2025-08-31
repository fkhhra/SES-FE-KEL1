import Link from "next/link";
import { useEffect, useState } from "react";
import { baseURL, ssURL } from "../../../client/clientAxios";

import { useRouter } from "next/router";
import { getProfil } from "../../../client/sharedClient";
import useUser from "../../../hooks/useUser";
import useSekolah from "../../../hooks/useSekolah";
import Avatar from "../Avatar/Avatar";
import { FaBell } from "react-icons/fa";
import { Badge } from "antd";
import useBagian from "../../../hooks/useBagian";
import client from "client/ApiClient";
import toast from "react-hot-toast";
import { logout } from "client/AuthClient";

const Header = () => {
  const router = useRouter();
  const [menuAktif, setMenuAktif] = useState(ssURL);

  const { user, setUser } = useUser();
  const { setBagian } = useBagian();
  const { sekolah } = useSekolah();

  const headerMenus = [
    {
      isDropdown: false,
      text: "Beranda",
      url: `${ssURL}`,
      isVisible:
        user?.role == "guru" ||
        user?.role == "admin" ||
        user?.role == "siswa" ||
        // user?.role === "ortu" ||
        user?.role === "alumni" ||
        user?.role === "kewiraswastaan" ||
        user?.role === "industri" ||
        user?.role == "kepsek",
    },
    {
      isDropdown: false,
      text: "Buku Kerja",
      url: `${ssURL}/buku-kerja-guru`,
      isVisible: user?.role == "guru",
    },
    {
      isDropdown: false,
      text: "Kelas",
      url: `${ssURL}/rombel`,
      isVisible: user?.role == "guru" || user?.role == "siswa",
    },
    {
      isDropdown: false,
      text: "Materi",
      url: `${ssURL}/materi`,
      isVisible:
        user?.role == "guru" ||
        user?.role === "siswa" ||
        // user?.role === "ortu" ||
        user?.role === "alumni" ||
        user?.role === "kewiraswastaan" ||
        user?.role === "industri" ||
        user?.role == "kepsek",
    },
    {
      isDropdown: false,
      text: "Monitoring KBM",
      url: `${ssURL}/kbm`,
      isVisible: user?.role == "kepsek",
    },
    {
      isDropdown: false,
      text: "Ujian",
      url: user?.role == "guru" ? `${ssURL}/ujian` : `${ssURL}/jadwal-ujian`,
      isVisible: user?.role == "guru" || user?.role === "siswa",
    },
    {
      isDropdown: false,
      text: "Transkrip",
      url: `${ssURL}/rekap`,
      isVisible: user?.role == "guru",
    },
    {
      isDropdown: false,
      text: "Postingan",
      url: `${ssURL}/post`,
      isVisible:
        user?.role == "guru" ||
        user?.role === "siswa" ||
        user?.role === "alumni" ||
        user?.role === "kewiraswastaan" ||
        user?.role == "kepsek",
    },
    {
      text: "Konsultasi",
      url: `${ssURL}/konsultasi`,
      isVisible: user?.role === "siswa" || user?.role === "guru",
    },
    {
      isDropdown: false,
      text: "Kolaborasi",
      url: `${ssURL}/proyek-saya`,
      isVisible: user?.role == "guru" || user?.role === "siswa",
    },
    {
      isDropdown: false,
      text: "Perpustakaan",
      url: `${ssURL}/perpustakaan`,
      isVisible: user?.role == "guru" || user?.role === "siswa",
    },
    // {
    //   isDropdown: false,
    //   text: "Rekap",
    //   url: `${ssURL}/rekap`,
    //   isVisible: user?.role === "ortu",
    // },
    {
      isDropdown: false,
      text: "Absen",
      url: `${ssURL}/absen`,
      isVisible: user?.role === "ortu",
    },
    {
      isDropdown: false,
      text: "Sekolah",
      url: `${ssURL}/sekolah`,
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: true,
      text: "Kurikulum",
      url: "#",
      dropdownMenus: [
        {
          text: "Jurusan",
          url: `${ssURL}/jurusan`,
        },
        {
          text: `${
            sekolah?.tingkat == "kampus" ? "Mata Kuliah" : "Mata Pelajaran"
          }`,
          url: `${ssURL}/mata-pelajaran`,
        },
        {
          text: "Tahun Akademik",
          url: `${ssURL}/tahun-akademik`,
        },
        {
          text: "Perencanaan Pembelajaran",
          url: `${ssURL}/tahun-akademik`,
        },
      ],
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: true,
      text: "TU",
      url: "#",
      dropdownMenus: [
        {
          text: `${
            sekolah?.tingkat == "kampus" ? "Pendaftaran Mahasiswa" : "PPDB"
          }`,
          url: `${ssURL}/ppdb`,
        },
      ],
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: true,
      text: "Sarpras",
      url: "#",
      dropdownMenus: [
        {
          text: "Tanah & Bangunan",
          url: `${ssURL}/tanah-bangunan`,
        },
        {
          text: "Ruang",
          url: `${ssURL}/ruang`,
        },
        {
          text: "Alat, Angkutan, & Buku",
          url: `${ssURL}/alat-angkutan-buku`,
        },
      ],
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: false,
      text: `${sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}`,
      url: `${ssURL}/gtk`,
      isVisible: user?.role == "admin" || user?.role == "kepsek",
    },
    {
      isDropdown: false,
      text: `${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
      url: `${ssURL}/siswa`,
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: false,
      text: "Rombel",
      url: `${ssURL}/rombel`,
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: true,
      text: "Jadwal",
      url: "#",
      dropdownMenus: [
        {
          text: "Jam Mengajar",
          url: `${ssURL}/jam-mengajar`,
        },
        {
          text: "Jadwal Mengajar",
          url: `${ssURL}/jadwal-mengajar`,
        },
      ],
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: false,
      text: "E-Rapor",
      url: `${ssURL}/e-rapor`,
      isVisible: user?.role == "admin",
    },
    {
      isDropdown: false,
      text: "Surat",
      url: `${ssURL}/surat-masuk`,
      isVisible: user?.role == "admin" || user?.role == "kepsek" || user?.role == "guru",
    },
    {
      isDropdown: false,
      text: "Tata Tertib",
      url: `${ssURL}/tata-tertib`,
      isVisible: user?.role == "guru" || user?.role == "siswa",
    },
    {
      isDropdown: false,
      text: "Beranda",
      url: `${ssURL}/pengawasan`,
      isVisible: user?.role == "pengawas",
    },
    {
      isDropdown: false,
      text: "Data",
      url: `${ssURL}/gtk`,
      isVisible: user?.role == "pengawas",
    },
    {
      isDropdown: false,
      text: "Buku Kerja",
      url: `${ssURL}/pengawasan/buku-kerja-guru`,
      isVisible: user?.role == "pengawas" || user?.role == "kepsek",
    },
    {
      isDropdown: false,
      text: `PKL ${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
      url: `${ssURL}/pkl/penerimaan`,
      isVisible: user?.role == "pengawas",
    },
    {
      isDropdown: false,
      text: "Rapor",
      url: `${ssURL}/rapor-buku-induk`,
      isVisible: user?.role == "kepsek",
    },
  ];

  const headerData = headerMenus.filter((menu) => menu.isVisible);

  useEffect(() => {
    setMenuAktif(window.location.pathname);
  }, [menuAktif]);

  const handleLogout = async (e) => {
    e.preventDefault();

    const payload = { user_id: user?.id };

    const { data } = await logout(payload);
    if (data) {
      localStorage.removeItem("ss-token");
      router.push(`${ssURL}/login`);
      toast.success(data?.message);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-ss navbar-expand-lg navbar-dark  bg-gradient-primary position-fixed w-100 ">
        <div className="container-fluid px-lg-5 px-0">
          <Link href={`${ssURL}/`}>
            <a className="navbar-brand me-0 ms-4 mb-2">
              <img src={`/img/ss-logo-white.png`} width={40} height={40} />
            </a>
          </Link>
          <button
            className="navbar-toggler ms-auto mb-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <li className="nav-item dropdown dropdown-ss d-lg-none d-block mb-2 me-4">
            <a
              className="nav-link dropdown-toggle d-flex align-items-center text-white pe-0"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="rounded-circle border border-3">
                <Avatar name={user?.nama} src={user?.avatar} size={40} />
              </div>
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link href={`${ssURL}/profil`}>
                  <a className="dropdown-item">Profil</a>
                </Link>
              </li>
              {(user?.role === "siswa" || user?.role === "guru") && (
                <li>
                  <Link href={`${ssURL}/absen`}>
                    <a className="dropdown-item">Absen</a>
                  </Link>
                </li>
              )}
              {/* {user?.role === "guru" && (
                <li>z
                  <Link href={`${ssURL}/pengaturan/guru`}>
                    <a className="dropdown-item">Pengaturan</a>
                  </Link>
                </li>
              )} */}
              {user?.role == "siswa" && sekolah?.status == "S" && (
                <li>
                  <Link href={`${ssURL}/tagihan`}>
                    <a className="dropdown-item">Tagihan</a>
                  </Link>
                </li>
              )}
              <li>
                <Link href={sekolah?.id == 13 ? 
                  `${ssURL}/chatbot` : 
                  `/under-construction`
                }>
                  <a className="dropdown-item">Chatbot</a>
                </Link>
              </li>
              <li>
                <Link href={`${ssURL}/lost-found`}>
                  <a className="dropdown-item">Lost and Found</a>
                </Link>
              </li>

              <li>
                <a className="dropdown-item" onClick={(e) => handleLogout(e)}>
                  Logout
                </a>
              </li>
            </ul>
          </li>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {headerData?.map((menu, idx) => {
                if (menu.isDropdown) {
                  return (
                    <li
                      className="nav-item dropdown dropdown-ss"
                      key={`${idx}-${new Date().getTime()}`}
                    >
                      <a
                        className="nav-link dropdown-toggle fw-bold"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {menu.text}
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        {menu.dropdownMenus.map((dropdownMenu, idx) => {
                          return (
                            <li key={`${idx}-${new Date().getTime()}`}>
                              <Link href={dropdownMenu.url}>
                                <a
                                  className="dropdown-item"
                                  onClick={() => setMenuAktif(menu.url)}
                                >
                                  {dropdownMenu.text}
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                } else {
                  return (
                    <li
                      className="nav-item text-lg-start text-center py-2"
                      key={`${idx}-${new Date().getTime()}`}
                    >
                      <Link href={menu.url}>
                        <a
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
                      </Link>
                    </li>
                  );
                }
              })}
              {sekolah.id == 55 ? (
                <li className="nav-item">
                  <a
                    className="nav-link fw-bold"
                    onClick={() => {
                      setUser({ ...user, role: "kurikulum" });
                      setBagian("kurikulum");
                    }}
                  >
                    Kurikulum
                  </a>
                </li>
              ) : null}
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0 d-md-block d-none">
              {/* <li className="nav-item d-flex align-items-center me-4">
                <Link href={`${ssURL}/notifikasi`}>
                  <Badge count={1000} overflowCount={999}>
                    <a
                      className="nav-link d-flex align-items-center p-1 fs-4"
                      style={{ color: "white" }}
                    >
                      <FaBell />
                    </a>
                  </Badge>
                </Link>
              </li> */}
              <li className="nav-item dropdown dropdown-ss">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="rounded-circle border border-3">
                    <Avatar name={user?.nama} src={user?.avatar} size={40} />
                  </div>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href={`${ssURL}/profil`}>
                      <a className="dropdown-item">Profil</a>
                    </Link>
                  </li>
                  {(user?.role === "siswa" || user?.role === "guru") && (
                    <li>
                      <Link href={`${ssURL}/absen`}>
                        <a className="dropdown-item">Absen</a>
                      </Link>
                    </li>
                  )}
                  {user?.role == "siswa" && sekolah?.status == "S" && (
                    <li>
                      <Link href={`${ssURL}/tagihan`}>
                        <a className="dropdown-item">Tagihan</a>
                      </Link>
                    </li>
                  )}
                  <li>
										<Link href={sekolah?.id == 13 ? 
											`${ssURL}/chatbot` : 
											`/under-construction`
										}>
											<a className="dropdown-item">Chatbot</a>
										</Link>
									</li>
                  <li>
                    <Link href={`${ssURL}/lost-found`}>
                      <a className="dropdown-item">Lost and Found</a>
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
    </header>
  );
};

export default Header;
