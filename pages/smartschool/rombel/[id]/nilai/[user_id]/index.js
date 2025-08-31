import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaUndo } from "react-icons/fa";
import toast from "react-hot-toast";
import { ssURL } from "../../../../../../client/clientAxios";
import {
  getNilaiSiswa,
  getRaporKeterampilan,
  getRaporNilai,
} from "../../../../../../client/RaporClient";
import Layout from "../../../../../../components/Layout/Layout";
import ModalDetailNilaiSiswa from "../../../../../../components/RaporRombel/ModalDetailNilaiSiswa";
import SectionKeterampilan from "../../../../../../components/RaporRombel/SectionKeterampilan";
import SectionPengetahuan from "../../../../../../components/RaporRombel/SectionPengetahuan";
import SectionSikap from "../../../../../../components/RaporRombel/SectionSikap";
import NewModal from "../../../../../../components/Shared/NewModal/NewModal";
import CardHeaderSkeleton from "../../../../../../components/Shared/Skeleton/CardHeaderSkeleton";
import useUser from "../../../../../../hooks/useUser";
import {
  checkLabelStatusTuntas,
  checkStatusTuntas,
  getDeskripsiSikapSosial,
} from "../../../../../../utilities/RaporUtils";

const NilaiSiswa = ({ id, user_id, jadwalId }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // states
  const [page, setPage] = useState("");
  const [jenisRapor, setJenisRapor] = useState("");
  const [detailData, setDetailData] = useState({});
  const {
    materiRombel,
    muatan,
    predikat,
    sekolah,
    sikapsosial,
    sikapspiritual,
    siswa,
    rombel,
  } = detailData;

  const [data, setData] = useState({});

  // fetch
  const detailNilaiSiswa = async () => {
    setLoading(true);
    const { data, error } = await getNilaiSiswa(id, user_id);
    if (data) {
      setDetailData(data);
    } else {
      toast.error(error?.message);
    }
    setLoading(false);
  };

  const detailNilaiMapel = async (mapelId) => {
    setData({});
    const { data, error } =
      page == "pengetahuan" || !page
        ? await getRaporNilai(mapelId, user_id)
        : await getRaporKeterampilan(mapelId, user_id);

    if (data) {
      setData(data);
      detailNilaiSiswa();
    } else {
      toast.error(error.message);
    }
  };

  const refreshNilai = async () => {
    await Promise.all(
      muatan?.map((d) => {
        return Promise.all(
          d?.mapelRapor?.map((e) => {
            return Promise.all([
              getRaporNilai(e?.mataPelajaran?.id, user_id),
              getRaporKeterampilan(e?.mataPelajaran?.id, user_id),
            ]);
          })
        );
      })
    );
    detailNilaiSiswa();
  };
  // end fetch
  const navItems = [
    {
      text: "Pengetahuan",
      page: "pengetahuan",
      active: page == "pengetahuan" || !page,
    },
    {
      text: "Keterampilan",
      page: "keterampilan",
      active: page == "keterampilan",
    },
    {
      text: "Sikap",
      page: "sikap",
      active: page == "sikap",
    },
  ];

  // effects
  useEffect(() => {
    detailNilaiSiswa();
  }, []);
  return (
    <Layout>
      <>
        <div className="row">
          <div className="col-md-12">
            <div
              className={`${
                user?.role == "guru" && "d-flex justify-content-between"
              }`}
            >
              {/* <Link href={`${ssURL}/rombel/${jadwalId}?nav=rapor`}> */}
              <a
                className="text-decoration-none fw-bolder color-primary"
                onClick={() => history.back()}
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
              {/* </Link> */}
            </div>

            {/* Card Kelas Start */}
            <div
              className="
            card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4"
            >
              {loading ? (
                <div>
                  <CardHeaderSkeleton />
                </div>
              ) : (
                <div
                  className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0 flex-md-row flex-column"
                  id="bg-rekap-nilai"
                  style={{ minHeight: "150px" }}
                >
                  <div
                    className="rounded-circle shadow-primary-ss mb-md-0 mb-3"
                    style={{ width: "69px", height: "69px" }}
                  >
                    <img src="/img/icon-rekap-nilai.svg" alt="" />
                  </div>
                  <div className="ms-4">
                    <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                      {siswa?.nama}
                    </h2>
                    <p className="fs-6 fw-bold mb-0">{rombel?.nama}</p>
                  </div>
                </div>
              )}
              <div
                className="card-footer card-footer-ss card-kelas-footer py-lg-4 py-0 px-lg-4 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch pt-3"
                style={{ background: `rgba(244,244,247,0.3)` }}
              >
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {navItems.map((item) => {
                    return (
                      <a
                        className={`position-relative text-decoration-none fw-bold px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 fs-18-ss ${
                          item.active ? "color-primary" : "color-secondary"
                        }`}
                        onClick={() => setPage(item.page)}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </div>
                <div className="d-flex align-items-center justify-content-center mb-lg-0 mb-3">
                  {page != "sikap" && (
                    <div className="dropdown dropdown-ss dropdown-kelas-ujian d-flex flex-sm-row flex-column me-4">
                      <button
                        className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-sm-4`}
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        data-joyride="btn-filter-kelas"
                      >
                        {!jenisRapor || jenisRapor == "tengahSemester"
                          ? "Tengah Semester"
                          : "Akhir Semester"}
                      </button>
                      <ul
                        className="dropdown-menu dropdown-menu-ss my-1"
                        aria-labelledby="dropdownMenuLink"
                      >
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={(e) => setJenisRapor("tengahSemester")}
                          >
                            Tengah Semester
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            onClick={(e) => setJenisRapor("akhirSemester")}
                          >
                            Akhir Semester
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                  <div className="d-flex">
                    <button
                      className="btn btn-outline-primary btn-outline-primary-ss p-1 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "42px", height: "42px" }}
                      onClick={() => refreshNilai()}
                    >
                      <FaUndo />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                {(!page || page == "pengetahuan") && (
                  <SectionPengetahuan
                    muatan={muatan}
                    siswa={siswa}
                    detailNilaiMapel={detailNilaiMapel}
                    jenisRapor={jenisRapor}
                  />
                )}
                {page == "keterampilan" && (
                  <SectionKeterampilan
                    muatan={muatan}
                    siswa={siswa}
                    detailNilaiMapel={detailNilaiMapel}
                    jenisRapor={jenisRapor}
                  />
                )}
                {page == "sikap" && (
                  <SectionSikap
                    muatan={muatan}
                    siswa={siswa}
                    sikapsosial={sikapsosial}
                    sikapspiritual={sikapspiritual}
                  />
                )}
              </div>
              <ModalDetailNilaiSiswa data={data} page={page} />
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id, user_id },
  query: { jadwalId },
}) {
  return {
    props: {
      id,
      user_id,
      jadwalId,
    },
  };
}

export default NilaiSiswa;
