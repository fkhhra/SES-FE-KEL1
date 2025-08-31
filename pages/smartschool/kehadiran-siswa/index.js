import { DatePicker, Skeleton } from "antd";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  downloadAbsen,
  downloadAbsenSeluruhSiswa,
  downloadAbsenSiswa,
  downloadAbsenSiswaTanggal,
  getAbsen,
} from "../../../client/AbsenClient";
import { baseURL, downloadURL, ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import { momentPackage } from "../../../utilities/HelperUtils";
import useUser from "hooks/useUser";
import HeaderDataSekolah from "components/DataSekolah/HeaderDataSekolah";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";

const { RangePicker } = DatePicker;

const index = ({ tanggal_awal, tanggal_akhir }) => {
  const initialFormData = {
    tanggal_awal: tanggal_awal
      ? momentPackage(tanggal_awal).startOf("day")
      : momentPackage().subtract(7, "days").startOf("day"),
    tanggal_akhir: tanggal_akhir
      ? momentPackage(tanggal_akhir).endOf("day")
      : momentPackage().endOf("day"),
  };

  const { user } = useUser();
  const { sekolah } = useSekolah();

  const [formData, setFormData] = useState(initialFormData);
  const [absenData, setAbsenData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getAbsenData = async () => {
    setLoading(true);

    const { data } = await getAbsen({
      role: "siswa",
      tanggal_awal: momentPackage(formData.tanggal_awal).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
      tanggal_akhir: momentPackage(formData.tanggal_akhir).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });
    if (data) {
      setLoading(false);
      setAbsenData(data.rombel);
    }
  };

  const downloadAbsenData = async (rombelId) => {
    if (formData.tanggal_akhir && formData.tanggal_awal) {
      const { data } = await downloadAbsenSiswa({
        role: "siswa",
        tanggal_awal: momentPackage(formData.tanggal_awal).format(
          "YYYY-MM-DD 00:00:00"
        ),
        tanggal_akhir: momentPackage(formData.tanggal_akhir).format(
          "YYYY-MM-DD 23:59:29"
        ),
        rombelId: rombelId,
      });

      if (data) {
        window.open(`${downloadURL}/${data}`);
      }
    } else {
      toast.error("Pilih tanggal terlebih dahulu");
    }
  };

  const downloadSeluruhAbsenData = async () => {
    if (formData.tanggal_akhir && formData.tanggal_awal) {
      const { data } = await downloadAbsenSeluruhSiswa({
        role: "siswa",
        tanggal_awal: momentPackage(formData.tanggal_awal).format(
          "YYYY-MM-DD 00:00:00"
        ),
        tanggal_akhir: momentPackage(formData.tanggal_akhir).format(
          "YYYY-MM-DD 23:59:29"
        ),
      });

      if (data) {
        window.open(`${downloadURL}/${data}`);
      }
    } else {
      toast.error("Pilih tanggal terlebih dahulu");
    }
  };

  // const downloadAbsenDataTanggal = async (rombelId) => {
  //   if (formData.tanggal_akhir && formData.tanggal_awal) {
  //     const { data } = await downloadAbsenSiswaTanggal({
  //       role: "siswa",
  //       tanggal_awal: momentPackage(formData.tanggal_awal).format(
  //         "YYYY-MM-DD 00:00:00"
  //       ),
  //       tanggal_akhir: momentPackage(formData.tanggal_akhir).format(
  //         "YYYY-MM-DD 23:59:29"
  //       ),
  //       rombelId: rombelId,
  //     });

  //     if (data) {
  //       window.open(`${downloadURL}/${data}`);
  //     }
  //   } else {
  //     toast.error("Pilih tanggal terlebih dahulu");
  //   }
  // };

  const handleChangeTanggal = (val) => {
    setFormData({
      ...formData,
      tanggal_awal: val[0],
      tanggal_akhir: val[1],
    });
  };

  const handleGetAbsenData = () => {
    setFilter();
  };

  const setFilter = () => {
    router.push({
      pathname: router.pathname,
      query: {
        tanggal_awal: momentPackage(formData.tanggal_awal).format("YYYY-MM-DD"),
        tanggal_akhir: momentPackage(formData.tanggal_akhir).format("YYYY-MM-DD"),
      },
    });
  };

  useEffect(() => {
    if (formData.tanggal_akhir > momentPackage().format("YYYY-MM-DD")) {
      toast.error("Data belum tersedia");
      setAbsenData([]);
    } else {
      getAbsenData();
    }
  }, [tanggal_awal, tanggal_akhir]);

  const steps = [
    {
      target: '[data-joyride="filter-tanggal"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Tanggal Kehadiran</h5>
          <p className="color-secondary fw-semibold">
            Untuk melihat kehadiran anda dapat memilih tanggal sesuai tanggal
            yang anda ingin lihat. Pilih tanggal lalu tekan tombol cari berwarna
            biru untuk melihat daftar kehadiran.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-joyride="btn-download-rekapan"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Rekap Absen</h5>
          <p className="color-secondary fw-semibold">
            Anda dapat merekap absensi kehadiran menjadi file excel. Tekan
            tombol untuk merekap absensi kehadiran sesuai tanggal yang anda
            pilih.
          </p>
        </div>
      ),
    },
    {
      target: '[data-joyride="table-kehadiran"]',
      content: (
        <div className="text-start">
          <h5 className="color-dark fw-black">Daftar Kehadiran {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar kehadiran {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"} yang sudah ditambahkan ke
            sekolah anda.
          </p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <MyJoyride steps={steps} />
      <AnimatePage>
        {user?.role == "pengawas" && (
          <>
            <HeaderDataSekolah ssURL={ssURL} />
          </>
        )}
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-md-0 mb-3">
                    Kehadiran {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                  </h4>
                  <div className="d-flex flex-sm-row flex-column justify-content-md-start justify-content-sm-between justify-content-start">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss py-2 px-4 me-md-3 mb-lg-0 mb-3"
                      id="exampleFormControlInput1"
                      placeholder="Cari Kelas"
                      autoComplete="off"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                      onClick={() => {
                        downloadSeluruhAbsenData();
                      }}
                      data-joyride="btn-download-rekapan"
                    >
                      <FaCloudDownloadAlt className="me-2 fs-6" />
                      Rekap Absen
                    </button>
                    <div
                      class="date-picker-kehadiran d-flex"
                      data-joyride="filter-tanggal"
                    >
                      <RangePicker
                        className="w-100"
                        onChange={(val) => handleChangeTanggal(val)}
                        placeholder="Pilih Tanggal"
                        disabledDate={(current) => {
                          const tooLate =
                            formData?.tanggal_awal &&
                            current.diff(formData?.tanggal_awal, "days") > 31;
                          const tooEarly =
                            formData.tanggal_akhir &&
                            formData.tanggal_akhir.diff(current, "days") >
                              31 * 6;
                          return (
                            tooEarly ||
                            tooLate ||
                            current > momentPackage().endOf("day")
                          );
                        }}
                        value={[formData.tanggal_awal, formData.tanggal_akhir]}
                      />
                      {/* <DatePicker
                        className="w-100"
                        onChange={handleChangeTanggalAwal}
                        placeholder="Pilih tanggal"
                        value={momentPackage(formData.tanggal_awal)}
                      /> */}
                      <button
                        type="button"
                        className="btn btn-ss btn-primary btn-primary-ss fs-14-ss"
                        onClick={() => {
                          handleGetAbsenData();
                        }}
                      >
                        <FaSearch />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  {loading && <Skeleton count={4} height={50} />}
                  {!loading && (
                    <table className="table-ss" data-joyride="table-kehadiran">
                      <thead>
                        <tr>
                          <th>Nomor</th>
                          <th>Kelas</th>
                          <th>Aksi</th>
                          <th>Informasi</th>
                          {/* <th>Hadir</th>
                          <th>Izin</th>
                          <th>Sakit</th>
                          <th>Alpha</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {absenData
                          ?.filter((data) =>
                            data?.rombel
                              ?.toLowerCase()
                              .includes(search?.toLowerCase())
                          )
                          ?.map((absen, idx) => (
                            <tr>
                              <td data-th="Nomor">{idx + 1}</td>
                              <td data-th="Kelas">{absen?.rombel}</td>
                              <td data-th="Aksi">
                                <button
                                  type="button"
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                                  onClick={() => {
                                    downloadAbsenData(absen?.id);
                                  }}
                                  data-joyride="btn-download-rekapan"
                                >
                                  <FaCloudDownloadAlt className="me-2 fs-6" />
                                  Rekap Absen Keseluruhan
                                </button>
                                {/* <button
                                  type="button"
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                                  onClick={() => {
                                    downloadAbsenDataTanggal(absen?.id);
                                  }}
                                  data-joyride="btn-download-rekapan"
                                >
                                  <FaCloudDownloadAlt className="me-2 fs-6" />
                                  Rekap Absen Perhari
                                </button> */}
                              </td>
                              <td data-th="Informasi">
                                <Link href={`${ssURL}/kehadiran-siswa/${absen?.id}`}>
                                  <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                                    Detail
                                  </a>
                                </Link>
                              </td>
                              {/* <td data-th="Hadir">{absen?.totalHadir}</td>
                              <td data-th="Izin">{absen?.totalIzin}</td>
                              <td data-th="Sakit">{absen?.totalSakit}</td>
                              <td data-th="Alpha">{absen?.totalAlpa}</td> */}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { tanggal_awal, tanggal_akhir },
}) {
  return {
    props: {
      tanggal_awal: tanggal_awal || "",
      tanggal_akhir: tanggal_akhir || "",
    },
  };
}

export default index;
