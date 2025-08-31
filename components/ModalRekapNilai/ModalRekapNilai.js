import axios from "axios";
import { baseURL, downloadURL } from "client/clientAxios";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import NewModal from "components/Shared/NewModal/NewModal";
import { getFileType } from "utilities/FileViewer";
import { useEffect } from "react";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import {
  downloadJadwalUjian,
  downloadJawabanJadwalSemuaUjian,
  downloadJawabanJadwalUjian,
  downloadSemuaJadwalUjian,
} from "client/JadwalUjianClient";

const initialFormData = {
  rombelId: "",
};
const ModalRekapNilai = ({ id, jadwalId, jadwalUjian }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [btnState, setBtnState] = useState("idle");

  let listKelas = [{ label: "Semua Kelas", value: "semua" }];
  console.log(jadwalUjian);

  jadwalUjian?.rombelUjian?.map((rombelUjian, idx) => {
    listKelas.push({
      label: rombelUjian?.rombel?.nama,
      value: rombelUjian?.id,
    });
  });

  const handleClickDownloadRekapNilai = async () => {
    setBtnState("loading");
    if (formData?.rombelId == "semua") {
      const { data } = await downloadSemuaJadwalUjian({
        tkJadwalUjianId: formData?.rombelId,
        mJadwalUjianId: jadwalUjian?.id,
      });
      if (data) {
        setBtnState("idle");
        window.open(downloadURL + data, "_blank");
        // setTimeout(() => {
        //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
        // }, 4000);
      }
      setBtnState("idle");
      return;
    }
    const { data } = await downloadJadwalUjian({
      tkJadwalUjianId: formData?.rombelId,
      mJadwalUjianId: jadwalId,
    });
    if (data) {
      setBtnState("idle");
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
    setBtnState("idle");
  };

  const handleClickDownloadRekapHasilUjian = async () => {
    setBtnState("loading");
    if (formData?.rombelId == "semua") {
      const { data } = await downloadJawabanJadwalSemuaUjian(
        {
          tkJadwalUjianId: formData?.rombelId,
          mJadwalUjianId: jadwalUjian?.id,
        },
        jadwalUjian?.id
      );
      if (data) {
        setBtnState("idle");
        window.open(downloadURL + data, "_blank");
        // setTimeout(() => {
        //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
        // }, 4000);
      }

      setBtnState("idle");
      return;
    }
    const { data } = await downloadJawabanJadwalUjian(
      {
        tkJadwalUjianId: formData?.rombelId,
        mJadwalUjianId: jadwalId,
      },
      jadwalUjian?.id
    );
    if (data) {
      setBtnState("idle");
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
    setBtnState("idle");
  };

  return (
    <>
      <NewModal
        modalId={`${id}`}
        title={
          <>
            <h4 className="mb-1 fw-extrabold">{`${
              id == "modalRekapHasilUjian" ? "Rekap Hasil Ujian" : "Rekap Nilai"
            }`}</h4>
          </>
        }
        modalSize="md"
        content={
          <>
            <div className="mb-3">
              <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label mb-0"
                >
                  Pilih Kelas
                </label>
              </div>
            </div>
            <div className="unduh-select">
              <SelectShared
                name="Pilih Kelas"
                placeholder="Pilih kelas"
                handleChangeSelect={(e) =>
                  setFormData({ ...formData, rombelId: e.value })
                }
                value={formData?.rombelId}
                options={listKelas}
              />
            </div>
          </>
        }
        submitButton={
          <ReactiveButton
            buttonState={btnState}
            onClick={
              id == "modalRekapHasilUjian"
                ? () => handleClickDownloadRekapHasilUjian()
                : () => handleClickDownloadRekapNilai()
            }
            color={"primary"}
            idleText={"Unduh"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
          />
        }
      />
    </>
  );
};

export default ModalRekapNilai;
