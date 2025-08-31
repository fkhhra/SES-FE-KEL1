import CardHasilJawabanTugas from "./CardHasilJawabanTugas";

const HasilJawabanTugasKuis = ({ detailData }) => {
  const peserta = detailData?.timeline?.tugas?.peserta || detailData?.peserta;
  const listSemuaSoal = detailData?.timeline?.tugas?.soal || [];

  let jawabanSiswa = peserta[peserta.length - 1]?.jawabanSiswa;

  const getJumlahSoalBenarDanSalah = () => {
    let jumlahSoalBenar = 0;
    let jumlahSoalSalah = 0;

    jawabanSiswa?.map((jawaban) => {
      const soal = listSemuaSoal.find(
        ({ mSoalUjianId }) => mSoalUjianId === jawaban.mSoalUjianId
      );
      const bentuk = soal?.soal?.bentuk;

      if (bentuk == "pg") {
        if (soal?.soal?.kjPg === jawaban?.jawabanPg) {
          jumlahSoalBenar += 1;
        } else {
          jumlahSoalSalah += 1;
        }
      }

      if (bentuk == "esai") {
        const totalPoinEsai = JSON.parse(jawaban?.jawabanRubrikEsai || "[]")
          .filter((item) => item.benar)
          .reduce((a, b) => a + parseInt(b.poin), 0);

        if (totalPoinEsai > 0) {
          jumlahSoalBenar += 1;
        } else {
          jumlahSoalSalah += 1;
        }
      }
    });

    return {
      jumlahSoalBenar,
      jumlahSoalSalah,
    };
  };

  const { jumlahSoalBenar, jumlahSoalSalah } = getJumlahSoalBenarDanSalah();

  return (
    <>
      <div className="row mt-3 mb-4">
        <div className={`mb-md-0 mb-3 px-2 col-md-5`}>
          <div className="status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Jumlah</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${
                  detailData?.tugas?.soal?.length ||
                  detailData?.timeline?.tugas?.soal?.length
                } Soal`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Benar</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${jumlahSoalBenar} Soal`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Salah</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${jumlahSoalSalah} Soal`}
              </p>
            </div>
          </div>
        </div>
        <div className={`mb-md-0 mb-3 px-2 col-md-7`}>
          <div className="status-info px-4 p-3 pb-md-3 pb-0 bg-very-soft-secondary-2 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">PG</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${peserta[peserta.length - 1]?.nilaiPg} Poin`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">Esai</p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${peserta[peserta.length - 1]?.nilaiEsai} Poin`}
              </p>
            </div>
            <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
              <p className="fs-14-ss fw-bold color-secondary mb-2">
                Total Poin
              </p>
              <p className="fs-18-ss fw-extrabold color-primary m-0">
                {`${
                  peserta[peserta.length - 1]?.nilaiPg +
                  peserta[peserta.length - 1]?.nilaiEsai
                } Soal`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {jawabanSiswa &&
        jawabanSiswa.length > 0 &&
        jawabanSiswa.map((jawaban, index) => {
          const soal = listSemuaSoal.find(
            ({ mSoalUjianId }) => mSoalUjianId === jawaban.mSoalUjianId
          );
          return (
            <CardHasilJawabanTugas
              soal={soal}
              jawaban={jawaban}
              totalSoal={listSemuaSoal.length}
              index={index}
              key={`${index}-${new Date().getTime()}`}
            />
          );
        })}
    </>
  );
};

export default HasilJawabanTugasKuis;
