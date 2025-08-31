import Editor from "components/Shared/Editor/Editor";
import NewModal from "components/Shared/NewModal/NewModal";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import ReactDOM from "react-dom";
import useBuatTugas from "hooks/useBuatTugas";
import { useState } from "react";
import toast from "react-hot-toast";
import { uuid } from "uuidv4";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  nilaiSoal: "",
  rubrikKj: [{ id: uuid(), poin: "", indikator: "" }]
}

const ListRubrik = ({ data, index, changeRubrik, deleteRubrik }) => {
  return (
    <div className="rubrik-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
      <div className="d-flex justify-content-between">
        <div
          className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
          style={{
            width: "40px",
            height: "40px",
          }}
        >
          {index+1}
        </div>
        <button
          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
          style={{
            width: "40px",
            height: "40px",
          }}
          onClick={() => deleteRubrik(index)}
        >
          <FaTrashAlt />
        </button>
      </div>
      <div className="w-100 rounded-ss border border-light-secondary-ss p-3 order-lg-2 order-3 mt-lg-0 mt-2">
        <div className="mb-3">
          <label className="form-label">Poin</label>
          <input
            name="poin"
            className="form-control"
            autoComplete="off"
            placeholder="0"
            value={data?.poin}
            type="number"
            onChange={(e) => changeRubrik(index, "poin", parseInt(e.target.value))}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Indikator</label>
          <TextareaAutosize
            className="form-control"
            autoComplete="off"
            style={{
              resize: "none",
              width: "100%",
            }}
            placeholder="Tuliskan indikator rubrik"
            minRows={3}
            name="indikator"
            value={data?.indikator}
            onChange={(e) => changeRubrik(index, "indikator", e.target.value)}
          />
        </div>
      </div>
      <button
        className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
        style={{
          width: "40px",
          height: "40px",
        }}
        onClick={() => deleteRubrik(index)}
      >
        <FaTrashAlt />
      </button>
    </div>
  )
}

const ModalSoalEsai = () => {

  const [formData, setFormData] = useState(initialFormData);
  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  }

  const changeRubrik = (index, key, value) => {
    let newRubrik = [...formData.rubrikKj];
    newRubrik[index][key] = value;
    changeFormData("rubrikKj", newRubrik);
  }

  const deleteRubrik = (deleteIndex) => {
    let newRubrik = [...formData.rubrikKj];
    newRubrik.splice(deleteIndex, 1);
    changeFormData("rubrikKj", newRubrik);
  }

  const clearModalData = () => {
    setFormData(initialFormData);
    window.$(`#editorPertanyaanEsai`).summernote("code", "");
    window.$(`#editorPembahasanEsai`).summernote("code", "");
  }

  const setDataToState = () => {
    if (!window.$(`#editorPertanyaanEsai`).summernote("code")) {
      toast.error("Anda belum memberikan pertanyaan");
      return;
    }

    if (!window.$(`#editorPembahasanEsai`).summernote("code")) {
      toast.error("Anda belum memberikan pembahasan");
      return;
    }

    if (!formData?.nilaiSoal) {
      toast.error("Anda belum memberikan nilai soal");
      return;
    }

    if (!formData?.rubrikKj?.[0]?.poin) {
      toast.error("Anda belum memberikan rubrik poin");
      return;
    }

    if (!formData?.rubrikKj?.[0]?.indikator) {
      toast.error("Anda belum memberikan rubrik indikator");
      return;
    }

    let tempData = {bentuk: "esai"};
    tempData.id = uuid(); // need id to delete soal
    tempData.pertanyaan = window.$(`#editorPertanyaanEsai`).summernote("code");
    tempData.pembahasan = window.$(`#editorPembahasanEsai`).summernote("code");
    tempData.nilaiSoal = formData?.nilaiSoal;
    tempData.rubrikKj = formData?.rubrikKj;

    const newSoal = [...stateBuatTugas.soal, tempData];
    changeStateBuatTugas("soal", newSoal);

    hideModal("ModalSoalEsai");
    toast.success("Data berhasil ditambahkan");
    clearModalData();
  }

  return (
    <NewModal
      modalId="ModalSoalEsai"
      modalSize="xl"
      title={
        <>
          <h5 className="mb-0 fw-bold md-fs-4">
            Buat Soal Pilihan Esai
          </h5>
          <span style={{ fontSize: 14, fontWeight: "normal" }}>
            Isi informasi dibawah untuk membuat soal esai
          </span>
        </>
      }
      content={<>
        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">
            Pertanyaan
          </h5>
          <Editor id="editorPertanyaanEsai" defaultValue="" />
        </div>

        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">
            Pembahasan
          </h5>
          <Editor id="editorPembahasanEsai" defaultValue="" />
        </div>

        <div className="mb-4">
          <label className="form-label">Nilai Soal</label>
          <input
            className="form-control"
            autoComplete="off"
            placeholder="Masukkan nilai soal"
            type="number"
            value={formData?.nilaiSoal}
            onChange={(e) => changeFormData("nilaiSoal", e.target.value)}
          />
        </div>

        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">Rubrik</h5>
            { formData?.rubrikKj?.map((rubrik, index) => <ListRubrik data={rubrik} index={index} key={rubrik?.id} changeRubrik={changeRubrik} deleteRubrik={deleteRubrik} />)}
            <button
              className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
              onClick={() => changeFormData("rubrikKj", [...formData.rubrikKj, { id: uuid(), poin: "", indikator: "" }])}
            >
              <FaPlus className="me-2" />
              Tambah Rubrik
            </button>
        </div>
      </>}
      submitButton={
        <ReactiveButton
          // buttonState={formData.btnBio}
          color={"primary"}
          idleText={"Simpan"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
          onClick={() => setDataToState()}
        />
      }
    />
  )
}

const ModalPortalSoalEsai = props => {
  let sharedModal = document.querySelectorAll(
    `[id^="shared-modal"]`
  )[0];

  return ReactDOM.createPortal(
    <ModalSoalEsai {...props} />,
    sharedModal
  );
};

export default ModalPortalSoalEsai;