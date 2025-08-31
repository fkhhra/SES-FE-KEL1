import React from "react";
import AudioPlayer from "components/Shared/AudioPlayer/AudioPlayer";

const PenilaianPg = ({
  jawaban,
  idx,
  pesertaUjian,
  ta,
  sekolah,
  handlePutJawabanSiswa,
  user,
}) => {
  return (
    <div className="detail-jawaban-peserta-pg card card-ss bg-white rounded-ss mb-4">
      <div className="card-header card-header-ss p-4 border-bottom border-light-secondary-ss d-flex justify-content-between align-content-center">
        <span
          className={`label-ss px-4 fw-bold ${
            jawaban?.soal?.kjPg === jawaban?.jawabanPg
              ? "bg-soft-success color-success"
              : "bg-soft-danger color-danger"
          } rounded-pill d-flex align-items-center`}
        >
          {jawaban?.soal?.kjPg === jawaban?.jawabanPg ? "Benar" : "Salah"}
        </span>
      </div>
      <div className="card-body p-4">
        {/* Info Soal Start */}

        <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column mb-4">
          <div className="d-flex align-items-center justify-content-md-start justify-content-between">
            <h6 className="fs-18-ss fw-bold color-dark me-4 mb-0">
              Soal {idx + 1} / {pesertaUjian?.jawabanSiswa?.length}
            </h6>
            <span className="label-ss rounded-pill bg-light-primary color-primary fs-12-ss fw-bold">
              {jawaban?.durasi}
            </span>
          </div>
          <hr className="d-md-none hr-ss" />
          <div className="d-flex justify-content-center align-items-center justify-content-md-start justify-content-between flex-wrap">
            <span
              className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-3 px-2 mb-sm-0 mb-2"
              style={{
                minWidth: "75px",
                minHeight: "25px",
              }}
            >
              {(pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat == "X" &&
                ta?.tingkat1 == "2013") ||
              (pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat == "XI" &&
                ta?.tingkat2 == "2013") ||
              (pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat ==
                "XII" &&
                ta?.tingkat3 == "2013")
                ? "KD / CP"
                : "Elemen"}{" "}
              {jawaban?.soal?.kd}
            </span>
            <span
              className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-md-3 me-auto text-uppercase mb-sm-0 mb-2"
              style={{
                width: "75px",
                height: "25px",
              }}
            >
              {jawaban?.soal?.levelKognitif}
            </span>
            {jawaban?.soal?.kjPg === jawaban?.jawabanPg ? (
              <span
                className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center px-2 mb-sm-0 mb-2"
                style={{
                  minWidth: "75px",
                  height: "25px",
                }}
              >
                {jawaban?.soal?.nilaiSoal} Poin
              </span>
            ) : (
              <span
                className="bg-danger text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-sm-0 mb-2"
                style={{
                  width: "75px",
                  height: "25px",
                }}
              >
                0 Poin
              </span>
            )}
          </div>
        </div>
        {/* Info Soal End */}

        <div className="mb-4">
          {jawaban?.soal?.audio && (
            <div>
              <AudioPlayer src={jawaban?.soal?.audio} />
            </div>
          )}
        </div>

        {/* Konten Soal Start */}
        <div className="mb-4">
          <p
            className="m-0 dangerous-html"
            dangerouslySetInnerHTML={{
              __html: jawaban?.soal?.pertanyaan,
            }}
          ></p>
        </div>
        {/* Konten Soal End */}

        {/* Jawaban Soal Start */}
        <div className="mb-4">
          <div
            style={{ cursor: "pointer" }}
            className={`list-jawaban-soal rounded-ss text-break ${
              "A" === jawaban?.jawabanPg && "A" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "A" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "A" === jawaban?.jawabanPg
                ? "bg-soft-danger border-danger-ss"
                : ""
            } border px-4 py-3 d-flex align-items-center mb-3`}
            onClick={() =>
              (sekolah?.id == 8123 && user?.id == 2883651) &&
              handlePutJawabanSiswa({ jawabanPg: "A", soal: jawaban?.id })
            }
          >
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">A</h6>
            <div className="konten-list-jawaban-soal">
              <p
                className="mb-0 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: jawaban?.soal?.jawabanA,
                }}
              ></p>
            </div>
          </div>
          <div
            style={{ cursor: "pointer" }}
            className={`list-jawaban-soal rounded-ss text-break ${
              "B" === jawaban?.jawabanPg && "B" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "B" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "B" === jawaban?.jawabanPg
                ? "bg-soft-danger border-danger-ss"
                : ""
            } border px-4 py-3 d-flex align-items-center mb-3`}
            onClick={() =>
              (sekolah?.id == 8123 && user?.id == 2883651) &&
              handlePutJawabanSiswa({ jawabanPg: "B", soal: jawaban?.id })
            }
          >
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">B</h6>
            <div className="konten-list-jawaban-soal">
              <p
                className="mb-0 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: jawaban?.soal?.jawabanB,
                }}
              ></p>
            </div>
          </div>
          <div
            style={{ cursor: "pointer" }}
            className={`list-jawaban-soal rounded-ss text-break ${
              "C" === jawaban?.jawabanPg && "C" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "C" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "C" === jawaban?.jawabanPg
                ? "bg-soft-danger border-danger-ss"
                : ""
            } border px-4 py-3 d-flex align-items-center mb-3`}
            onClick={() =>
              (sekolah?.id == 8123 && user?.id == 2883651) &&
              handlePutJawabanSiswa({ jawabanPg: "C", soal: jawaban?.id })
            }
          >
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">C</h6>
            <div className="konten-list-jawaban-soal">
              <p
                className="mb-0 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: jawaban?.soal?.jawabanC,
                }}
              ></p>
            </div>
          </div>
          <div
            style={{ cursor: "pointer" }}
            className={`list-jawaban-soal rounded-ss text-break ${
              "D" === jawaban?.jawabanPg && "D" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "D" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "D" === jawaban?.jawabanPg
                ? "bg-soft-danger border-danger-ss"
                : ""
            } border px-4 py-3 d-flex align-items-center mb-3`}
            onClick={() =>
              (sekolah?.id == 8123 && user?.id == 2883651) &&
              handlePutJawabanSiswa({ jawabanPg: "D", soal: jawaban?.id })
            }
          >
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">D</h6>
            <div className="konten-list-jawaban-soal">
              <p
                className="mb-0 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: jawaban?.soal?.jawabanD,
                }}
              ></p>
            </div>
          </div>
          <div
            style={{ cursor: "pointer" }}
            className={`list-jawaban-soal rounded-ss text-break ${
              "E" === jawaban?.jawabanPg && "E" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "E" === jawaban?.soal?.kjPg
                ? "bg-soft-success border-success-ss"
                : "E" === jawaban?.jawabanPg
                ? "bg-soft-danger border-danger-ss"
                : ""
            } border px-4 py-3 d-flex align-items-center mb-3`}
            onClick={() =>
              (sekolah?.id == 8123 && user?.id == 2883651) &&
              handlePutJawabanSiswa({ jawabanPg: "E", soal: jawaban?.id })
            }
          >
            <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">E</h6>
            <div className="konten-list-jawaban-soal">
              <p
                className="mb-0 dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: jawaban?.soal?.jawabanE,
                }}
              ></p>
            </div>
          </div>
        </div>

        {/* Jawaban Soal End */}

        {/* Pembahasan Soal Start */}
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Pembahasan</h6>
        <div className="konten-pembahasan-soal mb-2">
          <p
            className="mb-0 dangerous-html"
            dangerouslySetInnerHTML={{
              __html: jawaban?.soal?.pembahasan,
            }}
          ></p>
        </div>
        {/* Ini Harus Ada Buat yang PG !!! */}
        <p className="color-dark fw-bold mb-0">
          Jadi Jawaban yang tepat adalah {jawaban?.soal?.kjPg}.
        </p>
        {/* Pembahasan Soal End */}
      </div>
    </div>
  );
};

export default PenilaianPg;
