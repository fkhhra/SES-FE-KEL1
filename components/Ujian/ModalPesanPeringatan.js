import axios from "axios";
import { baseURL } from "client/clientAxios";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";
import UploadFileComplete from "components/Shared/CompleteFileUpload/CompleteFileUpload";
import {
  postBerkasSurat,
  putBerkasSurat,
} from "client/MouSuratPerusahaanClient";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import ListHistoryPeringatan from "./ListHistoryPeringatan";
import { editJawabanPeringatanUjian } from "client/UjianClient";

const initialFormData = {
  nama: "",
  lampiran: "",
};
const ModalPesanPeringatan = ({
  editData,
  _getDetailBerkas,
  id,
  peringatan,
  _getDetailPesertaUjianData,
}) => {
  //   const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");
  //   const [file, setFile] = useState("");
  const [jawaban, setJawaban] = useState(peringatan?.jawaban);
  const _editJawaban = async () => {
    const payload = {
      jawaban,
    };
    const { data, error } = await editJawabanPeringatanUjian(
      peringatan?.id,
      payload
    );
    if (data) {
      toast.success("Berhasil Menjawab");
      // hideModal("modalPesanPeringatan");
      _getDetailPesertaUjianData();
    } else {
      toast.error(error.message);
    }
  };

  return (
    <>
      <NewModal
        modalId="modalPesanPeringatan"
        modalSize="lg"
        removeFooter={true}
        isModalWhite={true}
        isModalVerifikasi={true}
        content={
          <>
            <h4 className="fw-extrabold text-center color-dark mb-4">
              Peringatan
            </h4>
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-6 col-sm-8">
                <img
                  src={`/img/warning-illustration.png`}
                  alt="illustration"
                  className="img-fluid mb-4"
                  // style={{ width: "275px", height: "200px" }}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className={`col-md-8 text-center mb-4`}>
                <h6 className={`fs-18-ss md-fs-6 mb-4 fw-bold color-dark`}>
                  {peringatan?.deskripsi}
                </h6>
                {/* <p className="fw-semibold text-center md-fs-14-ss text-start mb-0">
                  Anda sudah keluar sebanyak{" "}
                </p> */}
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
                  //   value={formData?.alamat}
                  //   onChange={handleChangeForm}
                  // onChange={(value) => setFormNilai(value)}
                  // disabled={showInput != d.id}
                  // onKeyPress={(e) => {
                  //   e.key === "Enter"
                  //     ? _editRekapNilai(e.target.value, d)
                  //     : "";
                  // }}
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <button
                  className="btn btn-primary btn-ss btn-primary-ss rounded-ss w-100 fw-bold fs-18-ss shadow-primary-ss mb-4"
                  type="button"
                  onClick={_editJawaban}
                >
                  Kirim Balasan
                </button>
              </div>
            </div>
          </>
        }
      />
    </>
  );
};

export default ModalPesanPeringatan;
