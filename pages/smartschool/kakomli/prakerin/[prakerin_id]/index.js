import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { ssURL } from "client/clientAxios";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import { getDetailPrakerin } from "client/KakomliClient";
import useTa from "hooks/useTa";
import { momentPackage } from "utilities/HelperUtils";

const DetailKakomliPrakerin = ({ prakerin_id, m_ta_id }) => {
  const [detailBarang, setDetailBarang] = useState({});
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [editData, setEditData] = useState(null);
  const { ta } = useTa();

  const _getDetailKakomliPrakerin = async () => {
    setLoading(true);
    const { data } = await getDetailPrakerin(prakerin_id, {
      m_ta_id: ta.id,
    });
    if (data) {
      setSiswa(data?.siswa);
    }
    setLoading(false);
  };
  //   const handleClickEdit = (editData) => {
  //     setEditData(editData);
  //   };
  useEffect(() => {
    _getDetailKakomliPrakerin();
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
              <Link href={`${ssURL}/kakomli/prakerin`}>
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
                      <p className="mb-2 fs-18-ss fw-semibold">Perusahaan</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.prakerinSiswa?.[0].namaPerusahaan}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Alamat Perusahaan
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.prakerinSiswa?.[0].alamatPerusahaan}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">Telepon</p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.prakerinSiswa?.[0].teleponPerusahaan}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Kontak Narahubung
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.prakerinSiswa?.[0].kontakNarahubung}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Guru Pembimbing{" "}
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {siswa?.prakerinSiswa?.[0].pembimbing}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Tanggal Berangkat
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {momentPackage(
                          siswa?.prakerinSiswa?.[0].tanggalBerangkat
                        ).format("DD MMM YYYY")}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="align-text-top" style={{ width: "50%" }}>
                      <p className="mb-2 fs-18-ss fw-semibold">
                        Tanggal Jemput
                      </p>
                    </td>
                    <td className="align-text-top" style={{ width: "5%" }}>
                      <p className="mb-2 fs-18-ss fw-extrabold">:</p>
                    </td>
                    <td className="align-text-top">
                      <p className="mb-2 fs-18-ss fw-extrabold color-dark">
                        {momentPackage(
                          siswa?.prakerinSiswa?.[0].tanggalJemput
                        ).format("DD MMM YYYY")}
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

export async function getServerSideProps({
  params: { prakerin_id },
  query: { m_ta_id },
}) {
  return {
    props: {
      prakerin_id: prakerin_id || null,
      m_ta_id: m_ta_id || "",
    },
  };
}

export default DetailKakomliPrakerin;
