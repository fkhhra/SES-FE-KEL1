import { Pagination } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../../client/clientAxios";
import { getProyek, searchProyek } from "../../../client/ProyekClient";
import CardProyekKolaborasi from "../../../components/Kolaborasi/CardProyekKolaborasi";
import SearchKolaborasi from "../../../components/Kolaborasi/SearchKolaborasi";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../components/Shared/Avatar/Avatar";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import useSekolah from "../../../hooks/useSekolah";

const index = ({ search, bentuk, sekolah: mSekolahId }) => {
  const [userData, setUserData] = useState({});
  const [proyek, setProyek] = useState({ data: [] });
  const { user, mataPelajaran, rombel } = userData;
  const { sekolah } = useSekolah();
  const [activeMenu, setActiveMenu] = useState(`/`);
  const router = useRouter();
  const { cariProyek = "", page = 1 } = router.query;

  const handleChangeFilter = (query) => {
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  const _getProyek = async () => {
    const { data } = await searchProyek({
      page: page || "",
      search: search || "",
      bentuk: bentuk || "",
      mSekolahId: mSekolahId || "",
    });
    if (data) {
      setProyek(data?.proyekAll);
    }
  };

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getProyek();
  }, [cariProyek, page, search, bentuk, mSekolahId]);

  return (
    <>
      <Layout
        title={"Undang Anggota"}
        modalWrapper={
          <>
            <NewModal
              modalId="modalPartnerDiundang"
              removeFooter
              title={
                <>
                  <h4 className="mb-0 fw-extrabold">10 Diundang</h4>
                </>
              }
              content={
                <>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item py-3">
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="d-flex align-items-sm-center">
                          <Avatar name="Jack Sparrow" size={50} />
                          <div className="ms-3">
                            <h6 className="mb-1 fw-semibold color-dark fw-extrabold">
                              Jack Sparrow
                            </h6>
                            <span className="fs-12-ss fw-bold">
                              SMK Negeri 26 Jakarta
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3">
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="d-flex align-items-sm-center">
                          <Avatar name="Jack Sparrow" size={50} />
                          <div className="ms-3">
                            <h6 className="mb-1 fw-semibold color-dark fw-extrabold">
                              Jack Sparrow
                            </h6>
                            <span className="fs-12-ss fw-bold">
                              SMK Negeri 26 Jakarta
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3">
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="d-flex align-items-sm-center">
                          <Avatar name="Jack Sparrow" size={50} />
                          <div className="ms-3">
                            <h6 className="mb-1 fw-semibold color-dark fw-extrabold">
                              Jack Sparrow
                            </h6>
                            <span className="fs-12-ss fw-bold">
                              SMK Negeri 26 Jakarta
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item py-3">
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="d-flex align-items-sm-center">
                          <Avatar name="Jack Sparrow" size={50} />
                          <div className="ms-3">
                            <h6 className="mb-1 fw-semibold color-dark fw-extrabold">
                              Jack Sparrow
                            </h6>
                            <span className="fs-12-ss fw-bold">
                              SMK Negeri 26 Jakarta
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </>
              }
              submitButton={
                <ReactiveButton
                  buttonState={"buttonState"}
                  color={"primary"}
                  idleText={"Tandai Sudah Dibaca"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  data-bs-dismiss="modal"
                  className={"btn btn-primary"}
                  //   onClick={() =>
                  //     handlePutMateriKesimpulan(
                  //       kesimpulanData?.kesimpulan?.[0].id
                  //     )
                  //   }
                />
              }
            />
          </>
        }
      >
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
                isProyek
                cariPartner={cariProyek}
                handleChangeFilter={handleChangeFilter}
                query={router.query}
                hasilSearch={proyek}
              />
              <div
                className="row mt-5 position-relative gy-4"
                style={{ zIndex: "50" }}
              >
                {proyek?.data?.map((d, idx) => {
                  return (
                    <div className="col-md-4">
                      <CardProyekKolaborasi
                        data={d}
                        status="perencanaan-produk"
                        isCariProyek
                        isPrivat={d.privasi}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="my-4 text-center">
                <Pagination
                  total={proyek?.total}
                  showSizeChanger={false}
                  current={parseInt(page) || 1}
                  pageSize={20}
                  onChange={(e) =>
                    router.push(`${ssURL}/proyek?page=${e}&cari=${cariProyek}`)
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

export async function getServerSideProps({
  query: { search, bentuk, sekolah },
}) {
  return {
    props: {
      search: search || null,
      bentuk: bentuk || null,
      sekolah: sekolah || null,
    },
  };
}

export default index;
