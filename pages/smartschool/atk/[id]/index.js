import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaPen } from "react-icons/fa";
import { formatAngkaUang } from "utilities/HelperUtils";
import { getBarangDetail } from "../../../../client/BarangClient";
import { ssURL } from "../../../../client/clientAxios";
import ModalTambahBarang from "../../../../components/Barang/ModalTambahBarang";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import { momentPackage } from "../../../../utilities/HelperUtils";

var Barcode = require("react-barcode");

const DetailBarangPage = ({ id }) => {
  const [detailBarang, setDetailBarang] = useState({});
  const { barang } = detailBarang;
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  const _getDetailBarang = async () => {
    setLoading(true);
    const { data } = await getBarangDetail(id);
    if (data) {
      setDetailBarang(data);
    }
    setLoading(false);
  };
  const handleClickEdit = (editData) => {
    setEditData(editData);
  };
  useEffect(() => {
    _getDetailBarang();
  }, []);

  return (
    <Layout isIndex>
      <AnimatePage>
        <section className="banner-barang position-absolute"></section>

        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <div
              className={`d-flex justify-content-between
              `}
            >
              <Link href={`${ssURL}/atk`}>
                <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>

            {/* Card Timeline Detail Start */}

            <div className="card card-ss p-4 pb-5 mt-3 mb-4">
              {/* Dropdown Option End */}
              <div className="d-flex align-items-start justify-content-md-between flex-md-row flex-column">
                <div className="d-flex align-items-center mb-4 flex-md-row flex-column">
                  <h2 className="color-dark fw-black mb-2">
                    Detail Informasi Barang
                  </h2>
                </div>
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center text-white pointer"
                  style={{
                    width: "30px",
                    height: "30px",
                    boxShadow: "0 5px 15px rgba(58,65,102,.2)",
                    background: "#EEF5FF",
                  }}
                  data-bs-toggle="modal"
                  data-bs-target="#ModalTambahBarang"
                  onClick={() => handleClickEdit(barang)}
                >
                  <FaPen className="color-secondary" />
                </div>
              </div>

              <div
                className="rounded-ss p-4 mb-4"
                style={{
                  background: "rgba(244,244,247,.65)",
                }}
              >
                <img
                  // src={buku?.ttd}
                  src={barang?.foto?.[0]}
                  alt="tanda tangan"
                  className="w-100 img-fit-contain rounded-ss mb-4 rounded"
                  style={{
                    height: "146px",
                  }}
                />

                <div className="d-flex justify-content-center mb-4">
                  <Barcode value={barang?.id} height={20} />
                </div>

                <table>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Nama Barang</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.nama ? `-` : `${barang?.nama}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Merk</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.merk ? `-` : `${barang?.merk}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        No. Kode Barang
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.kodeBarang ? `-` : `${barang?.kodeBarang}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Asal usul</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.asal ? `-` : `${barang?.asal}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Spesifikasi</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.deskripsi ? `-` : `${barang?.deskripsi}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Harga</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        Rp{formatAngkaUang(barang?.harga)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Tanggal Beli</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.tahunBeli
                          ? `-`
                          : `${momentPackage(barang?.tahunBeli).format(
                              "dddd, DD MMMM YYYY"
                            )}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Kepemilikan</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.kepemilikan ? `-` : `${barang?.kepemilikan}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Nama Pemilik/Peminjam
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.namaPemilik ? `-` : `${barang?.namaPemilik}`}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Lokasi</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {!barang?.lokasi?.nama
                          ? `-`
                          : `${barang?.lokasi?.nama}`}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="rounded-ss">
                <table className="table-ss table-responsive">
                  <thead>
                    <tr>
                      <th className="text-center">Jumlah</th>
                      <th className="text-center">Baik</th>
                      <th className="text-center">Rusak</th>
                    </tr>
                  </thead>
                  <tbody className="p-4">
                    <tr>
                      <td
                        data-th="Jumlah"
                        className="text-left text-md-center td-barang"
                      >
                        <p className="fs-16-ss fw-bold mb-0">
                          {!barang?.jumlah ? `-` : `${barang?.jumlah}`}
                        </p>
                      </td>
                      <td
                        data-th="Baik"
                        className="text-left text-md-center td-barang"
                      >
                        <p className="fs-16-ss fw-bold mb-0">
                          {!barang?.baik ? `-` : `${barang?.baik}`}
                        </p>
                      </td>
                      <td
                        data-th="Rusak"
                        className="text-left text-md-center td-barang"
                      >
                        <p className="fs-16-ss fw-bold mb-0">
                          {!barang?.rusak ? `-` : `${barang?.rusak}`}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <ModalTambahBarang
          editData={editData}
          setEditData={setEditData}
          _getBarang={_getDetailBarang}
        />
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

export default DetailBarangPage;
