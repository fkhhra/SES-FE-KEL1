import getConfig from "next/config";
import { FaClone, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "client/clientAxios";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";
import React from "react";
import CardRPP from "components/RPP/CardRPP";
import ModalTambahRPP from "components/RPP/ModalTambahRPP";
import { deleteRpp, editRpp, getRpp, postRpp } from "client/RppClient";
import useTa from "hooks/useTa";
import useUser from "hooks/useUser";
import LayoutBukuKerjaDetail from "components/BukuKerjaGuru/LayoutBukuKerjaDetail";

const index = ({ subnav }) => {
  const { ta } = useTa();
  const { user } = useUser();
  const initialFormData = {
    judul: "",
    moda: "",
    deskripsi: "",
    lampiran: "",
    tingkat: "",
    mMataPelajaranId: "",
    buttonState: "idle",
  };

  const [isEdit, setIsEdit] = useState(false);

  const [rppData, setRppData] = useState({});
  const { rpp, mataPelajaran, tingkat } = rppData;

  const [formData, setFormData] = useState(initialFormData);
  const handleClickEdit = (data) => {
    setFormData(data);
    setIsEdit(true);
  };

  const handleClickTambah = () => {
    setFormData(initialFormData);
    setIsEdit(false);
  };

  const handleChangeForm = (e, uploadedFile) => {
    if (uploadedFile) {
      setFormData({
        ...formData,
        [e.target.name]: uploadedFile,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({
      ...formData,
      [name]: e?.value,
    });
  };

  const _postRpp = async () => {
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await postRpp(formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahRPP");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getRpp();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _editRpp = async () => {
    setFormData({ ...formData, buttonState: "loading" });
    const { data } = await editRpp(formData.id, formData);

    if (data) {
      toast.success(data?.message);
      hideModal("modalTambahRPP");
      setFormData({ ...formData, buttonState: "success" });
      setFormData(initialFormData);
      _getRpp();
    } else {
      toast.error(data?.[0]?.message);
      setFormData({ ...formData, buttonState: "error" });
    }
  };

  const _getRpp = async () => {
    const { data } = await getRpp();

    if (data) {
      setRppData(data);
    } else {
    }
  };

  const _deleteRpp = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteRpp(id);
        if (data) {
          toast.success(data.message);
          _getRpp();
        }
      }
    });
  };

  useEffect(() => {
    _getRpp();
  }, []);

  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState(`/`);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  const navItems = [
    {
      url: `${ssURL}/rpp-saya?subnav=daftar-proyek`,
      as: `${ssURL}/rpp-saya?subnav=daftar-proyek`,
      text: "Daftar Proyek",
      active: subnav == "daftar-proyek" || subnav == undefined,
    },
    {
      url: `${ssURL}/rpp-saya?subnav=daftar-undangan`,
      as: `${ssURL}/rpp-saya?subnav=daftar-undangan`,
      text: "Daftar Undangan",
      active: subnav == "daftar-undangan",
    },
  ];

  return (
    <LayoutBukuKerjaDetail>
      <div className="row gy-4">
        {rpp?.map((d, idx) => {
          return (
            <div className="col-md-6" key={`${idx}-${new Date().getTime()}`}>
              <CardRPP
                isRppSaya={d?.mUserId == user?.id}
                jenjangData={[`${d?.sekolah?.tingkat}`]}
                mode={d?.moda}
                dataDb={d}
                _deleteRpp={_deleteRpp}
                handleClickEdit={handleClickEdit}
              />
            </div>
          );
        })}
      </div>
      <ModalTambahRPP
        _editRpp={_editRpp}
        _postRpp={_postRpp}
        formData={formData}
        handleChangeForm={handleChangeForm}
        handleChangeSelect={handleChangeSelect}
        tingkat={tingkat}
        mataPelajaran={mataPelajaran}
        isEdit={isEdit}
      />
    </LayoutBukuKerjaDetail>
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
