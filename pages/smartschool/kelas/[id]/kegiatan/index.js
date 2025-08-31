import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { kelasJoyrideSteps, restructureData } from "components/Kelas/KelasHelper";
import { momentPackage, optionBulan } from "utilities/HelperUtils";
import { getTimelineV2 } from "client/TimelineClient";
import { getDetailRombel } from "client/RombelClient";
import { uuid } from "uuidv4";
import { showModal } from "utilities/ModalUtils";

import useUser from "hooks/useUser";
import useEditModal from "hooks/useEditModal";
import isEmpty from "lodash/isEmpty";
import useBuatTugas from "hooks/useBuatTugas";

import KelasHeader from "components/Kelas/KelasHeader";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import NavbarState from "components/Shared/Navbar/NavbarState";
import ModalTugas from "components/Kelas/ModalTugas/ModalTugas";
import ModalBagikanMateri from "components/Kelas/ModalBagikanMateri";
import ModalBuatPertemuan from "components/Kelas/ModalBuatPertemuan";
import EmptyStateKelasKegiatan from "components/Kelas/EmptyStateKelasKegiatan";
import SkeletonKegiatan from "components/Kelas/Skeleton/SkeletonKegiatan";
import CardKegiatan from "components/Kelas/CardKegiatan";

const index = ({ id }) => {

  const { user } = useUser();

  const [kegiatan, setKegiatan] = useState(null);
  const [nav, setNav] = useState("berlangsung");
  const [detailRombel, setDetailRombel] = useState({});

  const [modalTugasType, setModalTugasType] = useState("tugas");
  const [loading, setLoading] = useState(false);

  const [timelines, setTimelines] = useState({});

  const [additionalData, setAdditionalData] = useState({});

  const { setEditModal } = useEditModal();
  const { resetStateBuatTugas, setIsDuplikatTugas } = useBuatTugas();

  const navItem = [
    {
      nav: `berlangsung`,
      text: "Berlangsung",
      active: nav == "berlangsung" || !nav,
      dataJoyride: "berlangsung",
      isVisible: true
    },
    {
      nav: `terjadwal`,
      text: "Terjadwal",
      active: nav == "terjadwal",
      dataJoyride: "terjadwal",
      isVisible: user?.role != "siswa"
    },
    {
      nav: `selesai`,
      text: "Sudah Selesai",
      active: nav == "selesai",
      dataJoyride: "sudah-selesai",
      isVisible: true
    },
  ];

  const _getTimeline = async () => {
    let query = {
      mJadwalMengajarId: id,
      hariIni: momentPackage().format("YYYY-MM-DD"),
      waktuSaatIni: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    }
  
    const { data } = await getTimelineV2(query);

    if (data) {
      setTimelines(data);
    }
  }

  const getDetailRombelData = async () => {
    let params = { kode_hari: new Date().getDay() }
    const { data } = await getDetailRombel(id, params);

    if (data) {
      const daftarBab = data?.analisisMateri?.materi?.bab;
      const anggotaRombel = data?.jadwalMengajar?.rombel?.anggotaRombel;
      const additionalData = { daftarBab, anggotaRombel } // need additional data for restructuring purposes

      setDetailRombel(data);
      setAdditionalData(additionalData);
      await _getTimeline();
    }
  };

  const onOpenModalBuatTugas = (type="tugas") => {
    setEditModal("modalBuatTugas", null);
    setModalTugasType(type);
    resetStateBuatTugas();
    setIsDuplikatTugas(false);
    window.$(`#instruksi-tugas-editor`).summernote("code", "");
    showModal("modalBuatTugas");
  }

  const formatDate = (dateString) => {
    const arrayTanggalKegiatan = dateString.split(" ");
    const newFormatTanggal = `${arrayTanggalKegiatan?.[2]}-${optionBulan.find(({ string }) => string === arrayTanggalKegiatan?.[1])?.number}-${arrayTanggalKegiatan?.[0]}`;
    return newFormatTanggal;
  }

  useEffect(() => {
    if (timelines && additionalData) {
      const newData = restructureData(timelines?.[nav || "berlangsung"], additionalData);

      let sortedKegiatan = {};
      const sortedTanggalKegiatan = Object.keys(newData).sort((a, b) => {
        return new Date(formatDate(b)) - new Date(formatDate(a));
      });

      sortedTanggalKegiatan.map(tanggalKegiatan => {
        sortedKegiatan[tanggalKegiatan] = newData[tanggalKegiatan]
      });

      setKegiatan(sortedKegiatan);
    }
  }, [timelines, nav, additionalData]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await getDetailRombelData();
      setLoading(false);
    } 

    getData();
  }, []);

  return (
    <>
      <Layout>
        <MyJoyride steps={user?.role === "guru" ? kelasJoyrideSteps : []} />
        <AnimatePage>
          <KelasHeader id={id} />
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-10">
              <NavbarState
                nav={navItem.filter(({ isVisible }) => isVisible)}
                setNav={setNav}
                action={[
                  {
                    button: (
                      <>
                        {/* <button
                          className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                          //   onClick={handleClickDownloadAbsen}
                          data-joyride="unduh-absen"
                        >
                          <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                          Unduh Kegiatan
                        </button> */}
                        <div className="dropdown dropdown-ss d-flex flex-column">
                          {user?.role == "guru" && (
                            <div
                              role="button"
                              id="dropdownMenuLink"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                              data-joyride="btn-buat-tugas"
                            >
                              <div>
                                <FaPlus className="me-2" />
                                Buat Kegiatan
                              </div>
                            </div>
                          )}
                          <ul
                            className="dropdown-menu dropdown-menu-ss my-1"
                            aria-labelledby="dropdownMenuLink"
                          >
                            <li onClick={() => { setEditModal("ModalBuatPertemuan", null); showModal("ModalBuatPertemuan") }}>
                              <a className="dropdown-item pointer d-flex align-items-center">
                                <img
                                  src="/img/icon-kegiatan-tatap-maya.svg"
                                  alt="icon-kegiatan"
                                  className="me-2"
                                />
                                <span className="color-dark fw-semibold">
                                  Tatap Maya
                                </span>
                              </a>
                            </li>
                            <li onClick={() => { setEditModal("ModalBagikanMateri", null); showModal("ModalBagikanMateri") }}>
                              <a className="dropdown-item pointer d-flex align-items-center">
                                <img
                                  src="/img/icon-kegiatan-materi.svg"
                                  alt="icon-kegiatan"
                                  className="me-2"
                                />
                                <span className="color-dark fw-semibold">
                                  Materi
                                </span>
                              </a>
                            </li>
                            <li onClick={() => onOpenModalBuatTugas()}
                            >
                              <a className="dropdown-item pointer d-flex align-items-center">
                                <img
                                  src="/img/icon-kegiatan-tugas.svg"
                                  alt="icon-kegiatan"
                                  className="me-2"
                                />
                                <span className="color-dark fw-semibold">
                                  Tugas
                                </span>
                              </a>
                            </li>
                            <li onClick={() => onOpenModalBuatTugas("kuis")}>
                              <a
                                className="dropdown-item pointer d-flex align-items-center">
                                <img
                                  src="/img/icon-kegiatan-tugas.svg"
                                  alt="icon-kegiatan"
                                  className="me-2"
                                />
                                <span className="color-dark fw-semibold">
                                  Tugas Kuis
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </>
                    ),
                  },
                ]}
              />
            </div>

            { loading
              ? <SkeletonKegiatan />
              : !isEmpty(kegiatan)
              ? Object.keys(kegiatan).map((tanggalKegiatan, index) => {

                const newFormatTanggal = formatDate(tanggalKegiatan);

                const currentDate = momentPackage().format("YYYY-MM-DD");
                const isCardOpen = momentPackage(newFormatTanggal).isSame(currentDate);

                return (
                  <CardKegiatan
                    nav={nav}
                    key={uuid()}
                    tanggalKegiatan={tanggalKegiatan}
                    kegiatan={kegiatan}
                    id={id}
                    getDetailRombelData={getDetailRombelData}
                    setModalTugasType={setModalTugasType}
                    isCardOpen={isCardOpen}
                    newFormatTanggal={newFormatTanggal}
                  />
                )
              })
              : (
                <EmptyStateKelasKegiatan
                  setModalTugasType={setModalTugasType}
                  showButtonTambahKegiatan={nav=="berlangsung"}
                />
              )
            }

          </div>

          <ModalTugas
            detailRombel={detailRombel}
            getDetailRombelData={getDetailRombelData}
            modalTugasType={modalTugasType}
          />

          <ModalBagikanMateri
            detailRombel={detailRombel}
            getDetailRombelData={getDetailRombelData}
          />

          <ModalBuatPertemuan
            kelasId={id}
            getDetailRombelData={getDetailRombelData}
          />

        </AnimatePage>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id
    },
  };
}

export default index;
