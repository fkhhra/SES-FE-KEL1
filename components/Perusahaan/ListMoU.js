import { Tooltip } from "antd";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import React, { useState } from "react";
import { FaPen, FaTrashAlt, FaClone, FaPaperPlane } from "react-icons/fa";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";

function ListMoU({
  status,
  id,
  data,
  setEditData,
  handleDelete,
  isActive,
  dataMou,
  _deleteBerkasMou,
}) {
  const [collapseOpen, setcollapseOpen] = useState("");
  const kepada = JSON.parse(data?.kepada || "[]");
  //   const editData = {
  //     ...data,
  //     id: 0,
  //     kepada,
  //     tanggalDibagikan: momentPackage(data?.tanggalDibagikan).format(
  //       "YYYY-MM-DD HH:mm:ss"
  //     ),
  //     lampiran: [...data?.lampiran],
  //   };

  const dataKerjaSama = dataMou?.kerjasama?.split(",");
  const dataFasilitas = dataMou?.fasilitas?.split(",");

  const onClickEdit = (data) => {
    if (data) {
      let mSikapSpiritualDitunjukkanId = data?.mSikapSpiritualDitunjukkanId
        .split(",")
        .map(function (item) {
          return string(item);
        });

      setFormData({
        ...initialStateForm,
        id: data?.mUserId,
        mSikapSpiritualDitunjukkanId: mSikapSpiritualDitunjukkanId,
      });
    }
  };

  const ruangLingkupKerjasama = [
    { name: "PKL/Magang Siswa" },
    { name: "Sinkronisasi Kurikulum" },
    { name: "Magang Guru" },
    { name: "Narasumber Guru Tamu" },
    { name: "Kelas Industri" },
    { name: "TEFA" },
  ];

  const fasilitasPerusahaan = [
    { name: "Jaminan Kesehatan" },
    { name: "Keselamatan Kerja" },
    { name: "Alat Bantu / Media" },
    { name: "Uang Saku" },
    { name: "Uang Transportasi" },
    { name: "Makan" },
  ];

  const ruangLingkupMou = [
    {
      icon: `/img/icon-ruang-lingkup-kerjasama.svg`,
      iconAlt: `icon-ruang-lingkup-kerjasama`,
      title: `Ruang Lingkup Kerjasama`,
      content: (
        <>
          <div className="d-flex flex-wrap align-items-center">
            {dataKerjaSama?.map((d) => {
              return (
                <span className="label-ss rounded-pill bg-soft-secondary color-secondary fw-bold fs-12-ss m-1">
                  {d}
                </span>
              );
            })}
          </div>
        </>
      ),
    },
    {
      icon: `/img/icon-fasilitas-perusahaan.svg`,
      iconAlt: `icon-fasilitas-perusahaan`,
      title: `Fasilitas Perusahaan`,
      content: (
        <>
          <div className="d-flex flex-wrap align-items-center">
            {dataFasilitas?.map((d) => {
              return (
                <span className="label-ss rounded-pill bg-soft-secondary color-secondary fw-bold fs-12-ss m-1">
                  {d}
                </span>
              );
            })}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="card card-ss card-biaya-pendaftaran p-0">
      <div className="card-header-ss rounded-ss d-flex justify-content-md-between align-items-md-center flex-md-row flex-column p-4 pb-md-3">
        <div className="flex-grow-1 mb-md-0 mb-3">
          <div className="d-flex align-items-center mb-2">
            <h4 className="fw-bold color-dark mb-0 me-3">{dataMou?.nama}</h4>
            {isActive ? (
              <div className="label-ss label-light-primary-ss fs-12-ss rounded-pill">
                Aktif
              </div>
            ) : (
              ""
            )}
          </div>
          <h6 className="color-primary fw-bold mb-0">
            {momentPackage(dataMou?.mulaiKontrak).format("DD MMM YYYY")} -{" "}
            {momentPackage(dataMou?.akhirKontrak).format("DD MMM YYYY")}
          </h6>
        </div>
        <div className="d-flex ms-md-0 ms-auto">
          <button
            type="button"
            className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0 shadow-none"
            style={{
              width: "40px",
              height: "40px",
            }}
            data-bs-toggle="modal"
            data-bs-target={`#modalTambahBerkasMoU`}
            onClick={() => setEditData(dataMou)}
          >
            <FaPen className="color-secondary" />
          </button>
          <button
            className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={() => _deleteBerkasMou(dataMou?.id)}
          >
            <FaTrashAlt className="color-secondary" />
          </button>
          <button
            data-bs-toggle="collapse"
            data-bs-target={`#collapseExample${id}`}
            role="button"
            aria-expanded="false"
            className={`btn btn-collapse p-0 shadow-none ${
              collapseOpen ? "active" : ""
            }`}
            onClick={() => setcollapseOpen(!collapseOpen)}
          >
            <span
              class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary hover-shadow-none btn-primary-ss"
              style={{ width: "40px", height: "40px" }}
            >
              <img className="dropdown" src="/img/arrow-bottom.svg" alt="" />
            </span>
          </button>
        </div>
      </div>

      <div class="collapse" id={`collapseExample${id}`}>
        <hr className="mb-4 mt-0" />
        <div class="card-body card-footer-ss pb-4 px-4 pt-0">
          <div className="row gy-4">
            {ruangLingkupMou?.map((d) => {
              return (
                <div className={"col-md-12"}>
                  <div
                    className={`d-flex ${
                      d.isAlamat ? "align-items-start" : "align-items-center"
                    }`}
                  >
                    <img
                      src={d.icon}
                      alt={d.iconAlt}
                      style={{ width: "52px", height: "52px" }}
                    />
                    <div className="ms-4">
                      <h5 className="fs-18-ss color-dark fw-bold mb-1">
                        {d.title}
                      </h5>
                      <h6 className="fw-semibold color-dark mb-0">
                        {d.content}
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="col-12">
              <FileAttachment
                nama={getFileName(dataMou?.lampiran)}
                href={getPreviewURL(dataMou?.lampiran)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListMoU;
