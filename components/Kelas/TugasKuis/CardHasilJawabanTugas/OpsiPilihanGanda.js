import ctl from "@netlify/classnames-template-literals";

const OpsiPilihanGanda = ({ jawaban, soal }) => {

  const listOpsiJawaban = ["A", "B", "C", "D", "E"];

  const getOpsiJawabanCN = (opsi) => ctl(`
    list-jawaban-soal rounded-ss text-break
    border px-4 py-3 d-flex align-items-center mb-3
    ${opsi === soal?.soal?.kjPg
      ? "bg-soft-success border-success-ss"
      : opsi === jawaban?.jawabanPg && "bg-soft-danger border-danger-ss"
    }
  `);

  return (
    <div className="mb-4">
      { listOpsiJawaban.map(opsi => (
        <div className={getOpsiJawabanCN(opsi)}>
          <h6 className="fs-18-ss fw-bold color-dark mb-0 me-4">
            {opsi}
          </h6>
          <div className="konten-list-jawaban-soal">
            <p
              className="mb-0 dangerous-html"
              dangerouslySetInnerHTML={{
                __html: soal?.soal?.[`jawaban${opsi}`],
              }}
            ></p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OpsiPilihanGanda;