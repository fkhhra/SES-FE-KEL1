import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "../../../../client/clientAxios";
import {
  getRaporKeterampilan,
  getRaporNilai,
} from "../../../../client/RaporClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import useUser from "../../../../hooks/useUser";
import { momentPackage } from "../../../../utilities/HelperUtils";
import {
  checkLabelStatusTuntas,
  checkStatusTuntas,
} from "../../../../utilities/RaporUtils";
import { checkLabelTeknikPenilaian } from "../../../../utilities/RekapUtils";

const index = ({ id, nilai, subnav, mapelId, jadwalId }) => {
  const { user } = useUser();

  const [detailRaporNilai, setDetailRaporNilai] = useState({});
  const {
    siswa,
    data,
    rata,
    jadwalMengajar,
    dataUjian,
    rataUjian,
    nilaiAkhir,
    ujian,
  } = detailRaporNilai;

  const [detailRaporKeterampilan, setDetailRaporKeterampilan] = useState({});
  const {
    siswaKeterampilan,
    dataKeterampilan,
    rataData,
    proyek,
    praktik,
    portofolio,
    produk,
    jadwalMengajarKeterampilan,
    nilaiAkhir1,
  } = detailRaporKeterampilan;

  const _getDetailRaporNilai = async () => {
    const { data } = await getRaporNilai(mapelId, id);
    if (data) {
      setDetailRaporNilai(data);
    }
  };
  const _getDetailRaporKeterampilan = async () => {
    const { data } = await getRaporKeterampilan(mapelId, id);
    if (data) {
      setDetailRaporKeterampilan(data);
    }
  };

  function round(num, decimalPlaces = 0) {
    num = Math.round(num + "e" + decimalPlaces);
    return Number(num + "e" + -decimalPlaces);
  }

  useEffect(() => {
    nilai == "pengetahuan"
      ? _getDetailRaporNilai()
      : _getDetailRaporKeterampilan();
  }, []);

  const navItems = [
    {
      url: `${ssURL}/rapor-nilai/[id]?mapelId=${mapelId}&jadwalId=${jadwalId}&nilai=pengetahuan&subnav=rekap-tugas`,
      as: `${ssURL}/rapor-nilai/${id}?mapelId=${mapelId}&jadwalId=${jadwalId}&nilai=pengetahuan&subnav=rekap-tugas`,
      text: "Rekap Tugas",
      active: subnav == "rekap-tugas" || subnav == undefined,
      dataJoyride: "rekap-tugas",
    },
    user?.role === "guru" && {
      url: `${ssURL}/rapor-nilai/[id]?mapelId=${mapelId}&jadwalId=${jadwalId}&nilai=pengetahuan&subnav=rekap-ujian-harian`,
      as: `${ssURL}/rapor-nilai/${id}?mapelId=${mapelId}&jadwalId=${jadwalId}&nilai=pengetahuan&subnav=rekap-ujian-harian`,
      text: "Rekap Ujian",
      active: subnav == "rekap-ujian-harian",
      dataJoyride: "rekap-ujian-harian",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="row mb-4">
          <div className="col-md-12">
            <Link
              href={`${ssURL}/rombel/[rombel]?nav=rapor`}
              as={`${ssURL}/rombel/${jadwalId}?nav=rapor`}
            >
              <a className="text-decoration-none fw-bolder color-primary pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mb-4">
              <div className="w-75 text-break">
                <h2 className="color-dark fw-black mb-4">
                  {siswa?.nama || siswaKeterampilan?.nama}
                </h2>
              </div>
              {nilai == "pengetahuan" && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div
                    className={checkLabelStatusTuntas(
                      nilaiAkhir,
                      jadwalMengajar?.mataPelajaran?.kkm
                    )}
                  >
                    {checkStatusTuntas(
                      nilaiAkhir,
                      jadwalMengajar?.mataPelajaran?.kkm
                    )}
                  </div>
                </div>
              )}
              {nilai == "keterampilan" && (
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div
                    className={checkLabelStatusTuntas(
                      rataData,
                      jadwalMengajarKeterampilan?.mataPelajaran?.kkm
                    )}
                  >
                    {checkStatusTuntas(
                      rataData,
                      jadwalMengajarKeterampilan?.mataPelajaran?.kkm
                    )}
                  </div>
                </div>
              )}

              {nilai == "pengetahuan" && (
                <div className="row">
                  <div className="col-lg-8 mb-lg-0 mb-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai UAS
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {ujian?.nilaiUAS?.nilai?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-3">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai UTS
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {ujian?.nilaiUTS?.nilai?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-5">
                        <h6 className="fw-bold color-secondary mb-2">
                          Rata - Rata UH
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {rataUjian?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                        <h6 className="fw-bold color-secondary mb-2">
                          Rata Rata Tugas
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {rata?.toFixed(2) || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 mb-lg-0 mb-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Akhir
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {nilaiAkhir?.toFixed(2) || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">KKM</h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {jadwalMengajar?.mataPelajaran?.kkm || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {nilai == "keterampilan" && (
                <div className="row">
                  <div className="col-lg-8 mb-lg-0 mb-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Praktik
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {praktik?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-3">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Produk
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {produk?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-5">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Proyek
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {proyek?.toFixed(2) || 0}
                        </h4>
                      </div>
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-2">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Portofolio
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {portofolio?.toFixed(2) || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 mb-lg-0 mb-3">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">
                          Nilai Akhir
                        </h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {rataData?.toFixed(2) || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div
                      className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between"
                      style={{ backgroundColor: "#f8f8fb" }}
                    >
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                        <h6 className="fw-bold color-secondary mb-2">KKM</h6>
                        <h4 className="fw-extrabold color-primary m-0">
                          {round(
                            jadwalMengajarKeterampilan?.mataPelajaran?.kkm,
                            2
                          ) || 0}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {nilai == "pengetahuan" && (
            <div className="col-md-12">
              <Navbar nav={navItems} />
            </div>
          )}

          <div className="col-md-12">
            {nilai == "pengetahuan" && (
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <h4 className="fw-extrabold color-dark mb-0">
                    {!subnav || subnav == "rekap-tugas"
                      ? "Daftar Tugas"
                      : "Daftar Ujian"}
                  </h4>
                </div>
                <div className="card-body px-0 pt-0 pb-4">
                  <div className="table-responsive">
                    {!subnav || subnav == "rekap-tugas" ? (
                      <>
                        <table className="table-ss">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Judul Tugas</th>
                              <th className="text-md-center text-start">
                                Nilai
                              </th>
                              <th>Tanggal</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data?.map((d, idx) => {
                              return (
                                <tr>
                                  <td data-th="No" className=" fw-semibold">
                                    {idx + 1}
                                  </td>
                                  <td
                                    data-th="Judul Tugas"
                                    className="color-darl fw-semibold"
                                  >
                                    {d?.rekapRombel?.judul}
                                  </td>
                                  <td data-th="Nilai" className="text-center">
                                    <span className="color-dark fw-extrabold text-center">
                                      {round(d?.nilai, 2)}
                                    </span>
                                  </td>
                                  <td
                                    data-th="Tanggal"
                                    className=" fw-semibold"
                                  >
                                    {momentPackage(
                                      d?.rekapRombel?.tanggal
                                    ).format("dddd, DD MMMM YYYY")}
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-soft-primary">
                              <td
                                className="color-primary fw-bold d-md-block d-none"
                                style={{ opacity: "0" }}
                              ></td>
                              <td className="color-primary fw-bold">
                                Rata Rata Nilai Tugas
                              </td>
                              <td className="color-primary fw-extrabold text-md-center text-start">
                                {round(rata, 2) || 0}
                              </td>
                              <td
                                className="d-md-table-cell d-none"
                                style={{ opacity: "0" }}
                              ></td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <table className="table-ss">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Judul Ujian</th>
                            <th className="text-md-center text-start">Nilai</th>
                            <th>Tanggal</th>
                          </tr>
                        </thead>

                        <tbody>
                          {dataUjian?.map((d, idx) => {
                            return (
                              <tr>
                                <td data-th="No" className=" fw-semibold">
                                  {idx + 1}
                                </td>
                                <td
                                  data-th="Judul Ujian"
                                  className="color-darl fw-semibold"
                                >
                                  {d?.rekapRombel?.judul}
                                </td>
                                <td data-th="Nilai" className="text-center">
                                  <span className="color-dark fw-extrabold text-center">
                                    {round(d?.nilai, 2)}
                                  </span>
                                </td>
                                <td data-th="Tanggal" className=" fw-semibold">
                                  {momentPackage(
                                    d?.rekapRombel?.tanggal
                                  ).format("dddd, DD MMMM YYYY")}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-soft-primary">
                            <td
                              className="color-primary fw-bold d-md-block d-none"
                              style={{ opacity: "0" }}
                            ></td>
                            <td className="color-primary fw-bold">
                              Rata Rata Nilai Tugas
                            </td>
                            <td className="color-primary fw-extrabold text-md-center text-start">
                              {round(rataUjian, 2) || 0}
                            </td>
                            <td
                              className="d-md-table-cell d-none"
                              style={{ opacity: "0" }}
                            ></td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
            {nilai == "keterampilan" && (
              <div className="card card-ss">
                <div className="card-header-ss p-4">
                  <h4 className="fw-extrabold color-dark mb-0">
                    Daftar Nilai Keterampilan
                  </h4>
                </div>
                <div className="card-body px-0 pt-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Judul Tugas</th>
                          <th className="text-md-center text-start">Nilai</th>
                          <th className="text-md-center text-start">
                            Teknik Penilaian
                          </th>
                          <th>Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataKeterampilan?.map((d, idx) => {
                          return (
                            <tr>
                              <td data-th="No" className=" fw-semibold">
                                {idx + 1}
                              </td>
                              <td
                                data-th="Judul Tugas"
                                className="color-darl fw-semibold"
                              >
                                {d?.rekapRombel?.judul}
                              </td>
                              <td
                                data-th="Nilai"
                                className="color-dark fw-extrabold text-center"
                              >
                                {round(d?.nilai, 2)}
                              </td>
                              <td
                                data-th="Teknik Penilaian"
                                className="color-dark fw-extrabold text-center"
                              >
                                <span
                                  className={checkLabelTeknikPenilaian(
                                    d?.rekapRombel?.rekap?.teknik
                                  )}
                                >
                                  {d?.rekapRombel?.rekap?.teknik}
                                </span>
                              </td>
                              <td data-th="Tanggal" className=" fw-semibold">
                                {momentPackage(d?.rekapRombel?.tanggal).format(
                                  "dddd, DD MMMM YYYY"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-soft-primary">
                          <td className="d-md-table-cell d-none"></td>
                          <td className="color-primary fw-bold">
                            Rata Rata Nilai Tugas
                          </td>
                          <td
                            data-th="Nilai"
                            className="color-primary fw-extrabold text-center"
                          >
                            {round(rataData, 2) || 0}
                          </td>
                          <td className="d-md-table-cell d-none"></td>
                          <td className="d-md-table-cell d-none"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nilai, subnav, mapelId, jadwalId },
}) {
  return {
    props: {
      id,
      subnav: subnav || null,
      nilai: nilai || null,
      mapelId: mapelId || null,
      jadwalId,
    },
  };
}

export default index;
