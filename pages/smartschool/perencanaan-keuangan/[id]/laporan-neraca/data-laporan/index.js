import { DatePicker } from "antd";
import { baseURL, downloadURL, ssURL } from "client/clientAxios";
import { getArusLaporanNeraca, getNeraca } from "client/LaporanRencanaClient";
import { downloadNeraca } from "client/MutasiClient";
import ListAktivaNeracaNormal from "components/Keuangan/ListAktivaNeracaNormal";
import ListPasivaNeracaNormal from "components/Keuangan/ListPasivaNeracaNormal";
import HeaderLaporanNeracaPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderLaporanNeracaPerencanaanKeuangan";
import LayoutDetail from "components/Layout/LayoutDetail";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import useRencana from "hooks/useRencanaKeuangan";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import {
  arusKasHitungLevelAkun,
  detailRencana,
  hitungKategoriArus,
  hitungKategoriNeraca,
  hitungRumusArus,
  neracaHitungLevelAkun,
  _getLabaKumulatifRencana,
} from "utilities/KeuanganUtils";

const { RangePicker } = DatePicker;

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAwal, tanggalAkhir, search, id, tipeData }) => {
  const { user } = useUser();
  const [neraca, setNeraca] = useState([]);
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [levelAkun, setLevelAkun] = useState([]);
  const [rumusLabaRugi, setRumusLabaRugi] = useState([]);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);
  const [arus, setArus] = useState([]);
  const [hasilRumus, setHasilRumus] = useState(null);
  const [debounceHasilRumus] = useDebounce(hasilRumus, 300);

  const _getNeraca = async () => {
    const { data } = await getNeraca({ tanggalAkhir, tanggalAwal, search }, id);

    if (data) {
      setAkun(data?.akun);
      setKeuangan(data?.keuangan);
      setRumusLabaRugi(data?.rumusLaba);

      const dataKumulatif = await _getLabaKumulatifRencana(
        search,
        tanggalAwal,
        tanggalAkhir,
        id
      );
      console.log(hasilRumus);

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = neracaHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal",
        0,
        hasilRumus
      );
      setLevelAkun(hasil);
      console.log(hasil);

      const kategori = hitungKategoriNeraca(
        data?.kategori,
        hasil,
        data?.akun,
        template,
        data?.kategoriLabaRugi,
        0,
        data?.rumusLaba,
        dataKumulatif
      );
      setNeraca(kategori);
      console.log(kategori);
    }
  };
  useEffect(() => {
    _getArus();
  }, [tanggalAwal, tanggalAkhir, search]);

  const _getArus = async () => {
    const { data, error } = await getArusLaporanNeraca(id, {
      tanggalAwal,
      tanggalAkhir,
      search,
    });

    if (data) {
      const kumulatifData2 = await _getLabaKumulatifRencana(
        search,
        tanggalAwal,
        tanggalAkhir,
        id
      );
      const kumulatifData = kumulatifData2?.hasilRumus.find(
        (d) =>
          d?.nama == "Laba/Rugi" ||
          d?.nama == "LABA RUGI" ||
          d?.nama == "Laba Rugi"
      )?.totalLabaRugi;

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = arusKasHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal1",
        "rencanaJurnal2",
        0,
        data?.dataAkunPendapatan
      );

      const kategori = hitungKategoriArus(
        data?.kategori,
        hasil,
        kumulatifData,
        0
      );
      setArus(kategori);

      const hasilrumus = hitungRumusArus(
        data?.rumus,
        kategori,
        hasil,
        data?.tipeAkun,
        0
      );

      setHasilRumus(hasilrumus);
      // setHasilRumus(hasilrumus);
    } else {
      // toast.error(error?.message);
    }
  };

  const _rekap = async () => {
    const payloadData = [];
    ["aktiva", "pasiva"].map((d) => {
      let total = 0;
      payloadData.push({ nama: d.toUpperCase(), bold: true, level: 1 });
      neraca
        ?.filter((e) => e?.tipe == d)
        .map((e) => {
          payloadData.push({ nama: e?.nama, bold: true, level: 2 });
          e?.akunNeraca?.map((f) => {
            payloadData.push({
              nama: f?.akun?.nama,
              bold: false,
              level: 3,
              total: f?.total,
              kode: f?.akun?.kode,
            });
          });
          payloadData.push({
            nama: `TOTAL ${e?.nama}`,
            bold: true,
            level: 2,
            total: e?.total,
          });
          total += e?.total;
        });
      payloadData.push({
        nama: `TOTAL ${d.toUpperCase()}`,
        bold: true,
        level: 1,
        total,
      });
    });
    const { data } = await downloadNeraca({
      data: payloadData,
    });

    if (data) {
      window.open(`${downloadURL}${data}`);
    }
  };

  useEffect(() => {
    if (hasilRumus || hasilRumus == 0) {
      _getNeraca();
    }
  }, [debounceHasilRumus]);

  useEffect(() => {
    router.push({
      pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-neraca/data-laporan`,
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  const { rencana, setRencana } = useRencana();

  const _detailRencana = async () => {
    if (!rencana || rencana?.id != id) {
      const data = await detailRencana(id);
      setRencana(data);
    }
  };

  useEffect(() => {
    _detailRencana();
  }, [rencana]);

  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [tipe, setTipe] = useState(tipeData);

  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [collapseOpen, setcollapseOpen] = useState([]);

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

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
    if (!value.value) {
      router.push({
        pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
        query: "",
      });
    }
    if (value.value == "mingguan") {
      const tanggalBaru = (
        tanggalAwal
          ? momentPackage(tanggalAwal).add(1, "weeks")
          : momentPackage().endOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      const tanggalBaru2 = (
        tanggalAwal
          ? momentPackage(tanggalAwal)
          : momentPackage().subtract(1, "weeks").startOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      router.push({
        pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
        query: {
          ...router.query,
          tipe: value.value,
          tanggalAkhir: tanggalBaru,
          tanggalAwal: tanggalBaru2,
        },
      });
    }
    if (value.value == "bulanan") {
      const tanggalBaru = (
        tanggalAwal
          ? momentPackage(tanggalAwal).add(1, "months")
          : momentPackage().endOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      const tanggalBaru2 = (
        tanggalAwal
          ? momentPackage(tanggalAwal)
          : momentPackage().subtract(1, "months").startOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      router.push({
        pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
        query: {
          ...router.query,
          tipe: value.value,
          tanggalAkhir: tanggalBaru,
          tanggalAwal: tanggalBaru2,
        },
      });
    }
    if (value.value == "tahunan") {
      const tanggalBaru = (
        tanggalAwal
          ? momentPackage(tanggalAwal).add(1, "years")
          : momentPackage().endOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      const tanggalBaru2 = (
        tanggalAwal
          ? momentPackage(tanggalAwal)
          : momentPackage().subtract(1, "years").startOf("day")
      ).format("YYYY-MM-DD HH:mm:ss");
      router.push({
        pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
        query: {
          ...router.query,
          tipe: value.value,
          tanggalAkhir: tanggalBaru,
          tanggalAwal: tanggalBaru2,
        },
      });
    }
    setTipe(value.value);
  };
  let totalSemua = [];
  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/perencanaan-keuangan/${id}/laporan`}
      title={rencana?.nama}
    >
      <AnimatePage>
        <HeaderLaporanNeracaPerencanaanKeuangan
          ssURL={ssURL}
          id={id}
          user={user}
        />
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Neraca
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
                  <div className="py-2 rounded-pill bg-white fw-bold me-lg-3 mb-lg-0 mb-3 color-secondary">
                    <RangePicker
                      picker="month"
                      onChange={(date) =>
                        router.push({
                          pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-neraca/data-laporan`,
                          query: {
                            ...router.query,
                            tanggalAwal: date[0]
                              ? date[0]
                                  .startOf("month")
                                  .format("YYYY-MM-DD HH:mm:ss")
                              : "",
                            tanggalAkhir: date[1]
                              ? date[1]
                                  .endOf("month")
                                  .format("YYYY-MM-DD HH:mm:ss")
                              : "",
                          },
                        })
                      }
                      placeholder={["Bulan Awal", "Bulan Akhir"]}
                      value={[
                        tanggalAwal ? momentPackage(tanggalAwal) : "",
                        tanggalAkhir ? momentPackage(tanggalAkhir) : "",
                      ]}
                      className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                      // placeholder="Pilih Bulan Transaksi"
                    />
                  </div>
                  {/* <button
                    className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white fw-bold me-lg-3 mb-lg-0 mb-3 color-secondary ${
                      !collapseOpen && "active"
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
                  </button> */}
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
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                    onClick={_rekap}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Neraca
                  </button>
                </div>
                {/* <div className="collapse mx-4" id="collapseExample">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <DatePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-neraca/data-laporan`,
                            query: {
                              ...router.query,
                              tanggalAwal: dateString,
                              tanggalAkhir: tipe
                                ? momentPackage(dateString)
                                    .add(
                                      1,
                                      tipe == "tahunan"
                                        ? "years"
                                        : tipe == "bulanan"
                                        ? "months"
                                        : "weeks"
                                    )
                                    .format("YYYY-MM-DD 00:00:00")
                                : tanggalAkhir,
                            },
                          })
                        }
                        placeholder="Tanggal Awal"
                        className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                        autoComplete="off"
                        style={{
                          height: "42px",
                          paddingLeft: "14px",
                          paddingRight: "14px",
                        }}
                        value={tanggalAwal ? momentPackage(tanggalAwal) : ""}
                      />
                    </div>
                    <div className="col-md-4 mb-4">
                      <DatePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-neraca/data-laporan`,
                            query: {
                              ...router.query,
                              tanggalAkhir: dateString,
                            },
                          })
                        }
                        placeholder="Tanggal Akhir"
                        className="rounded-pill d-flex align-items-center w-100 date-picker-mutasi py-2"
                        autoComplete="off"
                        style={{
                          height: "42px",
                          paddingLeft: "14px",
                          paddingRight: "14px",
                        }}
                        value={tanggalAkhir ? momentPackage(tanggalAkhir) : ""}
                      />
                    </div>
                    <div className="col-md-4 mb-4">
                      <Dropdown
                        listValue={listDropdownValue}
                        defaultValue={
                          listDropdownValue?.find((item) => item.value == tipe)
                            ?.label
                        }
                        onChange={handleChangeDropdown}
                        className="w-100"
                        isDropdownMutasi
                      />
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="card-body p-0 pb-4">
                <table className="table-ss table-mutasi">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>No Akun</th>
                      <th style={{ width: "50%" }}>Nama Akun</th>
                      <th>(Rp)</th>
                      <th>(Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ListAktivaNeracaNormal
                      data={neraca?.filter((d) => d?.tipe == "aktiva")}
                      levelAkun={levelAkun}
                      totalSemua={totalSemua}
                    />
                    <ListPasivaNeracaNormal
                      data={neraca?.filter((d) => d?.tipe == "pasiva")}
                      levelAkun={levelAkun}
                      totalSemuaAktiva={totalSemua}
                    />
                  </tbody>
                </table>
                {/* <div className="my-4 text-center">
                  <Pagination
                    total={listMutasi?.total}
                    showSizeChanger={false}
                    current={parseInt(page) || 1}
                    pageSize={25}
                    onChange={(e) => setPage(e)}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  query: { tanggalAwal, tanggalAkhir, search, tipe },
  params: { id },
}) {
  return {
    props: {
      id: id || null,
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
      search: search || null,
      tipeData: tipe || null,
    },
  };
}

export default index;
