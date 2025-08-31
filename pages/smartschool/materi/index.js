import Link from "next/link";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import getConfig from "next/config";
import { FaBook, FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { deleteMateri, getMateri } from "../../../client/MateriClient";
import { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import ModalTambahMateri from "../../../components/Materi/ModalTambahMateri";
import router, { useRouter } from "next/router";
import { ssURL } from "../../../client/clientAxios";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import CardKelasSkeleton from "../../../components/Shared/Skeleton/CardKelasSkeleton";
import toast from "react-hot-toast";
import swal from "sweetalert";
import Joyride from "react-joyride";
import useJoyride from "../../../hooks/useJoyride";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import useTa from "hooks/useTa";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import ModalUbahDataDashboard from "components/Layout/ModalUbahDataDashboard";
import { Empty } from "antd";

const index = ({ nav, m_ta_id }) => {
  const { joyrideConfig, setJoyrideConfig } = useJoyride();

  const { pathname } = useRouter();
  const { ta } = useTa();
  const [tipeTa, setTipeTA] = useState({ value: m_ta_id });

  const { user } = useUser();
  const [materiData, setMateriData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const { materi, materiLainnya, semuaTA, dataTA } = materiData;

  const changeTA = (value) => {
    setTipeTA(value);
    swal({
      title: "Yakin Mengubah Data",
      text: "Data akan berubah sesuai tahun yang Anda pilih.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await gantiTaUser({ m_ta_id: tipeTA });
        if (data) {
          router.push({
            pathname: router?.pathname,
            query: { ...router?.query, m_ta_id: value?.value },
          });
          hideModal("modalUbahDataTahun");
          getRombelData();
        }
      }
      // else {
      //   swal("Your imaginary file is safe!");
      // }
    });
  };

  const onClickEdit = (data) => {
    setEditData({
      nama: data.nama,
      id: data.id,
    });
  };

  const getMateriData = async () => {
    setLoading(true);
    const { data } = await getMateri({ m_ta_id: tipeTa?.value || ta.id });
    if (data) {
      setMateriData(data);
      setLoading(false);
    }
  };

  const navItems = [
    {
      url: `${ssURL}/materi?nav=materi`,
      text: "Materi",
      active: nav == "materi" || !nav,
      dataJoyride: "materi",
    },
    // {
    //   url: `${ssURL}/materi?nav=materi-lainnya`,
    //   text: "Materi Lainnya",
    //   active: nav == "materi-lainnya",
    //   dataJoyride: "materi-lainnya",
    // },
  ];

  const steps = [
    {
      target: '[data-joyride="materi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Materi</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "guru" ? (
              <>Daftar materi yang anda ajar untuk murid murid anda.</>
            ) : (
              <>Daftar materi dari guru guru yang mengajar kamu.</>
            )}
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    // {
    //   target: '[data-joyride="materi-lainnya"]',
    //   content: (
    //     <div className="text-start">
    //       <h5 className="color-dark fw-black">Materi Lainnya</h5>
    //       <p className="color-secondary fw-semibold">
    //         {user?.role == "guru" ? (
    //           <>
    //             Daftar materi yang diajar oleh guru guru lain di sekolah anda.
    //           </>
    //         ) : (
    //           <>Daftar materi dari guru guru lain di sekolah kamu.</>
    //         )}
    //       </p>
    //     </div>
    //   ),
    // },
    {
      target: '[data-joyride="btn-tambah-materi"]',
      content: "Tambah Materi",
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Menambah Materi Baru?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol "Tambah Materi" untuk menambah materi baru yang akan
            diajarkan kepada murid murid anda.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="card-materi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Materi</h5>
          <p className="color-secondary fw-semibold">
            {user?.role == "guru" ? (
              <>Daftar materi yang anda yang ajarkan kepada siswa anda</>
            ) : (
              <>Daftar materi yang diajarkan guru kamu</>
            )}
          </p>
        </div>
      ),
    },
  ];

  const action = [
    {
      button:
        (user?.role === "guru" ||
          user?.role == "kepsek" ||
          user?.role == "alumni" ||
          user?.role == "kewiraswastaan" ||
          user?.role == "industri") &&
        "",
      // <button
      //   type="button"
      //   className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
      //   data-bs-toggle="modal"
      //   data-bs-target="#modalTambahMateri"
      //   data-joyride="btn-tambah-materi"
      //   onClick={() => setEditData(null)}
      // >
      //   <FaPlus className="me-2" />
      //   Tambah Materi
      // </button>
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { action } = data;
    if (action === "reset" || action === "close") {
      setJoyrideConfig({ ...joyrideConfig, [pathname]: true });
    }
  };

  const handleDeleteMateriLainnya = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteMateri(id);
        if (data) {
          toast.success(data?.message);
          getMateriData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const NavbarMateri = ({}) => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              // <div className="d-flex align-items-center" style={{width:"200%"}}>
              <div
                className="select-akun-keuangan ms-5"
                style={{ width: "300px" }}
              >
                {/* <SelectShared
                  name="selectTa"
                  placeholder="Pilih tahun akademik"
                  handleChangeSelect={changeTA}
                  value={tipeTa?.value || ta.id}
                  options={semuaTA?.map((d) => {
                    return {
                      label: `${d?.tahun} - ${d?.semester}`,
                      value: d?.id,
                    };
                  })}
                /> */}
              </div>
              // </div>
            ),
          },
        ]}
      />
    </>
  );

  useEffect(() => {
    getMateriData();
  }, [m_ta_id]);

  // useEffect(() => {
  //   if (Object.keys(user).length > 0 && user?.role == "siswa") {
  //     router.push(`${ssURL}`);
  //   }
  // }, [user]);

  return (
    <Layout>
      <MyJoyride steps={steps} />
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            {user?.role == "guru" && (
              <div className="card card-ss d-flex align-items-center justify-content-between my-4 w-100 bg-white p-4 rounded-3 flex-sm-row flex-column">
                <div className="mb-sm-0 mb-3">
                  <h4 className={"fw-extrabold color-dark mb-2"}>
                    Daftar Materi
                  </h4>
                  <p className="fw-semiBold align-middle align-items-center mb-0">
                    Tahun Ajaran {dataTA?.tahun} - {dataTA?.semester}
                  </p>
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
            {/* <NavbarMateri nav={navItems} action={action} /> */}
            {(nav == undefined || nav === "materi") && (
              <div className="row g-4">
                {loading && <CardKelasSkeleton count={7} />}
                {materi?.length ? (
                  <>
                    {!loading &&
                      materi?.map((d, idx) => {
                        return (
                          <div
                            className="col-md-4"
                            key={`${idx}-${new Date().getTime()}`}
                            data-joyride="card-materi"
                          >
                            <div className="card-kelas-ss card-materi-ss card card-ss px-2 pt-2">
                              {(user?.role == "guru" ||
                                user?.role == "admin") && (
                                <div
                                  className="rounded-circle shadow-primary-ss position-absolute pointer d-flex justify-content-center align-items-center bg-white"
                                  style={{
                                    right: "3%",
                                    top: "6%",
                                    width: "40px",
                                    height: "40px",
                                    zIndex: 1,
                                  }}
                                  onClick={() =>
                                    handleDeleteMateriLainnya(d.id)
                                  }
                                >
                                  <FaTrashAlt color={"#fc544b"} />
                                </div>
                              )}
                              <Link
                                href={`${ssURL}/materi/[id]`}
                                as={`${ssURL}/materi/${d.id}`}
                              >
                                <a className="text-decoration-none">
                                  <div className="card-body card-kelas-body px-3 pt-3 justify-content-between d-flex">
                                    <div className="card-kelas-name text-white">
                                      <h5 className="mb-1 fw-black">{`${d.mataPelajaran?.nama}`}</h5>
                                      <p className="m-0 fw-semibold">
                                        {user?.role === "guru"
                                          ? `Kelas ${d?.tingkat} ${
                                              d?.mataPelajaran?.kelompok == "C"
                                                ? d?.jurusan?.kode
                                                : ""
                                            }`
                                          : d?.mataPelajaran?.user?.nama}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="card-footer card-footer-ss card-kelas-footer py-3 d-flex flex-lg-row flex-md-column flex-row">
                                    <div className="color-primary d-flex align-items-center me-4 mb-lg-0 mb-md-3 mb-0">
                                      <FaBook />
                                      <p className="mb-0 ms-2">
                                        {d.meta?.babCount} BAB
                                      </p>
                                    </div>
                                    {user?.role !== "guru" && (
                                      <div className="label-ss bg-light-primary color-primary fs-12-ss fw-bold rounded-pill">
                                        Kelas {d?.tingkat}{" "}
                                        {d?.jurusan?.kode
                                          ? d?.jurusan?.kode
                                          : ""}
                                      </div>
                                    )}
                                    {/* <div className="text-primary d-flex align-items-center">
                              <FaLightbulb />
                              <p className="mb-0 ms-2">
                                {d.bab?.[0]?.meta.topikCount || 0} Topik
                              </p>
                            </div> */}
                                  </div>
                                </a>
                              </Link>
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
              </div>
            )}
            {nav === "materi-lainnya" && (
              <div className="row g-4">
                {loading && <CardKelasSkeleton count={7} />}
                {!loading && (
                  <>
                    {materiLainnya?.map((d, idx) => {
                      return (
                        <div
                          className="col-md-4"
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <div className="card-kelas-ss card-materi-ss card card-ss px-2 pt-2 dropdown dropdown-ss position-relative materi-lainnya">
                            <div className="card-body card-kelas-body px-3 pt-3 justify-content-between d-flex">
                              <Link
                                href={`${ssURL}/materi/[id]`}
                                as={`${ssURL}/materi/${d.id}`}
                              >
                                <a className="card-kelas-name text-white text-decoration-none">
                                  <h5 className="mb-1 fw-black">{`${d?.nama}`}</h5>
                                  <p className="m-0 fw-semibold">
                                    {`${d?.user?.nama} (${d?.sekolah?.nama})`}
                                  </p>
                                </a>
                              </Link>
                            </div>
                            {user?.id == d.user?.id && (
                              <div
                                className={`
                              rounded-circle shadow-primary-ss position-absolute pointer d-flex justify-content-center align-items-center bg-primary dropdown
                            `}
                                style={{
                                  right: "7%",
                                  top: "17%",
                                  width: "40px",
                                  height: "40px",
                                }}
                                role="button"
                                id={`dropdownMenuLink-${idx}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <img
                                  src="/img/icon-option-horizontal-bg-primary.svg"
                                  alt="icon-option-vertical"
                                  style={{ height: "5px" }}
                                />
                              </div>
                            )}
                            <ul
                              className="dropdown-menu dropdown-menu-ss my-1"
                              aria-labelledby={`dropdownMenuLink-${idx}`}
                            >
                              <li
                                onClick={(e) => onClickEdit(d)}
                                data-bs-toggle="modal"
                                data-bs-target="#modalTambahMateri"
                              >
                                <label className="dropdown-item">Edit</label>
                              </li>
                              <li
                                onClick={(e) => handleDeleteMateriLainnya(d.id)}
                              >
                                <a className="dropdown-item">Hapus</a>
                              </li>
                            </ul>
                            <div className="card-footer card-footer-ss card-kelas-footer py-3 d-flex">
                              <div className="color-primary d-flex align-items-center me-4">
                                <FaBook />
                                <p className="mb-0 ms-2">
                                  {d.meta?.babCount} BAB
                                </p>
                              </div>
                              {/* {user?.role !== "guru" && (
                              <div className="label-ss bg-light-primary color-primary fs-12-ss fw-bold rounded-pill">
                                Kelas {d?.tingkat} {d?.jurusan?.kode && d?.jurusan?.kode}
                              </div>
                            )} */}
                              {/* <div className="text-primary d-flex align-items-center">
                            <FaLightbulb />
                            <p className="mb-0 ms-2">
                              {d.bab?.[0]?.meta.topikCount || 0} Topik
                            </p>
                          </div> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <ModalTambahMateri getMateriData={getMateriData} editData={editData} />
        <ModalUbahDataDashboard
          // initialFormData={initialFormData}
          // modalUbahDataDashboard={modalUbahDataDashboard}
          // setModalUbahDataDashboard={setModalUbahDataDashboard}
          // sekolahId={sekolahId}
          // setSekolahId={setSekolahId}
          getData={getMateriData}
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

export async function getServerSideProps({ query: { nav, m_ta_id } }) {
  return {
    props: {
      nav: nav || null,
      m_ta_id: m_ta_id || "",
    },
  };
}

export default index;
