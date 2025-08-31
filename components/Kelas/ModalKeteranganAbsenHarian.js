import FileAttachment from "components/Shared/FileAttachment/FileAttachment";
import { FaFile } from "react-icons/fa";
import { getFileName } from "utilities/FileViewer";
import { momentPackage } from "utilities/HelperUtils";
import useAbsenSiswa from "../../hooks/useAbsenSiswa";
import NewModal from "../Shared/NewModal/NewModal";
import WhatsappLink from "../Shared/WhatsappLink/WhatsappLink";

const ModalKeteranganAbsenHarian = () => {
  const { absenSiswa } = useAbsenSiswa();

  return (
    <NewModal
      modalId="modalKeteranganAbsen"
      title={<h4 className="mb-0 fw-bold">{absenSiswa?.nama}</h4>}
      content={
        <>
          <h6 className="fs-18-ss fw-bold color-dark mb-2">
            Keterangan {absenSiswa?.status}
          </h6>
          <p className="color-secondary fw-semibold mb-4 fs-14-ss">
            Dikirim pada{" "}
            {absenSiswa?.createdAt &&
              momentPackage(absenSiswa?.createdAt).format(
                "DD MMMM YYYY HH : mm : ss"
              )}
          </p>
          <p className="color-secondary">{absenSiswa?.keterangan}</p>
          {absenSiswa?.lampiran?.map((data) => (
            <FileAttachment nama={getFileName(data)} href={data} />
          ))}
        </>
      }
      removeFooter={true}
      //   submitButton={
      //     <WhatsappLink
      //       phoneNumber={absenSiswa?.user?.whatsapp}
      //       text={`Absensi sudah saya terima, tanggal ${absenSiswa?.createdAt} presensi kamu *${absenSiswa?.absen}* dengan keterangan *${absenSiswa?.keterangan}* Terimakasih`}
      //     >
      //       <button className="btn btn-primary">Verifikasi</button>
      //     </WhatsappLink>
      //   }
    />
  );
};

export default ModalKeteranganAbsenHarian;
