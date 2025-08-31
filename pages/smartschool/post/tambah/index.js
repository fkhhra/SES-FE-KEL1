import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import CreateEditPost from "../../../../components/Postingan/CreateEditPost";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";

const index = () => {
  return (
    <Layout>
      <AnimatePage>
        <CreateEditPost />
      </AnimatePage>
    </Layout>
  );
};

export default index;
