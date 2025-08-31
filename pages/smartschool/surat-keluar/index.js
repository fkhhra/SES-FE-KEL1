import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import {
  deleteSurat,
  editSurat,
  getSurat,
  postSurat,
} from "client/SuratClient";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

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
import { Pagination } from "antd";
import { ssURL } from "client/clientAxios";

const index = () => {
  const router = useRouter();
  const { page = 1 } = router.query;

  // form data
  const initialStateForm = {
    id: "",
    btnBio: "idle",
    tanggalAwal: "",
    tanggalAkhir: "",
    tipe: "keluar",
    asal: "",
    nomor: "",
    tanggal: momentPackage(),
    perihal: "",
    keamanan: "",
    isi: "",
    file: [],
  };
  const [formData, setFormData] = useState(initialStateForm);
  // end form data

  // State start
  const [suratData, setSuratData] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(`/`);

  const [searchValue, setSearchValue] = useState("");
  const [debounceSearch] = useDebounce(searchValue, 300);

  const [tanggal, setTanggal] = useState([]);
  // State End

  const { surat } = suratData;

  // Surat Endpoints start
  const _getSuratKeluar = async () => {
    setLoading(true);
    const { data } = await getSurat({
      tipe: "keluar",
      search: searchValue,
      tanggalAwal: tanggal?.[0]
        ? momentPackage(tanggal?.[0]).format("YYYY-MM-DD")
        : "",
      tanggalAkhir: tanggal?.[1]
        ? momentPackage(tanggal?.[1]).format("YYYY-MM-DD")
        : "",
      page,
    });
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
      _getSuratKeluar();
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
      _getSuratKeluar();
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
          _getSuratKeluar();
          toast.success(data?.message);
        } else {
          setButtonState("error");
        }
      }
    });
  };
  // Surat Endpoints end

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Effects start
  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getSuratKeluar();
  }, [page]);

  useEffect(() => {
    _getSuratKeluar();
  }, [tanggal, debounceSearch, page]);

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
              isKeluar
            />
            {!loading && (
              <ListSurat
                dataSurat={surat?.data}
                setFormData={setFormData}
                formData={formData}
                deleteSurat={handleDeleteSurat}
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
            onChange={(e) => router.push(`${ssURL}/surat-keluar?page=${e}`)}
          />
        </div>
        <ModalTambahSuratMasuk
          handleChangeForm={handleChangeForm}
          formData={formData}
          handleSubmit={handleSubmit}
        />
        <ModalDisposisi
          handleChangeForm={handleChangeForm}
          formData={formData}
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
