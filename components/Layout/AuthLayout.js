import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../client/clientAxios";
import { meSekolah } from "../../client/SekolahClient";
import { getProfil } from "../../client/sharedClient";
import useSekolah from "../../hooks/useSekolah";
import Head from "next/head";
import Help from "../Help/Help";

const AuthLayout = ({ children }) => {
  const [meSekolahData, setMeSekolahData] = useState({});
  const { sekolah } = meSekolahData;
  const router = useRouter();

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          setMeSekolahData(data);
          return;
        }

        router.push(data?.sekolah?.domainBackup);
      }
      setMeSekolahData(data);
    }
  };

  useEffect(() => {
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
    <div className="auth-layout bg-primary bg-gradient py-5">
      <Head>
        <title>Smarteschool</title>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      <div className="container">
        <div className="card rounded-ss">
          <div className="card-body p-sm-5 p-3 py-5">
            {children}
            <div className="text-center mt-5">
              {sekolah?.id == 5 ? (
                <>
                  &copy;Smarteschool 2020. Hak Cipta Dilindungi oleh
                  Undang-undang.
                </>
              ) : (
                <>
                  &copy;Smartschool {new Date().getFullYear()}. Hak Cipta
                  Dilindungi oleh Undang-undang.
                </>
              )}

              <br />
              <a
                href={`${
                  sekolah?.id == 5
                    ? "https://smarteschool.id/"
                    : "https://smarteschool.id"
                }`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-decoration-none"
              >
                {" "}
                {sekolah?.id == 5
                  ? "Powered by Smarteschool"
                  : "Powered by Smarteschool."}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Help isAuth />
    </div>
  );
};

export default AuthLayout;
