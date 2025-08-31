const SectionKetidakhadiranRaporYadika = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">E. Ketidakhadiran</h4>
          {/* <h4 className="fw-extrabold color-dark mb-0">E. Ketidakhadiran</h4> */}
        </div>
        <div className="table-responsive">
          <table className="table-ss">
            <tbody>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Sakit</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {totalSakit} hari
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Izin</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {totalIzin} hari
                  </p>
                </td>
              </tr>
              <tr>
                <td style={{ width: "5%", opacity: "0" }} className="fs-18-ss">
                  No
                </td>
                <td className="table-ketidakhadiran-rapor">
                  <span className="fw-semibold">Tanpa Keterangan</span>
                </td>
                <td>
                  <p className="fw-semibold mb-0 color-dark">
                    {totalAlpa} hari
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SectionKetidakhadiranRaporYadika;
