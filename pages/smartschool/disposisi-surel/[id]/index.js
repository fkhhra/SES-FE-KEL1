import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getDetailBukuTamu } from "../../../../client/BukuTamuClient";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import DetailDisposisi from "../../../../components/SuratMasuk/DetailDisposisi";

const index = ({ id }) => {
  const [detailBukuIndukTamu, setDetailBukuIndukTamu] = useState({});
  const { buku } = detailBukuIndukTamu;
  const [loading, setLoading] = useState(false);

  const _getDetailBukuTamu = async () => {
    setLoading(true);
    const { data } = await getDetailBukuTamu(id);
    if (data) {
      setDetailBukuIndukTamu(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getDetailBukuTamu();
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
              <Link href={`${ssURL}/disposisi-surel`}>
                <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>
            <DetailDisposisi isPetugasDisposisi />
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
