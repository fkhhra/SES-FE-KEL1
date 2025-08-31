import { Empty } from "antd";
import ModalUbahDataDashboard from "components/Layout/ModalUbahDataDashboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { downloadURL, ssURL } from "../../../client/clientAxios";
import {
  deleteRombel,
  downloadRombel,
  getRombel,
} from "../../../client/RombelClient";
import Layout from "../../../components/Layout/Layout";
import ModalTambahRombel from "../../../components/Rombel/ModalTambahRombel";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import CardKelasSkeleton from "../../../components/Shared/Skeleton/CardKelasSkeleton";
import useUser from "../../../hooks/useUser";
import {
  momentPackage,
  optionHari,
  renderJamMengajar,
} from "../../../utilities/HelperUtils";

const initialFormData = {
  tingkat: "",
  mJurusanId: "",
  mUserId: "",
  kode: "",
};

const index = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [rombelData, setRombelData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [kodeHari, setKodeHari] = useState(new Date().getDay());
  const [listTingkat, setListTingkat] = useState([]);
  const [listJurusan, setListJurusan] = useState([]);
  const [listGuru, setListGuru] = useState([]);
  const [search, setSearch] = useState("");
  const [modalUbahDataDashboard, setModalUbahDataDashboard] = useState(false);

  const [debounceSearch] = useDebounce(search, 400);

  const {
    rombel,
    userRole,
    jadwalMengajar,
    rombelMengajar,
    absen,
    dataTA,
    semuaTA,
  } = rombelData;

  const router = useRouter();
  const { nav } = router.query;

  const handleClickRombel = async (rombel_id) => {
    const { data } = await downloadRombel({ rombel_id });

    window.open(`${downloadURL}/${data}`, "_blank");
  };

  const steps = [
    {
      target: ".card-jadwal-hari-ini",
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Jadwal Hari Ini</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "guru"
              ? "Berisi informasi mengenai jadwal mengajar hari ini, mulai dari kelas mengajar, pelajaran yang diajar dan juga kapan waktu mengajar."
              : "Berisi mengenai informasi mengenai jadwal belajar hari ini, mulai dari mata pelajaran yang diajar, guru yang mengajar, dan juga waktu dimulai. "}
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: ".daftar-kelas",
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Kelas</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "guru" ? (
              <>
                Daftar kelas kelas yang anda ajar. Terdapat informasi mengenai
                kode kelas dan juga mata pelajaran yang diajar. Tekan tombol
                "lihat kelas" untuk berinteraksi dengan murid di kelas anda.
              </>
            ) : (
              <>
                Daftar kelas belajar kamu, terdapat informasi mengenai mata
                pelajaran dan guru yang mengajar. Tekan tombol "lihat kelas"
                untuk mengikuti kegiatan di kelas.
              </>
            )}
          </p>
        </div>
      ),
    },
    {
      target: ".joyride-kelas-info",
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Informasi Kelas</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk mengetahui informasi kelas.
          </p>
        </div>
      ),
    },

    // ADMIN
    {
      target: '[data-joyride="reguler"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rombel Reguler</h5>
          <p className="color-secondary fw-semibold">
            Menu ini berisikan semua informasi mengenai daftar rombel reguler.
            Tekan pada bagian menu ini untuk melihat informasi dari daftar
            rombel reguler.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="ekskul"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rombel Ekstrakurikuler</h5>
          <p className="color-secondary fw-semibold">
            Menu ini berisikan semua informasi mengenai daftar rombel
            ekstrakurikuler. Tekan pada bagian menu ini untuk melihat informasi
            dari daftar rombel ektrakurikuler
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="teori"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rombel Peminatan</h5>
          <p className="color-secondary fw-semibold">
            Menu ini berisikan semua informasi mengenai daftar rombel peminatan.
            Tekan pada bagian menu ini untuk melihat informasi dari daftar
            rombel peminatan.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="praktik"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rombel Praktik</h5>
          <p className="color-secondary fw-semibold">
            Menu ini berisikan semua informasi mengenai daftar rombel praktik.
            Tekan pada bagian menu ini untuk melihat informasi dari daftar
            rombel praktik.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-tambah-rombel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">
            Ingin Menambahkan Rombel Baru ?
          </h5>
          <p className="color-secondary fw-semibold">
            Tekan pada tombol untuk menambahkan rombel baru di sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-rombel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Rombel</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar rombel yang sudah ditambahkan ke sekolah anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="informasi-rombel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Informasi Rombel</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin melihat informasi detail dari rombel.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="edit-rombel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Edit Rombel</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin mengedit informasi mengenai data rombel
            yang sudah dibuat.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="delete-rombel"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Hapus Rombel</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol jika anda ingin menghapus data rombel yang sudah
            dibuat.
          </p>
        </div>
      ),
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action } = data;
    if (action === "reset" || action === "close") {
      setJoyrideConfig({ ...joyrideConfig, [router.pathname]: true });
    }
  };

  const getRombelData = async () => {
    setLoading(true);
    const { data } = await getRombel({
      kode_hari: kodeHari,
      jam_saat_ini: momentPackage().format("HH:mm"),
      kelompok: !nav ? "reguler" : nav,
    });
    if (data) {
      setRombelData(data);
      setListTingkat(data.tingkat);
      setListJurusan(data.jurusan);
      setListGuru(data.guru);
    }
    setLoading(false);
  };

  const handleDeleteRombelData = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteRombel(id);
        if (data) {
          toast.success(data?.message);
          getRombelData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const onClickEdit = (data) => {
    if (data) {
      setEditData({
        id: data.id,
        tingkat: data.tingkat,
        mJurusanId: data.mJurusanId,
        mUserId: data.mUserId,
        kode: data.nama
          .replace(`${data.tingkat} `, "")
          .replace(
            `${listJurusan.find((d) => d.id == data.mJurusanId)?.kode} `,
            ""
          ),
      });
    }
  };

  const navItems = [
    {
      url: `${router.route}?nav=reguler`,
      text: "Reguler",
      active: nav == "reguler" || !nav,
      dataJoyride: "reguler",
    },
    {
      url: `${router.route}?nav=ekskul`,
      text: "Ekstrakurikuler",
      active: nav == "ekskul",
      dataJoyride: "ekskul",
    },
    {
      url: `${router.route}?nav=teori`,
      text: "Teori (Peminatan)",
      active: nav == "teori",
      dataJoyride: "teori",
    },
    {
      url: `${router.route}?nav=praktik`,
      text: "Praktik",
      active: nav == "praktik",
      dataJoyride: "praktik",
    },
  ];

  useEffect(() => {
    getRombelData();
  }, [kodeHari, nav]);

  // useEffect(() => {
  //   getRombelData();
  // }, [nav]);

  // useEffect(() => {
  //   getRombelData();
  // }, []);

  const janganUlangRombel = [];

  return (
    <Layout
      modalWrapper={
        <>
          <ModalTambahRombel
            editId={editId}
            listTingkat={listTingkat?.map((d) => ({ label: d, value: d }))}
            listJurusan={listJurusan?.map((d) => ({
              label: d.kode,
              value: d.id,
            }))}
            listGuru={listGuru?.map((d) => ({ label: d.nama, value: d.id }))}
            getRombelData={getRombelData}
            editData={editData}
            nav={nav}
          />
        </>
      }
    >
      <MyJoyride steps={steps} />
      <AnimatePage>
        {(user?.role == "guru" || user?.role == "siswa") && (
          <>
            {user?.role == "guru" && (
              <div className="card card-ss d-flex justify-content-between my-4 w-100 bg-white p-4 rounded-3 flex-sm-row flex-column">
                <div className="d-flex align-middle align-items-center fs-24 fw-extrabold text-neutral-100 mb-sm-0 ">
                  <h4 className={"fw-extrabold color-dark mb-0"}>
                    Tahun Ajaran {dataTA?.tahun} - {dataTA?.semester}
                  </h4>
                </div>
                {/* <div
                  className="btn btn-outline-primary btn-primary-ss rounded-5 px-4"
                  // onClick={() => {
                  //   setModalUbahDataDashboard(true);
                  // }}
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahIkatanAlumni"
                > */}
                <button
                  className="btn btn-outline-primary btn-outline-primary-ss rounded-pill px-4"
                  data-bs-toggle="modal"
                  data-bs-target="#modalUbahDataTahun"
                >
                  Ubah
                </button>
                {/* </div> */}
              </div>
            )}
            <div className="row position-relative g-3">
              <div className="col-md-8 order-md-1 order-2">
                <div className="row g-3">
                  {/* Card Kelas Start */}
                  {loading && <CardKelasSkeleton count={7} />}
                  {rombelMengajar?.length ? (
                    <>
                      {!loading &&
                        rombelMengajar
                          ?.filter((d) => {
                            if (
                              !janganUlangRombel.find(
                                (e) =>
                                  e.mRombelId == d.mRombelId &&
                                  e.mMataPelajaranId == d.mMataPelajaranId
                              )
                            ) {
                              janganUlangRombel.push(d);
                              return true;
                            } else {
                              return false;
                            }
                          })
                          ?.map((d, idx) => {
                            return (
                              <div
                                className="col-md-6 daftar-kelas"
                                key={`${idx}-${new Date().getTime()}`}
                              >
                                <div className="card-kelas-ss card card-ss px-0">
                                  <div className="card-body px-3 pt-3 justify-content-between d-flex">
                                    <div className="card-kelas-name text-white">
                                      <h5 className="mb-1 fw-black">
                                        {userRole === "guru" ? (
                                          d.rombel?.nama
                                        ) : (
                                          <Link href={`${ssURL}/materi`}>
                                            <span>{d.mataPelajaran?.nama}</span>
                                          </Link>
                                        )}
                                      </h5>
                                      <p className="m-0 fw-semibold">
                                        {userRole === "guru" ? (
                                          <Link href={`${ssURL}/materi`}>
                                            <span>{d.mataPelajaran?.nama}</span>
                                          </Link>
                                        ) : (
                                          d.mataPelajaran?.user?.nama
                                        )}
                                      </p>
                                    </div>
                                    <div className="card-kelas-info hover-scale">
                                      <Link
                                        href={`${ssURL}/rombel/[id]?nav=info`}
                                        as={`${ssURL}/rombel/${d.id}?nav=info`}
                                      >
                                        <a className="joyride-kelas-info">
                                          <img
                                            src={`/img/button-info.svg`}
                                            alt="button-info"
                                          />
                                        </a>
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="card-footer card-footer-ss card-kelas-footer py-3 d-flex justify-content-between flex-lg-row flex-md-column flex-row align-items-lg-center">
                                    {userRole === "guru"
                                      ? d.rombel?.mUserId === user?.id && (
                                          <div className="label-ss rounded-pill fs-12-ss label-light-primary-ss fw-bolder mb-lg-0 mb-md-3 mb-0">
                                            Kelas Perwalian
                                          </div>
                                        )
                                      : null}
                                    {/* <div className="rounded-pill px-3 py-1 bg-danger shadow-danger-ss text-white fs-14-ss mb-lg-0 mb-md-3 mb-0 ">
                                  1 Tugas Saat Ini
                                </div> */}
                                    <Link
                                      href={`${ssURL}/rombel/[id]`}
                                      as={`${ssURL}/rombel/${d?.id}`}

                                      // href={`${ssURL}/kelas/[id]/kegiatan`}
                                      // as={`${ssURL}/kelas/${d?.id}/kegiatan`}
                                    >
                                      <a
                                        className={`${
                                          userRole == "guru" && "ms-auto"
                                        } btn btn-outline-primary btn-outline-primary-ss rounded-pill fs-12-ss fw-bolder py-1 px-3`}
                                      >
                                        Lihat Kelas
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </>
                  ) : (
                    <div className="h-auto">
                      <Empty />
                    </div>
                  )}
                  {/* Card Kelas End */}
                </div>
              </div>
              <div className="col-md-4 order-md-2 order-1">
                {/* Card Jadwal Hari Ini Start */}
                <div className="card card-ss card-jadwal-hari-ini">
                  <div className="card-header card-header-ss text-white py-0 px-0 d-flex justify-content-center align-items-center">
                    <img
                      src={`/img/arrow-left.svg`}
                      alt="arrow-left"
                      onClick={() =>
                        setKodeHari(kodeHari != 0 ? kodeHari - 1 : 6)
                      }
                      className="pointer py-3 px-4"
                    />
                    <h5 className="fw-extrabold fs-18-ss mx-auto mb-0">
                      {optionHari[kodeHari].label}
                    </h5>
                    <img
                      src={`/img/arrow-right.svg`}
                      alt="arrow-right"
                      onClick={() =>
                        setKodeHari(kodeHari != 6 ? kodeHari + 1 : 0)
                      }
                      className="pointer py-3 px-4"
                    />
                  </div>
                  <div className="card-body pt-0 ps-0 pe-0 pb-4">
                    {/* Jadwal Items Start */}
                    {!jadwalMengajar?.length && (
                      <div className="p-4 pb-0 text-center">
                        <img
                          src="/img/empty-state-kelas.png"
                          alt="empty-state"
                          className="img-fluid"
                          height="175px"
                        />
                        <span className="fw-bold mt-3">
                          {user?.role == "guru"
                            ? "Tidak ada jam mengajar hari ini"
                            : "Tidak ada kelas hari ini"}
                        </span>
                      </div>
                    )}

                    {jadwalMengajar?.map((d, idx) => {
                      let adaAbsen;
                      if (user?.role == "siswa") {
                        adaAbsen = absen.find(
                          (timeline) =>
                            timeline.mMataPelajaranId == d?.mataPelajaran?.id
                        );
                      }
                      if (d.aktif) {
                        return (
                          <Link
                            key={`${idx}-${new Date().getTime()}`}
                            href={`${ssURL}/rombel/[id]`}
                            as={`${ssURL}/rombel/${d.id}`}
                          >
                            <div
                              className={`${
                                user?.role === "guru" || !adaAbsen
                                  ? "jadwal-items-active"
                                  : adaAbsen?.tkTimeline[0]?.waktuAbsen == "-"
                                  ? "jadwal-items-non-absen"
                                  : "jadwal-items-active"
                              } px-4 py-3 d-flex justify-content-between align-items-center pointer`}
                            >
                              <div className="w-50">
                                <p
                                  className={`fs-14-ss fw-bold m-0 w-50 ${
                                    user?.role === "guru" || !adaAbsen
                                      ? "color-success"
                                      : adaAbsen?.tkTimeline[0]?.waktuAbsen ==
                                        "-"
                                      ? "color-danger"
                                      : "color-success"
                                  }`}
                                >
                                  {user?.role === "guru"
                                    ? d?.rombel?.nama
                                    : d?.mataPelajaran?.nama}
                                </p>
                                {user?.role == "guru" && (
                                  <p className="fs-12-ss fw-semibold color-secondary m-0">
                                    {d?.mataPelajaran?.nama}
                                  </p>
                                )}
                              </div>
                              <div
                                className={`btn ${
                                  user?.role === "guru" || !adaAbsen
                                    ? "btn-success btn-success-ss"
                                    : adaAbsen?.tkTimeline[0]?.waktuAbsen == "-"
                                    ? "btn-danger btn-danger-ss"
                                    : "btn-success btn-success-ss"
                                } rounded-pill py-1 px-3 fs-12-ss fw-bold`}
                              >
                                {user?.role === "guru"
                                  ? "Mengajar "
                                  : !adaAbsen
                                  ? "Belajar"
                                  : adaAbsen?.tkTimeline[0]?.waktuAbsen == "-"
                                  ? "Belum Absen"
                                  : "Belajar"}
                                {(user?.role === "guru" || !d?.absen) && (
                                  <img
                                    src={`/img/arrow-right.svg`}
                                    alt="arrow-right"
                                    height="12px"
                                  />
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      }

                      if (!d.mataPelajaran) {
                        return;
                      }

                      return (
                        <Link
                          key={`${idx}-${new Date().getTime()}`}
                          href={`${ssURL}/rombel/[id]`}
                          as={`${ssURL}/rombel/${d.id}`}
                        >
                          <div className="jadwal-items px-4 py-3 d-flex justify-content-between align-items-start pointer">
                            <div className="w-50">
                              <p
                                className="fs-14-ss fw-bold color-dark m-0"
                                title={
                                  user?.role === "guru"
                                    ? d?.rombel?.nama
                                    : d?.mataPelajaran?.nama
                                }
                              >
                                {user?.role === "guru"
                                  ? d?.rombel?.nama
                                  : d?.mataPelajaran?.nama}
                              </p>
                              {user?.role == "guru" && (
                                <p className="fs-12-ss fw-semibold color-secondary m-0">
                                  {d?.mataPelajaran?.nama}
                                </p>
                              )}
                            </div>
                            <p className="fs-14-ss fw-semibold color-secondary m-0">
                              {renderJamMengajar(
                                d?.jamMengajar?.jamMulai,
                                d?.jamMengajar?.jamSelesai
                              )}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {/* Card Jadwal Hari Ini End */}
              </div>
            </div>
          </>
        )}
        {user?.role == "admin" && (
          <>
            <Navbar nav={navItems} />
            <div className="card card-ss">
              <div className="card-header py-4 px-0 card-header-ss">
                <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column mx-lg-4 mx-0">
                  <div className="d-flex justify-content-between mx-4">
                    <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                      Rombel
                    </h4>
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold d-lg-none d-sm-block d-none"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-rombel"
                      onClick={() => {
                        setEditData(null);
                        setEditId(null);
                        setFormData({
                          ...formData,
                          tingkat: "",
                          mJurusanId: "",
                          mUserId: "",
                          kode: "",
                        });
                      }}
                      data-joyride="btn-tambah-rombel"
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                  <hr className="d-lg-none d-sm-block d-none" />
                  <div className="row d-lg-none d-sm-flex d-none mx-4">
                    <div className="col-7">
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss w-100"
                        id="exampleFormControlInput1"
                        placeholder="Cari Rombel"
                        autoComplete="off"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {/* <div className="col-5">
                      {" "}
                      <button
                        className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill w-100 h-100 fw-bold color-secondary"
                        onClick={handleClickRombel}
                        data-joyride="unduh-absen"
                      >
                        <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                        Unduh Data
                      </button>
                    </div> */}
                  </div>
                  <div className="d-lg-flex d-sm-none d-flex flex-sm-row flex-column mx-lg-0 mx-4">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-3 mb-lg-0"
                      id="exampleFormControlInput1"
                      placeholder="Cari Rombel"
                      autoComplete="off"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <div className="d-flex flex-column flex-lg-row align-items-lg-center mb-2 mb-md-0 mr-0 mr-md-2">
                      <button
                        className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                        onClick={handleClickRombel}
                        data-joyride="unduh-absen"
                      >
                        <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                        Unduh Data
                      </button>
                    </div> */}
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold d-lg-block d-sm-none d-block"
                      data-bs-toggle="modal"
                      data-bs-target="#modal-rombel"
                      onClick={() => {
                        setEditData(null);
                        setEditId(null);
                        setFormData({
                          ...formData,
                          tingkat: "",
                          mJurusanId: "",
                          mUserId: "",
                          kode: "",
                        });
                      }}
                      data-joyride="btn-tambah-rombel"
                    >
                      <FaPlus /> Tambah
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                {loading && <Skeleton count={4} height={50} />}
                {!loading && (
                  <div className="table-responsive" data-joyride="table-rombel">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>Nomor</th>
                          <th>Kelas</th>
                          <th>Wali Kelas</th>
                          <th>Informasi</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rombel?.length > 0 &&
                          rombel
                            ?.filter(
                              (item) =>
                                debounceSearch.trim() == "" ||
                                item?.nama
                                  ?.toLowerCase()
                                  ?.includes(debounceSearch.toLowerCase())
                            )
                            ?.map((data, idx) => (
                              <tr key={`${idx}-${new Date().getTime()}`}>
                                <td data-th="Nomor">{idx + 1}</td>
                                <td data-th="Kelas">{data?.nama}</td>
                                <td data-th="Wali Kelas">{data.user?.nama}</td>
                                <td>
                                  <Link
                                    href={`${ssURL}/rombel/${data.id}?nav=info&rombel_id=${data.id}`}
                                  >
                                    <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1">
                                      Detail
                                    </a>
                                  </Link>
                                </td>
                                <td data-th="Aksi" className="actions">
                                  <div className="d-flex flex-lg-row flex-md-column flex-row">
                                    {/* <Link
                                      href={`${ssURL}/rombel/${data.id}?nav=info&rombel_id=${data.id}`}
                                    >
                                      <a
                                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        data-joyride="informasi-rombel"
                                      >
                                        <FaInfo className="color-secondary" />
                                      </a>
                                    </Link> */}
                                    <button
                                      type="button"
                                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#modal-rombel"
                                      onClick={() => onClickEdit(data)}
                                      data-joyride="edit-rombel"
                                    >
                                      <FaPen className="color-secondary" />
                                    </button>
                                    <button
                                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      onClick={() =>
                                        handleDeleteRombelData(data?.id)
                                      }
                                      data-joyride="delete-rombel"
                                    >
                                      <FaTrashAlt className="color-secondary" />
                                    </button>
                                    <button
                                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                      onClick={() =>
                                        handleClickRombel(data?.id)
                                      }
                                    >
                                      <IoMdDownload className="color-secondary" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}{" "}
        <ModalUbahDataDashboard
          // initialFormData={initialFormData}
          modalUbahDataDashboard={modalUbahDataDashboard}
          setModalUbahDataDashboard={setModalUbahDataDashboard}
          // sekolahId={sekolahId}
          // setSekolahId={setSekolahId}
          getData={getRombelData}
          // router={router}
          semuaTA={semuaTA}
          dataTA={dataTA}
          // setTahunAjaran={setTahunAjaran}
          // tahunAjaran={tahunAjaran}
          // formData={formData}
          // setFormData={setFormData}
          // editData={editData}
          // _getKeuangan={_getKeuangan}
          // proyek={proyek}
        />
      </AnimatePage>
    </Layout>
  );
};

export default index;
