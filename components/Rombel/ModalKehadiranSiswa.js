import { InputNumber } from "antd";
import React from "react";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";

const ModalKehadiranSiswa = ({
  formData,
  handleChangeForm,
  _putKehadiranSiswa,
}) => {
  return (
    <>
      <NewModal
        modalId="modalKehadiranSiswa"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Kehadiran Siswa</h4>
          </>
        }
        content={
          <>
            <div className="mb-2">
              <h5 className="fw-bold color-dark fs-18-ss mb-4">
                Kehadiran Siswa
              </h5>
              <div className="row">
                <div className="mb-4">
                  <label className="form-label">Sakit</label>
                  <InputNumber
                    className="form-control w-100"
                    autoComplete="off"
                    min={0}
                    name="sakit"
                    value={formData.sakit}
                    onChange={(value) =>
                      handleChangeForm({ target: { name: "sakit", value } })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Izin</label>
                  <InputNumber
                    className="form-control w-100"
                    autoComplete="off"
                    min={0}
                    name="izin"
                    value={formData.izin}
                    onChange={(value) =>
                      handleChangeForm({ target: { name: "izin", value } })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Alpa</label>
                  <InputNumber
                    className="form-control w-100"
                    autoComplete="off"
                    min={0}
                    name="alpa"
                    value={formData.alpa}
                    onChange={(value) =>
                      handleChangeForm({ target: { name: "alpa", value } })
                    }
                  />
                </div>
              </div>
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={"idle"}
            color={"primary"}
            idleText={"Simpan"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
            onClick={() => _putKehadiranSiswa()}
          />
        }
      />
    </>
  );
};

export default ModalKehadiranSiswa;
