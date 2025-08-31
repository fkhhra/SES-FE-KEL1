import { useState } from "react";
import { toast } from "react-toastify";
import { postJadwalKonsultasi } from "../../../client/KonsultasiClient";

const CardBuatPenolakanKonsultasi = ({ konsultasi, _getDetailKonsultasi }) => {
  const [inputValue, setInputValue] = useState(konsultasi?.jadwal?.keterangan);

  const updateKeteranganPenolakan = async () => {
    let body = {
      status: 0,
      keterangan: inputValue,
    };

    const { data } = await postJadwalKonsultasi(body, konsultasi?.id);
    if (data) {
      _getDetailKonsultasi();
      toast.success(data?.message);
    }
  };

  return (
    <div className="card card-ss mt-4">
      <div className="card-body">
        <h4 className="fw-extrabold color-dark">
          Keterangan Penolakan Pengajuan
        </h4>

        <div className="mb-4">
          <label className="form-label">Keterangan</label>
          {!konsultasi?.jadwal?.keterangan ? (
            <input
              className="form-control"
              autoComplete="off"
              type="text"
              name="golDarah"
              placeholder="Masukkan Keterangan"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          ) : (
            <p>{konsultasi?.jadwal?.keterangan}</p>
          )}
        </div>

        {!konsultasi?.jadwal?.keterangan && (
          <button
            className="w-100 btn btn-primary btn-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer"
            onClick={() => updateKeteranganPenolakan()}
            disabled={false}
          >
            <p className="fw-bold mb-0 ms-3">Masukkan Keterangan</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default CardBuatPenolakanKonsultasi;
