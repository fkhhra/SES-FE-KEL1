import { useEffect } from "react";
import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";
import { getProfil } from "client/sharedClient";
import { meSekolah } from "client/SekolahClient";

import useUser from "hooks/useUser";
import useSekolah from "hooks/useSekolah";
import Head from "next/head";

import SideNavJadwalMengajar from "components/JadwalMengajar/SideNavJadwalMengajar";
import NavHariMengajarDesktop from "components/JadwalMengajar/NavHariMengajarDesktop";
import NavHariMengajarMobile from "components/JadwalMengajar/NavHariMengajarMobile";
import SideNavJadwalMengajarMobile from "components/JadwalMengajar/SideNavJadwalMengajarMobile";
import HeaderDetailPenerimaanPerusahaan from "components/Shared/Header/HeaderDetailPenerimaanPerusahaan";

const LayoutDetailPenerimaanPerusahaan = ({
  children,
  jamMengajar,
  tingkatRombel,
  listRombel,
  perusahaan,
  semuaPenerimaan,
  urlPenerimaan,
  selectPenerimaan,
  dataPerusahaan,
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
      <HeaderDetailPenerimaanPerusahaan
        // tingkatRombel={tingkatRombel}
        listpenerimaan={semuaPenerimaan}
        perusahaan={perusahaan}
        selectPenerimaan={selectPenerimaan}
        urlPenerimaan={urlPenerimaan}
        dataPerusahaan={dataPerusahaan}
      />
      <main className="container py-4 bg-main">{children}</main>
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

export default LayoutDetailPenerimaanPerusahaan;
