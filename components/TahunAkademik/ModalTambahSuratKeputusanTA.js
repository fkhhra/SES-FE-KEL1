import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import {
  FaCalendarDay,
  FaClock,
  FaLink,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaTimes,
  FaTasks,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import NewModal from "../Shared/NewModal/NewModal";
import UploadSuratMasuk from "../Shared/UploadBanner/UploadSuratMasuk";
import Editor from "../Shared/Editor/Editor";
import InputFile from "../Shared/InputFile/InputFile";
import ModalStep from "components/Shared/ModalStep/ModalStep";
import UploadFile from "components/Shared/UploadFile/UploadFile";
import Avatar from "components/Shared/Avatar/Avatar";
import { getListGuruSuratKeputusan, postSuratKeputusan, updateSuratKeputusan } from "client/SuratKeputusanClient";
import { useRef } from "react";
import { useDebounce } from "use-debounce";
import toast from "react-hot-toast";
import { uploadFile } from "client/uploadFileClient";
import { hideModal } from "utilities/ModalUtils";
import useEditModal from "hooks/useEditModal";

const initialFormData = {
  nama: "",
  file: "",
  userId: []
}

const ModalTambahSuratKeputusanTA = ({
  _getSuratKeputusan
}) => {

  const editModalData = useEditModal(state => state.editModal?.modalSuratKeputusanTa);

  const [buttonState, setButtonState] = useState("idle");
  const [listGuru, setListGuru] = useState([]);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState("");
  const [pilihSemuaPenerima, setPilihSemuaPenerima] = useState(false);

  const [file, setFile] = useState("");

  const [debounceSearch] = useDebounce(search, 400);

  const changeFormData = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onChangePilihanPenerima = (e, penerima) => {
    if (e.target.checked) {
      changeFormData("userId", [...formData?.userId, penerima?.id]);
    } else {
      changeFormData("userId", formData?.userId?.filter(id => id !== penerima?.id));
    }
  }

  const onClickPilihSemuaPenerima = (e) => {
    if (listGuru?.length > 0) {
      if (e.target.checked) {
        changeFormData("userId", listGuru?.map(guru => guru?.id));
        
      } else {
        changeFormData("userId", []);
      }
  
      setPilihSemuaPenerima(e.target.checked);
    }
  }

  const _getListGuruSuratKeputusan = async() => {
    let params = { search: search }
    const { data } = await getListGuruSuratKeputusan(params);
    if (data) {
      setListGuru(data?.guru);
    }
  }

  const onSubmitModal = async () => {
    setButtonState("loading");
    const { data } = editModalData?.id ? await updateSuratKeputusan(editModalData?.id, formData) : await postSuratKeputusan(formData);
    if (data) {
      hideModal("modal-surat-keputusan-ta");
      toast.success(data?.message);
      _getSuratKeputusan();
      setFormData(initialFormData);
      setFile("");
      setCurrent(0);
    }
    setButtonState("idle");
  }

  const uploadFileToServer = async (e) => {
    if (e.target.files[0].size / 100000000 > 1) {
      toast.error("File yang dimasukan Melebihi batas 100MB");
      return;
    }
    const fileUrl = await uploadFile(e.target.files[0]);
    if (fileUrl) {
      changeFormData("file", fileUrl);
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (editModalData) {
      setFormData({
        nama: editModalData?.nama,
        file: editModalData?.file,
        userId: editModalData?.suratUser?.map(({ user }) => user?.id) || []
      });
      setFile(editModalData?.file);
    } else {
      setFormData(initialFormData);
    }
  }, [editModalData]);

  useEffect(() => {
    _getListGuruSuratKeputusan();
  }, [debounceSearch]);

  return (
    <>
      <ModalStep
        terpilih={formData?.userId?.length || 0}
        isModalSuratKeputusan={true}
        modalClass="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        buttonSubmit={
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
            onClick={() => onSubmitModal()}
          />
        }
        isNext={true}
        modalId="modal-surat-keputusan-ta"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {`${editModalData ? "Ubah" : "Buat"} Surat Keputusan`}
            </h4>
            <span className="fs-6 fw-normal">
              {`Isi informasi dibawah untuk ${editModalData ? "mengubah" : "menambah"} surat keputusan`}
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={[
          {
            title: "Informasi Surat",
            content: (
              <>
                <div className="mb-3 mt-4">
                  <label htmlFor="nama" className="form-label">
                    Nama
                  </label>
                  <input
                    className="form-control"
                    autoComplete="off"
                    id="nama"
                    placeholder="Masukkan Nama Surat Keputusan"
                    onChange={(e) => changeFormData("nama", e.target.value)}
                    value={formData.nama}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label mb-0"
                  >
                    Surat Keputusan
                  </label>
                </div>
                <UploadFile
                  handleChange={(e) => uploadFileToServer(e)}
                  file={file}
                  deleteFile={() => { changeFormData("file", ""); setFile(""); }}
                />
              </>
            ),
          },
          {
            title: "Pembagian Surat",
            content: (
              <>
                <div className="mb-3 mt-4">
                  <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap">
                    <label className="form-label mb-0">Pilih Penerima</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3 "
                        id="exampleFormControlInput1"
                        placeholder="Cari guru"
                        autoComplete="off"
                        style={{
                          width: "200px",
                          height: "35px",
                        }}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="form-check-ragu-ragu position-relative d-flex flex-column">
                        <input
                          className="form-check-input form-check-input-salah me-3 p-2 rounded-circle position-absolute d-inline-block "
                          type="checkbox"
                          id="checkbox-select-all"
                          style={{
                            width: "14px",
                            height: "14px",
                            top: "15%",
                            left: "1em",
                            transition: ".3s",
                          }}
                          onChange={(e) => onClickPilihSemuaPenerima(e)}
                          checked={pilihSemuaPenerima}
                        />
                        <label
                          className="form-check-label btn btn-warning btn-warning-ss rounded-pill p-0 d-flex justify-content-center align-items-center fw-bold fs-12-ss ps-3"
                          style={{ height: "35px", width: "137px" }}
                          for="checkbox-select-all"
                        >
                          Pilih Semua
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  { listGuru?.map(guru => (
                    <div className="kuis-component form-check-ss position-relative mb-3">
                      <input
                        className="form-check-input form-check-ambil-soal position-absolute pointer"
                        type="checkbox"
                        style={{
                          transform: "translateY(-50%)",
                          top: "50%",
                          right: "1em",
                          width: "24px",
                          height: "24px",
                        }}
                        id={`checkbox-guru-${guru?.id}`}
                        checked={formData?.userId?.includes(guru?.id)}
                        onChange={(e) => onChangePilihanPenerima(e, guru)}
                      />
                      <label
                        className="kuis-card form-check-label rounded-ss border border-secondary border-light-secondary-ss p-3 w-100 pointer"
                        for={`checkbox-guru-${guru?.id}`}
                      >
                        <div className="d-flex flex-grow-1 pe-5 align-items-center">
                          <Avatar name={`${guru?.nama}`} size={45} />
                          <div className="ms-4">
                            <h6 className="mb-0 fw-bold color-dark">
                              {guru?.nama}
                            </h6>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ),
          },
        ]}
      />
      <NewModal
        modalId="modalInstruksiUjian"
        title={
          <>
            <h4 className="mb-0 fw-extrabold">kelas</h4>
          </>
        }
        content={<></>}
        submitButton={
          <ReactiveButton
            // buttonState={buttonState}
            color={"primary"}
            idleText={"Mulai Ujian"}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            className="text-decoration-none btn btn-primary"
            // onClick={() => onSubmitModal()}
          />
        }
      />
    </>
  );
};

export default ModalTambahSuratKeputusanTA;
