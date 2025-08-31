import PenilaianMenjodohkan from "components/Penilaian/PenilaianMenjodohkan";
import PenilaianPg from "components/Penilaian/PenilaianPg";
import PenilaianPgKompleks from "components/Penilaian/PenilaianPgKompleks";
import PenilaianUraian from "components/Penilaian/PenilaianUraian";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import useTa from "hooks/useTa";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ssURL } from "../../../../client/clientAxios";
import { getMateri } from "../../../../client/MateriClient";
import {
  editJawabanUjianSiswa,
  getDetailPesertaUjian,
} from "../../../../client/PesertaUjianClient";
import LayoutPesertaUjian from "../../../../components/Layout/LayoutPesertaUjian";
import PenilaianEsai from "../../../../components/Penilaian/PenilaianEsai";
import PenilaianIsian from "../../../../components/Penilaian/PenilaianIsian";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import AnalisisUjian from "../../../../components/Ujian/AnalisisUjian";
import ScrollMenuPesertaUjian from "../../../../components/Ujian/ScrollMenuPesertaUjian";
import useUser from "../../../../hooks/useUser";
import { putJadwalUjianRef } from "services/jadwalUjianService";
import useSekolah from "hooks/useSekolah";

const index = ({ id }) => {
  const { subnav } = useRouter().query;
  const router = useRouter();
  const { nav = "pg" } = router.query;

  const { user } = useUser();
  const { ta } = useTa();

  const [durasi, setDurasi] = useState(0);
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

  const { sekolah } = useSekolah();

  const _getDetailPesertaUjian = async (isSiswa = false) => {
    const params = {
      siswa: true,
    };

    const { data } = await getDetailPesertaUjian(id, isSiswa ? params : {});
    if (data) {
      setDurasi(new Date().getTime());
      setPesertaUjian(data.pesertaUjian);
      setMetaHasilUjian(data.metaHasil);
      setAnalisisData(data.analisisData);
      setListPeserta(data.semuaPeserta);
    }
  };

  const handlePutJawabanSiswa = async ({
    jawabanPg,
    soal,
    // jawabanFoto,
  }) => {
    // setIsLoadingUpdateJawaban("loading");
    const payload = {
      durasi: new Date().getTime() - durasi,
      jawabanPg: jawabanPg,
      ganti: 1,
    };

    const { data } = await editJawabanUjianSiswa(payload, soal);

    if (data) {
      // setFormData(initialStateForm);
      _getDetailPesertaUjian(false);
      putJadwalUjianRef(data); // penggunaan firebase nya setelah fungsi backendnya selesai
      // setIsLoadingUpdateJawaban("success");
    } else {
      // setIsLoadingUpdateJawaban("error");
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
          {
            query: { nav: "isian" },
            text: "Isian",
            active: nav == "isian",
            dataJoyride: "isian",
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
      pathname: `${ssURL}/peserta-ujian/${id}`,
      query: {
        nav: e.value,
      },
    });
  };

  useEffect(() => {
    getMateriData();
  }, []);

  useEffect(() => {
    if (user !== "siswa") {
      _getDetailPesertaUjian();
    }
  }, [user, id]);

  if (user?.role == "siswa") {
    router.back();
  }

  return (
    <LayoutPesertaUjian
      url={`${ssURL}/jadwal-ujian/${pesertaUjian?.jadwalUjian?.mJadwalUjianId}?rombel_peserta_id=${pesertaUjian?.tkJadwalUjianId}`}
      title={pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.nama}
      listRombel={listPeserta.filter((item) => item?.peserta?.length > 0)}
      selectedRombel={
        listPeserta.find((item) => item.id == pesertaUjian?.tkJadwalUjianId)
          ?.rombel
      }
    >
      <AnimatePage>
        <div className="mb-4">
          <ScrollMenuPesertaUjian
            listPeserta={
              listPeserta.find(
                (item) => item.id == pesertaUjian?.tkJadwalUjianId
              )?.peserta
            }
            rombel={
              listPeserta.find(
                (item) => item.id == pesertaUjian?.tkJadwalUjianId
              )?.rombel
            }
            selectedId={id}
          />
        </div>
        {(subnav == "detail-jawaban" || subnav == undefined) && (
          <div className="row gy-4">
            <div className="col-lg-3">
              <ul className="nav side-nav-ss shadow-dark-ss bg-white rounded-ss px-3 pt-4 pb-5 flex-column">
                <li className="nav-item">
                  <Link
                    href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                    as={`${ssURL}/peserta-ujian/${pesertaUjian?.id}?subnav=detail-jawaban`}
                  >
                    <a
                      className="nav-link active color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3"
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-subnav-detail-jawaban.svg`}
                        alt=""
                        className="me-2"
                      />
                      Detail Jawaban
                    </a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href={`${ssURL}/peserta-ujian/[id]?subnav=analisis`}
                    as={`${ssURL}/peserta-ujian/${pesertaUjian?.id}?subnav=analisis`}
                  >
                    <a
                      className="nav-link color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3"
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-subnav-analisis.svg`}
                        alt=""
                        className="me-2"
                      />
                      Analisis
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9">
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
                        {pesertaUjian?.user?.nama}
                      </h2>
                    </div>
                    {/* Peserta Ujian Title End */}

                    {/* Peserta Ujian Info Start */}
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
                          {pesertaUjian?.jadwalUjian?.jadwalUjian?.jumlahSoal -
                            metaHasilUjian?.benar || 0}{" "}
                          Soal
                        </p>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-5">
                        <p className="fs-14-ss color-secondary mb-2">Jumlah</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {pesertaUjian?.jadwalUjian?.jadwalUjian?.jumlahSoal ||
                            0}{" "}
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
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-4">
                        <p className="fs-14-ss color-secondary mb-2">Isian</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {metaHasilUjian?.nilaiIsian} Poin
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
                  <div className="card card-ss mb-4">
                    {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? (
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
                                  pathname: `${ssURL}/peserta-ujian/${id}`,
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

                  {/* Detail Jawaban Items PG Benar Start */}
                  {pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.soalUjian?.map(
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
                              sekolah={sekolah}
                              pesertaUjian={pesertaUjian}
                              idx={idx}
                              jawaban={jawaban}
                              handlePutJawabanSiswa={handlePutJawabanSiswa}
                              ta={ta}
                              user={user}
                            />
                          );
                        } else if (
                          jawaban?.soal?.bentuk?.trim().toLowerCase() === "esai"
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
                          "isian"
                        ) {
                          return (
                            <PenilaianIsian
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
        )}
        {subnav == "analisis" && (
          <div className="row gy-4">
            <div className="col-lg-3">
              <ul className="nav side-nav-ss shadow-dark-ss bg-white rounded-ss px-3 pt-4 pb-5 flex-column">
                <li className="nav-item">
                  <Link
                    href={`${ssURL}/peserta-ujian/[id]?subnav=detail-jawaban`}
                    as={`${ssURL}/peserta-ujian/${pesertaUjian?.id}?subnav=detail-jawaban`}
                  >
                    <a
                      className="nav-link color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3"
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-subnav-detail-jawaban.svg`}
                        alt=""
                        className="me-2"
                      />
                      Detail Jawaban
                    </a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href={`${ssURL}/peserta-ujian/[id]?subnav=analisis`}
                    as={`${ssURL}/peserta-ujian/${pesertaUjian?.id}?subnav=analisis`}
                  >
                    <a
                      className="nav-link active color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3"
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-subnav-analisis.svg`}
                        alt=""
                        className="me-2"
                      />
                      Analisis
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9">
              <AnalisisUjian
                analisisData={analisisData}
                ta={ta}
                pesertaUjian={pesertaUjian}
              />
            </div>
          </div>
        )}
      </AnimatePage>
    </LayoutPesertaUjian>
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
