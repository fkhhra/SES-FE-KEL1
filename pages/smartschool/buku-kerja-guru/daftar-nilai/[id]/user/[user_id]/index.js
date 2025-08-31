import { getDetailRekapBukuKerjaNilai } from "client/BukuKerjaGuruClient";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import Navbar from "components/Shared/Navbar/Navbar";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaCloudDownloadAlt } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";

const index = ({ id, nav, user_id }) => {
  const [bukuKehadiranData, setBukuKerjaDetailData] = useState({});

  const { rataTugas, rataUjian, mapel, siswa, dataTugas, dataUjian } =
    bukuKehadiranData || {};

  const currentNav = nav == "tugas" || nav == undefined ? "tugas" : "ujian";

  const navItems = [
    {
      url: `${ssURL}/buku-kerja-guru/daftar-nilai/${id}?nav=tugas`,
      text: "Rekap Tugas",
      active: currentNav == "tugas",
      // onClick: () => setTipe("tugas")
    },
    {
      url: `${ssURL}/buku-kerja-guru/daftar-nilai/${id}?nav=ujian`,
      text: "Rekap Ujian Harian",
      active: currentNav == "ujian",
      // onClick: () => setTipe("ujian")
    },
  ];

  const _getDetailRekapBukuKerjaNilai = async () => {
    let params = {
      // tipe: nav == "tugas" ? "tugas" : "ujian",
      // mRombelId: rombel_id,
      // mMataPelajaranId: mata_pelajaran_id,
    };
    const { data } = await getDetailRekapBukuKerjaNilai(id, user_id);
    if (data) {
      setBukuKerjaDetailData(data);
    }
  };

  useEffect(() => {
    _getDetailRekapBukuKerjaNilai();
  }, [id, nav]);

  return (
    <Layout>
      <AnimatePage>
        <Link href={`${ssURL}/buku-kerja-guru/daftar-nilai/${id}`}>
          <a className="text-decoration-none fw-bolder position-relative color-primary">
            <FaChevronLeft />
            <span className="ms-2">Kembali</span>
          </a>
        </Link>

        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss px-4 py-3 mb-4">
              <h5 className="color-dark fw-extrabold">{siswa?.nama}</h5>

              <div
                className={`label-ss fs-12-ss fw-bold rounded-pill ${
                  false > 0
                    ? "bg-soft-danger color-danger"
                    : "bg-soft-success color-success"
                }`}
                style={{ width: "min-content", whiteSpace: "nowrap" }}
              >
                Sudah Tuntas
              </div>

              <div className="row mt-4">
                <div className="col-md-8">
                  <div
                    className="status-info px-3 py-2 rounded-ss d-flex mb-3 mb-md-0 "
                    style={{ background: "rgba(244, 244, 247, 0.4)" }}
                  >
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-1 fw-bold">
                        Rata Rata PH
                      </p>
                      <p className="fs-18-ss fw-bold color-primary m-0">
                        {rataUjian}
                      </p>
                    </div>
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-1 fw-bold">
                        Rata Rata Tugas
                      </p>
                      <p className="fs-18-ss fw-bold color-primary m-0">
                        {rataTugas}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div
                    className="status-info px-3 py-2 rounded-ss d-flex mb-3 mb-md-0 "
                    style={{ background: "rgba(244, 244, 247, 0.4)" }}
                  >
                    <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                      <p className="fs-14-ss color-secondary mb-1 fw-bold">
                        KKM
                      </p>
                      <p className="fs-18-ss fw-bold color-primary m-0">
                        {mapel?.kkm}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Navbar nav={navItems} />
          </div>

          <div className="col-md-12">
            <div className="card card-ss py-3 mt-4">
              <div className="d-flex align-items-center justify-content-between px-4">
                <h4 className="fw-black color-dark fs-32-ss mb-0">
                  Daftar Siswa
                </h4>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-md-3 mb-md-0 mb-3 md-w-100"
                    id="exampleFormControlInput1"
                    style={{ height: "42px" }}
                    placeholder="Cari Siswa"
                    autoComplete="off"
                    // value={search}
                    // onChange={(e) => onChangeSearch(e.target.value)}
                    data-joyride="cari-siswa"
                  />
                  <div className="d-flex flex-column flex-lg-row align-items-lg-center fs-6">
                    <button
                      className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 me-0 mb-sm-0 mb-3 fw-bold color-secondary fs-14-ss"
                      onClick={() => downloadAnalisisNilai()}
                    >
                      <FaCloudDownloadAlt className="me-2 fs-6" />
                      Rekap
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive mt-4">
                <table className="table-ss" data-joyride="table-kegiatan">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Judul Tugas</th>
                      <th>Nilai</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentNav == "tugas" ? dataTugas : dataUjian)?.map(
                      (data, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{data?.rekapRombel?.judul}</td>
                            <td>
                              <div className="fw-bold color-dark">
                                {data?.nilai}
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold color-dark">
                                {momentPackage(
                                  data?.rekapRombel?.tanggal
                                ).format("dddd, DD MMMM YYYY")}
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  query: { id, rombel_id, mata_pelajaran_id, nav, user_id },
}) {
  return {
    props: {
      rombel_id: rombel_id || null,
      mata_pelajaran_id: mata_pelajaran_id || null,
      id: id || null,
      nav: nav || null,
      user_id: user_id || null,
    },
  };
}

export default index;
