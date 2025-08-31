import React from "react";

const CardKeteranganAbsen = ({
  type,
  onClick = () => {},
  active
}) => {

  const wrapperClassname = () => {
    return `
      ${type === "hadir" ? "card-absen-hadir" : type === "izin" ? "card-absen-izin" : "card-absen-sakit"}
      card
      mb-3 pointer
      rounded-ss border-2
      ${active ? "active pe-none" : ""}
    `
  }

  return (
    <div className={wrapperClassname()} onClick={onClick}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center">
          <img src={`/img/icon-absen-${type === "hadir" ? "hadir" : type === "izin" ? "izin" : "sakit"}.svg`}/>
          <div className="ms-4 color-secondary">
            <p className="mb-1 fs-14-ss">Hari ini</p>
            <h5 className="m-0 fw-bold">
              {`Saya ${type === "hadir" ? "Hadir" : type === "izin" ? "Izin" : "Sakit"}`}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardKeteranganAbsen;