import SelectShared from "components/Shared/SelectShared/SelectShared";
import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadBanner from "../Shared/UploadBanner/UploadBanner";

const ModalPindahData = ({
  // handleChangeForm,
  formData,
  idRekap,
  // _postRekap,
  // editData,
  buttonState,
  _putPindahRekap,
  handlePindahTahun,
  semuaTA,
  pindahRekapData,
}) => {
  return (
    <>
      <NewModal
        modalId="modalPindahData"
        modalSize="md"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">Pindahkan Data</h4>
            {/* <span className="fs-6 fw-normal">
              Dibawah ini adalah keterangan yang diberikan untuk siswa
            </span> */}
          </>
        }
        content={
          <>
            <div className="mb-4 pb-5 mb-5">
              <label className="form-label">Pindahkan data ke</label>
              <SelectShared
                name="selectTa"
                placeholder="Pilih tahun akademik"
                handleChangeSelect={handlePindahTahun}
                value={pindahRekapData?.m_ta_id}
                options={semuaTA?.map((d) => {
                  return {
                    label: `${d?.tahun} - ${d?.semester}`,
                    value: d?.id,
                    name: `m_ta_id`,
                    idRekap: formData.id,
                  };
                })}
              />
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
            onClick={() => _putPindahRekap()}
          />
        }
      />
    </>
  );
};

export default ModalPindahData;
