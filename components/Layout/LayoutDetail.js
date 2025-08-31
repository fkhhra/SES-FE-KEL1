import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeaderDetail from "../Shared/Header/HeaderDetail";
import { axiosInstance, ssURL } from "../../client/clientAxios";
import { getProfil } from "../../client/sharedClient";
import useUser from "../../hooks/useUser";
import useSekolah from "../../hooks/useSekolah";
import { meSekolah } from "../../client/SekolahClient";
import Head from "next/head";
import { detailRencana } from "utilities/KeuanganUtils";
import useRencana from "hooks/useRencanaKeuangan";
import useTa from "hooks/useTa";

const LayoutDetail = ({
  children,
  isFluid,
  title,
  modalWrapper,
  backProps = false,
  bgMain,
  id,
}) => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const { ta, setTa } = useTa();
  const { rencana, setRencana } = useRencana();

  const _detailRencana = async () => {
    if (id) {
      if (!rencana || rencana?.id != id) {
        const data = await detailRencana(id);
        setRencana(data);
      }
    }
  };

  useEffect(() => {
    _detailRencana();
  }, [rencana]);

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
    setTa(data.ta);
    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  useEffect(() => {
    getProfilData();
    getMeSekolahData();
    // var Tawk_API = Tawk_API || {},
    //   Tawk_LoadStart = new Date();
    // (function () {
    //   var s1 = document.createElement("script"),
    //     s0 = document.getElementsByTagName("script")[0];
    //   s1.async = true;
    //   s1.src = "https://embed.tawk.to/61ca76f6c82c976b71c3bd71/1fnve1dbo";
    //   s1.charset = "UTF-8";
    //   s1.setAttribute("crossorigin", "*");
    //   s0.parentNode.insertBefore(s1, s0);
    // })();
  }, []);

  return (
    <div className="smartschool-app">
      <Head>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      <HeaderDetail backProps={backProps} title={title} />
      <main className={`${bgMain ? "bg-main" : "bg-light"}`}>
        <div className={isFluid ? "container-fluid py-4" : "container py-4"}>
          {children}
        </div>
      </main>
      {modalWrapper}
      <footer className={`${bgMain ? "bg-main" : "bg-light"}`}>
        <div className="container py-4 text-center">
          <small>
            &copy;Smarteschool {new Date().getFullYear()}. Hak Cipta Dilindungi
            oleh Undang-undang.
            <br />
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none"
            >
              Powered by Smarteschool.
            </a>
          </small>
        </div>
      </footer>
    </div>
  );
};

export default LayoutDetail;
