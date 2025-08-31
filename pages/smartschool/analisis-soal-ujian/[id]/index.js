import { DatePicker } from "antd";
import { downloadNeraca } from "client/MutasiClient";
import { getNeraca } from "client/NeracaClient";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import ListAktivaNeraca from "components/Keuangan/ListAktivaNeraca";
import ListPasivaNeraca from "components/Keuangan/ListPasivaNeraca";
import Layout from "components/Layout/LayoutDetail";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCloudDownloadAlt, FaFilter } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import {
  hitungKategoriNeraca,
  neracaHitungLevelAkun,
} from "utilities/KeuanganUtils";
import { baseURL, ssURL } from "client/clientAxios";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Dropdown from "components/Shared/Dropdown/Dropdown";
import HeaderAnalisisSoal from "components/Ujian/HeaderAnalisisSoal";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ tanggalAwal, tanggalAkhir, search, tipeData }) => {
  const [neraca, setNeraca] = useState([]);
  const [searchTransaksi, setSearchTransaksi] = useState(search);
  const [akun, setAkun] = useState([]);
  const [keuangan, setKeuangan] = useState({});
  const [levelAkun, setLevelAkun] = useState([]);
  const [debounceSearch] = useDebounce(searchTransaksi, 300);

  const _getNeraca = async () => {
    const { data } = await getNeraca({ tanggalAkhir, tanggalAwal, search });

    if (data) {
      setAkun(data?.akun);
      setKeuangan(data?.keuangan);

      const template = JSON.parse(data?.keuangan?.template || "[]");
      const hasil = neracaHitungLevelAkun(data?.akun, template, "jurnal", 1);
      setLevelAkun(hasil);

      const kategori = hitungKategoriNeraca(data?.kategori, hasil, 1);
      setNeraca(kategori);
      // console.log(kategori);
    }
  };

  useEffect(() => {
    _getNeraca();
  }, [tanggalAwal, tanggalAkhir, search]);

  //   useEffect(() => {
  //     router.push({
  //       pathname: "/smartschool/laporan-keuangan/neraca/data-laporan",
  //       query: {
  //         ...router.query,
  //         search: debounceSearch,
  //       },
  //     });
  //   }, [debounceSearch]);

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

  return (
    <Layout>
      <AnimatePage>
        <HeaderAnalisisSoal ssURL={ssURL} />
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
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
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
