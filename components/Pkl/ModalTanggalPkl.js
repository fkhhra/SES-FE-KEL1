import { DatePicker } from "antd";
import ReactiveButton from "reactive-button";
import moment from "moment";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import NewModal from "../Shared/NewModal/NewModal";
import MultipleInputField from "../Shared/MultipleInputField/MultipleInputField";
import Editor from "../Shared/Editor/Editor";
import { momentPackage } from "../../utilities/HelperUtils";
import {
  editGelombangPPDB,
  postGelombangPPDB,
} from "../../client/GelombangPPDB";
import { hideModal } from "../../utilities/ModalUtils";
import { downloadMonev } from "../../client/JadwalMengajarClient";
import { baseURL, downloadURL } from "../../client/clientAxios";
import { putPenerimaanPklSiswa } from "client/PenerimaanClient";
const initialFormData = {
  tanggalMulai: "",
  tanggalSelesai: "",
};
const ModalTanggalPkl = ({ editData, _getPenerimaanPkl }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");

  const _putPenerimaanPkl = async () => {
    const { data, error } = await putPenerimaanPklSiswa(formData?.id, {
      ...formData,
      tanggalSelesai: momentPackage(formData?.tanggalSelesai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggalMulai: momentPackage(formData?.tanggalMulai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    if (data) {
      toast.success(data?.message);
      hideModal("ModalTanggalPkl");
      // setFormData({ ...initialFormData });
      _getPenerimaanPkl();
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      tanggalMulai: momentPackage(formData?.tanggalMulai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggalSelesai: momentPackage(formData?.tanggalSelesai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editData]);

  //   const _handleSubmit = async () => {
  //     const { data, error } = await postPenerimaanPkl(id, {
  //       m_user_id: dipilih?.map((d) => d?.id),
  //       m_penerimaan_perusahaan_id: id,
  //       tanggal_mulai: momentPackage(formData.tanggalMulai).format(
  //         "YYYY-MM-DD HH:mm:ss"
  //       ),
  //       tanggal_selesai: momentPackage(formData.tanggalSelesai).format(
  //         "YYYY-MM-DD HH:mm:ss"
  //       ),
  //     });

  //     if (data) {
  //       toast.success(data?.message);
  //       hideModal("ModalTambahPenerimaanSiswaPkl");
  //       _detailPenerimaanPkl();
  //     }
  //   };
  //   const [formData, setFormData] = useState({
  //     tanggalMulai: "",
  //     tanggalSelesai: "",
  //   });

  //   const [formData, setFormData] = useState(initialFormData);

  //   const _downloadMonev = async () => {
  //     setFormData({ ...formData, buttonState: "loading" });

  //     const payload = {
  //       tanggalAwal: momentPackage(formData.tanggalAwal).format(
  //         "YYYY-MM-DD HH:mm:ss"
  //       ),
  //       tanggalAkhir: momentPackage(formData.tanggalAkhir).format(
  //         "YYYY-MM-DD HH:mm:ss"
  //       ),
  //     };

  //     const { data } = await downloadMonev(payload);

  //     if (data) {
  //       setFormData({ ...initialFormData, buttonState: "success" });
  //       hideModal("ModalMonev");
  //       window.open(`${downloadURL}/${data}`);
  //     } else {
  //       setFormData({ ...formData, buttonState: "error" });
  //     }
  //   };

  //   function handleChangeDatePicker(date, dateString, name) {
  //     setFormData({
  //       ...formData,
  //       [name]: dateString ? moment(date) : "",
  //     });
  //   }

  return (
    <NewModal
      modalId="ModalTanggalPkl"
      modalSize="md"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Ubah Data PKL Siswa</h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk menambah data PKL siswa
          </span>
        </>
      }
      content={
        <>
          <div className="mb-3">
            <label className="form-label">Tanggal Mulai</label>
            <DatePicker
              onChange={(date, dateString) =>
                setFormData({
                  ...formData,
                  tanggalMulai: dateString,
                })
              }
              placeholder="Pilih Tanggal"
              className="form-control"
              autoComplete="off"
              value={
                formData?.tanggalMulai
                  ? momentPackage(formData?.tanggalMulai)
                  : ""
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Selesai</label>
            <DatePicker
              onChange={(date, dateString) =>
                setFormData({
                  ...formData,
                  tanggalSelesai: dateString,
                })
              }
              placeholder="Pilih Tanggal"
              className="form-control"
              autoComplete="off"
              value={
                formData?.tanggalSelesai
                  ? momentPackage(formData?.tanggalSelesai)
                  : ""
              }
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={btnState}
          color={"primary"}
          onClick={_putPenerimaanPkl}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          idleText={"Ubah"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalTanggalPkl;
