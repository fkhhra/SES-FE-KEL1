import { DatePicker } from "antd";
import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";
import {
  putPenerimaanPkl31,
  getTambahPenerimaanPkl31,
} from "client/PenerimaanClient";
import { momentPackage } from "utilities/HelperUtils";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  tanggalMulai: "",
  tanggalSelesai: "",
  penerimaanId: "",
  perusahaanId: "",
  nama: "",
  rombel: "",
};

const ModalEditPenerimaanSiswa = ({ editDataSiswa, _getPenerimaanPkl31 }) => {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [btnState, setBtnState] = useState("idle");
  const [listPerusahaan, setListPerusahaan] = useState([]);
  const [listPenerimaan, setListPenerimaan] = useState([]);

  const _getTambahPenerimaanPkl31 = async () => {
    const { data, error } = await getTambahPenerimaanPkl31({
      // page,
      // search,
      perusahaan_id: formData?.perusahaanId,
    });

    if (data) {
      setListPerusahaan(data?.semuaPerusahaan);
      setListPenerimaan(data?.semuaPenerimaan);
    }
  };

  const _putPenerimaanPkl = async () => {
    setBtnState("loading");
    const { data, error } = await putPenerimaanPkl31({
      ...formData,
      m_penerimaan_siswa_id: formData?.id,
      m_penerimaan_perusahaan_id: formData?.penerimaanId,
      tanggalSelesai: momentPackage(formData?.tanggalSelesai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggalMulai: momentPackage(formData?.tanggalMulai).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });

    if (data) {
      setBtnState("loading");

      toast.success(data?.message);
      hideModal("modalEditPenerimaanSiswa");
      // setFormData({ ...initialFormData });
      _getPenerimaanPkl31();
    }
  };

  useEffect(() => {
    _getTambahPenerimaanPkl31();
  }, [formData?.perusahaanId]);

  useEffect(() => {
    if (editDataSiswa) {
      setFormData({
        ...formData,
        ...editDataSiswa,
        nama: editDataSiswa?.user?.nama,
        perusahaanId:
          editDataSiswa?.penerimaanPerusahaan?.perusahaanSekolah?.id,
        penerimaanId: editDataSiswa?.penerimaanPerusahaan?.id,
        rombel: editDataSiswa?.rombel?.nama,
      });
    } else {
      setFormData({
        ...initialFormData,
      });
    }
  }, [editDataSiswa]);
  return (
    <>
      <NewModal
        modalId="modalEditPenerimaanSiswa"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Ubah Informasi Penerimaan</h4>
          </>
        }
        content={
          <>
            <div className="mb-4">
              <h5 className="fw-bold color-dark fs-18-ss mb-2">
                {formData?.nama}
              </h5>
              <span className="fw-semibold m-0">{formData?.rombel}</span>
            </div>
            <div className="mb-4">
              <label className="form-label">Perusahaan</label>
              <SelectShared
                name="perusahaan"
                placeholder="Pilih Perusahaan"
                options={listPerusahaan?.map((d) => {
                  return {
                    label: `${d?.nama}`,
                    value: d?.id,
                  };
                })}
                handleChangeSelect={(e, name) => {
                  setFormData({
                    ...formData,
                    perusahaanId: e?.value,
                  });
                }}
                value={formData?.perusahaanId || ""}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Penerimaan</label>
              <SelectShared
                name="penerimaan"
                placeholder="Pilih Penerimaan"
                options={listPenerimaan?.map((d) => {
                  return {
                    label: `${d?.nama}`,
                    value: d?.id,
                  };
                })}
                handleChangeSelect={(e, name) => {
                  setFormData({
                    ...formData,
                    penerimaanId: e?.value,
                  });
                }}
                value={formData?.penerimaanId || ""}
                isDisabled={
                  formData?.perusahaanId == null || listPenerimaan?.length == 0
                }
              />
            </div>
            <div className="mb-4">
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
            <div className="mb-4">
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
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => _putPenerimaanPkl()}
          />
        }
      />
    </>
  );
};

export default ModalEditPenerimaanSiswa;
