import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { hideModal, showModal } from "utilities/ModalUtils";
import {
  deleteDetailKalenderKegiatan,
  getDetailKalenderKegiatan,
} from "../../client/KalenderClient";
import { momentPackage } from "../../utilities/HelperUtils";
import NewModal from "../Shared/NewModal/NewModal";
import ModalBuatKegiatan from "./ModalBuatKegiatan";

const ModalDetailKegiatan = ({
  _getKalenderData,
  id,
  editData,
  setEditData,
}) => {
  const [calendarData, setCalendarData] = useState(null);

  const getData = async () => {
    const { data } = await getDetailKalenderKegiatan(parseInt(id));
    if (data) {
      setCalendarData(data?.kalender);
    }
  };

  const _deleteKalenderKegiatan = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteDetailKalenderKegiatan(id);
        if (data) {
          toast.success(data?.message);
          hideModal("ModalDetailKegiatan");
          _getKalenderData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <>
      <NewModal
        modalId="ModalDetailKegiatan"
        modalSize="md"
        whiteBackgroundHeader
        removeButtonClose
        title={
          <>
            <div
              className={`label-ss fs-12-ss fw-bold rounded-pill`}
              style={{ backgroundColor: calendarData?.label?.warna }}
            >
              {calendarData?.label?.nama}
            </div>
          </>
        }
        content={
          <>
            <h3 className="color-dark fw-extrabold">{calendarData?.nama}</h3>
            <div className="d-flex align-items-center mb-3">
              <img src="/img/icon-tanggal.svg" />
              <span className="color-primary ms-2">
                {momentPackage(calendarData?.tanggalAwal).format(
                  "dddd, DD MMMM YYYY"
                ) ===
                momentPackage(calendarData?.tanggalAkhir).format(
                  "dddd, DD MMMM YYYY"
                )
                  ? momentPackage(calendarData?.tanggalAwal).format(
                      "dddd, DD MMMM YYYY"
                    )
                  : `${momentPackage(calendarData?.tanggalAwal).format(
                      "dddd, DD MMMM YYYY"
                    )} - ${momentPackage(calendarData?.tanggalAkhir).format(
                      "dddd, DD MMMM YYYY"
                    )}`}
              </span>
            </div>

            <div className="d-flex align-items-center mb-3">
              <img src="/img/icon-waktu.svg" />
              <span className="color-primary ms-2">
                {`${calendarData?.waktuMulai} - ${calendarData?.waktuAkhir}`}
              </span>
            </div>

            <p className="color-secondary">{calendarData?.deskripsi}</p>

            <div className="d-flex align-items-center">
              {calendarData?.media === "Meeting Online" && (
                <button
                  className="btn btn-primary btn-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer w-100"
                  style={{ height: 80 }}
                  onClick={() =>
                    window.open(konsultasi?.jadwal?.media, "_blank")
                  }
                >
                  <img src="/img/icon-tatap-muka.svg" />
                  <p className="fw-bold mb-0 ms-3">Meeting Online</p>
                </button>
              )}
              {calendarData?.bukuTamu === 1 && (
                <button
                  className="btn btn-primary btn-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer w-100"
                  style={{ height: 80 }}
                  onClick={() =>
                    window.open(konsultasi?.jadwal?.media, "_blank")
                  }
                >
                  <img src="/img/icon-buku-tamu-2.svg" />
                  <p className="fw-bold mb-0 ms-3">Isi Buku Tamu</p>
                </button>
              )}
            </div>
          </>
        }
        aksiButton={
          <>
            <ReactiveButton
              // buttonState={formData.btnBio}
              onClick={() => {
                setEditData(calendarData);
                hideModal("ModalDetailKegiatan");
                showModal("ModalBuatKegiatan");
              }}
              color={"primary"}
              idleText={"Edit"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              className={"btn btn-primary me-3"}
            />
            <ReactiveButton
              // buttonState={formData.btnBio}
              onClick={() => _deleteKalenderKegiatan(calendarData?.id)}
              color={"primary"}
              idleText={"Hapus"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              data-bs-dismiss="modal"
              className={"btn btn-danger-ss rounded-pill ms-2"}
            />
          </>
        }
      />
      <ModalBuatKegiatan editData={calendarData} />
    </>
  );
};

export default ModalDetailKegiatan;
