import { momentPackage } from "../../utilities/HelperUtils";

const SectionTandaTanganSmkKampungJawaPrint = ({
  isReadOnly = false,
  walikelas,
  ta,
  sekolah,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-4 mb-4">
        <div className="text-center">
          <h6 className="fs-12-ss mb-2">Mengetahui</h6>
          <h6 className="fs-12-ss" style={{ marginBottom: "85px" }}>
            Orang Tua / Wali
          </h6>
          <div
            className="w-100 mb-1"
            style={{
              height: "1px",
              borderTop: "1.35px dashed #000000",
            }}
          ></div>
        </div>
        <div className="text-center">
          <h6 className="fs-12-ss mb-2">
            {sekolah?.provinsi}{" "}
            {momentPackage(ta?.tanggalRapor).format(", DD MMMM YYYY")}
          </h6>
          <h6 className="fs-12-ss" style={{ marginBottom: "85px" }}>
            Wali Kelas
          </h6>
          {walikelas?.user?.nama ? (
            <h6 className="fs-12-ss mb-0">{walikelas?.user?.nama}</h6>
          ) : (
            <div
              className="w-100 mb-1"
              style={{
                height: "1px",
                borderTop: "1.35px dashed #000000",
              }}
            ></div>
          )}
          <h6 className="fs-12-ss text-uppercase mb-0">
            NIP.
            {!walikelas?.user?.nip ? `-` : `${walikelas?.user?.nip}`}
          </h6>
        </div>
      </div>
      {/* <div className="d-flex justify-content-center align-items-center px-4">
        <div className="text-center">
          <h6 className="fs-12-ss mb-2">Mengetahui</h6>
          <h6 className="fs-12-ss" style={{ marginBottom: "85px" }}>
            Kepala Sekolah
          </h6>
          {ta?.namaKepsek ? (
            <h6 className="fs-12-ss mb-0">{ta?.namaKepsek}</h6>
          ) : (
            <div
              className="w-100 mb-1"
              style={{
                height: "1px",
                borderTop: "1.35px dashed #000000",
              }}
            ></div>
          )}
          <h6 className="fs-12-ss text-uppercase mb-0">
            {sekolah?.id == 33 ? "NUKS." : "NIP."}{" "}
            {!ta?.nipKepsek ? `-` : `${ta?.nipKepsek}`}
          </h6>
        </div>
      </div> */}
    </>
  );
};

export default SectionTandaTanganSmkKampungJawaPrint;
