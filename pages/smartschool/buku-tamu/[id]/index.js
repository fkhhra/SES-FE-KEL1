import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { getDetailBukuTamu } from "../../../../client/BukuTamuClient";
import { ssURL } from "../../../../client/clientAxios";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { momentPackage } from "../../../../utilities/HelperUtils";

const BukuTamuPageDetail = ({ id }) => {
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
          <div className="col-md-8">
            <div
              className={`d-flex justify-content-between
              `}
            >
              <Link href={`${ssURL}/buku-tamu`}>
                <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            {/* Card Timeline Detail Start */}

            <div className="card card-ss p-4 pb-5 mt-3 mb-4">
              {/* Dropdown Option End */}
              <div className="d-flex align-items-center justify-content-md-between flex-md-row flex-column">
                <div className="d-flex align-items-center mb-4 flex-md-row flex-column">
                  <h2 className="color-dark fw-black mb-2">
                    Detail Informasi Buku Tamu
                  </h2>
                </div>
              </div>

              <div
                className="rounded-ss p-4 mb-4"
                style={{
                  background: "rgba(244,244,247,.65)",
                }}
              >
                <table>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Nama Lengkap</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.nama ? `-` : `${buku?.nama}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Nomor Telepon</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.noHp ? `-` : `${buku?.noHp}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Asal Intansi</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.instansi ? `-` : `${buku?.instansi}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Bidang Intansi</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.bidang ? `-` : `${buku?.bidang}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Alamat</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.alamat ? `-` : `${buku?.alamat}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Keterangan</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.keterangan ? `-` : `${buku?.keterangan}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Tanggal Kehadiran</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.tanggalDibuat
                          ? `-`
                          : `${momentPackage(buku?.tanggalDibuat).format(
                              "dddd, DD MMMM YYYY"
                            )}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss">Waktu</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!buku?.tanggalDibuat
                          ? `-`
                          : `${momentPackage(buku?.tanggalDibuat).format(
                              "hh:mm:ss"
                            )}`}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              <img
                src={buku?.ttd}
                alt="tanda tangan"
                className="w-100 img-fit-contain rounded-ss"
                style={{
                  height: "100px",
                  background: "rgba(244,244,247,.65)",
                }}
              />
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

export default BukuTamuPageDetail;
