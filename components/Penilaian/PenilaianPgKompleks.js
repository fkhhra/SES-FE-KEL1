import React from "react";

const PenilaianPgKompleks = ({ jawaban, idx, pesertaUjian }) => {
  const jawabanSiswa = jawaban?.jawabanPgKompleks;
  const jawabanKjKompleks = jawaban?.soal?.jawabanPgKompleks?.split(",");

  const check1 = jawabanKjKompleks?.every((e) =>
    jawaban?.jawabanPgKompleks.includes(e)
  );
  const check2 = jawaban?.jawabanPgKompleks?.every((e) =>
    jawaban?.soal?.jawabanPgKompleks?.includes(e)
  );
  let nilaiJawaban;
  if (check1 && check2) {
    nilaiJawaban = 1;
  }
  return (
    <div className="detail-jawaban-peserta-pg card card-ss bg-white rounded-ss mb-4">
      <div className="card-header card-header-ss p-4 border-bottom border-light-secondary-ss">
        <span
          className={`label-ss px-4 fw-bold ${
            nilaiJawaban === 1
              ? "bg-soft-success color-success"
              : "bg-soft-danger color-danger"
          } rounded-pill`}
        >
          {nilaiJawaban === 1 ? "Benar" : "Salah"}
        </span>
      </div>
      <div className="card-body p-4">
        <div className="content-soal mb-4">
          <p
            className="m-0"
            dangerouslySetInnerHTML={{ __html: jawaban?.soal?.pertanyaan }}
          >
            {/* {jawaban?.soal?.pertanyaan} */}
          </p>
        </div>
        <div className="jawaban-soal mb-4">
          {jawaban?.soal?.jawabanA?.trim() ? (
            <div
              className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                jawabanSiswa?.includes("A")
                  ? jawaban?.soal?.jawabanPgKompleks?.includes("A")
                    ? "bg-soft-success border-success-ss"
                    : "bg-soft-danger border-danger-ss"
                  : "border border-light-secondary-ss"
              }`}
            >
              <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">A</h6>
              <div
                className="konten-list-jawaban-soal"
                dangerouslySetInnerHTML={{ __html: jawaban?.soal?.jawabanA }}
              ></div>
            </div>
          ) : null}
          {jawaban?.soal?.jawabanB?.trim() ? (
            <div
              className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                jawabanSiswa?.includes("B")
                  ? jawaban?.soal?.jawabanPgKompleks?.includes("B")
                    ? "bg-soft-success border-success-ss"
                    : "bg-soft-danger border-danger-ss"
                  : "border border-light-secondary-ss"
              }`}
            >
              <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">B</h6>
              <div
                className="konten-list-jawaban-soal"
                dangerouslySetInnerHTML={{ __html: jawaban?.soal?.jawabanB }}
              ></div>
            </div>
          ) : null}
          {jawaban?.soal?.jawabanC?.trim() ? (
            <div
              className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                jawabanSiswa?.includes("C")
                  ? jawaban?.soal?.jawabanPgKompleks?.includes("C")
                    ? "bg-soft-success border-success-ss"
                    : "bg-soft-danger border-danger-ss"
                  : "border border-light-secondary-ss"
              }`}
            >
              <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">C</h6>
              <div
                className="konten-list-jawaban-soal"
                dangerouslySetInnerHTML={{ __html: jawaban?.soal?.jawabanC }}
              ></div>
            </div>
          ) : null}
          {jawaban?.soal?.jawabanD?.trim() ? (
            <div
              className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                jawabanSiswa?.includes("D")
                  ? jawaban?.soal?.jawabanPgKompleks?.includes("D")
                    ? "bg-soft-success border-success-ss"
                    : "bg-soft-danger border-danger-ss"
                  : "border border-light-secondary-ss"
              }`}
            >
              <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">D</h6>
              <div
                className="konten-list-jawaban-soal"
                dangerouslySetInnerHTML={{ __html: jawaban?.soal?.jawabanD }}
              ></div>
            </div>
          ) : null}
          {jawaban?.soal?.jawabanE?.trim() ? (
            <div
              className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                jawabanSiswa?.includes("E")
                  ? jawaban?.soal?.jawabanPgKompleks?.includes("E")
                    ? "bg-soft-success border-success-ss"
                    : "bg-soft-danger border-danger-ss"
                  : "border border-light-secondary-ss"
              }`}
            >
              <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">E</h6>
              <div
                className="konten-list-jawaban-soal"
                dangerouslySetInnerHTML={{ __html: jawaban?.soal?.jawabanE }}
              ></div>
            </div>
          ) : null}
        </div>
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Pembahasan</h6>
        <div
          className="konten-pembahasan-soal mb-2"
          dangerouslySetInnerHTML={{ __html: jawaban?.soal?.pembahasan }}
        ></div>
        <p className="color-dark fw-bold mb-0">
          Jadi Jawaban yang tepat adalah {jawaban?.soal?.jawabanPgKompleks}
        </p>
        {/* Info Soal Start */}
        {/* Pembahasan Soal End */}
      </div>
    </div>
  );
};

export default PenilaianPgKompleks;
