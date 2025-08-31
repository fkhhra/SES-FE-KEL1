import { ssURL } from "../../../client/clientAxios";
import SectionImport from "../../../components/Dapodik/SectionImport";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Navbar from "../../../components/Shared/Navbar/Navbar";

const index = ({ nav }) => {
  const navItems = [
    // {
    //   url: `${ssURL}/dapodik-import?nav=rombel`,
    //   text: "Rombel",
    //   active: nav == "rombel" || !nav,
    //   dataJoyride: "rombel",
    // },
    {
      url: `${ssURL}/dapodik-import?nav=guru`,
      text: "Guru",
      active: nav == "guru",
      dataJoyride: "guru",
    },
  ];

  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <Navbar nav={navItems} />
            {/* {(!nav || nav === "rombel") && (
              <div className="row">
                <div className="col-md-12">
                  <SectionImport
                    name="Rombel"
                    bgImg="/img/bg-card-dapodik-import-rombel.png"
                    fileTemplate="/import/template-dapodik-peserta-didik.xlsx"
                    endpointUrl="rombel/import-rombel"
                  />
                </div>
              </div>
            )} */}
            {nav === "guru" && (
              <div className="row">
                <div className="col-md-12">
                  <SectionImport
                    name="Guru"
                    bgImg="/img/bg-card-dapodik-import-guru.png"
                    fileTemplate="/import/template-gtk-dapodik.xlsx"
                    endpointUrl="gtk/import"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav } }) {
  return {
    props: {
      nav: nav || null,
    },
  };
}

export default index;
