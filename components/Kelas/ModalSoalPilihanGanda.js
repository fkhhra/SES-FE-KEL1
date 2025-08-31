import NewModal from "../Shared/NewModal/NewModal"
import ReactDOM from "react-dom";
import Editor from "../Shared/Editor/Editor";
import { useState } from "react";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import SelectShared from "../Shared/SelectShared/SelectShared";
import ReactiveButton from "reactive-button";
import useBuatTugas from "hooks/useBuatTugas";
import { hideModal } from "utilities/ModalUtils";
import toast from "react-hot-toast";
import { uuid } from "uuidv4";

const opsiJawabanArray = ["A", "B", "C", "D", "E"];

const initialFormData = {
  kjPg: "",
  nilaiSoal: ""
}

const initialListOpsiJawaban = ["A"];

const ModalSoalPilihanGanda = ({ editId }) => {

  const [listOpsiJawaban, setListOpsiJawaban] = useState(initialListOpsiJawaban);
  const [formData, setFormData] = useState(initialFormData);

  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const tambahPilihanJawaban = () => {
    setListOpsiJawaban([...listOpsiJawaban, opsiJawabanArray[listOpsiJawaban.length]]);
  }

  const hapusPilihanJawaban = (opsi) => {
    const newOpsi = listOpsiJawaban.filter(op => op !== opsi);
    setListOpsiJawaban(newOpsi);
  }

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  }

  const showBtnTambahPilihanJawaban = listOpsiJawaban[listOpsiJawaban.length - 1] !== "E";

  const clearModalData = () => {
    setFormData(initialFormData);
    setListOpsiJawaban(initialListOpsiJawaban);
    window.$(`#editorPertanyaanPilihanGanda`).summernote("code", "");
    window.$(`#editorJawabanPilihanGanda-A`).summernote("code", "")
    window.$(`#editorJawabanPilihanGanda-B`).summernote("code", "")
    window.$(`#editorJawabanPilihanGanda-C`).summernote("code", "")
    window.$(`#editorJawabanPilihanGanda-D`).summernote("code", "")
    window.$(`#editorJawabanPilihanGanda-E`).summernote("code", "")
    window.$(`#editorPembahasanPilihanGanda`).summernote("code", "")
  }

  const setDataToState = () => {
    if (!window.$(`#editorPertanyaanPilihanGanda`).summernote("code")) {
      toast.error("Anda belum memberikan pertanyaan");
      return;
    }

    if (!window.$(`#editorJawabanPilihanGanda-A`).summernote("code")) {
      toast.error("Anda belum memberikan pilihan jawaban");
      return;
    }

    if (!formData?.kjPg) {
      toast.error("Anda belum memberikan kunci jawaban");
      return;
    }

    if (!window.$(`#editorPembahasanPilihanGanda`).summernote("code")) {
      toast.error("Anda belum memberikan pembahasan");
      return;
    }

    if (!formData?.nilaiSoal) {
      toast.error("Anda belum memberikan nilai soal");
      return;
    }

    let tempData = {bentuk: "pg"};
    tempData.id = uuid(); // need id to delete soal
    tempData.pertanyaan = window.$(`#editorPertanyaanPilihanGanda`).summernote("code");
    tempData.jawabanA = window.$(`#editorJawabanPilihanGanda-A`).summernote("code")
    tempData.jawabanB = window.$(`#editorJawabanPilihanGanda-B`).summernote("code")
    tempData.jawabanC = window.$(`#editorJawabanPilihanGanda-C`).summernote("code")
    tempData.jawabanD = window.$(`#editorJawabanPilihanGanda-D`).summernote("code")
    tempData.jawabanE = window.$(`#editorJawabanPilihanGanda-E`).summernote("code")
    tempData.pembahasan = window.$(`#editorPembahasanPilihanGanda`).summernote("code")
    tempData.kjPg = formData?.kjPg;
    tempData.nilaiSoal = formData?.nilaiSoal;

    const newSoal = [...stateBuatTugas.soal, tempData];
    changeStateBuatTugas("soal", newSoal);

    hideModal("ModalSoalPilihanGanda");
    toast.success("Data berhasil ditambahkan");
    clearModalData();
  }

  return (
    <NewModal
      modalId="ModalSoalPilihanGanda"
      modalSize="xl"
      title={
        <>
          <h5 className="mb-0 fw-bold md-fs-4">
            {" "}
            {editId ? "Edit" : "Buat"} Soal Pilihan Ganda
          </h5>
          <span style={{ fontSize: 14, fontWeight: "normal" }}>
            Isi informasi dibawah untuk membuat soal pilihan ganda
          </span>
        </>
      }
      content={<>
        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">
            Pertanyaan
          </h5>
          <Editor id="editorPertanyaanPilihanGanda" defaultValue="" />
        </div>

        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">
            Jawaban
          </h5>
          { listOpsiJawaban.map((opsi, index) => {

            const showBtnHapusPilihanJawaban = listOpsiJawaban.length - 1 === index && listOpsiJawaban[listOpsiJawaban.length - 1] !== "A";

            return (
              <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3" key={`${opsi}-${index}`}>
                <div className="d-flex justify-content-between">
                  <div
                    className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    {opsi}
                  </div>
                  { showBtnHapusPilihanJawaban && (
                    <button
                      className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                      onClick={() => hapusPilihanJawaban(opsi)}
                    >
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
                <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                  <Editor id={`editorJawabanPilihanGanda-${opsi}`} defaultValue="" />
                </div>
                { showBtnHapusPilihanJawaban && (
                  <button
                    className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={() => hapusPilihanJawaban(opsi)}
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            )
          })}
          { showBtnTambahPilihanJawaban && (
            <button
              className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
              onClick={() => tambahPilihanJawaban()}
            >
              <FaPlus className="me-2" />
              Tambah Pilihan Jawaban
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Jawaban Benar</label>
          <SelectShared
            name="kepemilikan"
            placeholder="Pilih jawaban benar"
            handleChangeSelect={(e) => changeFormData("kjPg", e.value)}
            value={formData?.kjPg}
            options={listOpsiJawaban.map(opsi => ({ label: opsi, value: opsi }))}
          />
        </div>

        <div className="mb-4">
          <h5 className="fs-18-ss fw-bold color-dark mb-4">
            Pembahasan
          </h5>
          <Editor id="editorPembahasanPilihanGanda" defaultValue="" />
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

const ModalPortalSoalPilihanGanda = props => {
  let sharedModal = document.querySelectorAll(
    `[id^="shared-modal"]`
  )[0];

  return ReactDOM.createPortal(
    <ModalSoalPilihanGanda {...props} />,
    sharedModal
  );
};

export default ModalPortalSoalPilihanGanda;