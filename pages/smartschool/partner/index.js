import { Pagination } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import { getUser } from "../../../client/UserClient";
import CardPartnerKolaborasi from "../../../components/Kolaborasi/CardPartnerKolaborasi";
import SearchKolaborasi from "../../../components/Kolaborasi/SearchKolaborasi";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../hooks/useSekolah";

const index = ({ cariPartner, page }) => {
  const [userData, setUserData] = useState({});
  const { user, mataPelajaran, rombel } = userData;
  const { sekolah } = useSekolah();
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();

  const [partner, setPartner] = useState();

  const _getUser = async () => {
    const { data } = await getUser({
      page: page || 1,
      name: router?.query?.search || "",
      bentuk: router?.query?.bentuk || "",
      mSekolahId: router?.query?.sekolah || "",
    });

    if (data) {
      setPartner(data?.user);
    }
  };

  const handleChangeFilter = (query) => {
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getUser();
  }, [page, cariPartner, router.query]);

  return (
    <>
      <Layout title={"Undang Anggota"} modalWrapper={<></>}>
        <AnimatePage>
          <div className="row gy-4">
            <div className="col-lg-3 positon-relative">
              <ul className="nav side-nav-ss side-nav-ujian bg-white rounded-ss px-3 py-4 flex-column">
                <li className="nav-item">
                  <Link href={`${ssURL}/proyek-saya`}>
                    <a
                      className={`nav-link ${
                        activeMenu == `${ssURL}/proyek-saya` && "active"
                      } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-proyek-saya.svg`}
                        alt=""
                        className="me-2"
                      />
                      Proyek Saya
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href={`${ssURL}/proyek`}>
                    <a
                      className={`nav-link ${
                        activeMenu == `${ssURL}/proyek` && "active"
                      } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-cari-proyek.svg`}
                        alt=""
                        className="me-2"
                      />
                      Cari Proyek
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href={`${ssURL}/partner`}>
                    <a
                      className={`nav-link ${
                        activeMenu == `${ssURL}/partner` && "active"
                      } color-dark fw-bold fs-18-ss d-flex align-items-center px-4 mb-3`}
                      aria-current="page"
                    >
                      <img
                        src={`/img/icon-cari-partner.svg`}
                        alt=""
                        className="me-2"
                      />
                      Cari Partner
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9">
              <SearchKolaborasi
                cariPartner={cariPartner}
                _getUser={_getUser}
                handleChangeFilter={handleChangeFilter}
                query={router.query}
                hasilSearch={partner}
              />
              <div
                className="row mt-5 position-relative gy-4
                "
                style={{ zIndex: "50" }}
              >
                {partner?.data?.map((d, idx) => {
                  return (
                    <div className="col-md-4">
                      <CardPartnerKolaborasi data={d} />
                    </div>
                  );
                })}
              </div>
              <div className="my-4 text-center">
                <Pagination
                  total={partner?.total}
                  showSizeChanger={false}
                  current={parseInt(page) || 1}
                  pageSize={20}
                  onChange={(e) =>
                    router.push(
                      `${ssURL}/partner?page=${e}&cariPartner=${cariPartner}`
                    )
                  }
                />
              </div>
            </div>
          </div>
        </AnimatePage>
      </Layout>
    </>
  );
};

export async function getServerSideProps({ query: { cariPartner, page } }) {
  return {
    props: {
      cariPartner: cariPartner || "",
      page: page || 1,
    },
  };
}

export default index;
