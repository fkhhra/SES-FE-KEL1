import usePPDB from "hooks/usePPDB";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ppdbURL, ssURL } from "../../../client/clientAxios";
import swal from "sweetalert";
import { getGelombangPPDB } from "../../../client/GelombangPPDB";
import { postPendaftarPPDB, deletePendaftarPPDB } from "../../../client/PendaftarPPDBClient";
import Layout from "../../../components/PPDB/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../hooks/useSekolah";
import useTa from "../../../hooks/useTa";
import useUser from "../../../hooks/useUser";
import { momentPackage } from "../../../utilities/HelperUtils";
import {
  checkGelombang,
  checkIconGelombang,
  checkLabelGelombang,
  checkStatusGelombang,
  infoGelombang,
} from "../../../utilities/PPDBUtils";


const DashboardPPDBPage = () => {
  const { sekolah } = useSekolah();
  const { ta } = useTa();
  const { setTerdaftar } = usePPDB();

  const [gelombangPPDB, setGelombangPPDB] = useState({});
  const { gelombang, terdaftar, terdaftarPembelian, gelombangAktif } = gelombangPPDB;
  const [activeGelombang, setActiveGelombang] = useState(null);

  // console.log('gelombangppdb', gelombangPPDB)
  // console.log('terdaftar', terdaftar)
  // console.log('gelombangaktif', gelombangAktif)
  const { user } = useUser();

  const router = useRouter();

  const _getGelombangPPDB = async () => {
    const selectedGelombangId = localStorage.getItem("selectedGelombangId"); // Ambil dari localStorage
    const { data } = await getGelombangPPDB({ gelombangId: selectedGelombangId });

    if (data) {
      setGelombangPPDB(data);
      setTerdaftar(data.terdaftar);

      if (!gelombangAktif && data.gelombangAktif) {
        setActiveGelombang(data.gelombangAktif); // Pastikan tetap menggunakan gelombang yang dipilih
      }
    }
  };

  const _setGelombangAktif = (selectedGelombang) => {
    // console.log("[DEBUG] Mengatur gelombang aktif:", selectedGelombang);
    localStorage.setItem("selectedGelombangId", selectedGelombang.pendaftar1.id); // Simpan di localStorage
    setActiveGelombang(selectedGelombang);
    router.push(`${ppdbURL}/biodata`);
  };

  const _postPendaftarPPDB = async (d) => {
    if (infoGelombang(d.keterangan)) {
      return toast.error(infoGelombang(d.keterangan));
    }

    const payload = {
      mGelombangPpdbId: d.id,
    };

    const { data, error } = await postPendaftarPPDB(payload);

    if (data) {
      // Simpan ID pendaftar (pendaftarId) ke localStorage
      localStorage.setItem('selectedGelombangId', data.pendaftarId);

      toast.success(data?.message);
      router.push(`${ppdbURL}/bayar-pendaftaran`);
    } else {
      toast.error(error?.message);
    }
  };
  const _delete = (id) => {
    console.log(id)
    swal({
      title: "Yakin ingin dihapus?",
      text: "Jika anda membatalkan pendaftaran. Data yang telah dimasukkan masih tetap tersimpan.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePendaftarPPDB(id);
        if (data) {
          // toast.success(data?.message);
          toast.success('Data Pendaftaran Berhasil Dihapus');

          //  Hapus dari localStorage jika ID yang dihapus sama dengan yang tersimpan
          const selectedGelombangId = localStorage.getItem("selectedGelombangId");
          if (selectedGelombangId && selectedGelombangId === id.toString()) {
            localStorage.removeItem("selectedGelombangId");
          }
          _getGelombangPPDB();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };


  useEffect(() => {
    _getGelombangPPDB();
  }, []);

  useEffect(() => {
    if (sekolah?.id == 9487) {
      router.push(`${ppdbURL}/pengumuman-kelulusan`);
    }
  }, [sekolah]);

  const dataStatus = {
    menungguSeleksiBerkas: {
      text: "Menunggu Seleksi Berkas",
      color: "color-warning",
      warna: "warning",
      icon: "menunggu-seleksi-berkas",
    },
    menungguKonfirmasiPembayaran: {
      text: "Menunggu Konfirmasi Pembayaran",
      color: "color-warning",
      warna: "warning",
      icon: "menunggu-konfirmasi-pembayaran",
    },
    menungguSeleksiUjian: {
      text: "Menunggu Seleksi Ujian",
      color: "color-warning",
      warna: "warning",
      icon: "menunggu-seleksi-ujian",
    },
    menungguHasilPengumuman: {
      text: "Menunggu Hasil Pengumuman",
      color: "color-warning",
      warna: "warning",
      icon: "menunggu-hasil-pengumuman",
    },
    berkasTerkonfirmasi: {
      text: "Berkas Terkonfirmasi",
      color: "color-success",
      warna: "success",
      icon: "berkas-terkonfirmasi",
    },
    pembayaranTerkonfirmasi: {
      text: "Pembayaran Terkonfirmasi",
      color: "color-success",
      warna: "success",
      icon: "pembayaran-terkonfirmasi",
    },
    lulusSeleksi: {
      text: "Lulus Seleksi",
      color: "color-success",
      warna: "success",
      icon: "lulus-seleksi",
    },
    tidakLulusSeleksi: {
      text: "Tidak Lulus Seleksi",
      color: "color-danger",
      warna: "danger",
      icon: "tidak-lulus-seleksi",
    },
  };

  return (
    <Layout isIndex>
      <AnimatePage>
        <div className="container-fluid py-4 px-xl-5 px-4">
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="alert-hallo rounded-ss bg-soft-primary p-4 position-relative d-flex justify-content-between mb-4 d-lg-none flex-column flex-sm-row">
                <>
                  <div className="alert-hallo-content order-sm-1 order-2">
                    <h3 className="fw-extrabold color-dark text-capitalize mt-lg-0 mt-md-4 mt-0">
                      Halo, Selamat Datang {user?.nama}
                    </h3>
                    <p className="color-secondary m-0">
                      Selamat mendaftar di {user?.sekolah?.nama}
                    </p>
                  </div>
                  <div className="text-center order-sm-2 order-1">
                    <img
                      src={`/img/illustrasi-dashboard-ppdb.png`}
                      alt="illustrasi-dashboard"
                      className="img-fluid"
                      style={{
                        width: "250px",
                      }}
                    />
                  </div>
                </>
              </div>
              <div className="rounded-ss bg-soft-primary p-5 position-relative d-flex justify-content mb-4 d-none d-lg-block">
                <>
                  <div className="alert-hallo-content-admin">
                    <h1 className="fw-extrabold color-dark text-capitalize mb-1">
                      Halo, Selamat Datang
                    </h1>
                    <h1 className="fw-extrabold color-dark text-capitalize">
                      {user?.nama}
                    </h1>
                    <h4 className="color-secondary m-0">
                      Selamat mendaftar di {user?.sekolah?.nama}
                    </h4>
                  </div>
                  <img
                    src={`/img/illustrasi-dashboard-ppdb.png`}
                    alt="illustrasi-dashboard"
                    className="position-absolute"
                    style={{
                      height: "290px",
                      top: "-8%",
                      right: "3%",
                    }}
                  />
                </>
              </div>
            </div>
          </div>

          {momentPackage().format("YYYY-MM-DD HH:mm") >=
            momentPackage("2024-05-10 17:00").format("YYYY-MM-DD HH:mm") && (
              <>
                {(sekolah?.id == 9487 || sekolah?.id == 9489) &&
                  terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                  "berkasTerkonfirmasi" ? (
                  <>
                    <div className="rounded-ss bg-soft-primary p-5 position-relative d-flex justify-content mb-4 d-none d-lg-block">
                      <>
                        <div className="alert-hallo-content-admin">
                          <h1 className="fw-extrabold color-dark text-capitalize mb-1">
                            SELAMAT! ANANDA LULUS TAHAP ADMINISTRASI BERKAS
                          </h1>
                        </div>
                      </>
                    </div>
                  </>
                ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                  terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                  "menungguSeleksiBerkas" ? (
                  <>
                    <div className="rounded-ss bg-soft-danger p-5 position-relative d-flex justify-content mb-4 d-none d-lg-block">
                      <>
                        <div className="alert-hallo-content-admin">
                          <h1 className="fw-bold color-dark text-capitalize mb-1">
                            MOHON MAAF, ANANDA TIDAK LULUS TAHAP ADMINISTRASI
                            KARENA BELUM MEMENUHI PERSYARATAN
                          </h1>
                        </div>
                      </>
                    </div>
                  </>
                ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                  terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                  "tidakLulusSeleksi" ? (
                  <>
                    <div className="rounded-ss bg-soft-danger p-5 position-relative d-flex justify-content mb-4 d-none d-lg-block">
                      <>
                        <div className="alert-hallo-content-admin">
                          <h1 className="fw-bold color-dark text-capitalize mb-1">
                            MOHON MAAF! ANANDA TIDAK DITERIMA DI MTsN{" "}
                            {sekolah?.id == 9487 ? "1" : "3"} KOTA PADANG
                          </h1>
                        </div>
                      </>
                    </div>
                  </>
                ) : (sekolah?.id == 9487 || sekolah?.id == 9489) &&
                  terdaftar?.filter((d) => d?.jalur)?.[0]?.pendaftar1?.status ==
                  "lulusSeleksi" ? (
                  <>
                    <div className="rounded-ss bg-soft-primary p-5 position-relative d-flex justify-content mb-4 d-none d-lg-block">
                      <>
                        <div className="alert-hallo-content-admin">
                          <h1 className="fw-extrabold color-dark text-capitalize mb-1">
                            SELAMAT! ANANDA DITERIMA DI MTsN{" "}
                            {sekolah?.id == 9487 ? "1" : "3"} KOTA PADANG
                          </h1>
                        </div>
                      </>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            )}
          <br />
          <div className="row justify-content-center">
            <div className="col-md-10">
              {/* <div className="card card-ss mb-4" id="pengumuman-ppdb">
                <div className="card-body p-4 position-relative">
                  <span>
                    <img
                      src="/img/icon-pengumuman-ppdb.svg"
                      alt=""
                      className="position-absolute"
                      style={{
                        top: "-75px",
                        left: "-12px",
                      }}
                    />
                  </span>
                  <h2 className="h2 fw-extrabold color-dark text-capitalize mt-5 title-page position-relative">
                    Pengumuman PPDB
                  </h2>
                  <div className="d-flex align-items-center mt-5">
                    <img src="/img/icon-list-pengumuman-ppdb.svg" alt="" />
                    <div className="">
                      <h6 className="fs-18-ss ">
                        Jalur PPDB Gelombang 3 sudah dibuka
                      </h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <img src="/img/icon-danger-pengumuman-ppdb.svg" alt="" />
                    <div className="">
                      <h6 className="fs-18-ss">
                        Anda wajib mengikuti Ujian Seleksi PPDB Jalur Seleksi
                        Reguler - Gelombang 1
                      </h6>
                    </div>
                  </div>
                </div>
              </div> */}

              {sekolah?.id == 14 || sekolah?.id == 13 || sekolah?.id == 121 ? (
                <>
                  <div className="card card-ss mb-4">
                    <div
                      className="card-header card-header-ss p-4"
                      id="tabel-pendaftaran-ppdb"
                    >
                      <h2 className="h2 fw-extrabold color-dark text-capitalize title-page position-relative">
                        Tabel Pendaftaran
                      </h2>
                      <p className="fs-18-ss mt-5">
                        Dibawah ini merupakan jalur pendaftaran yang anda pilih.
                      </p>
                    </div>
                    <div className="card-body p-0 pb-4 ">
                      <div className="table-responsive">
                        <table className="table-ss">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Pilihan Jalur</th>
                              <th>Status</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {terdaftarPembelian
                              ?.filter((d) => d?.jalur?.tipe == "Pembelian")
                              ?.map((d, idx) => {
                                return (
                                  <tr>
                                    <td className="fs-6" data-th="No">
                                      {idx + 1}
                                    </td>
                                    <td
                                      className="fs-6 fw-bold color-dark"
                                      data-th="Pilihan Jalur"
                                    >
                                      {d?.nama}
                                    </td>
                                    <td>
                                      <span
                                        className={`bg-soft-${dataStatus[d?.pendaftar1?.status]
                                          ?.warna
                                          } rounded-pill ${dataStatus[d?.pendaftar1?.status]
                                            ?.color
                                          } justify-content-center align-items-center fw-semibold px-3 py-1 fs-14-ss`}
                                      >
                                        {
                                          dataStatus[d?.pendaftar1?.status]
                                            ?.text
                                        }
                                      </span>
                                    </td>
                                    <td>
                                      {/* <a
                                        href={`${ppdbURL}/pembelian`}
                                        className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss"
                                      >
                                        Lihat
                                      </a> */}
                                      <button
                                        onClick={() => _setGelombangAktif(d)}
                                        className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss"
                                        style={{ border: 'none' }}
                                      >
                                        Lihat
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="card card-ss mb-4">
                    <div
                      className="card-header card-header-ss p-4"
                      id="tabel-pendaftaran-ppdb"
                    >
                      <h2 className="h2 fw-extrabold color-dark text-capitalize title-page position-relative">
                        Tabel Pengembalian
                      </h2>
                      <p className="fs-18-ss mt-5">
                        Dibawah ini merupakan jalur pengembalian yang anda
                        pilih.
                      </p>
                    </div>
                    <div className="card-body p-0 pb-4 ">
                      <div className="table-responsive">
                        <table className="table-ss">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Pilihan Jalur</th>
                              <th>Status</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {terdaftar
                              ?.filter((d) => d?.jalur?.tipe == "Pengembalian")
                              ?.map((d, idx) => {
                                return (
                                  <tr>
                                    <td className="fs-6" data-th="No">
                                      {idx + 1}
                                    </td>
                                    <td
                                      className="fs-6 fw-bold color-dark"
                                      data-th="Pilihan Jalur"
                                    >
                                      {d?.nama}
                                    </td>
                                    <td>
                                      <span
                                        className={`bg-soft-${dataStatus[d?.pendaftar1?.status]
                                          ?.warna
                                          } rounded-pill ${dataStatus[d?.pendaftar1?.status]
                                            ?.color
                                          } justify-content-center align-items-center fw-semibold px-3 py-1 fs-14-ss`}
                                      >
                                        {
                                          dataStatus[d?.pendaftar1?.status]
                                            ?.text
                                        }
                                      </span>
                                    </td>
                                    <td>
                                      {/* <a
                                        href={`${ppdbURL}/biodata`}
                                        className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss"
                                      >
                                        Lihat
                                      </a> */}
                                      <button
                                        onClick={() => _setGelombangAktif(d)}
                                        className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss"
                                        style={{ border: 'none' }}
                                      >
                                        Lihat
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="card card-ss mb-4">
                    <div
                      className="card-header card-header-ss p-4"
                      id="tabel-pendaftaran-ppdb"
                    >
                      <h2 className="h2 fw-extrabold color-dark text-capitalize title-page position-relative">
                        Tabel Pendaftaran
                      </h2>
                      <p className="fs-18-ss mt-5">
                        Dibawah ini merupakan jalur pendaftaran yang anda pilih.
                      </p>
                    </div>
                    <div className="card-body p-0 pb-4 ">
                      <div className="table-responsive">
                        <table className="table-ss">
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Pilihan Jalur</th>
                              <th>Status</th>
                              <th>Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {terdaftar
                              ?.filter((d) => d?.jalur)
                              ?.map((d, idx) => {
                                let status = {};
                                if (
                                  momentPackage().format("YYYY-MM-DD HH:mm") >=
                                  momentPackage("2024-05-10 17:00").format(
                                    "YYYY-MM-DD HH:mm"
                                  )
                                ) {
                                  if (
                                    d?.pendaftar1?.status ==
                                    "menungguKonfirmasiPembayaran" &&
                                    (sekolah?.id == 9487 || sekolah?.id == 9489)
                                  ) {
                                    status =
                                      dataStatus["menungguHasilPengumuman"];
                                  } else if (
                                    d?.pendaftar1?.status ==
                                    "menungguSeleksiBerkas" &&
                                    (sekolah?.id == 9487 || sekolah?.id == 9489)
                                  ) {
                                    status = dataStatus["tidakLulusSeleksi"];
                                  } else if (
                                    sekolah?.id == 9487 ||
                                    sekolah?.id == 9489
                                  ) {
                                    status = dataStatus[d?.pendaftar1?.status];
                                  } else {
                                    status = dataStatus[d?.pendaftar1?.status];
                                  }
                                } else {
                                  status =
                                    dataStatus["menungguHasilPengumuman"];
                                }
                                return (
                                  <tr>
                                    <td className="fs-6" data-th="No">
                                      {idx + 1}
                                    </td>
                                    <td
                                      className="fs-6 fw-bold color-dark"
                                      data-th="Pilihan Jalur"
                                    >
                                      {d?.nama}
                                    </td>
                                    <td>
                                      <span
                                        className={`bg-soft-${status?.warna} rounded-pill ${status?.color} justify-content-center align-items-center fw-semibold px-3 py-1 fs-14-ss`}
                                      >
                                        {status?.text}
                                      </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '4px' }}>
                                      <button
                                        onClick={() => _setGelombangAktif(d)}
                                        className="bg-primary shadow-primary-ss rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss"
                                        style={{ border: 'none' }}
                                      >
                                        Lihat
                                      </button>
                                      <button
                                        className="btn btn-outline-danger btn-outline-danger-ss rounded-pill px-4 fw-bold fs-14-ss"
                                        onClick={() => _delete(d?.pendaftar1?.id)}
                                      >
                                        Batal Daftar
                                      </button>

                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="card card-ss">
                    <div
                      className="card-header card-header-ss p-4"
                      id="jalur-ppdb"
                    >
                      <h2 className="h2 fw-extrabold color-dark text-capitalize title-page position-relative">
                        Jalur{" "}
                        {sekolah?.tingkat == "kampus"
                          ? "Pendaftaran Mahasiswa"
                          : "PPDB"}
                      </h2>
                      <p className="mt-5">
                        Pilih jalur dibawah ini untuk melakukan pendaftaran{" "}
                        {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "PPDB"}.
                      </p>
                    </div>
                    <div className="card-body p-4">
                      {gelombang
                        ?.filter((d) => {
                          return d.jalur;
                        })
                        ?.sort((a, b) => {
                          const x =
                            a?.keterangan == "Akan Dibuka"
                              ? 2
                              : a?.keterangan == "Daftar"
                                ? 1
                                : 3;
                          const y =
                            b?.keterangan == "Akan Dibuka"
                              ? 2
                              : b?.keterangan == "Daftar"
                                ? 1
                                : 3;
                          return x - y;
                        })
                        ?.map((d, idx) => {
                          return (
                            <div className="pb-3">
                              <div
                                className={checkGelombang(d?.keterangan)}
                                onClick={() => _postPendaftarPPDB(d)}
                              >
                                <span
                                  className={checkLabelGelombang(d?.keterangan)}
                                  style={{
                                    width: "134px",
                                    height: "34px",
                                    letterSpacing: "2px",
                                    top: "-20px",
                                  }}
                                >
                                  {checkStatusGelombang(d.keterangan)}
                                </span>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={checkIconGelombang(d.keterangan)}
                                    alt=""
                                  />
                                  <div className="ms-4">
                                    <h4 className="mb-2 fw-extrabold color-dark">
                                      {d.nama} - {d?.jalur?.nama}
                                    </h4>
                                    <h6 className="mb-0 fw-bold">
                                      {`${momentPackage(d?.dibuka).format(
                                        "DD MMMM YYYY HH:mm"
                                      )} - ${momentPackage(d?.ditutup).format(
                                        "DD MMMM YYYY HH:mm"
                                      )}`}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </AnimatePage>
    </Layout>
  );
};

export default DashboardPPDBPage;
