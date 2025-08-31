import { ssURL } from "client/clientAxios";
import { meSekolah } from "client/SekolahClient";
import { getProfil } from "client/sharedClient";
import HeaderKontenPerangkatPembelajaran from "components/Shared/Header/HeaderKontenPerangkatPembelajaran";
import useSekolah from "hooks/useSekolah";
import useUser from "hooks/useUser";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LayoutKontenPerangkatPembelajaran = ({
  children,
  jamMengajar,
  tingkatRombel,
  listRombel,
  title,
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
      <HeaderKontenPerangkatPembelajaran
        // tingkatRombel={tingkatRombel}
        // listRombel={listRombel}
        title={title}
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

export default LayoutKontenPerangkatPembelajaran;
