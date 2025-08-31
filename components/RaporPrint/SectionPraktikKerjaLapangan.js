const moment = require("moment");
require("moment/locale/id");
moment.locale("id");

const SectionPraktikKerjaLapangan = ({ isReadOnly = false, keteranganPkl }) => {
  console.log(keteranganPkl);
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">
        D. Pratik Kerja Lapangan
      </h6>
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="text-center fw-bold fs-12-ss"
              style={{ width: "6%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              No
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "20%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Mitra DU / DI
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "30%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Lokasi
            </th>
            <th
              className="fw-bold fs-12-ss text-center"
              style={{
                width: "14%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Tanggal Mulai
            </th>
            <th
              className="fw-bold fs-12-ss text-center"
              style={{
                width: "14%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Tanggal Selesai
            </th>
            <th
              className="fw-bold fs-12-ss text-center"
              style={{
                width: "14%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Lamanya
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "30%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {!keteranganPkl?.length && (
            <tr>
              <td className="align-text-top fs-12-ss text-center">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
            </tr>
          )}
          {keteranganPkl?.map((d, idx) => {
            return (
              <tr>
                <td className="align-text-top fs-12-ss text-center">
                  {idx + 1}
                </td>
                <td className="align-text-top fs-12-ss">
                  {!d?.namamitra ? `-` : `${d?.namamitra}`}
                </td>

                <td className="align-text-top fs-12-ss">
                  {!d?.lokasiPerusahaan ? `-` : `${d?.lokasiPerusahaan}`}
                </td>
                <td className="align-text-top fs-12-ss text-center">
                  {!d?.tanggalMulai
                    ? `-`
                    : `${moment(d?.tanggalMulai).format("DD MMMM YYYY")}`}
                </td>

                <td className="align-text-top fs-12-ss text-center">
                  {!d?.tanggalSelesai
                    ? `-`
                    : `${moment(d?.tanggalSelesai).format("DD MMMM YYYY")}`}
                </td>
                <td className="align-text-top fs-12-ss text-center">
                  {!d?.lamanya ? `-` : `${d?.lamanya} `} Bulan
                </td>
                <td className="align-text-top fs-12-ss">
                  {!d?.keterangan ? `-` : `${d?.keterangan}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default SectionPraktikKerjaLapangan;
