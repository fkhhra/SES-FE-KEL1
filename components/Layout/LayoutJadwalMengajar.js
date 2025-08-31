import { useEffect } from "react";
import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";
import { getProfil } from "client/sharedClient";
import { meSekolah } from "client/SekolahClient";

import useUser from "hooks/useUser";
import useSekolah from "hooks/useSekolah";
import Head from "next/head";

import HeaderJadwalMengajar from "components/Shared/Header/HeaderJadwalMengajar";
import SideNavJadwalMengajar from "components/JadwalMengajar/SideNavJadwalMengajar";
import NavHariMengajarDesktop from "components/JadwalMengajar/NavHariMengajarDesktop";
import NavHariMengajarMobile from "components/JadwalMengajar/NavHariMengajarMobile";
import SideNavJadwalMengajarMobile from "components/JadwalMengajar/SideNavJadwalMengajarMobile";

const LayoutJadwalMengajar = ({
  children,
  jamMengajar,
  tingkatRombel,
  listRombel,
  id,
}) => {
  const router = useRouter();
  const { setUser } = useUser();
  const { setSekolah, sekolah } = useSekolah();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();
    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200 && router.pathname != "/smartschool/profil") {
      return setUser(data.user);
    }

    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  useEffect(() => {
    getProfilData();
    getMeSekolahData();
  }, []);

  const listHari = [
    {
      hari: "Senin",
      kode: 1,
    },
    {
      hari: "Selasa",
      kode: 2,
    },
    {
      hari: "Rabu",
      kode: 3,
    },
    {
      hari: "Kamis",
      kode: 4,
    },
    {
      hari: "Jum'at",
      kode: 5,
    },
    {
      hari: "Sabtu",
      kode: 6,
    },
    {
      hari: "Minggu",
      kode: 0,
    },
  ];

  return (
    <div className="smartschool-app">
      <Head>
        <title>Smarteschool</title>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      <HeaderJadwalMengajar
        tingkatRombel={tingkatRombel}
        listRombel={listRombel}
        idTa={id}
      />
      <NavHariMengajarDesktop listHari={listHari} />
      <NavHariMengajarMobile listHari={listHari} />
      {jamMengajar && (
        <>
          <SideNavJadwalMengajar jamMengajar={jamMengajar} />
          <SideNavJadwalMengajarMobile jamMengajar={jamMengajar} />
        </>
      )}
      <main className="main-jadwal-mengajar">{children}</main>
      <footer className="bg-main">
        <div className="container py-4 text-center">
          <small>
            &copy;Smartschool {new Date().getFullYear()}. Hak Cipta Dilindungi
            oleh Undang-undang.
            <br />
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none"
            >
              Powered by Smart School.
            </a>
          </small>
        </div>
      </footer>
    </div>
  );
};

export default LayoutJadwalMengajar;
