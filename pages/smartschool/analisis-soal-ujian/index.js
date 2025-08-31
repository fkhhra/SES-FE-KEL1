import SelectShared from "components/Shared/SelectShared/SelectShared";
import SideBarUjian from "components/Ujian/SideBarUjian";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClipboardList, FaPlus } from "react-icons/fa";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { ssURL } from "../../../client/clientAxios";
import { getMateri } from "../../../client/MateriClient";
import { getAnalisisSoal } from "../../../client/AnalisisSoalClient";
import {
  deleteUjian,
  editUjian,
  getUjian,
  postUjian,
} from "../../../client/UjianClient";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import CardRekapSkeleton from "../../../components/Shared/Skeleton/CardRekapSkeleton";
import WhatsappLink from "../../../components/Shared/WhatsappLink/WhatsappLink";
import useSekolah from "../../../hooks/useSekolah";
import useUser from "../../../hooks/useUser";
import { hideModal } from "../../../utilities/ModalUtils";
import { checkBackgroundKelompok } from "../../../utilities/RekapUtils";

const initialFormData = {
  nama: "",
  tipe: "",
  tingkat: "",
  mMataPelajaranId: "",
};

const index = ({ m_ta_id }) => {
  const { user } = useUser();
  const { sekolah } = useSekolah();
  const { subnav } = useRouter().query;
  const router = useRouter();
  const {
    publicRuntimeConfig: { SS_URL },
  } = getConfig();

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [materiData, setMateriData] = useState({});
  const [analisisSoalData, setAnalisisSoalData] = useState({});
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
  const { data, semuaTA } = analisisSoalData;
  const [debounceSearch] = useDebounce(search.nama, 600);
  console.log(data);
  const { mataPelajaran, tingkat, tipeUjian, ujian, total, lastPage } =
    ujianData;

  const [tipeTa, setTipeTA] = useState({ value: m_ta_id });
  // const { value } = m_ta_id;
  const changeTA = (value) => {
    setTipeTA(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, m_ta_id: value.value },
    });
  };

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
      mMataPelajaranId: editData?.mMataPelajaranId,
    });
  };

  const onClickDuplikat = (data) => {
    setDuplikat(true);
    setFormData({
      ujianId: data?.id,
      nama: data?.nama,
      tipe: data?.tipe,
      tingkat: data?.tingkat,
      mMataPelajaranId: data?.mMataPelajaranId,
    });
  };

  const getMateriData = async () => {
    const { data } = await getMateri();
    if (data) {
      setMateriData(data);
    }
  };

  const getAnalisisSoalData = async () => {
    const { data } = await getAnalisisSoal({ m_ta_id: tipeTa?.value });
    if (data) {
      setAnalisisSoalData(data);
    }
  };

  const getUjianData = async () => {
    setLoading(true);
    const { data } = await getUjian({
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

  const postUjianData = async () => {
    if (!formData.nama) {
      toast.error("Anda belum memasukkan nama ujian");
      return;
    } else if (!formData.tipe) {
      toast.error("Anda belum memilih tipe ujian");
      return;
    } else if (!formData.tingkat) {
      toast.error("Anda belum memilih tingkat kelas pada ujian");
      return;
    } else if (
      !formData.mMataPelajaranId &&
      formData.tipe != "literasi" &&
      formData.tipe != "numerasi"
    ) {
      toast.error("Anda belum memilih mata pelajaran ujian");
      return;
    }

    const { mMataPelajaranId, ...body } = formData;
    const payload = {
      mMataPelajaranId: parseInt(mMataPelajaranId),
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
    getAnalisisSoalData();
  }, [m_ta_id]);

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

  const handleJoyrideCallback = (data) => {
    const { action } = data;
    if (action === "reset" || action === "close") {
      setJoyrideConfig({ ...joyrideConfig, [router.pathname]: true });
    }
  };
  // console.log(dataAnalisisSoal);

  return (
    <Layout modalWrapper={<></>}>
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
          <AnimatePage>
            <div className="row gy-4">
              <div className="col-lg-3 positon-relative">
                <SideBarUjian activeMenu={activeMenu} />
              </div>
              <div className="col-lg-9">
                <div className="row mb-4">
                  <div className="col-md-12">
                    <div className="card card-ss p-4">
                      <div className="row justify-content-between">
                        <div className="col-lg-4 col-md-6 d-flex align-items-center">
                          <h4
                            className={"fw-extrabold color-dark mb-md-0 mb-3"}
                          >
                            Daftar Analisis Soal
                          </h4>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="select-akun-keuangan">
                            <SelectShared
                              name="selectTa"
                              placeholder="Pilih tahun akademik"
                              handleChangeSelect={changeTA}
                              value={tipeTa.value}
                              options={semuaTA?.map((d) => {
                                return {
                                  label: `${d?.tahun} - ${d?.semester}`,
                                  value: d?.id,
                                };
                              })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {loading && (
                  <div className="row g-4">
                    <CardRekapSkeleton count={3} />
                  </div>
                )}
                {!loading && (
                  <>
                    <div className="row g-4">
                      {data?.map((d, idx) => {
                        return (
                          <div className="col-md-4 daftar-kelas" key={idx}>
                            <div className="card-kelas-ss card card-ss px-0">
                              <div
                                className="card-body px-3 pt-3 justify-content-between d-flex"
                                style={checkBackgroundKelompok(d?.kelompok)}
                              >
                                <div className="card-kelas-name text-white">
                                  <h5 className="mb-1 fw-black">{d?.nama}</h5>
                                  <p className="m-0 fw-semibold">
                                    Kelas {d?.tingkat}{" "}
                                    {d?.mataPelajaran?.kelompok == "C"
                                      ? d?.jurusan?.kode
                                      : ""}
                                  </p>
                                </div>
                              </div>
                              <div className="card-footer card-footer-ss card-kelas-footer py-3 d-flex justify-content-between flex-lg-row flex-md-column flex-row align-items-lg-center">
                                <div className="color-primary d-flex align-items-center me-4">
                                  <FaClipboardList />
                                  <p className="mb-0 ms-2">
                                    {d?.totalSoal} Soal
                                  </p>
                                </div>
                                <Link
                                  href={`${ssURL}/analisis-soal-ujian/[id]/data-soal`}
                                  as={`${ssURL}/analisis-soal-ujian/${d?.id}/data-soal`}
                                >
                                  <a
                                    className={`btn btn-outline-primary btn-outline-primary-ss rounded-pill fs-12-ss fw-bolder py-1 px-3`}
                                  >
                                    Lihat
                                  </a>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </AnimatePage>
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ query: { m_ta_id } }) {
  return {
    props: {
      m_ta_id: m_ta_id || "",
    },
  };
}

export default index;
