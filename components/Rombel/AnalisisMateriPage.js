import SelectShared from "components/Shared/SelectShared/SelectShared";
import useSekolah from "hooks/useSekolah";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { ssURL } from "../../client/clientAxios";
import TugasSkeleton from "../Shared/Skeleton/TugasSkeleton";

const AnalisisMateriPage = ({
  loading,
  analisisMateri,
  id,
  semuaTA,
  ta_id,
}) => {
  const { sekolah } = useSekolah();
  const [tipeTA, setTipeTA] = useState({ value: ta_id });
  const changeTA = (value) => {
    setTipeTA(value);
    router.push({
      pathname: router?.pathname,
      query: { ...router?.query, ta: value.value },
    });
  };

  return (
    <>
      <div className="row justify-content-center">
        {sekolah?.id == "40" && (
          <div className="col-md-10">
            <div className="card card-ss p-4">
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-6 d-flex align-items-center">
                  <h4
                    className={
                      // user?.role == "guru"
                      "fw-extrabold color-dark mb-md-0 mb-3"
                      // : "p-4 m-0 fw-extrabold color-dark d-flex justify-content-center justify-content-md-start"
                    }
                  >
                    Daftar Materi
                  </h4>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="select-akun-keuangan">
                    <SelectShared
                      name="kepemilikan"
                      placeholder="Pilih tahun akademik"
                      handleChangeSelect={changeTA}
                      value={ta_id}
                      options={semuaTA?.map((d) => {
                        return {
                          label: `${d?.tahun} - ${d?.semester}`,
                          value: d?.id,
                        };
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!analisisMateri?.materi?.bab.length && (
          <>
            <div className="row justify-content-center mt-3">
              <div className="col-md-4 col-8">
                <img
                  src="/img/empty-state-timeline.png"
                  alt="empty-state"
                  className="img-fluid"
                />
              </div>
              <div className="col-12 text-center">
                <h5 className="color-dark fw-black">Belum Ada Materi</h5>
                <p className="fw-bold fs-14-ss">
                  Tekan tombol{" "}
                  <a href="#" className="text-decoration-none color-primary">
                    dibawah
                  </a>{" "}
                  untuk membuat materi
                </p>
                <Link href={`${ssURL}/materi`}>
                  <a className="text-decoration-none">
                    <button
                      className="btn btn-ss btn-primary btn-primary-ss shadow-primary-ss rounded-pill fw-bold"
                      style={{ width: "164px" }}
                    >
                      Buat Materi
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </>
        )}
        {loading && (
          <div className="col-md-10">
            <TugasSkeleton />
          </div>
        )}

        {!loading &&
          analisisMateri?.materi?.bab?.map((bab, idx) => {
            return (
              <div className="col-md-10" key={`${idx}-${new Date().getTime()}`}>
                {/* Card Post Start */}

                <div className="card-analisis-materi card card-ss mb-4 mt-4">
                  <div className="card-header card-header-ss p-4 border-bottom border-secondary border-light-secondary-ss">
                    <div className="card-post-title d-flex align-items-center">
                      <div
                        className="rounded-circle shadow-primary-ss me-4"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <img src={`/img/post-icon-1.svg`} alt="post-icon" />
                      </div>
                      <h6 className="fw-black fs-18-ss m-0 color-dark">
                        BAB {idx + 1} - {bab?.judul}
                      </h6>
                    </div>
                  </div>
                  <div className="card-body pt-0 ps-0 pb-4 pe-0">
                    {bab?.topik?.map((topik, idx) => {
                      return (
                        <Link
                          href={`${ssURL}/analisis-materi/[id]?m_jadwal_mengajar_id=${id}`}
                          as={`${ssURL}/analisis-materi/${topik.id}?m_jadwal_mengajar_id=${id}`}
                          key={`${idx}-${new Date().getTime()}`}
                        >
                          <a
                            className="topik-items px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light-secondary-ss text-decoration-none"
                            data-joyride="topik-materi"
                          >
                            <p className="color-secondary m-0">
                              {topik?.judul}
                            </p>
                            {topik?.meta?.totalKesimpulan ==
                            analisisMateri?.rombel?.meta?.totalAnggota ? (
                              <div
                                className="label-topik label-light-success-ss rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center"
                                data-joyride="progres-materi"
                              >
                                Selesai
                              </div>
                            ) : (
                              <div
                                className="label-topik label-light-primary-ss rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center"
                                data-joyride="progres-materi"
                              >
                                {topik?.meta?.totalKesimpulan} /{" "}
                                {analisisMateri?.rombel?.meta?.totalAnggota}
                              </div>
                            )}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {/* Card Analisis Materi End */}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default AnalisisMateriPage;
