import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import { useDebounce } from "use-debounce";
import {
  deleteSurat,
  editSurat,
  getSurat,
  postDisposisi,
  postSurat,
} from "client/SuratClient";
import { getUser } from "client/UserClient";

import SideBar from "components/SuratMasuk/SideBar";
import toast from "react-hot-toast";
import swal from "sweetalert";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import BukuIndukSkeleton from "components/Shared/Skeleton/BukuIndukSkeleton";
import ListSurat from "components/SuratMasuk/ListSurat";
import ModalDisposisi from "components/SuratMasuk/ModalDisposisi";
import ModalTambahSuratMasuk from "components/SuratMasuk/ModalTambahSuratMasuk";
import SuratHeader from "components/SuratMasuk/SuratMasuk";
import useUser from "hooks/useUser";
import { Pagination } from "antd";
import { ssURL } from "client/clientAxios";
import { getGTK } from "client/GTKClient";

const index = () => {
  const { user } = useUser();
  const router = useRouter();
  const { page = 1 } = router.query;

  // form data
  const initialStateForm = {
    id: "",
    btnBio: "idle",
    userId: "",
    mSuratId: "",
    tanggalAwal: "",
    tanggalAkhir: "",
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
  const [formData, setFormData] = useState(initialStateForm);

  // end form data

  // State start
  const [userGuru, setUserGuru] = useState([]);
  const [suratData, setSuratData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(`/`);

  const [searchValue, setSearchValue] = useState("");
  const [debounceSearch] = useDebounce(searchValue, 300);

  const [tanggal, setTanggal] = useState([]);

  // State End

  const { surat } = suratData;

  // Surat Endpoints start
  const _getSuratMasuk = async () => {
    setLoading(true);
    let params = {
      tipe: "masuk",
      search: searchValue,
      tanggalAwal: tanggal?.[0]
        ? momentPackage(tanggal?.[0]).format("YYYY-MM-DD")
        : "",
      tanggalAkhir: tanggal?.[1]
        ? momentPackage(tanggal?.[1]).format("YYYY-MM-DD")
        : "",
      page,
    };
    const { data } = await getSurat(params);
    if (data) {
      setSuratData(data);
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    formData.id ? _putSurat() : _postSurat();
  };

  const _postSurat = async () => {
    setFormData({ ...formData, btnBio: "loading" });

    const { data, error } = await postSurat({
      tipe: formData.tipe,
      asal: formData.asal,
      nomor: formData.nomor,
      tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
      perihal: formData.perihal,
      keamanan: formData.keamanan,
      isi: window.$(`#isi`).summernote("code"),
      file: JSON.stringify(formData.file),
    });

    if (data) {
      _getSuratMasuk();
      hideModal("modalTambahSuratMasuk");
      setFormData({ ...initialStateForm, btnBio: "success" });
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.[0]?.message);
    }
  };

  const _putSurat = async () => {
    const { data, error } = await editSurat(formData.id, {
      tipe: formData.tipe,
      asal: formData.asal,
      nomor: formData.nomor,
      tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
      perihal: formData.perihal,
      keamanan: formData.keamanan,
      isi: window.$(`#isi`).summernote("code"),
      file: JSON.stringify(formData.file),
    });

    if (data) {
      _getSuratMasuk();
      hideModal("modalTambahSuratMasuk");
      setFormData({ ...initialStateForm, btnBio: "success" });
      toast.success(data?.message);
    } else {
      setFormData({ ...formData, btnBio: "error" });
      toast.error(error?.message);
    }
  };

  const handleDeleteSurat = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteSurat(id);
        if (data) {
          _getSuratMasuk();
          toast.success(data?.message);
        } else {
          setButtonState("error");
        }
      }
    });
  };

  const teruskanSurat = async (id) => {
    const { data, error } = await editSurat(id, {
      teruskan: 1,
    });

    if (data) {
      _getSuratMasuk();
      toast.success(data?.message);
    } else {
      toast.error(error?.message);
    }
  };

  // Surat Endpoints end

  // Disposisi Endpoints start
  const _postDisposisi = async () => {
    setFormData({ ...formData, btnBio: "loading" });
    const { data, error } = await postDisposisi({
      penanganan: formData.penanganan,
      tanggal_pengembalian: momentPackage(formData.tanggal).format(
        "YYYY-MM-DD"
      ),
      isi: window.$(`#isi2`).summernote("code"),
      ttd: formData.file[0],
      m_user_id: formData.userId?.value,
      m_surat_id: formData.mSuratId,
    });

    if (data) {
      toast.success(data.message);
      hideModal("modalDisposisi");
      setFormData(initialStateForm);
      _getSuratMasuk();
    } else {
      toast.error(error?.[0]?.message);
      setFormData({ ...formData, btnBio: "error" });
    }
  };

  // const _getUser = async (name = "") => {
  //   const { data, error } = await getUser({
  //     sekolah_id: user?.sekolah?.id,
  //     notRole: ["siswa", "ortu"],
  //     name: name,
  //   });

  //   if (data) {
  //     const options = data?.user?.map((item) => {
  //       return { value: item.id, label: item.nama };
  //     });
  //     setUserGuru(options);
  //     return options;
  //   } else {
  //     toast.error(error.message);
  //   }
  // };

  const _getDataGuru = async (search = "") => {
    const { data } = await getGTK({
      page: "all",
      search: search,
    });
    if (data) {
      const options = data?.guru?.map((item) => {
        return { value: item?.id, label: item?.nama };
      });
      setUserGuru(options);
      return options;
    } else {
      toast.error(error.message);
    }
  };

  // Disposisi Endpoints end

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const loadNewUser = async (input) => {
  //   const listUser = await _getUser(input);
  //   return listUser;
  // };

  // Effects start
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getSuratMasuk();
  }, [page]);

  useEffect(() => {
    _getSuratMasuk();
  }, [tanggal, debounceSearch, page]);

  useEffect(() => {
    if (user?.sekolah) {
      // _getUser();
      _getDataGuru();
    }
  }, [user]);

  // Effects end
  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideBar activeMenu={activeMenu} />
          </div>
          <div className="col-lg-9">
            <SuratHeader
              dataSurat={surat}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
              setTanggal={setTanggal}
              tanggal={tanggal}
            />
            {!loading && (
              <ListSurat
                dataSurat={surat?.data}
                setFormData={setFormData}
                formData={formData}
                deleteSurat={handleDeleteSurat}
                isMasuk
                teruskanSurat={teruskanSurat}
              />
            )}
            {loading && (
              <>
                <BukuIndukSkeleton count={3} />
              </>
            )}
          </div>
        </div>
        <div className="my-4 text-center">
          <Pagination
            total={suratData?.surat?.total}
            showSizeChanger={false}
            current={page || 1}
            pageSize={10}
            onChange={(e) => router.push(`${ssURL}/surat-masuk?page=${e}`)}
          />
        </div>

        <ModalTambahSuratMasuk
          handleChangeForm={handleChangeForm}
          formData={formData}
          isMasuk
          handleSubmit={handleSubmit}
        />
        <ModalDisposisi
          userGuru={userGuru}
          handleChangeForm={handleChangeForm}
          formData={formData}
          _getUser={_getDataGuru}
          _postDisposisi={_postDisposisi}
          // loadNewUser={loadNewUser}
          // _postRekap={_postRekapTugas}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav } }) {
  return {
    props: {
      subnav: subnav || null,
    },
  };
}

export default index;
