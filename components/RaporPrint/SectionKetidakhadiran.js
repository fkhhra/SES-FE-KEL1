const SectionKetidakhadiran = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  siswa,
  tingkat,
  sekolah,
  ta,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-3 ms-4">
        {sekolah?.id == 578 && tingkat == "XI" ? "E" : "D"}. Ketidakhadiran
      </h6>
      {/* <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">
        F. Ketidakhadiran
      </h6> */}

      {sekolah?.id == 15 ? (
        <>
          <table className="w-100 table">
            <tbody>
              <tr>
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
                  {((ta?.id == 40 || ta?.id == 41) && tingkat == "X") ||
                  ((ta?.id == 47 || ta?.id == 8186) && tingkat == "XI") ||
                  ((ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII")
                    ? 0
                    : siswa?.sakit}{" "}
                  hari
                </td>
              </tr>
              <tr>
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
                  {((ta?.id == 40 || ta?.id == 41) && tingkat == "X") ||
                  ((ta?.id == 47 || ta?.id == 8186) && tingkat == "XI") ||
                  ((ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII")
                    ? 0
                    : siswa?.izin}{" "}
                  hari
                </td>
              </tr>
              <tr>
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
                  {((ta?.id == 40 || ta?.id == 41) && tingkat == "X") ||
                  ((ta?.id == 47 || ta?.id == 8186) && tingkat == "XI") ||
                  ((ta?.id == 8385 || ta?.id == 8692) && tingkat == "XII")
                    ? 0
                    : siswa?.alpa}{" "}
                  hari
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          <table className="w-100 table">
            <tbody>
              <tr>
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
                  {siswa?.sakit} hari
                </td>
              </tr>
              <tr>
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
                  {siswa?.izin} hari
                </td>
              </tr>
              <tr>
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
                  {siswa?.alpa} hari
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {/* <table className="w-100 table">
        <tbody>
          <tr>
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
              {siswa?.sakit} hari
            </td>
          </tr>
          <tr>
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
              {siswa?.izin} hari
            </td>
          </tr>
          <tr>
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
              {siswa?.alpa} hari
            </td>
          </tr>
        </tbody>
      </table> */}
    </>
  );
};

export default SectionKetidakhadiran;
