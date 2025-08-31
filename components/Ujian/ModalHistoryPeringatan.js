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
import { postDibacaPeringatanUjianGuru } from "client/UjianClient";

const initialFormData = {
  nama: "",
  lampiran: "",
};
const ModalHistoryPeringatan = ({
  editData,
  _getDetailBerkas,
  id,
  peringatan,
  getDetailJadwalUjianData,
}) => {
  console.log(peringatan);
  //   const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");
  //   const [file, setFile] = useState("");
  const _postDibaca = async () => {
    const { data, error } = await postDibacaPeringatanUjianGuru(
      peringatan?.[0]?.tkPesertaUjianId
    );
    if (data) {
      // toast.success("Berhasil Membaca");
    } else {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (peringatan?.[0]) {
      _postDibaca();
      getDetailJadwalUjianData();
    }
  }, [peringatan]);
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
        modalId="modalHistoryPeringatan"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">History Peringatan</h4>
          </>
        }
        modalSize="lg"
        content={
          <>
            {peringatan?.length == 0 ? (
              <div className="card-body p-4">
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-8 col-10 text-center">
                    <img
                      src="/img/empty-state-data.svg"
                      alt=""
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-12 text-center">
                    <h4 className="color-dark fw-black mt-4 mb-2">
                      Tidak Ada Pesan
                    </h4>
                  </div>
                </div>
              </div>
            ) : (
              peringatan?.map((d, idx) => (
                <div className="mb-4">
                  <ListHistoryPeringatan data={d} id={idx + 1} />
                </div>
              ))
            )}
          </>
        }
      />
    </>
  );
};

export default ModalHistoryPeringatan;
