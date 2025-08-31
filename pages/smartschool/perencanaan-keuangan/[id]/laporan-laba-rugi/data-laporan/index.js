import { DatePicker } from "antd";
import { baseURL, ssURL } from "client/clientAxios";
import { downloadLaba, getLaba } from "client/LaporanRencanaClient";
import ListLabaRugi from "components/Keuangan/ListLabaRugi";
import ListLabaRugiNormal from "components/Keuangan/ListLabaRugiNormal";
import HeaderLaporanLabaRugiPerencanaanKeuangan from "components/Keuangan/PerencanaanKeuangan/HeaderLaporanLabaRugiPerencanaanKeuangan";
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
  hitungKategoriLabaRugi,
  hitungLabaRugiArus,
  labaRugiHitungLevelAkun,
} from "utilities/KeuanganUtils";

const { RangePicker } = DatePicker;

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAkhir, tanggalAwal, search, id, tipeData }) => {
  const { user } = useUser();
  const [laba, setLaba] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [keuangan, setKeuangan] = useState([]);
  const [akun, setAkun] = useState([]);
  const [levelAkun, setLevelAkun] = useState([]);
  const [hasilRumus, setHasilRumus] = useState([]);
  const [allRumus, setAllRumus] = useState([]);
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);
  const [labaAkumulasi, setLabaAkumulasi] = useState(0);

  const _getLaba = async () => {
    const { data } = await getLaba(id, { search, tanggalAwal, tanggalAkhir });

    if (data) {
      setRumus(data?.rumus);
      setKeuangan(data?.keuangan);
      setAkun(data?.akun);

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = labaRugiHitungLevelAkun(
        data?.akun,
        template,
        "rencanaJurnal",
        0,
        data?.dataAkunPendapatan
      );
      setLevelAkun(hasil);

      const kategori = hitungKategoriLabaRugi(
        data?.kategori,
        hasil,
        data?.akun
      );
      setLaba(kategori?.kategori);

      const hasilRumus = data?.rumus?.map((d) => {
        const rumusLaba = JSON.parse(d?.rumus || "[]");
        const totalLabaRugi = hitungLabaRugiArus(
          kategori?.kategori,
          hasil,
          rumusLaba,
          data?.akun
        );
        return totalLabaRugi;
      });
      setHasilRumus([...hasilRumus]);

      const labaKumulatifRumusId = parseInt(
        data?.akun?.find(
          (d) =>
            (d.kode == "00000" || d.kode == null) &&
            (d?.nama == "AKUMULATIF LABA (RUGI)" ||
              d?.nama == "KUMULATIF LABA (RUGI)")
        )?.rumusAkun?.rumus
      );
      const rumusLabaKumulatif = JSON.parse(
        data?.rumus?.find((d) => d.id == labaKumulatifRumusId)?.rumus || "[]"
      );
      const totalLabaRugiKumulatif = hitungLabaRugiArus(
        kategori?.kategori,
        hasil,
        rumusLabaKumulatif,
        data?.akun,
        "total",
        1
      );
      setLabaAkumulasi(totalLabaRugiKumulatif);
      console.log(hasil);

      const temp = [];
      data?.rumus?.map((d) => {
        temp.push(...JSON.parse(d?.rumus || "[]"));
      });
      setAllRumus([...temp]);
    }
  };

  const _rekap = async () => {
    const payloadData = [];
    laba?.map((d) => {
      payloadData.push({ nama: d?.nama, bold: true, level: 1 });
      d?.akunLabaRugi?.map((e) => {
        payloadData.push({
          nama: e?.akun?.nama,
          bold: false,
          level: 2,
          total: e?.total,
          kode: e?.akun?.kode,
        });
      });
      payloadData.push({
        nama: `TOTAL ${d?.nama}`,
        bold: true,
        level: 2,
        total: d?.total,
      });
    });
    rumus?.map((d, idx) => {
      payloadData.push({
        nama: `${d?.nama}`,
        bold: true,
        level: 1,
        total: hasilRumus[idx],
      });
    });
    const { data } = await downloadLaba({ data: payloadData });

    if (data) {
      window.open(`${baseURL}${data}`);
    }
  };
  useEffect(() => {
    _getLaba();
  }, [tanggalAwal, tanggalAkhir, search]);

  useEffect(() => {
    router.push({
      pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-laba-rugi/data-laporan`,
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);
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
  const { rencana } = useRencana();

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/perencanaan-keuangan/${id}/laporan`}
      title={rencana?.nama}
      id={id}
    >
      <AnimatePage>
        <HeaderLaporanLabaRugiPerencanaanKeuangan
          ssURL={ssURL}
          id={id}
          rencana={rencana}
          user={user}
        />
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Laba Rugi
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
                          pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-laba-rugi/data-laporan`,
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
                    Rekap Laba Rugi
                  </button>
                </div>
                {/* <div className="collapse mx-4" id="collapseExample">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <DatePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-laba-rugi/data-laporan`,
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
                            pathname: `/smartschool/perencanaan-keuangan/${id}/laporan-laba-rugi/data-laporan`,
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
                    <ListLabaRugiNormal
                      data={laba}
                      rumus={rumus}
                      levelAkun={levelAkun}
                      hasilRumus={hasilRumus}
                      labaAkumulasi={labaAkumulasi}
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
