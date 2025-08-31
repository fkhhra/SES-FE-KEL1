import { DatePicker } from "antd";
import { downloadNeraca } from "client/MutasiClient";
import { getNeraca } from "client/NeracaClient";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import ListAktivaNeraca from "components/Keuangan/ListAktivaNeraca";
import ListPasivaNeraca from "components/Keuangan/ListPasivaNeraca";
import LayoutDetail from "components/Layout/LayoutDetail";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import {
  arusKasHitungLevelAkun,
  hitungKategoriArus,
  hitungKategoriLabaRugi,
  hitungKategoriNeraca,
  hitungLabaRugiArus,
  hitungRumus,
  hitungRumusArus,
  labaRugiHitungLevelAkun,
  neracaHitungLevelAkun,
  _getLabaKumulatif,
  _getLabaKumulatifRencana,
} from "utilities/KeuanganUtils";
import { getArusLaporanNeraca as getArusLaporanNeracaRencana } from "client/LaporanRencanaClient";
import { baseURL, ssURL } from "../../../../../client/clientAxios";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import Dropdown from "../../../../../components/Shared/Dropdown/Dropdown";
import useUser from "hooks/useUser";
import { getArusLaporan, getArusLaporanNeraca } from "client/ArusKasClient";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAwal, tanggalAkhir, search, tipeData }) => {
  const { user } = useUser();
  const [neraca, setNeraca] = useState([]);
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [levelAkun, setLevelAkun] = useState([]);
  const [rumusLabaRugi, setRumusLabaRugi] = useState([]);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);
  const [rencana, setRencana] = useState();
  const [arus, setArus] = useState([]);
  const [hasilRumus, setHasilRumus] = useState({});
  const [debounceHasilRumus] = useDebounce(hasilRumus, 300);
  const _getNeraca = async () => {
    const { data } = await getNeraca({ tanggalAkhir, tanggalAwal, search });

    if (data) {
      setAkun(data?.akun);
      setKeuangan(data?.keuangan);
      setRumusLabaRugi(data?.rumusLaba);
      const dataKumulatif = await _getLabaKumulatif(
        search,
        tanggalAwal,
        tanggalAkhir
      );

      const dataKumulatifRencana = await _getLabaKumulatifRencana(
        search,
        tanggalAwal,
        tanggalAkhir,
        data?.rencana?.id
      );

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = neracaHitungLevelAkun(
        data?.akun,
        template,
        "jurnal",
        1,
        hasilRumus
      );
      setLevelAkun(hasil);

      const kategori = hitungKategoriNeraca(
        data?.kategori,
        hasil,
        data?.akun,
        template,
        data?.kategoriLabaRugi,
        1,
        data?.rumusLaba,
        dataKumulatif,
        dataKumulatifRencana
      );
      setNeraca(kategori);
      setRencana(data?.rencana);
    }
  };

  const _getArus = async () => {
    const { data, error } = await getArusLaporanNeraca({
      tanggalAwal,
      tanggalAkhir,
      search,
    });

    if (data) {
      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = arusKasHitungLevelAkun(
        data?.akun,
        template,
        "jurnal1",
        "jurnal2",
        1
      );

      const kumulatifData2 = await _getLabaKumulatif(
        search,
        tanggalAwal,
        tanggalAkhir
      );

      const kumulatifData3 = await _getLabaKumulatifRencana(
        search,
        tanggalAwal,
        tanggalAkhir,
        data?.rencana?.id
      );

      const kumulatifData = kumulatifData2?.hasilRumus.find(
        (d) =>
          d?.nama == "Laba/Rugi" ||
          d?.nama == "Laba Rugi" ||
          d?.nama == "LABA RUGI"
      )?.totalLabaRugi;

      const kumulatifDataRencana = kumulatifData3?.hasilRumus.find(
        (d) =>
          d?.nama == "Laba/Rugi" ||
          d?.nama == "Laba Rugi" ||
          d?.nama == "LABA RUGI"
      )?.totalLabaRugi;

      const kategori = hitungKategoriArus(
        data?.kategori,
        hasil,
        kumulatifData,
        1,
        kumulatifDataRencana
      );
      setArus(kategori);

      const nilaiAkhir = hitungRumusArus(
        data?.rumus,
        kategori,
        hasil,
        data?.tipeAkun,
        1
      );
      setHasilRumus(nilaiAkhir);
      // const { data: rencana, error } = await getArusLaporanNeracaRencana(
      //   data?.rencana?.id,
      //   {
      //     tanggalAwal,
      //     tanggalAkhir,
      //     search,
      //   }
      // );

      // if (rencana) {
      //   const kumulatifData3 = await _getLabaKumulatifRencana(
      //     search,
      //     tanggalAwal,
      //     tanggalAkhir,
      //     data?.rencana?.id
      //   );
      //   const kumulatifData11 = kumulatifData3?.hasilRumus.find(
      //     (d) => d?.nama == "Laba/Rugi"
      //   )?.totalLabaRugi;

      //   const template1 = JSON.parse(rencana?.keuangan?.template || "[]");
      //   const hasil1 = arusKasHitungLevelAkun(
      //     rencana?.akun,
      //     template1,
      //     "rencanaJurnal1",
      //     "rencanaJurnal2",
      //     0,
      //     rencana?.dataAkunPendapatan
      //   );

      //   const kategori1 = hitungKategoriArus(
      //     rencana?.kategori,
      //     hasil1,
      //     kumulatifData11,
      //     0
      //   );

      //   const nilaiAkhirRencana = hitungRumusArus(
      //     rencana?.rumus,
      //     kategori1,
      //     hasil1,
      //     rencana?.tipeAkun,
      //     0
      //   );

      //   // setHasilRumus(hasilrumus);
      //   setHasilRumus({
      //     kas: nilaiAkhir?.akhir,
      //     kasRencana: nilaiAkhirRencana?.akhir,
      //   });
      // }
    } else {
      // toast.error(error?.message);
    }
  };
  useEffect(() => {
    _getArus();
  }, [tanggalAwal, tanggalAkhir, search]);

  // console.log(neraca);

  const _rekap = async () => {
    const payloadData = [];
    ["aktiva", "pasiva"].map((d) => {
      let total = 0;
      let totalRencana = 0;
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
              totalRencana: f?.totalRencana,
              kode: f?.akun?.kode,
            });
          });
          payloadData.push({
            nama: `TOTAL ${e?.nama}`,
            bold: true,
            level: 2,
            total: e?.total,
            totalRencana: e?.totalRencana,
          });
          total += e?.total;
          totalRencana += e?.totalRencana;
        });
      payloadData.push({
        nama: `TOTAL ${d.toUpperCase()}`,
        bold: true,
        level: 1,
        total,
        totalRencana,
      });
    });
    const { data } = await downloadNeraca({
      data: payloadData,
      rencana_id: rencana.id,
      tanggal_akhir: router?.query?.tanggalAkhir,
      tanggal_awal: router?.query?.tanggalAwal,
    });

    if (data) {
      window.open(`${baseURL}${data}`);
    }
  };
  useEffect(() => {
    if (hasilRumus || hasilRumus == 0) {
      _getNeraca();
    }
  }, [debounceHasilRumus]);

  useEffect(() => {
    router.push({
      pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const [tipe, setTipe] = useState("");

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
  let totalSemuaRencana = [];

  // console.log(hasilRumus);

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/laporan-keuangan`}
      title={`Realisasi`}
    >
      <AnimatePage>
        <HeaderLaporanNeraca ssURL={ssURL} user={user} />
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
                  <button
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
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                    onClick={_rekap}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Neraca
                  </button>
                </div>
                <div className="collapse mx-4" id="collapseExample">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <DatePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname:
                              "/smartschool/laporan-keuangan/neraca/data-laporan",
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
                            pathname:
                              "/smartschool/laporan-keuangan/neraca/data-laporan",
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
                </div>
              </div>
              <div className="card-body p-0 pb-4">
                <table className="table-ss table-mutasi">
                  <thead>
                    <tr>
                      <th
                        style={{ width: "15%" }}
                        className="border-2 border-white border-start-0"
                        rowSpan={2}
                      >
                        No Akun
                      </th>
                      <th
                        style={{ width: "35%" }}
                        className="border-2 border-white"
                        rowSpan={2}
                      >
                        Nama Akun
                      </th>
                      <th
                        colSpan={2}
                        className="border-2 border-white p-2 text-center"
                      >
                        Perencanaan
                      </th>
                      <th
                        colSpan={2}
                        className="border-2 border-white border-end-0 p-2 text-center"
                      >
                        Realisasi
                      </th>
                    </tr>
                    <tr>
                      <th className="border-2 border-white p-2 text-center">
                        (Rp)
                      </th>
                      <th className="border-2 border-white p-2 text-center">
                        (Rp)
                      </th>
                      <th className="border-2 border-white p-2 text-center">
                        (Rp)
                      </th>
                      <th className="border-2 border-white border-end-0 p-2 text-center">
                        (Rp)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <ListAktivaNeraca
                      data={neraca?.filter((d) => d?.tipe == "aktiva")}
                      levelAkun={levelAkun}
                      totalSemua={totalSemua}
                      totalSemuaRencana={totalSemuaRencana}
                    />
                    <ListPasivaNeraca
                      data={neraca?.filter((d) => d?.tipe == "pasiva")}
                      levelAkun={levelAkun}
                      totalSemuaAktiva={0}
                      totalSemuaRencanaAktiva={0}
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
}) {
  return {
    props: {
      tanggalAwal: tanggalAwal || null,
      tanggalAkhir: tanggalAkhir || null,
      search: search || null,
      tipeData: tipe || null,
    },
  };
}

export default index;
