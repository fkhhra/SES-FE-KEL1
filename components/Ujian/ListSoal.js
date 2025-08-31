import useSekolah from "hooks/useSekolah";
import useTa from "hooks/useTa";
import useUjian from "hooks/useUjian";
import React from "react";
import { FaTrashAlt, FaPen } from "react-icons/fa";
export const ListSoal = ({
  soal,
  handleDeleteSoalUjianData,
  handleClickEditSoalUjian,
  nomor,
}) => {
  const { detailUjianData } = useUjian();
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
  const { ta } = useTa();
  const { sekolah } = useSekolah();
  console.log(soal?.nilaiSoal)
  return (
    <>
      <div className="kuis-component">
        <div
          className="kuis-card rounded-ss mb-3 border border-secondary border-light-secondary-ss p-3"
          data-joyride="list-soal"
        >
          {/* Info Soal Start */}

          <div className="d-flex justify-content-center align-items-center justify-content-md-start justify-content-between pb-3 border-bottom border-light-secondary-ss flex-wrap">
            <span
              className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-sm-auto mb-sm-0 mb-1"
              style={{
                minWidth: "75px",
                height: "25px",
              }}
            >
              {soal?.nilaiSoal} Poin
            </span>
            <span
              className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-3 px-2 mb-sm-0 mb-1"
              style={{
                minWidth: "75px",
                minHeight: "25px",
              }}
            >
              {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi"
                ? `${
                    (ujian?.tingkat == "X" && ta?.tingkat1 == "2013") ||
                    (ujian?.tingkat == "XI" && ta?.tingkat2 == "2013") ||
                    (ujian?.tingkat == "XII" && ta?.tingkat3 == "2013")
                      ? "KD / CP"
                      : "Elemen"
                  } ${soal?.kd}`
                : kontenMateri.find((d) => d.value == soal?.akmKontenMateri)
                    ?.label}
            </span>
            <span
              className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center text-uppercase"
              style={{
                minWidth: "75px",
                height: "25px",
              }}
            >
              {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi"
                ? `${soal?.levelKognitif}`
                : prosesKognitif.find((d) => d.value == soal?.akmProsesKognitif)
                    ?.label}
            </span>
          </div>
          {/* Info Soal End */}
          <div className="d-flex align-items-md-center flex-lg-nowrap flex-md-row flex-column flex-wrap pt-3">
            <div
              className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fw-extrabold color-dark me-3 p-3"
              style={{
                width: "40px",
                height: "40px",
              }}
            >
              {nomor}
            </div>
            <div className="d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row flex-grow-1">
              <div className="soal-content p-md-1 p-0 m-md-0 mt-3 mb-4 text-break">
                <p
                  className="mb-0 color-secondary pe-3 dangerous-html"
                  dangerouslySetInnerHTML={{
                    __html: soal?.pertanyaan?.replace("b&", "..."),
                  }}
                ></p>
              </div>
              <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
                <button
                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-lg-2 mb-lg-0 mb-md-2 mb-0"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#modalBuatSoalUjian"
                  onClick={() => handleClickEditSoalUjian(soal)}
                  data-joyride="btn-edit-soal"
                >
                  <FaPen className="color-secondary" />
                </button>
                <button
                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => handleDeleteSoalUjianData(soal?.id)}
                  data-joyride="btn-delete-soal"
                >
                  <FaTrashAlt className="color-secondary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
