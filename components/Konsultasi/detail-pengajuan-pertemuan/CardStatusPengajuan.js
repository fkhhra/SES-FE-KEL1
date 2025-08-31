import { postJadwalKonsultasi } from "../../../client/KonsultasiClient";

const CardStatusPengajuan = ({ konsultasi, setStatusPengajuan }) => {

  const disabledButton = konsultasi?.status !== undefined && konsultasi?.status !== null;

  return (
    <div className="card card-ss mt-4">
      <div className="card-body">
        <h4 className="fw-extrabold color-dark">
          Status Pengajuan
        </h4>
        <p className="fw-bold mb-0">
          Pastikan Pengajuan pertemuan sesuai dengan jadwal anda.
        </p>

        <div className="d-flex align-items-center w-100 mt-5">
          <button className="btn btn-outline-danger-ss w-50 py-3 me-4 rounded-ss" onClick={() => setStatusPengajuan("ditolak")} disabled={disabledButton}>
            Tolak Pengajuan Konsultasi
          </button>
          <button className="btn btn-primary bg-gradient-primary shadow-primary-ss fw-bold w-50 py-3 rounded-ss" onClick={() => setStatusPengajuan("diterima")} disabled={disabledButton}>
            Terima Pengajuan Konsultasi
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardStatusPengajuan;