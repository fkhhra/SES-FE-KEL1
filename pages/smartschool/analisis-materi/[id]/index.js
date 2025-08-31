import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../../../client/clientAxios";
import { editMateriKesimpulan } from "../../../../client/MateriClient";
import { getDetailTopik } from "../../../../client/TopikClient";
import Layout from "../../../../components/Layout/Layout";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import { momentPackage } from "../../../../utilities/HelperUtils";

const initialFormData = {
  tingkat: "",
  mJurusanId: "",
  mUserId: "",
  kode: "",
};

const index = ({ id, m_jadwal_mengajar_id }) => {
  const [loading, setLoading] = useState(true);
  const [detailTopikData, setDetailTopikData] = useState([]);
  const [, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [kesimpulanData, setKesimpulanData] = useState({});

  const { user, topik } = detailTopikData;

  const getDetailTopikData = async () => {
    setLoading(true);
    const { data } = await getDetailTopik(id, {
      analisis: true,
      m_jadwal_mengajar_id: m_jadwal_mengajar_id,
    });
    if (data) {
      setDetailTopikData(data);
      setFormData({
        ...initialFormData,
        listJurusan: data.jurusan,
        listTingkat: data.tingkat,
        listGuru: data.guru,
      });
      setLoading(false);
    }
  };

  const lihatKesimpulan = (d) => {
    setKesimpulanData(d);
  };

  const handlePutMateriKesimpulan = async (materiKesimpulanId) => {
    setButtonState("loading");
    const { data } = await editMateriKesimpulan(
      {
        dibaca: 1,
      },
      materiKesimpulanId
    );
    if (data) {
      toast.success(data?.message);
      setButtonState("success");
      getDetailTopikData();
    } else {
      setButtonState("error");
    }
  };

  useEffect(() => {
    getDetailTopikData();
  }, []);

  const steps = [
    {
      target: '[data-joyride="informasi-materi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Informasi Materi</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat melihat informasi singkat mengenai aktivitas membaca
            siswa.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="btn-pratinjau-materi"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Ingin Melihat Materi Anda?</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk melihat materi yang sudah anda berikan ke kelas.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="btn-kesimpulan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Lihat Kesimpulan Siswa</h5>
          <p className="color-secondary fw-semibold">
            Tekan tombol untuk melihat kesimpulan yang dari siswa setelah
            membaca materi yang anda berikan.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout
      modalWrapper={
        <NewModal
          modalId="modalKesimpulanAnalisisMateri"
          removeFooter={kesimpulanData?.kesimpulan?.[0].dibaca}
          title={
            <>
              <h4 className="mb-0 fw-extrabold">{kesimpulanData?.nama}</h4>
            </>
          }
          content={
            <>
              <h5 className="fs-18-ss color-dark fw-bold">Kesimpulan</h5>
              <p
                className="color-secondary dangerous-html"
                dangerouslySetInnerHTML={{
                  __html: kesimpulanData?.kesimpulan?.[0]?.kesimpulan,
                }}
              ></p>
            </>
          }
          submitButton={
            <ReactiveButton
              buttonState={buttonState}
              color={"primary"}
              idleText={"Tandai Sudah Dibaca"}
              loadingText={"Diproses"}
              successText={"Berhasil"}
              errorText={"Gagal"}
              type={"button"}
              data-bs-dismiss="modal"
              className={"btn btn-primary"}
              onClick={() =>
                handlePutMateriKesimpulan(kesimpulanData?.kesimpulan?.[0].id)
              }
            />
          }
        />
      }
    >
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <MyJoyride steps={steps} />

        <section className="banner position-absolute"></section>

        <div className="row">
          <div className="col-md-12">
            <div className="d-flex justify-content-between">
              <Link
                href={`${ssURL}/rombel/${m_jadwal_mengajar_id}?nav=analisis-materi`}
              >
                <a className="text-decoration-none fw-bolder position-relative text-white">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            {/* Card Analisis Materi Info Start */}

            <div className="card card-ss p-4 pb-5 mt-3 mb-4">
              <div className="d-flex align-items-center mb-4 flex-md-row flex-column">
                <div
                  className="rounded-circle shadow-primary-ss me-md-4 mb-4 mb-md-0"
                  style={{
                    width: "86px",
                    height: "86px",
                  }}
                >
                  <img
                    src={`/img/post-icon-1.svg`}
                    alt="post-icon"
                    width="86px"
                    height="86px"
                  />
                </div>
                <div className="title ms-md-3">
                  <p className="color-secondary mb-2">{topik?.bab?.judul}</p>
                  <h2 className="color-dark fw-black m-0">{topik?.judul}</h2>
                </div>
              </div>
              <div className="div d-flex flex-md-row flex-column">
                <div
                  className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
                  data-joyride="informasi-materi"
                >
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss color-secondary mb-2">Sudah Baca</p>
                    <p className="fs-18-ss fw-bold color-dark m-0">
                      {topik?.meta?.sudahBaca}
                    </p>
                  </div>
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                    <p className="fs-14-ss color-secondary mb-2">Belum Baca</p>
                    <p className="fs-18-ss fw-bold color-dark m-0">
                      {user?.length - topik?.meta?.sudahBaca < 0
                        ? 0
                        : user?.length - topik?.meta?.sudahBaca}
                    </p>
                  </div>
                </div>
                <a
                  href={`${ssURL}/bab/${topik?.bab?.id}?topik_id=${topik?.id}`}
                  target="_blank"
                  className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center py-3 ps-4 pe-5 ms-md-3"
                  data-joyride="btn-pratinjau-materi"
                >
                  <div className="d-flex align-items-center">
                    <img src={`/img/icon-pratinjau.svg`} alt="icon-pratinjau" />
                    <p className="m-0 text-white fw-bold ps-4 pe-5">
                      Pratinjau Materi
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Card Analisis Materi Info End */}

            {/* Table Monitor Analisis Start */}

            <div className="card card-ss">
              <div className="card-header-ss p-4 d-flex justify-content-between align-items-center">
                <h4 className="fw-extrabold m-0 color-dark">Daftar Siswa</h4>
                <div className="dropdown dropdown-ss">
                  <div
                    className="rounded-ss shadow-primary-ss"
                    style={{
                      width: "32px",
                      height: "32px",
                    }}
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={`/img/icon-filter.svg`} alt="icon-filter" />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a className="dropdown-item">Semua</a>
                    </li>
                    <li>
                      <a className="dropdown-item">Sudah Baca</a>
                    </li>
                    <li>
                      <a className="dropdown-item">Belum Baca</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body px-0 pb-4 pt-0">
                <div className="table-responsive">
                  {loading && <Skeleton height={40} />}
                  {!loading && (
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Waktu Mulai</th>
                          <th>Waktu Selesai</th>
                          <th>Durasi</th>
                          <th>Kesimpulan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user?.map((d, idx) => {
                          return (
                            <tr key={`${idx}-${new Date().getTime()}`}>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama">{d.nama}</td>
                              <td data-th="Waktu Mulai">
                                {d.kesimpulan?.[0]?.waktuMulai}
                              </td>
                              <td data-th="Waktu Selesai">
                                {d.kesimpulan?.[0]?.waktuSelesai}
                              </td>
                              <td data-th="Durasi">
                                {momentPackage(
                                  d.kesimpulan?.[0]?.updatedAt
                                ).diff(
                                  momentPackage(d.kesimpulan?.[0]?.createdAt),
                                  "minute"
                                )}{" "}
                                Menit
                              </td>
                              <td data-th="Kesimpulan">
                                {!d?.kesimpulan?.[0]?.kesimpulan && (
                                  <button
                                    className="btn btn-secondary-disable-ss btn-secondary btn-secondary-ss shadow-secondary-ss rounded-pill fs-14-ss py-1 px-4"
                                    data-joyride="btn-kesimpulan"
                                    disabled
                                  >
                                    Detail
                                  </button>
                                )}

                                {d?.kesimpulan?.[0]?.kesimpulan &&
                                d?.kesimpulan?.[0]?.dibaca == 0 ? (
                                  <button
                                    className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-14-ss py-1 px-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalKesimpulanAnalisisMateri"
                                    onClick={() => lihatKesimpulan(d)}
                                    data-joyride="btn-kesimpulan"
                                  >
                                    Detail
                                  </button>
                                ) : null}

                                {d?.kesimpulan?.[0]?.dibaca == 1 && (
                                  <button
                                    className="btn btn-success btn-success btn-success-ss shadow-success-ss rounded-pill fs-14-ss py-1 px-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalKesimpulanAnalisisMateri"
                                    onClick={() => lihatKesimpulan(d)}
                                  >
                                    Terperiksa
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Table Monitor Analisis End */}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { m_jadwal_mengajar_id },
}) {
  return {
    props: {
      id,
      m_jadwal_mengajar_id: m_jadwal_mengajar_id || null,
    },
  };
}

export default index;
