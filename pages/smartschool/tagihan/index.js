import Layout from "../../../components/Layout/Layout";
import { motion } from "framer-motion";
import { ssURL } from "../../../client/clientAxios";
import Link from "next/link";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import { getPembayaranSiswa } from "../../../client/PembayaranClient";
import { useEffect, useState } from "react";
import { currencyFormatter } from "../../../utilities/HelperUtils";
import {
  checkStatusLunas,
  styleStatusLunas,
} from "../../../utilities/TagihanUtils";

const index = ({ nav }) => {
  const [tagihanData, setTagihanData] = useState({});
  const { pembayaran: listTagihan, rekSekolah } = tagihanData || {};

  const _getPembayaranSiswa = async () => {
    const params = {
      status: nav ? nav : "belum lunas",
    };

    const { data } = await getPembayaranSiswa(params);
    if (data) {
      setTagihanData(data);
    }
  };

  const navItems = [
    {
      url: `${ssURL}/tagihan?nav=belum lunas`,
      as: `${ssURL}/tagihan?nav=belum lunas`,
      text: "Belum Lunas",
      active: nav == "belum lunas" || nav == undefined,
    },
    {
      url: `${ssURL}/tagihan?nav=lunas`,
      as: `${ssURL}/tagihan?nav=lunas`,
      text: "Lunas",
      active: nav == "lunas",
    },
  ];

  useEffect(() => {
    _getPembayaranSiswa();
  }, [nav]);

  const renderStatus = (status) => {
    let className = "";
    let text = "";

    switch (status) {
      case "belum lunas":
        className = "bg-soft-danger color-danger";
        text = "Belum Lunas";
        break;
      case "sudah lunas":
        className = "bg-soft-success color-success";
        text = "Sudah Lunas";
        break;
      case "menunggu konfirmasi":
        className = "bg-light-primary color-primary";
        text = "Menunggu Konfirmasi";
        break;
    }

    return {
      className,
      text,
    };
  };

  const CardTagihan = ({ status, tagihan }) => {
    return (
      <>
        <div className="col-md-12">
          <div className="card card-ss">
            <div className="card-header-ss px-4 py-3">
              <div className="d-flex align-items-center justify-content-between">
                <span className={styleStatusLunas(tagihan)}>
                  {checkStatusLunas(tagihan)}
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              <hr className="mt-0 mb-4" />
              <div className="px-4 pb-4">
                <div className="d-flex flex-sm-row flex-column">
                  <div
                    className="rounded-circle shadow-primary-ss me-sm-4 mb-sm-0 mb-3 mx-sm-0 mx-auto"
                    style={{
                      width: "70px",
                      height: "70px",
                    }}
                  >
                    <img
                      src={`/img/${
                        status == "belum lunas" ||
                        status == "menunggu-konfirmasi"
                          ? "icon-notif-pembayaran-alert.svg"
                          : "icon-notif-pembayaran-check.svg"
                      }`}
                      alt="icon"
                      width="70px"
                      height="70px"
                    />
                  </div>
                  <div>
                    <h4 className="fw-extrabold color-dark">
                      {`${tagihan?.rombelPembayaran?.pembayaran?.nama} ${
                        tagihan?.rombelPembayaran?.pembayaran?.bulan == null
                          ? ""
                          : `- ${tagihan?.rombelPembayaran?.pembayaran?.bulan}`
                      }`}
                      {/* {tagihan?.rombelPembayaran?.pembayaran?.nama} */}
                    </h4>
                    <h6 className="fw-bold color-dark mb-sm-2 mb-3 mt-sm-0 mt-3">
                      Dikirim Kepada
                    </h6>
                    <div className="d-sm-flex d-none">
                      <div className="me-4">
                        <div className="fw-semibold fs-14-ss mb-2">
                          Nomor Rekening
                        </div>
                        <div className="fw-semibold fs-14-ss mb-0">
                          Penerima
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold fs-14-ss mb-2">
                          {" "}
                          :{" "}
                          <span className="fw-extrabold">
                            {rekSekolah?.norek} - {rekSekolah?.bank}
                          </span>
                        </div>
                        <div className="fw-semibold fs-14-ss mb-0">
                          {" "}
                          :{" "}
                          <span className="fw-extrabold">
                            {rekSekolah?.nama}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-sm-none d-flex flex-column">
                      <div className="mb-2">
                        <div className="fw-semibold fs-14-ss">
                          Nomor Rekening
                        </div>
                        <div className="fw-extrabold fs-14-ss mb-0">
                          {rekSekolah?.norek} - {rekSekolah?.bank}
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold fs-14-ss">Penerima</div>
                        <div className="fw-extrabold fs-14-ss mb-0">
                          {rekSekolah?.nama}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card-footer-ss px-4 py-3"
              style={{ backgroundColor: `rgba(238, 245, 255, .25)` }}
            >
              <div className="d-flex align-items-sm-center justify-content-sm-between flex-sm-row flex-column">
                <h5
                  className="fw-semibold mb-sm-0 mb-3 
                    "
                >
                  Total Tagihan :{" "}
                  <span className="fw-extrabold color-danger">
                    {`${
                      parseInt(tagihan?.rombelPembayaran?.pembayaran?.nominal) -
                        parseInt(
                          tagihan?.riwayat?.reduce(
                            (a, b) => a + parseInt(b.nominal),
                            0
                          )
                        ) <
                      0
                        ? "+"
                        : ""
                    } ${currencyFormatter(
                      Math.abs(
                        tagihan?.rombelPembayaran?.pembayaran?.nominal -
                          tagihan?.riwayat?.reduce(
                            (a, b) => a + parseInt(b.nominal),
                            0
                          )
                      )
                    )}`}
                  </span>
                </h5>
                <h5
                  className="fw-semibold mb-sm-0 mb-3 
                    "
                >
                  Total Dibayar :{" "}
                  <span className="fw-extrabold color-primary">
                    {currencyFormatter(
                      tagihan?.riwayat?.reduce(
                        (a, b) => a + parseInt(b.nominal),
                        0
                      )
                    )}
                  </span>
                </h5>
                <Link
                  href={`${ssURL}/tagihan/[id]`}
                  as={`${ssURL}/tagihan/${tagihan?.id}`}
                >
                  <a className="text-decoration-none d-flex flex-column">
                    <button className="btn btn-ss btn-primary btn-primary-ss bg-gradient-primary shadow-primary-ss rounded-pill fs-14-ss fw-bold">
                      Bayar Sekarang
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout isIndex={true} modalWrapper={<></>}>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row">
            <div className="col-md-12">
              <Navbar
                nav={navItems}
                action={[
                  {
                    button: <></>,
                  },
                ]}
              />
            </div>
          </div>
          <div className="row gy-4">
            {listTagihan?.map((tagihan) => (
              <CardTagihan tagihan={tagihan} status={tagihan?.status} />
            ))}
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({ query: { nav } }) {
  return {
    props: {
      nav: nav || null,
    },
  };
}

export default index;
