import { editSoalUjian, postSoalUjian } from "client/SoalUjianClient";
import ModalStep from "components/Shared/ModalStep/ModalStep";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { hideModal } from "utilities/ModalUtils";
import { Select } from "antd";
import Editor from "components/Shared/Editor/Editor";
import { alphabet } from "utilities/HelperUtils";
import { FaPen, FaPlus, FaTrashAlt, FaLink, FaPaperclip } from "react-icons/fa";
import AudioPlayer from "components/Shared/AudioPlayer/AudioPlayer";
import EmptyStateFile from "components/Shared/EmptyState/EmptyStateFile";
import InputFile from "components/Shared/InputFile/InputFile";
import { getInitialFormDataSoal } from "utilities/UjianUtils";
import useUjian from "hooks/useUjian";
import { InformasiSoalUjian } from "./SoalUjian/InformasiSoal";

const { Option } = Select;

const initialRubrikKj = [
  {
    poin: "",
    indikator: "",
    id: Math.random(),
  },
];

const ModalBuatSoalUjian = ({
  formData,
  setFormData,
  detailUjianData,
  getDetailUjianData,
  id,
  sekolah,
}) => {
  const {
    soalMenjodohkan,
    setSoalMenjodohkan,

    pilihanMenjodohkan,
    setPilihanMenjodohkan,

    pilihanJawabanPG,
    setPilihanJawabanPG,

    rubrikKj,
    setRubrikKj,
  } = useUjian();

  const {
    levelKognitif,
    bentukSoal,
    ujian,
    jumlahSoalEsai,
    jumlahSoalPg,
    tingkat,
    kontenMateri,
    konteksMateri,
    prosesKognitif,
    totalNilai,
  } = detailUjianData;

  const initialFormData = getInitialFormDataSoal(id);

  const [current, setCurrent] = useState(0);
  const [buttonState, setButtonState] = useState("idle");

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    window.$(`#editorPertanyaan`).summernote("destroy");

    setCurrent(current - 1);
  };

  const uploadFileToServer = async (e, data) => {
    if (data) {
      handleChangeForm(e, data);
    }
  };

  const handleChangeForm = (e, data, type, idx) => {
    if (type === "soal-menjodohkan") {
      const copy = [...soalMenjodohkan];
      copy[idx][e.target.name] = e.target.value;
      setSoalMenjodohkan(copy);
      return;
    }

    if (data) {
      setFormData({
        ...formData,
        [e.target.name]: data,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleRemoveRubrik = (id) => {
    if (rubrikKj.length === 1) return;

    const filterRubrik = rubrikKj.filter((val) => val.id !== id);
    setRubrikKj([...filterRubrik]);
  };

  const handleAddPilihanRubrik = () => {
    setRubrikKj([
      ...rubrikKj,
      {
        poin: "",
        indikator: "",
        id: Math.random(),
      },
    ]);
  };

  const handleChangeRubrik = (e, index, parseInteger) => {
    let editedRubrik = [...rubrikKj];
    let currentRubrik = editedRubrik[index];

    if (e.target.name) {
      currentRubrik[e.target.name] = parseInteger
        ? parseInt(e.target.value)
        : e.target.value;
    }

    setRubrikKj(editedRubrik);
  };

  const handleRemoveSoalMenjodohkan = (index) => {
    if (index != 0)
      setSoalMenjodohkan(soalMenjodohkan.filter((val, idx) => idx != index));
  };

  const handlePostSoalUjianData = async () => {
    setButtonState("loading");
    if (!formData.nilaiSoal && formData.bentuk != "menjodohkan") {
      toast.error("Nilai Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    } else if (
      !formData.kjPg &&
      !formData.kjUraian &&
      !formData.jawabanPgKompleks &&
      !formData.kjUraian &&
      !formData.jawabanBenar &&
      !formData.soalMenjodohkan.length &&
      formData.bentuk != "esai" &&
      formData.bentuk != "menjodohkan"
    ) {
      toast.error("Jawaban Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    } else if (!window.$(`#editorPertanyaan`).summernote("code")) {
      toast.error("Pertanyaan Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    }

    const payload = {
      ...formData,
      nilaiSoal: formData.bentuk === "menjodohkan" ? useUjian.getState().totalPoin : formData.nilaiSoal,

      pertanyaan: window.$(`#editorPertanyaan`).summernote("code"),
      jawabanA:
        typeof window.$(`#editorJawabanPGA`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGA`).summernote("code")
          : " ",
      jawabanB:
        typeof window.$(`#editorJawabanPGB`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGB`).summernote("code")
          : " ",
      jawabanC:
        typeof window.$(`#editorJawabanPGC`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGC`).summernote("code")
          : " ",
      jawabanD:
        typeof window.$(`#editorJawabanPGD`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGD`).summernote("code")
          : " ",
      jawabanE:
        typeof window.$(`#editorJawabanPGE`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGE`).summernote("code")
          : " ",
      pembahasan:
        typeof window.$(`#editorPembahasan`).summernote("code") == "string"
          ? window.$(`#editorPembahasan`).summernote("code")
          : " ",
      rubrikKj: rubrikKj,
    };

    if (formData.bentuk === "menjodohkan") {
      let pilihanMenjodohkanData = [];
      let soalMenjodohkanData = [];

      pilihanMenjodohkan?.map((pilihan, idx) => {
        pilihanMenjodohkanData.push(
          window.$(`#editorMenjodohkan-${alphabet[idx]}`).summernote("code")
        );
      });

      soalMenjodohkan?.map((soalData, idx) => {
        soalMenjodohkanData.push({
          ...soalData,
          soal: window
            .$(`#editor-pertanyaan-menjodohkan-${idx}`)
            .summernote("code"),
          pembahasan: window
            .$(`#editor-pembahasan-menjodohkan-${idx}`)
            .summernote("code"),
        });
      });

      payload.pilihanMenjodohkan = pilihanMenjodohkanData;
      payload.soalMenjodohkan = soalMenjodohkanData;
      payload.pertanyaan = formData.pertanyaan;
      
    }
    const { data, error } = formData?.soalEdit
      ? await editSoalUjian(formData?.soalUjianId, payload)
      : await postSoalUjian(payload);

    if (data) {
      hideModal("modalBuatSoalUjian");
      window.$(`#editorPertanyaan`).summernote("destroy");
      window.$(`#editorPembahasan`).summernote("destroy");
      window.$(`#editorJawabanPGA`).summernote("destroy");
      window.$(`#editorJawabanPGB`).summernote("destroy");
      window.$(`#editorJawabanPGC`).summernote("destroy");
      window.$(`#editorJawabanPGD`).summernote("destroy");
      window.$(`#editorJawabanPGE`).summernote("destroy");
      window.$(`#editorPembahasanPG`).summernote("destroy");
      window.$(`#editorPembahasanEsai`).summernote("destroy");
      window.$(`#editorPertanyaanEsai`).summernote("destroy");
      toast.success(data?.message);
      setFormData(initialFormData);
      setRubrikKj(initialRubrikKj);
      setPilihanJawabanPG([0]);
      getDetailUjianData();
      setButtonState("success");
      setCurrent(0);
      // router.reload();
    } else {
      toast.error(error?.message || error?.[0]?.message || "Coba Lagi");
      setButtonState("error");
    }
  };

  useEffect(() => {
    if (current == 0) window.$(`#editorPertanyaan`).summernote("destroy");
  }, [current]);

  return (
    <ModalStep
      modalClass="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
      buttonSubmit={
        <ReactiveButton
          onClick={handlePostSoalUjianData}
          buttonState={buttonState}
          color={"primary"}
          idleText={formData.soalEdit ? "Ubah Soal" : "Buat Soal"}
          loadingText={"Diproses"}
          successText={"Berhasil"}
          errorText={"Gagal"}
          type={"button"}
          data-bs-dismiss="modal"
          className={"btn btn-primary"}
        />
      }
      isNext={true}
      modalId="modalBuatSoalUjian"
      title={
        <>
          <h4 className="mb-1 fw-extrabold">Buat Soal</h4>
          <span className="fs-6 fw-normal">
            Isi informasi dibawah untuk membuat soal
          </span>
        </>
      }
      current={current}
      next={next}
      prev={prev}
      onClose={() => {
        setCurrent(0);
        window.$(`#editorPertanyaan`).summernote("destroy");
      }}
      steps={[
        {
          title: "Isi Informasi Soal",
          content: (
            <InformasiSoalUjian
              handleChangeForm={handleChangeForm}
              formData={formData}
              setFormData={setFormData}
              sekolah={sekolah}
            />
          ),
        },
        {
          title: "Buat Soal",
          content: (
            <>
              {/* Buat Soal Pilihan Ganda Start */}
              {(formData?.bentuk === "pg" ||
                formData?.bentuk === "pg_kompleks") && (
                <>
                  {formData?.radioYa && (
                    <div className="mb-4 mt-4">
                      <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                        <h6 className="color-dark fw-bold fs-18-ss">
                          File Audio
                        </h6>
                        <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                          <label
                            htmlFor="uploadAudio"
                            className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                          >
                            <FaPaperclip className="me-2" />
                            <p className="mb-0">Unggah File</p>
                          </label>
                          <InputFile
                            name="audio"
                            id="uploadAudio"
                            accept="audio/"
                            onChange={uploadFileToServer}
                          />
                          <button
                            type="button"
                            className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#modalTautanLinkAudio"
                          >
                            <FaLink className="me-2" />
                            Tautan Link
                          </button>
                        </div>
                      </div>
                      {formData?.audio ? (
                        <AudioPlayer src={formData?.audio} />
                      ) : (
                        <EmptyStateFile type="music" />
                      )}
                    </div>
                  )}
                  <div className="my-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    {current == 1 ? (
                      <Editor
                        id="editorPertanyaan"
                        defaultValue={formData?.pertanyaan}
                        soal
                      />
                    ) : null}
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Jawaban
                    </h5>
                    {pilihanJawabanPG?.map((d, idx) => {
                      return (
                        <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                          <div className="d-flex justify-content-between">
                            <div
                              className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                            >
                              {alphabet[idx]}
                            </div>
                            {pilihanJawabanPG[pilihanJawabanPG.length - 1] ==
                              d && (
                              <button
                                className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                                onClick={() =>
                                  setPilihanJawabanPG(
                                    pilihanJawabanPG.filter((e) => {
                                      return e !== d;
                                    })
                                  )
                                }
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                              >
                                <FaTrashAlt />
                              </button>
                            )}
                          </div>
                          <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                            <Editor
                              id={`editorJawabanPG${alphabet[idx]}`}
                              defaultValue={
                                formData?.[`jawaban${alphabet[idx]}`]
                              }
                              soal
                            />
                          </div>
                          {pilihanJawabanPG[pilihanJawabanPG.length - 1] ==
                            d && (
                            <button
                              className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                              onClick={() =>
                                setPilihanJawabanPG(
                                  pilihanJawabanPG.filter((e) => {
                                    return e !== d;
                                  })
                                )
                              }
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {pilihanJawabanPG.length < 5 && (
                      <button
                        className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                        onClick={() =>
                          setPilihanJawabanPG([
                            ...pilihanJawabanPG,
                            Math.max(...pilihanJawabanPG) + 1,
                          ])
                        }
                      >
                        <FaPlus className="me-2" />
                        Tambah Pilihan Jawaban
                      </button>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Jawaban Benar</label>
                    {formData?.bentuk === "pg" ? (
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        placeholder="Pilih jawaban benar"
                        name="kjPg"
                        value={formData.kjPg}
                        onChange={handleChangeForm}
                      >
                        <option hidden>Pilih jawaban benar</option>
                        {pilihanJawabanPG?.map((d, idx) => {
                          return (
                            <option value={alphabet[idx]}>
                              Jawaban {alphabet[idx]}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <Select
                        mode="multiple"
                        value={formData.jawabanPgKompleks}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            jawabanPgKompleks: e,
                          })
                        }
                        placeholder="Pilih Kelas.."
                        style={{ width: "100%" }}
                        maxTagCount="responsive"
                      >
                        {pilihanJawabanPG?.map((d, idx) => {
                          return (
                            <Option value={alphabet[idx]}>
                              Jawaban {alphabet[idx]}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor
                      id="editorPembahasan"
                      defaultValue={formData?.pembahasan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nilai Soal</label>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan nilai soal"
                      name="nilaiSoal"
                      value={formData.nilaiSoal}
                      onChange={handleChangeForm}
                    />
                  </div>
                </>
              )}
              {/* Buat Soal Pilihan Ganda End */}

              {/* Buat Soal Esai Start */}
              {formData?.bentuk === "esai" && (
                <>
                  {formData?.radioYa && (
                    <div className="mb-4 mt-4">
                      <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                        <h6 className="color-dark fw-bold fs-18-ss">
                          File Audio
                        </h6>
                        <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                          <label
                            htmlFor="uploadAudio"
                            className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                          >
                            <FaPaperclip className="me-2" />
                            <p className="mb-0">Unggah File</p>
                          </label>
                          <InputFile
                            name="audio"
                            id="uploadAudio"
                            accept="audio/"
                            onChange={uploadFileToServer}
                          />
                          <button
                            type="button"
                            className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#modalTautanLinkAudio"
                          >
                            <FaLink className="me-2" />
                            Tautan Link
                          </button>
                        </div>
                      </div>
                      {formData?.audio ? (
                        <AudioPlayer src={formData?.audio} />
                      ) : (
                        <EmptyStateFile type="music" />
                      )}
                    </div>
                  )}
                  <div className="my-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    <Editor
                      id="editorPertanyaan"
                      defaultValue={formData?.pertanyaan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor
                      id="editorPembahasan"
                      defaultValue={formData?.pembahasan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nilai Soal</label>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan nilai soal"
                      value={formData.nilaiSoal}
                      name="nilaiSoal"
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">Rubrik</h5>
                    {rubrikKj?.map((rubrik, idx) => (
                      <div className="rubrik-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                        <div className="d-flex justify-content-between">
                          <div
                            className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            {idx + 1}
                          </div>
                          <button
                            className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => handleRemoveRubrik(rubrik?.id)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                        <div className="w-100 rounded-ss border border-light-secondary-ss p-3 order-lg-2 order-3 mt-lg-0 mt-2">
                          <div className="mb-3">
                            <label className="form-label">Poin</label>
                            <input
                              type="number"
                              className="form-control"
                              autoComplete="off"
                              placeholder="Masukkan poin untuk rubrik"
                              value={rubrik.poin}
                              name="poin"
                              onChange={(e) => handleChangeRubrik(e, idx, true)}
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
                              value={rubrik.indikator}
                              onChange={(e) => handleChangeRubrik(e, idx)}
                            />
                          </div>
                        </div>
                        <button
                          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => handleRemoveRubrik(rubrik?.id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                      onClick={() => handleAddPilihanRubrik()}
                    >
                      <FaPlus className="me-2" />
                      Tambah Rubrik
                    </button>
                  </div>
                </>
              )}
              {/* Buat Soal Esai End */}

              {/* Buat Soal Isian Start */}
              {formData?.bentuk === "isian" && (
                <>
                  {formData?.radioYa && (
                    <div className="mb-4 mt-4">
                      <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                        <h6 className="color-dark fw-bold fs-18-ss">
                          File Audio
                        </h6>
                        <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                          <label
                            htmlFor="uploadAudio"
                            className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                          >
                            <FaPaperclip className="me-2" />
                            <p className="mb-0">Unggah File</p>
                          </label>
                          <InputFile
                            name="audio"
                            id="uploadAudio"
                            accept="audio/"
                            onChange={uploadFileToServer}
                          />
                          <button
                            type="button"
                            className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#modalTautanLinkAudio"
                          >
                            <FaLink className="me-2" />
                            Tautan Link
                          </button>
                        </div>
                      </div>
                      {formData?.audio ? (
                        <AudioPlayer src={formData?.audio} />
                      ) : (
                        <EmptyStateFile type="music" />
                      )}
                    </div>
                  )}
                  <div className="my-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    <Editor
                      id="editorPertanyaan"
                      defaultValue={formData?.pertanyaan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor
                      id="editorPembahasan"
                      defaultValue={formData?.pembahasan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nilai Soal</label>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan nilai soal"
                      value={formData?.nilaiSoal}
                      name="nilaiSoal"
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Jawaban Benar</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan Jawaban Benar"
                      value={formData?.jawabanBenar}
                      name="jawabanBenar"
                      onChange={handleChangeForm}
                    />
                  </div>
                </>
              )}
              {/* Buat Soal Isian End */}

              {/* Buat Soal Uraian Start */}
              {formData?.bentuk === "uraian" && (
                <>
                  {formData?.radioYa && (
                    <div className="mb-4 mt-4">
                      <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                        <h6 className="color-dark fw-bold fs-18-ss">
                          File Audio
                        </h6>
                        <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                          <label
                            htmlFor="uploadAudio"
                            className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                          >
                            <FaPaperclip className="me-2" />
                            <p className="mb-0">Unggah File</p>
                          </label>
                          <InputFile
                            name="audio"
                            id="uploadAudio"
                            accept="audio/"
                            onChange={uploadFileToServer}
                          />
                          <button
                            type="button"
                            className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                            data-bs-toggle="modal"
                            data-bs-target="#modalTautanLinkAudio"
                          >
                            <FaLink className="me-2" />
                            Tautan Link
                          </button>
                        </div>
                      </div>
                      {formData?.audio ? (
                        <AudioPlayer src={formData?.audio} />
                      ) : (
                        <EmptyStateFile type="music" />
                      )}
                    </div>
                  )}
                  <div className="my-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    <Editor
                      id="editorPertanyaan"
                      defaultValue={formData.pertanyaan}
                      soal
                    />
                  </div>
                  <div className="mb-4">
                    <d className="d-flex justify-content-between align-items-center">
                      <h5 className="fs-18-ss fw-bold color-dark mb-0">
                        Jawaban Opsi
                      </h5>
                    </d>
                  </div>
                  <div className="mb-4">
                    <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-12-ss fw-extrabold color-primary mb-3 d-inline-block">
                      Opsi 1
                    </h6>
                    <TextareaAutosize
                      className="form-control"
                      autoComplete="off"
                      style={{
                        resize: "none",
                        width: "100%",
                      }}
                      onChange={handleChangeForm}
                      value={formData.opsiAUraian}
                      name="opsiAUraian"
                    />
                  </div>
                  <div className="mb-4">
                    <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-12-ss fw-extrabold color-primary mb-3 d-inline-block">
                      Opsi 2
                    </h6>
                    <TextareaAutosize
                      className="form-control"
                      autoComplete="off"
                      style={{
                        resize: "none",
                        width: "100%",
                      }}
                      onChange={handleChangeForm}
                      value={formData.opsiBUraian}
                      name="opsiBUraian"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Jawaban Benar</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      placeholder="Pilih jawaban benar"
                      name="kjUraian"
                      value={formData.kjUraian}
                      onChange={handleChangeForm}
                    >
                      <option hidden>Pilih jawaban benar</option>
                      <option value="A">Jawaban Opsi 1</option>
                      <option value="B">Jawaban Opsi 2</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Nilai Soal</label>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan nilai soal"
                      name="nilaiSoal"
                      value={formData.nilaiSoal}
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor
                      id="editorPembahasan"
                      defaultValue={formData.pembahasan}
                      soal
                    />
                  </div>
                </>
              )}

              {/* Buat Soal Uraian End */}

              {/* Buat Soal Menjodohkan Start */}
              {formData?.bentuk === "menjodohkan" && (
                <>
                  <div className="my-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-2">Judul</h5>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Masukkan judul soal"
                      value={formData.pertanyaan}
                      name="pertanyaan"
                      onChange={handleChangeForm}
                    />
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pilihan Menjodohkan
                    </h5>
                    {pilihanMenjodohkan?.map((pilihan, idx) => (
                      <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                        <div className="d-flex justify-content-between">
                          <div
                            className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            {alphabet[idx]}
                          </div>
                          <button
                            className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                        <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                          <Editor
                            id={`editorMenjodohkan-${alphabet[idx]}`}
                            defaultValue={
                              typeof pilihan === "number" ? "" : pilihan
                            }
                            soal
                          />
                        </div>
                        <button
                          className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                          onClick={() => {
                            if (
                              Math.max(
                                ...soalMenjodohkan?.map((d) => d?.jawaban)
                              ) +
                                1 ==
                              pilihanMenjodohkan?.length
                            ) {
                              toast.error(
                                "Ada Soal dengan jawaban " +
                                  alphabet[
                                    Math.max(
                                      ...soalMenjodohkan?.map((d) => d?.jawaban)
                                    )
                                  ]
                              );
                              return;
                            } else if (idx > 0)
                              setPilihanMenjodohkan(
                                pilihanMenjodohkan.filter((e) => {
                                  return e !== pilihan;
                                })
                              );
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        if (pilihanMenjodohkan?.length == 20) {
                          toast.error("Hanya dapat membuat 20 pilihan");
                          return;
                        } else {
                          setPilihanMenjodohkan([
                            ...pilihanMenjodohkan,
                            Math.max(...pilihanMenjodohkan) + 1,
                          ]);
                        }
                      }}
                      className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                    >
                      <FaPlus className="me-2" />
                      Tambah Pilihan Menjodohkan
                    </button>
                  </div>
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">Soal</h5>
                    {soalMenjodohkan?.map((soal, idx) => (
                      <div>
                        <div className="mb-3 w-100 rounded-ss border border-light-secondary-ss p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-14-ss fw-extrabold color-primary d-inline-block">
                              Soal {idx + 1}
                            </h6>
                            <button
                              className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={() => handleRemoveSoalMenjodohkan(idx)}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                          <div className="row">
                            <div className="col-sm-11">
                              <div className="my-4">
                                <h6 className="fs-14-ss fw-bold color-dark mb-4">
                                  Pertanyaan
                                </h6>
                                <Editor
                                  id={`editor-pertanyaan-menjodohkan-${idx}`}
                                  defaultValue={soal?.soal}
                                  soal
                                />
                              </div>
                              <div className="mb-4">
                                <label className="form-label fs-14-ss">
                                  Jawaban Benar
                                </label>
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  placeholder="Pilih jawaban benar"
                                  name="jawaban"
                                  onChange={(e) => {
                                    if (
                                      soalMenjodohkan.find(
                                        (d) => d.jawaban == e.target.value
                                      )
                                    ) {
                                      toast.error(
                                        `Jawaban ${
                                          alphabet[e.target.value]
                                        } sudah terpakai`
                                      );
                                    } else {
                                      handleChangeForm(
                                        e,
                                        null,
                                        "soal-menjodohkan",
                                        idx
                                      );
                                    }
                                  }}
                                  value={parseInt(soal?.jawaban)}
                                >
                                  <option hidden>Pilih jawaban benar</option>
                                  {pilihanMenjodohkan?.map((pilihan, idx) => (
                                    <option value={idx}>
                                      Jawaban {alphabet[idx]}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="mb-4">
                                <h6 className="fs-14-ss fw-bold color-dark mb-4">
                                  Pembahasan
                                </h6>
                                <Editor
                                  id={`editor-pembahasan-menjodohkan-${idx}`}
                                  defaultValue={soal?.pembahasan}
                                  soal
                                />
                              </div>
                              <div className="mb-4">
                                <label className="form-label">Nilai Soal</label>
                                <input
                                  type="number"
                                  className="form-control"
                                  autoComplete="off"
                                  placeholder="Masukkan nilai soal"
                                  name="poin"
                                  onChange={(e) =>
                                    handleChangeForm(
                                      e,
                                      null,
                                      "soal-menjodohkan",
                                      idx
                                    )
                                  }
                                  value={soal?.poin}
                                  
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                      onClick={() => {
                        if (
                          soalMenjodohkan?.length == pilihanMenjodohkan?.length
                        ) {
                          toast.error("Jumlah soal melebihi pilihan");
                          return;
                        } else {
                          setSoalMenjodohkan([
                            ...soalMenjodohkan,
                            {
                              soal: "",
                              jawaban: "",
                              pembahasan: "",
                              poin: "",
                              id:
                                soalMenjodohkan[soalMenjodohkan.length - 1]
                                  ?.id + 1,
                            },
                          ]);
                        }
                      }}
                    >
                      <FaPlus className="me-2" />
                      Tambah Soal
                    </button>
                  </div>
                </>
              )}

              {/* Buat Soal Menjodohkan End */}
            </>
          ),
        },
      ]}
    />
  );
};

export default ModalBuatSoalUjian;
