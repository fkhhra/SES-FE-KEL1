import { useRouter } from "next/router";
import { baseURL, downloadURL, ssURL } from "../../client/clientAxios";
import AnimatePage from "../Shared/AnimatePage/AnimatePage";
import Link from "next/link";
import { getKonsultasi, rekapKonsultasi } from "../../client/KonsultasiClient";
import { useEffect, useState } from "react";
import { momentPackage } from "../../utilities/HelperUtils";

const DaftarPengajuanKonsultasi = () => {
  const router = useRouter();

  const { query } = router;
  const { nav } = query || "";

  const [kunjungan, setKunjungan] = useState({});
  const { bukuKunjungan } = kunjungan;

  const showDetail = (id) => {
    const path = `${ssURL}/konsultasi?menu=buku-kunjungan&nav=${
      !nav ? "pengajuan" : nav
    }&detail=pengajuan&id=${id}`;
    router.push(path);
  };

  const listFilterMenu = [
    {
      text: "Pengajuan",
      url: `${ssURL}/konsultasi?menu=buku-kunjungan&nav=pengajuan`,
    },
    {
      text: "Diterima",
      url: `${ssURL}/konsultasi?menu=buku-kunjungan&nav=diterima`,
    },
    {
      text: "Ditolak",
      url: `${ssURL}/konsultasi?menu=buku-kunjungan&nav=ditolak`,
    },
    {
      text: "Selesai",
      url: `${ssURL}/konsultasi?menu=buku-kunjungan&nav=selesai`,
    },
  ];

  const isActive = (current) => {
    if (router.query.nav === undefined && current.includes("pengajuan")) {
      // if nav is undefined set active menu to -> pengajuan
      return true;
    } else {
      return current.includes(router.query.nav);
    }
  };

  const getTitle = () => {
    if (!nav || nav === "pengajuan") {
      return "Pengajuan Konsultasi";
    } else if (nav === "diterima") {
      return "Konsultasi Diterima";
    } else if (nav === "ditolak") {
      return "Konsultasi Ditolak";
    } else {
      return "Konsultasi Selesai";
    }
  };

  const _getKonsultasiSaya = async () => {
    const { data } = await getKonsultasi({
      tipe: "buku",
      nav: !nav ? "pengajuan" : nav,
    });
    data && setKunjungan(data);
  };

  const rekapDataKonsultasi = async () => {
    const { data } = await rekapKonsultasi();
    if (data) {
      window.open(`${downloadURL}/${data}`, "_blank");
    }
  };

  useEffect(() => {
    _getKonsultasiSaya();
  }, [nav]);

  return (
    <AnimatePage>
      <div className="card-body p-0 bg-white py-2 px-3 rounded-ss">
        <h2 className="color-dark fw-black mb-2">
          <img src="/img/icon-buku-absen.svg" />
          Buku Kunjungan
        </h2>
        <div className="row mt-4">
          <div className="col-md-8 pe-2">
            <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss color-secondary mb-2">Pengajuan</p>
                <p className="fs-18-ss fw-bold color-dark m-0">0 Siswa</p>
              </div>
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss color-secondary mb-2">Diproses</p>
                <p className="fs-18-ss fw-bold color-dark m-0">0 Siswa</p>
              </div>
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss color-secondary mb-2">Ditolak</p>
                <p className="fs-18-ss fw-bold color-dark m-0">0 Siswa</p>
              </div>
              <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                <p className="fs-14-ss color-secondary mb-2">Selesai</p>
                <p className="fs-18-ss fw-bold color-dark m-0">0 Siswa</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 ps-2">
            <div
              className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100"
              onClick={rekapDataKonsultasi}
            >
              <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                <img
                  src="/img/icon-rekap-pembayaran.svg"
                  alt="icon-rekap-pembayaran"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
                <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                  Rekap Kunjungan
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-very-soft-secondary mt-3 py-4 px-3"
          style={{ margin: "0 -16px -8px -16px", overflow: "hidden" }}
        >
          <div style={{ display: "inline-flex", gap: "48px" }}>
            {listFilterMenu.map((menu, index) => (
              <Link href={menu.url}>
                <a>
                  <h6
                    className={`${
                      isActive(menu.url) ? "color-primary" : "color-secondary"
                    } fw-bold`}
                  >
                    {menu.text}
                  </h6>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-ss mt-4">
        <div className="card-header card-header-ss p-0 pt-4">
          <div className="d-flex justify-content-between align-items-sm-center flex-md-row flex-column px-4">
            <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
              {getTitle()}
            </h4>
            <section className="d-flex flex-md-row flex-column">
              <input
                type="text"
                className="form-control form-search form-search-mutasi rounded-pill fw-semibold border-secondary-ss w-100 mb-3 mb-md-0  me-0 me-md-4"
                style={{ height: "42px", width: "100%" }}
                id="exampleFormControlInput1"
                placeholder="Cari Guru"
              />
            </section>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table-ss" data-joyride="table-prestasi">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Tanggal Pengajuan</th>
                <th>Keperluan</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {bukuKunjungan?.data?.length > 0 ? (
                bukuKunjungan?.data?.map((dt, index) => (
                  <tr key={`${index}-${new Date().getTime()}`}>
                    <td data-th="No">{index + 1}</td>
                    <td data-th="Nama Siswa">{dt?.user?.nama}</td>
                    <td data-th="Tanggal Pengajuan">
                      {momentPackage(dt?.createdAt).format("DD MMMM YYYY")}
                    </td>
                    <td data-th="Keperluan">{dt?.keperluan}</td>
                    <td data-th="Detaill">
                      <button
                        className="btn btn-primary-ss rounded-pill px-3 py-1 text-decoration-none fs-12-ss shadow-primary-ss"
                        onClick={() => showDetail(dt?.id)}
                      >
                        Proses
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Belum ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatePage>
  );
};

export default DaftarPengajuanKonsultasi;
