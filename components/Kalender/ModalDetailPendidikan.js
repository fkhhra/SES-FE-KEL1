import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { hideModal, showModal } from "utilities/ModalUtils";
import {
  deleteDetailKalenderPendidikan,
  getDetailKalenderPendidikan,
} from "../../client/KalenderClient";
import { momentPackage } from "../../utilities/HelperUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalDetailPendidikan = ({
  id,
  _getKalenderData,
  editDataPendidikan,
  setEditDataPendidikan,
}) => {
  const [calendarData, setCalendarData] = useState(null);

  const getData = async () => {
    const { data } = await getDetailKalenderPendidikan(parseInt(id));
    if (data) {
      setCalendarData(data?.kalender);
    }
  };

  const _deleteKalenderPendidikan = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteDetailKalenderPendidikan(id);
        if (data) {
          toast.success(data?.message);
          hideModal("ModalDetailPendidikan");
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
        modalId="ModalDetailPendidikan"
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
            <div className="d-flex align-items-center">
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
          </>
        }
        aksiButton={
          <>
            <ReactiveButton
              // buttonState={formData.btnBio}
              onClick={() => {
                setEditDataPendidikan(calendarData);
                hideModal("ModalDetailPendidikan");
                showModal("ModalBuatKalenderPendidikan");
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
              onClick={() => _deleteKalenderPendidikan(calendarData?.id)}
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
    </>
  );
};

export default ModalDetailPendidikan;
