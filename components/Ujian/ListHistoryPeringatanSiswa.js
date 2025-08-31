import { Tooltip } from "antd";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import React, { useState } from "react";
import { FaPen, FaTrashAlt, FaClone, FaPaperPlane } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { getFileName, getPreviewURL } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";
import { FaCheck } from "react-icons/fa";
import {
  editJawabanPeringatanUjian,
  postJawabanPeringatanUjian,
} from "client/UjianClient";
import { editJawabanUjianSiswa } from "client/PesertaUjianClient";
import toast from "react-hot-toast";

function ListHistoryPeringatanSiswa({
  status,
  id,
  dataPeringatan,
  setEditData,
  handleDelete,
  isActive,
  dataMou,
  _deleteBerkasMou,
  _getDetailPesertaUjianData,
}) {
  const [collapseOpen, setcollapseOpen] = useState("");
  const [showInput, setShowInput] = useState(null);
  // const [formData, setFormData] = useState(initialFormData);
  const [jawaban, setJawaban] = useState(dataPeringatan?.jawaban);

  const _editJawaban = async () => {
    const payload = {
      jawaban,
    };
    const { data, error } = await editJawabanPeringatanUjian(
      dataPeringatan?.id,
      payload
    );
    if (data) {
      toast.success("Berhasil Menjawab");
      setShowInput(null);
      _getDetailPesertaUjianData();
    } else {
      toast.error(error.message);
    }
  };

  // const kepada = JSON.parse(data?.kepada || "[]");
  //   const editData = {
  //     ...data,
  //     id: 0,
  //     kepada,
  //     tanggalDibagikan: momentPackage(data?.tanggalDibagikan).format(
  //       "YYYY-MM-DD HH:mm:ss"
  //     ),
  //     lampiran: [...data?.lampiran],
  //   };

  // const dataKerjaSama = dataMou?.kerjasama?.split(",");
  // const dataFasilitas = dataMou?.fasilitas?.split(",");

  // const onClickEdit = (data) => {
  //   if (data) {
  //     let mSikapSpiritualDitunjukkanId = data?.mSikapSpiritualDitunjukkanId
  //       .split(",")
  //       .map(function (item) {
  //         return string(item);
  //       });

  //     setFormData({
  //       ...initialStateForm,
  //       id: data?.mUserId,
  //       mSikapSpiritualDitunjukkanId: mSikapSpiritualDitunjukkanId,
  //     });
  //   }
  // };

  return (
    <div className="card card-ss card-biaya-pendaftaran p-0">
      <div className="card-header-ss rounded-ss d-flex justify-content-md-between align-items-md-center flex-md-row flex-column p-4 pb-md-3">
        <div className="flex-grow-1 mb-md-0 mb-3">
          {/* <div
            className={`label-ss fs-12-ss rounded-pill bg-warning text-white mb-2`}
            style={{ width: "min-content", whiteSpace: "nowrap" }}
          >
            Peringatan pertama
          </div> */}
          <div className="d-flex align-items-center mb-2">
            <h4 className="fw-bold color-dark mb-0 me-3">
              {/* Kenapa kamu keluar ujian 5 kali ? */}
              {dataPeringatan?.deskripsi}
            </h4>
          </div>
          <h6 className="color-primary fw-bold mb-0">
            {/* {momentPackage(dataMou?.mulaiKontrak).format("DD MMM YYYY")} -{" "}
            {momentPackage(dataMou?.akhirKontrak).format("DD MMM YYYY")} */}
          </h6>
        </div>
        <div className="d-flex ms-md-0 ms-auto">
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
          <div className="row gy-4 ">
            {/* {ruangLingkupMou?.map((d) => {
              return ( */}
            <div className={"col-md-12"}>
              <div className={`row d-flex align-items-center`}>
                <div className="col-md-10 col-10 d-flex justify-content-center">
                  <TextareaAutosize
                    className="form-control"
                    placeholder="Balas pesan"
                    autoComplete="off"
                    name="deskripsiPeringatan"
                    style={{
                      resize: "none",
                      width: "100%",
                      height: "100%",
                    }}
                    minRows={4}
                    value={jawaban}
                    onChange={({ target }) => setJawaban(target.value)}
                    // onChange={(value) => setFormNilai(value)}
                    disabled={showInput != dataPeringatan.id}
                    onKeyPress={(e) => {
                      e.key === "Enter" ? _editRekapNilai() : "";
                    }}
                  />
                </div>

                {showInput == dataPeringatan.id ? (
                  <div className="col-md-2 col-2 d-flex justify-content-center">
                    <a onClick={_editJawaban}>
                      <div
                        className="rounded-circle bg-primary p-2 d-flex justify-content-center align-items-center shadow-primary-ss"
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                      >
                        <FaCheck color="white" />
                      </div>
                    </a>
                  </div>
                ) : (
                  <div className="col-md-2 col-2 d-flex align-items-center justify-content-center">
                    <a
                      onClick={() => {
                        setShowInput(dataPeringatan?.id),
                          setJawaban(dataPeringatan?.jawaban);
                      }}
                    >
                      <div
                        className="rounded-circle p-2 d-flex justify-content-center align-items-center shadow-primary-ss"
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                      >
                        <FaPen color="dark" />
                      </div>
                      {/* <img
                        src={`/img/icon-edit-template-deskripsi.svg`}
                        alt="icon-option"
                        className=" d-flex justify-content-center align-items-center shadow-primary-ss"
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                      /> */}
                    </a>
                  </div>
                )}
                {/* </div> */}
              </div>
            </div>
            {/* );
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListHistoryPeringatanSiswa;
