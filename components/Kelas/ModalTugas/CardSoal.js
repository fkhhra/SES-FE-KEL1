import useBuatTugas from "hooks/useBuatTugas";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { showModal } from "utilities/ModalUtils";

const CardSoal = ({ soal, index }) => {

  const { stateBuatTugas, changeStateBuatTugas } = useBuatTugas();

  const deleteSoal = () => {
    const newSoal = stateBuatTugas?.soal?.filter(({ id }) => id !== soal?.id);
    changeStateBuatTugas("soal", newSoal);
  }

  return (
    <div className="kuis-card rounded-ss mt-3 d-flex align-items-md-center border border-secondary border-light-secondary-ss p-3 flex-lg-nowrap flex-md-row flex-column flex-wrap">
      <div
        className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fw-extrabold color-dark me-3 p-3"
        style={{
          width: "40px",
          height: "40px",
        }}
      >
        {index+1}
      </div>
      <div className="d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row flex-grow-1">
        <div className="soal-content fs-14-ss p-md-1 p-0 m-md-0 my-3">
          <div className="mb-0 color-secondary" dangerouslySetInnerHTML={{ __html: soal?.pertanyaan }} />
        </div>
        
        <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
          <div
            className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-lg-2 mb-2 pointer"
            style={{
              width: "40px",
              height: "40px",
            }}
            onClick={() => showModal(soal?.bentuk == "pg" ? "ModalSoalPilihanGanda" : "ModalSoalEsai")}
          >
            <FaPen className="color-secondary" />
          </div>
          <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
            <div
              className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
              style={{
                width: "40px",
                height: "40px",
              }}
              onClick={() => deleteSoal()}
            >
              <FaTrashAlt className="color-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSoal;