const Pertanyaan = ({ soal }) => {
  return (
    <div className="mb-4">
      <p
        className="m-0 dangerous-html"
        dangerouslySetInnerHTML={{ __html: soal?.soal?.pertanyaan }}
      />
    </div>
  )
}

export default Pertanyaan;