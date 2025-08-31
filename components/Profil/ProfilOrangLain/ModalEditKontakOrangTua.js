import React, { useState } from "react";
import toast from "react-hot-toast";
import { postDetailProfilUser, postProfilUser } from "client/AuthClient";
import { hideModal } from "utilities/ModalUtils";

import NewModal from "../../Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import useUser from "hooks/useUser";
import SelectShared from "../../Shared/SelectShared/SelectShared";
import TextareaAutosize from "react-textarea-autosize";
import router from "next/router";

const ModalEditKontakOrangTua = ({ id, data }) => {
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    statusKeluarga: user?.profil?.statusKeluarga,
    anakKe: user?.profil?.anakKe,
    telpRumah: user?.profil?.telpRumah,
    namaAyah: user?.profil?.namaAyah,
    namaIbu: user?.profil?.namaIbu,
    namaWali: user?.profil?.namaWali,
    pekerjaanAyah: user?.profil?.pekerjaanAyah,
    pekerjaanIbu: user?.profil?.pekerjaanIbu,
    pekerjaanWali: user?.profil?.pekerjaanWali,
    alamatAyah: user?.profil?.alamatAyah,
    alamatIbu: user?.profil?.alamatIbu,
    alamatWali: user?.profil?.alamatWali,
    telpAyah: user?.profil?.telpAyah,
    telpIbu: user?.profil?.telpIbu,
    telpWali: user?.profil?.telpWali,
  });
  const [buttonState, setButtonState] = useState("idle");

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setButtonState("loading");
    const { data, error } = await postDetailProfilUser(id, formData);
    if (data) {
      setButtonState("success");
      hideModal("modalEditKontakOrangTua");
      toast.success(data?.message);
      router.reload();
      // setUser({ ...user, profil: { ...user?.profil, ...formData } });
    } else {
      setButtonState("error");
      toast.error(error?.message);
    }
  };

  const handleChangeSelect = (e, name) => {
    setFormData({ ...formData, [name]: e.value });
  };

  return (
    <>
      <NewModal
        modalSize="fullscreen"
        modalId="modalEditKontakOrangTua"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Edit Informasi Keluarga</h4>
            <span className="fs-6 fw-normal">
              Isi informasi dibawah untuk mengubah informasi keluarga
            </span>
          </>
        }
        content={
          <>
            <div className="container">
              <div className="row gy-4">
                <div className="col-md-12">
                  <div className="card card-ss p-4">
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label">
                          Status dalam Keluarga
                        </label>
                        <SelectShared
                          name="statusKeluarga"
                          placeholder="Pilih Status"
                          handleChangeSelect={handleChangeSelect}
                          value={formData.statusKeluarga}
                          options={[
                            { label: "Anak Kandung", value: "anak kandung" },
                            { label: "Anak Angkat", value: "anak angkat" },
                          ]}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <label className="form-label">Anak ke</label>
                        <input
                          type="number"
                          min={1}
                          className="form-control"
                          autoComplete="off"
                          value={formData?.anakKe}
                          name="anakKe"
                          onChange={handleChangeForm}
                        />
                      </div>
                      <div className="col-md-12 mb-4">
                        <label className="form-label">
                          Nomor Telepon Rumah
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          autoComplete="off"
                          value={formData?.telpRumah}
                          name="telpRumah"
                          onChange={handleChangeForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-ss p-4">
                    <h4 className="fw-extrabold color-dark mb-4">
                      Informasi Ayah
                    </h4>
                    <div className="mb-4">
                      <label className="form-label">Nama Ayah</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.namaAyah}
                        name="namaAyah"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Nomor Whatsapp</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.telpAyah}
                        name="telpAyah"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Pekerjaan Ayah</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.pekerjaanAyah}
                        name="pekerjaanAyah"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Alamat Ayah</label>
                      <TextareaAutosize
                        className="form-control"
                        autoComplete="off"
                        name="alamatAyah"
                        style={{
                          resize: "none",
                          width: "100%",
                        }}
                        minRows={5}
                        value={formData.alamatAyah}
                        onChange={handleChangeForm}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-ss p-4">
                    <h4 className="fw-extrabold color-dark mb-4">
                      Informasi Ibu
                    </h4>
                    <div className="mb-4">
                      <label className="form-label">Nama Ibu</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.namaIbu}
                        name="namaIbu"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Nomor Whatsapp</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.telpIbu}
                        name="telpIbu"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Pekerjaan Ibu</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.pekerjaanIbu}
                        name="pekerjaanIbu"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Alamat Ibu</label>
                      <TextareaAutosize
                        className="form-control"
                        autoComplete="off"
                        name="alamatIbu"
                        style={{
                          resize: "none",
                          width: "100%",
                        }}
                        minRows={5}
                        value={formData.alamatIbu}
                        onChange={handleChangeForm}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card card-ss p-4">
                    <h4 className="fw-extrabold color-dark mb-4">
                      Informasi Wali
                    </h4>
                    <div className="mb-4">
                      <label className="form-label">Nama Wali</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.namaWali}
                        name="namaWali"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Nomor Whatsapp</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.telpWali}
                        name="telpWali"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Pekerjaan Wali</label>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        value={formData?.pekerjaanWali}
                        name="pekerjaanWali"
                        onChange={handleChangeForm}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Alamat Wali</label>
                      <TextareaAutosize
                        className="form-control"
                        autoComplete="off"
                        name="alamatWali"
                        style={{
                          resize: "none",
                          width: "100%",
                        }}
                        minRows={5}
                        value={formData.alamatWali}
                        onChange={handleChangeForm}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={buttonState}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={handleSubmit}
          />
        }
      />
    </>
  );
};

export default ModalEditKontakOrangTua;
