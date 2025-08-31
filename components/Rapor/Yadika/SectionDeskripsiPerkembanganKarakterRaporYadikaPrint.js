import {
  getDeskripsiSikapYadika1,
  getDeskripsiSikapYadika2,
  getDeskripsiSikapYadika3,
  getDeskripsiSikapYadika4,
  getDeskripsiSikapYadika5,
} from "utilities/RaporUtils";

const SectionDeskripsiPerkembanganKarakterRaporYadikaPrint = ({
  isReadOnly = false,
  catatan,
  jenisRapor,
  siswa,
}) => {
  const tipe = !jenisRapor || jenisRapor == "akhirSemester" ? "uas" : "uts";
  return (
    <>
      <h6 className="fs-14-ss fw-bold mb-2">
        F. Deskripsi Perkembangan Karakter
      </h6>
      <div className="ps-4">
        <div className="mb-2">
          <h6 className="fs-14-ss fw-bold mb-1">1. Sikap Integritas</h6>
          <div
            className="border border-dark border-2 p-2"
            style={{ borderColor: "#000000" }}
          >
            <p className="mb-0 fs-12-ss">
              Deksripsi:{" "}
              {getDeskripsiSikapYadika1(
                siswa?.sikapYadika?.find((d) => d.tipe == tipe)?.sikapIntegritas
              )}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h6 className="fs-14-ss fw-bold mb-1">2. Sikap Religius</h6>
          <div
            className="border border-dark border-2 p-2"
            style={{ borderColor: "#000000" }}
          >
            <p className="mb-0 fs-12-ss">
              Deskripsi:{" "}
              {getDeskripsiSikapYadika2(
                siswa?.sikapYadika?.find((d) => d.tipe == tipe)?.sikapReligius
              )}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h6 className="fs-14-ss fw-bold mb-1">3. Nasionalis</h6>
          <div
            className="border border-dark border-2 p-2"
            style={{ borderColor: "#000000" }}
          >
            <p className="mb-0 fs-12-ss">
              Deksripsi:{" "}
              {getDeskripsiSikapYadika3(
                siswa?.sikapYadika?.find((d) => d.tipe == tipe)?.nasionalis
              )}
            </p>
          </div>
        </div>
        <div className="mb-2">
          <h6 className="fs-14-ss fw-bold mb-1">4. Mandiri</h6>
          <div
            className="border border-dark border-2 p-2"
            style={{ borderColor: "#000000" }}
          >
            <p className="mb-0 fs-12-ss">
              Deskripsi:{" "}
              {getDeskripsiSikapYadika4(
                siswa?.sikapYadika?.find((d) => d.tipe == tipe)?.mandiri
              )}
            </p>
          </div>
        </div>
        <div className="mb-0">
          <h6 className="fs-14-ss fw-bold mb-1">5. Gotong Royong</h6>
          <div
            className="border border-dark border-2 p-2"
            style={{ borderColor: "#000000" }}
          >
            <p className="mb-0 fs-12-ss">
              Deksripsi:{" "}
              {getDeskripsiSikapYadika5(
                siswa?.sikapYadika?.find((d) => d.tipe == tipe)?.gotongRoyong
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionDeskripsiPerkembanganKarakterRaporYadikaPrint;
