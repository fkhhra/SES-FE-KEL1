import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { getDetailUkk } from "client/KakomliClient";
import useTa from "hooks/useTa";
import { momentPackage } from "utilities/HelperUtils";

const DetailKakomliUkk = ({ ukk_id }) => {
  const [detailBarang, setDetailBarang] = useState({});
  //   const { barang } = detailBarang;
  const [loading, setLoading] = useState(false);
  const [siswa, setSiswa] = useState([]);
  const { ta } = useTa();

  const _getDetailUkk = async () => {
    setLoading(true);
    const { data } = await getDetailUkk(ukk_id, { m_ta_id: ta.id });
    if (data) {
      setSiswa(data?.siswa);
    }
    setLoading(false);
  };
  const handleClickEdit = (editData) => {
    setEditData(editData);
  };
  useEffect(() => {
    _getDetailUkk();
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
              <Link href={`${ssURL}/kakomli/ukk`}>
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
                <div className="d-flex  mb-4 flex-md-row flex-column">
                  <div>
                    <h2 className="color-dark fw-black mb-2">{siswa?.nama}</h2>
                    <span className="color-secondary fw-black mb-2">
                      {siswa?.anggotaRombel?.rombel?.nama || "-"}
                    </span>
                  </div>
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
                      <p className="mb-2 fs-18-ss fw-semibold">Tanggal UKK</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.ukkSiswa?.tanggal != null
                          ? momentPackage(siswa?.ukkSiswa?.tanggal).format(
                              "DD MMM YYYY"
                            )
                          : "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Penguji</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.ukkSiswa?.pembimbing || "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Keterangan</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.ukkSiswa?.keterangan || "-"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Catatan</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.ukkSiswa?.catatan || "-"}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              {/* <div className="col-md-12">
                <a
                  className="w-100 rounded-ss btn-cetak p-3 d-flex align-items-center justify-content-center pointer"
                  target="_blank"
                >
                  <img src="/img/icon-print.svg" alt="" />
                  <h5 className="fw-bold color-dark ms-4 mb-0">Cetak</h5>
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { ukk_id } }) {
  return {
    props: {
      ukk_id: ukk_id || null,
    },
  };
}

export default DetailKakomliUkk;
