const SectionCatatanWalikelasRaporYadika = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  catatan,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            G. Catatan Wali Kelas
          </h4>
          {/* <h4 className="fw-extrabold color-dark mb-0">
            F. Catatan Wali Kelas
          </h4> */}
        </div>

        {!catatan?.catatan ? (
          <div className="row">
            <div className="col-md-12 text-center">
              <img src="/img/empty-state-data.svg" alt="" width="200" />
              <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
            </div>
          </div>
        ) : (
          <p className="mx-4">{catatan?.catatan}</p>
        )}
      </div>
    </>
  );
};

export default SectionCatatanWalikelasRaporYadika;
