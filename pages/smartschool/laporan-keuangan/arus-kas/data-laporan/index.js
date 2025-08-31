import { DatePicker } from "antd";
import {
  getArusLaporan,
  getArusLaporanNeraca,
  rekapArus,
} from "client/ArusKasClient";
import HeaderLaporanArusKas from "components/Keuangan/HeaderLaporanArusKas";
import ListAktivitasArusKas from "components/Keuangan/ListAktivitasArusKas";
import ListAktivitasArusKasNormal from "components/Keuangan/ListAktivitasArusKasNormal";
import LayoutDetail from "components/Layout/LayoutDetail";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import {
  arusKasHitungLevelAkun,
  hitungKategoriArus,
  hitungKategoriLabaRugi,
  hitungLabaRugiArus,
  hitungRumus,
  hitungRumusArus,
  labaRugiHitungLevelAkun,
  _getLabaKumulatif,
} from "utilities/KeuanganUtils";
import { baseURL, ssURL } from "../../../../../client/clientAxios";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({
  tanggalAwal1,
  tanggalAkhir1,
  tanggalAwal2,
  tanggalAkhir2,
  search,
}) => {
  const { user } = useUser();
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);

  const [arus, setArus] = useState([]);
  const [rumus, setRumus] = useState({});
  const [tipeAkun, setTipeAkun] = useState([]);
  const [laba, setLaba] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [akun, setAkun] = useState([]);
  const [levelAkun, setLevelAkun] = useState([]);
  const [hasilRumus, setHasilRumus] = useState({});
  const [labaRugi, setLabaRugi] = useState(0);

  // useEffect(() => {
  //   _getLabaKumulatif();
  // }, [search]);

  const _getArus = async () => {
    const { data, error } = await getArusLaporan({
      tanggalAwal1,
      tanggalAkhir1,
      tanggalAwal2,
      tanggalAkhir2,
      search,
    });

    if (data) {
      setRumus(data?.rumus);
      setTipeAkun(data?.tipeAkun);
      setKeuangan(data?.keuangan);
      setAkun(data?.akun);
      setLaba(data?.labaRugi);

      const kumulatifData2 = await _getLabaKumulatif(
        search,
        tanggalAwal2,
        tanggalAkhir2
      );
      console.log(kumulatifData2);

      const kumulatifData = kumulatifData2?.hasilRumus.find(
        (d) => d?.nama == "Laba/Rugi"
      )?.totalLabaRugi;

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = arusKasHitungLevelAkun(
        data?.akun,
        template,
        "jurnal1",
        "jurnal2",
        1,
        data?.dataAkunPendapatan
      );
      setLevelAkun(hasil);

      const kategoriLabaRugi = data?.labaRugi?.map((labaRugi) => {
        const nilaiKategori = labaRugi?.akunLabaRugi?.reduce(
          (sebelum, akunLabaRugi) => {
            let nilaiAkun = 0;
            if (
              akunLabaRugi?.akun?.rumusAkun &&
              akunLabaRugi?.akun?.rumusAkun?.rumus != null &&
              akunLabaRugi?.akun?.rumusAkun?.rumus != "[]"
            ) {
              nilaiAkun = hitungRumus(
                akunLabaRugi?.akun?.rumusAkun?.rumus,
                hasil?.map((d) => {
                  return { id: d?.id, nilai: Math.abs(d?.total2) };
                })
              );
            } else {
              nilaiAkun = Math.abs(
                hasil.find((d) => d?.id == akunLabaRugi?.akun?.id)?.total2
              );
            }
            return sebelum + nilaiAkun;
          },
          0
        );

        return { ...labaRugi, nilaiKategori };
      });
      const rumusLaba = JSON.parse(data?.rumus?.rumuslabaRugi?.rumus || "[]");
      const totalLabaRugi = hitungRumus(
        data?.rumus?.rumuslabaRugi?.rumus,
        kategoriLabaRugi?.map((d) => {
          return { id: d?.id, nilai: d?.nilaiKategori };
        })
      );
      const labaRencana = hitungLabaRugiArus(
        data?.labaRugi,
        hasil,
        rumusLaba,
        "totalRencana1"
      );
      setLabaRugi(kumulatifData);

      const kategori = hitungKategoriArus(
        data?.kategori,
        hasil,
        kumulatifData,
        1,
        labaRencana
      );
      setArus(kategori);
      console.log(kategori);
      console.log(hasil);

      // const hasil1 = labaRugiHitungLevelAkun(data?.akun, template, "jurnal", 1);

      // const kategori1 = hitungKategoriLabaRugi(
      //   data?.labaRugi,
      //   hasil1,
      //   data?.akun,
      //   1
      // );
      const { data: ArusKasAjak, error } = await getArusLaporanNeraca({
        tanggalAwal: tanggalAwal1,
        tanggalAkhir: tanggalAkhir1,
        search,
      });
      let nilaiKasAwal;

      if (ArusKasAjak) {
        const template = JSON.parse(ArusKasAjak.keuangan?.template || "[]");
        const hasil = arusKasHitungLevelAkun(
          ArusKasAjak.akun,
          template,
          "jurnal1",
          "jurnal2",
          1
        );

        const kumulatifData2 = await _getLabaKumulatif(
          search,
          tanggalAwal1,
          tanggalAkhir1
        );

        const kumulatifData = kumulatifData2?.hasilRumus.find(
          (d) => d?.nama == "Laba/Rugi"
        )?.totalLabaRugi;

        const kategoriLabaRugi = ArusKasAjak.labaRugi?.map((labaRugi) => {
          const nilaiKategori = labaRugi?.akunLabaRugi?.reduce(
            (sebelum, akunLabaRugi) => {
              let nilaiAkun = 0;
              if (
                akunLabaRugi?.akun?.rumusAkun &&
                akunLabaRugi?.akun?.rumusAkun?.rumus != null &&
                akunLabaRugi?.akun?.rumusAkun?.rumus != "[]"
              ) {
                nilaiAkun = hitungRumus(
                  akunLabaRugi?.akun?.rumusAkun?.rumus,
                  hasil?.map((d) => {
                    return { id: d?.id, nilai: Math.abs(d?.total2) };
                  })
                );
              } else {
                nilaiAkun = Math.abs(
                  hasil.find((d) => d?.id == akunLabaRugi?.akun?.id)?.total2
                );
              }
              return sebelum + nilaiAkun;
            },
            0
          );

          return { ...labaRugi, nilaiKategori };
        });
        const rumusLaba = JSON.parse(
          ArusKasAjak.rumus?.rumuslabaRugi?.rumus || "[]"
        );
        const totalLabaRugi = hitungRumus(
          ArusKasAjak.rumus?.rumuslabaRugi?.rumus,
          kategoriLabaRugi?.map((d) => {
            return { id: d?.id, nilai: d?.nilaiKategori };
          })
        );
        const labaRencana = hitungLabaRugiArus(
          ArusKasAjak.labaRugi,
          hasil,
          rumusLaba,
          "totalRencana1"
        );

        const kategori = hitungKategoriArus(
          ArusKasAjak.kategori,
          hasil,
          kumulatifData,
          1,
          labaRencana
        );

        const hasil1 = labaRugiHitungLevelAkun(
          ArusKasAjak.akun,
          template,
          "jurnal",
          1
        );

        const kategori1 = hitungKategoriLabaRugi(
          ArusKasAjak.labaRugi,
          hasil1,
          ArusKasAjak.akun,
          1
        );

        const rumusLaba12 = JSON.parse(
          ArusKasAjak.rumus?.rumusAwal?.rumus || "[]"
        );
        const hasilrumus = hitungRumusArus(
          ArusKasAjak.rumus,
          kategori,
          hasil,
          ArusKasAjak.tipeAkun,
          1
        );
        // const totalLabaRugi11 = hitungLabaRugiArus(
        //   kategori1,
        //   hasil1,
        //   rumusLaba12,
        //   ArusKasAjak.akun
        // );
        let nilaiRumus = 0;
        const totalLabaRugi11 = rumusLaba12.map((d, idx, thisArray) => {
          if (d?.id) {
            // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
            let totalTipe = hasil?.find((e) => d?.id == e?.id)?.total1;

            if (idx == 0) {
              nilaiRumus += totalTipe;
            } else {
              if (thisArray[idx - 1]?.operator == "plus") {
                nilaiRumus += totalTipe;
              } else {
                nilaiRumus -= totalTipe;
              }
            }
          }
        });
        console.log(hasilRumus);

        const totalLabaRugi11Rencana = hitungLabaRugiArus(
          kategori1?.kategori,
          hasil1,
          rumusLaba12,
          ArusKasAjak.akun,
          "totalRencana"
        );

        nilaiKasAwal = hasilrumus?.akhir;
        // setHasilRumus(hasilRumus?.akhir);

        // console.log(hasilRumus);
        // console.log([totalLabaRugi11, totalLabaRugi11Rencana]);
      } else {
        // toast.error(error?.message);
      }
      console.log(nilaiKasAwal);

      const rumusLaba12 = JSON.parse(data?.rumus?.rumusAwal?.rumus || "[]");
      const hasilrumus = hitungRumusArus(
        data?.rumus,
        kategori,
        hasil,
        data?.tipeAkun,
        1,
        nilaiKasAwal
      );
      console.log(data?.rumus);
      // const totalLabaRugi11 = hitungLabaRugiArus(
      //   kategori1,
      //   hasil1,
      //   rumusLaba12,
      //   data?.akun
      // );
      let nilaiRumus = 0;
      const totalLabaRugi11 = rumusLaba12.map((d, idx, thisArray) => {
        if (d?.id) {
          // const index = dataSemuaAkun?.findIndex((e) => e?.id == d?.id);
          let totalTipe = hasil?.find((e) => d?.id == e?.id)?.total1;

          if (idx == 0) {
            nilaiRumus += totalTipe;
          } else {
            if (thisArray[idx - 1]?.operator == "plus") {
              nilaiRumus += totalTipe;
            } else {
              nilaiRumus -= totalTipe;
            }
          }
        }
      });

      if (!nilaiRumus) {
        nilaiRumus = 0;
      }
      // const totalLabaRugi11Rencana = hitungLabaRugiArus(
      //   kategori1?.kategori,
      //   hasil1,
      //   rumusLaba12,
      //   data?.akun,
      //   "totalRencana"
      // );
      setHasilRumus({
        ...hasilrumus,
        awal: nilaiKasAwal ? nilaiKasAwal : 0,
        awalRencana: 0,
      });
      // setHasilRumus({...hasilrumus}
      // );
    } else {
      // toast.error(error?.message);
    }
  };
  console.log(hasilRumus);

  const _rekap = async () => {
    let dataArus = [];
    arus.map((d) => {
      dataArus.push({
        nama: `ARUS KAS DARI AKTIVITAS ${d?.nama}`,
        bold: true,
        level: 1,
      });
      d?.tipeAkun?.map((e, index) => {
        dataArus.push({
          level: 2,
          bold: false,
          nama: e?.judul,
          total: e?.total,
        });
      });
      dataArus.push({
        nama: `TOTAL AKTIVITAS ${d?.nama}`,
        bold: true,
        level: 1,
        total: d?.total,
      });
    });
    dataArus.push(
      {
        nama: `KENAIKAN (PENURUNAN) KAS	`,
        bold: true,
        level: 1,
        total: hasilRumus?.kenaikan,
      },
      {
        nama: `SALDO KAS AWAL`,
        bold: true,
        level: 1,
        total: hasilRumus?.awal,
      },
      {
        nama: `SALDO KAS AKHIR`,
        bold: true,
        level: 1,
        total: hasilRumus?.akhir + hasilRumus?.awal,
      }
    );
    const payload = { rumus: hasilRumus, data: dataArus };
    const { data } = await rekapArus(payload);

    if (data) {
      window.open(`${baseURL}${data}`);
    }
  };

  useEffect(() => {
    _getArus();
  }, [search]);

  useEffect(() => {
    if (tanggalAwal1 && tanggalAkhir1 && tanggalAwal2 && tanggalAkhir2) {
      _getArus();
    }
  }, [tanggalAwal1, tanggalAkhir1, tanggalAwal2, tanggalAkhir2]);

  useEffect(() => {
    router.push({
      pathname: "/smartschool/laporan-keuangan/arus-kas/data-laporan",
      query: {
        ...router.query,
        search: debounceSearch,
      },
    });
  }, [debounceSearch]);

  // useEffect(() => {

  // }, [keuangan, akun]);

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
    setTipe(value.value);
  };

  return (
    <LayoutDetail
      bgMain={true}
      backProps={`${ssURL}/laporan-keuangan`}
      title={`Realisasi`}
    >
      <AnimatePage>
        <HeaderLaporanArusKas ssURL={ssURL} user={user} />
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss py-4 px-0 pb-0">
                <div className="d-flex justify-content-between align-items-md-center flex-md-row flex-column px-4">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Arus Kas
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
                    className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss`}
                    onClick={_rekap}
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Rekap Arus Kas
                  </button>
                </div>
                <div
                  className="row"
                  style={{
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                  id="peride-laporan"
                >
                  <div className="col-md-6">
                    <h6 className="mb-2 fw-bold color-dark">
                      Periode Laporan 1
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <DatePicker
                          onChange={(date, dateString) =>
                            router.push({
                              pathname:
                                "/smartschool/laporan-keuangan/arus-kas/data-laporan",
                              query: {
                                ...router.query,
                                tanggalAwal1: dateString,
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
                          value={
                            tanggalAwal1 ? momentPackage(tanggalAwal1) : ""
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <DatePicker
                          onChange={(date, dateString) =>
                            router.push({
                              pathname:
                                "/smartschool/laporan-keuangan/arus-kas/data-laporan",
                              query: {
                                ...router.query,
                                tanggalAkhir1: dateString,
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
                          value={
                            tanggalAkhir1 ? momentPackage(tanggalAkhir1) : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-2 fw-bold color-dark">
                      Periode Laporan 2
                    </h6>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <DatePicker
                          onChange={(date, dateString) =>
                            router.push({
                              pathname:
                                "/smartschool/laporan-keuangan/arus-kas/data-laporan",
                              query: {
                                ...router.query,
                                tanggalAwal2: dateString,
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
                          value={
                            tanggalAwal2 ? momentPackage(tanggalAwal2) : ""
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-4">
                        <DatePicker
                          onChange={(date, dateString) =>
                            router.push({
                              pathname:
                                "/smartschool/laporan-keuangan/arus-kas/data-laporan",
                              query: {
                                ...router.query,
                                tanggalAkhir2: dateString,
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
                          value={
                            tanggalAkhir2 ? momentPackage(tanggalAkhir2) : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!arus?.length ? (
                <div className="card-body p-4">
                  <div className="row justify-content-center">
                    <div className="col-md-6 col-sm-8 col-10 text-center">
                      <img
                        src="/img/empty-state-data.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-12 text-center">
                      <h4 className="color-dark fw-black mt-4 mb-2">
                        Tidak Ada Data
                      </h4>
                      <p className="fw-bold">
                        Atur{" "}
                        <a href="#peride-laporan" className="color-primary">
                          Periode Laporan
                        </a>{" "}
                        di atas untuk mendapatkan data Arus Kas
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-body p-0 pb-4">
                  <table className="table-ss table-mutasi">
                    <thead>
                      <tr>
                        <th style={{ width: "65%" }}>Nama Akun</th>
                        <th>(Rp)</th>
                        <th>(Rp)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ListAktivitasArusKasNormal
                        data={arus}
                        hasilRumus={hasilRumus}
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
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </LayoutDetail>
  );
};

export async function getServerSideProps({
  query: { tanggalAwal1, tanggalAkhir1, tanggalAwal2, tanggalAkhir2, search },
}) {
  return {
    props: {
      tanggalAwal1: tanggalAwal1 || null,
      tanggalAkhir1: tanggalAkhir1 || null,
      tanggalAwal2: tanggalAwal2 || null,
      tanggalAkhir2: tanggalAkhir2 || null,
      search: search || null,
    },
  };
}

export default index;
