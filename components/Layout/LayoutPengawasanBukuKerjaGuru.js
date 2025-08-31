import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeaderDetail from "../Shared/Header/HeaderDetail";
import { axiosInstance, ssURL } from "../../client/clientAxios";
import { getProfil } from "../../client/sharedClient";
import useUser from "../../hooks/useUser";
import useSekolah from "../../hooks/useSekolah";
import { meSekolah } from "../../client/SekolahClient";
import Head from "next/head";
import HeaderPengawasanBukuKerjaGuru from "components/Shared/Header/HeaderPengawasanBukuKerjaGuru";

const LayoutPengawasanBukuKerjaGuru = ({
  children,
  isFluid,
  modalWrapper,
  listGuru,
  currentUser
}) => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const { setSekolah, sekolah } = useSekolah();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      setSekolah(data.sekolah);
    }
  };

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (
      data &&
      status === 200 &&
      router.pathname != "/smartschool/profil" &&
      router.pathname != "/smartschool/profil/[id]"
    ) {
      return setUser(data.user);
    }

    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  useEffect(() => {
    getProfilData();
    getMeSekolahData();
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/61ca76f6c82c976b71c3bd71/1fnve1dbo";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return (
    <div className="smartschool-app">
      <Head>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      <HeaderPengawasanBukuKerjaGuru listGuru={listGuru} currentUser={currentUser} />
      <main className="bg-light" style={{ paddingTop: "100px" }}>
        <div
          className={`${
            isFluid ? "container-fluid py-4" : "container py-4"
          } mt-sm-0 mt-4`}
        >
          {children}
        </div>
      </main>
      {modalWrapper}
      <footer className="bg-light">
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

export default LayoutPengawasanBukuKerjaGuru;
