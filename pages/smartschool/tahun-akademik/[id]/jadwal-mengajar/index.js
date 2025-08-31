import {
  getAllJadwalMengajar,
  downloadImportJadwal,
  downloadRekapJadwal,
} from "client/JadwalMengajarClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { downloadURL, ssURL } from "client/clientAxios";

import SideNavTahunAkademik from "components/TahunAkademik/SideNavTahunAkademik";
import Link from "next/link";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalUnggahDataJadwal from "components/JadwalMengajar/ModalUnggahDataJadwal";
import toast from "react-hot-toast";
import LayoutDetailTahunAkademik from "components/Layout/LayoutDetailTahunAkademik";
// import Iframe from "react-iframe";

const index = ({ id }) => {
  const router = useRouter();

  const [jadwalMengajarData, setJadwalMengajarData] = useState([]);

  const { totalTingkat, tingkat, dataTA, semuaTA } = jadwalMengajarData || {};
  const [downloadingRekapJadwal, setDownloadingRekapJadwal] = useState(false);
  const [dataTingkat, setDataTingkat] = useState();
  const _getAllJadwalMengajar = async () => {
    const { data } = await getAllJadwalMengajar({ taId: id });
    if (data) {
      setJadwalMengajarData(data);
    }
  };
  const handleClickDownloadRekap = async (tingkat) => {
    setDownloadingRekapJadwal(true);
    const toastloading = toast.loading("Downloading");
    const { data, error } = await downloadRekapJadwal({ tingkat: tingkat });
    if (data) {
      document.getElementById("downloadIframe").src = `${downloadURL}/${data}`;
      // window.open(`${downloadURL}/${data}`, "_blank");
      setDownloadingRekapJadwal(false);
      toast.success("Downloaded", { id: toastloading });
    } else if (error) {
      toast.error("silahkan Coba beberapa saat lagi");
      toast.error("Error", { id: toastloading });
    }
  };
  const handleClickDataDownload = (tingkat) => {
    setDataTingkat(tingkat);
  };

  const openDetail = (tingkat) => {
    router.push(
      `${ssURL}/tahun-akademik/${id}/jadwal-mengajar/1?tingkat=${tingkat}`
    );
  };

  useEffect(() => {
    _getAllJadwalMengajar();
  }, []);

  return (
    <LayoutDetailTahunAkademik
      semuaTA={semuaTA}
      dataTA={dataTA}
      route={"jadwal-mengajar"}
    >
      <AnimatePage>
        <div
          className="row mb-4 mt-md-0 mt-4 sticky-top md-position-static"
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
        <div className="row gy-4">
          <div className="col-lg-3 positon-relative">
            <SideNavTahunAkademik ssURL={ssURL} />
          </div>
          <div className="col-lg-9">
            <h3 className="color-dark fw-extrabold title-page position-relative mb-5">
              Daftar Jadwal Mengajar
            </h3>
            <div className="row">
              {Object.keys(tingkat || {}).map((index) => {
                const key = tingkat[index];
                const tingkatData =
                  tingkat[index]?.charAt(0).toLowerCase() +
                  tingkat[index]?.slice(1);
                return (
                  <div className="col-md-12">
                    <div className="card card-ss p-0 mb-4">
                      <div
                        className="card-header-ss p-4 bg-no-repeat "
                        style={{
                          background: `url("/img/bg-card-jadwal-mengajar.png")`,
                          backgroundPositionX: "right",
                          backgroundPositionY: "bottom",
                        }}
                      >
                        <a
                          className="text-decoration-none flex-grow-1 mb-md-0 mb-3"
                          onClick={() => openDetail(key?.replace("x", "X"))}
                        >
                          <h5 className="fw-extrabold color-dark mb-2">
                            {`Tingkat ${key?.replace("x", "X")}`}
                          </h5>
                          <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                            <div className="d-flex align-items-center me-4 mb-sm-0 mb-2">
                              <img
                                src="/img/icon-side-nav-jadwal-mengajar.svg"
                                alt="icon-tanggal"
                                className="me-2"
                                style={{
                                  width: "24px",
                                  height: "24px",
                                }}
                              />
                              <p className="fs-14-ss fw-semibold mb-0">
                                {`${totalTingkat[tingkatData] || "0"} Jadwal`}
                              </p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <hr className="hr-ss m-0" />
                      <div className="card-footer-ss py-3 px-4">
                        <div className="d-flex align-items-md-center justify-content-end flex-md-row flex-column">
                          <button
                            className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-md-3 mb-md-0 mb-3 fw-bold color-secondary fs-14-ss"
                            onClick={() =>
                              handleClickDataDownload(key?.replace("x", "X"))
                            }
                            data-bs-toggle="modal"
                            data-bs-target="#modalUnggahDataJadwal"
                          >
                            <FaCloudUploadAlt className="me-2 fs-18-ss" />
                            Unggah Jadwal
                          </button>
                          {!downloadingRekapJadwal ? (
                            <button
                              className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-md-3 mb-md-0 mb-3 fw-bold color-secondary fs-14-ss"
                              onClick={() =>
                                handleClickDownloadRekap(key?.replace("x", "X"))
                              }
                            >
                              <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                              Rekap Jadwal
                            </button>
                          ) : (
                            <button className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-md-3 mb-md-0 mb-3 fw-bold color-secondary fs-14-ss">
                              <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                              Rekap Jadwal
                            </button>
                          )}
                          <a
                            className="btn btn-ss btn-primary btn-primary-ss rounded-pill shadow-primary-ss fs-14-ss"
                            onClick={() => openDetail(key?.replace("x", "X"))}
                          >
                            Lihat Detail
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ModalUnggahDataJadwal tingkat={dataTingkat} />
      </AnimatePage>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
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
