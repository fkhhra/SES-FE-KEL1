const moment = require("moment");
require("moment/locale/id");
moment.locale("id");
const SectionPraktikKerjaLapanganRaporYadika = ({
  isReadOnly = false,
  keteranganPkl,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            D. Praktik Kerja Lapangan
          </h4>
        </div>
        <div className="table-responsive">
          <table className="table-ss">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>No</th>
                <th>Mitra DU/DI</th>
                <th>Lokasi</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Selesai</th>
                <th>Lamanya</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {!keteranganPkl?.length && (
                <td colSpan="5">
                  <div className="text-center">
                    <img src="/img/empty-state-data.svg" alt="" width="200" />
                    <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
                  </div>
                </td>
              )}
              {keteranganPkl?.map((d, idx) => {
                return (
                  <tr key={`${idx}-${new Date().getTime()}`}>
                    <td data-th="No">{idx + 1}</td>
                    <td data-th="Mitra DU/DI">
                      <span className="fw-semibold">
                        {!d?.namamitra ? `-` : `${d?.namamitra}`}
                      </span>
                    </td>
                    <td data-th="Lokasi">
                      <span className="fw-semibold">
                        {!d?.lokasiPerusahaan ? `-` : `${d?.lokasiPerusahaan}`}
                      </span>
                    </td>
                    <td data-th="Tanggal Mulai">
                      <span className="fw-semibold">
                        {!d?.tanggalMulai
                          ? `-`
                          : `${moment(d?.tanggalMulai).format("DD MMMM YYYY")}`}
                      </span>
                    </td>
                    <td data-th="Tanggal Selesai">
                      <span className="fw-semibold">
                        {!d?.tanggalSelesai
                          ? `-`
                          : `${moment(d?.tanggalSelesai).format(
                              "DD MMMM YYYY"
                            )}`}
                      </span>
                    </td>
                    <td data-th="Lamanya">
                      <span className="fw-semibold">
                        {!d?.lamanya ? `-` : `${d?.lamanya}`}
                      </span>
                    </td>
                    <td data-th="Keterangan">
                      <span className="fw-semibold">
                        {!d?.keterangan ? `-` : `${d?.keterangan}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SectionPraktikKerjaLapanganRaporYadika;
