import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaLightbulb,
  FaPlus,
  FaQuestion,
  FaTrash,
  FaTrashAlt,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import TextareaAutosize from "react-textarea-autosize";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { getDetailBab } from "../../../../client/BabClient";
import { ssURL } from "../../../../client/clientAxios";
import { postKuis, editKuis, deleteKuis } from "../../../../client/KuisClient";
import { postMateriKesimpulan } from "../../../../client/MateriClient";
import {
  deleteTopik,
  getDetailTopik,
  postTopik,
} from "../../../../client/TopikClient";
import KuisComponent from "../../../../components/BabDetail/KuisComponent/KuisComponent";
import TopikComponent from "../../../../components/BabDetail/TopikComponent/TopikComponent";
import LayoutDetail from "../../../../components/Layout/LayoutDetail";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Editor from "../../../../components/Shared/Editor/Editor";
import ListNumberTopik from "../../../../components/Shared/ListNumberTopik/ListNumberTopik";
import ModalPratinjauSoal from "../../../../components/Shared/ModalPratinjauSoal/ModalPratinjauSoal";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import DetailBabSkeleton from "../../../../components/Shared/Skeleton/DetailBabSkeleton";
import useUser from "../../../../hooks/useUser";
import { checkEditorType } from "../../../../utilities/EditorUtils";
import { momentPackage } from "../../../../utilities/HelperUtils";

const index = ({ id, topik_id }) => {
  const initialFormData = { judul: "", mBabId: id, lampiran: [], link: [] };
  const router = useRouter();

  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [detailBabData, setDetailBabData] = useState({});
  const [detailTopikData, setDetailTopikData] = useState({});
  const [rubrikKj, setRubrikKj] = useState([
    {
      poin: "",
      indikator: "",
      id: Math.random(),
    },
  ]);
  const [editId, setEditId] = useState(null);
  const [listOpsiJawaban, setListOpsiJawaban] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
  ]);
  const [formPilihanGanda, setFormPilihanGanda] = useState({});
  const [showEditor, setShowEditor] = useState(true);

  const { topik } = detailTopikData;
  const { bab, topikIds } = detailBabData;

  const getDetailBabData = async () => {
    const { data } = await getDetailBab(id);
    if (data) {
      setDetailBabData(data);
    }
  };

  const getDetailTopikData = async () => {
    setLoading(true);
    const { data } = await getDetailTopik(topik_id);
    if (data) {
      setDetailTopikData(data);
      setFormData({
        ...formData,
        judul: data.topik?.judul,
        kuis: data?.topik?.kuis,
        lampiran: data?.topik?.lampiran,
        link: data?.topik?.link,
        mBabId: data?.topik?.mBabId,
        soalKuis: data?.topik?.soalKuis,
        materiKesimpulan: data?.topik?.materiKesimpulan,
      });
      window
        .$(`#editorKesimpulan`)
        .summernote("code", data?.topik?.materiKesimpulan?.kesimpulan);
      window.$(`#editorKonten`).summernote("code", data?.topik?.konten);
    }
    setLoading(false);
  };

  const postMateriKesimpulanData = async (payload) => {
    const { data } = await postMateriKesimpulan(payload);

    return data;
  };

  useEffect(() => {
    getDetailTopikData();
  }, [topik_id]);

  useEffect(() => {
    getDetailBabData();
  }, []);

  useEffect(() => {
    if (user?.role == "siswa") {
      postMateriKesimpulanData({
        m_topik_id: topik_id,
        waktuMulai: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      });
    }
  }, [user]);

  const handlePostTopikData = async (formData) => {
    const { data, isSuccess, error } = await postTopik(formData);
    if (data) {
      getDetailBabData();
      router.push(`${ssURL}/bab/${id}?topik_id=${data.topikId}`);
    } else {
      setButtonState("error");
    }
  };

  const handleDeleteTopikData = async (topik_id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteTopik(topik_id);
        if (data) {
          getDetailBabData();
          toast.success(data?.message);
          router.push(`${ssURL}/bab/${id}`);
        } else {
          setButtonState("error");
        }
      }
    });
  };

  const handleChangeRubrik = (e, index) => {
    let editedRubrik = [...rubrikKj];
    let currentRubrik = editedRubrik[index];

    if (e.target.name) {
      currentRubrik[e.target.name] = e.target.value;
    }

    setRubrikKj(editedRubrik);
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

  const handleRemovePilihanJawaban = (opsi) => {
    if (["A", "B", "C"].includes(opsi)) return;

    setListOpsiJawaban(listOpsiJawaban.filter((value) => value !== opsi));
  };

  const handleAddPilihanJawaban = () => {
    const lastListOpsiJawaban = listOpsiJawaban[listOpsiJawaban.length - 1];

    if (lastListOpsiJawaban === "E") return;

    const opsi = ["A", "B", "C", "D", "E"];
    const findIndexOpsi = opsi.findIndex(
      (value) => value === lastListOpsiJawaban
    );
    setListOpsiJawaban([...listOpsiJawaban, opsi[findIndexOpsi + 1]]);
  };

  const getPayloadData = (tipeSoal) => {
    let payload = {};

    if (tipeSoal === "pilihan-ganda") {
      payload = {
        pertanyaan: checkEditorType(
          window.$(`#editorPertanyaanPilihanGanda`).summernote("code")
        ),
        pgA: checkEditorType(
          window.$(`#editorJawabanPilihanGanda-A`).summernote("code")
        ),
        pgB: checkEditorType(
          window.$(`#editorJawabanPilihanGanda-B`).summernote("code")
        ),
        pgC: checkEditorType(
          window.$(`#editorJawabanPilihanGanda-C`).summernote("code")
        ),
        pgD: checkEditorType(
          window.$(`#editorJawabanPilihanGanda-D`).summernote("code")
        ),
        pgE: checkEditorType(
          window.$(`#editorJawabanPilihanGanda-E`).summernote("code")
        ),
        pgKj: formPilihanGanda?.pgKj,
        pgPoin: formPilihanGanda?.pgPoin,
        esai: 0,
        pembahasan: window
          .$(`#editorPembahasanPilihanGanda`)
          .summernote("code"),
        mTopikId: topik_id,
        dihapus: 0,
      };
    } else {
      payload = {
        pertanyaan: checkEditorType(
          window.$(`#editorPertanyaanEsai`).summernote("code")
        ),
        pembahasan: checkEditorType(
          window.$(`#editorPembahasanEsai`).summernote("code")
        ),
        mTopikId: topik_id,
        esai: 1,
        dihapus: 0,
        rubrikKj,
      };
    }

    return payload;
  };

  const handlePostKuis = async (tipeSoal) => {
    const payload = getPayloadData(tipeSoal);

    const { data } = editId
      ? await editKuis(payload, editId)
      : await postKuis(payload);
    if (data) {
      toast.success(data?.message);
      getDetailTopikData();
    }
  };

  return (
    <AnimatePage>
      <LayoutDetail
        backProps={`${ssURL}/materi/${bab?.mMateriId}`}
        title={bab?.judul}
        modalWrapper={
          <>
            <NewModal
              modalId="modalAddQuiz"
              modalSize="xl"
              title={
                <>
                  <h5 className="mb-0 fw-bold">
                    {editId ? "Edit" : "Buat"} Soal Pilihan Esai
                  </h5>
                  <span className="fs-6">
                    Isi informasi dibawah untuk membuat soal esai
                  </span>
                </>
              }
              content={
                <div className="modal-kuis">
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    <Editor id="editorPertanyaanEsai" />
                  </div>

                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor id="editorPembahasanEsai" />
                  </div>

                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">Rubrik</h5>

                    {rubrikKj?.map((rubrik, index) => (
                      <div
                        className="rubrik-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3"
                        key={`${index}-${new Date().getTime()}`}
                      >
                        <div className="d-flex justify-content-between">
                          <div
                            className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                          >
                            {index + 1}
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
                              name="poin"
                              className="form-control"
                              autoComplete="off"
                              placeholder="0"
                              value={rubrik.poin}
                              onChange={(e) => handleChangeRubrik(e, index)}
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
                              onChange={(e) => handleChangeRubrik(e, index)}
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
                  </div>
                  <button
                    className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                    onClick={() => handleAddPilihanRubrik()}
                  >
                    <FaPlus className="me-2" />
                    Tambah Rubrik
                  </button>
                </div>
              }
              submitButton={
                <ReactiveButton
                  buttonState={"idle"}
                  color={"primary"}
                  idleText={`${editId ? "Edit Soal" : "Buat Soal"}`}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  data-bs-dismiss="modal"
                  className={"btn btn-primary"}
                  onClick={() => handlePostKuis("esai")}
                />
              }
            />
            <NewModal
              modalId="modalPilihanGanda"
              modalSize="xl"
              title={
                <>
                  <h5 className="mb-0 fw-bold">
                    {" "}
                    {editId ? "Edit" : "Buat"} Soal Pilihan Ganda
                  </h5>
                  <span className="fs-6">
                    Isi informasi dibawah untuk membuat soal pilihan ganda
                  </span>
                </>
              }
              content={
                <div className="modal-kuis">
                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pertanyaan
                    </h5>
                    <Editor id="editorPertanyaanPilihanGanda" />
                  </div>

                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Jawaban
                    </h5>
                    {showEditor &&
                      listOpsiJawaban.map((opsi, idx) => (
                        <div
                          className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3"
                          key={`${idx}-${new Date().getTime()}`}
                        >
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
                            <button
                              className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                              style={{
                                width: "40px",
                                height: "40px",
                              }}
                              onClick={() => handleRemovePilihanJawaban(opsi)}
                            >
                              <FaTrashAlt
                                onClick={() => handleRemovePilihanJawaban(opsi)}
                              />
                            </button>
                          </div>
                          <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                            <Editor id={`editorJawabanPilihanGanda-${opsi}`} />
                          </div>
                          <button
                            className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                            style={{
                              width: "40px",
                              height: "40px",
                            }}
                            onClick={() => handleRemovePilihanJawaban(opsi)}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      ))}
                    <button
                      className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                      onClick={() => handleAddPilihanJawaban()}
                    >
                      <FaPlus className="me-2" />
                      Tambah Pilihan Jawaban
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Jawaban Benar</label>
                    <select
                      className="form-select"
                      id="inputGroupSelect01"
                      placeholder="Pilih Jawaban yang Benar"
                      value={formPilihanGanda?.pgKj || "Pilih Jawaban Benar"}
                      onChange={(e) =>
                        setFormPilihanGanda({
                          ...formPilihanGanda,
                          pgKj: e.target.value,
                        })
                      }
                    >
                      <option
                        hidden
                        style={{
                          color: "#e1e1e7",
                        }}
                        value=""
                      >
                        Pilih Jawaban yang Benar
                      </option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <h5 className="fs-18-ss fw-bold color-dark mb-4">
                      Pembahasan
                    </h5>
                    <Editor id="editorPembahasanPilihanGanda" />
                  </div>

                  {/* <div className="mb-4">
                    <label className="form-label">Nilai Soal</label>
                    <input
                      className="form-control"
autoComplete="off"
                      placeholder="Masukkan nilai soal"
                      type="number"
                      value={formPilihanGanda?.pgPoin || ""}
                      onChange={(e) =>
                        setFormPilihanGanda({
                          ...formPilihanGanda,
                          pgPoin: e.target.value,
                        })
                      }
                    />
                  </div> */}
                </div>
              }
              submitButton={
                <ReactiveButton
                  buttonState={"idle"}
                  color={"primary"}
                  idleText={`${editId ? "Edit Soal" : "Buat Soal"}`}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  data-bs-dismiss="modal"
                  className={"btn btn-primary"}
                  onClick={() => handlePostKuis("pilihan-ganda")}
                />
              }
            />

            {/* Modal Pratinjau Soal Kuis Start */}
            <ModalPratinjauSoal
              modalId="modalPratinjauSoalKuis"
              ujianData={topik?.soalKuis}
              withRightLabel={false}
            />
            {/* Modal Pratinjau Soal Kuis End */}
          </>
        }
      >
        <div className="bab-detail pt-sm-0 pt-5 mt-lg-0 mt-3">
          <div className="row mx-0">
            {/* List Topik Horizontal Start */}
            {/* <div className="list-topik-horizontal col-12 mb-4 d-flex rounded-ss mx-0 mt-sm-0 mt-5 d-lg-none d-inline-block">
              <div
                className="list-topik-horizontal-container d-flex align-items-center w-100 bg-soft-primary px-3 scrollbar-overlay"
                style={{
                  height: "75px",
                }}
              >
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaLightbulb />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
                <div className="list-number-topik-circle me-5">
                  <Link href="/">
                    <a className="text-decoration-none">
                      <span className="circle fw-bold color-dark">
                        <FaQuestion />
                      </span>
                    </a>
                  </Link>
                  <div className="list-number-topik-stripe"></div>
                </div>
              </div>
              <div className="plus-button-container p-4 bg-gradient-primary-2">
                <div className="dropdown dropdown-ss">
                  <div
                    
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="plus-container"
                    //   className={`
                    //   plus-container
                    //   ${listTopik.length > 0 ? "mt-50" : ""}
                    //   ${listTopik.length > 4 ? "stick-to-bottom" : ""}
                    // `}
                  >
                    <FaPlus className="text-white fs-18-ss" />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        
                        // onClick={() => {
                        //   handlePostTopikData({ ...formData, kuis: 0 });
                        // }}
                      >
                        Topik
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        
                        // onClick={() => {
                        //   handlePostTopikData({ ...formData, kuis: 1 });
                        // }}
                      >
                        Kuis
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
            <div className="col-md-2 d-lg-block d-none">
              <ListNumberTopik
                user={user}
                listTopik={topikIds ?? []}
                topikId={topik_id}
                handlePostTopikData={handlePostTopikData}
                setFormData={setFormData}
                formData={formData}
              />
            </div>
            {loading ? (
              <div className="col-lg-10">
                <DetailBabSkeleton />
              </div>
            ) : topik_id ? (
              <div className="col-lg-10">
                <div
                  className="card card-ss p-4"
                  style={{ minHeight: "553px" }}
                >
                  <div
                    className={`d-flex justify-content-between align-md-items-center flex-md-row flex-column ${
                      user?.role == "guru" ? "mb-5" : "mb-4"
                    }`}
                  >
                    <div className="bab-title order-md-1 order-2">
                      {user?.role == "guru" && (
                        <TextareaAutosize
                          className="ps-0 border-0 border-bottom border-2 form-control form-bab-materi shadow-none fs-4 color-dark fw-extrabold"
                          placeholder="Tuliskan judul disini"
                          onChange={({ target }) =>
                            setFormData({ ...formData, judul: target.value })
                          }
                          value={formData.judul}
                        />
                      )}
                      {user?.role == "siswa" && (
                        <span className="fs-4 fw-extrabold color-dark">
                          {formData.judul}
                        </span>
                      )}
                    </div>
                    <div className="order-md-2 order-1 d-flex flex-column mb-md-0 mb-3">
                      {user?.role == "guru" && (
                        <a
                          className="btn btn-ss btn-outline-danger btn-outline-danger-ss rounded-pill fs-14-ss fw-bold mb-md-0 mb-3"
                          onClick={() => handleDeleteTopikData(topik?.id)}
                        >
                          <FaTrashAlt />
                          <span>&nbsp; Hapus</span>
                        </a>
                      )}
                    </div>
                  </div>
                  {topik?.kuis ? (
                    <KuisComponent
                      topikId={topik_id}
                      soalKuis={topik?.soalKuis}
                      getDetailTopikData={getDetailTopikData}
                      setRubrikKj={setRubrikKj}
                      setEditId={setEditId}
                      setFormPilihanGanda={setFormPilihanGanda}
                      setListOpsiJawaban={setListOpsiJawaban}
                      listOpsiJawaban={listOpsiJawaban}
                      setShowEditor={setShowEditor}
                      formData={formData}
                      user={user}
                    />
                  ) : (
                    <TopikComponent
                      topikId={topik_id}
                      formData={formData}
                      setFormData={setFormData}
                      topik={topik}
                      postMateriKesimpulanData={postMateriKesimpulanData}
                      getDetailTopikData={getDetailTopikData}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="col-lg-10">
                Pilih materi/kuis di peta sebelah kiri yaa
              </div>
            )}
          </div>
        </div>
      </LayoutDetail>
    </AnimatePage>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { topik_id },
}) {
  return {
    props: {
      id,
      topik_id: topik_id || null,
    },
  };
}

export default index;
