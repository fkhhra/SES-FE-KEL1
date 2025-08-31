import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link"
import { getDetailPrestasi } from "client/PrestasiClient";
import { momentPackage } from "utilities/HelperUtils";

const index = ({ id }) => {

  const [detailPrestasi, setDetailPrestasi] = useState(null);

  const _getDetailPrestasi = async () => {
    const { data } = await getDetailPrestasi(id);
    if (data) {
      setDetailPrestasi(data?.prestasi);
    }
  }

  useEffect(() => {
    _getDetailPrestasi();
  }, []);

  return (
    <Layout>
      <AnimatePage>
        <section className="banner banner-kegiatan position-absolute"></section>
        <div className="row mb-4 justify-content-center">
          <div className="col-md-7">
            <Link href={`${ssURL}/prestasi`}>
              <a className="text-decoration-none fw-bolder position-relative text-white pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="card card-ss mt-4">
              <div className="card-body py-4 px-4">
                <h4 className="color-dark fw-black mb-1">
                  {detailPrestasi?.user?.nama}
                </h4>

                <div style={{ background: "#F4F4F7" }} className="rounded-ss py-2 px-4 mt-3">
                  <table
                    style={{
                      width: "100%",
                    }}
                  >
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          Nama Prestasi
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.nama || "--"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          Lembaga
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.lembaga || "--"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          Peringkat
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.peringkat || "--"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          Tanggal Terbit Sertifikat
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.tanggalTerbit ? momentPackage(detailPrestasi?.tanggalTerbit).format("DD MMMM YYYY") : "--"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          Tanggal Kadaluarsa Sertifikat
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.tanggalKadaluarsa ? momentPackage(detailPrestasi?.tanggalKadaluarsa).format("DD MMMM YYYY") : "--"}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "50%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-semibold color-secondary">
                          ID Sertifikat
                        </p>
                      </td>
                      <td
                        className="align-text-top py-2"
                        style={{ width: "2%" }}
                      >
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          :
                        </p>
                      </td>
                      <td className="align-text-top py-2">
                        <p className="mb-0 fs-18-ss fw-extrabold color-dark">
                          {detailPrestasi?.idSertifikat}
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
                { detailPrestasi?.lampiran?.length == 0
                  ? (
                    <div
                      className="py-3 px-3 rounded-ss mt-3 d-flex align-items-center justify-content-center pointer"
                      style={{ background: "#F4F4F7" }}
                    >
                      <img src="/img/icon-lampiran-empty.svg" />
                      <h3 className="color-secondary fw-extrabold mb-0 ms-3" style={{ fontSize: "20px" }}>
                        Tidak ada lampiran sertifikat
                      </h3>
                    </div>
                  ) : (
                    <div
                      className="bg-light-primary py-3 px-3 rounded-ss mt-3 d-flex align-items-center justify-content-center pointer"
                      onClick={() => window.open(detailPrestasi?.lampiran?.[0], "_blank")}
                      style={detailPrestasi?.lampiran?.length == 0 ? { background: "#F4F4F7 !important" } : {}}
                    >
                      <img src="/img/icon-lihat-sertifikat.svg" />
                      <h3 className="color-dark fw-extrabold mb-0 ms-3" style={{ fontSize: "20px" }}>Lihat Sertifikat</h3>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
}) {
  return {
    props: {
      id: id || null,
    },
  };
}

export default index;
