import { DatePicker } from "antd";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaSearch } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { downloadAbsen } from "../../../client/AbsenClient";
import { getBukuTamu } from "../../../client/BukuTamuClient";
import { baseURL, downloadURL, ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "../../../components/Shared/MyJoyride/MyJoyride";
import { momentPackage } from "../../../utilities/HelperUtils";

const index = ({ tanggal }) => {
  const initialFormData = {
    tanggal: tanggal ? momentPackage(tanggal) : momentPackage(),
  };

  const [absenData, setAbsenData] = useState([]);
  const { buku } = absenData;

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const getAbsenData = async () => {
    setLoading(true);

    const { data } = await getBukuTamu({
      //   tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
      tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
    });
    if (data) {
      setAbsenData(data);
    }
    setLoading(false);
  };

  const downloadAbsenData = async () => {
    if (formData.tanggal) {
      const { data } = await downloadAbsen({
        tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
      });

      if (data) {
        window.open(`${downloadURL}/${data}`);
      }
    } else {
      toast.error("Pilih tanggal terlebih dahulu");
    }
  };
  const handleChangeTanggalPengumpulan = (date, dateString) => {
    setFormData({
      ...formData,
      tanggal: dateString,
    });
  };

  const handleGetAbsenData = () => {
    setFilter();
  };

  const setFilter = () => {
    router.push({
      pathname: router.pathname,
      query: {
        tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD"),
      },
    });
  };

  useEffect(() => {
    if (formData.tanggal > momentPackage().format("YYYY-MM-DD")) {
      toast.error("Data belum tersedia");
      setAbsenData([]);
    } else {
      getAbsenData();
    }
  }, [tanggal]);

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
          <h5 className="color-dark fw-black">Daftar Kehadiran Siswa</h5>
          <p className="color-secondary fw-semibold">
            Ini merupakan daftar kehadiran siswa yang sudah ditambahkan ke
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
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-md-0 mb-3">
                    Daftar Buku Tamu
                  </h4>
                  <div className="d-flex flex-sm-row flex-column justify-content-md-start justify-content-sm-between justify-content-start">
                    <button
                      type="button"
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                      onClick={() => {
                        downloadAbsenData();
                      }}
                      data-joyride="btn-download-rekapan"
                    >
                      <FaCloudDownloadAlt className="me-2 fs-6" />
                      Rekap Buku Tamu
                    </button>
                    <div
                      class="date-picker-kehadiran d-flex"
                      data-joyride="filter-tanggal"
                    >
                      <DatePicker
                        className="w-100"
                        onChange={handleChangeTanggalPengumpulan}
                        placeholder="Pilih tanggal"
                        value={momentPackage(formData.tanggal)}
                      />
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
                          <th>No</th>
                          <th>Nama</th>
                          <th>Asal Instansi</th>
                          <th>Waktu</th>
                          <th>Keterangan</th>
                          <th>Informasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {buku?.data?.map((d, idx) => (
                          <tr>
                            <td data-th="No">{idx + 1}</td>
                            <td data-th="Nama">{d?.nama}</td>
                            <td data-th="Instansi">{d?.instansi}</td>
                            <td data-th="Waktu">
                              {momentPackage(d?.surel?.create_at).format(
                                "DD MMMM YYYY"
                              )}
                            </td>
                            <td data-th="Keterangan">{d?.keterangan}</td>
                            <td data-th="Informasi">
                              <Link href={`${ssURL}/buku-tamu/${d?.id}`}>
                                <a className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1">
                                  Detail
                                </a>
                              </Link>
                            </td>
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

export async function getServerSideProps({ query: { tanggal } }) {
  return {
    props: {
      tanggal: tanggal || "",
    },
  };
}

export default index;
