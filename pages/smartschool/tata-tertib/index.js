import DataSiswaPelanggar from "components/TataTertib/data-siswa/DataSiswaPelanggar";
import useSekolah from "hooks/useSekolah";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import SidebarTabMenu from "../../../components/Shared/SidebarTabMenu/SidebarTabMenu";
import DataSiswa from "../../../components/TataTertib/data-siswa/DataSiswa";
import DetailSiswa from "../../../components/TataTertib/data-siswa/DetailSiswa";
import Peraturan from "../../../components/TataTertib/Peraturan";
import PeraturanDetail from "../../../components/TataTertib/PeraturanDetail";
import Poin from "../../../components/TataTertib/Poin";
import Sanksi from "../../../components/TataTertib/Sanksi";
import useUser from "../../../hooks/useUser";

const Admin = ({ menu, detail }) => {
  return (
    <>
      {(!menu || (menu === "peraturan" && !detail)) && <Peraturan />}

      {menu === "peraturan" && detail === "peraturan" && <PeraturanDetail />}

      {menu === "poin" && <Poin />}

      {menu === "sanksi" && <Sanksi />}

      {menu === "data-siswa" && <DataSiswa />}

      {menu === "siswa-pelanggar" && <DataSiswaPelanggar />}
    </>
  );
};

const Guru = ({ menu, detail }) => {
  return (
    <>
      {(!menu || menu === "sanksi") && <Sanksi />}

      {menu === "data-siswa" && <DataSiswa />}
    </>
  );
};

const Siswa = ({ menu, detail }) => {
  const { sekolah } = useSekolah();

  const { user } = useUser();

  const navItems = [
    {
      url: `${ssURL}/tata-tertib?menu=peraturan`,
      text: "Peraturan",
      active: menu == "peraturan" || menu == undefined,
    },
    {
      url: `${ssURL}/tata-tertib?menu=data-siswa&detail=siswa&id=${user?.id}`,
      text: `Data ${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
      active: menu == "data-siswa",
    },
  ];

  return (
    <>
      {detail !== "peraturan" && <Navbar nav={navItems} />}

      {(!menu || (menu === "peraturan" && !detail)) && <Peraturan />}
      {menu === "data-siswa" && <DetailSiswa backButton={false} />}
      {menu === "peraturan" && detail === "peraturan" && <PeraturanDetail />}
    </>
  );
};

const SidebarLeft = ({ detail, listMenu, activeMenuIndex, user }) => {
  return (
    <>
      {detail !== "peraturan" && detail !== "kelas" && detail !== "siswa" && (
        <SidebarTabMenu
          listMenu={listMenu?.[user?.role]}
          activeMenuIndex={activeMenuIndex}
        />
      )}
    </>
  );
};

const TataTertibPage = () => {
  const { sekolah } = useSekolah();

  const { user } = useUser();

  const router = useRouter();

  const {
    query: { menu, detail },
  } = router;

  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  const listMenu = {
    admin: [
      {
        url: `${ssURL}/tata-tertib?menu=peraturan`,
        nama: "Peraturan",
        icon: "/img/icon-peraturan.svg",
      },
      {
        url: `${ssURL}/tata-tertib?menu=poin`,
        nama: "Poin",
        icon: "/img/icon-poin.svg",
      },
      {
        url: `${ssURL}/tata-tertib?menu=sanksi`,
        nama: "Sanksi",
        icon: "/img/icon-sanksi.svg",
      },
      {
        url: `${ssURL}/tata-tertib?menu=data-siswa`,
        nama: `Data ${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
        icon: "/img/icon-data-siswa.svg",
      },
      {
        url: `${ssURL}/tata-tertib?menu=siswa-pelanggar`,
        nama: `Data ${
          sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
        } Pelanggar`,
        icon: "/img/icon-data-siswa.svg",
      },
    ],
    guru: [
      {
        url: `${ssURL}/tata-tertib?menu=sanksi`,
        nama: "Sanksi",
        icon: "/img/icon-sanksi.svg",
      },
      {
        url: `${ssURL}/tata-tertib?menu=data-siswa`,
        nama: `Data ${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
        icon: "/img/icon-data-siswa.svg",
      },
    ],
  };

  const navItems = [
    {
      url: `${ssURL}/tata-tertib?menu=peraturan`,
      text: "Peraturan",
      active: menu == "peraturan" || menu == undefined,
    },
    {
      url: `${ssURL}/tata-tertib?menu=data-siswa`,
      text: `Data ${sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}`,
      active: menu == "data-siswa",
    },
  ];

  // find active menu
  useEffect(() => {
    if (router.query.menu) {
      const index = listMenu?.[user?.role]?.findIndex((menu) =>
        menu.url.includes(router.query.menu)
      );
      setActiveMenuIndex(index === -1 || index === undefined ? 0 : index);
    }
  }, [router.query.menu]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          {user?.role !== "siswa" && (
            <SidebarLeft
              detail={detail}
              listMenu={listMenu}
              activeMenuIndex={activeMenuIndex}
              user={user}
            />
          )}

          {user?.role === "admin" && <Admin menu={menu} detail={detail} />}
          {user?.role === "guru" && <Guru menu={menu} detail={detail} />}
          {user?.role === "siswa" && <Siswa menu={menu} detail={detail} />}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default TataTertibPage;
