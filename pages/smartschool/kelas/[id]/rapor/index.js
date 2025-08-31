import KelasHeader from "components/Kelas/KelasHeader";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useEffect, useState } from "react";
import { getDetailRombel } from "client/RombelClient";
import RaporPage from "components/Rombel/RaporPage";

const index = ({ id, subnav }) => {

  const [detailRombel, setDetailRombel] = useState({});

  const {
    jadwalMengajar,
    industri,
    sikapsosial,
    sikapspiritual,
    totalMapel,
    kkm,
  } = detailRombel;

  // ======= Fitur E-Rapor =======
  const keterangan = jadwalMengajar?.rombel?.anggotaRombel;
  const keteranganRombel = jadwalMengajar?.rombel;

  const getDetailRombelData = async () => {
    let params = { kode_hari: new Date().getDay() }
    const { data } = await getDetailRombel(id, params);

    if (data) {
      setDetailRombel(data);
    }
  };

  useEffect(() => {
    getDetailRombelData();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <KelasHeader id={id} />
        <RaporPage
          id={id}
          getDetailRombelData={getDetailRombelData}
          jadwalMengajar={jadwalMengajar}
          keterangan={keterangan}
          industri={industri}
          sikapsosial={sikapsosial}
          sikapspiritual={sikapspiritual}
          keteranganRombel={keteranganRombel}
          kkm={kkm}
          totalMapel={totalMapel}
          subnav={subnav}
          isInNewKelasPage={true}
        />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id }, query: { subnav } }) {
  return {
    props: {
      id,
      subnav: subnav || ""
    },
  };
}

export default index;
