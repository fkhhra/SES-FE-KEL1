import React from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import { TwitterPicker } from "react-color";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const ModalTambahAktivitas = ({
  formData,
  handleChangeForm,
  tipeData,
  _postAktivitas,
  akunTerpakai = [],
}) => {
  return (
    <NewModal
      modalId="modalTambahAktivitas"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">
            {/* {formData?.idKategori ? "Edit" : "Buat"} */}
            Aktivitas Transaksi{" "}
          </h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk memilih Aktivitas Transaksi
          </span>
        </>
      }
      content={
        <>
          <div className="mb-4">
            <label className="form-label">Judul</label>
            <input
              type="text"
              className="form-control"
              autoComplete="off"
              placeholder="Masukkan Nama Tipe Akun"
              value={formData?.judul}
              name="judul"
              onChange={handleChangeForm}
            />
          </div>
          {formData?.laba ? null : (
            <div className="mb-4">
              <label className="form-label">Pilih Tipe Akun</label>
              <SelectShared
                name="mKeuKategoriTipeAkunId"
                placeholder="Kas dan Bank"
                handleChangeSelect={(e) => {
                  handleChangeForm({
                    target: { name: "mKeuKategoriTipeAkunId", value: e?.value },
                  });
                  // setFormData({
                  //   ...formData,
                  //   mKeuKategoriTipeAkunId: e?.value || "",
                  // })
                }}
                value={formData.mKeuKategoriTipeAkunId}
                options={tipeData
                  ?.filter(
                    (d) =>
                      !akunTerpakai.includes(d?.id) ||
                      d?.id == formData.mKeuKategoriTipeAkunId
                  )
                  ?.map((d) => {
                    return {
                      value: d?.id,
                      label: d?.nama,
                    };
                  })}
              />
            </div>
          )}
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={formData?.btnBio}
          color={"primary"}
          idleText={"Simpan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={_postAktivitas}
        />
      }
    />
  );
};

export default ModalTambahAktivitas;
