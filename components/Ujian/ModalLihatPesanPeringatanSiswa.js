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
import ListHistoryPeringatanSiswa from "./ListHistoryPeringatanSiswa";

const initialFormData = {
  nama: "",
  lampiran: "",
};
const ModalLihatPesanPeringatanSiswa = ({
  editData,
  _getDetailBerkas,
  id,
  data1,
  _getDetailPesertaUjianData,
}) => {
  //   const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");
  //   const [file, setFile] = useState("");

  //   const _postBerkasSurat = async () => {
  //     setBtnState("loading");
  //     const validate = formValidation(formData);
  //     if (validate) {
  //       toast.error(validate);
  //       return;
  //     }
  //     const { data, error } = await postBerkasSurat({
  //       ...formData,
  //       tkPerusahaanSekolahId: id,
  //     });

  //     if (data) {
  //       setBtnState("success");

  //       toast.success(data?.message);
  //       hideModal("modalTambahBerkasSurat");
  //       _getDetailBerkas();
  //     }
  //   };

  //   const _putBerkasSurat = async () => {
  //     setBtnState("loading");

  //     const validate = formValidation(formData);
  //     if (validate) {
  //       toast.error(validate);
  //       return;
  //     }
  //     const { data, error } = await putBerkasSurat(formData?.id, {
  //       ...formData,
  //       tkPerusahaanSekolahId: id,
  //     });

  //     if (data) {
  //       setBtnState("success");

  //       toast.success(data?.message);
  //       hideModal("modalTambahBerkasSurat");
  //       _getDetailBerkas();
  //     }
  //   };

  //   const formValidation = (formData) => {
  //     if (!formData?.nama) {
  //       return "Harap Memasukan Nama surat";
  //     }
  //     if (!formData?.lampiran) {
  //       return "Harap Mengupload file surat";
  //     }
  //     return "";
  //   };

  //   const handleChangeInput = (e, uploadedFile) => {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: uploadedFile || e.target.value,
  //     });
  //   };

  //   useEffect(() => {
  //     if (editData) {
  //       setFormData({
  //         ...editData,
  //       });
  //     } else {
  //       setFormData(initialFormData);
  //     }
  //   }, [editData]);
  return (
    <>
      <NewModal
        modalId="modalLihatPesanPeringatanSiswa"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">History Peringatan</h4>
          </>
        }
        modalSize="lg"
        content={
          <>
            {data1?.map((d, idx) => {
              return (
                <div className="mb-4">
                  <ListHistoryPeringatanSiswa
                    dataPeringatan={d}
                    id={idx + 1}
                    _getDetailPesertaUjianData={_getDetailPesertaUjianData}
                  />
                </div>
              );
            })}
          </>
        }
      />
    </>
  );
};

export default ModalLihatPesanPeringatanSiswa;
