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
import SelectShared from "../Shared/SelectShared/SelectShared";
import TextareaAutosize from "react-textarea-autosize";
import {
  postInformasiGelombang,
  putInformasiGelombang,
} from "client/InformasiGelombang";

const ModalPengumumanPPDB = ({
  editData,
  _detailJalurPpdb,
  isEdit,
  m_gelombang_ppdb_id,
  jalur,
}) => {
  const initialFormData = {
    nama: "",
    pengumuman: momentPackage(),
    buttonState: "idle",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        pengumuman: momentPackage(editData?.pengumuman),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  const _postGelombangPPDB = async () => {
    if (!formData?.nama) {
      toast.error("Nama Kegiatan harus diisi");
      return;
    }
    if (!formData?.pengumuman) {
      toast.error("Tanggal pengumuman harus diisi");
      return;
    }
    setFormData({ ...formData, buttonState: "loading" });

    const payload = {
      ...formData,
      pengumuman: momentPackage(formData.pengumuman).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      m_gelombang_ppdb_id: m_gelombang_ppdb_id,
      tipe: "pengumuman",
    };

    const { data } = isEdit
      ? await putInformasiGelombang(editData?.id, payload)
      : await postInformasiGelombang(payload);

    if (data) {
      setFormData({ ...initialFormData, buttonState: "success" });
      toast.success(data.message);
      hideModal("modalPengumumanPPDB");
      _detailJalurPpdb();
    } else {
      setFormData({ ...formData, buttonState: "error" });
      toast.error(data.message);
    }
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleChangeDatePicker(date, dateString, name) {
    setFormData({
      ...formData,
      [name]: dateString ? moment(date) : "",
    });
  }

  return (
    <NewModal
      modalId="modalPengumumanPPDB"
      modalSize="md"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Pengumuman
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            pengumuman
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Nama</label>
            <input
              className="form-control"
              autoComplete="off"
              placeholder="Contoh : Pengumuman Penerimaan"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChangeForm}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Tanggal Pengumuman</label>
            <DatePicker
              className="form-control"
              autoComplete="off"
              value={formData?.pengumuman}
              placeholder="Pilih tanggal"
              disabledDate={(current) =>
                current < momentPackage(jalur?.dibuka).startOf("day") ||
                current > momentPackage(jalur?.ditutup).endOf("day")
              }
              onChange={(date, dateString) =>
                handleChangeDatePicker(date, dateString, "pengumuman")
              }
            />
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData.buttonState}
          onClick={_postGelombangPPDB}
          color={"primary"}
          idleText={`Simpan`}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
    />
  );
};

export default ModalPengumumanPPDB;
