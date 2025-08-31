import { getGeneratePenyusutan } from "client/InventarisClient";
import CardPerencanaanDanRealisasi from "components/Keuangan/CardPerencanaanDanRealisasi";
import GrafikSaldo from "components/Rekening/GrafikSaldo";
import ListRekening from "components/Rekening/ListRekening";
import SaldoTotal from "components/Rekening/SaldoTotal";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaCloudUploadAlt, FaPen, FaPlus } from "react-icons/fa";
import { getRekeningSekolah } from "../../client/RekeningSekolahClient";
import {
  currencyFormatter,
  formatAngkaUang,
} from "../../utilities/HelperUtils";
import ModalTambahRekening from "../Shared/ModalTambahRekening/ModalTambahRekening";
import MyJoyride from "../Shared/MyJoyride/MyJoyride";
import BerandaKeuanganSkeleton from "../Shared/Skeleton/BerandaKeuanganSkeleton";

// testing purpose

const KeuanganDashboard = () => {
  const [rekeningSekolah, setRekeningSekolah] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { totalPemasukkan, totalPengeluaran, totalSaldo, rekSekolah } =
    rekeningSekolah || {};

  const _getRekeningSekolah = async () => {
    setLoading(true);
    await getGeneratePenyusutan();
    const { data } = await getRekeningSekolah();
    if (data) {
      setRekeningSekolah(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getRekeningSekolah();
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
                    <ListRekening data={item} edit={false} dashboard={true} />
                  );
                })}
              </div>
            </div>
          </div>
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
