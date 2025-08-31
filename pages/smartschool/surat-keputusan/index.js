import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import { useDebounce } from "use-debounce";
import {
  deleteSurat,
  editSurat,
  getSurat,
  postSurat,
} from "client/SuratClient";

import ListSuratKeputusan from "components/SuratMasuk/ListSuratKeputusan";
import ModalTambahSuratKeputusan from "components/SuratMasuk/ModalTambahSuratKeputusan";
import SideBar from "components/SuratMasuk/SideBar";
import SuratKeputusanHeader from "components/SuratMasuk/SuratKeputusanHeader";
import toast from "react-hot-toast";
import swal from "sweetalert";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import BukuIndukSkeleton from "components/Shared/Skeleton/BukuIndukSkeleton";
import ModalDisposisi from "components/SuratMasuk/ModalDisposisi";

const index = () => {
  const router = useRouter();
  // form data
  const initialStateForm = {
    id: "",
    btnBio: "idle",
    tanggalAwal: "",
    tanggalAkhir: "",
    tipe: "keputusan",
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
  const _getSuratKeputusan = async () => {
    setLoading(true);
    const { data } = await getSurat({
      tipe: "keputusan",
      search: searchValue,
      tanggalAwal: tanggal?.[0]
        ? momentPackage(tanggal?.[0]).format("YYYY-MM-DD")
        : "",
      tanggalAkhir: tanggal?.[1]
        ? momentPackage(tanggal?.[1]).format("YYYY-MM-DD")
        : "",
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
      isi: window.$(`#isi`).summernote("code"),
      file: JSON.stringify(formData.file),
    });

    if (data) {
      _getSuratKeputusan();
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
      isi: window.$(`#isi`).summernote("code"),
      file: JSON.stringify(formData.file),
    });

    if (data) {
      _getSuratKeputusan();
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
          _getSuratKeputusan();
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
    _getSuratKeputusan();
  }, []);

  useEffect(() => {
    _getSuratKeputusan();
  }, [tanggal, debounceSearch]);

  // Effects end
  return (
    <Layout>
      <AnimatePage>
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideBar activeMenu={activeMenu} />
          </div>
          <div className="col-lg-9">
            <SuratKeputusanHeader
              dataSurat={surat}
              formData={formData}
              handleChangeForm={handleChangeForm}
              isKeluar
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              tanggal={tanggal}
              setTanggal={setTanggal}
            />
            { !loading &&
              <ListSuratKeputusan
                dataSurat={surat?.data}
                setFormData={setFormData}
                formData={formData}
                deleteSurat={handleDeleteSurat}
              />
            }
            {loading && (
              <>
              <BukuIndukSkeleton count={3} />
              </>
            )}
          </div>
        </div>

        <ModalTambahSuratKeputusan
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
