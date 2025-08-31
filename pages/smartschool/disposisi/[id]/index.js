import DetailDisposisi from "components/SuratMasuk/DetailDisposisi";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "../../../../client/clientAxios";
import { detailDisposisi } from "../../../../client/SuratClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
// import DetailDisposisi from "../../../../components/SuratMasuk/DetailDisposisi";

const index = ({ id }) => {
  const [disposisi, setDisposisi] = useState({});
  const [loading, setLoading] = useState(false);
  const _getDetailDisposisi = async () => {
    setLoading(true);
    const { data, error } = await detailDisposisi(id);

    if (data) {
      setDisposisi(data?.disposisi);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getDetailDisposisi();
  }, []);

  return (
    <Layout isIndex>
      <AnimatePage>
        <section className="banner position-absolute"></section>

        <div className="row d-flex justify-content-center">
          <div className="col-md-12">
            <div
              className={`d-flex justify-content-between
              `}
            >
              <Link href={`${ssURL}/disposisi`}>
                <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>
            <DetailDisposisi dataDisposisi={disposisi} />
          </div>
        </div>
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
