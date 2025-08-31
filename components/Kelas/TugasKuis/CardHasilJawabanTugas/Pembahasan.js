const Pembahasan = ({ bentuk, soal }) => {
  return (
    <>
      <h6 className="fs-18-ss fw-bold color-dark me-4 mb-4">
        Pembahasan
      </h6>
      <div className="konten-pembahasan-soal mb-2">
        <p
          className="mb-0 dangerous-html"
          dangerouslySetInnerHTML={{
            __html: soal?.soal?.pembahasan,
          }}
        ></p>
      </div>

      { bentuk === "pg" && (
        <p className="color-dark fw-bold mb-0">
          {`Jadi Jawaban yang tepat adalah ${soal?.soal?.kjPg}`}
        </p>
      )}
    </>
  )
}

export default Pembahasan;