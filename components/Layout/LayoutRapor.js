import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeaderDetail from "../Shared/Header/HeaderDetail";
import { axiosInstance, ssURL } from "../../client/clientAxios";
import { getProfil } from "../../client/sharedClient";
import useUser from "../../hooks/useUser";
import useSekolah from "../../hooks/useSekolah";
import { meSekolah } from "../../client/SekolahClient";
import Head from "next/head";
import HeaderPesertaUjian from "../Shared/Header/HeaderPesertaUjian";
import HeaderRapor from "components/Shared/Header/HeaderRapor";

const LayoutRapor = ({
  children,
  isFluid,
  title,
  modalWrapper,
  backProps = false,
  url,
  listRombel,
  selectedRombel,
  jenisRapor,
  setTengahSemester,
  setAkhirSemester,
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
      <HeaderRapor
        backProps={backProps}
        title={title}
        href={url}
        jenisRapor={jenisRapor}
        setTengahSemester={setTengahSemester}
        setAkhirSemester={setAkhirSemester}
      />
      <main className="bg-main" style={{ paddingTop: "100px" }}>
        <div
          className={`${
            isFluid ? "container-fluid py-4" : "container py-4"
          } mt-sm-0 mt-4`}
        >
          {children}
        </div>
      </main>
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

export default LayoutRapor;
