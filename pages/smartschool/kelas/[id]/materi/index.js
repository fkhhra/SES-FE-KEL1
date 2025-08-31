import React, { useEffect, useState } from "react";
import { getDetailRombel } from "client/RombelClient";
import { getDetailMateri } from "client/MateriClient";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { deleteBab } from "client/BabClient";

import swal from "sweetalert";
import toast from "react-hot-toast";
import useEditModal from "hooks/useEditModal";

import KelasHeader from "components/Kelas/KelasHeader";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalBuatBab from "components/Kelas/Materi/ModalBuatBab";
import CardMateri from "components/Kelas/Materi/CardMateri";
import CardTambahMateri from "components/Kelas/Materi/CardTambahMateri";
import HeaderMateri from "components/Kelas/Materi/HeaderMateri";
import CardKelasSkeleton from "components/Shared/Skeleton/CardKelasSkeleton";
import { showModal } from "utilities/ModalUtils";

const index = ({ id }) => {
  const [detailRombel, setDetailRombel] = useState({});
  const [detailMateri, setDetailMateri] = useState({});

  const [loading, setLoading] = useState(false);

  const mMateriId = detailRombel?.analisisMateri?.materi?.id;

  const _getDetailMateri = async (id) => {
    const { data } = await getDetailMateri(mMateriId ? mMateriId : id);
    if (data) {
      setDetailMateri(data);
    }
  };

  const getDetailRombelData = async () => {
    setLoading(true);
    const { data } = await getDetailRombel(id, {
      kode_hari: new Date().getDay(),
    });

    if (data) {
      setDetailRombel(data);
      await _getDetailMateri(data?.analisisMateri?.materi?.id);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDetailRombelData();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <KelasHeader id={id} />
        <HeaderMateri totalBab={detailMateri?.bab?.length} />

        {loading ? (
          <div className="row g-4 mt-3">
            <CardKelasSkeleton count={7} />
          </div>
        ) : (
          detailMateri?.bab?.length > 0 &&
          detailMateri?.bab?.map((dt, index) => (
            <ListBab
              key={`${index}-${new Date().getTime()}`}
              dt={dt}
              index={index}
              id={id}
              _getDetailMateri={_getDetailMateri}
            />
          ))
        )}
      </AnimatePage>

      <ModalBuatBab mMateriId={mMateriId} _getDetailMateri={_getDetailMateri} />
    </Layout>
  );
};

const ListBab = ({ dt, index, id, _getDetailMateri }) => {
  const { setEditModal } = useEditModal();

  const babId = dt?.id;

  const deleteBabHandler = (babId) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteBab(babId);
        if (data) {
          toast.success(data?.message);
          _getDetailMateri();
        }
      }
    });
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <div className="fw-black fs-18-ss my-4 color-dark pointer d-flex align-items-center">
          <span className="me-3">{`Bab ${index + 1} - ${dt?.judul}`}</span>
          <div
            className="dropdown dropdown-ss"
            data-joyride="dropdown-edit-delete-bab"
          >
            <div
              className="dropdown-kelas-materi"
              id="dropdownEditDeleteBab"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                width: 24,
                height: 24,
                borderRadius: "100%",
                backgroundColor: "#C3C3C8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/img/arrow-down-white.svg" />
            </div>
            <ul
              className={`dropdown-menu dropdown-menu-ss my-1`}
              aria-labelledby="dropdownEditDeleteBab"
            >
              <li
                className="d-flex align-items-center"
                onClick={() => {
                  setEditModal("modalBuatBab", dt);
                  showModal("modalBuatBab");
                }}
              >
                <a className="dropdown-item color-secondary">
                  <FaPen /> &nbsp; Edit
                </a>
              </li>
              <li onClick={() => deleteBabHandler(dt?.id)}>
                <a className="dropdown-item color-danger">
                  <FaTrashAlt /> &nbsp; Hapus
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {dt?.topik?.map((dt, index) => (
          <CardMateri
            data={dt}
            index={index}
            key={dt?.id}
            kelasId={id}
            _getDetailMateri={_getDetailMateri}
            babId={babId}
          />
        ))}

        <CardTambahMateri kelasId={id} babId={dt?.id} />
      </div>
    </>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
