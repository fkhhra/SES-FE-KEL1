import { DatePicker, Pagination } from "antd";
import { baseURL, downloadURL, ssURL } from "client/clientAxios";
import {
  downloadJurnalRencana,
  downloadTransaksiRencana,
} from "client/KeuanganSekolahClient";
import { downloadMutasi } from "client/MutasiClient";
import { getRekeningSekolah } from "client/RekeningSekolahClient";
import {
  deleteRencanaTransaksi,
  getRencanaTransaksi,
} from "client/RencanaTransaksiClient";
import HeaderPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderPerencanaanKeuangan";
import ListTransaksiRencana from "components/Keuangan/PerencanaanKeuangan/ListTransaksi";
import ModalTambahPerencanaan from "components/Keuangan/PerencanaanKeuangan/ModalTambahPerencanaan";
import Layout from "components/Layout/Layout";
import ModalDownloadMutasi from "components/Mutasi/ModalDownloadMutasi";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import ModalTambahTransaksi from "components/Shared/ModalTambahTransaksi/ModaTambahTransaksi";
import NewModalTambahTransaksi from "components/Shared/NewModalTambahTransaksi/NewModaTambahTransaksi";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt, FaFilter, FaPlus } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import { useDebounce } from "use-debounce";
import useRencana from "hooks/useRencanaKeuangan";
import { momentPackage } from "utilities/HelperUtils";
import useUser from "hooks/useUser";
import ModalAprovalPerencanaan from "components/Keuangan/PerencanaanKeuangan/ModalAprovalPerencanaan";
import ListTransaksiRencana2 from "components/Keuangan/PerencanaanKeuangan/ListTransaksi2";
import Dropdown from "components/Shared/Dropdown/Dropdown";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const { RangePicker } = DatePicker;

const index = ({ id }) => {
  const router = useRouter();
  const { user } = useUser();
  const { rencana } = useRencana();

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
  const [tipe, setTipe] = useState("");
  const [date, setDate] = useState([]);
  const [labels, setLabels] = useState([]);
  const [grafikData, setGrafikData] = useState([]);
  const [rekeningSekolah, setRekeningSekolah] = useState([]);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [akunKecil, setAkunKecil] = useState([]);
  const [collapseOpen, setcollapseOpen] = useState(false);
  const [kategori, setKategori] = useState({});
  const [tipeAkun, setTipeAkun] = useState({});
  const [status, setStatus] = useState();
  // console.log(grafikData);

  const firstRender = useRef(true);

  const listDropdownValue = [
    {
      label: "Semua",
      value: "",
    },
    {
      label: "pengeluaran",
      value: "debit",
    },
    {
      label: "pemasukan",
      value: "kredit",
    },
  ];
  const listDropdownStatusValue = [
    {
      label: "Semua Status",
      value: "",
    },
    {
      label: "Ditolak",
      value: "0",
    },
    {
      label: "Diproses",
      value: "3",
    },
    {
      label: "Diterima",
      value: "1",
    },
  ];
  const changeStatus = (value) => {
    setStatus(value);
  };

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
    const dariTanggal = router.query?.dariTanggal,
      sampaiTanggal = router.query?.sampaiTanggal;
    const payload = {
      ...router.query,
      search: searchTransaksi,
      filterGrafik,
      page: page,
      kategori: kategori.value,
      tipeAkun: tipeAkun.value,
      status: 1,
    };
    if (!(dariTanggal && sampaiTanggal)) {
      toast.error("Harap memilih periode transaksi");
      return;
    }
    const { data, error } = await downloadTransaksiRencana(id, {
      tanggal_awal: dariTanggal,
      tanggal_akhir: sampaiTanggal,
      status: 1,
    });

    if (data) {
      setDownloaded(true);
      document.getElementById("downloadIframe").src = `${baseURL}${data}`;
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
      tipeAkun: tipeAkun?.value,
      status: 1,
    };

    const { data } = await getRencanaTransaksi(id, params);
    if (data) {
      setMutasiData(data);
      const label = [];
      const graphData = { pemasukan: [], pengeluaran: [] };
      setAkun(data?.akun);
      setKeuangan(data?.keuangan);
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
        const { data, error } = await deleteRencanaTransaksi(id);
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
        ? momentPackage(date?.[0])
            .startOf("month")
            .format("YYYY-MM-DD HH:mm:ss")
        : "",
      sampaiTanggal: date?.[1]
        ? momentPackage(date?.[1]).endOf("month").format("YYYY-MM-DD HH:mm:ss")
        : "",
    };

    // delete queryParams if value is null
    Object.keys(queryParams)?.map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: `${ssURL}/perencanaan-keuangan/${id}/rencana`,
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

  useEffect(() => {
    let temp = [];
    if (akun?.length) {
      const template = JSON.parse(keuangan?.template || "[]");
      function recursive(data) {
        data.map((d) => {
          const akunKecil = akun?.find((e) => e?.id == d?.id);

          if (akunKecil) {
            if (d?.children?.length) {
              recursive(d?.children);
            } else {
              temp.push(akunKecil);
            }
          }
        });
      }
      recursive(template);
    }
    setAkunKecil(temp);
    // console.log(temp);
  }, [akun, keuangan]);

  return (
    <Layout>
      <AnimatePage>
        <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
        <HeaderPerencanaanKeuangan ssURL={ssURL} id={id} user={user} />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar Rencana Anggaran
                  </h4>
                </div>
                <hr className="my-4" />
                <div className="d-flex jusitfy-content-start align-items-lg-center flex-lg-row flex-column mb-4 mx-4">
                  <input
                    type="text"
                    className="form-control form-search flex-grow-1 rounded-pill fs-14-ss fw-semibold border-secondary-ss me-lg-3 mb-lg-0 mb-3 lg-w-100"
                    style={{ height: "42px" }}
                    id="exampleFormControlInput1"
                    placeholder="Cari Perencanaan"
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
                    Rekap Rencana
                  </button>
                </div>
                <div className="collapse mx-4" id="collapseExample">
                  {user.bagian != "aproval" ? (
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <RangePicker
                          className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi"
                          value={
                            router.query?.dariTanggal
                              ? [
                                  momentPackage(router.query?.dariTanggal),
                                  momentPackage(router.query?.sampaiTanggal),
                                ]
                              : ""
                          }
                          style={{
                            height: "42px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                          }}
                          picker="month"
                          placeholder={["Bulan Awal", "Bulan Akhir"]}
                          disabledDate={(current) => {
                            return (
                              current < momentPackage(rencana?.tanggalAwal) ||
                              current > momentPackage(rencana?.tanggalAkhir)
                            );
                          }}
                          onChange={(date) => handleChangeDate(date)}
                        />
                      </div>
                      <div className="col-md-4 mb-4">
                        <div className="select-akun-keuangan">
                          <SelectShared
                            options={akunKecil?.map((d) => {
                              return {
                                label: `${d?.nama}`,
                                value: d?.id,
                              };
                            })}
                            value={tipeAkun?.value}
                            handleChangeSelect={changeTipeAkun}
                            isClearable
                            className="w-100"
                            isDropdownMutasi
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-4">
                        <Dropdown
                          listValue={listDropdownStatusValue}
                          defaultValue={status?.label || "Semua Status"}
                          onChange={changeStatus}
                          className="w-100"
                          isDropdownMutasi
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <RangePicker
                          className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi"
                          value={
                            router.query?.dariTanggal
                              ? [
                                  momentPackage(router.query?.dariTanggal),
                                  momentPackage(router.query?.sampaiTanggal),
                                ]
                              : ""
                          }
                          style={{
                            height: "42px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                          }}
                          picker="month"
                          placeholder={["Bulan Awal", "Bulan Akhir"]}
                          disabledDate={(current) => {
                            return (
                              current < momentPackage(rencana?.tanggalAwal) ||
                              current > momentPackage(rencana?.tanggalAkhir)
                            );
                          }}
                          onChange={(date) => handleChangeDate(date)}
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="select-akun-keuangan">
                          <SelectShared
                            options={akunKecil?.map((d) => {
                              return {
                                label: `${d?.nama}`,
                                value: d?.id,
                              };
                            })}
                            value={tipeAkun?.value}
                            handleChangeSelect={changeTipeAkun}
                            isClearable
                            className="w-100"
                            isDropdownMutasi
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body p-0 pb-4">
                {loading && <Skeleton count={3} height={50} />}
                {!loading && (
                  <div className="table-responsive">
                    <table className="table-ss table-mutasi">
                      <thead>
                        <tr>
                          <th>Bulan</th>
                          {!user?.bagian ||
                          user?.bagian == "keuangan" ||
                          user?.bagian == "yayasan" ? (
                            <th>Status</th>
                          ) : (
                            <></>
                          )}
                          <th style={{ width: "30%" }}>
                            Keterangan Rencana Anggaran
                          </th>
                          <th>Akun</th>
                          <th>Debit</th>
                          <th>Kredit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listMutasi?.data?.map((d) => {
                          return (
                            <ListTransaksiRencana2
                              data={d}
                              setEditData={setEditData}
                              _deleteMutasi={_deleteMutasi}
                              isRencanaKeuangan
                              user={user}
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
        <ModalTambahTransaksi
          _getMutasi={_getMutasi}
          editData={editData}
          rekeningSekolah={rekeningSekolah}
        />
        <ModalDownloadMutasi />
        <NewModalTambahTransaksi
          akun={akunKecil}
          editData={editData}
          _getMutasi={_getMutasi}
        />
        <ModalTambahPerencanaan
          akun={akunKecil}
          editData={editData}
          _getMutasi={_getMutasi}
          id={id}
        />
        <ModalAprovalPerencanaan
          akun={akunKecil}
          editData={editData}
          _getMutasi={_getMutasi}
          id={id}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
