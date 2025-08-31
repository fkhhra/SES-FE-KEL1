import React from "react";
import AudioPlayer from "components/Shared/AudioPlayer/AudioPlayer";
import { alphabet } from "utilities/HelperUtils";

const PenilaianMenjodohkan = ({ jawaban, idx, pesertaUjian, ta }) => {
  const jawabanSiswa = jawaban?.jawabanMenjodohkan || [];
  // const jawabanSiswaNilai = jawaban?.jawabanMenjodohkan?.map((e) => e) || [];
  const jawabanSoal = jawaban?.soal?.soalMenjodohkan?.map(
    (e) => parseInt(e?.jawaban) + 1
  );
  // const nilaiSiswa = jawaban?.soal?.soalMenjodohkan;
  let totalNilai = "";
  // for (let i = 0; i < nilaiSiswa?.length; i++) {
  //   if (jawabanSiswaNilai?.[idx]) {

  //   }
  //   totalNilai == jawabanSoal?.[i]?.poin;
  // }

  // const totalNilai = jawaban?.soal?.soalMenjodohkan?.map((e) =>
  //   parseInt(e?.poin)
  // );

  return (
    <div className="detail-jawaban-peserta-pg card card-ss bg-white rounded-ss mb-4">
      <div className="card-header card-header-ss p-4 border-bottom border-light-secondary-ss">
        <span
          className={`label-ss px-4 fw-bold ${
            JSON.stringify(jawabanSiswa) == JSON.stringify(jawabanSoal)
              ? "bg-soft-success color-success"
              : "bg-soft-danger color-danger"
          } rounded-pill`}
        >
          {JSON.stringify(jawabanSiswa) == JSON.stringify(jawabanSoal)
            ? "Benar"
            : "Salah"}
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
            {/* {JSON.stringify(jawabanSiswa) == JSON.stringify(jawabanSoal) ? (
              <span
                className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center px-2 mb-sm-0 mb-2"
                style={{
                  minWidth: "75px",
                  height: "25px",
                }}
              >
                {totalNilai} Poin
              </span>
            ) : (
              <span
                className="bg-danger text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-sm-0 mb-2"
                style={{
                  width: "75px",
                  height: "25px",
                }}
              >
                {jawaban?.soal?.nilaiSoal || 0} Poin
              </span>
            )} */}
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
          <h4
            className="fw-bold color-dark mb-4"
            dangerouslySetInnerHTML={{
              __html: jawaban?.soal?.pertanyaan,
            }}
          ></h4>
          {jawaban?.soal?.soalMenjodohkan?.map((item, idx) => {
            return (
              <div className="rounded-ss border border-light-secondary p-3 mb-4">
                <div className="mb-4 d-flex justify-content-between">
                  <span
                    className="px-3 border border-primary-ss rounded-pill color-primary fs-14-ss fw-extrabold"
                    style={{ paddingTop: "2px", paddingBottom: "2px" }}
                  >
                    Soal {idx + 1}
                  </span>
                  {jawabanSiswa[idx] - 1 ==
                  jawaban?.soal?.soalMenjodohkan[idx].jawaban ? (
                    <span
                      className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center px-2 mb-sm-0 mb-2"
                      style={{
                        minWidth: "75px",
                        height: "25px",
                      }}
                    >
                      {item?.poin} Poin
                    </span>
                  ) : (
                    <span
                      className="bg-danger text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-sm-0 mb-2"
                      style={{
                        width: "75px",
                        height: "25px",
                      }}
                    >
                      {0} Poin
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p
                    className="m-0"
                    dangerouslySetInnerHTML={{
                      __html: item?.soal,
                    }}
                  ></p>
                </div>
                <div className="mb-4">
                  <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
                    Jawaban
                  </h6>
                  <div
                    className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                      jawabanSiswa[idx] - 1 ==
                      jawaban?.soal?.soalMenjodohkan[idx].jawaban
                        ? "bg-soft-success border-success-ss "
                        : "bg-soft-danger border-danger-ss"
                    }`}
                  >
                    <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">
                      {alphabet[jawabanSiswa[idx] - 1]}
                    </h6>
                    <div className="konten-list-jawaban-soal">
                      <p
                        className="mb-0"
                        dangerouslySetInnerHTML={{
                          __html:
                            jawaban?.soal?.pilihanMenjodohkan[
                              jawabanSiswa[idx] - 1
                            ],
                        }}
                      ></p>
                    </div>
                  </div>
                </div>

                <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
                  Pembahasan
                </h6>
                <div className="konten-pembahasan-soal mb-2">
                  <p
                    className="mb-0"
                    dangerouslySetInnerHTML={{
                      __html: item?.pembahasan,
                    }}
                  ></p>
                </div>
                <p className="color-dark fw-bold mb-0">
                  Jadi Jawaban yang tepat adalah {alphabet[item?.jawaban]}.
                </p>
              </div>
            );
          })}
        </div>

        {/* Jawaban Soal End */}

        {/* Pembahasan Soal Start */}
        {/* <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Pembahasan</h6>
        <div className="konten-pembahasan-soal mb-2">
          <p
            className="mb-0 dangerous-html"
            dangerouslySetInnerHTML={{
              __html: jawaban?.soal?.pembahasan,
            }}
          ></p>
        </div> */}
        {/* Ini Harus Ada Buat yang PG !!! */}
        {/* <p className="color-dark fw-bold mb-0">
          Jadi Jawaban yang tepat adalah {jawaban?.soal?.kjPg}.
        </p> */}
        {/* Pembahasan Soal End */}
      </div>
    </div>
  );
};

export default PenilaianMenjodohkan;
