import { DatePicker } from "antd";
import {
  postInformasiGelombang,
  putInformasiGelombang,
} from "client/InformasiGelombang";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { momentPackage } from "../../utilities/HelperUtils";
import { hideModal } from "../../utilities/ModalUtils";
import NewModal from "../Shared/NewModal/NewModal";

const ModalKegiatanPPDB = ({
  editData,
  _detailJalurPpdb,
  isEdit,
  m_gelombang_ppdb_id,
  jalur,
}) => {
  const initialFormData = {
    nama: "",
    dibuka: momentPackage(),
    ditutup: momentPackage().add(7, "days"),
    tesAkademik: 0,
    biayaPendaftaran: 0,
    buttonState: "idle",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        dibuka: momentPackage(editData?.dibuka),
        ditutup: momentPackage(editData?.ditutup),
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editData]);

  const _postInformasiGelombang = async () => {
    if (!formData?.nama) {
      toast.error("Nama Kegiatan harus diisi");
      return;
    }
    if (!formData?.dibuka) {
      toast.error("Tanggal dibuka harus diisi");
      return;
    }
    if (!formData?.ditutup) {
      toast.error("Tanggal ditutup harus diisi");
      return;
    }
    setFormData({ ...formData, buttonState: "loading" });

    const payload = {
      ...formData,
      dibuka: momentPackage(formData.dibuka).format("YYYY-MM-DD HH:mm:ss"),
      ditutup: momentPackage(formData.ditutup).format("YYYY-MM-DD HH:mm:ss"),
      m_gelombang_ppdb_id: m_gelombang_ppdb_id,
      tipe: "kegiatan",
    };

    const { data } = isEdit
      ? await putInformasiGelombang(editData?.id, payload)
      : await postInformasiGelombang(payload);

    if (data) {
      setFormData({ ...initialFormData, buttonState: "success" });
      toast.success(data.message);
      hideModal("modalKegiatanPPDB");
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
      modalId="modalKegiatanPPDB"
      modalSize="md"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {isEdit ? "Ubah" : "Tambah"} Kegiatan
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk {isEdit ? "mengubah" : "menambahkan"}{" "}
            kegiatan
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
              placeholder="Contoh : Lapor Diri"
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChangeForm}
            />
          </div>

          <div className="row mb-4 gy-4">
            <div className="col-md-6">
              <label className="form-label">Waktu Dibuka</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.dibuka}
                placeholder="Pilih tanggal"
                disabledDate={(current) =>
                  current < momentPackage(jalur?.dibuka).startOf("day") ||
                  current > momentPackage(jalur?.ditutup).endOf("day")
                }
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "dibuka")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Waktu Ditutup</label>
              <DatePicker
                className="form-control"
                autoComplete="off"
                value={formData?.ditutup}
                placeholder="Pilih tanggal"
                disabledDate={(current) => {
                  return (
                    current < formData?.dibuka ||
                    current < momentPackage(jalur?.dibuka).startOf("day") ||
                    current > momentPackage(jalur?.ditutup).endOf("day")
                  );
                }}
                onChange={(date, dateString) =>
                  handleChangeDatePicker(date, dateString, "ditutup")
                }
              />
            </div>
          </div>
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData.buttonState}
          onClick={_postInformasiGelombang}
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

export default ModalKegiatanPPDB;
