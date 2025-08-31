import Link from "next/link";
import { FaBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { ssURL } from "../../../client/clientAxios";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import { getMateri } from "../../../client/MateriClient";
// import { getMateri } from "../../../client/RekapClient";

import { checkBackgroundKelompok } from "../../../utilities/RekapUtils";
import CardRekapSkeleton from "../../../components/Shared/Skeleton/CardRekapSkeleton";
import SelectShared from "components/Shared/SelectShared/SelectShared";
import { useRouter } from "next/router";
import useTa from "hooks/useTa";
import ModalUbahDataDashboard from "components/Layout/ModalUbahDataDashboard";
import useUser from "hooks/useUser";
import { Empty } from "antd";

const RekapSSPage = ({ m_ta_id }) => {
  const [loading, setLoading] = useState(true);
  const [rekap, setRekap] = useState({});
  const { ta } = useTa();
  const { user } = useUser();

  const { materi, semuaTA, dataTA } = rekap;
  const [tipeTa, setTipeTA] = useState({ value: m_ta_id });
  // const { value } = m_ta_id;
  const router = useRouter();
  const changeTA = (value) => {
    setTipeTA(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, m_ta_id: value?.value },
    });
  };

  const _getMateri = async () => {
    setLoading(true);
    const { data } = await getMateri({ m_ta_id: tipeTa?.value || ta.id });
    if (data) {
      setRekap(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    _getMateri();
  }, [m_ta_id]);

  return (
    <Layout>
      <AnimatePage>
        <div className="row mb-4">
          <div className="col-md-12">
            {user?.role == "guru" && (
              <div className="card card-ss d-flex align-items-center justify-content-between my-4 w-100 bg-white p-4 rounded-3 flex-sm-row flex-column">
                <div className="mb-sm-0 mb-3">
                  <h4 className={"fw-extrabold color-dark mb-2"}>
                    Daftar Transkrip
                  </h4>
                  <p className="fw-semiBold align-middle align-items-center mb-0">
                    Tahun Ajaran {dataTA?.tahun} - {dataTA?.semester}
                  </p>
                </div>
                {/* <div
                  className="btn btn-outline-primary btn-primary-ss rounded-5 px-4"
                  // onClick={() => {
                  //   setModalUbahDataDashboard(true);
                  // }}
                  data-bs-toggle="modal"
                  data-bs-target="#modalTambahIkatanAlumni"
                > */}
                <button
                  className="btn btn-outline-primary btn-outline-primary-ss rounded-pill px-4"
                  data-bs-toggle="modal"
                  data-bs-target="#modalUbahDataTahun"
                >
                  Ubah
                </button>
                {/* </div> */}
              </div>
            )}
            {/* <div className="card card-ss p-4">
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-6 d-flex align-items-center">
                  <h4 className={"fw-extrabold color-dark mb-md-0 mb-3"}>
                    Daftar Transkrip
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="select-akun-keuangan">
                    //  <SelectShared
                    //   name="selectTa"
                    //   placeholder="Pilih tahun akademik"
                    //   handleChangeSelect={changeTA}
                    //   value={tipeTa?.value || ta.id}
                    //   options={semuaTA?.map((d) => {
                    //     return {
                    //       label: `${d?.tahun} - ${d?.semester}`,
                    //       value: d?.id,
                    //     };
                    //   })}
                    // /> 
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {loading && (
          <div className="row g-4">
            <CardRekapSkeleton count={3} />
          </div>
        )}
        {!loading && (
          <>
            <div className="row g-4">
              {materi?.length ? (
                <>
                  {materi?.map((d, idx) => {
                    return (
                      <div
                        className="col-md-4 daftar-kelas"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <div className="card-kelas-ss card card-ss px-0">
                          <div
                            className="card-body px-3 pt-3 justify-content-between d-flex"
                            style={checkBackgroundKelompok(
                              d?.mataPelajaran?.kelompok
                            )}
                          >
                            <div className="card-kelas-name text-white">
                              <h5 className="mb-1 fw-black">
                                {d?.mataPelajaran?.nama}
                              </h5>
                              <p className="m-0 fw-semibold">
                                Kelas {d?.tingkat}{" "}
                                {d?.mataPelajaran?.kelompok == "C"
                                  ? d?.jurusan?.kode
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="card-footer card-footer-ss card-kelas-footer py-3 d-flex justify-content-between flex-lg-row flex-md-column flex-row align-items-lg-center">
                            <div className="color-primary d-flex align-items-center me-4">
                              <FaBook />
                              <p className="mb-0 ms-2">
                                {d.meta?.total} Materi
                              </p>
                            </div>
                            <Link
                              href={`${ssURL}/rekap/[id]`}
                              as={`${ssURL}/rekap/${d?.id}`}
                            >
                              <a
                                className={`btn btn-outline-primary btn-outline-primary-ss rounded-pill fs-12-ss fw-bolder py-1 px-3`}
                              >
                                Rekap Nilai
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="h-auto">
                  <Empty />
                </div>
              )}
            </div>
          </>
        )}
        <ModalUbahDataDashboard
          // initialFormData={initialFormData}
          // modalUbahDataDashboard={modalUbahDataDashboard}
          // setModalUbahDataDashboard={setModalUbahDataDashboard}
          // sekolahId={sekolahId}
          // setSekolahId={setSekolahId}
          getData={_getMateri}
          // router={router}
          semuaTA={semuaTA}
          dataTA={dataTA}
          // setTahunAjaran={setTahunAjaran}
          // tahunAjaran={tahunAjaran}
          // formData={formData}
          // setFormData={setFormData}
          // editData={editData}
          // _getKeuangan={_getKeuangan}
          // proyek={proyek}
        />
      </AnimatePage>
    </Layout>
  );
};
export async function getServerSideProps({ query: { m_ta_id } }) {
  return {
    props: {
      m_ta_id: m_ta_id || "",
    },
  };
}

export default RekapSSPage;
