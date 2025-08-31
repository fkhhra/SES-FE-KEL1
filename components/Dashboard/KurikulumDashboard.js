import { useRouter } from "next/router";
import Link from "next/link";
import CardDataSiswa from "../Kesiswaan/CardDataSiswa";
import AnalisisJumlahPesertaDidik from "../Analisis/AnalisisJumlahPesertaDidik";
import AnalisisJumlahPesertaDidikPerJurusan from "../Analisis/AnalisisJumlahPesertaDidikPerJurusan";
import { getStudent } from "../../client/StudentClient";
import { useEffect, useState } from "react";
import LabelStatus from "../Shared/LabelStatus/LabelStatus";
import { ssURL } from "client/clientAxios";

const KurikulumDashboard = ({ sekolah, ta }) => {
  const router = useRouter();

  const { id: taId } = router.query;

  const filter = router.query.filter;

  const [siswaData, setSiswaData] = useState({});
  const { siswa, integrasi, jumlahLaki, jumlahPerempuan, jurusanData, total } =
    siswaData;

  const listFilter = [
    {
      text: "Hari",
      url: "smartschool?filter=hari",
      isActive: !filter || filter === "hari",
    },
    {
      text: "Minggu",
      url: "smartschool?filter=minggu",
      isActive: filter === "minggu",
    },
    {
      text: "Bulan",
      url: "smartschool?filter=bulan",
      isActive: filter === "bulan",
    },
  ];

  const getSiswaData = async () => {
    const params = {
      page: 1,
    };

    const { data } = await getStudent(params);
    if (data) {
      setSiswaData({
        ...data,
        siswa: data?.siswa?.data,
        total: data?.siswa?.total,
      });
    }
  };

  useEffect(() => {
    getSiswaData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-ss">
          <div className="card-header card-header-ss p-4">
            <div className="">
              <h4 className="fw-extrabold color-dark mb-1">Tahun Akademik</h4>
              <h6 className="fw-bold color-primary mb-0">
                {ta?.tahun} - {ta?.semester}
              </h6>
            </div>
          </div>
          <hr className="hr-ss my-0" />
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-3 mb-md-0 mb-4">
                <Link
                  href={`${ssURL}/tahun-akademik/[id]/mata-pelajaran`}
                  as={`${ssURL}/tahun-akademik/${ta?.id}/mata-pelajaran`}
                >
                  <a href="">
                    <div
                      className="kegiatan-items rounded-ss p-3 d-flex align-items-center justify-content-center flex-column"
                      style={{ minHeight: "125px" }}
                    >
                      <img
                        src="/img/icon-side-nav-mapel.svg"
                        alt=""
                        style={{ width: "50px", height: "50px" }}
                      />
                      <h6 className="mt-2 mb-0 fs-18-ss color-dark fw-bold">
                        {sekolah?.tingkat == "kampus" ? "Matkul" : "Mapel"}
                      </h6>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="col-md-3 mb-md-0 mb-4">
                <Link
                  href={`${ssURL}/tahun-akademik/[id]/rombel`}
                  as={`${ssURL}/tahun-akademik/${ta?.id}/rombel`}
                >
                  <a href="">
                    <div
                      className="kegiatan-items rounded-ss p-3 d-flex align-items-center justify-content-center flex-column"
                      style={{ minHeight: "125px" }}
                    >
                      <img
                        src="/img/icon-side-nav-rombel.svg"
                        alt=""
                        style={{ width: "50px", height: "50px" }}
                      />
                      <h6 className="mt-2 mb-0 fs-18-ss color-dark fw-bold">
                        Rombel
                      </h6>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="col-md-3 mb-md-0 mb-4">
                <Link
                  href={`${ssURL}/tahun-akademik/[id]/jam-mengajar?hari=1`}
                  as={`${ssURL}/tahun-akademik/${ta?.id}/jam-mengajar?hari=1`}
                >
                  <a href="">
                    <div
                      className="kegiatan-items rounded-ss p-3 d-flex align-items-center justify-content-center flex-column"
                      style={{ minHeight: "125px" }}
                    >
                      <img
                        src="/img/icon-side-nav-jam-mengajar.svg"
                        alt=""
                        style={{ width: "50px", height: "50px" }}
                      />
                      <h6 className="mt-2 mb-0 fs-18-ss color-dark fw-bold">
                        Jam Mengajar
                      </h6>
                    </div>
                  </a>
                </Link>
              </div>
              <div className="col-md-3 mb-md-0 mb-4">
                <Link
                  href={`${ssURL}/tahun-akademik/[id]/jadwal-mengajar`}
                  as={`${ssURL}/tahun-akademik/${ta?.id}/jadwal-mengajar`}
                >
                  <a href="">
                    <div
                      className="kegiatan-items rounded-ss p-3 d-flex align-items-center justify-content-center flex-column"
                      style={{ minHeight: "125px" }}
                    >
                      <img
                        src="/img/icon-side-nav-jadwal-mengajar.svg"
                        alt=""
                        style={{ width: "50px", height: "50px" }}
                      />
                      <h6 className="mt-2 mb-0 fs-18-ss color-dark fw-bold">
                        Jadwal Mengajar
                      </h6>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KurikulumDashboard;
