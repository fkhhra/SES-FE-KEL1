import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { ssURL } from "../../client/clientAxios";
import { deleteTimeline } from "../../client/TimelineClient";
import Navbar from "../../components/Shared/Navbar/Navbar";
import useUser from "../../hooks/useUser";
import DaftarEkstrakurikuler from "./DaftarEkstrakurikuler";
import DaftarKehadiran from "./DaftarKehadiran";
import DaftarKeteranganKelulusan from "./DaftarKeteranganKelulusan";
import DaftarKeteranganPkl from "./DaftarKeteranganPkl";
import DaftarNilaiKeterampilan from "./DaftarNilaiKeterampilan";
import DaftarNilaiPengetahuan from "./DaftarNilaiPengetahuan";
import DaftarNilaiPengetahuanWalas from "./DaftarNilaiPengetahuanWalas";
import DaftarNilaiSikap from "./DaftarNilaiSikap";
import DaftarRanking from "./DaftarRanking";
import DaftarRapor from "./DaftarRapor";
import DaftarSikap from "./DaftarSikap";
import DaftarCatatanSiswa from "./DaftarCatatanSiswa";
import DaftarSikapRaporYadika from "./DaftarSikapRaporYadika";
import useSekolah from "hooks/useSekolah";

const RaporPage = ({
  subnav,
  id,
  setInitialFormData,
  setStateEditData,
  tugasData,
  isLoading,
  getDetailRombelData,
  setIsDuplicate,
  timelineData,
  jadwalMengajar,
  keterangan,
  industri,
  sikapsosial,
  sikapspiritual,
  keteranganRombel,
  totalMapel,
  kkm,
  isInNewKelasPage = false,
  dataTA,
}) => {
  const { user } = useUser();
  const [isTugasLoading, setIsTugasLoading] = useState(isLoading);
  const [activeSubTugas, setActiveSubTugas] = useState([]);
  const { sekolah } = useSekolah();
  const [sekolahId, setSekolahId] = useState(0);

  const {
    tugasDraf,
    tugasSaatIni,
    tugasSelesai,
    tugasTerjadwal,
    tugasTerperiksa,
  } = tugasData || {};
  const kelasRombel = keteranganRombel?.nama;
  const rombel_id = keteranganRombel?.id;
  const deleteTimelineData = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTimeline(id);
        if (data) {
          toast.success(data?.message);
          getDetailRombelData();
        }
      }
    });
  };

  const getActiveSubTugasData = () => {
    let data = [];
    const tugasDataSiswa = timelineData?.timeline?.filter(
      (data) => data.tipe === "tugas"
    );

    if (subnav === "saat-ini" || !subnav) {
      if (user?.role === "guru") {
        data = tugasSaatIni;
      } else {
        data = tugasDataSiswa?.filter((data) => !data.dikumpulkan);
      }
    } else if (subnav === "terjadwal") {
      data = tugasTerjadwal;
    } else if (subnav === "sudah-selesai") {
      if (user?.role === "guru") {
        data = tugasSelesai;
      } else {
        data = tugasDataSiswa?.filter((data) => data.dikumpulkan === 1);
      }
    } else if (subnav === "terperiksa") {
      data = tugasTerperiksa;
    } else {
      data = tugasDraf;
    }

    setActiveSubTugas(data);
  };

  const navItems = [
    {
      url: `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-pengetahuan`,
      as: `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-pengetahuan`,
      text: "Nilai Pengetahuan",
      active: subnav == "nilai-pengetahuan" || subnav == undefined,
      dataJoyride: "nilai-pengetahuan",
    },
    user?.role === "guru" && {
      url: `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-keterampilan`,
      as: `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-keterampilan`,
      text: "Nilai Keterampilan",
      active: subnav == "nilai-keterampilan",
      dataJoyride: "nilai-keterampilan",
    },
    {
      url: `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-sikap`,
      as: `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-sikap`,
      text: "Nilai Sikap",
      active: subnav == "nilai-sikap",
      dataJoyride: "nilai-sikap",
    },
  ];

  useEffect(() => {
    if (tugasData) {
      setIsTugasLoading(true);
      setTimeout(() => {
        getActiveSubTugasData();
        setIsTugasLoading(false);
      }, 350);
    }
  }, [subnav, tugasData]);

  useEffect(() => {
    if (sekolah?.id) {
      setSekolahId(sekolah?.id);
    }
  }, [sekolah]);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          {jadwalMengajar?.rombel?.mUserId == user?.id ? (
            <>
              <div className="subnav-rapor card card-ss mb-4">
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <div className="dropdown dropdown-ss dropdown-subnav-rapor d-flex flex-column">
                    {/* <Link
                      href={`${ssURL}/rombel/[id]?nav=rapor`}
                      as={`${ssURL}/rombel/${id}?nav=rapor`}
                    >
                      <a
                        className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                          !subnav && "active"
                        }`}
                      >
                        Nilai
                      </a>
                    </Link> */}
                    <a
                      className={`dropdown-toggle subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        (subnav == "nilai-pengetahuan" ||
                          subnav == "nilai-keterampilan" ||
                          subnav == "nilai-sikap" ||
                          subnav == "semua-nilai" ||
                          !subnav) &&
                        "active"
                      }`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {subnav == "nilai-keterampilan"
                        ? "Nilai Keterampilan"
                        : subnav == "nilai-sikap"
                        ? "Nilai Sikap"
                        : subnav == "semua-nilai"
                        ? "Semua Nilai"
                        : "Nilai Pengetahuan"}
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=nilai-pengetahuan`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-pengetahuan`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=nilai-pengetahuan`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-pengetahuan`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              (subnav == "nilai-pengetahuan" || !subnav) &&
                              "active"
                            }`}
                          >
                            <span>Nilai Pengetahuan</span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=nilai-keterampilan`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-keterampilan`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=nilai-keterampilan`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-keterampilan`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "nilai-keterampilan" && "active"
                            }`}
                          >
                            <span>Nilai Keterampilan</span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=nilai-sikap`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=nilai-sikap`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=nilai-sikap`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=nilai-sikap`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "nilai-sikap" && "active"
                            }`}
                          >
                            <span>Nilai Sikap</span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=semua-nilai`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=semua-nilai`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=semua-nilai`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=semua-nilai`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "semua-nilai" && "active"
                            }`}
                          >
                            <span>Semua Nilai</span>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Link
                    href={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/[id]/rapor?subnav=sikap`
                        : `${ssURL}/rombel/[id]?nav=rapor&subnav=sikap`
                    }
                    as={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/${id}/rapor?subnav=sikap`
                        : `${ssURL}/rombel/${id}?nav=rapor&subnav=sikap`
                    }
                  >
                    <a
                      className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        subnav == "sikap" && "active"
                      }`}
                    >
                      Sikap Rapor
                    </a>
                  </Link>
                  <Link
                    href={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/[id]/rapor?subnav=kehadiran`
                        : `${ssURL}/rombel/[id]?nav=rapor&subnav=kehadiran`
                    }
                    as={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/${id}/rapor?subnav=kehadiran`
                        : `${ssURL}/rombel/${id}?nav=rapor&subnav=kehadiran`
                    }
                  >
                    <a
                      className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        subnav == "kehadiran" && "active"
                      }`}
                    >
                      Kehadiran
                    </a>
                  </Link>
                  <div className="dropdown dropdown-ss dropdown-subnav-rapor d-flex flex-column">
                    <a
                      className={`dropdown-toggle subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        (subnav == "keterangan-kelulusan" ||
                          subnav == "keterangan-pkl") &&
                        "active"
                      }`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Keterangan
                    </a>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=keterangan-kelulusan`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=keterangan-kelulusan`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=keterangan-kelulusan`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=keterangan-kelulusan`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "keterangan-kelulusan" && "active"
                            }`}
                          >
                            <span>Keterangan Kelulusan</span>
                          </a>
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          href={`${ssURL}/rombel/[id]?nav=rapor&subnav=catatan-siswa`}
                          as={`${ssURL}/rombel/${id}?nav=rapor&subnav=catatan-siswa`}
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "catatan-siswa" && "active"
                            }`}
                          >
                            <span>Catatan Siswa</span>
                          </a>
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          href={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/[id]/rapor?subnav=keterangan-pkl`
                              : `${ssURL}/rombel/[id]?nav=rapor&subnav=keterangan-pkl`
                          }
                          as={
                            isInNewKelasPage
                              ? `${ssURL}/kelas/${id}/rapor?subnav=keterangan-pkl`
                              : `${ssURL}/rombel/${id}?nav=rapor&subnav=keterangan-pkl`
                          }
                        >
                          <a
                            className={`dropdown-item pointer ${
                              subnav == "keterangan-pkl" && "active"
                            }`}
                          >
                            <span>Keterangan PKL</span>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Link
                    href={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/[id]/rapor?subnav=ekstrakurikuler`
                        : `${ssURL}/rombel/[id]?nav=rapor&subnav=ekstrakurikuler`
                    }
                    as={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/${id}/rapor?subnav=ekstrakurikuler`
                        : `${ssURL}/rombel/${id}?nav=rapor&subnav=ekstrakurikuler`
                    }
                  >
                    <a
                      className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        subnav == "ekstrakurikuler" && "active"
                      }`}
                    >
                      Ekstrakurikuler
                    </a>
                  </Link>
                  <Link
                    href={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/[id]/rapor?subnav=lihat-rapor`
                        : `${ssURL}/rombel/[id]?nav=rapor&subnav=lihat-rapor`
                    }
                    as={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/${id}/rapor?subnav=lihat-rapor`
                        : `${ssURL}/rombel/${id}?nav=rapor&subnav=lihat-rapor`
                    }
                  >
                    <a
                      className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        subnav == "lihat-rapor" && "active"
                      }`}
                    >
                      Lihat Rapor
                    </a>
                  </Link>
                  <Link
                    href={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/[id]/rapor?subnav=rank`
                        : `${ssURL}/rombel/[id]?nav=rapor&subnav=rank`
                    }
                    as={
                      isInNewKelasPage
                        ? `${ssURL}/kelas/${id}/rapor?subnav=rank`
                        : `${ssURL}/rombel/${id}?nav=rapor&subnav=rank`
                    }
                  >
                    <a
                      className={`subnav-link py-md-4 py-3 mx-4 fw-bold color-secondary ${
                        subnav == "rank" && "active"
                      }`}
                    >
                      Ranking
                    </a>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Navbar nav={navItems} />
          )}
        </div>
        <div className="col-md-12">
          {(subnav == "nilai-pengetahuan" || !subnav) && (
            <DaftarNilaiPengetahuan
              keterangan={keterangan}
              rombel_id={id}
              kkm={jadwalMengajar?.mataPelajaran?.kkm}
              mapelId={jadwalMengajar?.mataPelajaran?.id}
              getDetailRombelData={getDetailRombelData}
            />
          )}
          {subnav == "nilai-keterampilan" && (
            <DaftarNilaiKeterampilan
              keterangan={keterangan}
              rombel_id={id}
              kkm={jadwalMengajar?.mataPelajaran?.kkm}
              mapelId={jadwalMengajar?.mataPelajaran?.id}
              getDetailRombelData={getDetailRombelData}
            />
          )}
          {subnav == "nilai-sikap" && (
            <DaftarNilaiSikap
              keterangan={keterangan}
              sikapsosial={sikapsosial}
              sikapspiritual={sikapspiritual}
            />
          )}
          {subnav == "semua-nilai" && (
            <DaftarNilaiPengetahuanWalas
              keterangan={keterangan}
              jadwalMengajar={jadwalMengajar}
              rombel_id={id}
              kkm={kkm}
              user={user}
              totalMapel={totalMapel}
              getDetailRombelData={getDetailRombelData}
            />
          )}
          {subnav == "keterangan-kelulusan" && (
            <DaftarKeteranganKelulusan
              sekolah={sekolah}
              keterangan={keterangan}
              getDetailRombelData={getDetailRombelData}
              rombel_id={rombel_id}
              dataTA={dataTA}
            />
          )}
          {subnav == "catatan-siswa" && (
            <>
              <DaftarCatatanSiswa
                keterangan={keterangan}
                getD
                etailRombelData={getDetailRombelData}
              />
            </>
          )}
          {subnav == "ekstrakurikuler" && (
            <DaftarEkstrakurikuler
              keterangan={keterangan}
              getDetailRombelData={getDetailRombelData}
              kelasRombel={kelasRombel}
              rombel_id={rombel_id}
            />
          )}
          {subnav == "sikap" && (
            <>
              {user?.mSekolahId == "33" ? (
                <DaftarSikapRaporYadika
                  keterangan={keterangan}
                  sikapsosial={sikapsosial}
                  sikapspiritual={sikapspiritual}
                  getDetailRombelData={getDetailRombelData}
                />
              ) : (
                <DaftarSikap
                  keterangan={keterangan}
                  sikapsosial={sikapsosial}
                  sikapspiritual={sikapspiritual}
                  getDetailRombelData={getDetailRombelData}
                  rombel_id={rombel_id}
                  dataTA={dataTA}
                />
              )}
            </>
          )}
          {subnav == "kehadiran" && (
            <DaftarKehadiran
              keterangan={keterangan}
              sikapsosial={sikapsosial}
              sikapspiritual={sikapspiritual}
              getDetailRombelData={getDetailRombelData}
              rombel_id={rombel_id}
              dataTA={dataTA}
            />
          )}
          {subnav == "keterangan-pkl" && (
            <DaftarKeteranganPkl
              keterangan={keterangan}
              industri={industri}
              getDetailRombelData={getDetailRombelData}
              rombel_id={rombel_id}
              dataTA={dataTA}
            />
          )}
          {subnav == "lihat-rapor" && (
            <DaftarRapor
              rombel_id={jadwalMengajar?.rombel?.id}
              keterangan={keterangan}
              jadwalMengajar={jadwalMengajar?.id}
              totalMapel={totalMapel}
              kkm={kkm}
            />
          )}
          {subnav == "rank" && (
            <DaftarRanking
              keterangan={keterangan}
              getDetailRombelData={getDetailRombelData}
              kkm={kkm}
              totalMapel={totalMapel}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RaporPage;
