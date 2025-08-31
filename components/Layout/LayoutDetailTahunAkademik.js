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
import HeaderDetailTahunAkademik from "components/Shared/Header/HeaderDetailTahunAkademik";

const LayoutDetailTahunAkademik = ({
  children,
  modalWrapper,
  semuaTA,
  dataTA,
  id,
  route,
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

  return (
    <div className="smartschool-app">
      <Head>
        <title>Smarteschool</title>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      <HeaderDetailTahunAkademik
        semuaTA={semuaTA}
        dataTA={dataTA}
        route={route}
        // tingkatRombel={tingkatRombel}
        // listRombel={listRombel}
        // idTa={id}
      />
      <main className="container py-4">{children}</main>
      {modalWrapper}
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

export default LayoutDetailTahunAkademik;
