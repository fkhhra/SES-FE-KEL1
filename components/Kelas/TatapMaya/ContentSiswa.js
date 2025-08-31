import React, { useState } from "react";
import { isValidGmeetUrl, momentPackage } from "utilities/HelperUtils";
import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import KomenInput from "components/Shared/KomenTimeline/KomenInput";
import CardKeteranganAbsen from "./CardKeteranganAbsen";
import toast from "react-hot-toast";
import { deleteTimelineKomen, editTimeline } from "client/TimelineClient";
import ModalAbsenIzinSakit from "./ModalAbsenIzinSakit";
import { showModal } from "utilities/ModalUtils";
import ModalBuktiKeteranganAbsen from "./ModalBuktiKeteranganAbsen";
import swal from "sweetalert";

const ContentSiswa = ({ detailData, postKomen, _getDetailTimeline }) => {

  const {
    absen,
    lampiran
  } = detailData || {};

  const [modalType, setModalType] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [lampiranModal, setLampiranModal] = useState([]);

  const gmeetURL = isValidGmeetUrl(detailData?.gmeet || detailData?.timeline?.gmeet);

  const handleAbsensi = async (absen = null) => {
    const payload = {
      tipe: "absen",
      absen: absen,
      keterangan: keterangan,
      waktuAbsen: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      lampiran: lampiranModal,
    };
    
    const { data } = await editTimeline(detailData?.id, payload);
    if (data) {
      toast.success(data?.message);
      _getDetailTimeline();
      
      absen === "hadir" && gmeetURL != "#!" && window.open(detailData?.gmeet || detailData?.timeline?.gmeet, "_blank");
    }
  };

  const onClickCardKeteranganAbsen = (type) => {
    if (type === "hadir") {
      handleAbsensi(type);
    } else {
      setModalType(type);
      showModal("modalAbsenIzinSakit");
    }
  }

  return <>
    <div className="row mt-4">
      <div className="col-md-8 pe-2 mb-md-0 mb-3">
        <h6 className="fs-18-ss fw-bold color-dark mb-3">Informasi</h6>
        <a
          href={gmeetURL}
          target={gmeetURL === "#!" ? "_self" : "_blank"}
          rel="noreferrer noopener"
          className={`btn ${gmeetURL == "#!" ? "btn-secondary btn-secondary-ss" : "btn-primary btn-primary-ss"} rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start p-4`}
        >
          <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
            <img
              src={`/img/icon-tatap-muka.svg`}
              alt="icon-tatap-muka"
              style={{
                width: "50px",
                height: "50px",
              }}
            />
            <p className="m-0 text-white fw-bold ps-lg-4 pe-lg-5 px-md-0 ps-4 pe-5">
              { gmeetURL == "#!"
                ? "Tidak ada tatap muka"
                : "Tatap Muka"
              }
            </p>
          </div>
        </a>
        <div className="post-content mt-4">
          <p className="color-secondary">
            {`Absen Kelas ${detailData?.timeline?.rombel?.nama} Tanggal ${detailData?.timeline?.tanggalPertemuan}`}
          </p>
          <div>
            {detailData?.timeline?.deskripsi}
          </div>
        </div>
      </div>
      <div className="col-md-4 pe-2 mb-md-0 mb-3">
        <h6 className="fs-18-ss fw-bold color-dark mb-3">
          Pilih Keterangan Absen
        </h6>

        {(absen === "hadir" || !absen) && <CardKeteranganAbsen type="hadir" active={absen === "hadir"} onClick={() => onClickCardKeteranganAbsen("hadir")} />}
        {(absen === "izin" || !absen) && <CardKeteranganAbsen type="izin" active={absen === "izin"} onClick={() => onClickCardKeteranganAbsen("izin")} />}
        {(absen === "sakit" || !absen) && <CardKeteranganAbsen type="sakit" active={absen === "sakit"} onClick={() => onClickCardKeteranganAbsen("sakit")} />}

        {lampiran?.length > 0 && (
          <div
            className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 "
            style={{
              height: "90px",
            }}
            onClick={() => showModal("modalBuktiKeteranganAbsen")}
          >
            <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
              <img
                src="/img/icon-bukti-keterangan.svg"
                alt="icon-tatap-muka"
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
              <p className="m-0 text-white fw-bold ps-lg-4 pe-lg-5 px-md-0 ps-4 pe-5">
                Bukti Keterangan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    <hr />

    <CommentSection detailData={detailData} postKomen={postKomen} _getDetailTimeline={_getDetailTimeline} />
    
    <ModalAbsenIzinSakit
      modalType={modalType}
      lampiran={lampiranModal}
      setKeterangan={setKeterangan}
      setLampiran={setLampiranModal}
      onSubmit={() => handleAbsensi(modalType)}
    />

    <ModalBuktiKeteranganAbsen
      keterangan={detailData?.keterangan}
      waktuAbsen={detailData?.waktuAbsen}
      lampiran={lampiran}
    />
  </>
}

const CommentSection = ({ detailData, postKomen, _getDetailTimeline }) => {

  const deleteKomen = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTimelineKomen(id);
        if (data) {
          toast.success(data?.message);
          _getDetailTimeline();
        }
      }
    });
  };

  return (
    <>
      {detailData?.timeline?.komen?.map((komenData, idx) => (
        <KomenTimeline
          idx={idx}
          totalKomen={detailData?.timeline?.komen?.length}
          komen={komenData?.komen}
          userObj={komenData?.user}
          userId={komenData?.mUserId}
          createdAt={komenData?.createdAt}
          onClickDelete={deleteKomen}
          komenId={komenData?.id}
        />
      ))}
      <KomenInput postKomen={postKomen} />
    </>
  )
}

export default ContentSiswa;