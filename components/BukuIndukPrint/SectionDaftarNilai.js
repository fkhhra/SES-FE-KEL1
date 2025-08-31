import NilaiUjianSekolah from "./NilaiUjianSekolah";

const SectionDaftarNilai = ({ isBukuInduk }) => {
  return (
    <>
      <div className="pt-4">
        <div className="row text-center mb-4">
          <div className="col-md-12">
            <h6 className="fs-14-ss fw-bold text-uppercase mb-0">
              Daftar Nilai
            </h6>
          </div>
        </div>
        {/* <div className="mb-4">
          <NilaiUjianNasional />
        </div> */}
        <NilaiUjianSekolah />
      </div>
    </>
  );
};

export default SectionDaftarNilai;
