import Link from "next/link";
import { useEffect, useState } from "react";
import { baseURL, ssURL } from "../../../client/clientAxios";

import { useRouter } from "next/router";
import { getProfil } from "../../../client/sharedClient";
import useUser from "../../../hooks/useUser";
import useBagian from "../../../hooks/useBagian";
import { FaChevronLeft } from "react-icons/fa";
import Avatar from "../Avatar/Avatar";
import useSekolah from "hooks/useSekolah";
import { logout } from "client/AuthClient";
import toast from "react-hot-toast";

const OperatorHeader = () => {
  const router = useRouter();
  const { sekolah } = useSekolah();

  const [menuAktif, setMenuAktif] = useState(ssURL);

  const { user } = useUser();
  const { bagian } = useBagian();

  let menus = [];

  if (bagian == "tata-usaha") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },

      // {
      //   isDropdown: false,
      //   text: "Gelombang PPDB",
      //   url: `${ssURL}/gelombang-ppdb`,
      // },
      {
        isDropdown: false,
        text: `Kehadiran ${sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}`,
        url: `${ssURL}/kehadiran-gtk`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Barang ATK",
        url: `${ssURL}/atk`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Surat",
        url: `${ssURL}/surat-masuk`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Broadcast",
        url: `${ssURL}/broadcast`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "marketplace") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Marketplace",
        url: `${ssURL}/marketplace`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "kurikulum") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: `${sekolah?.tingkat == "kampus" ? "Dosen" : "GTK"}`,
        url: `${ssURL}/gtk`,
        isVisible: user?.role == "admin",
        active: menuAktif == `${ssURL}/kehadiran-gtk`,
      },
      {
        isDropdown: false,
        text: `${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
        url: `${ssURL}/siswa`,
        isVisible: user?.role == "admin",
        active: menuAktif == `${ssURL}/kehadiran-siswa-v2`,
      },
      {
        isDropdown: false,
        text: "Jurusan",
        url: `${ssURL}/jurusan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Tahun Akademik",
        url: `${ssURL}/tahun-akademik-v2`,
        isVisible: user?.role == "admin",
      },
      // {
      //   isDropdown: false,
      //   text: "Mapel",
      //   url: `${ssURL}/mata-pelajaran`,
      // },

      // {
      //   isDropdown: false,
      //   text: "Rombel",
      //   url: `${ssURL}/rombel`,
      // },
      // {
      //   isDropdown: false,
      //   text: "Jam Mengajar",
      //   url: `${ssURL}/jam-mengajar`,
      // },
      {
        isDropdown: false,
        text: "Monev",
        url: `${ssURL}/kbm`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Kalender",
        url: `${ssURL}/kalender`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Buku Induk",
        url: `${ssURL}/buku-induk`,
        isVisible: user?.role == "admin",
        active:
          menuAktif == `${ssURL}/rapor-buku-induk` ||
          menuAktif == `${ssURL}/rapor-buku-induk/` ||
          menuAktif == `${ssURL}/predikat-nilai` ||
          menuAktif == `${ssURL}/bobot-nilai` ||
          menuAktif == `${ssURL}/leger-nilai`,
      },
      {
        isDropdown: false,
        text: "Buku Kerja",
        url: `${ssURL}/pengawasan/buku-kerja-guru`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "kesiswaan") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: `${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
        url: `${ssURL}/siswa`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Tata tertib",
        url: `${ssURL}/tata-tertib`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Prestasi",
        url: `${ssURL}/prestasi`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Kehadiran",
        url: `${ssURL}/kehadiran-siswa`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Ekstrakurikuler",
        url: `${ssURL}/ekstrakurikuler`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "sarpras") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Lokasi",
        url: `${ssURL}/lokasi`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Barang",
        url: `${ssURL}/barang`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Histori",
        url: `${ssURL}/histori-sarpras`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "humas") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      // {
      //   isDropdown: false,
      //   text: "Mitra Industri",
      // url: `/under-construction`,
      // isVisible: user?.role == "admin",
      //
      // },
      {
        isDropdown: false,
        text: "Tracking Alumni",
        url: `${ssURL}/ikatan-alumni`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "PKL",
        url: `${ssURL}/pkl/penerimaan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Perusahaan",
        url: `${ssURL}/perusahaan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Alumni",
        url: `${ssURL}/alumni`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Kakomli",
        url: `${ssURL}/kakomli/prakerin`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Industri",
        url: `${ssURL}/industri`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Smart E Resource",
        url: `${ssURL}/smarteresource`,
        isVisible: user?.role == "admin",
      },
      // {
      //   isDropdown: false,
      //   text: "Surel",
      // url: `${ssURL}/kotak-masuk-surel`,
      // isVisible: user?.role == "admin",
      //
      // },
      // {
      //   isDropdown: false,
      //   text: "Buku Tamu",
      // url: `${ssURL}/buku-tamu`,
      // isVisible: user?.role == "admin",
      //
      // },
    ];
  } else if (bagian == "publikasi") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Homepage",
        url: `${ssURL}/publikasi-homepage`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Profil",
        url: `${ssURL}/publikasi-profil`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Jurusan",
        url: `${ssURL}/publikasi-jurusan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Kegiatan",
        url: `${ssURL}/publikasi-kegiatan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Sarpras",
        url: `${ssURL}/publikasi-sarpras`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Blog",
        url: `${ssURL}/post`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (
    bagian == "keuangan" ||
    bagian == "aproval" ||
    bagian == "yayasan"
  ) {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Pembayaran",
        url: `${ssURL}/pembayaran`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Tunggakan",
        url: `${ssURL}/tunggakan`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: `Perencanaan`,
        url: `${ssURL}/perencanaan-keuangan`,
        isVisible:
          user?.role == "admin" &&
          (user?.mSekolahId == 13 ||
            user?.mSekolahId == 8468 ||
            user?.mSekolahId == 8731 ||
            user?.mSekolahId == 8780 ||
            user?.mSekolahId == 8858 ||
            user?.mSekolahId == 8880 ||
            user?.mSekolahId == 8885 ||
            user?.mSekolahId == 8940 ||
            user?.mSekolahId == 9078),
      },
      {
        isDropdown: false,
        text:
          user?.mSekolahId == 13 ||
          user?.mSekolahId == 8468 ||
          user?.mSekolahId == 8731 ||
          user?.mSekolahId == 8780 ||
          user?.mSekolahId == 8858 ||
          user?.mSekolahId == 8880 ||
          user?.mSekolahId == 8885 ||
          user?.mSekolahId == 8940 ||
          user?.mSekolahId == 9078
            ? `Realisasi`
            : `Rekening`,
        url:
          user?.mSekolahId == 13 ||
          user?.mSekolahId == 8468 ||
          user?.mSekolahId == 8731 ||
          user?.mSekolahId == 8780 ||
          user?.mSekolahId == 8858 ||
          user?.mSekolahId == 8880 ||
          user?.mSekolahId == 8885 ||
          user?.mSekolahId == 8940 ||
          user?.mSekolahId == 9078
            ? `${ssURL}/akun-keuangan`
            : `${ssURL}/rekening`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Analisis",
        url: `${ssURL}/analisis-keuangan/data-laporan`,
        isVisible:
          user?.role == "admin" &&
          // (user?.mSekolahId == 13 ||
          //   user?.mSekolahId == 8468 ||
          //   user?.mSekolahId == 8731),
          user?.mSekolahId == 1,
      },
      {
        isDropdown: false,
        text: "Inventaris",
        url: `${ssURL}/inventaris/aset-tertunda`,
        isVisible:
          user?.role == "admin" &&
          (user?.mSekolahId == 13 ||
            user?.mSekolahId == 8468 ||
            user?.mSekolahId == 8731 ||
            user?.mSekolahId == 8780 ||
            user?.mSekolahId == 8858 ||
            user?.mSekolahId == 8880 ||
            user?.mSekolahId == 8885 ||
            user?.mSekolahId == 8940 ||
            user?.mSekolahId == 9078) &&
          (user?.bagian == "aproval" || !user?.bagian),
      },
      {
        isDropdown: false,
        text: `Mutasi`,
        url: `${ssURL}/mutasi`,
        isVisible:
          user?.role == "admin" &&
          (user?.mSekolahId != 13 ||
            user?.mSekolahId != 8468 ||
            user?.mSekolahId != 8731 ||
            user?.mSekolahId == 8780 ||
            user?.mSekolahId != 8858 ||
            user?.mSekolahId != 8880 ||
            user?.mSekolahId != 8885 ||
            user?.mSekolahId == 8940 ||
            user?.mSekolahId == 9078),
      },

      {
        isDropdown: false,
        text: "Histori",
        url: `${ssURL}/histori-keuangan`,
        isVisible:
          user?.role == "admin" &&
          (user?.mSekolahId == 13 ||
            user?.mSekolahId == 8468 ||
            user?.mSekolahId == 8731 ||
            user?.mSekolahId == 8780 ||
            user?.mSekolahId == 8858 ||
            user?.mSekolahId == 8880 ||
            user?.mSekolahId == 8885 ||
            user?.mSekolahId == 8940 ||
            user?.mSekolahId == 9078),
      },

      // {
      //   isDropdown: false,
      //   text: "Laporan",
      // url: `${ssURL}/laporan-keuangan`,
      // isVisible: user?.role == "admin",
      //
      // },
    ];
  } else if (bagian == "ujian") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Bank Soal",
        url: `${ssURL}/ujian`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Jadwal Ujian",
        url: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "pengawas") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Jadwal Ujian",
        url: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "dapodik") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Import",
        url: `${ssURL}/dapodik-import`,
        isVisible: user?.role == "admin",
      },
    ];
  } else if (bagian == "absensi") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Sinkronisasi",
        url: `${ssURL}/sinkron`,
        isVisible: user?.role == "admin",
      },
      // {
      //   isDropdown: false,
      //   text: "Monitoring",
      // url: `${ssURL}/camera`,
      // isVisible: user?.role == "admin",
      //
      // },
    ];
  } else if (bagian == "ppdb") {
    menus = [
      {
        isDropdown: false,
        text: "Beranda",
        url: `${ssURL}`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Alur",
        url: `${ssURL}/alur-ppdb`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Jalur",
        url: `${ssURL}/jalur-pendaftaran`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Pendaftar",
        url: `${ssURL}/pendaftar-ppdb`,
        isVisible: user?.role == "admin",
      },
      {
        isDropdown: false,
        text: "Ujian Penerimaan",
        url: `${ssURL}/ujian-penerimaan-ppdb`,
        isVisible: user?.role == "admin",
      },
    ];
  }

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

  const { setBagian } = useBagian();

  const headerData = menus.filter((menu) => menu.isVisible);

  return (
    <header>
      <nav className="navbar navbar-ss navbar-expand-lg navbar-dark  bg-gradient-primary position-fixed w-100 ">
        <div className="container-fluid px-lg-5 px-0">
          <Link href={`${ssURL}/`}>
            <a className="navbar-brand me-0">
              {bagian && (
                <div
                  className="d-flex align-items-center ms-4 ms-lg-0 mb-2"
                  onClick={() => setBagian("")}
                >
                  <FaChevronLeft className="me-3" />
                  <img src={`/img/ss-logo-white.png`} width={40} height={40} />
                </div>
              )}
              {!bagian && (
                <>
                  <img
                    src="/img/logo-smarteschool-white.png"
                    height={40}
                    className="d-md-block d-none ms-4 mb-2"
                  />
                  <img
                    src={`/img/ss-logo-white.png`}
                    width={40}
                    height={40}
                    className="d-md-none d-block ms-4 mb-2"
                  />
                </>
              )}
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
                <Avatar
                  name={user?.nama}
                  src={user?.avatar}
                  size={40}
                  className="rounded-cirlce"
                />
              </div>
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link href={`${ssURL}/profil`}>
                  <a className="dropdown-item">Profil</a>
                </Link>
              </li>
              <li>
                    <Link href={`${ssURL}/pengaturan/keamanan`}>
                      <a className="dropdown-item">Pengaturan</a>
                    </Link>
                  </li>
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
                        className="nav-link dropdown-toggle fw-bold  text-lg-start text-center"
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
                          {...(menuAktif == menu.url || menu.active
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
            </ul>
            <ul className="navbar-nav mb-2 mb-lg-0 d-md-block d-none">
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
                      className="rounded-cirlce"
                    />
                  </div>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link href={`${ssURL}/profil`}>
                      <a className="dropdown-item">Profil</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`${ssURL}/pengaturan/keamanan`}>
                      <a className="dropdown-item">Pengaturan</a>
                    </Link>
                  </li>
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

export default OperatorHeader;
