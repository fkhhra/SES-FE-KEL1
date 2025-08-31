const SectionCatatanWaliKelasRaporYadikaPrint = ({
  isReadOnly = false,
  catatan,
}) => {
  return (
    <>
      <h6 className="fs-14-ss fw-bold mb-2">G. Catatan Wali Kelas</h6>
      <div
        className="border border-dark border-2 p-2"
        style={{ borderColor: "#000000" }}
      >
        <p className="mb-0 fs-12-ss">
          {!catatan?.catatan ? `-` : `${catatan?.catatan}`}
        </p>
      </div>
    </>
  );
};

export default SectionCatatanWaliKelasRaporYadikaPrint;
