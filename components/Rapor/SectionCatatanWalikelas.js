const SectionCatatanWaliKelas = ({
  isReadOnly = false,
  totalAlpa,
  totalIzin,
  totalSakit,
  catatan,
  sekolah,
  tingkat,
}) => {
  return (
    <>
      <div className="card card-ss p-0 pb-4">
        <div className="p-4">
          <h4 className="fw-extrabold color-dark mb-0">
            {sekolah?.id == 578 && tingkat == "XI" ? "F" : "E"}. Catatan Wali
            Kelas
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
      {sekolah?.id == 15 || sekolah?.id == 13 || sekolah?.id == 578 ? (
        <div className="card card-ss p-0 pb-4 mt-4">
          {!catatan?.catatan ? (
            <div className="row">
              <div className="col-md-12 text-center">
                <img src="/img/empty-state-data.svg" alt="" width="200" />
                <h6 className="color-dark fw-bold mt-3">Tidak ada data</h6>
              </div>
            </div>
          ) : (
            <p className="mx-4 d-flex align-items-center mt-4">
              {catatan?.kelulusan == "naik" || catatan?.kelulusan == "lulus" ? (
                "Naik Kelas"
              ) : (
                <del>Naik Kelas </del>
              )}{" "}
              /{" "}
              {catatan?.kelulusan == "tidak naik" ||
              catatan?.kelulusan == "tidak lulus" ? (
                " Tidak Naik Kelas"
              ) : (
                <del> Tidak Naik Kelas</del>
              )}
            </p>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SectionCatatanWaliKelas;
