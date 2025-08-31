import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaCheck,
  FaChevronLeft,
  FaDownload,
  FaFileDownload,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrash,
  FaTrashAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { useRouter } from "next/router";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { detailGelombangPPDB } from "../../../../client/GelombangPPDB";

import { getTimeFromNow } from "../../../../utilities/HelperUtils";
import { statusKonfirmasi } from "../../../../utilities/PPDBUtils";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import ModalUjianPenerimaan from "../../../../components/PPDB/ModalUjianPenerimaan";
import ModalTambahBiaya from "../../../../components/PPDB/ModalTambahBiaya";
import ModalKeterangan from "../../../../components/PPDB/ModalKeterangan";
import JalurPendaftaranLayout from "components/PPDB/JalurPendaftaranLayout";
import { detailJalurPpdb } from "client/JalurPpdbClient";
// import FormBerkas from "../../../components/PPDB/FormBerkas";

const index = ({ id }) => {
  const { nav } = useRouter().query;

  const [jalurPpdb, setJalurPpdb] = useState({});
  const { jalur } = jalurPpdb;

  const _detailJalurPpdb = async () => {
    const { data } = await detailJalurPpdb(id);
    if (data) {
      setJalurPpdb(data);
    }
  };

  useEffect(() => {
    _detailJalurPpdb();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <JalurPendaftaranLayout ssURL={ssURL} id={id}>
          <div className="row gy-4">
            <div className="col-lg-12 ">
              {/* {pendaftar?.length &&
              pendaftar?.map((data, idx) => {
                return ( */}
              <div className="col-md-12 mb-4">
                <div className="card card-ss card-biaya-pendaftaran p-0">
                  <div className="card-header-ss rounded-ss d-flex justify-content-between align-items-between px-4 py-4">
                    <h4 className="fw-bold color-dark mb-0">
                      {/* {idx + 1}. {data?.judul} */}
                      Biaya Pendaftaran
                    </h4>
                    <div className="d-flex">
                      <button
                        type="button"
                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        // data-bs-toggle="modal"
                        // data-bs-target="#ModalFormAlurPPDB"
                        // onClick={() => handleClickEdit(data)}
                      >
                        <FaPen className="color-secondary" />
                      </button>
                      <button
                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-3 me-md-0 me-3 mb-lg-0 mb-md-2 mb-0"
                        style={{
                          width: "40px",
                          height: "40px",
                        }}
                        // onClick={() => _deleteAlurPPDB(data?.id)}
                      >
                        <FaTrashAlt className="color-secondary" />
                      </button>
                      <a
                        data-bs-toggle="collapse"
                        // href={`#collapseExample${data?.id}`}
                        data-bs-target={`#collapseExample`}
                        role="button"
                        aria-expanded="false"
                        // aria-controls={`collapseExample${data?.id}`}
                        aria-controls={`collapseExample`}
                      >
                        <span
                          class="d-flex justify-content-center align-items-center shadow-primary-ss rounded-circle p-1 shadow-primary-ss bg-primary"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <img
                            className="dropdown"
                            src="/img/arrow-bottom.svg"
                            alt=""
                          />
                        </span>
                      </a>
                    </div>
                  </div>

                  <div
                    class="collapse"
                    // id={`collapseExample${data?.id}`}
                    id={`collapseExample`}
                  >
                    <hr className="mb-4 mt-0" />
                    <div class="card-body card-footer-ss pb-4 px-4 pt-0">
                      <p
                        dangerouslySetInnerHTML={{
                          // __html: data?.deskripsi,
                          __html: `Rp.250.000`,
                        }}
                        className="color-dark fw-semibold fs-16-ss"
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
              {/* );
              })} */}
              <div className="dropdown dropdown-ss d-flex flex-column">
                <button
                  className="btn-tambah-kegiatan-item rounded-ss p-4 d-flex align-items-center justify-content-center color-primary fs-18-ss fw-semibold text-decoration-none mb-4"
                  style={{ minHeight: "84px" }}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaPlus className="me-2" /> Tambah
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1 w-100"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalUjianPenerimaan"
                    >
                      <img
                        src="/img/icon-ujian-penerimaan-ppdb.svg"
                        alt="icon-kegiatan"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">
                        Ujian Penerimaan
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalKeterangan"
                    >
                      <img
                        src="/img/icon-keterangan-ppdb.svg"
                        alt="icon-keterangan-ppdb"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">Keterangan</span>
                    </a>
                  </li>
                  <li
                  //  onClick={() => setInitialFormData()}
                  >
                    <a
                      className="dropdown-item pointer d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#modalTambahBiaya"
                    >
                      <img
                        src="/img/icon-biaya-tambahan-ppdb.svg"
                        alt="icon-biaya-tambahan"
                        className="me-2"
                      />
                      <span className="color-dark fw-semibold">
                        Biaya Tambahan
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </JalurPendaftaranLayout>

        <ModalUjianPenerimaan
        // _getAlurPPDB={_getAlurPPDB}
        // editData={editData}
        // isEdit={isEdit}
        />
        <ModalTambahBiaya />
        <ModalKeterangan />
        {/* <div className="card card-ss my-4">
          <nav className="d-flex justify-content-between align-items-center p-4">
            <h5 className="fw-bold">Pendaftar</h5>
          </nav>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table-ss">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>No Telp</th>
                    <th>Tanggal Mendaftar</th>
                    <th>Status</th>
                    <th>Cek Berkas</th>
                    <th>Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {pendaftar?.map((data, idx) => {
                    return (
                      <tr key={`${idx}-${new Date().getTime()}`}>
                        <td data-th="Nama">{data.user?.nama}</td>
                        <td data-th="No Telp">{data.user?.whatsapp}</td>
                        <td data-th="Tanggal Mendaftar">
                          {getTimeFromNow(data.createdAt)}
                        </td>
                        <td data-th="Status">
                          {statusKonfirmasi(gelombang?.biayaPendaftaran, data)}
                        </td>
                        <td data-th="Berkas">
                          <Link href={`${ssURL}/pendaftar-ppdb/${data?.id}`}>
                            <button className="btn btn-primary rounded-circle">
                              <FaFileDownload />
                            </button>
                          </Link>
                        </td>
                        <td className="actions">
                          <button
                            className={`btn btn-${
                              data.diverifikasi ? "success" : "danger"
                            } rounded-circle`}
                          >
                            {data.diverifikasi ? <FaCheck /> : <FaTimes />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
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
