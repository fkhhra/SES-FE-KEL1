import ctl from "@netlify/classnames-template-literals";

const Header = ({ jawabanPilihanGandaBenar, bentuk, jawaban }) => {
  
  const totalPoinEsai = JSON.parse(jawaban?.jawabanRubrikEsai || "[]")
    .filter((item) => item.benar)
    .reduce((a, b) => a + parseInt(b.poin), 0);

  const labelCN = ctl(`
    label-ss
    px-4
    fw-bold
    ${(jawabanPilihanGandaBenar || totalPoinEsai) > 0 ? "bg-soft-success color-success" : bentuk === "esai" && !jawaban?.dinilai ? "bg-soft-secondary color-secondary" : "bg-soft-danger color-danger"}
    rounded-pill
  `);

  return (
    <div className="card-header card-header-ss py-4 border-bottom border-light-secondary-ss" style={{ margin: "0 1.5rem", padding: 0 }}>
      <span className={labelCN}>
        { bentuk === "esai" && !jawaban?.dinilai ? "Belum Dinilai" : (jawabanPilihanGandaBenar || totalPoinEsai > 0) ? "Benar" : "Salah"}
      </span>
    </div>
  )
}

export default Header;