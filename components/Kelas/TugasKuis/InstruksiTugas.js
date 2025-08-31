import { ssURL } from "client/clientAxios";
import {
  deleteTimelineKomen,
  editTimeline,
  postTimelineKomen,
} from "client/TimelineClient";
import { getFileName } from "utilities/FileViewer";
import { useRouter } from "next/router";
import { momentPackage } from "utilities/HelperUtils";

import useUser from "hooks/useUser";
import toast from "react-hot-toast";
import swal from "sweetalert";

import KomenInput from "components/Shared/KomenTimeline/KomenInput";
import KomenTimeline from "components/Shared/KomenTimeline/KomenTimeline";
import ModalPratinjauSoal from "components/Shared/ModalPratinjauSoal/ModalPratinjauSoal";
import CardLampiran from "../CardLampiran";
import useSekolah from "hooks/useSekolah";

const InstruksiTugas = ({
  detailData,
  showPratinjauSoal = true,
  showLampiranPelajaran = true,
  showBtnKerjakanTugas = false,
  _getDetailTimeline,
  isTugasKuis,
}) => {
  const { user } = useUser();

  const router = useRouter();
  const { kegiatan_id, id: kelasId } = router.query;

  const listKomentar =
    user?.role === "guru" ? detailData?.komen : detailData?.timeline?.komen;

  const postKomen = async (komen) => {
    const payload = {
      mTimelineId: kegiatan_id,
      komen,
    };

    const { data } = await postTimelineKomen(payload);
    if (data) {
      toast.success(data?.message);
      _getDetailTimeline(null, false);
    }
  };

  const deleteKomen = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTimelineKomen(id);
        if (data) {
          toast.success(data?.message);
          _getDetailTimeline(null, false);
        }
      }
    });
  };

  const batalkanPengumpulan = async () => {
    let body = {
      dikumpulkan: 0,
      keterangan: detailData?.keterangan,
      tipe: "tugas",
      lampiran: detailData?.lampiran || [],
      waktuPengumpulan: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    };
    const { data } = await editTimeline(kegiatan_id, body);
    if (data) {
      toast.success(data?.message);
      _getDetailTimeline(null, false);
    }
  };

  const openMateriPage = (data) => {
    window.open(
      `${ssURL}/kelas/${kelasId}/materi/${data?.id}?babId=${data?.bab?.id}`,
      "_blank"
    );
  };

  const { sekolah } = useSekolah();

  return (
    <>
      <div className="row mt-4">
        <div className="col-md-9">
          <div className="row">
            {user?.role !== "siswa" && (
              <div
                className={`mb-md-0 mb-3 pe-2 ${
                  showPratinjauSoal ? "col-md-6" : "col-md-7"
                }`}
              >
                <div
                  className="status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
                  data-joyride="informasi-absen"
                >
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss fw-bold color-secondary mb-2">
                      Belum
                    </p>
                    <p className="fs-18-ss fw-extrabold color-primary m-0">
                      {`${detailData?.listSiswaBelum?.length || 0} Siswa`}
                    </p>
                  </div>
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss fw-bold color-secondary mb-2">
                      Terkumpul
                    </p>
                    <p className="fs-18-ss fw-extrabold color-primary m-0">
                      {`${detailData?.listSiswaTerkumpul?.length || 0} Siswa`}
                    </p>
                  </div>
                  <div className="status-info-items mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss fw-bold color-secondary mb-2">
                      Dinilai
                    </p>
                    <p className="fs-18-ss fw-extrabold color-primary m-0">
                      {`${detailData?.listSiswaDinilai?.length || 0} Siswa`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div
              className={`mb-md-0 mb-3 px-2 ${
                user?.role === "siswa"
                  ? "col-md-12"
                  : showPratinjauSoal
                  ? "col-md-6"
                  : "col-md-5"
              }`}
            >
              <div
                className="status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
                data-joyride="informasi-absen"
              >
                {isTugasKuis ? (
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss fw-bold color-secondary mb-2">
                      Jumlah
                    </p>
                    <p className="fs-18-ss fw-extrabold color-primary m-0">
                      {`${
                        detailData?.tugas?.soal?.length ||
                        detailData?.timeline?.tugas?.soal?.length ||
                        0
                      } Soal`}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <p className="fs-14-ss fw-bold color-secondary mb-2">
                    Penilaian
                  </p>
                  <p className="fs-18-ss fw-extrabold color-primary m-0">
                    100 Poin
                  </p>
                </div>
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                  <p className="fs-14-ss fw-bold color-secondary mb-2">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"}</p>
                  <p className="fs-18-ss fw-extrabold color-primary m-0">
                    {`${
                      detailData?.tugas?.kkm ||
                      detailData?.timeline?.tugas?.kkm ||
                      0
                    } Poin`}
                  </p>
                </div>
                {user?.role === "siswa" &&
                detailData?.timeline?.tugas?.showNilai ? (
                  <div className="status-info-items mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss fw-bold color-secondary mb-2">
                      Nilai
                    </p>
                    <p className="fs-18-ss fw-extrabold color-primary m-0">
                      {detailData?.nilai
                        ? `${detailData?.nilai || 0} Poin`
                        : "-"}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {showPratinjauSoal && (
          <div className="col-md-3 ps-2">
            <a
              target="_blank"
              className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center py-3 ps-4 pe-5 "
              data-joyride="btn-pratinjau-soal"
              style={{ minHeight: "90px" }}
              data-bs-toggle="modal"
              data-bs-target="#pratinjauSoalTugasKuis"
            >
              <div className="d-flex align-items-center flex-lg-row flex-md-column">
                <img
                  src={`/img/icon-pratinjau.svg`}
                  alt="icon-pratinjau"
                  className="mb-lg-0 mb-md-3"
                />
                <p className="m-0 text-white fw-bold ps-4 text-start">
                  Pratinjau Soal
                </p>
              </div>
            </a>
          </div>
        )}
        {showBtnKerjakanTugas ? (
          detailData?.dikumpulkan === 1 ? (
            isTugasKuis ? (
              <div className="bg-soft-primary rounded-ss d-flex align-items-center post-complete-status col-lg-3 py-3 px-4 col-md-4 mt-md-0 mt-3">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle me-4 shadow-primary-ss"
                    style={{ width: 50, height: 50 }}
                  >
                    <img
                      src="/img/icon-complete.svg"
                      alt="post-icon"
                      style={{ width: 50, height: 50 }}
                    />
                  </div>
                  <div>
                    <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                      Tugas
                    </p>
                    <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                      Sudah Dikumpul
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-3 ps-2">
                <button
                  className="btn btn-outline-danger-ss w-50 py-3 me-4 rounded-ss d-flex align-items-center w-100"
                  onClick={batalkanPengumpulan}
                >
                  <img src="/img/icon-batalkan-pengumpulan-tugas.svg" />
                  <p
                    className="mb-0 fs-18-ss fw-medium ms-2"
                    style={{ textAlign: "left" }}
                  >
                    Batalkan <br /> Pengumpulan
                  </p>
                </button>
              </div>
            )
          ) : (
            <div className="col-md-3 ps-2">
              <a
                target="_blank"
                className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center py-3 ps-4 pe-5 "
                data-joyride="btn-pratinjau-soal"
                style={{ minHeight: "90px" }}
                onClick={showBtnKerjakanTugas?.onClick}
              >
                <div className="d-flex align-items-center flex-lg-row flex-md-column">
                  <img
                    src="/img/icon-kerjakan-tugas.svg"
                    alt="icon-kerjakan-tugas"
                    className="mb-lg-0 mb-md-3"
                  />
                  <p className="m-0 text-white fw-bold ps-4 text-start">
                    Kerjakan Tugas
                  </p>
                </div>
              </a>
            </div>
          )
        ) : null}
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="post-content">
            <p className="color-secondary">
              {detailData?.tugas?.judul || detailData?.timeline?.tugas?.judul}
            </p>
            <div
              className="dangerous-html"
              dangerouslySetInnerHTML={{
                __html:
                  detailData?.tugas?.instruksi ||
                  detailData?.timeline?.tugas?.instruksi,
              }}
            />
          </div>
        </div>
      </div>

      {showLampiranPelajaran && (
        <div className="row mt-4">
          <div className="col-md-12">
            <h6 className="fw-bold color-dark">Lampiran Pelajaran</h6>
          </div>
          {(detailData?.tugas?.lampiran?.length ||
            detailData?.timeline?.tugas?.lampiran?.length) > 0 ? (
            (
              detailData?.tugas?.lampiran ||
              detailData?.timeline?.tugas?.lampiran
            )?.map((dt, index) => (
              <CardLampiran
                text={getFileName(dt)}
                iconLeft="/img/icon-file.svg"
                key={`${index}-${new Date().getTime()}`}
                onClick={() => window.open(dt, "_blank")}
              />
            ))
          ) : (
            <div className="col-md-12">Belum ada data</div>
          )}
        </div>
      )}

      <div className="row mt-4">
        <div className="col-md-12">
          <h6 className="fw-bold color-dark">Materi Terkait</h6>
        </div>
        {(detailData?.materi?.length || detailData?.timeline?.materi?.length) >
        0 ? (
          (detailData?.materi || detailData?.timeline?.materi)?.map(
            (dt, index) => (
              <CardLampiran
                text={`BAB ${index + 1} - ${dt?.judul}`}
                iconLeft="/img/icon-kegiatan-materi.svg"
                onClick={() => openMateriPage(dt)}
                key={`${index}-${new Date().getTime()}`}
              />
            )
          )
        ) : (
          <div className="col-md-12">Belum ada data</div>
        )}
      </div>

      <hr />

      <ModalPratinjauSoal
        modalId="pratinjauSoalTugasKuis"
        ujianData={detailData?.tugas?.soal || []}
      />

      {listKomentar?.map((komenData, idx) => (
        <KomenTimeline
          key={`${idx}-${new Date().getTime()}`}
          idx={idx}
          totalKomen={listKomentar?.length}
          komen={komenData?.komen}
          userObj={komenData?.user}
          userId={komenData?.mUserId}
          createdAt={komenData?.createdAt}
          onClickDelete={deleteKomen}
          komenId={komenData?.id}
        />
      ))}
      <KomenInput postKomen={postKomen} />
    </>
  );
};

export default InstruksiTugas;
