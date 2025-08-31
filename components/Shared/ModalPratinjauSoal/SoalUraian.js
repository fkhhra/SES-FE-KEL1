const SoalUraian = ({ data }) => {
  return (
    <div>
      <div
        className="content-soal mb-4"
        dangerouslySetInnerHTML={{ __html: data?.soal?.pertanyaan }}
      ></div>

      <div className="jawaban-soal mb-4">
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Jawaban</h6>
        <div className="mb-3">
          <div className="row">
            <div className="col-md-6">
              <div
                className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                  data?.soal?.kjUraian == "A"
                    ? "bg-soft-success border border-success-ss"
                    : "border border-light-secondary-ss"
                }`}
              >
                <div className="konten-list-jawaban-soal">
                  <p className="mb-0">{data?.soal?.opsiAUraian}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className={`list-jawaban-soal rounded-ss px-4 py-3 d-flex align-items-center mb-3 ${
                  data?.soal?.kjUraian == "B"
                    ? "bg-soft-success border border-success-ss"
                    : "border border-light-secondary-ss"
                }`}
              >
                <div className="konten-list-jawaban-soal">
                  <p className="mb-0"> {data?.soal?.opsiBUraian}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Pembahasan</h6>
        <div
          className="konten-pembahasan-soal"
          dangerouslySetInnerHTML={{ __html: data?.soal?.pembahasan }}
        >
          {/* <p>
            Yang dimaksud dengan unsur Intrinsik dan unsur Ekstrinsik adalah
          </p>
          <p>
            a. Unsur Intrinsik: unsur yang membangun dari dalam karya tersebut,
            seperti tema, alur, penokohan, dan sebagainya
          </p>
          <p className="mb-0">
            b. Unsur Ekstrinsik: unsur yang membangun di luar karya tersebut,
            seperti budaya dan latar belakang pengarangnya.
          </p> */}
        </div>
      </div>

      {/* <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">Rubrik</h6>
      <div className="rubrik-container">
        <div className="rubrik-items form-check-ss d-flex mb-3">
          <label
            className="form-check-label p-4 rounded-ss border border-light-secondary-ss w-100"
            htmlFor="rubrik1"
          >
            <span
              className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-3"
              style={{
                width: "75px",
                height: "25px",
              }}
            >
              5 Poin
            </span>
            <p className="mb-0">Jelaskan unsur Intrinsik</p>
          </label>
        </div>
        <div className="rubrik-items form-check-ss d-flex mb-3">
          <label
            className="form-check-label p-4 rounded-ss border border-light-secondary-ss w-100"
            htmlFor="rubrik2"
          >
            <span
              className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-3"
              style={{
                width: "75px",
                height: "25px",
              }}
            >
              5 Poin
            </span>
            <p className="mb-0">Jelaskan unsur Ekstrinsik</p>
          </label>
        </div>
      </div> */}
    </div>
  );
};

export default SoalUraian;
