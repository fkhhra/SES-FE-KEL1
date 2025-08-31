const SectionEkstrakurikulerRaporYadika = ({ isReadOnly = false, ekskul }) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">D. Ekstrakurikuler</h4>
        </div>
        <div className="table-responsive">
          <table className="table-ss">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>No</th>
                <th style={{ width: "30%" }}>Kegiatan Ekstrakurikuler</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {!ekskul?.length && (
                <td colSpan="3">
                  <div className="text-center">
                    <img src="/img/empty-state-data.svg" alt="" width="200" />
                    <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
                  </div>
                </td>
              )}
              {ekskul?.map((d, idx) => {
                return (
                  <tr key={`${idx}-${new Date().getTime()}`}>
                    <td data-th="No">{idx + 1}</td>
                    <td data-th="Kegiatan Ekstrakurikuler">
                      <span className="fw-semibold">
                        {!d?.ekskul?.nama ? `-` : `${d?.ekskul?.nama}`}
                      </span>
                    </td>
                    <td data-th="Keterangan">
                      <p className="fw-semibold mb-0">
                        {!d?.keterangan ? `-` : `${d?.keterangan}`}
                      </p>
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

export default SectionEkstrakurikulerRaporYadika;
