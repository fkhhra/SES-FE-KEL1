import { DatePicker } from "antd";
import { downloadLaba, getLaba } from "client/LabaRugiClient";
import HeaderLaporanLabaRugi from "components/Keuangan/HeaderLaporanLabaRugi";
import ListLabaRugi from "components/Keuangan/ListLabaRugi";
import LayoutDetail from "components/Layout/LayoutDetail";
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
import { baseURL, ssURL } from "../../../../../client/clientAxios";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import Dropdown from "../../../../../components/Shared/Dropdown/Dropdown";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAkhir, tanggalAwal, search, tipeData }) => {
  const { user, setUser } = useUser();
  const [laba, setLaba] = useState([]);
  const [rumus, setRumus] = useState([]);
  const [allRumus, setAllRumus] = useState([]);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [hasilRumus, setHasilRumus] = useState(0);
  const [levelAkun, setLevelAkun] = useState([]);
  const [rencana, setRencana] = useState();
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);
  const [labaAkumulasi, setLabaAkumulasi] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);

  const _getLaba = async () => {
    const { data } = await getLaba({ search, tanggalAwal, tanggalAkhir });

    if (data) {
      setRumus(data?.rumus);
      setKeuangan(data?.keuangan);
      setAkun(data?.akun);
      setRencana(data?.rencana);

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = labaRugiHitungLevelAkun(
        data?.akun,
        template,
        "jurnal",
        1,
        data?.dataAkunPendapatan
      );
      setLevelAkun(hasil);
      console.log(hasil);
      setTotalSiswa(data?.totalSiswa);

      const kategori = hitungKategoriLabaRugi(
        data?.kategori,
        hasil,
        data?.akun,
        1
      );
      setLaba(kategori?.kategori);
      console.log(kategori);

      const hasilRumus = data?.rumus?.map((d) => {
        const rumusLaba = JSON.parse(d?.rumus || "[]");
        const totalLabaRugi = hitungLabaRugiArus(
          kategori?.kategori,
          hasil,
          rumusLaba,
          data?.akun,
          "total",
          0,
          data?.totalSiswa
        );
        const totalLabaRugiRencana = hitungLabaRugiArus(
          kategori?.kategori,
          hasil,
          rumusLaba,
          data?.akun,
          "totalRencana",
          0,
          data?.totalSiswa
        );
        return { totalLabaRugi, totalLabaRugiRencana };
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

      const labaKumulatifRencanaRumusId = parseInt(
        data?.akun?.find(
          (d) =>
            (d.kode == "00000" || d.kode == null) &&
            (d?.nama == "AKUMULATIF LABA (RUGI)" ||
              d?.nama == "KUMULATIF LABA (RUGI)")
        )?.rumusAkun?.rumus
      );
      const rumusLabaKumulatifRencana = JSON.parse(
        data?.rumus?.find((d) => d.id == labaKumulatifRencanaRumusId)?.rumus ||
          "[]"
      );
      const totalLabaRugiKumulatifRencana = hitungLabaRugiArus(
        kategori?.kategori,
        hasil,
        rumusLabaKumulatifRencana,
        data?.akun,
        "total",
        1
      );
      setLabaAkumulasi({
        totalLabaRugiKumulatif,
        totalLabaRugiKumulatifRencana,
      });

      const temp = [];
      data?.rumus?.map((d) => {
        temp.push(...JSON.parse(d?.rumus || "[]"));
      });
      setAllRumus([...temp]);
    }
  };
  console.log(labaAkumulasi);

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
          totalRencana: e?.totalRencana,
          kode: e?.akun?.kode,
        });
      });
      payloadData.push({
        nama: `TOTAL ${d?.nama}`,
        bold: true,
        level: 1,
        total: d?.total,
        totalRencana: d?.totalRencana,
      });
    });
    rumus?.map((d, idx) => {
      payloadData.push({
        nama: `${d?.nama}`,
        bold: true,
        level: 1,
        total: hasilRumus?.[idx]?.["totalLabaRugi"],
        totalRencana: hasilRumus?.[idx]?.["totalLabaRugiRencana"],
      });
    });
    const { data } = await downloadLaba({
      data: payloadData,
      rencana_id: rencana.id,
    });

    if (data) {
      window.open(`${baseURL}${data}`);
    }
  };
  useEffect(() => {
    _getLaba();
  }, [tanggalAwal, tanggalAkhir, search]);

  useEffect(() => {
    router.push({
      pathname: "/smartschool/laporan-keuangan/laba-rugi/data-laporan",
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

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/laporan-keuangan`}
      title={`Realisasi`}
    >
      <AnimatePage>
        <HeaderLaporanLabaRugi ssURL={ssURL} user={user} />
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
                    Rekap Laba Rugi
                  </button>
                </div>
                <div className="collapse mx-4" id="collapseExample">
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <DatePicker
                        onChange={(date, dateString) =>
                          router.push({
                            pathname:
                              "/smartschool/laporan-keuangan/laba-rugi/data-laporan",
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
                              "/smartschool/laporan-keuangan/laba-rugi/data-laporan",
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
                    <ListLabaRugi
                      data={laba}
                      rumus={rumus}
                      levelAkun={levelAkun}
                      hasilRumus={hasilRumus}
                      labaAkumulasi={labaAkumulasi}
                      totalSiswa={totalSiswa}
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
