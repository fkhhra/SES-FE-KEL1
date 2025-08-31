import { HorizontalBar } from "react-chartjs-2";

const AnalisisUjian = ({ analisisData, ta, pesertaUjian }) => {
  let kd = [];
  let nilai = [];

  if (analisisData) {
    analisisData?.map((data) => {
      kd.push(
        `${
          (pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat == "X" &&
            ta?.tingkat1 == "2013") ||
          (pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat == "XI" &&
            ta?.tingkat2 == "2013") ||
          (pesertaUjian?.jadwalUjian?.jadwalUjian?.ujian?.tingkat == "XII" &&
            ta?.tingkat3 == "2013")
            ? "KD / CP"
            : "Elemen"
        } ${data.kd}`
      );
      nilai.push(data.nilai);
    });
  }

  const data = {
    labels: kd,
    datasets: [
      {
        label: "Ujian",
        data: nilai,
        backgroundColor: "rgba(8, 105, 223, 0.3)",
      },
      // {
      //   label: 'Remedial',
      //   data: [70, 40, 30, 80, 20, 50],
      //   backgroundColor: 'rgba(247, 59, 17, 0.5)',
      // },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
          },
        },
      ],
    },
  };

  return (
    <div>
      <div className="card card-ss">
        <div className="card-body p-4 ">
          <h4 className="fw-bold color-dark">Analisis Ujian</h4>
          <HorizontalBar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AnalisisUjian;
