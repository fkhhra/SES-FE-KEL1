const SoalInfo = ({ index, totalSoal, jawaban, soal, jawabanPilihanGandaBenar, bentuk }) => {

  const getPoin = () => {
    if (bentuk === "esai") {
      return JSON.parse(jawaban?.jawabanRubrikEsai || "[]").filter((item) => item.benar).reduce((a, b) => a + parseInt(b.poin), 0);
    } else if (bentuk === "pg") {
      return jawabanPilihanGandaBenar ? soal?.soal?.nilaiSoal : "0";
    }
  }

  return (
    <div className="d-flex align-items-md-center justify-content-between flex-md-row flex-column mb-4">
      <div className="d-flex align-items-center justify-content-md-start justify-content-between">
        <h6 className="fs-18-ss fw-bold color-dark me-4 mb-0">
          {`Soal ${index+1} / ${totalSoal}`}
        </h6>
        <span className="label-ss rounded-pill bg-light-primary color-primary fs-12-ss fw-bold">
          {jawaban?.durasi}
        </span>
      </div>
      <hr className="d-md-none hr-ss" />
      <div className="d-flex justify-content-center align-items-center justify-content-md-start justify-content-between flex-wrap">
        { soal?.soal?.kd && (
          <span
            className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-3 px-2 mb-sm-0 mb-2"
            style={{
              minWidth: "75px",
              minHeight: "25px",
            }}
          >
            {`KD ${soal?.soal?.kd}`}
          </span>
        )}
        { soal?.soal?.levelKognitif && (
          <span
            className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-md-3 me-auto text-uppercase mb-sm-0 mb-2"
            style={{
              width: "75px",
              height: "25px",
            }}
          >
            {soal?.soal?.levelKognitif}
          </span>
        )}
        <span
          className={`${getPoin() > 0 ? "bg-primary" : "bg-danger"} text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center mb-sm-0 mb-2`}
          style={{
            minWidth: "75px",
            height: "25px",
          }}
        >
          {`${getPoin()} Poin`}
        </span>
      </div>
    </div>
  )
}

export default SoalInfo;