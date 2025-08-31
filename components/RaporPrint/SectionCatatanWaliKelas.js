const SectionCatatanWaliKelas = ({
  isReadOnly = false,
  catatan,
  sekolah,
  tingkat,
  ta,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold text-uppercase mb-3 ms-4">
        {sekolah?.id == 578 && tingkat == "XI" ? "F" : "E"}. Catatan Wali Kelas
      </h6>
      {/* <h6 className="fs-14-ss fw-bold text-uppercase mb-4 ms-4">
        G. Catatan Wali Kelas
      </h6> */}
      <div
        className="border border-dark border-2 p-4"
        style={{ borderColor: "#000000" }}
      >
        <p className="mb-0 fs-12-ss">
          {ta?.id == 40 && tingkat == "X" ? (
            <>
              {!catatan?.catatan
                ? `Semangat menjadi lebih baik`
                : `${catatan?.catatan}`}
            </>
          ) : ta?.id == 41 && tingkat == "X" ? (
            `Semangat belajar karena perjalanan masih panjang`
          ) : ta?.id == 8385 && tingkat == "XII" ? (
            <>
              {!catatan?.catatan
                ? `Terus Tingkatkan prestasi`
                : `${catatan?.catatan}`}
            </>
          ) : ta?.id == 8692 && tingkat == "XII" ? (
            <>
              {!catatan?.catatan
                ? `Terus Semangat, jadilah orang yang bermanfaat`
                : `${catatan?.catatan}`}
            </>
          ) : (
            <>{!catatan?.catatan ? `-` : `${catatan?.catatan}`}</>
          )}
        </p>
      </div>
      {sekolah?.id == 13 || sekolah?.id == 578 ? (
        <div
          className="border border-dark border-2 p-4 mt-4"
          style={{ borderColor: "#000000" }}
        >
          <p className="mb-0 fs-12-ss">
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
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SectionCatatanWaliKelas;
