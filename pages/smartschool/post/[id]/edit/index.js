import Layout from "../../../../../components/Layout/Layout";
import AnimatePage from "../../../../../components/Shared/AnimatePage/AnimatePage";
import CreateEditPost from "../../../../../components/Postingan/CreateEditPost";

const index = ({ id }) => {
  return (
    <Layout>
      <AnimatePage>
        <CreateEditPost id={id} />
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default index;
