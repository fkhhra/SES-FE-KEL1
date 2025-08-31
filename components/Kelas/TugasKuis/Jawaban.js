import { showModal } from "utilities/ModalUtils";
import HasilJawabanTugas from "./HasilJawabanTugas";
import HasilJawabanTugasKuis from "./HasilJawabanTugasKuis";

const Jawaban = ({ detailData, isTugasKuis }) => {
  const showJawabanContent = (detailData?.dikumpulkan || detailData?.timeline?.tugas?.peserta?.length > 0);

  return <>

    {
      showJawabanContent
        ? isTugasKuis ? <HasilJawabanTugasKuis detailData={detailData} /> : <HasilJawabanTugas detailData={detailData} />
        : (
          <div className="d-flex align-items-center justify-content-center flex-column mt-5">
            <img src="/img/empty-state-jawaban-siswa.svg" />
            <button
              className="btn btn-primary rounded-pill shadow-primary-ss fw-bold fs-18-ss mt-4"
              onClick={() => showModal("modalKerjakanTugas")}
            >
              Kerjakan Tugas
            </button>
          </div>
        )
    }
  </>
}

export default Jawaban;