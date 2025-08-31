import { uploadString } from "client/uploadFileClient";
import CanvasDraw from "components/Shared/CanvasDraw/CanvasDraw";
import KomenInput from "components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFile } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { getFileType } from "utilities/FileViewer";
import { editTimeline, postTkTimelineKomen } from "../../client/TimelineClient";
import useTugasSiswa from "../../hooks/useTugasSiswa";
import { hideModal } from "../../utilities/ModalUtils";
import WhatsappLink from "../Shared/WhatsappLink/WhatsappLink";

const ModalNilaiTugas = ({
  timeline,
  _getDetailTimeline,
  listSiswaTerkumpul,
}) => {
  listSiswaTerkumpul = listSiswaTerkumpul?.filter((value, index, self) => {
    return (
      index ==
      self?.findIndex((dt) => {
        return dt?.id == value?.id;
      })
    );
  });

  const [formData, setFormData] = useState({});
  const [buttonState, setButtonState] = useState("idle");

  const { tugasSiswa, setTugasSiswa } = useTugasSiswa();
  const [uploading, setUploading] = useState(false);

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const postKomentarPribadi = async (komen) => {
    if (!komen) return;

    const payload = {
      tkTimelineId: tugasSiswa?.id,
      komen: komen,
    };
    const { data } = await postTkTimelineKomen(payload);
    if (data) {
      setFormData({});
      _getDetailTimeline(null, false);
    }
  };

  const handlePutNilaiSiswa = async () => {
    const { data, isSuccess } = await editTimeline(tugasSiswa?.id, {
      ...formData,
      tipe: "nilai",
    });

    if (isSuccess) {
      hideModal("modalNilaiTugas");
      toast.success(data?.message);
      setButtonState("success");
      _getDetailTimeline(null, false);
      setFormData({});
      setTugasSiswa(null);
    } else {
      setButtonState("error");
    }
  };

  const handleSave = async (data, nama, idx) => {
    setUploading(true);
    const ext = getFileType(tugasSiswa?.lampiran[idx]);
    const url = await uploadString(`${nama}.${ext}`, data);
    if (url) {
      setUploading(false);
    }

    let lampiran = tugasSiswa?.lampiran;
    lampiran?.splice(idx, 1, url);
    await editTimeline(tugasSiswa?.id, {
      tipe: "tugas",
      lampiran,
    });
  };

  useEffect(() => {
    if (tugasSiswa?.nilai != null) {
      setFormData({
        ...formData,
        nilai: tugasSiswa?.nilai,
      });
    } else {
      setFormData({ nilai: "" });
    }
  }, [tugasSiswa]);

  return (
    <div
      className="modal modal-ss fade"
      id="modalNilaiTugas"
      tabIndex="-1"
      aria-labelledby="modalNilaiTugasLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header p-3">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div
                      className="modal-title d-flex flex-column col-md-6 order-2 order-md-1"
                      id="modalNilaiTugasLabel"
                    >
                      <h6 className="mb-2 fw-extrabold fs-14-ss">
                        {timeline?.tugas?.judul}
                      </h6>

                      {/* Dropdown Nama Siswa Start */}

                      <div className="dropdown dropdown-ss dropdown-nama-nilai-tugas">
                        <div
                          className="btn btn-light bg-light dropdown-toggle d-flex align-items-center justify-content-between flex-wrap w-100 rounded-ss"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {" "}
                          <div className="">
                            <p className="mb-0 fw-bold color-dark">
                              {tugasSiswa?.user?.nama?.substring(0, 20)}
                              ...
                            </p>
                          </div>
                          <span className="fs-12-ss fw-bold color-secondary ms-md-auto">
                            {tugasSiswa?.nilai != null
                              ? tugasSiswa?.nilai
                              : "Mengumpulkan"}
                          </span>
                        </div>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {listSiswaTerkumpul?.map((siswa) => (
                            <li onClick={() => setTugasSiswa(siswa)}>
                              <a className="dropdown-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="flex-grow-1 flex-wrap">
                                    <p className="mb-0">{siswa?.user?.nama}</p>
                                  </div>
                                  {siswa?.nilai != null ? (
                                    <span
                                      className={`py-0 px-3 rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center color-success bg-soft-success`}
                                      style={{
                                        width: "50px",
                                        height: "20px",
                                      }}
                                    >
                                      {siswa?.nilai}
                                    </span>
                                  ) : (
                                    <span className="py-0 color-secondary fs-14-ss fw-bold">
                                      Mengumpulkan
                                    </span>
                                  )}
                                </div>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dropdown Nama Siswa End */}
                    </div>
                    <div className="order-1 order-md-2 d-flex d-md-inline justify-content-end m-md-0 m-2">
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                          hideModal("modalNilaiTugas");
                          setTugasSiswa(null);
                        }}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-lg-8">
                  {/* Card Jawaban Siswa Start*/}
                  <div
                    className="card card-ss rounded-ss p-4 mb-md-0 mb-4"
                    style={{
                      minHeight: "455px",
                    }}
                  >
                    <h4 className="mb-4 fw-extrabold color-dark">
                      Jawaban Tugas
                    </h4>

                    <p>{tugasSiswa?.keterangan}</p>

                    {/* Lampiran Tugas Biasa Start */}
                    {tugasSiswa?.lampiran?.map((lampiran, idx) => {
                      const type = getFileType(lampiran);
                      if (
                        ["PNG", "JPEG", "JPG"].includes(type?.toUpperCase())
                      ) {
                        return (
                          <CanvasDraw
                            id={`image-${idx}`}
                            img={lampiran}
                            key={`${idx}-${new Date().getTime()}`}
                            handleSave={(data) =>
                              handleSave(data, "edit-guru", idx)
                            }
                            disableSave={uploading}
                          />
                        );
                      }
                      return (
                        <a
                          href={lampiran}
                          target="_blank"
                          className="bg-soft-primary p-3 rounded-ss mb-3"
                        >
                          <div className="file-content d-flex align-items-center flex-wrap">
                            <div
                              className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                              style={{
                                width: "48px",
                                height: "48px",
                              }}
                            >
                              <FaFile />
                            </div>
                            <div className="p-2 d-flex flex-column">
                              <p className="fw-bold color-dark mb-1">
                                {lampiran}
                              </p>
                              {/* <p className="fs-12-ss fw-bold color-secondary mb-0">
                            PDF
                          </p> */}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="card card-ss rounded-ss p-4 mt-4 mt-lg-0">
                    <h6 className="fs-18-ss fw-bold color-dark mb-3">
                      Komentar Pribadi ( {tugasSiswa?.komen?.length} )
                    </h6>
                    {tugasSiswa?.komen?.map((komenData, idx) => (
                      <KomenTimeline
                        idx={idx}
                        komen={komenData?.komen}
                        userObj={komenData?.user}
                        userId={komenData?.mUserId}
                        createdAt={komenData?.updatedAt}
                      />
                    ))}
                    <KomenInput postKomen={postKomentarPribadi} />
                  </div>

                  {/* Card Jawaban Siswa End*/}
                </div>
                <div className="col-lg-4 position-relative">
                  {/* Card Penilaian Start */}

                  <div className="card card-ss rounded-ss p-4 card-penilaian-tugas mt-4 mt-lg-0">
                    <h4 className="mb-4 fw-extrabold color-dark">Penilaian</h4>
                    <div className="bg-soft-success rounded-ss px-4 py-3 mb-3">
                      <p className="fs-14-ss color-secondary mb-1">
                        Dikumpulkan Pada
                      </p>
                      <h6 className="fs-18-ss color-dark fw-bold mb-0">
                        {tugasSiswa?.updatedAt}
                      </h6>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="nilai" className="form-label">
                        Nilai
                      </label>
                      <input
                        className="form-control"
                        autoComplete="off"
                        name="nilai"
                        type="number"
                        value={formData?.nilai}
                        id="nilai"
                        placeholder="Berikan Nilai"
                        onChange={(e) => handleChangeForm(e)}
                      />
                    </div>
                    <ReactiveButton
                      buttonState={buttonState}
                      color={"primary"}
                      idleText={"Berikan Nilai"}
                      loadingText={"Diproses"}
                      successText={"Berhasil"}
                      errorText={"Gagal"}
                      type={"button"}
                      data-bs-dismiss="modal"
                      className={
                        "btn btn-primary bg-gradient-primary py-2 w-100 rounded-pill d-flex justify-content-center align-items-center fs-18-ss fw-bold"
                      }
                      onClick={() => handlePutNilaiSiswa()}
                    />
                  </div>
                  {/* Card Penilaian Start */}

                  {/* Card Penilaian End */}
                  <WhatsappLink
                    phoneNumber={tugasSiswa?.user?.whatsapp}
                    text={`Halo nak ${tugasSiswa?.user?.nama}, tugas yang berjudul *${timeline?.tugas?.judul}* masih belum sesuai. Tolong direvisi kembali`}
                  >
                    <button className="btn-pengembalian-tugas bg-soft-primary shadow-primary-ss rounded-ss p-3 w-100 mt-3 border-0">
                      <div className="d-flex align-items-center">
                        <img
                          src={`/img/icon-kembalikan-tugas.svg`}
                          alt="icon-kembalikan-tugas"
                        />
                        <span className="fs-18-ss fw-bold color-dark mb-0 ms-2">
                          Kembalikan Tugas
                        </span>
                      </div>
                    </button>
                  </WhatsappLink>

                  {/* Card Penilaian End */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNilaiTugas;
