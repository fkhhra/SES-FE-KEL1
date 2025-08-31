import Link from "next/link";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import {
  FaClone,
  FaFilter,
  FaPen,
  FaPlus,
  FaSearchMinus,
  FaTrashAlt,
} from "react-icons/fa";
import { getMateri } from "client/MateriClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "client/clientAxios";
import Navbar from "components/Shared/Navbar/Navbar";
import WhatsappLink from "components/Shared/WhatsappLink/WhatsappLink";
import ReactiveButton from "reactive-button";
import NewModal from "components/Shared/NewModal/NewModal";
import {
  getUjian,
  postUjian,
  deleteUjian,
  editUjian,
} from "client/UjianClient";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { hideModal } from "utilities/ModalUtils";
import UjianSkeleton from "components/Shared/Skeleton/UjianSkeleton";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import useUser from "hooks/useUser";
import useSekolah from "hooks/useSekolah";
import moment from "moment";
import { useDebounce } from "use-debounce";
import { Pagination } from "antd";
import Select from "react-select";
import SideNavPPDB from "components/PPDB/SideNavPPDB";

const initialFormData = {
  nama: "",
  tipe: "ppdb",
};

const index = () => {
  const { user } = useUser();
  const { sekolah } = useSekolah();
  const { subnav } = useRouter().query;
  const router = useRouter();
  const path = router.pathname;

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [materiData, setMateriData] = useState({});
  const [ujianData, setUjianData] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [duplikat, setDuplikat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState({
    nama: "",
  });
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [debounceSearch] = useDebounce(search.nama, 600);

  const { mataPelajaran, tingkat, tipeUjian, ujian, total, lastPage } =
    ujianData;

  const navMenus = [
    {
      href: `${ssURL}/ujian-penerimaan-ppdb`,
      as: `${ssURL}/ujian-penerimaan-ppdb`,
      text: "Jadwal Ujian",
      active: path == `/smartschool/ujian-penerimaan-ppdb`,
      isVisible: true,
      dataJoyride: "Jadwal Ujian",
    },
    {
      href: `${ssURL}/ujian-penerimaan-ppdb/soal`,
      as: `${ssURL}/ujian-penerimaan-ppdb/soal`,
      text: "Bank Soal",
      active: path == `/smartschool/ujian-penerimaan-ppdb/soal`,
      isVisible: true,
      dataJoyride: "Bank Soal",
    },
  ];

  const setInitialFormData = () => {
    setEditId(null);
    setFormData(initialFormData);
  };

  const onClickEdit = (editData) => {
    setEditId(editData?.id);
    setFormData({
      nama: editData?.nama,
      tipe: editData?.tipe,
      tingkat: editData?.tingkat,
    });
  };

  const onClickDuplikat = (data) => {
    setDuplikat(true);
    setFormData({
      ujianId: data?.id,
      nama: data?.nama,
      tipe: data?.tipe,
    });
  };

  const getMateriData = async () => {
    const { data } = await getMateri();
    if (data) {
      setMateriData(data);
    }
  };

  const getUjianData = async () => {
    setLoading(true);
    const { data } = await getUjian({
      page,
      search: debounceSearch,
      filterTipe: "ppdb",
    });
    if (data) {
      setUjianData(data);
    }
    setLoading(false);
  };

  const postUjianData = async () => {
    if (!formData.nama) {
      toast.error("Anda belum memasukkan nama ujian");
      return;
    }

    const { ...body } = formData;
    const payload = {
      ...body,
    };

    const { data } = editId
      ? await editUjian(editId, payload)
      : await postUjian(payload);
    if (data) {
      toast.success(data?.message);
      getUjianData();

      duplikat && setDuplikat(false);
      editId && setEditId(null);
      hideModal("modalBuatUjian");
    }
  };

  const deleteUjianData = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteUjian(id);
        if (data) {
          toast.success(data?.message);
          getUjianData();
        }
      }
    });
  };

  const handleChangeForm = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (user?.role == "siswa") {
      router.push(`${ssURL}/jadwal-ujian`);
    }
  }, [user]);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    getMateriData();
    getUjianData();
  }, []);

  useEffect(() => {
    getUjianData();
  }, [page, debounceSearch, search.tingkat, search.tipe, search.mapel]);

  const navItems = [
    {
      url: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
      as: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
      text: "Berlangsung",
      active: subnav == "berlangsung" || subnav == undefined,
    },
    {
      url: `${ssURL}/jadwal-ujian?subnav=akan-datang`,
      as: `${ssURL}/jadwal-ujian?subnav=akan-datang`,
      text: "Akan Datang",
      active: subnav == "akan-datang",
    },
    {
      url: `${ssURL}/jadwal-ujian?subnav=sudah-selesai`,
      as: `${ssURL}/jadwal-ujian?subnav=sudah-selesai`,
      text: "Sudah Selesai",
      active: subnav == "sudah-selesai",
    },
  ];

  const SubNavbarJadwalUjian = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <button
                className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                data-bs-toggle="modal"
                data-bs-target="#modalBuatJadwalUjian"
              >
                <FaPlus className="me-2" />
                Buat Jadwal
              </button>
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

  const steps = [
    {
      target: '[data-joyride="side-nav-jadwal-ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Menu Jadwal Ujian</h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisi informasi mengenai semua jadwal ujian yang ada,
            mulai dari jadwal yang akan datang, berlangsung, dan juga jadwal
            yang sudah selesai. Pada menu ini juga anda dapat menambahkan jadwal
            ujian baru untuk ujian yang akan datang.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="side-nav-daftar-ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Menu Daftar Ujian</h5>
          <p className="color-secondary fw-semibold">
            Pada menu ini berisikan daftar ujian yang sudah dibuat. Disini anda
            dapat membuat bank soal untuk ujian yang akan diujikan kepada siswa
            anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-buat-ujian"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Membuat Ujian Baru?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol "Buat Ujian" untuk membuat ujian baru.
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

  return (
    <Layout
      modalWrapper={
        <>
          <NewModal
            modalId="modalBuatUjian"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">
                  {editId ? "Edit" : duplikat ? "Duplikat" : "Buat"} Bank Soal
                </h4>
                <span className="fs-6 fw-normal">
                  Isi informasi dibawah untuk membuat bank soal
                </span>
              </>
            }
            content={
              <>
                <div className="mb-3">
                  <label className="form-label">Nama Bank Soal</label>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="off"
                    placeholder="Tuliskan nama ujian"
                    value={formData?.nama}
                    name="nama"
                    onChange={handleChangeForm}
                  />
                </div>
              </>
            }
            modalSize="md"
            submitButton={
              <ReactiveButton
                buttonState={"idle"}
                color={"primary"}
                idleText={`${
                  editId ? "Edit" : duplikat ? "Duplikat" : "Simpan"
                }`}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
                onClick={postUjianData}
              />
            }
          />
        </>
      }
    >
      {/* {sekolah?.trial &&
      moment(sekolah?.createdAt).format("YYYY-MM-DD") <
        moment("2021-09-01 00:00:00").format("YYYY-MM-DD")} */}
      {0 ? (
        <>
          <AnimatePage>
            <div className="row justify-content-center my-4">
              <div className="col-sm-6 col-8">
                <img
                  src="/img/smarteschool-illustration.png"
                  alt="empty-state"
                  className="img-fluid mb-2"
                />
              </div>
              <div className="col-12 text-center">
                <h5 className="color-dark fw-black">
                  {user?.role == "siswa"
                    ? "Silahkan upgrade sekolah anda ke Smarteschool Pro"
                    : "Upgrade sekolah ke Versi Pro Sekarang"}
                </h5>
                {user?.role != "siswa" && (
                  <>
                    <p className="fw-bold fs-14-ss">
                      Silahkan{" "}
                      <a
                        className="text-decoration-none color-primary"
                        onClick={() =>
                          window.open(
                            `https://wa.me/6287889192581?text=Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool`
                          )
                        }
                      >
                        {" "}
                        Hubungi CS
                      </a>{" "}
                      Smarteschool
                    </p>
                    <WhatsappLink
                      phoneNumber="087889192581"
                      text="Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool"
                    >
                      <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                        Hubungi CS
                      </button>
                    </WhatsappLink>
                  </>
                )}
              </div>
            </div>
          </AnimatePage>
        </>
      ) : (
        <>
          <MyJoyride
            steps={steps}
            styles={{
              options: {
                primaryColor: "#2680eb",
                outline: "none",
                border: "none",
              },
            }}
          />
          <AnimatePage>
            <div className="row gy-4">
              <div className="col-lg-3 positon-relative">
                <SideNavPPDB ssURL={ssURL} />
              </div>
              <div className="col-lg-9">
                <div className="card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4">
                  <div
                    className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0"
                    id="bg-card-ujian-penerimaan"
                  >
                    <div className="rounded-circle shadow-primary-ss">
                      <img src="/img/icon-ujian-ppdb.svg" />
                    </div>
                    <div className="ms-4">
                      <div className="h2 fw-black color-dark text-capitalize position-relative">
                        Ujian Penerimaan
                      </div>
                    </div>
                  </div>
                  <div className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch">
                    <div className="kelas-nav d-flex flex-column flex-lg-row">
                      {navMenus.map((d) => {
                        return (
                          d.isVisible && (
                            <Link href={d.href} as={d.as}>
                              <a
                                className={`position-relative text-decoration-none fw-bold px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                                  d.active ? "color-primary" : "color-secondary"
                                }`}
                                data-joyride={d.dataJoyride || ""}
                              >
                                {d.text}
                              </a>
                            </Link>
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mb-4">
                    {/* <div className="d-flex align-items-md-start align-items-stretch justify-content-start flex-md-row flex-column mb-4"> */}
                    <div className=" d-flex flex-column flex-lg-row justify-content-between align-items-lg-center bg-white rounded-ss shadow-dark-ss">
                      <h4
                        className={
                          "fw-extrabold color-dark d-flex justify-content-center justify-content-md-start ms-3 mb-0 mt-lg-0 mt-3"
                        }
                      >
                        Daftar Bank Soal
                      </h4>
                      <div className="my-3 my-lg-0 px-3 px-lg-0 me-lg-3 d-flex flex-column flex-lg-row align-items-lg-center">
                        <button
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold my-lg-3 my-0"
                          data-bs-toggle="modal"
                          data-bs-target="#modalBuatUjian"
                          onClick={() => {
                            setEditId(null);
                            setFormData(setInitialFormData);
                          }}
                          data-joyride="btn-buat-ujian"
                          // disabled={jadwalMengajar?.absen ? false : true}
                        >
                          <FaPlus className="me-2" />
                          Buat Bank Soal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="collapse" id="collapseExample">
                  <div className="row mb-3">
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Nama Ujian</label>
                      <input
                        type="text"
                        className="form-control form-search-filter-perpus"
                        id="exampleFormControlInput1"
                        placeholder="Cari Bank"
                        autoComplete="off"
                        value={search.nama}
                        onChange={(e) => {
                          setSearch({ ...search, nama: e.target.value }),
                            setPage(1);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Tipe Ujian</label>
                      <Select
                        placeholder="Pilih Tipe Ujian"
                        onChange={(opt) => {
                          setSearch({ ...search, tipe: opt?.value || "" }),
                            setPage(1);
                        }}
                        isClearable
                        options={tipeUjian?.map((tipeUjian) => {
                          return {
                            value: tipeUjian?.value,
                            label: tipeUjian?.label,
                          };
                        })}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Mata Pelajaran</label>
                      <Select
                        placeholder="Pilih Mapel Ujian"
                        onChange={(opt) => {
                          setSearch({ ...search, mapel: opt?.value || "" }),
                            setPage(1);
                        }}
                        isClearable
                        options={mataPelajaran?.map((mapel) => {
                          return {
                            value: mapel?.user?.id,
                            label: `${mapel?.nama} - ${mapel?.user?.nama}`,
                          };
                        })}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Tingkat Kelas</label>
                      <Select
                        placeholder="Pilih Tingkat Ujian"
                        onChange={(opt) => {
                          setSearch({ ...search, tingkat: opt?.value || "" }),
                            setPage(1);
                        }}
                        isClearable
                        options={tingkat?.map((tingkat) => {
                          return {
                            value: tingkat,
                            label: tingkat,
                          };
                        })}
                      />
                    </div>
                  </div>
                </div>
                <div className="row g-4">
                  {/* Card Ujian Start */}
                  {!loading && !ujian?.length && (
                    <>
                      <div className="row justify-content-center">
                        <div className="col-sm-7 col-10">
                          <img
                            src="/img/empty-state-daftar.png"
                            alt=""
                            className="img-fluid mb-md-0 mb-2"
                          />
                        </div>
                        <div className="col-12 text-center">
                          <h4 className="color-dark fw-black mb-2">
                            Bank Soal Kosong
                          </h4>
                          <p className="fw-bold">
                            <>
                              Tekan tombol {""}
                              <a
                                className="color-primary text-decoration-none"
                                data-bs-toggle="modal"
                                data-bs-target="#modalBuatUjian"
                                onClick={setInitialFormData}
                              >
                                Buat Bank Soal
                              </a>{" "}
                              {""}
                              untuk membuat bank soal
                            </>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {loading && (
                    <div className="col-md-6">
                      <UjianSkeleton />
                    </div>
                  )}

                  {!loading &&
                    ujian.map((ujian) => (
                      <div
                        className="col-md-6"
                        data-joyride="card-daftar-ujian"
                      >
                        {/* <Link href={`${ssURL}/ujian/[id]`} as={`${ssURL}/ujian/1`}>
                      <a className="text-decoration-none"> */}
                        <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer">
                          {/* Card Label & Option Start */}
                          <div className="d-flex justify-content-between align-items-start ">
                            {/* Ujian Label Start */}
                            <Link
                              href={`${ssURL}/ujian-penerimaan-ppdb/soal/[id]`}
                              as={`${ssURL}/ujian-penerimaan-ppdb/soal/${ujian?.id}`}
                            >
                              <a>
                                <h5 className="color-dark fw-black mb-2">
                                  {ujian?.nama}
                                </h5>
                                {/* Ujian Title End */}
                                {/*Bank Soal Ujian Start */}
                                <div className="d-flex align-items-center flex-wrap color-primary mt-4 pt-2">
                                  <div className="d-flex align-items-center me-4 mb-2">
                                    <img
                                      src={`/img/icon-bank-soal.svg`}
                                      alt="icon-bank-soal"
                                    />
                                    <span className="fs-14-ss ms-2">
                                      {ujian?.meta?.jumlahSoal} Soal
                                    </span>
                                  </div>
                                </div>
                                {/*Bank Soal Ujian End */}
                              </a>
                            </Link>
                            {/* Ujian Label End */}

                            {/* Dropdown Option Start */}

                            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end align-items-start">
                              <img
                                src={`/img/icon-dropdown-option.svg`}
                                className="pb-5"
                                alt="icon-option"
                                id="dropdownOption"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              />
                              <ul
                                className="dropdown-menu dropdown-menu-ss my-1"
                                aria-labelledby="dropdownOption"
                              >
                                <li
                                  onClick={() => onClickEdit(ujian)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalBuatUjian"
                                >
                                  <a className="dropdown-item">
                                    <FaPen className="me-2" />
                                    <span>Edit</span>
                                  </a>
                                </li>
                                <li
                                  onClick={() => onClickDuplikat(ujian)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalBuatUjian"
                                >
                                  <a className="dropdown-item">
                                    <FaClone className="me-2" />
                                    <span>Duplikat</span>
                                  </a>
                                </li>
                                <li onClick={() => deleteUjianData(ujian?.id)}>
                                  <a className="dropdown-item color-danger">
                                    <FaTrashAlt className="me-2" />
                                    <span>Hapus</span>
                                  </a>
                                </li>
                              </ul>
                            </div>
                            {/* Dropdown Option End */}
                          </div>
                          {/* Card Label & Option End */}

                          {/* Ujian Title Start */}
                        </div>
                        {/* </a>
                    </Link> */}
                      </div>
                    ))}
                  <div className="my-4 text-center">
                    <Pagination
                      total={total}
                      pageSize={20}
                      current={page}
                      onChange={(e) => setPage(e)}
                      showSizeChanger={false}
                    />
                  </div>
                  {/* Card Jadwal Ujian End */}
                </div>
              </div>
            </div>
          </AnimatePage>
        </>
      )}
    </Layout>
  );
};

export default index;
