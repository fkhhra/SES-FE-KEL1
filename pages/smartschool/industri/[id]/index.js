import { Pagination } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../../../client/clientAxios";
// import { searchProyek } from "../../../client/ProyekClient";
import CardProyekKolaborasi from "../../../../components/Kolaborasi/CardProyekKolaborasi";
// import SearchLowongan from "../../../../components/lowongan/SearchLowongan";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Avatar from "../../../../components/Shared/Avatar/Avatar";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import useSekolah from "../../../../hooks/useSekolah";
import {
  // applyRombelSer,
  getLowonganIndustri,
  getRombel,
  getRombelEresource,
} from "../../../../client/RombelClient";
import { momentPackage } from "utilities/HelperUtils";
import useUser from "../../../../hooks/useUser";
import useTa from "hooks/useTa";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";

const index = ({ search, bentuk, guru_id, id }) => {
  const { user } = useUser();
  const { ta } = useTa();
  const [userData, setUserData] = useState({});
  const [industri, setDetailIndustri] = useState([]);
  // const { user, mataPelajaran, rombel } = userData;
  const { sekolah } = useSekolah();
  const [activeMenu, setActiveMenu] = useState(`/`);
  const [kodeHari, setKodeHari] = useState(new Date().getDay());
  const [rombelData, setRombelData] = useState([]);
  const router = useRouter();
  const { cariProyek = "", page = 1 } = router.query;

  const handleChangeFilter = (query) => {
    router.push({
      pathname: router.pathname,
      query,
    });
  };

  console.log(ta?.id);

  const { rombel, userRole, jadwalMengajar, rombelMengajar, absen } = industri;

  const _getDetailIndustri = async () => {
    const { data } = await getLowonganIndustri(id, {
      page: page || "",
      jenis: "cari",
      kode_hari: 0,
      jam_saat_ini: momentPackage().format("HH:mm"),
      search: search || "",
      bentuk: bentuk || "",
      guru_id: guru_id || "",
      ta_id: ta?.id,
    });
    if (data) {
      setDetailIndustri(data);
    }
  };

  // const handleSubmit = async (e) => {
  //   const { data, error } = await applyRombelSer({
  //     dihapus: 2,
  //     rombelId: e?.rombel?.id,
  //     userId: [`${user?.id}`],
  //   });
  //   if (data) {
  //     toast.success(data?.message);
  //     _getDetailIndustri();
  //   }
  // };

  const janganUlangRombel = [];

  let mMataPelajaranId = 0;
  let rombelId = 0;

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    _getDetailIndustri();
  }, [cariProyek, page, search, bentuk, guru_id, ta]);

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
          <Link href={`${ssURL}/industri`}>
            <a className="text-decoration-none fw-bolder color-primary">
              <FaChevronLeft />
              <span className="ms-2">Kembali</span>
            </a>
          </Link>
          <h2 className="h2 fw-black color-primary text-capitalize position-relative mt-4 mb-0">
            Daftar Lowongan
          </h2>
          <div className="row gy-4">
            <div className="col-lg-12">
              {/* <SearchLowongan
                isProyek
                cariPartner={cariProyek}
                handleChangeFilter={handleChangeFilter}
                query={router.query}
                hasilSearch={proyek}
              /> */}
              <div
                className="row mt-5 position-relative gy-4"
                style={{ zIndex: "50" }}
              >
                {rombelMengajar
                  ?.filter((d) => {
                    if (
                      !janganUlangRombel.find(
                        (e) =>
                          e.mRombelId == d.mRombelId &&
                          e.mMataPelajaranId == d.mMataPelajaranId
                      )
                    ) {
                      janganUlangRombel.push(d);
                      return true;
                    } else {
                      return false;
                    }
                  })
                  ?.map((d, idx) => {
                    if (!d.mMataPelajaranId) {
                      return;
                    }
                    if (
                      mMataPelajaranId != d.mMataPelajaranId ||
                      rombelId != d.rombel?.id
                    ) {
                      mMataPelajaranId = d.mMataPelajaranId;
                      rombelId = d.rombel?.id;
                      console.log(d);
                      return (
                        <div className="col-md-4">
                          <CardProyekKolaborasi
                            isSearch
                            isLowongan
                            data={d}
                            status="perencanaan-produk"
                            isCariProyek
                            // handleSubmit={() => handleSubmit(d)}
                            isPrivat={d.privasi}
                          />
                        </div>
                      );
                    }
                  })}
              </div>
              <div className="my-4 text-center">
                <Pagination
                  total={industri?.total}
                  showSizeChanger={false}
                  current={parseInt(page) || 1}
                  pageSize={20}
                  onChange={(e) =>
                    router.push(
                      `${ssURL}/lowongan?page=${e}&cari=${cariProyek}`
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

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
