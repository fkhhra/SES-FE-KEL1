import { Doughnut } from "react-chartjs-2";

const AnalisisJumlahPesertaDidikAlumni = ({
  jumlahBekerja,
  jumlahKuliah,
  jumlahBerwirausaha,
  jumlahMencariKerja,
  isLegendBottom,
  withTitle = true,
  containerStyle = {},
  maintainAspectRatio = true,
}) => {
  const data = {
    labels: ["Bekerja", "Kuliah", "Berwirausaha", "Mencari Kerja"],
    datasets: [
      {
        label: "# of Votes",
        data: [
          jumlahBekerja,
          jumlahBerwirausaha,
          jumlahKuliah,
          jumlahMencariKerja,
        ],
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    legend: {
      position: isLegendBottom ? "bottom" : "right",
      align: "center",
    },
    maintainAspectRatio: maintainAspectRatio,
  };

  return (
    <div>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default AnalisisJumlahPesertaDidikAlumni;
