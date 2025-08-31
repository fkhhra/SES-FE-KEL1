import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssURL } from "../../client/clientAxios";
import { meSekolah } from "../../client/SekolahClient";
import { getProfil } from "../../client/sharedClient";
import useSekolah from "../../hooks/useSekolah";
import Head from "next/head";
import Help from "../Help/Help";

const BukuTamuLayout = ({ children }) => {
  const [meSekolahData, setMeSekolahData] = useState({});
  const { sekolah } = meSekolahData;

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
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
    <>
      <div className="buku-tamu-layout py-5">
        <Head>
          <title>Smarteschool</title>
          <link rel="shortcut icon" href={sekolah?.favicon} />
        </Head>
        <div className="container">
          <div
            className="p-4 rounded-ss"
            style={{
              background: "rgba(255,255,255,.15)",
            }}
          >
            <div className="card card-ss container rounded-ss">
              <div className="bg-light">
                <div className="row justify-content-between">{children}</div>
              </div>
            </div>
          </div>
        </div>

        <Help isAuth />
      </div>
      <section className="bg-gradient-primary text-white">
        <div className="container py-4 text-center">
          <small>
            &copy;Smartschool {new Date().getFullYear()}. Hak Cipta Dilindungi
            oleh undang-undang. | {""}
            <a
              href="https://smarteschool.id"
              target="_blank"
              rel="noreferrer noopener"
              className="text-decoration-none fw-bold text-white"
            >
              Powered by Smartschool Indonesia.
            </a>
          </small>
        </div>
      </section>{" "}
    </>
  );
};

export default BukuTamuLayout;
