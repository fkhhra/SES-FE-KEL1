import { useEffect, useState } from "react";
import { getAnalisis } from "utilities/HelperUtils";

import useTugasSiswa from "hooks/useTugasSiswa";

import CardHasilJawabanTugas from "./TugasKuis/CardHasilJawabanTugas";
import ModalFullScreen from "components/Shared/ModalFullScreen/ModalFullScreen";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";

const ModalNilaiTugasKuis = ({
  _getDetailTimeline,
  detailData,
  listSiswaTerkumpul,
}) => {
  listSiswaTerkumpul = listSiswaTerkumpul?.filter((value, index, self) => {
    return (
      index ==
      self?.findIndex((dt) => {
        return dt?.id == value?.id;
      })
    );
  });

  const { tugasSiswa, setTugasSiswa } = useTugasSiswa();

  const [analisis, setAnalisis] = useState([]);

  const totalPoin = analisis?.reduce((a, b) => a + b?.poin, 0) || null;
  const peserta = tugasSiswa?.peserta || [];
  let jawabanSiswa = peserta[peserta.length - 1]?.jawabanSiswa;
  const listSoal = detailData?.tugas?.soal;

  const getTotalPoinSiswa = (data) => {
    return data?.reduce((a, b) => a + b?.poin, 0) || 0;
  };

  useEffect(() => {
    const benarSalah = getAnalisis(peserta);
    setAnalisis(benarSalah);
  }, [tugasSiswa]);

  return (
    <ModalFullScreen
      modalId="modalNilaiTugasKuis"
      withFooter={false}
      title={
        <>
          <h6 className="mb-2 fw-extrabold fs-14-ss">
            {detailData?.tugas?.judul}
          </h6>

          <div className="dropdown dropdown-ss dropdown-nama-nilai-tugas">
            <div
              className="btn btn-light bg-light dropdown-toggle d-flex align-items-center justify-content-between flex-wrap w-100 rounded-ss"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {" "}
              <div className="">
                <p className="mb-0 fw-bold color-dark">
                  {tugasSiswa?.user?.nama?.substring(0, 20)}
                  ...
                </p>
              </div>
              <span className="fs-12-ss fw-bold color-secondary ms-md-auto">
                {totalPoin != null ? totalPoin : "Mengumpulkan"}
              </span>
            </div>
            <ul
              className="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
              style={{ width: "100%" }}
            >
              {listSiswaTerkumpul?.map((siswa) => {
                const analisis = getAnalisis(siswa?.peserta);
                const totalPoin = getTotalPoinSiswa(analisis);

                return (
                  <li onClick={() => setTugasSiswa(siswa)}>
                    <a className="dropdown-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1 flex-wrap">
                          <p className="mb-0">{siswa?.user?.nama}</p>
                        </div>
                        {totalPoin != null ? (
                          <span
                            className={`py-0 px-3 rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center color-success bg-soft-success`}
                            style={{
                              width: "50px",
                              height: "20px",
                            }}
                          >
                            {totalPoin}
                          </span>
                        ) : (
                          <span className="py-0 color-secondary fs-14-ss fw-bold">
                            Mengumpulkan
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      }
    >
      <div className="row">
        <div className="col-lg-8">
          {jawabanSiswa &&
            jawabanSiswa.length > 0 &&
            jawabanSiswa.map((jawaban, index) => {
              const soal =
                listSoal &&
                listSoal.length &&
                listSoal.find(
                  ({ mSoalUjianId }) => mSoalUjianId === jawaban.mSoalUjianId
                );

              return (
                <CardHasilJawabanTugas
                  bentuk={soal?.soal?.bentuk}
                  soal={soal}
                  jawaban={jawaban}
                  totalSoal={listSoal?.length}
                  index={index}
                  key={`${index}-${new Date().getTime()}`}
                  _getDetailTimeline={_getDetailTimeline}
                />
              );
            })}
        </div>
        <div className="col-lg-4">
          <div className="card card-ss rounded-ss p-4 card-penilaian-tugas mt-4 mt-lg-0">
            <h4 className="mb-4 fw-extrabold color-dark">Penilaian</h4>
            <div className="bg-soft-success rounded-ss px-4 py-3 mb-3">
              <p className="fs-14-ss color-secondary mb-1">Dikumpulkan Pada</p>
              <h6 className="fs-18-ss color-dark fw-bold mb-0">
                {tugasSiswa?.updatedAt}
              </h6>
            </div>
            <div className="row bg-soft-primary rounded-ss px-4 py-3 mb-3">
              <div className="col-md-4 mb-3">
                <p className="fs-14-ss color-secondary mb-1">Jumlah</p>
                <p className="fs-18-ss fw-bold color-dark m-0">
                  {`${listSoal?.length} Soal`}
                </p>
              </div>
              <div className="col-md-4 mb-3">
                <p className="fs-14-ss color-secondary mb-1">Benar</p>
                <p className="fs-18-ss fw-bold color-dark m-0">{`${
                  analisis?.filter((d) => d?.benar == true).length
                } Soal`}</p>
              </div>
              <div className="col-md-4 mb-3">
                <p className="fs-14-ss color-secondary mb-1">Salah</p>
                <p className="fs-18-ss fw-bold color-dark m-0">{`${
                  analisis?.filter((d) => d?.benar == false).length
                } Soal`}</p>
              </div>
              <div className="col-md-4">
                <p className="fs-14-ss color-secondary mb-1">PG</p>
                <p className="fs-18-ss fw-bold color-dark m-0">{`${analisis
                  ?.filter((d) => d?.jenis == "pg")
                  .reduce((a, b) => a + b?.poin, 0)} Poin`}</p>
              </div>
              <div className="col-md-4">
                <p className="fs-14-ss color-secondary mb-1">Esai</p>
                <p className="fs-18-ss fw-bold color-dark m-0">{`${analisis
                  ?.filter((d) => d?.jenis == "esai")
                  .reduce((a, b) => a + b?.poin, 0)} Poin`}</p>
              </div>
              <div className="col-md-4">
                <p className="fs-14-ss color-secondary mb-1">Nilai</p>
                <p className="fs-18-ss fw-bold color-dark m-0">
                  {`${getTotalPoinSiswa(analisis)} Poin`}
                </p>
              </div>
            </div>
            <div className="mb-0">
              <label htmlFor="nilai" className="form-label">
                Nilai
              </label>
              <input
                className="form-control"
                autoComplete="off"
                name="nilai"
                type="number"
                value={getTotalPoinSiswa(analisis)}
                id="nilai"
                placeholder="Berikan Nilai"
                readOnly
              />
            </div>
          </div>
          <WhatsappLink
            phoneNumber={tugasSiswa?.user?.whatsapp}
            text={`Halo nak ${tugasSiswa?.user?.nama}, tugas yang berjudul *${detailData?.tugas?.judul}* masih belum sesuai. Tolong direvisi kembali`}
            customClass="mt-3"
          >
            <button className="btn-pengembalian-tugas bg-soft-primary shadow-primary-ss rounded-ss p-3 w-100 mt-3 border-0">
              <div className="d-flex align-items-center">
                <img
                  src={`/img/icon-kembalikan-tugas.svg`}
                  alt="icon-kembalikan-tugas"
                />
                <span className="fs-18-ss fw-bold color-dark mb-0 ms-2">
                  Ulang Tugas Kuis
                </span>
              </div>
            </button>
          </WhatsappLink>
        </div>
      </div>
    </ModalFullScreen>
  );
};

export default ModalNilaiTugasKuis;
