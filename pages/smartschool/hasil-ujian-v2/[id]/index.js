import { getHasilUjian } from "client/UjianClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const index = ({ id }) => {
  const [dataHasilUjian, setDataHasilUjian] = useState({});

  const getHasilUJian = async () => {
    const { data } = await getHasilUjian(id);
    if (data) {
      setDataHasilUjian(data);
    }
  };

  useEffect(() => {
    getHasilUJian();
  }, []);

  return (
    <Layout modalWrapper={<></>}>
      <AnimatePage>
        <div className="row gy-4">
          {/* Header Jadwal Ujian Detail End */}
          <div className="col-md-12">
            <Link href={`${ssURL}/jadwal-ujian?subnav=berlangsung`}>
              <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mt-4">
              {/* Card Label & Option Start */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Jadwal Ujian Label Start */}

                <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                  {
                    dataHasilUjian?.pesertaUjian?.jadwalUjian?.jadwalUjian
                      ?.ujian?.tipeFormat
                  }
                </div>

                {/* Jadwal Ujian Label End */}
              </div>
              {/* Card Label & Option End */}
              {/* Jadwal Ujian Title Start */}
              <div className="w-75 text-break">
                <h2 className="color-dark fw-black mb-4">
                  {
                    dataHasilUjian?.pesertaUjian?.jadwalUjian?.jadwalUjian
                      ?.ujian?.nama
                  }{" "}
                  - Kelas{" "}
                  {
                    dataHasilUjian?.pesertaUjian?.jadwalUjian?.jadwalUjian
                      ?.ujian?.tingkat
                  }
                </h2>
              </div>
              {/* Jadwal Ujian Title End */}
              {/* Jadwal Ujian Info Start */}
              <div className="row mt-4">
                <div className="col-md-12 pe-2">
                  {/* Peserta Ujian Info Start */}
                  <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between">
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                      <p className="fs-14-ss color-secondary mb-2">Benar</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.metaHasil?.benar || 0} Soal
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-3">
                      <p className="fs-14-ss color-secondary mb-2">Salah</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.metaHasil?.salah || 0} Soal
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-5">
                      <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.metaHasil?.jumlahSoal || 0} Soal
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                      <p className="fs-14-ss color-secondary mb-2">PG</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.metaHasil?.nilaiPg || 0} Poin
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-4">
                      <p className="fs-14-ss color-secondary mb-2">Esai</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.pesertaUjian?.nilaiEsai || 0} Poin
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-last">
                      <p className="fs-14-ss color-secondary mb-2">
                        Total Nilai
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {dataHasilUjian?.pesertaUjian?.nilai || 0} Poin
                      </p>
                    </div>
                  </div>
                  {/* Peserta Ujian Info End */}

                  {/* Peserta Ujian Info AKM Start */}
                  {/* <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss mb-3 mb-md-0">
                  <div className="d-flex flex-wrap justify-content-start pb-md-2">
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">Benar</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">40 Soal</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">Salah</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">0 Soal</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">40 Soal</p>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap justify-content-start pt-md-2">
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-1 order-sm-1">
                      <p className="fs-14-ss color-secondary mb-2">PG</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">20 Poin</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-5 order-sm-2">
                      <p className="fs-14-ss color-secondary mb-2">Uraian</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">20 Poin</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-3 order-sm-3">
                      <p className="fs-14-ss color-secondary mb-2">Isian</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">20 Poin</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-2 order-sm-4">
                      <p className="fs-14-ss color-secondary mb-2">
                        PG. Kompleks
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">20 Poin</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-4 order-sm-5">
                      <p className="fs-14-ss color-secondary mb-2">
                        Menjodohkan
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">20 Poin</p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-last">
                      <p className="fs-14-ss color-secondary mb-2">
                        Total Nilai
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        100 Poin
                      </p>
                    </div>
                  </div>
                </div> */}
                  {/* Peserta Ujian Info AKM End */}
                </div>
              </div>

              {/* Jadwal Ujian Info End */}
            </div>
          </div>
          {/* Header Jadwal Ujian Detail End */}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
