import { DatePicker, TimePicker } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";
import { editTimeline, postTimeline } from "client/TimelineClient";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

import toast from "react-hot-toast";
import useEditModal from "hooks/useEditModal";

import ReactiveButton from "reactive-button";
import NewModal from "components/Shared/NewModal/NewModal";
import SelectShared from "components/Shared/SelectShared/SelectShared";

const initialFormData = {
  materi: [],
  tanggalPembagian: "",
  waktuPembagian: "",
};

const ModalBagikanMateri = ({ detailRombel, getDetailRombelData }) => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);

  const editModalData =
    useEditModal((state) => state.editModal?.ModalBagikanMateri) || null;

  const isEdit = editModalData !== null;

  const listBab = detailRombel?.analisisMateri?.materi?.bab;
  const babOption = listBab?.map((bab, index) => ({
    value: bab,
    label: `Bab ${index + 1} - ${bab?.judul}`,
  }));

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const changePilihanMateri = (e, materi) => {
    if (e.target.checked) {
      changeFormData("materi", [...formData?.materi, materi?.id]);
    } else {
      changeFormData(
        "materi",
        formData?.materi?.filter((id) => id !== materi?.id)
      );
    }
  };

  const saveMateri = async () => {
    let body = {
      materi: formData.materi,
      mJadwalMengajarId: router.query.id,
      tanggalPembagian: `${momentPackage(formData.tanggalPembagian).format(
        "YYYY-MM-DD"
      )} ${momentPackage(formData.waktuPembagian).format("HH:mm:ss")}`,
      tipe: "materi",
    };

    const { data } = isEdit
      ? await editTimeline(editModalData?.materiId, body)
      : await postTimeline(body);
    if (data) {
      toast.success(data?.message);
      hideModal("ModalBagikanMateri");
      getDetailRombelData();
    }
  };

  const onClickPilihSemuaMateri = () => {
    if (formData?.bab?.topik?.length > 0) {
      changeFormData(
        "materi",
        formData?.bab?.topik?.map((materi) => materi?.id)
      );
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        tanggalPembagian: momentPackage(editModalData.tanggalPembagian),
        waktuPembagian: momentPackage(editModalData.tanggalPembagian),
        materi: [editModalData?.materi?.[0]?.id],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  return (
    <NewModal
      modalId="ModalBagikanMateri"
      modalSize={isEdit ? "md" : "xl"}
      title={
        <>
          <h4 className="mb-0 fw-extrabold">
            {isEdit ? "Ubah Materi" : "Bagikan Materi"}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${
              isEdit ? "mengubah" : "membagikan"
            } materi`}
          </span>
        </>
      }
      content={
        <>
          <div className="row mb-4 mt-2">
            <div className="col-md-6 mb-3 mt-md-0 mb-md-0">
              <label className="form-label">Tanggal Pembagian</label>
              <DatePicker
                onChange={(date) => changeFormData("tanggalPembagian", date)}
                placeholder="Pilih Tanggal"
                className="form-control"
                autoComplete="off"
                value={formData?.tanggalPembagian}
                format="DD-MM-YYYY"
              />
            </div>

            <div className="col-md-6 mt-0">
              <label className="form-label">Waktu Pembagian</label>
              <TimePicker
                format="HH:mm"
                onChange={(date) => changeFormData("waktuPembagian", date)}
                className="form-control"
                autoComplete="off"
                placeholder="--:--"
                value={formData?.waktuPembagian}
              />
            </div>
          </div>

          {!isEdit && (
            <div className="mb-4">
              <label className="form-label">Daftar BAB</label>
              <SelectShared
                placeholder="Pilih BAB"
                handleChangeSelect={(e) => changeFormData("bab", e.value)}
                value={formData?.bab}
                options={babOption}
              />
            </div>
          )}

          {!isEdit && (
            <div className="mb-4">
              <div className="form-label">Daftar Materi</div>
              {formData?.bab?.topik?.length > 0 ? (
                formData?.bab?.topik?.map((materi, index) => (
                  <div
                    className="kuis-component form-check-ss position-relative mb-3"
                    key={`${index}-${new Date().getTime()}`}
                  >
                    <input
                      className="form-check-input form-check-ambil-soal position-absolute"
                      type="checkbox"
                      style={{
                        top: "50%",
                        transform: "translateY(-50%)",
                        right: "1em",
                        width: "30px",
                        height: "30px",
                      }}
                      checked={formData?.materi?.includes(materi?.id)}
                      onChange={(e) => changePilihanMateri(e, materi)}
                      id={`checkbox-materi-${materi?.id}`}
                    />
                    <label
                      className="kuis-card form-check-label rounded-ss border border-secondary border-light-secondary-ss p-3 w-100 pointer"
                      htmlFor={`checkbox-materi-${materi?.id}`}
                    >
                      <div className="d-flex align-items-md-center flex-lg-nowrap flex-md-row flex-column flex-wrap">
                        <div
                          className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fw-extrabold color-dark me-3 p-3"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row flex-grow-1 pe-lg-5">
                          <div className="soal-content p-md-1 p-0 m-md-0 mt-3 mb-4 text-break">
                            <p className="mb-0 color-secondary pe-3 dangerous-html">
                              {materi?.judul}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))
              ) : (
                <div>Tidak ada materi</div>
              )}
            </div>
          )}
        </>
      }
      leftButton={
        <>
          {!isEdit && (
            <div className="d-flex align-items-center">
              <div className="color-primary px-4 py-1 fs-16-ss fw-bold bg-soft-primary rounded-pill">
                {formData?.materi?.length} Materi Terpilih
              </div>
              <button
                className="btn btn-ss btn-outline-warning btn-outline-warning-ss fw-bold fs-14-ss rounded-pill me-2"
                onClick={onClickPilihSemuaMateri}
              >
                {" "}
                <FaTasks className="mb-1 me-2" /> Pilih Semua
              </button>
            </div>
          )}
        </>
      }
      submitButton={
        <ReactiveButton
          buttonState={"idle"}
          color={"primary"}
          idleText={isEdit ? "Ubah" : "Bagikan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={saveMateri}
        />
      }
    />
  );
};

export default ModalBagikanMateri;
