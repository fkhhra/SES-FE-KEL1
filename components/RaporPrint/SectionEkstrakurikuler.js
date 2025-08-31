const SectionEkstrakurikuler = ({ isReadOnly = false, ekskul }) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-3 ms-4">
        C. Ekstrakurikuler
      </h6>
      {/* <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">
        D. Ekstrakurikuler
      </h6> */}
      <table className="w-100 table">
        <thead>
          <tr>
            <th
              className="text-center fw-bold fs-12-ss"
              style={{ width: "5%", paddingTop: "19px", paddingBottom: "19px" }}
            >
              No
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "30%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Kegiatan Ekstrakurikuler
            </th>
            <th
              className="fw-bold fs-12-ss"
              style={{
                width: "65%",
                paddingTop: "19px",
                paddingBottom: "19px",
              }}
            >
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody>
          {!ekskul?.length && (
            <tr>
              <td className="align-text-top fs-12-ss text-center">-</td>
              <td className="align-text-top fs-12-ss">-</td>
              <td className="align-text-top fs-12-ss">-</td>
            </tr>
          )}
          {ekskul?.map((d, idx) => {
            return (
              <tr key={`${idx}-${new Date().getTime()}`}>
                <td className="align-text-top fs-12-ss text-center">
                  {idx + 1}
                </td>
                <td className="align-text-top fs-12-ss">
                  {!d?.ekskul?.nama ? `-` : `${d?.ekskul?.nama}`}
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

export default SectionEkstrakurikuler;
