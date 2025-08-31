import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import {
  FaClone,
  FaFilter,
  FaPen,
  FaPlus,
  FaSearchMinus,
  FaTrashAlt,
  FaRecycle,
} from "react-icons/fa";
import { getMateri } from "../../../client/MateriClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { baseURL, ssURL } from "../../../client/clientAxios";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import WhatsappLink from "../../../components/Shared/WhatsappLink/WhatsappLink";
import ReactiveButton from "reactive-button";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import {
  getUjianSampah,
  restoreUjian,
} from "../../../client/UjianClient";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { hideModal } from "../../../utilities/ModalUtils";
import UjianSkeleton from "../../../components/Shared/Skeleton/UjianSkeleton";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import useUser from "../../../hooks/useUser";
import useSekolah from "../../../hooks/useSekolah";
import moment from "moment";
import { useDebounce } from "use-debounce";
import { Pagination } from "antd";
import Select from "react-select";
import SideBarUjian from "components/Ujian/SideBarUjian";

const initialFormData = {
  nama: "",
  tipe: "",
  tingkat: "",
  mMataPelajaranId: "",
};

const index = () => {
  const { user } = useUser();
  const { sekolah } = useSekolah();
  const { subnav } = useRouter().query;
  const router = useRouter();

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
    tipe: "",
    mapel: "",
    tingkat: "",
  });
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [debounceSearch] = useDebounce(search.nama, 600);

  const { mataPelajaran, tingkat, tipeUjian, ujian, total, lastPage } =
    ujianData;

  const setInitialFormData = () => {
    setEditId(null);
    setFormData(initialFormData);
  };


  const getMateriData = async () => {
    const { data } = await getMateri();
    if (data) {
      setMateriData(data);
    }
  };

  const getUjianSampahData = async () => {
    setLoading(true);
    const { data } = await getUjianSampah({
      page,
      search: debounceSearch,
      filterMapel: search.mapel,
      filterTipe: search.tipe,
      filterTingkat: search.tingkat,
    });
    if (data) {
      setUjianData(data);
    }
    setLoading(false);
  };


  const restoreUjianData = (id) => {
    swal({
      title: "Yakin ingin mengembalikan data ujian?",
      text: "Perhatikan kembali data yang ingin anda kembalikan",
      icon: "warning",
      buttons: true,
      warningMode: true,
    }).then(async (willRestore) => {
      if (willRestore) {
        const { data } = await restoreUjian(id, {
            dihapus: 0,
        });
        if (data) {
          toast.success(data?.message);
          getUjianSampahData();
        }
      }
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
    getUjianSampahData();
  }, []);

  useEffect(() => {
    getUjianSampahData();
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
    //   modalWrapper={
    //     <>
    //       <NewModal
    //         modalId="modalBuatUjian"
    //         title={
    //           <>
    //             <h4 className="mb-1 fw-extrabold">
    //               {editId ? "Edit" : duplikat ? "Duplikat" : "Buat"} Bank Soal
    //             </h4>
    //             <span className="fs-6 fw-normal">
    //               Isi informasi dibawah untuk membuat bank soal
    //             </span>
    //           </>
    //         }
    //         removeFooter={
    //           sekolah?.trial &&
    //           moment(sekolah?.createdAt).format("YYYY-MM-DD") <
    //             moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
    //           total >= 3
    //         }
    //         content={
    //           sekolah?.trial &&
    //           moment(sekolah?.createdAt).format("YYYY-MM-DD") <
    //             moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
    //           total >= 3 ? (
    //             <div className="row justify-content-center my-4">
    //               <div className="col-sm-6 col-8">
    //                 <img
    //                   src="/img/smarteschool-illustration.png"
    //                   alt="empty-state"
    //                   className="img-fluid mb-2"
    //                 />
    //               </div>
    //               <div className="col-12 text-center">
    //                 <h5 className="color-dark fw-black">
    //                   {user?.role == "siswa"
    //                     ? "Anda hanya memiliki batas pembuatan bank soal 3 saja"
    //                     : "Anda hanya memiliki batas pembuatan bank soal 3 saja"}
    //                 </h5>
    //                 {user?.role != "siswa" && (
    //                   <>
    //                     <p className="fw-bold fs-14-ss">
    //                       Silahkan{" "}
    //                       <a
    //                         className="text-decoration-none color-primary"
    //                         onClick={() =>
    //                           window.open(
    //                             `https://wa.me/6287889192581?text=Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool`
    //                           )
    //                         }
    //                       >
    //                         {" "}
    //                         Hubungi CS
    //                       </a>{" "}
    //                       Smarteschool
    //                     </p>
    //                     <WhatsappLink
    //                       phoneNumber="087889192581"
    //                       text="Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool"
    //                     >
    //                       <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
    //                         Hubungi CS
    //                       </button>
    //                     </WhatsappLink>
    //                   </>
    //                 )}
    //               </div>
    //             </div>
    //           ) : (
    //             <>
    //               <div className="mb-3">
    //                 <label className="form-label">Nama Bank Soal</label>
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   autoComplete="off"
    //                   placeholder="Tuliskan nama ujian"
    //                   value={formData?.nama}
    //                   name="nama"
    //                   onChange={handleChangeForm}
    //                 />
    //               </div>
    //               <div className="mb-3">
    //                 <label className="form-label">Tipe Ujian</label>
    //                 <select
    //                   className="form-select"
    //                   aria-label="Default select example"
    //                   placeholder="Pilih tipe ujian"
    //                   value={formData?.tipe}
    //                   name="tipe"
    //                   onChange={handleChangeForm}
    //                 >
    //                   <option hidden>Pilih tipe ujian</option>
    //                   {tipeUjian?.map((tipeUjian) => (
    //                     <option value={tipeUjian?.value}>
    //                       {tipeUjian?.label}
    //                     </option>
    //                   ))}
    //                 </select>
    //               </div>
    //               {formData.tipe != "literasi" && formData.tipe != "numerasi" && (
    //                 <div className="mb-3">
    //                   <label className="form-label">Mata Pelajaran</label>
    //                   <select
    //                     className="form-select"
    //                     aria-label="Default select example"
    //                     placeholder="Pilih mata pelajaran untuk ujian"
    //                     value={formData?.mMataPelajaranId}
    //                     name="mMataPelajaranId"
    //                     onChange={handleChangeForm}
    //                   >
    //                     <option hidden>Pilih mata pelajaran untuk ujian</option>
    //                     {mataPelajaran?.map((mapel) => (
    //                       <option
    //                         value={mapel?.id}
    //                       >{`${mapel?.nama} - ${mapel?.user?.nama}`}</option>
    //                     ))}
    //                   </select>
    //                 </div>
    //               )}
    //               <div className="mb-3">
    //                 <label className="form-label">Tingkat Kelas</label>
    //                 <select
    //                   className="form-select"
    //                   aria-label="Default select example"
    //                   placeholder="Pilih mata pelajaran untuk ujian"
    //                   value={formData?.tingkat}
    //                   name="tingkat"
    //                   onChange={handleChangeForm}
    //                 >
    //                   <option hidden>Pilih tingkat kelas</option>
    //                   {tingkat?.map((tingkat) => (
    //                     <option value={tingkat}>{tingkat}</option>
    //                   ))}
    //                 </select>
    //               </div>
    //             </>
    //           )
    //         }
    //         submitButton={
    //           <ReactiveButton
    //             buttonState={"idle"}
    //             color={"primary"}
    //             idleText={`${
    //               editId ? "Edit" : duplikat ? "Duplikat" : "Simpan"
    //             }`}
    //             loadingText={"Diproses"}
    //             successText={"Berhasil"}
    //             errorText={"Gagal"}
    //             type={"button"}
    //             data-bs-dismiss="modal"
    //             className={"btn btn-primary"}
    //             onClick={postUjianData}
    //           />
    //         }
    //       />
    //     </>
    //   }
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
                <SideBarUjian activeMenu={activeMenu} />
              </div>
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex align-items-md-start align-items-stretch justify-content-between flex-md-row flex-column">
                      <h2 className="fw-black color-dark title-page position-relative mb-5">
                        Sampah Ujian
                      </h2>
                      <div className="d-flex justify-content-between flex-sm-row flex-column mb-md-0 mb-4">
                        <button
                          className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white color-dark fw-bold mb-sm-0 mb-3 me-sm-3 me-0 ${
                            collapseOpen && "active"
                          }`}
                          data-bs-toggle="collapse"
                          href="#collapseExample"
                          role="button"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                          onClick={() => setcollapseOpen(!collapseOpen)}
                          style={{ zIndex: "1" }}
                        >
                          <FaFilter className="me-3 fs-14-ss" />
                          Filter
                        </button>
                        {/* <button
                          className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold fs-18-ss"
                          data-bs-toggle="modal"
                          data-bs-target="#modalBuatUjian"
                          data-joyride="btn-buat-ujian"
                          onClick={setInitialFormData}
                        >
                          <FaPlus className="me-2" />
                          Buat Bank Soal
                        </button> */}
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
                <div className="row">
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
                            Tidak Ada Sampah Ujian
                          </h4>
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
                    ujian?.map((ujian) => (
                      <div
                        className="col-md-6"
                        data-joyride="card-daftar-ujian"
                      >
                        {/* <Link href={`${ssURL}/ujian/[id]`} as={`${ssURL}/ujian/1`}>
                      <a className="text-decoration-none"> */}
                        <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mb-4">
                          {/* Card Label & Option Start */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            {/* Ujian Label Start */}
                            <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                              {ujian?.tipeFormat}
                            </div>

                            {/* Ujian Label End */}

                            {/* Dropdown Option Start */}

                            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                              <div
                                role="button"
                                onClick={() => restoreUjianData(ujian?.id)}
                              >
                                <FaRecycle size={25}/>
                              </div>
                            </div>
                            {/* Dropdown Option End */}
                          </div>
                          {/* Card Label & Option End */}

                          {/* Ujian Title Start */}
                          {/* <Link
                            href={`${ssURL}/ujian/[id]`}
                            as={`${ssURL}/ujian/${ujian?.id}`}
                          > */}
                            <div>
                              <h5 className="color-dark fw-black mb-2">
                                {ujian?.nama} - Kelas {ujian?.tingkat}
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
                                {ujian?.mataPelajaran && (
                                  <div className="label-ss bg-light-primary color-primary fs-12-ss fw-bold rounded-pill mb-2">
                                    {ujian?.mataPelajaran?.nama}
                                  </div>
                                )}
                              </div>
                              {/*Bank Soal Ujian End */}
                            </div>
                          {/* </Link> */}
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
