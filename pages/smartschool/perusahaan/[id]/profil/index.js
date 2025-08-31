import { DatePicker } from "antd";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import HeaderPkl from "components/Pkl/HeaderPkl";
import ModalTambahPerusahaan from "components/Pkl/ModalTambahPerusahaan";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  detailPerusahaan,
  getPerusahaanSekolah,
} from "client/PerusahaanClient";
import { FaPen, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import swal from "sweetalert";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import HeaderPerusahaan from "components/Perusahaan/HeaderPerusahaan";
import HeaderDetailPerusahaan from "components/Perusahaan/HeaderDetailPerusahaan";
import SectionInformasiPerusahaan from "components/Perusahaan/SectionInformasiPerusahaan";
import SectionRuangLingkupMou from "components/Perusahaan/SectionRuangLingkupMou";
import SectionKontakPenanggungJawab from "components/Perusahaan/SectionKontakPenanggungJawab";

const { RangePicker } = DatePicker;
const initialFormData = {
  nama: "",
  logo: "",
  namaPt: "",
  bidang: "",
};

const index = ({ id }) => {
  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 400);
  const [formData, setFormData] = useState({ ...initialFormData });
  const [dataDetailPerusahaan, setDataDetailPerusahaan] = useState([]);

  const _getDetailPerusahaan = async () => {
    const { data, error } = await detailPerusahaan(id);

    if (data) {
      setDataDetailPerusahaan(data?.perusahaan);
    }
  };

  useEffect(() => {
    _getDetailPerusahaan();
  }, []);

  return (
    <Layout modalWrapper={<></>}>
      <AnimatePage>
        <>
          <div className="row gy-4">
            <div className="col-12">
              <HeaderDetailPerusahaan
                ssURL={ssURL}
                id={id}
                dataPerusahaan={dataDetailPerusahaan}
                _getDetailPerusahaan={_getDetailPerusahaan}
              />
            </div>
            <div className="col-12">
              <SectionInformasiPerusahaan
                id={id}
                _getDetailPerusahaan={_getDetailPerusahaan}
                dataPerusahaan={dataDetailPerusahaan}
              />
            </div>
            <div className="col-12">
              <SectionRuangLingkupMou
                _getDetailPerusahaan={_getDetailPerusahaan}
                dataPerusahaan={dataDetailPerusahaan}
              />
            </div>
            <div className="col-12">
              <SectionKontakPenanggungJawab
                id={id}
                _getDetailPerusahaan={_getDetailPerusahaan}
                dataPerusahaan={dataDetailPerusahaan}
              />
            </div>
          </div>
        </>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
