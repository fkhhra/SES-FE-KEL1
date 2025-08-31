import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getDetailBukuInduk } from "../../../../client/BukuIndukClient";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";

const BukuIndukPageDetail = ({ id, nav, subnav, rombel_id }) => {
  const [detailBukuIndukData, setDetailBukuIndukData] = useState({});
  const { rombel } = detailBukuIndukData;
  const [loading, setLoading] = useState(false);

  const ignoreProperty = ["dataBiodata", "dataRapor", "id", "mUserId"];

  const _getDetailBukuInduk = async () => {
    setLoading(true);
    const { data } = await getDetailBukuInduk(id);
    if (data) {
      setDetailBukuIndukData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    _getDetailBukuInduk();
  }, []);

  return (
    <Layout isIndex>
      <AnimatePage>
        <div className="row">
          <div className="col-md-12">
            <div
            // className={`${
            //   user?.role == "guru" && "d-flex justify-content-between"
            // }`}
            >
              <Link href={`${ssURL}/buku-induk`}>
                <a className="text-decoration-none fw-bolder color-primary">
                  <FaChevronLeft />
                  <span className="ms-2">Daftar Kelas</span>
                </a>
              </Link>
            </div>

            {/* Card Kelas Start */}
            <div
              className="
            card-header-kelas-ss card card-kelas-ss card-ss  px-0 mt-3 mb-4"
            >
              <div
                className="card-header card-header-ss p-4 d-flex align-items-center mb-lg-0"
                id="bg-detail-buku-induk"
                style={{ minHeight: "150px" }}
              >
                <div
                  className="rounded-circle shadow-primary-ss"
                  style={{ width: "86px", height: "86px" }}
                >
                  <img src="/img/icon-detail-buku-induk.png" alt="" />
                </div>
                <div className="ms-4">
                  <h2 className="h2 fw-black color-dark text-capitalize position-relative">
                    Buku Induk - {rombel?.nama}
                  </h2>
                  <p className="fs-6 fw-bold mb-0">{rombel?.jurusan?.nama}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card card-ss">
          <div className="card-header p-4 card-header-ss">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                Daftar Siswa{" "}
              </h4>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Buku Induk</th>
                  </tr>
                </thead>
                <tbody>
                  {rombel?.anggotaRombel
                    ?.sort((a, b) =>
                      ("" + a?.user?.nama).localeCompare("" + b?.user?.nama)
                    )
                    ?.map((d, idx) => {
                      let profilTidakKosong = 0;
                      let progressLength = 0;
                      if (d?.user?.profil) {
                        Object.entries(d?.user?.profil).map(([key, value]) => {
                          if (value && ignoreProperty.indexOf(key) < 0)
                            profilTidakKosong += 1;
                        });
                        progressLength = (
                          (profilTidakKosong /
                            Object.entries(d?.user?.profil).filter(
                              ([key, value]) => {
                                if (ignoreProperty.indexOf(key) < 0)
                                  return true;
                                else return false;
                              }
                            ).length) *
                          100
                        ).toFixed(0);
                      }
                      return (
                        <tr key={`${idx}-${new Date().getTime()}`}>
                          <td data-th="No">{idx + 1}</td>
                          <td data-th="Nama">{d?.user?.nama}</td>
                          <td data-th="Progress">
                            <div
                              className="progress rounded-pill bg-light-secondary pointer"
                              style={{
                                width: "100px",
                                height: "10px",
                              }}
                              dataBsToogle={"tooltip"}
                              dataBsPlacement={"bottom"}
                              // title={`${
                              //   jadwalUjianRef.find(
                              //     (x) => x?.user_id === peserta?.id
                              //   )?.progress == undefined
                              //     ? 0
                              //     : jadwalUjianRef.find(
                              //         (x) => x?.user_id === peserta?.id
                              //       )?.progress
                              // } / ${jadwalUjian?.jumlahSoal}`}
                            >
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{
                                  width: `${progressLength}px`,
                                }}
                                // style={{
                                //   width:
                                //     (100 / jadwalUjian?.jumlahSoal) *
                                //     jadwalUjianRef.find(
                                //       (x) => x?.user_id === peserta?.id
                                //     )?.progress,
                                // }}
                                // ariaValueNow={"75"}
                                ariaValueMin={"0"}
                                ariaValueMax={"100"}
                              ></div>
                            </div>
                          </td>
                          <td data-th="Status">
                            <span
                              className={`bg-soft-${
                                progressLength < 100 ? "danger" : "success"
                              } rounded-pill color-${
                                progressLength < 100 ? "danger" : "success"
                              } fs-12-ss fw-semibold py-1 px-3`}
                            >
                              {progressLength < 100
                                ? "Belum Lengkap"
                                : "Sudah Lengkap"}
                            </span>
                          </td>
                          <td data-th="Buku Induk">
                            <Link
                              href={`${ssURL}/buku-induk-print/${id}/${d?.user?.id}`}
                            >
                              <a className="bg-primary rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1">
                                Lihat
                              </a>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
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

export default BukuIndukPageDetail;
