import { ssURL } from "client/clientAxios";
import HeaderBukuKerjaGuru from "components/BukuKerjaGuru/HeaderBukuKerjaGuru";
import HeaderLaporanNeraca from "components/Keuangan/HeaderLaporanNeraca";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import HeaderDataSekolah from "components/DataSekolah/HeaderDataSekolah";

// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({}) => {
  return (
    <Layout>
      <AnimatePage>
        <HeaderDataSekolah ssURL={ssURL} />
        <div className="row">
          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header p-4 card-header-ss">
                <div className="row">
                  <div className="col-md-8 col-12 d-flex align-items-center">
                    <h4 className="fw-extrabold color-dark mb-0">
                      Daftar Instrumen
                    </h4>
                    <span className="label-light-success-ss label-ss fs-12-ss fw-semibold rounded-pill ms-4">
                      4/4 Instrumen
                    </span>
                  </div>
                  <div className="col-md-4 d-flex flex-md-row flex-column justify-content-lg-end justify-content-between mt-md-0 mt-3">
                    <div className="flex-grow-1 mb-md-0 mb-3">
                      <input
                        type="text"
                        className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100"
                        style={{ height: "42px", width: "100%" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari instrumen"
                        autoComplete="off"
                        // value={search}
                        // onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" data-joyride="table-rombel">
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Instrumen</th>
                        <th>Jumlah</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-th="No">1</td>
                        <td data-th="Instrumen">SKL, KI, dan KD</td>
                        <td data-th="Jumlah">12 File</td>
                        <td data-th="Detail">
                          <Link href={`${ssURL}/rombel/`}>
                            <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="No">2</td>
                        <td data-th="Instrumen">RPP</td>
                        <td data-th="Jumlah">16 File</td>
                        <td data-th="Detail">
                          <Link href={`${ssURL}/rombel/`}>
                            <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="No">3</td>
                        <td data-th="Instrumen">Silabus</td>
                        <td data-th="Jumlah">16 File</td>
                        <td data-th="Detail">
                          <Link href={`${ssURL}/rombel/`}>
                            <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td data-th="No">4</td>
                        <td data-th="Instrumen">KKM</td>
                        <td data-th="Jumlah">8 File</td>
                        <td data-th="Detail">
                          <Link href={`${ssURL}/rombel/`}>
                            <a className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 hover-shadow-none">
                              Lihat
                            </a>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default index;
