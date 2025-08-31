import SideBar from "components/SuratMasuk/SideBar";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPredikat } from "../../../client/BukuIndukClient";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteDisposisi,
  editDisposisi,
  getSurat,
} from "../../../client/SuratClient";
import { getUser } from "../../../client/UserClient";
import CardDisposisi from "../../../components/Disposisi/CardDisposisi";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import NavbarDisposisi from "../../../components/Shared/Navbar/NavbarDisposisi";
import BukuIndukSkeleton from "../../../components/Shared/Skeleton/BukuIndukSkeleton";
import ModalDisposisi from "../../../components/SuratMasuk/ModalDisposisi";
import useUser from "../../../hooks/useUser";
import { momentPackage } from "../../../utilities/HelperUtils";
import { hideModal } from "../../../utilities/ModalUtils";
import { Pagination } from "antd";
import { useDebounce } from "use-debounce";

const index = ({ nav }) => {
  const { user } = useUser();
  const initialStateForm = {
    id: "",
    btnBio: "idle",
    userId: "",
    mSuratId: "",
    filterTanggal: [momentPackage(), momentPackage()],
    tipe: "masuk",
    asal: "",
    nomor: "",
    tanggal: momentPackage(),
    perihal: "",
    keamanan: "",
    penanganan: "",
    isi: "",
    file: [],
    ttd: [],
  };

  const [bukuIndukData, setBukuIndukData] = useState({});
  const { data: rombel } = bukuIndukData;

  const [loading, setLoading] = useState(false);
  const [userGuru, setUserGuru] = useState([]);
  const [formData, setFormData] = useState(initialStateForm);
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 300);

  const _getDisposisi = async () => {
    setLoading(true);
    const { data } = await getSurat({
      tipe: "disposisi",
      nav: router.query.nav,
      page,
      search,
    });
    if (data) {
      setBukuIndukData(data?.surat);
    }
    setLoading(false);
  };

  const _getUser = async (name = "") => {
    const { data, error } = await getUser({
      sekolah_id: user?.sekolah?.id,
      notRole: ["siswa", "ortu"],
      name: name,
    });

    if (data) {
      const options = data?.user?.map((item) => {
        return { value: item.id, label: item.nama };
      });
      setUserGuru(options);
      return options;
    } else {
      toast.error(error.message);
    }
  };

  const _putDisposisi = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await editDisposisi(formData.id, {
      penanganan: formData.penanganan,
      tanggal_pengembalian: momentPackage(formData.tanggal).format(
        "YYYY-MM-DD"
      ),
      isi: window.$(`#isi2`).summernote("code"),
      ttd: formData.ttd[0],
      m_user_id: formData.userId?.value,
      m_surat_id: formData.mSuratId,
    });

    if (data) {
      toast.success(data.message);
      hideModal("modalDisposisi");
      setFormData(initialStateForm);
      _getDisposisi();
    } else {
      toast.error(error?.[0]?.message);
      setFormData({ ...formData, btnBio: "error" });
    }
  };

  const _deleteDisposisi = async (id) => {
    const { data, error } = await deleteDisposisi(id);

    if (data) {
      toast.success("Disposisi Berhasil dihapus");
      _getDisposisi();
    } else {
      toast.error("silahkan coba beberapa saat lagi");
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();
  const { page = 1 } = router.query;

  const [activeMenu, setActiveMenu] = useState(`/`);

  const loadNewUser = async (input) => {
    const listUser = await _getUser(input);
    return listUser;
  };
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getDisposisi();
  }, [router.query, page, debounceSearch]);

  useEffect(() => {
    if (user?.sekolah) {
      _getUser();
    }
  }, [user]);
  const navItems = [
    {
      url: `${ssURL}/disposisi?nav=semua`,
      as: `${ssURL}/disposisi?nav=semua`,
      text: "Semua",
      active: nav == "semua" || !nav,
      // dataJoyride: "disposisi",
    },
    {
      url: `${ssURL}/disposisi?nav=belum-selesai`,
      as: `${ssURL}/disposisi?nav=belum-selesai`,
      text: "Belum Selesai",
      active: nav == "belum-selesai",
      // dataJoyride: "disposisi",
    },
    {
      url: `${ssURL}/disposisi?nav=selesai`,
      as: `${ssURL}/disposisi?nav=selesai`,
      text: "Selesai",
      active: nav == "selesai",
      // dataJoyride: "surat-masuk",
    },
  ];
  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideBar activeMenu={activeMenu} />
          </div>
          {loading && (
            <>
              <div className="col-lg-9">
                <div className="row gy-4">
                  <BukuIndukSkeleton count={3} />
                </div>
              </div>
            </>
          )}
          {!loading && (
            <>
              <div className="col-lg-9">
                <div className="row justify-content-between">
                  <NavbarDisposisi
                    nav={navItems}
                    search={search}
                    setSearch={setSearch}
                  />
                </div>
                {(nav == undefined || nav === "semua") && (
                  <CardDisposisi
                    dataBukuInduk={rombel}
                    _deleteDisposisi={_deleteDisposisi}
                    setFormData={setFormData}
                  />
                )}
                {nav == "belum-selesai" && (
                  <>
                    <CardDisposisi
                      dataBukuInduk={rombel}
                      _deleteDisposisi={_deleteDisposisi}
                      setFormData={setFormData}
                    />
                  </>
                )}
                {nav == "selesai" && (
                  <>
                    <CardDisposisi
                      dataBukuInduk={rombel}
                      _deleteDisposisi={_deleteDisposisi}
                      setFormData={setFormData}
                    />
                  </>
                )}
              </div>
            </>
          )}
          <div className="my-4 text-center">
            <Pagination
              total={bukuIndukData?.total}
              showSizeChanger={false}
              current={page || 1}
              pageSize={10}
              onChange={(e) => router.push(`${ssURL}/disposisi?page=${e}`)}
            />
          </div>
        </div>

        <ModalDisposisi
          userGuru={userGuru}
          handleChangeForm={handleChangeForm}
          formData={formData}
          _getUser={_getUser}
          _postDisposisi={_putDisposisi}
          loadNewUser={loadNewUser}
          // _postRekap={_postRekapTugas}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav } }) {
  return {
    props: {
      nav: nav || null,
    },
  };
}

export default index;
