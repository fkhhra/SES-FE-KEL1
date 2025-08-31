import React, { useState } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import { isValidGmeetUrl, momentPackage } from "../../utilities/HelperUtils";
import toast from "react-hot-toast";
import { deleteTimeline, editTimeline, postTimelineKomen } from "../../client/TimelineClient";
import ModalBuatPertemuan from "./ModalBuatPertemuan";
import useEditModal from "../../hooks/useEditModal";
import swal from "sweetalert";
import ContentGuru from "./TatapMaya/ContentGuru";
import ContentSiswa from "./TatapMaya/ContentSiswa";
import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";

const TatapMayaPage = ({ detailData, setDetailData, _getDetailTimeline, kelasId, kegiatanId, kegiatanData }) => {

  const { user } = useUser();
  const { setEditModal } = useEditModal();

  const router = useRouter();

  const deleteKegiatan = async () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {

        const activeIndexKegiatanId = kegiatanData?.findIndex(data => data?.id === +kegiatanId);
        let hal = "";
        let targetNextKegiatanId = null;

        if (kegiatanData[activeIndexKegiatanId - 1]) {
          targetNextKegiatanId = kegiatanData[activeIndexKegiatanId - 1]?.id;
          hal = kegiatanData[activeIndexKegiatanId - 1]?.type;
        } else if (kegiatanData[activeIndexKegiatanId + 1]) {
          targetNextKegiatanId = kegiatanData[activeIndexKegiatanId + 1]?.id;
          hal = kegiatanData[activeIndexKegiatanId + 1]?.type;
        }

        const { isSuccess, data } = await deleteTimeline(kegiatanId);
        if (isSuccess) {
          toast.success(data?.message);
          _getDetailTimeline(targetNextKegiatanId);

          if (targetNextKegiatanId === null) {
            router.push(`${ssURL}/kelas/${kelasId}/kegiatan`)
          } else {
            router.push(`${ssURL}/kelas/${kelasId}/kegiatan/${targetNextKegiatanId}?hal=${hal}`);
          }
        }
      }
    });
  }

  const postKomen = async (komen) => {    
    if (!komen) return;

    const payload = {
      mTimelineId: detailData?.id,
      komen: komen,
    };

    const { data } = await postTimelineKomen(payload);
    if (data) {
      toast.success(data?.message);
      _getDetailTimeline();
    }
  };

  return <>
    <div className="card card-ss p-4 pb-5 mb-4">
      <div className="dropdown dropdown-ss mb-md-0 mb-2 d-flex justify-content-end">
        {(user?.role == "guru" || user?.role == "admin") && (
          <div
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
          </div>
        )}
        <ul
          className="dropdown-menu dropdown-menu-ss my-1"
          aria-labelledby="dropdownMenuLink"
        >
          <li data-bs-toggle="modal" data-bs-target="#ModalBuatPertemuan" onClick={() => setEditModal("ModalBuatPertemuan", detailData)}>
            <a className="dropdown-item">
              <FaPen className="me-2" />
              <span>Edit</span>
            </a>
          </li>
          <li onClick={() => deleteKegiatan()}>
            <a className="dropdown-item color-danger">
              <FaTrashAlt className="me-2" />
              <span>Hapus</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="d-flex align-items-center justify-content-md-between mb-4 flex-md-row flex-column">
        <div className="d-flex align-items-center flex-md-row flex-column text-break w-100">
          <img
            src={`/img/icon-kegiatan-tatap-maya.svg`}
            alt="icon-kegiatan-tatap-maya"
            width="86px"
            height="86px"
          />
          <div className="text-md-start text-center ms-md-4 mt-md-0 mt-4 w-100">
            <p className="color-secondary mb-2">
              Kegiatan - {detailData?.tanggalPertemuan || detailData?.timeline?.tanggalPertemuan}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="color-dark fw-black mb-0">
                Tatap Maya
              </h2>

              { user?.role === "guru"
                ? (detailData?.rpp?.length > 0 || detailData?.jurnal)
                ? (
                  <div className="rounded-ss px-4 py-2 bg-success shadow-success-ss text-white fs-14-ss">
                    <img
                      src={`/img/icon-check-alert.svg`}
                      alt="icon-check-alert"
                      className="me-2"
                    />
                    Anda Sudah Menulis Jurnal Harian
                  </div>
                ) : (
                  (
                    <div className="rounded-ss px-4 py-2 bg-danger shadow-danger-ss text-white fs-14-ss">
                      <img
                        src={`/img/icon-warning-alert.svg`}
                        alt="icon-warning-alert"
                        className="me-2"
                      />
                      Anda Belum Menulis Jurnal Harian
                    </div>
                  )
                )
                : null
              }
            </div>
          </div>
        </div>
      </div>
      {
        user?.role === "guru" || user?.role == "admin" ? (
          <ContentGuru
            detailData={detailData}
            setDetailData={setDetailData}
            postKomen={postKomen}
            _getDetailTimeline={_getDetailTimeline}
          />
        ) : (
          <ContentSiswa
            detailData={detailData}
            postKomen={postKomen}
            _getDetailTimeline={_getDetailTimeline}
          />
        )
      }
    </div>
    <ModalBuatPertemuan kelasId={kelasId} _getTimeline={_getDetailTimeline} />
  </>;
};

export default TatapMayaPage;
