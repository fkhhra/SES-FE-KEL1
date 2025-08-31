import { baseURL, downloadURL, ssURL } from "../../client/clientAxios";
import { useRouter } from "next/router";
import Navbar from "../Shared/Navbar/Navbar";
import AnalisisNilaiPengetahuan from "./AnalisisNilaiPengetahuan";
import AnalisisNilaiSikap from "./AnalisisNilaiSikap";
import AnalisisPerformaTugas from "./AnalisisPerformaTugas/AnalisisPerformaTugas";
import Skeleton from "react-loading-skeleton";
import { downloadAnalisis, downloadAnalisisSikap } from "client/RombelClient";

const AnalisisNilaiPage = ({
  analisisNilai,
  judulTugas,
  loading,
  jadwalMengajar,
  subnavLink,
}) => {
  const {
    query: { subnav, id },
  } = useRouter();

  const navItems = [
    {
      url: subnavLink?.pengetahuan
        ? subnavLink?.pengetahuan
        : `${ssURL}/rombel/${id}?nav=analisis-nilai&subnav=pengetahuan`,
      text: "Pengetahuan",
      active: subnav == "pengetahuan" || !subnav,
    },
    {
      url: subnavLink?.sikap
        ? subnavLink?.sikap
        : `${ssURL}/rombel/${id}?nav=analisis-nilai&subnav=sikap`,
      text: "Sikap",
      active: subnav == "sikap",
    },
  ];

  const downloadAnalisisNilai = async (tipe) => {
    const { data } = tipe == "nilai-pengetahuan" ? await downloadAnalisis(id) : await downloadAnalisisSikap(id);

    if (data) {
      window.open(`${downloadURL}/${data}`, "_blank");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">
        <Navbar nav={navItems} />

        {loading ? (
          <Skeleton count={3} height={50} />
        ) : subnav === "pengetahuan" || !subnav ? (
          <AnalisisNilaiPengetahuan
            analisisNilai={analisisNilai}
            judulTugas={judulTugas}
            downloadAnalisisNilai={downloadAnalisisNilai}
            jadwalMengajar={jadwalMengajar}
          />
        ) : subnav === "sikap" ? (
          <AnalisisNilaiSikap
            analisisNilai={analisisNilai}
            judulTugas={judulTugas}
            downloadAnalisisNilai={downloadAnalisisNilai}
          />
        ) : null}

        {/* <AnalisisPerformaTugas judulTugas={judulTugas} /> */}
      </div>
    </div>
  );
};

export default AnalisisNilaiPage;
