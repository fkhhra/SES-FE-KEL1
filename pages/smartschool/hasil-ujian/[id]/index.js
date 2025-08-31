import Link from "next/link";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import {
  FaBook,
  FaCalendarDay,
  FaChevronLeft,
  FaClock,
  FaCloudDownloadAlt,
  FaLightbulb,
  FaLink,
  FaPen,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import { getMateri } from "../../../../client/MateriClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../../client/clientAxios";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import ModalStep from "../../../../components/Shared/ModalStep/ModalStep";
import HasilJawabanPG from "../../../../components/Ujian/HasilJawabanPG";
import HasilJawabanEsai from "../../../../components/Ujian/HasilJawabanEsai";
import HasilJawabanUraian from "../../../../components/Ujian/HasilJawabanUraian";
import HasilJawabanPGKompleks from "../../../../components/Ujian/HasilJawabanPGKompleks";
import HasilJawabanMenjodohkan from "../../../../components/Ujian/HasilJawabanMenjodohkan";
import { getHasilUjian } from "client/UjianClient";
import { getDetailPesertaUjian } from "client/PesertaUjianClient";
import PenilaianPg from "components/Penilaian/PenilaianPg";
import PenilaianEsai from "components/Penilaian/PenilaianEsai";
import PenilaianPgKompleks from "components/Penilaian/PenilaianPgKompleks";
import PenilaianUraian from "components/Penilaian/PenilaianUraian";
import PenilaianMenjodohkan from "components/Penilaian/PenilaianMenjodohkan";
import useTa from "hooks/useTa";
import useSekolah from "hooks/useSekolah";

const index = ({ id }) => {
  const { subnav } = useRouter().query;
  const router = useRouter();
  const { ta } = useTa();
  const { sekolah } = useSekolah();

  const { nav = "pg" } = router.query;
  const [activeMenu, setActiveMenu] = useState(`/`);

  const [pesertaUjian, setPesertaUjian] = useState(null);
  const ujian = pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian;
  const [metaHasilUjian, setMetaHasilUjian] = useState({});
  const [analisisData, setAnalisisData] = useState([]);
  const [listPeserta, setListPeserta] = useState([]);

  const [materiData, setMateriData] = useState({});
  const { materi } = materiData;

  const getMateriData = async () => {
    const { data } = await getMateri();
    if (data) {
      setMateriData(data);
    }
  };

  const _getDetailPesertaUjian = async (isSiswa = false) => {
    const params = {
      siswa: true,
    };

    const { data } = await getDetailPesertaUjian(id, params);
    if (data) {
      setPesertaUjian(data?.pesertaUjian);
      setMetaHasilUjian(data?.metaHasil);
      setAnalisisData(data?.analisisData);
      setListPeserta(data?.semuaPeserta);
    }
  };

  const navMenus =
    ujian?.tipe != "literasi" && ujian?.tipe != "numerasi"
      ? [
          {
            query: { nav: "pg" },
            text: "Pilihan Ganda",
            active: nav == "pg" || nav == undefined,
            dataJoyride: "pg",
          },
          {
            query: { nav: "esai" },
            text: "Esai",
            active: nav == "esai",
            dataJoyride: "esai",
          },
        ]
      : [
          {
            value: "pg",
            label: "Pilihan Ganda",
          },
          {
            value: "pg_kompleks",
            label: "Pilihan Ganda Kompleks",
          },
          {
            value: "esai",
            label: "Esai",
          },
          {
            value: "uraian",
            label: "Uraian",
          },
          {
            value: "menjodohkan",
            label: "Menjodohkan",
          },
        ];
  const onChangeDropdownFilter = (e) => {
    router.push({
      pathname: `${ssURL}/hasil-ujian/${id}`,
      query: {
        nav: e.value,
      },
    });
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    getMateriData();
  }, []);

  useEffect(() => {
    _getDetailPesertaUjian();

    // if (sekolah?.id != 8123) {
    //   router.back();
    // }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const navItems = [
    {
      url: `${ssURL}/jadwal-ujian/[id]?nav=ujian`,
      as: `${ssURL}/jadwal-ujian/1?nav=ujian`,
      text: "Ujian",
      active: nav == "ujian" || nav == undefined,
    },
    {
      url: `${ssURL}/jadwal-ujian/[id]?nav=remedial`,
      as: `${ssURL}/jadwal-ujian/1?nav=remedial`,
      text: "Remedial",
      active: nav == "remedial",
    },
    {
      url: `${ssURL}/jadwal-ujian/[id]?nav=susulan`,
      as: `${ssURL}/jadwal-ujian/1?nav=susulan`,
      text: "Susulan",
      active: nav == "susulan",
    },
  ];

  const NavJadwalUjianDetail = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary">
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Unduh Absen
                  </button>
                </div>
                <div className="dropdown dropdown-ss d-flex flex-column">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Jadwal
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianRemedial"
                      >
                        <span>Remedial</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianSusulan"
                      >
                        <span>Susulan</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Layout modalWrapper={<></>}>
      <AnimatePage>
        <div className="row gy-4">
          {/* Header Jadwal Ujian Detail End */}
          <div className="col-md-12">
            <Link href={`${ssURL}/jadwal-ujian/`}>
              <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="col-lg-12 mt-4">
              <div className="row gy-4">
                <div className="col-md-12">
                  {/* Header Peserta Ujian Detail End */}
                  <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mb-4">
                    {/* Card Label & Option Start */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {/* Peserta Ujian Label Start */}

                      <div className="jadwal-ujian-label label-ss bg-soft-success color-success rounded-pill fs-12-ss fw-bold">
                        Tuntas
                      </div>

                      {/* Peserta Ujian Label End */}
                    </div>
                    {/* Card Label & Option End */}
                    {/* Peserta Ujian Title Start */}
                    <div className="w-75 text-break">
                      <h2 className="color-dark fw-black mb-4">
                        {/* {pesertaUjian?.user?.nama} */}
                        {pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.nama} -
                        Kelas{" "}
                        {pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat}
                      </h2>
                    </div>
                    {/* Peserta Ujian Title End */}

                    {/* Peserta Ujian Info Start */}
                    {pesertaUjian?.jadwalUjian?.jadwalUjian?.tampilNilai ==
                      1 && (
                      <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between">
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                          <p className="fs-14-ss color-secondary mb-2">Benar</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {metaHasilUjian?.benar || 0} Soal
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-3">
                          <p className="fs-14-ss color-secondary mb-2">Salah</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {pesertaUjian?.jadwalUjian?.jadwalUjian
                              ?.jumlahSoal - metaHasilUjian?.benar || 0}{" "}
                            Soal
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-5">
                          <p className="fs-14-ss color-secondary mb-2">
                            Jumlah
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {pesertaUjian?.jadwalUjian?.jadwalUjian
                              ?.jumlahSoal || 0}{" "}
                            Soal
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                          <p className="fs-14-ss color-secondary mb-2">PG</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {metaHasilUjian?.nilaiPg} Poin
                          </p>
                        </div>
                        {(ujian?.tipe == "literasi" ||
                          ujian?.tipe == "numerasi") && (
                          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                            <p className="fs-14-ss color-secondary mb-2">
                              PG Kompleks
                            </p>
                            <p className="fs-18-ss fw-bold color-dark m-0">
                              {metaHasilUjian?.nilaiPgKompleks} Poin
                            </p>
                          </div>
                        )}
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-4">
                          <p className="fs-14-ss color-secondary mb-2">Esai</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {metaHasilUjian?.nilaiEsai} Poin
                          </p>
                        </div>
                        {(ujian?.tipe == "literasi" ||
                          ujian?.tipe == "numerasi") && (
                          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                            <p className="fs-14-ss color-secondary mb-2">
                              Uraian
                            </p>
                            <p className="fs-18-ss fw-bold color-dark m-0">
                              {metaHasilUjian?.nilaiUraian} Poin
                            </p>
                          </div>
                        )}
                        {(ujian?.tipe == "literasi" ||
                          ujian?.tipe == "numerasi") && (
                          <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                            <p className="fs-14-ss color-secondary mb-2">
                              Menjodohkan
                            </p>
                            <p className="fs-18-ss fw-bold color-dark m-0">
                              {metaHasilUjian?.nilaiMenjodohkan} Poin
                            </p>
                          </div>
                        )}
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-last">
                          <p className="fs-14-ss color-secondary mb-2">
                            Total Nilai
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {metaHasilUjian?.nilaiTotal} Poin
                          </p>
                        </div>
                      </div>
                    )}
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
                  {/* Header Peserta Ujian Detail End */}

                  {/* Nav Pg atau Esai */}
                  {pesertaUjian?.jadwalUjian?.jadwalUjian?.tampilJawaban ==
                    1 && (
                    <div className="card card-ss mb-4">
                      {ujian?.tipe != "literasi" &&
                      ujian?.tipe != "numerasi" ? (
                        <div className="d-flex flex-column flex-lg-row">
                          {navMenus?.map((nav, idx) => {
                            return (
                              <a
                                key={`${idx}-${new Date().getTime()}`}
                                className={`nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary ${
                                  nav.active ? "active" : ""
                                }`}
                                onClick={() =>
                                  router.push({
                                    pathname: `${ssURL}/hasil-ujian/${id}`,
                                    query: { ...nav?.query },
                                  })
                                }
                                data-joyride={nav?.dataJoyride || ""}
                              >
                                {nav.text}
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="nav-link nav-link-ss py-md-4 py-3 mx-4 fw-bold color-secondary">
                          <Dropdown
                            listValue={navMenus}
                            defaultValue={
                              navMenus?.find((bentuk) => bentuk?.value === nav)
                                ?.label
                            }
                            onChange={onChangeDropdownFilter}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detail Jawaban Items PG Benar Start */}
                  {pesertaUjian?.jadwalUjian?.jadwalUjian?.tampilJawaban == 1 &&
                    pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.soalUjian?.map(
                      (soalId, idx) => {
                        const jawaban = pesertaUjian?.jawabanSiswa?.find(
                          (d) => d?.mSoalUjianId == soalId?.mSoalUjianId
                        );
                        if (
                          jawaban?.soal?.bentuk &&
                          jawaban?.soal?.bentuk?.trim().toLowerCase() == nav
                        ) {
                          if (
                            jawaban?.soal?.bentuk?.trim().toLowerCase() === "pg"
                          ) {
                            return (
                              <PenilaianPg
                                pesertaUjian={pesertaUjian}
                                idx={idx}
                                jawaban={jawaban}
                                ta={ta}
                              />
                            );
                          } else if (
                            jawaban?.soal?.bentuk?.trim().toLowerCase() ===
                            "esai"
                          ) {
                            return (
                              <PenilaianEsai
                                jawaban={jawaban}
                                ta={ta}
                                pesertaUjian={pesertaUjian}
                                idx={idx}
                                getDetailPesertaUjian={_getDetailPesertaUjian}
                              />
                            );
                          } else if (
                            jawaban?.soal?.bentuk?.trim().toLowerCase() ===
                            "pg_kompleks"
                          ) {
                            return (
                              <PenilaianPgKompleks
                                pesertaUjian={pesertaUjian}
                                idx={idx}
                                jawaban={jawaban}
                                ta={ta}
                              />
                            );
                          } else if (
                            jawaban?.soal?.bentuk?.trim().toLowerCase() ===
                            "uraian"
                          ) {
                            return (
                              <PenilaianUraian
                                pesertaUjian={pesertaUjian}
                                idx={idx}
                                jawaban={jawaban}
                                ta={ta}
                              />
                            );
                          } else if (
                            jawaban?.soal?.bentuk?.trim().toLowerCase() ===
                            "menjodohkan"
                          ) {
                            return (
                              <PenilaianMenjodohkan
                                pesertaUjian={pesertaUjian}
                                idx={idx}
                                jawaban={jawaban}
                                ta={ta}
                              />
                            );
                          }
                        }
                      }
                    )}

                  {/* Detail Jawaban Items PG Benar End */}
                </div>
              </div>
            </div>
          </div>
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
