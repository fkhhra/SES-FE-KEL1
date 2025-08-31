import { DatePicker, Pagination } from "antd";
import { downloadAbsen } from "client/AbsenClient";
import { downloadURL, ssURL } from "client/clientAxios";
import { getDataWargaSekolah } from "client/KegiatanClient";
import HeaderDataSekolah from "components/DataSekolah/HeaderDataSekolah";
import TableAbsenKehadiran from "components/Kelas/TableAbsenKehadiran";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import Navbar from "components/Shared/Navbar/Navbar";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import useSekolah from "hooks/useSekolah";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import { joyrideKehadiranGTK } from "utilities/JoyrideUtils";

const index = ({ tanggal }) => {
  const { sekolah } = useSekolah();

  const [absenData, setAbsenData] = useState([]);
  const initialFormData = {
    tanggal: tanggal ? momentPackage(tanggal) : momentPackage(),
  };
  const [formData, setFormData] = useState(initialFormData);
  const [collapseOpen, setcollapseOpen] = useState(false);

  const { absenUser, absen } = absenData || {};
  const { alpa = 0, hadir = 0, izin = 0, sakit = 0 } = absen || {};

  const router = useRouter();
  const { pathname } = router;
  const { user } = useUser();

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const getAbsenData = async () => {
    setIsLoading(true);
    const { data } = await getDataWargaSekolah({
      page,
      role: "siswa",
      jenis: "kehadiran",
      search: debounceSearch,
      tanggal: tanggal
        ? momentPackage(tanggal).format("YYYY-MM-DD")
        : momentPackage().format("YYYY-MM-DD"),
    });
    if (data) {
      setAbsenData(data);
    }
    setIsLoading(false);
  };

  const downloadAbsenData = async () => {
    if (formData.tanggal) {
      const { data } = await downloadAbsen({
        role: "siswa",
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
    setFilter(dateString);

    setFormData({
      ...formData,
      tanggal: dateString,
    });
  };

  const setFilter = (dateString) => {
    router.push({
      pathname: router.pathname,
      query: {
        tanggal: dateString,
      },
    });
  };

  useEffect(() => {
    if (tanggal > momentPackage().format("YYYY-MM-DD")) {
      toast.error("Data belum tersedia");
      setAbsenData([]);
    } else {
      getAbsenData();
    }
  }, [tanggal, debounceSearch, page]);

  useEffect(() => {
    if (!tanggal) {
      router.push({
        pathname: router.pathname,
        query: {
          tanggal: momentPackage().format("YYYY-MM-DD"),
        },
      });
    }
  }, [tanggal]);

  const navItems = [
    {
      url: `${ssURL}/siswa`,
      as: `${ssURL}/siswa`,
      text: "Data",
      active: false,
    },
    {
      url: `${ssURL}/kehadiran-siswa-v2`,
      as: `${ssURL}/kehadiran-siswa-v2`,
      text: "Kehadiran",
      active: true,
    },
  ];

  const tableData =
    absenUser?.data?.map((data, index) => {
      const absenData = data?.absen?.[0] || {};
      return {
        no: index + 1,
        id: data?.id,
        nama: data?.nama,
        fotoMasuk: absenData?.fotoMasuk,
        waktuMasuk: absenData?.createdAt,
        lokasiMasuk: JSON.parse(absenData?.lokasiMasuk || "null"),
        fotoPulang: absenData?.fotoPulang,
        waktuPulang: absenData?.waktuPulang,
        lokasiPulang: JSON.parse(absenData?.lokasiPulang || "null"),
        status: absenData?.absen ? absenData?.absen : "alpa",
        sudahAbsenPulang: absenData?.waktuPulang && absenData?.fotoPulang,
        createdAt: absenData?.createdAt,
        keterangan: absenData?.keterangan,
        lampiran: absenData?.lampiran || [],
        whatsapp: data?.whatsapp,
        // allDataAbsen: absenData
      };
    }) || [];

  return (
    <Layout>
      <MyJoyride steps={joyrideKehadiranGTK} />
      <AnimatePage>
        {user?.role == "pengawas" && (
          <>
            <HeaderDataSekolah ssURL={ssURL} />
          </>
        )}
        <div className="row">
          {user?.role != "pengawas" && (
            <div className="col-lg-12">
              <Navbar nav={navItems} />
            </div>
          )}

          <div className="col-lg-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="d-flex justify-content-between align-items-lg-center flex-lg-row flex-column">
                  <h4 className="fw-extrabold color-dark mb-lg-0 mb-3">
                    Kehadiran{" "}
                    {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                  </h4>
                  <div className="d-flex flex-md-row flex-column">
                    <button
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-md-2 fs-14-ss mb-md-0 mb-3"
                      onClick={() => {
                        downloadAbsenData();
                      }}
                      data-joyride="btn-download-rekapan"
                    >
                      <FaCloudDownloadAlt className="me-2 fs-6" />
                      Rekap Absen
                    </button>
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fw-semibold border-secondary-ss mb-md-0 mb-3 me-md-2 md-w-100"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari siswa"
                      autoComplete="off"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold mb-md-0 mb-3 me-md-2 color-secondary ${
                        collapseOpen && "active"
                      }`}
                      data-bs-toggle="collapse"
                      href="#collapseExample"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                      onClick={() => setcollapseOpen(!collapseOpen)}
                      data-joyride="filter-perpus-collapse"
                    >
                      <FaFilter className="me-3 fs-14-ss color-secondary" />
                      Filter
                    </button>
                    <DatePicker
                      onChange={handleChangeTanggalPengumpulan}
                      placeholder="Pilih tanggal"
                      className="rounded-pill d-flex align-items-center date-picker-mutasi py-2 px-4"
                      autoComplete="off"
                      value={
                        formData?.tanggal ? momentPackage(formData.tanggal) : ""
                      }
                    />
                  </div>
                </div>
                <div className="collapse" id="collapseExample">
                  <hr className="hr-ss my-4" />
                  <div className="row">
                    <div className="col-md-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          // handleChangeSelect={(e, name) =>
                          //   setFormData({
                          //     ...formData,
                          //     tingkatData: e?.value,
                          //   })
                          // }
                          // value={formData?.tingkatData}
                          // options={tingkat?.map((d) => {
                          //   return { label: d, value: d };
                          // })}
                          isClearable
                          isDropdownMutasi
                          placeholder="Pilih tingkat"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          // handleChangeSelect={(e, name) =>
                          //   setFormData({
                          //     ...formData,
                          //     jurusanId: e?.value,
                          //   })
                          // }
                          // value={formData?.jurusanId}
                          // options={jurusan?.map((d) => {
                          //   return { label: `${d?.nama}`, value: d?.id };
                          // })}
                          isClearable
                          isDropdownMutasi
                          placeholder="Pilih jurusan"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="select-akun-keuangan">
                        <SelectShared
                          // handleChangeSelect={(e, name) =>
                          //   setFormData({
                          //     ...formData,
                          //     rombelId: e?.value,
                          //   })
                          // }
                          // value={formData?.rombelId}
                          // options={rombel?.map((d) => {
                          //   return { label: `${d?.nama}`, value: d?.id };
                          // })}
                          isClearable
                          isDropdownMutasi
                          placeholder="Pilih kelas"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between mt-4"
                  style={{ backgroundColor: "#f8f8fb" }}
                >
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                    <h6 className="fw-bold color-secondary mb-2">Hadir</h6>
                    <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                      {hadir}/{absenUser?.total || 0} Orang
                    </h4>
                  </div>
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                    <h6 className="fw-bold color-secondary mb-2">Sakit</h6>
                    <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                      {sakit} Orang
                    </h4>
                  </div>
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                    <h6 className="fw-bold color-secondary mb-2">Izin</h6>
                    <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                      {izin} Orang
                    </h4>
                  </div>
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-md-1 order-1">
                    <h6 className="fw-bold color-secondary mb-2">Alpa</h6>
                    <h4 className="fs-18-ss fw-extrabold color-primary m-0">
                      {alpa} Orang
                    </h4>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <TableAbsenKehadiran
                  isSiswa
                  tableData={tableData}
                  isLoading={isLoading}
                  withPagination={true}
                  currentPage={page}
                />
                <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
                  <Pagination
                    total={absenUser?.total}
                    pageSize={absenUser?.perPage || 25}
                    showSizeChanger={false}
                    current={absenUser?.page}
                    onChange={(page) => setPage(page)}
                  />
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
