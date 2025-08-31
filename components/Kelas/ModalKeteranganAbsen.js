import { FaFile } from "react-icons/fa";
import useAbsenSiswa from "../../hooks/useAbsenSiswa";
import NewModal from "../Shared/NewModal/NewModal";
import WhatsappLink from "../Shared/WhatsappLink/WhatsappLink";

const ModalKeteranganAbsen = () => {

  const { absenSiswa } = useAbsenSiswa();

  return (
    <NewModal
      modalId="keteranganAbsen"
      title={absenSiswa?.user?.nama}
      content={
        <>
          <h6 className="fs-18-ss fw-bold color-dark mb-2">
            Keterangan {absenSiswa?.absen}
          </h6>
          <p className="color-secondary fw-semibold mb-4 fs-14-ss">
            Dikirim pada {absenSiswa?.createdAt}
          </p>
          <p className="color-secondary">{absenSiswa?.keterangan}</p>
          {absenSiswa?.lampiran?.map((lampiran) => {
            return (
              <div className="mt-3">
                <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                  <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                        <FaFile className="text-white fs-3" />
                      </div>
                      <div className="p-2">
                        <p className="fw-bold color-dark mb-0">
                          {lampiran}
                        </p>
                        <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                          {/* PDF */}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${lampiran}`}
                        className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                      >
                        Pratinjau
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      }
      submitButton={
        <WhatsappLink
          phoneNumber={absenSiswa?.user?.whatsapp}
          text={`Absensi sudah saya terima, tanggal ${absenSiswa?.createdAt} presensi kamu *${absenSiswa?.absen}* dengan keterangan *${absenSiswa?.keterangan}* Terimakasih`}
        >
          <button className="btn btn-primary">Verifikasi</button>
        </WhatsappLink>
      }
    />
  )
}

export default ModalKeteranganAbsen;