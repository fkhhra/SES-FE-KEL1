import React, { useEffect, useState } from "react";
import Layout from "components/Layout/Layout";
import { motion } from "framer-motion";
import HeaderRekening from "components/Rekening/HeaderRekening";
import ModalTambahRekening from "components/Shared/ModalTambahRekening/ModalTambahRekening";
import {
  deleteRekeningSekolah,
  getRekeningSekolah,
} from "client/RekeningSekolahClient";
import ListRekening from "components/Rekening/ListRekening";
import { useDebounce } from "use-debounce";
import swal from "sweetalert";
import toast from "react-hot-toast";

const index = () => {
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
    <Layout isIndex={true}>
      {/* <MyJoyride steps={steps} /> */}
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <div>
          <HeaderRekening
            search={search}
            setSearch={setSearch}
            setEditData={setEditData}
          />
          <div className="">
            {rekeningSekolah?.map((item) => {
              return (
                <ListRekening
                  data={item}
                  onClickEdit={onClickEdit}
                  handleDeleteRekening={handleDeleteRekening}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
      <ModalTambahRekening
        editData={editData}
        _getRekeningSekolah={_getRekeningSekolah}
      />
    </Layout>
  );
};

export default index;
