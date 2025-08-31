import React from "react";

const SoalPGKompleks = ({ soalSiswa, handlePutJawabanSiswa }) => {
  const jawaban = soalSiswa?.jawabanPgKompleks;
  return (
    <div
      className="container ujian-content-container py-md-4 py-3"
      style={{ marginTop: "83px" }}
    >
      <div className="row">
        <div className="col-md-12 mb-5">
          <div className="card card-ss p-4 mb-5">
            {/* Konten Soal Start */}

            <p
              className="mb-0 dangerous-html"
              dangerouslySetInnerHTML={{
                __html: soalSiswa?.soal?.pertanyaan,
              }}
            />
            {/* Konten Soal End */}

            {/* Jawaban Soal Start */}

            <div className="mb-4">
              <div className="form-check-exam-ss">
                <input
                  className="form-check-input form-check-radio d-none"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioJawabanA"
                  checked={jawaban?.includes("A")}
                  onClick={() =>
                    jawaban?.includes("A")
                      ? handlePutJawabanSiswa({
                          jawabanPgKompleks: [
                            ...jawaban.filter((d) => d != "A"),
                          ],
                        })
                      : handlePutJawabanSiswa({
                          jawabanPgKompleks: [...jawaban, "A"],
                        })
                  }
                />
                <label
                  className="list-jawaban-soal form-check-label rounded-ss border px-4 py-3 d-flex align-items-center mb-3 pointer"
                  htmlFor="radioJawabanA"
                >
                  <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">A</h6>
                  <div className="konten-list-jawaban-soal">
                    <p
                      className="mb-0 dangerous-html"
                      dangerouslySetInnerHTML={{
                        __html: soalSiswa?.soal?.jawabanA,
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="form-check-exam-ss">
                <input
                  className="form-check-input form-check-radio d-none"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioJawabanB"
                  checked={jawaban?.includes("B")}
                  onClick={() =>
                    jawaban?.includes("B")
                      ? handlePutJawabanSiswa({
                          jawabanPgKompleks: [
                            ...jawaban.filter((d) => d != "B"),
                          ],
                        })
                      : handlePutJawabanSiswa({
                          jawabanPgKompleks: [...jawaban, "B"],
                        })
                  }
                />
                <label
                  className="list-jawaban-soal form-check-label rounded-ss border px-4 py-3 d-flex align-items-center mb-3 pointer"
                  htmlFor="radioJawabanB"
                >
                  <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">B</h6>
                  <div className="konten-list-jawaban-soal">
                    <p
                      className="mb-0 dangerous-html"
                      dangerouslySetInnerHTML={{
                        __html: soalSiswa?.soal?.jawabanB,
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="form-check-exam-ss">
                <input
                  className="form-check-input form-check-radio d-none"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioJawabanC"
                  checked={jawaban?.includes("C")}
                  onClick={() =>
                    jawaban?.includes("C")
                      ? handlePutJawabanSiswa({
                          jawabanPgKompleks: [
                            ...jawaban.filter((d) => d != "C"),
                          ],
                        })
                      : handlePutJawabanSiswa({
                          jawabanPgKompleks: [...jawaban, "C"],
                        })
                  }
                />
                <label
                  className="list-jawaban-soal form-check-label rounded-ss border px-4 py-3 d-flex align-items-center mb-3 pointer"
                  htmlFor="radioJawabanC"
                >
                  <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">C</h6>
                  <div className="konten-list-jawaban-soal">
                    <p
                      className="mb-0 dangerous-html"
                      dangerouslySetInnerHTML={{
                        __html: soalSiswa?.soal?.jawabanC,
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="form-check-exam-ss">
                <input
                  className="form-check-input form-check-radio d-none"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioJawabanD"
                  checked={jawaban?.includes("D")}
                  onClick={() =>
                    jawaban?.includes("D")
                      ? handlePutJawabanSiswa({
                          jawabanPgKompleks: [
                            ...jawaban.filter((d) => d != "D"),
                          ],
                        })
                      : handlePutJawabanSiswa({
                          jawabanPgKompleks: [...jawaban, "D"],
                        })
                  }
                />
                <label
                  className="list-jawaban-soal form-check-label rounded-ss border px-4 py-3 d-flex align-items-center mb-3 pointer"
                  htmlFor="radioJawabanD"
                >
                  <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">D</h6>
                  <div className="konten-list-jawaban-soal">
                    <p
                      className="mb-0 dangerous-html"
                      dangerouslySetInnerHTML={{
                        __html: soalSiswa?.soal?.jawabanD,
                      }}
                    />
                  </div>
                </label>
              </div>
              <div className="form-check-exam-ss">
                <input
                  className="form-check-input form-check-radio d-none"
                  type="checkbox"
                  name="flexRadioDefault"
                  id="radioJawabanE"
                  checked={jawaban?.includes("E")}
                  onClick={() =>
                    jawaban?.includes("E")
                      ? handlePutJawabanSiswa({
                          jawabanPgKompleks: [
                            ...jawaban.filter((d) => d != "E"),
                          ],
                        })
                      : handlePutJawabanSiswa({
                          jawabanPgKompleks: [...jawaban, "E"],
                        })
                  }
                />
                <label
                  className="list-jawaban-soal form-check-label rounded-ss border px-4 py-3 d-flex align-items-center mb-3 pointer"
                  htmlFor="radioJawabanE"
                >
                  <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">E</h6>
                  <div className="konten-list-jawaban-soal">
                    <p
                      className="mb-0 dangerous-html"
                      dangerouslySetInnerHTML={{
                        __html: soalSiswa?.soal?.jawabanE,
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Jawaban Soal End */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoalPGKompleks;
