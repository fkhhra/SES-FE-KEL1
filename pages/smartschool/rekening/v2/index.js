import React, { useEffect, useState } from "react";
import Layout from "components/Layout/Layout";
import { motion } from "framer-motion";
import HeaderRekening from "components/Rekening/HeaderRekening";
import ModalTambahRekening from "components/Shared/ModalTambahRekening/ModalTambahRekening";
import {
  deleteRekeningSekolah,
  downloadRekening,
  getRekeningSekolah,
} from "client/RekeningSekolahClient";
import ListRekening from "components/Rekening/ListRekening";
import { useDebounce } from "use-debounce";
import swal from "sweetalert";
import toast from "react-hot-toast";
import { downloadURL, ssURL } from "client/clientAxios";
import SideNavRekening from "components/Rekening/SideNavRekening";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import HeaderRekeningV2 from "components/Rekening/HeaderRekeningV2";
import HeaderRealisasiKeuangan from "components/Keuangan/RealisasiKeuangan/HeaderRealisasiKeuangan";
import useUser from "hooks/useUser";

const index = () => {
  const { user, setUser } = useUser();
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState();
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchDebounce] = useDebounce(search, 300);

  const _getRekeningSekolah = async () => {
    setLoading(true);
    const { data } = await getRekeningSekolah({ search: search });
    if (data) {
      setRekeningSekolah(data.rekSekolah);
    }
    setLoading(false);
  };
  const handleClickDownload = async () => {
    const { data } = await downloadRekening();

    window.open(`${downloadURL}/${data}`, "_blank");
  };
  const handleDeleteRekening = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Kontak CS Smartschool jika sengaja terhapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteRekeningSekolah(id);
        if (data) {
          toast.success(data?.message);
          _getRekeningSekolah();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (data) => {
    setEditData({
      ...data,
    });
  };

  useEffect(() => {
    _getRekeningSekolah();
  }, [searchDebounce]);
  return (
    <Layout isFluid={true}>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <HeaderRealisasiKeuangan
              ssURL={ssURL}
              judul={`Akun Rekening`}
              user={user}
            />
          </div>
          <div className="col-md-12">
            <div>
              <HeaderRekeningV2
                search={search}
                setSearch={setSearch}
                setEditData={setEditData}
                downloadRekening={handleClickDownload}
              />
              <div className="card card-ss p-4">
                {rekeningSekolah?.map((item) => {
                  return (
                    <ListRekening
                      dashboard
                      data={item}
                      onClickEdit={onClickEdit}
                      handleDeleteRekening={handleDeleteRekening}
                      edit={false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
      <ModalTambahRekening
        editData={editData}
        _getRekeningSekolah={_getRekeningSekolah}
      />
    </Layout>
  );
};

export default index;
