import { detailJadwalPPDB } from "client/JadwalPPDBClient";
import { resetPesertaUjian } from "client/PesertaUjianClient";
import { updateNilaiPeserta } from "client/UjianClient";
import ModalUnggahNilai from "components/UjianPenerimaanPPDB/ModalUnggahNilai";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";
import swal from "sweetalert";
import { downloadURL, ssURL } from "../../../../../client/clientAxios";
import { downloadJadwalUjian } from "../../../../../client/JadwalUjianClient";
import Layout from "../../../../../components/Layout/Layout";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../../../components/Shared/Navbar/Navbar";
import { momentPackage } from "../../../../../utilities/HelperUtils";

const index = ({ id, rombel_peserta_id }) => {
  const { nav } = useRouter().query;
  const [jadwalUjianRef, setJadwalUjianRef] = useState([]);
  const [statusSort, setStatusSort] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState(`/`);
  // useEffect(() => {
  //   setActiveMenu(router.pathname);
  // }, [router.pathname]);

  const [detailJadwalUjianData, setDetailJadwalUjianData] = useState({});

  const { jadwalUjian, pesertaUjian, rombel } = detailJadwalUjianData;

  const getDetailJadwalUjianData = async () => {
    const { data } = await detailJadwalPPDB(id);
    if (data) {
      setDetailJadwalUjianData(data);
    }
  };

  const handleClickDownloadRekapNilai = async () => {
    const { data } = await downloadJadwalUjian({
      tkJadwalUjianId: rombel_peserta_id,
      mJadwalUjianId: id,
    });
    if (data) {
      window.open(downloadURL + data, "_blank");
      // setTimeout(() => {
      //   document.getElementById("downloadIframe").src = `${baseURL}${data}`;
      // }, 4000);
    }
  };

  const handleUpdateNilai = async () => {
    await Promise.all(
      pesertaUjian
        ?.sort((a, b) => ("" + a?.nama).localeCompare(b?.nama))
        ?.filter((d) => d?.pesertaUjian?.[0]?.nilai == null)
        ?.map((peserta, idx) => {
          return updateNilaiPeserta(peserta?.pesertaUjian?.[0]?.id);
        })
    );
    getDetailJadwalUjianData();
  };

  const handleResetUjian = async (id, hapus) => {
    swal({
      title: hapus
        ? "Siswa akan Mengulang ujian dari awal"
        : "Siswa dapat melanjutkan ujian apabila masih berlangsung",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await resetPesertaUjian(
          { hapus, reset: !hapus },
          id
        );

        if (data) {
          toast.success(data.message);
          getDetailJadwalUjianData();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  useEffect(() => {
    getDetailJadwalUjianData();
  }, []);

  // useEffect(() => {
  //   getDetailJadwalUjianData();
  //   getDetailJadwalUjianRef(rombel_peserta_id, setJadwalUjianRef);
  //   document.getElementById("downloadIframe").src = "";
  // }, [rombel_peserta_id]);

  // const handleBack = () => {
  //   router.back();
  // };

  const navItems = [
    {
      url: `${ssURL}/jadwal-ujian/[id]?nav=ujian`,
      as: `${ssURL}/jadwal-ujian/${id}?nav=ujian`,
      text: "Ujian",
      active: nav == "ujian" || nav == undefined,
      dataJoyride: "ujian",
    },
    // {
    //   url: `${ssURL}/jadwal-ujian/[id]?nav=remedial`,
    //   as: `${ssURL}/jadwal-ujian/${id}?nav=remedial`,
    //   text: "Remedial",
    //   active: nav == "remedial",
    //   dataJoyride: "remedial",
    // },
    // {
    //   url: `${ssURL}/jadwal-ujian/[id]?nav=susulan`,
    //   as: `${ssURL}/jadwal-ujian/${id}?nav=susulan`,
    //   text: "Susulan",
    //   active: nav == "susulan",
    //   dataJoyride: "susulan",
    // },
  ];

  const NavJadwalUjianDetail = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button: (
              <>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    onClick={handleClickDownloadRekapNilai}
                    data-joyride="button-rekap-nilai"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Nilai
                  </button>
                </div>
                {/* <div className="dropdown dropdown-ss d-flex flex-column">
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                    data-joyride="button-buat-jadwal"
                  >
                    <div>
                      <FaPlus className="me-2" />
                      Buat Jadwal
                    </div>
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianRemedial"
                      >
                        <span>Remedial</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjianSusulan"
                      >
                        <span>Susulan</span>
                      </a>
                    </li>
                  </ul>
                </div> */}
              </>
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

  return (
    <Layout
      isFluid
      modalWrapper={
        <ModalUnggahNilai id={id} _detailUjian={getDetailJadwalUjianData} />
      }
    >
      <AnimatePage>
        <div className="row">
          {/* Header Jadwal Ujian Detail End */}
          <div className="col-md-12">
            <Link href={`${ssURL}/ujian-penerimaan-ppdb/`}>
              <a
                className="text-decoration-none fw-bolder position-relative color-primary pointer"
                data-joyride="button-kembali"
              >
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
              {/* Card Label & Option Start */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Jadwal Ujian Label Start */}

                <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                  Diluar Smarteschool
                </div>

                {/* Jadwal Ujian Label End */}

                {/* Dropdown Option Start */}

                <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                  {/* <div
                    role="button"
                    id="dropdownOption"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                      data-joyride="dropdown"
                  >
                    <img
                      src={`/img/icon-dropdown-option.svg`}
                      alt="icon-option"
                    />
                  </div> */}
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownOption"
                  >
                    <li>
                      <a className="dropdown-item">
                        <FaPen className="me-2" />
                        <span>Edit</span>
                      </a>
                    </li>
                    <li>
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
              {/* Jadwal Ujian Title Start */}
              <div className="w-75 text-break" data-joyride="title-ujian">
                <h2 className="color-dark fw-black mb-2">
                  {detailJadwalUjianData?.jadwalPpdb?.nama}
                </h2>
                <h5 className="color-secondary fw-bold mb-4">
                  {
                    detailJadwalUjianData?.jadwalPpdb?.info?.gelombang?.jalur
                      ?.nama
                  }{" "}
                  - {detailJadwalUjianData?.jadwalPpdb?.info?.gelombang?.nama}
                </h5>
              </div>
              {/* Jadwal Ujian Title End */}
              {/* Jadwal Ujian Info Start */}
              <div className="row mt-4">
                <div className="col-md-12" data-joyride="detail-info-ujian">
                  <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">
                        Tanggal Ujian
                      </p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {momentPackage(
                          detailJadwalUjianData?.jadwalPpdb?.waktuDibuka
                        ).format("DD MMMM")}{" "}
                        -{" "}
                        {momentPackage(
                          detailJadwalUjianData?.jadwalPpdb?.waktuDitutup
                        ).format("DD MMMM YYYY")}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">KKM</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {detailJadwalUjianData?.jadwalPpdb?.kkm}
                      </p>
                    </div>
                    {detailJadwalUjianData?.jadwalPpdb?.lokasi ? (
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">Lokasi</p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {detailJadwalUjianData?.jadwalPpdb?.lokasi}
                        </p>
                      </div>
                    ) : (
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">
                          Link Ujian
                        </p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {detailJadwalUjianData?.jadwalPpdb?.link}
                        </p>
                      </div>
                    )}
                    {/* <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-2">Waktu</p>
                      <p className="fs-18-ss fw-bold color-dark m-0">
                        {detailJadwalUjianData?.jadwalPpdb?.waktuUjian}
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Jadwal Ujian Info End */}
            </div>
          </div>
          {/* Header Jadwal Ujian Detail End */}

          {/* Tabel Streaming Ujian Start*/}

          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                  Daftar Peserta (
                  {
                    detailJadwalUjianData?.jadwalPpdb?.info?.gelombang
                      ?.pendaftar?.length
                  }
                  )
                </h4>
                <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                  <button
                    type="button"
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill mb-3 mb-lg-0 fw-bold color-secondary border-light-secondary-ss"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUnggahNilai"
                  >
                    <FaCloudUploadAlt className="me-2 fs-6" />
                    Unggah Nilai
                  </button>
                  <input
                    type="text"
                    className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss ms-sm-4 mb-sm-0 mb-3"
                    style={{ height: "42px" }}
                    id="exampleFormControlInput1"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari Nama Siswa"
                  />
                </div>
              </div>
              <div className="card-body px-0 pb-4 pt-0">
                <div className="table-responsive">
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th className="text-md-center">Status</th>
                        <th className="text-md-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailJadwalUjianData?.jadwalPpdb?.info?.gelombang?.pendaftar?.map(
                        (d, idx) => {
                          const hasil =
                            detailJadwalUjianData?.pesertaUjianPpdb?.find(
                              (e) => e.mPendaftarPpdbId == d?.id
                            );
                          return (
                            <tr>
                              <td>{idx + 1}</td>
                              <td data-th="Nama">{d?.user?.nama}</td>
                              <td data-th="Status" className="text-md-center">
                                <span
                                  className={`mx-md-auto label-ss rounded-pill fs-12-ss fw-bold py-1 px-4 ${
                                    hasil
                                      ? hasil?.nilai >=
                                        detailJadwalUjianData?.jadwalPpdb?.kkm
                                        ? "label-light-success-ss"
                                        : "label-light-danger-ss"
                                      : "label-light-warning-ss"
                                  }`}
                                >
                                  {hasil
                                    ? hasil?.nilai >=
                                      detailJadwalUjianData?.jadwalPpdb?.kkm
                                      ? "Lulus Seleksi"
                                      : "Tidak Lulus Seleksi"
                                    : "Nilai Belum diunggah"}
                                </span>
                              </td>
                              <td data-th="Nilai" className="text-md-center">
                                <span
                                  className={`fw-bold ${
                                    hasil
                                      ? hasil?.nilai >=
                                        detailJadwalUjianData?.jadwalPpdb?.kkm
                                        ? ""
                                        : "color-danger"
                                      : ""
                                  }`}
                                >
                                  {hasil?.nilai || "-"}
                                </span>
                              </td>
                            </tr>
                          );
                        }
                      )}
                      {/* <tr>
                        <td>2</td>
                        <td data-th="Nama">Lorem Ipsum </td>
                        <td data-th="Status" className="text-md-center">
                          <span className="mx-md-auto label-ss label-light-danger-ss rounded-pill fs-12-ss fw-bold py-1 px-4">
                            Tidak Lulus Seleksi
                          </span>
                        </td>
                        <td data-th="Nilai" className="text-md-center">
                          <span className="fw-bold color-danger">60</span>
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Tabel Streaming Ujian End*/}
        </div>
      </AnimatePage>
    </Layout>
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
