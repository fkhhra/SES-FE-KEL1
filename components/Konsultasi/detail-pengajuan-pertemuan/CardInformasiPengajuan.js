import useUser from "../../../hooks/useUser";
import { momentPackage } from "../../../utilities/HelperUtils";

const CardInformasiPengajuan = ({ konsultasi }) => {
  const { user } = useUser();

  return (
    <div className="card card-ss">
      <div className="card-body p-4">
        <h4 className="fw-extrabold color-dark mb-4">
          Informasi Pengajuan Pertemuan
        </h4>
        <ul className="list-group list-group-flush">
          {/* SHOW ONLY FOR GURU */}
          {user?.role === "guru" && (
            <>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Kelas</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.user?.anggotaRombel?.rombel?.nama || "-"}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">No. Telepon</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.user?.whatsapp}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Alamat</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.user?.profil?.alamat}
                </p>
              </li>
            </>
          )}

          {/* SHOW FOR SISWA AND GURU */}
          {(user?.role === "siswa" || user?.role === "guru") && (
            <>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Keperluan</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.keperluan || "-"}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Tanggal Pengajuan</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {momentPackage(konsultasi?.createdAt).format(
                    "dddd, DD MMMM YYYY"
                  )}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Tanggal Konsultasi</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {momentPackage(konsultasi?.tanggalKonsultasi).format(
                    "dddd, DD MMMM YYYY"
                  )}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Media Konsultasi</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.mediaKonsultasi || "-"}
                </p>
              </li>
              <li className="list-group-item pt-0 py-2 ps-0 mb-4">
                <h6 className="color-dark fw-bold mb-2">Keterangan</h6>
                <p className="color-secondary fs-18-ss mb-0">
                  {konsultasi?.keterangan || "-"}
                </p>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CardInformasiPengajuan;
