import KelasHeader from "components/Kelas/KelasHeader";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import AnalisisNilaiPage from "components/Rombel/AnalisisNilaiPage";
import { useEffect, useState } from "react";
import { getDetailRombel } from "client/RombelClient";
import { ssURL } from "client/clientAxios";

const index = ({ id }) => {

  const [detailRombel, setDetailRombel] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    jadwalMengajar,
    analisisNilai,
    judulTugas,
  } = detailRombel || {};

  const getDetailRombelData = async () => {
    setLoading(true);
    let params = { kode_hari: new Date().getDay() }
    const { data } = await getDetailRombel(id, params);

    if (data) {
      setDetailRombel(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getDetailRombelData();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <KelasHeader id={id} />
        
        <AnalisisNilaiPage
          id={id}
          analisisNilai={analisisNilai}
          judulTugas={judulTugas}
          loading={loading}
          jadwalMengajar={jadwalMengajar}
          subnavLink={{
            pengetahuan: `${ssURL}/kelas/${id}/analisis-nilai?subnav=pengetahuan`,
            sikap: `${ssURL}/kelas/${id}/analisis-nilai?subnav=sikap`,
          }}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id
    },
  };
}

export default index;
