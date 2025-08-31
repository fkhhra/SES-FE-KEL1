const SectionKetidakhadiranRaporYadikaPrint = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  absen,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold mb-3">E. Ketidakhadiran</h6>
      {/* <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">
        F. Ketidakhadiran
      </h6> */}
      <table className="w-100 table">
        <tbody>
          <tr>
            <td
              className="align-text-top fs-12-ss text-center"
              style={{ width: "6%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              1
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "30%",
              }}
            >
              Sakit
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "65%",
              }}
            >
              {absen?.sakit} hari
            </td>
          </tr>
          <tr>
            <td
              className="align-text-top fs-12-ss text-center"
              style={{ width: "5%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              2
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "30%",
              }}
            >
              Ijin
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "65%",
              }}
            >
              {absen?.izin} hari
            </td>
          </tr>
          <tr>
            <td
              className="align-text-top fs-12-ss text-center"
              style={{ width: "5%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              3
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "30%",
              }}
            >
              Tanpa Keterangan
            </td>
            <td
              className="align-text-top fs-12-ss"
              style={{
                width: "65%",
              }}
            >
              {absen?.alpa} hari
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default SectionKetidakhadiranRaporYadikaPrint;
