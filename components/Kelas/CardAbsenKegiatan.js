import { useState } from "react";
import { FaCalendar } from "react-icons/fa";
import KegiatanKelasItem from "./KegiatanKelasItem";
import AnimateHeight from "react-animate-height";
import { uuid } from "uuidv4";

const CardAbsenKegiatan = ({
  tanggalKegiatan,
  mataPelajaran,
  id
}) => { 

  const listAllMataPelajaran = Object.keys(mataPelajaran);

  return (
    <div className="col-lg-10 mb-4">
      <div className="card card-ss px-4 py-0">
        <span className="label-ss rounded-pill bg-secondary text-white fs-12-ss fw-bold mt-4 d-flex align-items-center" style={{ width: "min-content", whiteSpace: "nowrap" }}>
          <FaCalendar className="me-2" /> {tanggalKegiatan}
        </span>
        <hr />
        <div className="py-0 ">
          { listAllMataPelajaran.map((mataPelajaranNama, index) => {
            const isLastIndex = listAllMataPelajaran.length-1 == index;
            const listKegiatan = mataPelajaran[mataPelajaranNama];

            return <>
              <Accordion header={mataPelajaranNama} key={uuid()}>
                { listKegiatan?.map(dt =>
                  <KegiatanKelasItem
                    key={uuid()}
                    id={id}
                    type={dt?.tipeKegiatan}
                    data={dt}
                    isGuru
                    showDropdownAction={false}
                  />
                )}
              </Accordion>
              { !isLastIndex && <hr />}
            </>
          })}
        </div>
      </div>
    </div>
  )
}

const Accordion = ({ header, children }) => {

  const [height, setHeight] = useState(0);

  return <>
    <div className="d-flex align-items-center justify-content-between w-100 mb-3">
      <div
        className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-3"
        style={{ width: "50px", height: "50px" }}
      >
        <img src="/img/icon-kegiatan.svg" alt="icon-kegiatan" />
      </div>
      <div className="d-flex align-items-center justify-content-between w-100">
        <h5 className="fw-extrabold color-dark mb-0">
          {header}
        </h5>

        <img
          onClick={() => setHeight(height === 0 ? "auto" : 0)}
          src="/img/chevron-bottom.svg"
          className={`pointer ${height != 0 ? "rotate-180" : ""}`}
          style={{ transition: "0.3s" }}
        />
      </div>
    </div>

    <AnimateHeight height={height}>
      {children}
    </AnimateHeight>
  </>
}

export default CardAbsenKegiatan;