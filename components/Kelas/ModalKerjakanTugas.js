import { editTimeline, postTkTimelineKomen } from "client/TimelineClient";
import InputFile from "components/Shared/InputFile/InputFile";
import KomenInput from "components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import ModalFullScreen from "components/Shared/ModalFullScreen/ModalFullScreen";
import ModalTautanLink from "components/Shared/ModalTautanLink/ModalTautanLink";
import LampiranSkeleton from "components/Shared/Skeleton/LampiranSkeleton";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFile, FaLink, FaPaperclip, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const initialFormData = {
  keterangan: "",
  lampiran: [],
};

const ModalKerjakanTugas = ({ detailData = null, _getDetailTimeline }) => {
  const { user } = useUser();

  const router = useRouter();
  const { kegiatan_id } = router.query;

  const [formData, setFormData] = useState(initialFormData);
  const [listKomentar, setListKomentar] = useState([]);
  const [commentCount, setCommentCount] = useState(
    detailData?.komen?.length || 0
  );

  const changeFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const deleteLampiran = (deleteLampiran) => {
    const newLampiran = formData?.lampiran?.filter(
      (val) => val !== deleteLampiran
    );
    changeFormData("lampiran", newLampiran);
  };

  const handleSubmitModal = async () => {
    let body = {
      ...formData,
      tipe: "tugas",
      waktuPengumpulan: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      dikumpulkan: 1,
    };

    const { data } = await editTimeline(kegiatan_id, body);
    if (data) {
      toast.success(data?.message);
      hideModal("modalKerjakanTugas");
      _getDetailTimeline(null, false);
    }
  };

  const postKomen = async (komen) => {
    if (!komen) return;

    let body = {
      tkTimelineId: kegiatan_id,
      komen: komen,
    };
    const { data } = await postTkTimelineKomen(body);
    if (data) {
      toast.success(data?.message);
      setListKomentar([
        ...listKomentar,
        {
          user,
          komen,
          updatedAt: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
          mUserId: user?.id,
        },
      ]);
      setCommentCount(commentCount + 1);
    }
  };

  useEffect(() => {
    if (detailData !== null) {
      setFormData({
        keterangan: detailData?.keterangan,
        lampiran: detailData?.lampiran || [],
      });

      if (detailData?.komen?.length) {
        setListKomentar(detailData?.komen);
        setCommentCount(detailData?.komen?.length || 0);
      }
    }
  }, [detailData]);

  return (
    <>
      <ModalFullScreen
        modalId="modalKerjakanTugas"
        title={
          <>
            <h4 className="mb-2 fw-extrabold">
              {detailData?.timeline?.tugas?.judul}
            </h4>
            <span className="fs-14-ss">
              Isi jawabanmu untuk mengerjakan tugas
            </span>
          </>
        }
        onSubmit={handleSubmitModal}
      >
        <div className="row">
          <div className="col-lg-8">
            <h6 className="mb-4 fw-extrabold color-dark">Jawaban</h6>
            <TextareaAutosize
              className="form-control"
              autoComplete="off"
              style={{
                resize: "none",
                width: "100%",
              }}
              placeholder="Tuliskan jawabanmu disini"
              minRows={3}
              name="keteranganJawaban"
              value={formData?.keterangan}
              onChange={(e) => changeFormData("keterangan", e.target.value)}
            />
            <div className="d-flex justify-content-between align-items-lg-start mb-4 mt-5 flex-lg-row flex-column flex-wrap">
              <h6 className="m-0 fw-extrabold color-dark">Lampiran</h6>
              <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between mt-xl-0 mt-md-2 mt-3">
                <label
                  htmlFor="inputFileModalKerjakantugas"
                  className="d-flex align-items-center justify-content-center form-label m-0 fs-6 btn btn-ss fs-14-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 fw-bold mb-md-0 mb-3"
                >
                  <FaPaperclip className="me-2" />
                  <p className="mb-0">Unggah File</p>
                </label>
                <InputFile
                  name="inputFileModalKerjakantugas"
                  id="inputFileModalKerjakantugas"
                  onChange={(e, fileUrl) =>
                    changeFormData("lampiran", [...formData?.lampiran, fileUrl])
                  }
                />
                <button
                  type="button"
                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-14-ss fw-bold"
                  data-bs-toggle="modal"
                  data-bs-target="#modalTautanLinkKerjakanTugas"
                >
                  <FaLink className="me-2" />
                  Tautan Link
                </button>
              </div>
            </div>
            {formData?.lampiran?.map((lampiranData, idx) => (
              <div className="mt-3" key={`${idx}-${new Date().getTime()}`}>
                <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                  <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                        <FaFile className="text-white fs-3" />
                      </div>
                      <div className="p-2">
                        <p className="fw-bold color-dark mb-0">
                          {lampiranData}
                        </p>
                        <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                          {/* PDF */}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                      <a
                        href={`${lampiranData}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold pointer d-flex justify-content-center align-items-center"
                      >
                        Pratinjau
                      </a>
                      <FaTimes
                        className="text-secondary pointer"
                        onClick={() => deleteLampiran(lampiranData)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4 position-relative">
            {/* Card Penilaian Start */}

            <div className="card card-ss rounded-ss p-4 mt-4 mt-lg-0">
              <h6 className="fs-18-ss fw-bold color-dark mb-3">
                Komentar Pribadi ( {commentCount} )
              </h6>
              {listKomentar?.length > 0 &&
                listKomentar?.map((komenData, index) => (
                  <KomenTimeline
                    idx={index}
                    komen={komenData?.komen}
                    userObj={komenData?.user}
                    userId={komenData?.mUserId}
                    createdAt={komenData?.updatedAt}
                  />
                ))}
              <KomenInput postKomen={postKomen} />
            </div>
            {/* Card Penilaian End */}
          </div>
        </div>
      </ModalFullScreen>

      <ModalTautanLink
        toastMessage="Link berhasil ditambahkan"
        modalId="modalTautanLinkKerjakanTugas"
        getLink={(e, link) =>
          changeFormData("lampiran", [...formData?.lampiran, link])
        }
      />
    </>
  );
};

export default ModalKerjakanTugas;
