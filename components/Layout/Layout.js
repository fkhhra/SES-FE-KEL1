import useWaBot from "hooks/useWhatsappBot";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ppdbURL, ssURL } from "../../client/clientAxios";
import { meSekolah } from "../../client/SekolahClient";
import { getProfil } from "../../client/sharedClient";
import { activate, sendActivationCode } from "../../client/UserClient";
import useBagian from "../../hooks/useBagian";
import useSekolah from "../../hooks/useSekolah";
import useTa from "../../hooks/useTa";
import useUser from "../../hooks/useUser";
import { hideModal } from "../../utilities/ModalUtils";
import Help from "../Help/Help";
import BottomNavigation from "../Shared/Header/BottomNavigation";
import Header from "../Shared/Header/Header";
import OperatorHeader from "../Shared/Header/OperatorHeader";
import ModalAktivasi from "./ModalAktivasi";
import useUserSiswa from "hooks/useUserSiswa";
import browser from "browser-detect";

const Layout = ({
  children,
  isFluid,
  modalWrapper,
  isIndex,
  isDashboard,
  token,
  isCenteredPage,
}) => {
  const router = useRouter();
  const { setUser, user } = useUser();
  const { setUserSiswa, userSiswa } = useUserSiswa();
  const { setSekolah, sekolah } = useSekolah();
  const { setBagian, bagian } = useBagian();
  const { waBot, setWaBot } = useWaBot();
  const { ta, setTa } = useTa();
  const [buttonAktivasi, setButtonAktivasi] = useState("idle");
  const [formData, setFormData] = useState({
    whatsapp: "",
    email: "",
  });

  const browserList = [
    "Android",
    "Ios",
    "IOS",
    "ANDROID",
    "android",
    "ios",
    // "safari",
    // "Safari",
    "smandel-exam-browser-01081958",
    "smandel-exam-browser-aja",
  ];

  const osList = ["Android", "Ios", "IOS", "ANDROID", "android", "ios"];
  const versionList = ["14.0.3"];
  const checkUserAgent = (examBro) => {
    const result = browser();
    console.log(result);

    if (examBro?.user_agent) {
      // Jika userAgent tidak termasuk dalam daftar browser yang diizinkan, dan fitur ExamBro diaktifkan
      if (
        (browserList.some((browser) => result.name.includes(browser)) &&
          osList.some((browser) => result.os.includes(browser))) ||
        versionList.some((browser) => result?.version.includes(browser))
      ) {
        // toast.success(userAgent);
        console.log("Selamat datang");
        // toast.success(result?.name);
        // toast.success(result?.mobile);
        // toast.success(result?.version);
        // toast.success(result?.versionNumber);
        // toast.success(result?.os);

        // toast.error("Harap Buka di ExamBrowser");
        // window.location.replace("https://smarteschool.id/");
        // toast.error("Harap Bukodalpa di ExamBrowser");
        // window.location.replace("https://smarteschool.id/");
      } else {
        // toast.success(userAgent);
        // toast.success(result?.name);
        // toast.success(result?.mobile);
        // toast.success(result?.version);
        // toast.success(result?.versionNumber);
        // toast.success(result?.os);
        toast.error("Harap Buka di ExamBrowser");
        window.location.replace("https://smarteschool.id/");
        console.log("Selamat Datang");
      }
    } else {
      console.log("Selamat Datang");
    }
  };

  useEffect(() => {
    if (user?.role == "admin") {
      if (ta == 404) {
        toast.success(
          "Aktifkan Tahun Akademik sebelum memulai penggunaan Smarteschool"
        );
        setBagian("kurikulum");
        router.push(`/smartschool/tahun-akademik-v2`);
      }
    }
  }, [ta]);

  useEffect(() => {
    setBagian(
      user?.bagian?.split(";").length == 1
        ? user?.bagian?.split(";")[0]
        : localStorage.getItem("bagian") || ""
    );
  }, [user]);

  const getProfilData = async () => {
    const { data, status } = await getProfil();
    if (data && status === 200) {
      if (data.user?.role == "ppdb") {
        router.push(`${ppdbURL}`);
      }

      setTa(data?.ta);
      setUser(data?.user);
      if (
        (data?.user?.role == "siswa" && sekolah?.id == 8123) ||
        (data?.user?.role == "siswa" && sekolah?.id == 8027)
      ) {
        await checkUserAgent(JSON?.parse(sekolah?.fitur?.fitur));
      }
      setUserSiswa(data?.userSiswa);
    }

    if (status === 401 || status === 403) {
      router.push(`${ssURL}/login`);
    }
  };

  const getMeSekolahData = async () => {
    const { data } = await meSekolah();

    if (data) {
      if (data?.sekolah?.domainBackup) {
        if (location.href.indexOf(data?.sekolah?.domainBackup) > -1) {
          return;
        }
        router.push(data?.sekolah?.domainBackup);
      }
      setSekolah(data.sekolah);
      setWaBot(data.whatsappBot);
    }
  };

  const sendActivation = async (wa) => {
    const { data, error } = await sendActivationCode({
      ...formData,
      whatsapp: wa || "",
    });

    if (data) {
      toast.success("Kode verifikasi terkirim");
      setFormData({ ...formData, terkirim: 1, data: data.message });
    } else {
      toast.error(error.message.message);
    }
  };

  const aktifkan = async () => {
    setButtonAktivasi("loading");
    const { data, error } = await activate({ ...formData });

    if (data) {
      toast.success(data.message);
      setButtonAktivasi("success");
      setFormData({ whatsapp: "", email: "" });
      getProfilData();
      hideModal("modalAktivasi");
    } else {
      toast.error(error.message);
      setButtonAktivasi("error");
    }
  };

  useEffect(() => {
    getMeSekolahData();

    if (token) {
      localStorage.setItem("ss-token", JSON.stringify(token));
      getProfilData();
    } else {
      getProfilData();
    }

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

  //  useEffect(() => {
  //     if (user.userAgent != window.navigator.userAgent) {
  //        console.log(user.userAgent);
  //        console.log(window.navigator.userAgent);
  //        router.push(`${ssURL}/login`);
  //        toast.success("Berhasil masuk di perangkat lain");
  //     }
  //  }, [user]);

  return (
    <div className="smartschool-app">
      <Head>
        <title>Smarteschool</title>
        <link rel="shortcut icon" href={sekolah?.favicon} />
      </Head>
      {user?.role == "admin" || user?.role == "kurikulum" ? (
        <OperatorHeader />
      ) : (
        <Header />
      )}
      <main
        className={`${isIndex ? "bg-light" : "bg-main"} ${
          isCenteredPage
            ? "d-flex align-items-center justify-content-center"
            : ""
        }`}
      >
        {/* {!user?.waReal &&
          user?.role != "admin" &&
          user?.role != "pengawas" &&
          Object.keys(user).length != 0 && ( */}
        {/* <> */}
        {/* <a */}
        {/* // className="w-100 d-flex justify-content-center text-white sticky-top py-3 px-4 notification-bar-verification bg-warning" */}
        {/* // style={{
                //   background: `url("/img/bg-verification-${
                //     user?.waReal ? (user?.email ? "" : "email") : "whatsapp"
                //   }.svg")`,
                // }}
                // data-bs-toggle="modal"
                // data-bs-target="#modalAktivasi" */}
        {/* > */}
        {/* <div className="d-flex align-items-sm-center align-items-start">
                  <img
                    src="/img/exclamation-notification-bar.svg"
                    alt="icon"
                    className="me-3"
                  />
                  <span>
                    Anda belum mengaktifkan fitur notifikasi. */}
        {/* {user?.waReal
                    ? user?.email
                      ? ""
                      : "Email"
                    : "Nomor WhatsApp"}{" "}
                  Anda.  */}
        {/* Klik{" "}
                    <span className="fw-extrabold text-decoration-underline">
                      disini
                    </span>{" "}
                    untuk mengaktifkan fitur dengan{" "}
                    {user?.waReal
                      ? user?.email
                        ? ""
                        : "email"
                      : "nomor whatsapp"}{" "}
                    Anda
                  </span> */}
        {/* </div>
              </a>
            </>
          )} */}
        <div
          className={`${
            isDashboard
              ? "container-fluid py-4 px-xl-5 px-4"
              : isFluid
              ? "container-fluid py-4"
              : "container py-4"
          }`}
        >
          {children}
        </div>
      </main>
      {user?.role == "siswa" || user?.role == "guru" ? (
        <BottomNavigation />
      ) : (
        ""
      )}
      <ModalAktivasi
        isWhatsapp={user?.waReal ? 0 : 1}
        buttonAktivasi={buttonAktivasi}
        formData={formData}
        setFormData={setFormData}
        sendActivation={sendActivation}
        aktifkan={aktifkan}
      />
      {modalWrapper}
      <footer className="bg-light">
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
      <Help />
    </div>
  );
};

export default Layout;
