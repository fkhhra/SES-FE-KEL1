import { getArusLaporanNeraca } from "client/ArusKasClient";
import { getGeneratePenyusutan } from "client/InventarisClient";
import { getLaba } from "client/LabaRugiClient";
import { getNeraca } from "client/NeracaClient";
import { getTotalTunggakan } from "client/TunggakanClient";
import CardPerencanaanDanRealisasi from "components/Keuangan/CardPerencanaanDanRealisasi";
import GrafikSaldo from "components/Rekening/GrafikSaldo";
import ListRekening from "components/Rekening/ListRekening";
import SaldoTotal from "components/Rekening/SaldoTotal";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaCloudUploadAlt, FaPen, FaPlus } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import {
  arusKasHitungLevelAkun,
  hitungKategoriArus,
  hitungKategoriLabaRugi,
  hitungKategoriNeraca,
  hitungLabaRugiArus,
  hitungRumusArus,
  labaRugiHitungLevelAkun,
  neracaHitungLevelAkun,
  _getLabaKumulatif,
  _getLabaKumulatifRencana,
} from "utilities/KeuanganUtils";
import { getRekeningSekolah } from "../../client/RekeningSekolahClient";
import {
  currencyFormatter,
  formatAngkaTitik,
  formatAngkaUang,
} from "../../utilities/HelperUtils";
import ModalTambahRekening from "../Shared/ModalTambahRekening/ModalTambahRekening";
import MyJoyride from "../Shared/MyJoyride/MyJoyride";
import BerandaKeuanganSkeleton from "../Shared/Skeleton/BerandaKeuanganSkeleton";
import useUser from "../../hooks/useUser";

// testing purpose

const KeuanganDashboard = () => {
  const [rekeningSekolah, setRekeningSekolah] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [labaAkumulasi, setLabaAkumulasi] = useState({});
  const [totalSiswa, setTotalSiswa] = useState(null);
  const [hps, setHps] = useState(null);
  const [taAktif, setTaAktif] = useState({});
  const [rencana, setRencana] = useState({});
  const { user, setUser } = useUser();
  const { totalPemasukkan, totalPengeluaran, totalSaldo, rekSekolah } =
    rekeningSekolah || {};
  const _getLaba = async () => {
    const { data } = await getLaba({});

    if (data) {
      // setRumus(data?.rumus);
      // setKeuangan(data?.keuangan);
      // setAkun(data?.akun);
      setRencana(data?.rencana);
      setTaAktif(data?.taaktif);
      setTotalSiswa(data?.totalSiswa);

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = labaRugiHitungLevelAkun(
        data?.akun,
        template,
        "jurnal",
        1,
        data?.dataAkunPendapatan
      );
      // setLevelAkun(hasil);
      // setTotalSiswa(data?.totalSiswa);

      const kategori = hitungKategoriLabaRugi(
        data?.kategori,
        hasil,
        data?.akun,
        1
      );
      // setLaba(kategori?.kategori);

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
        if (rumusLaba.find((e) => e.id == "siswa")?.id) {
          return { tipe: "hps", totalLabaRugi, totalLabaRugiRencana };
        }
        return { totalLabaRugi, totalLabaRugiRencana };
      });
      // setHasilRumus([...hasilRumus]);
      setHps(hasilRumus.find((e) => e?.tipe == "hps"));

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
      // setAllRumus([...temp]);
    }
  };

  const [neraca, setNeraca] = useState([]);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [levelAkun, setLevelAkun] = useState([]);
  const [rumusLabaRugi, setRumusLabaRugi] = useState([]);
  const [arus, setArus] = useState([]);
  const [hasilRumus, setHasilRumus] = useState({});
  const [debounceHasilRumus] = useDebounce(hasilRumus, 300);
  const [dataNeraca, setDataNeraca] = useState([]);
  const [tunggakan, setTunggakan] = useState({});

  const _getNeraca = async () => {
    const { data } = await getNeraca({});

    if (data) {
      // setAkun(data?.akun);
      // setKeuangan(data?.keuangan);
      // setRumusLabaRugi(data?.rumusLaba);
      const dataKumulatif = await _getLabaKumulatif();
      // search,
      // tanggalAwal,
      // tanggalAkhir

      const dataKumulatifRencana = await _getLabaKumulatifRencana(
        // search,
        // tanggalAwal,
        // tanggalAkhir,
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
      // setLevelAkun(hasil);

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
      setDataNeraca(kategori?.filter((d) => d?.tipe == "aktiva"));
      // setNeraca(kategori);
      // setRencana(data?.rencana);
    }
  };

  const _getArus = async () => {
    const { data, error } = await getArusLaporanNeraca({
      // tanggalAwal,
      // tanggalAkhir,
      // search,
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

      const kumulatifData2 = await _getLabaKumulatif();
      // search,
      // tanggalAwal,
      // tanggalAkhir

      const kumulatifData3 = await _getLabaKumulatifRencana(
        // search,
        // tanggalAwal,
        // tanggalAkhir,
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
      // setArus(kategori);

      const nilaiAkhir = hitungRumusArus(
        data?.rumus,
        kategori,
        hasil,
        data?.tipeAkun,
        1
      );
      setHasilRumus(nilaiAkhir);
    } else {
      // toast.error(error?.message);
    }
  };
  useEffect(() => {
    _getArus();
  }, []);

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
  const _getRekeningSekolah = async () => {
    setLoading(true);
    await getGeneratePenyusutan();
    const { data } = await getRekeningSekolah();
    const { data: tunggakanData } = await getTotalTunggakan();
    if (data) {
      setRekeningSekolah(data);
    }
    if (tunggakanData) {
      setTunggakan(tunggakanData);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getRekeningSekolah();
    _getLaba();
    _getNeraca();
  }, []);

  const data = {
    labels: rekSekolah?.map(
      (d) => `${d?.jenis || "Dana sekolah"} - ${d?.bank}`
    ),
    datasets: [
      {
        label: "saldo",
        data: rekSekolah?.map((d) => d?.saldo + d?.pemasukan - d?.pengeluaran),
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    legend: {
      position: "right",
      align: "center",
      labels: {
        fontSize: 14,
      },
    },
    maintainAspectRatio: true,
    layout: { padding: { right: 110 } },
    tooltips: {
      callbacks: {
        title: function (tooltipItem, data) {
          return "Total pemasukan";
        },
        label: function (tooltipItem, data) {
          return `Rp${formatAngkaUang(
            data["datasets"][0]["data"][tooltipItem["index"]]
          )}`;
        },
        afterLabel: function (tooltipItem, data) {
          var dataset = data["datasets"][0];
          var percent = Math.round(
            (dataset["data"][tooltipItem["index"]] / totalSaldo) * 100
          );
          return "(" + percent + "%)";
        },
      },
      titleFontSize: 16,
      titleFontColor: "#0066ff",
      bodyFontSize: 14,
      displayColors: false,
      bodyAlign: "center",
      titleAlign: "center",
    },
  };

  const steps = [
    {
      target: '[data-joyride="tambah-card-rekening"]',
      content: "Text 1",
      disableBeacon: true,
    },
    {
      target: '[data-joyride="card-rekening"]',
      content: "Text 1",
    },
    {
      target: '[data-joyride="total-saldo"]',
      content: "Text 1",
    },
    {
      target: '[data-joyride="total-pemasukan"]',
      content: "Text 1",
    },
    {
      target: '[data-joyride="total-pengeluaran"]',
      content: "Text 1",
    },
  ];

  const persentaseTunggakan = (
    ((tunggakan?.totalTunggakan - tunggakan?.totalDibayar) * 100) /
    tunggakan?.totalTunggakan
  ).toFixed(1);
  console.log(tunggakan);
  456693000;
  2100000;
  return (
    <div>
      <MyJoyride steps={steps} />
      {loading && (
        <div>
          <BerandaKeuanganSkeleton />
        </div>
      )}
      {!loading && (
        <>
          {user?.mSekolahId == 13 ||
          user?.mSekolahId == 8468 ||
          user?.mSekolahId == 8731 ||
          user?.mSekolahId == 8780 ||
          user?.mSekolahId == 8858 ||
          user?.mSekolahId == 8880 ||
          user?.mSekolahId == 8885 ||
          user?.mSekolahId == 8940 ||
          user?.mSekolahId == 9078 ? (
            <div className="row mb-4">
              {/* <GrafikSaldo data={data} options={options} /> */}
              <div className="col-lg-5 mb-lg-0 mb-4">
                {/* Add Kartu Rekening Start */}
                <div className="card card-ss rounded-ss p-0 h-100">
                  <div
                    className="card-header-ss bg-soft-primary p-4 py-3"
                    style={{
                      backgroundImage: "url('/img/bg-card-saldo-rekening.svg')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                      backgroundSize: "contain",
                    }}
                  >
                    <h5 className="title-border fw-extrabold color-dark mb-0">
                      {taAktif?.tahun} -{" "}
                      {taAktif?.semester == "1" || taAktif?.semester == "Ganjil"
                        ? "Ganjil"
                        : "Genap"}
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    {/* <div className="row d-flex justify-content-between">   */}
                    {/* <div className="col-6"> */}
                    <table className="w-100">
                      <tr>
                        <td className="w-100">
                          <div className="text-secondary fw-bold mb-2">
                            Jenis
                          </div>
                        </td>
                        <td>
                          <div className="text-secondary fw-bold mb-2">
                            Jumlah
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-100">
                          <div className="mb-2">Total Siswa</div>
                        </td>
                        <td>
                          {" "}
                          <div className="text-primary fw-bold mb-2">
                            {totalSiswa}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-100">
                          <div className="mb-2">HPS</div>
                        </td>
                        <td>
                          <div className="text-primary fw-bold mb-2">
                            Rp{formatAngkaTitik(hps?.totalLabaRugi)}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-100">
                          <div className="mb-2">Tunggakan</div>
                        </td>
                        <td>
                          <div className="text-primary fw-bold mb-2">
                            {persentaseTunggakan}%
                          </div>
                        </td>
                      </tr>
                    </table>
                    {/* <div className="text-secondary fw-bold mb-2">Jenis</div>
                      <div className="mb-2">Total Siswa</div>
                      <div className="mb-2">HPS</div>
                      <div className="mb-2">Tunggakan</div> */}
                    {/* </div> */}
                    {/* <div className="d-flex justify-content-center"> */}
                    {/* <div className="col-4">
                      <div className="text-secondary fw-bold mb-2">Jumlah</div>
                      <div className="text-primary fw-bold mb-2">
                        {totalSiswa}
                      </div>
                      <div className="text-primary fw-bold mb-2">
                        Rp{formatAngkaTitik(hps?.totalLabaRugi)}
                      </div>
                      <div className="text-primary fw-bold mb-2">
                        {persentaseTunggakan}%
                      </div>
                    </div> */}
                    {/* </div> */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
              <CardPerencanaanDanRealisasi
                labaAkumulasi={labaAkumulasi}
                rencana={rencana}
                dataNeraca={dataNeraca}
              />
            </div>
          ) : (
            <>
              <div className="row mb-4">
                <GrafikSaldo data={data} options={options} />
                <SaldoTotal
                  totalPemasukkan={totalPemasukkan}
                  totalPengeluaran={totalPengeluaran}
                  totalSaldo={totalSaldo}
                />
                {/* <CardPerencanaanDanRealisasi /> */}
              </div>
              <div className="row">
                <div className="card card-ss rounded-ss p-0">
                  <div
                    className="card-header-ss bg-soft-primary p-4"
                    style={{
                      backgroundImage: "url('/img/bg-card-akun-rekening.svg')",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right center",
                      backgroundSize: "contain",
                    }}
                  >
                    <h5 className="title-border fw-extrabold color-dark mb-0">
                      Akun Rekening
                    </h5>
                  </div>
                  <div className="card-body">
                    {rekSekolah?.map((item) => {
                      return (
                        <ListRekening
                          data={item}
                          edit={false}
                          dashboard={true}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <ModalTambahRekening
        editData={editData}
        _getRekeningSekolah={_getRekeningSekolah}
      />
    </div>
  );
};

export default KeuanganDashboard;
