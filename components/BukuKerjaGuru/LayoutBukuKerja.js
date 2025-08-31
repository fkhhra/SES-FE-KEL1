import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import SidebarBukuKerjaGuru from "./SidebarBukuKerjaGuru";

const LayoutBukuKerja = ({ children }) => {
  return (
    <Layout>
      <AnimatePage>
        <div className="row">
          <div className="col-md-3 positon-relative">
            <SidebarBukuKerjaGuru activeMenu={""} />
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default LayoutBukuKerja;
