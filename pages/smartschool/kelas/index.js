import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCloudDownloadAlt,
  FaInfo,
  FaPen,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
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

  const { rombel, userRole, jadwalMengajar, rombelMengajar, absen } =
    rombelData;

  const router = useRouter();
  const { nav } = router.query;

  const handleClickRombel = async () => {
    const { data } = await downloadRombel();

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

  let mMataPelajaranId = 0;
  let rombelId = 0;

  return (
    <Layout
      modalWrapper={
        <>
          <ModalTambahRombel
            editId={editId}
            listTingkat={listTingkat}
            listJurusan={listJurusan}
            listGuru={listGuru}
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
            <div className="row position-relative g-3">
              <div className="col-md-8 order-md-1 order-2">
                <div className="row g-3">
                  {/* Card Kelas Start */}
                  {loading && <CardKelasSkeleton count={7} />}
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
                        if (!d.mMataPelajaranId) {
                          return;
                        }
                        if (
                          mMataPelajaranId != d.mMataPelajaranId ||
                          rombelId != d.rombel?.id
                        ) {
                          mMataPelajaranId = d.mMataPelajaranId;
                          rombelId = d.rombel?.id;
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
                                    ? d.rombel?.id === rombel?.id && (
                                        <div className="label-ss rounded-pill fs-12-ss label-light-primary-ss fw-bolder mb-lg-0 mb-md-3 mb-0">
                                          Kelas Perwalian
                                        </div>
                                      )
                                    : null}
                                  {/* <div className="rounded-pill px-3 py-1 bg-danger shadow-danger-ss text-white fs-14-ss mb-lg-0 mb-md-3 mb-0 ">
                                1 Tugas Saat Ini
                              </div> */}
                                  <Link
                                    href={`${ssURL}/kelas/[id]/kegiatan`}
                                    as={`${ssURL}/kelas/${d?.id}/kegiatan`}
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
                        }
                      })}
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
                            href={`${ssURL}/kelas/[id]/kegiatan`}
                            as={`${ssURL}/kelas/${d.id}/kegiatan`}
                          >
                            <div
                              className={`${
                                user?.role === "guru" || !adaAbsen
                                  ? "jadwal-items-active"
                                  : adaAbsen?.tkTimeline[0].waktuAbsen == "-"
                                  ? "jadwal-items-non-absen"
                                  : "jadwal-items-active"
                              } px-4 py-3 d-flex justify-content-between align-items-center pointer`}
                            >
                              <div className="w-50">
                                <p
                                  className={`fs-14-ss fw-bold m-0 w-50 ${
                                    user?.role === "guru" || !adaAbsen
                                      ? "color-success"
                                      : adaAbsen?.tkTimeline[0].waktuAbsen ==
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
                                    : adaAbsen?.tkTimeline[0].waktuAbsen == "-"
                                    ? "btn-danger btn-danger-ss"
                                    : "btn-success btn-success-ss"
                                } rounded-pill py-1 px-3 fs-12-ss fw-bold`}
                              >
                                {user?.role === "guru"
                                  ? "Mengajar "
                                  : !adaAbsen
                                  ? "Belajar"
                                  : adaAbsen?.tkTimeline[0].waktuAbsen == "-"
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
                          href={`${ssURL}/kelas/[id]/kegiatan`}
                          as={`${ssURL}/kelas/${d?.id}/kegiatan`}
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
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                    Rombel
                  </h4>
                  <div className="d-flex">
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center mb-2 mb-md-0 mr-0 mr-md-2">
                      <button
                        className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                        onClick={handleClickRombel}
                        data-joyride="unduh-absen"
                      >
                        <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                        Unduh Data
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
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
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rombel?.length > 0 &&
                          rombel?.map((data, idx) => (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="Nomor">{idx + 1}</td>
                              <td data-th="Kelas">{data?.nama}</td>
                              <td data-th="Wali Kelas">{data.user?.nama}</td>
                              <td data-th="Aksi" className="actions">
                                <div className="d-flex flex-lg-row flex-md-column flex-row">
                                  <Link
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
                                  </Link>
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
        )}
      </AnimatePage>
    </Layout>
  );
};

export default index;
