import { DatePicker, Pagination } from "antd";
import { downloadURL, ssURL } from "client/clientAxios";
import { downloadJurnal } from "client/KeuanganSekolahClient";
import {
  deleteMutasiV2,
  downloadMutasi,
  getMutasiV2,
} from "client/MutasiClient";
import { getRekeningSekolah } from "client/RekeningSekolahClient";
import HeaderLaporanJurnalUmum from "components/Keuangan/HeaderLaporanJurnalUmum";
import LayoutDetail from "components/Layout/LayoutDetail";
import ListJurnalUmum from "components/Mutasi/ListJurnalUmum";
import ModalDownloadMutasi from "components/Mutasi/ModalDownloadMutasi";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import ModalTambahTransaksi from "components/Shared/ModalTambahTransaksi/ModaTambahTransaksi";
import NewModalTambahTransaksi from "components/Shared/NewModalTambahTransaksi/NewModaTambahTransaksi";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";

const { RangePicker } = DatePicker;

const index = () => {
  const router = useRouter();
  const { sampaiTanggal, dariTanggal } = router.query;

  const [mutasiData, setMutasiData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    transaksi: listMutasi = [],
    grafik,
    kategori: kategoriData,
  } = mutasiData || {};

  const [filterGrafik, setfilterGrafik] = useState("bulan");

  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(1);

  const [searchTransaksi, setSearchTransaksi] = useState("");
  const [debounceSearchTransaksi] = useDebounce(searchTransaksi, 600);

  const [downloaded, setDownloaded] = useState(true);
  const [tipe, setTipe] = useState(router.query?.tipe);
  const [date, setDate] = useState([]);
  const [labels, setLabels] = useState([]);
  const [grafikData, setGrafikData] = useState([]);
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [akun, setAkun] = useState([]);
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [kategori, setKategori] = useState({});
  const [tipeAkun, setTipeAkun] = useState({});
  const [status, setStatus] = useState();
  // console.log(grafikData);

  const firstRender = useRef(true);

  const listDropdownValue = [
    {
      label: "Semua Periode",
      value: "",
    },
    {
      label: "Mingguan",
      value: "mingguan",
    },
    {
      label: "Bulanan",
      value: "bulanan",
    },
    {
      label: "Tahunan",
      value: "tahunan",
    },
  ];

  const handleChangeDropdown = (value) => {
    setTipe(value.value);
  };

  const changeKategori = (value) => {
    setKategori(value);
  };

  const changeTipeAkun = (value) => {
    setTipeAkun(value);
  };

  const handleChangeDate = (date) => {
    setDate(date);
  };

  const onClickEdit = (mutasi) => {
    setEditData({
      id: mutasi?.id,
      nama: mutasi?.nama,
      tipe: mutasi?.tipe,
      kategori: mutasi?.kategori,
      nominal: mutasi?.nominal,
      rekSekolahId: mutasi?.mRekSekolahId,
      waktuDibuat: momentPackage(mutasi?.waktuDibuat),
    });
  };

  const _getRekeningSekolah = async () => {
    setLoading(true);
    const { data } = await getRekeningSekolah();
    if (data) {
      setRekeningSekolah(data.rekSekolah);
    }
    setLoading(false);
  };

  const _downloadMutasi = async () => {
    const payload = {
      ...router.query,
      search: searchTransaksi,
      filterGrafik,
      page: page,
      kategori: kategori.value,
      tipeAkun: tipeAkun.value,
    };
    if (!(dariTanggal && sampaiTanggal)) {
      toast.error("Harap memilih periode jurnal");
      return;
    }
    const { data, error } = await downloadJurnal({
      tanggal_awal: dariTanggal,
      tanggal_akhir: sampaiTanggal,
      status: 1,
    });

    if (data) {
      setDownloaded(true);
      document.getElementById("downloadIframe").src = `${downloadURL}${data}`;
    } else {
      toast.error("Silahkan Coba beberapa saat lagi");
    }
  };

  const _getMutasi = async () => {
    setLoading(true);
    const params = {
      ...router.query,
      search: searchTransaksi,
      filterGrafik,
      page: page,
      kategori: kategori.value,
      tipeAkun: tipeAkun.value,
      status: 1,
    };

    const { data } = await getMutasiV2(params);
    if (data) {
      setMutasiData(data);
      const label = [];
      const graphData = { pemasukan: [], pengeluaran: [] };
      setAkun(data?.akun);
      // if (filterGrafik == "bulan") {
      //   for (
      //     let index = 0;
      //     index < momentPackage().endOf("month").date();
      //     index++
      //   ) {
      //     label.push(index + 1);
      //     graphData.pemasukan.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).date() == index + 1 &&
      //             item.tipe == "kredit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //     graphData.pengeluaran.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).date() == index + 1 &&
      //             item.tipe == "debit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //   }
      // }
      // if (filterGrafik == "minggu") {
      //   for (let index = 0; index < 7; index++) {
      //     label.push(dataHari[index]);
      //     graphData.pemasukan.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).day() == index &&
      //             item.tipe == "kredit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //     graphData.pengeluaran.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).day() == index &&
      //             item.tipe == "debit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //   }
      // }
      // if (filterGrafik == "tahun") {
      //   for (let index = 0; index < 12; index++) {
      //     label.push(dataBulan[index]);
      //     graphData.pemasukan.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).month() == index &&
      //             item.tipe == "kredit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //     graphData.pengeluaran.push(
      //       data?.grafik
      //         ?.filter(
      //           (item) =>
      //             momentPackage(item.waktuDibuat).month() == index &&
      //             item.tipe == "debit"
      //         )
      //         ?.reduce((a, b) => a + parseInt(b.nominal), 0)
      //     );
      //   }
      // }
      setGrafikData(graphData);
      setLabels(label);
    }
    setLoading(false);
  };

  const _deleteMutasi = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteMutasiV2(id);
        if (data) {
          toast.success(data?.message);
          _getMutasi();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const setFilter = () => {
    const queryParams = {
      search: searchTransaksi,
      tipe: tipe,
      dariTanggal: date?.[0]
        ? momentPackage(date?.[0]).format("YYYY-MM-DD HH:mm:ss")
        : "",
      sampaiTanggal: date?.[1]
        ? tipe
          ? momentPackage(date?.[0])
              .add(
                1,
                tipe == "tahunan"
                  ? "years"
                  : tipe == "bulanan"
                  ? "months"
                  : "weeks"
              )
              .format("YYYY-MM-DD HH:mm:ss")
          : momentPackage(date?.[1]).format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    // delete queryParams if value is null
    Object.keys(queryParams)?.map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      setFilter();
    }
  }, [tipe, date]);

  useEffect(() => {
    _getMutasi();
  }, [
    router.query,
    debounceSearchTransaksi,
    filterGrafik,
    page,
    kategori,
    tipeAkun,
    status,
  ]);

  useEffect(() => {
    _getRekeningSekolah();
  }, []);

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/laporan-keuangan`}
      title={`Realisasi`}
    >
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <HeaderLaporanJurnalUmum />
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss py-4 px-0 pb-0">
                  <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                    <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                      Jurnal Umum
                    </h4>
                  </div>
                  <hr className="my-4" />
                  <div className="d-flex jusitfy-content-start align-items-lg-center flex-lg-row flex-column mb-4 mx-4">
                    <input
                      type="text"
                      className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-lg-0 mb-3 lg-w-100"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder="Cari Akun"
                      value={searchTransaksi}
                      onChange={(e) => setSearchTransaksi(e.target.value)}
                    />
                    <button
                      className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold me-lg-3 mb-lg-0 mb-3 color-secondary ${
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
                    {/* <button
                      className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold me-lg-3 mb-lg-0 mb-3 border-light-secondary-ss ${
                        downloaded ? "" : "disabled"
                      }`}
                      data-bs-toggle="modal"
                      data-bs-target="#ModalDownloadMutasi"
                    >
                      <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                      Download Mutasi
                    </button> */}
                    <button
                      className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss ${
                        downloaded ? "" : "disabled"
                      }`}
                      onClick={_downloadMutasi}
                    >
                      <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                      Rekap Jurnal Umum
                    </button>
                  </div>
                  <div className="collapse mx-4" id="collapseExample">
                    <div className="row">
                      <div className="col-md-8 mb-4">
                        <RangePicker
                          onChange={(date) => handleChangeDate(date)}
                          value={[
                            momentPackage(dariTanggal),
                            momentPackage(sampaiTanggal),
                          ]}
                          className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                        />
                      </div>
                      <div className="col-md-4 mb-4">
                        <Dropdown
                          listValue={listDropdownValue}
                          defaultValue={
                            listDropdownValue?.find(
                              (item) => item.value == tipe
                            )?.label
                          }
                          onChange={handleChangeDropdown}
                          className="w-100"
                          isDropdownMutasi
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  {loading && <Skeleton count={3} height={50} />}
                  {!loading && (
                    <div className="table-responsive">
                      <table className="table-ss table-mutasi">
                        <thead>
                          <tr>
                            <th>Tanggal</th>
                            <th style={{ width: "30%" }}>Nama Akun</th>
                            {/* <th>Nama Akun</th> */}
                            <th>Debit</th>
                            <th>Kredit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listMutasi?.data?.map((d) => {
                            return (
                              <ListJurnalUmum
                                data={d}
                                setEditData={setEditData}
                                _deleteMutasi={_deleteMutasi}
                              />
                            );
                          })}
                          {/* {listMutasi?.data?.map((mutasi, idx) => (
                            <tr>
                              <td className="border-start-0">
                                {momentPackage(mutasi?.waktuDibuat).format(
                                  "DD/MM/YY"
                                )}
                              </td>
                              <td>
                                <div className="d-flex justify-content-center flex-column">
                                  <p className="mb-1 color-dark">
                                    {mutasi?.nama}
                                  </p>
                                  <p className="mb-0 color-secondary fs-ss-14">
                                    {mutasi?.kategori}
                                  </p>
                                </div>
                              </td>
                              <td>
                                {rekeningSekolah?.find(
                                  (d) => d?.id == mutasi?.mRekSekolahId
                                )?.jenis || "Dana Sekolah"}
                              </td>
                              <td>
                                <span
                                  className={`color-${
                                    mutasi?.tipe == "kredit"
                                      ? "success"
                                      : "danger"
                                  } fw-bold`}
                                >
                                  {mutasi?.tipe == "kredit" ? "+" : "-"}
                                  {currencyFormatter(mutasi?.nominal)}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row">
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 me-md-0 me-2 mb-lg-0 mb-md-2 mb-0"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalTambahTransaksi"
                                    onClick={() => onClickEdit(mutasi)}
                                  >
                                    <FaPen className="color-secondary" />
                                  </button>
                                  <button
                                    className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() => _deleteMutasi(mutasi?.id)}
                                  >
                                    <FaTrashAlt className="color-secondary" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="my-4 text-center">
                    <Pagination
                      total={listMutasi?.total}
                      showSizeChanger={false}
                      current={parseInt(page) || 1}
                      pageSize={25}
                      onChange={(e) => setPage(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        <ModalTambahTransaksi
          _getMutasi={_getMutasi}
          editData={editData}
          rekeningSekolah={rekeningSekolah}
        />
        <ModalDownloadMutasi />
        <NewModalTambahTransaksi
          akun={akun}
          editData={editData}
          _getMutasi={_getMutasi}
        />
      </motion.div>
    </LayoutDetail>
  );
};

export default index;
