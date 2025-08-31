import {
  getDeskripsiSikapYadika1,
  getDeskripsiSikapYadika2,
  getDeskripsiSikapYadika3,
  getDeskripsiSikapYadika4,
  getDeskripsiSikapYadika5,
} from "utilities/RaporUtils";

const SectionDeskripsiPerkembanganKarakter = ({
  isReadOnly = false,
  ekskul,
  siswa,
  jenisRapor,
}) => {
  const tipe = !jenisRapor || jenisRapor == "akhirSemester" ? "uas" : "uts";
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            F. Deskripsi Perkembangan Karakter
          </h4>
        </div>
        <div className="table-responsive">
          <table className="table-ss">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>No</th>
                <th style={{ width: "40%" }}>Sikap</th>
                <th style={{ width: "55%" }}>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {!siswa?.sikapYadika?.find((d) => d.tipe == tipe) ? (
                <td colSpan="3">
                  <div className="text-center">
                    <img src="/img/empty-state-data.svg" alt="" width="200" />
                    <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
                  </div>
                </td>
              ) : (
                <>
                  <tr key={1}>
                    <td data-th="No">1</td>
                    <td data-th="Sikap">
                      <span className="fw-semibold">Sikap Spiritual</span>
                    </td>
                    <td data-th="Deskripsi">
                      <span className="fw-semibold">
                        {getDeskripsiSikapYadika1(
                          siswa?.sikapYadika?.find((d) => d.tipe == tipe)
                            ?.sikapIntegritas
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr key={2}>
                    <td data-th="No">2</td>
                    <td data-th="Sikap">
                      <span className="fw-semibold">Sikap Religius</span>
                    </td>
                    <td data-th="Deskripsi">
                      <span className="fw-semibold">
                        {getDeskripsiSikapYadika2(
                          siswa?.sikapYadika?.find((d) => d.tipe == tipe)
                            ?.sikapReligius
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr key={3}>
                    <td data-th="No">3</td>
                    <td data-th="Sikap">
                      <span className="fw-semibold">Nasionalis</span>
                    </td>
                    <td data-th="Deskripsi">
                      <span className="fw-semibold">
                        {getDeskripsiSikapYadika3(
                          siswa?.sikapYadika?.find((d) => d.tipe == tipe)
                            ?.nasionalis
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr key={4}>
                    <td data-th="No">4</td>
                    <td data-th="Sikap">
                      <span className="fw-semibold">Mandiri</span>
                    </td>
                    <td data-th="Deskripsi">
                      <span className="fw-semibold">
                        {getDeskripsiSikapYadika4(
                          siswa?.sikapYadika?.find((d) => d.tipe == tipe)
                            ?.mandiri
                        )}
                      </span>
                    </td>
                  </tr>
                  <tr key={5}>
                    <td data-th="No">5</td>
                    <td data-th="Sikap">
                      <span className="fw-semibold">Gotong Royong</span>
                    </td>
                    <td data-th="Deskripsi">
                      <span className="fw-semibold">
                        {getDeskripsiSikapYadika5(
                          siswa?.sikapYadika?.find((d) => d.tipe == tipe)
                            ?.gotongRoyong
                        )}
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SectionDeskripsiPerkembanganKarakter;
