import { toast } from "react-toastify";
import { selesaiKonsultasi } from "../../../client/KonsultasiClient";
import useUser from "../../../hooks/useUser";
import { momentPackage } from "../../../utilities/HelperUtils";

const CardJadwalKonsultasi = ({ konsultasi, _getDetailKonsultasi }) => {
  const { user } = useUser();

  const isButtonDisabled =
    konsultasi?.statusSelesai === 1
      ? true
      : momentPackage().format("YYYY-MM-DD") ===
        momentPackage(konsultasi?.tanggalKonsultasi).format("YYYY-MM-DD")
      ? momentPackage().format("HH:mm:ss") < konsultasi?.jadwal?.waktuMulai
      : momentPackage() < momentPackage(konsultasi?.tanggalKonsultasi);

  const _selesaiKonsultasi = async () => {
    const { data } = await selesaiKonsultasi(
      konsultasi?.jadwal?.mPertemuanBkId,
      { statusSelesai: 1 }
    );
    if (data) {
      toast.success(data?.message);
      _getDetailKonsultasi();
    }
  };

  return (
    <div className="card card-ss mt-4">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark mb-4">Jadwal Konsultasi</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item pt-0 py-2 ps-0 mb-4">
            <h6 className="color-dark fw-bold mb-2">Tanggal Konsultasi</h6>
            <p className="color-secondary fs-18-ss mb-0">
              {momentPackage(konsultasi?.tanggalKonsultasi).format(
                "dddd, DD MMMM YYYY"
              )}
            </p>
          </li>
          <li className="list-group-item pt-0 py-2 ps-0 mb-4">
            <h6 className="color-dark fw-bold mb-2">Waktu</h6>
            <p className="color-secondary fs-18-ss mb-0">
              {konsultasi?.jadwal?.waktuMulai} -{" "}
              {konsultasi?.jadwal?.waktuBerakhir}
            </p>
          </li>
          <li className="list-group-item pt-0 py-2 ps-0 mb-4">
            <h6 className="color-dark fw-bold mb-2">Media Konsultasi</h6>
            <p className="color-secondary fs-18-ss mb-0">
              {konsultasi?.mediaKonsultasi}
            </p>
          </li>
          {konsultasi?.mediaKonsultasi === "Bertemu Langsung" && (
            <li className="list-group-item pt-0 py-2 ps-0 mb-4">
              <h6 className="color-dark fw-bold mb-2">Lokasi Konsultasi</h6>
              <p className="color-secondary fs-18-ss mb-0">
                {konsultasi?.jadwal?.media}
              </p>
            </li>
          )}
          <li className="list-group-item pt-0 py-2 ps-0 mb-4">
            <h6 className="color-dark fw-bold mb-2">Keterangan</h6>
            <p className="color-secondary fs-18-ss mb-0">
              {konsultasi?.jadwal?.keterangan}
            </p>
          </li>
        </ul>

        <div className="d-flex align-items-center">
          {user?.role === "guru" && (
            <button
              className="btn btn-outline-primary btn-outline-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer w-100 me-3"
              style={{ height: 80 }}
              disabled={isButtonDisabled}
              onClick={_selesaiKonsultasi}
            >
              <p className="fw-bold mb-0 ms-3">Konsultasi Selesai</p>
            </button>
          )}
          {konsultasi?.mediaKonsultasi === "Meeting Online" && (
            <button
              className="btn btn-primary btn-primary-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer w-100"
              style={{ height: 80 }}
              onClick={() => window.open(konsultasi?.jadwal?.media, "_blank")}
              disabled={isButtonDisabled}
            >
              <img src="/img/icon-tatap-muka.svg" />
              <p className="fw-bold mb-0 ms-3">Meeting Online</p>
            </button>
          )}
          {konsultasi?.mediaKonsultasi === "Whatsapp" && (
            <button
              className="btn btn-success btn-success-ss rounded-ss py-4 d-flex align-items-center justify-content-center pointer w-100"
              style={{ height: 80 }}
              disabled={isButtonDisabled}
              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send?phone=${konsultasi?.userGuru?.whatsapp}`,
                  "_blank"
                )
              }
            >
              <img src="/img/whatsapp.svg" />
              <p className="fw-bold mb-0 ms-3">Whatsapp</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardJadwalKonsultasi;
