import LayoutDetailTahunAkademik from "components/Layout/LayoutDetailTahunAkademik";
import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { baseURL, downloadURL, ssURL } from "../../../../../client/clientAxios";
import {
  deleteRombel,
  downloadRombel,
  getRombel,
} from "../../../../../client/RombelClient";
import Layout from "../../../../../components/Layout/Layout";
import ModalTambahRombel from "../../../../../components/Rombel/ModalTambahRombel";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../../../components/Shared/MyJoyride/MyJoyride";
import Navbar from "../../../../../components/Shared/Navbar/Navbar";
import CardKelasSkeleton from "../../../../../components/Shared/Skeleton/CardKelasSkeleton";
import useUser from "../../../../../hooks/useUser";
import {
  momentPackage,
  optionHari,
  renderJamMengajar,
} from "../../../../../utilities/HelperUtils";

const initialFormData = {
  tingkat: "",
  mJurusanId: "",
  mUserId: "",
  kode: "",
};

const index = ({ id }) => {
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

  const [debounceSearch] = useDebounce(search, 400);

  const {
    rombel,
    userRole,
    jadwalMengajar,
    rombelMengajar,
    absen,
    semuaTA,
    dataTA,
  } = rombelData;

  const router = useRouter();
  const { nav, id: taId } = router.query;

  const handleClickRombel = async (rombel_id) => {
    const { data } = await downloadRombel({ rombel_id, ta_id: id });

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
      taId: id,
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
      url: `${ssURL}/tahun-akademik/${taId}/rombel?nav=reguler`,
      text: "Reguler",
      active: nav == "reguler" || !nav,
      dataJoyride: "reguler",
    },
    {
      url: `${ssURL}/tahun-akademik/${taId}/rombel?nav=ekskul`,
      text: "Ekstrakurikuler",
      active: nav == "ekskul",
      dataJoyride: "ekskul",
    },
    {
      url: `${ssURL}/tahun-akademik/${taId}/rombel?nav=teori`,
      text: "Teori (Peminatan)",
      active: nav == "teori",
      dataJoyride: "teori",
    },
    {
      url: `${ssURL}/tahun-akademik/${taId}/rombel?nav=praktik`,
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
    <LayoutDetailTahunAkademik
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
            id={id}
          />
        </>
      }
      semuaTA={semuaTA}
      dataTA={dataTA}
      route={"rombel"}
    >
      <MyJoyride steps={steps} />
      <AnimatePage>
        <div
          className="row mb-4 mt-md-0 mt-4 sticky-top lg-position-static"
          style={{ top: "101px" }}
        >
          <div className="col-md-12">
            <Link href={`${ssURL}/tahun-akademik-v2/`}>
              <a
                className="text-decoration-none fw-bolder position-relative color-primary pointer"
                data-joyride="button-kembali"
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <SideNavTahunAkademik ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <Navbar nav={navItems} />
            <div className="card card-ss">
              <div className="card-header py-4 px-0 card-header-ss">
                <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column mx-lg-4 mx-0">
                  <div className="d-flex justify-content-between mx-lg-0 mx-4">
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
                          <th>Whatsapp</th>
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
                                <td data-th="Whatsapp">
                                  {data.user?.whatsapp}
                                </td>
                                <td>
                                  <Link
                                    href={`${ssURL}/rombel/${data.id}?nav=info&rombel_id=${data.id}`}
                                  >
                                    <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
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
                                      className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
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
          </div>
        </div>
      </AnimatePage>
    </LayoutDetailTahunAkademik>
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
