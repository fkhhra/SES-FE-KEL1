import {
  detailGelombangPPDB,
  downloadGelombangPPDB,
  downloadGelombangPPDBMtsn,
} from "client/GelombangPPDB";
import LayoutPendaftarPPDB from "components/Layout/LayoutPendaftarPPDB";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { createRef, useEffect, useState } from "react";
import { FaChevronLeft, FaCloudDownloadAlt, FaTrashAlt } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import { baseURL, downloadURL, ssURL } from "../../../../client/clientAxios";
import {
  deletePendaftarPPDB,
  konfirmasiPendaftarPPDB,
} from "../../../../client/PendaftarPPDBClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import useSekolah from "../../../../hooks/useSekolah";
import { whatsappLink } from "../../../../utilities/app-helper";
import dataStatus from "data/status-pendaftar.json";
import toast from "react-hot-toast";
import swal from "sweetalert";
import { Spin } from "antd";
const Pdf = dynamic(() => import("react-to-pdf"), { ssr: false });

const options = {
  orientation: "potrait",
  unit: "px",
  format: [3508, 2480],
};

const index = ({ id }) => {
  const { nav } = useRouter().query;
  const [loading, setLoading] = useState(false);
  const [gelombang, setGelombang] = useState({});
  const [gelombangs, setGelombangs] = useState([]);
  const { sekolah } = useSekolah();

  const [searchSiswa, setSearchSiswa] = useState("");
  const [downloaded, setDownloaded] = useState(true);

  const _detailGelombangPPDB = async () => {
    const { data } = await detailGelombangPPDB(id);
    if (data) {
      if (data?.gelombang?.pendaftar?.length) {
      }
      setGelombang(data?.gelombang);
      setGelombangs(data?.gelombangs);
    }
  };

  const downloadRekap = async () => {
    setLoading(true);
    if (sekolah?.id == 9487 || sekolah?.id == 9489) {
      const { data } = await downloadGelombangPPDBMtsn(id);
      setDownloaded(false);

      if (data) {
        setLoading(false);
        // document.getElementById("downloadIframe").src = baseURL + data;
        window.open(downloadURL + data, "_blank");
      }
      setDownloaded(true);
      return;
    }
    const { data } = await downloadGelombangPPDB(id);
    setDownloaded(false);

    if (data) {
      setLoading(false);
      // document.getElementById("downloadIframe").src = baseURL + data;
      window.open(downloadURL + data, "_blank");
    }
    setDownloaded(true);
  };

  const _deletePendaftar = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePendaftarPPDB(id);
        if (data) {
          toast.success(data?.message);
          _detailGelombangPPDB();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const kartuRef = createRef();
  const formulirRef = createRef();

  const _konfirmasiPendaftarPPDB = async () => {
    const { data } = await konfirmasiPendaftarPPDB(id);

    if (data) {
      _detailGelombangPPDB();
      window.open(
        whatsappLink(
          gelombang?.user?.whatsapp,
          `Halo, ${gelombang?.user?.nama}. ${data?.message}`
        )
      );
    }
  };

  useEffect(() => {
    _detailGelombangPPDB();
  }, [id]);

  const [userView, setUserView] = useState(true);
  const [statusPendaftar, setStatusPendaftar] = useState("");

  return (
    <LayoutPendaftarPPDB
      listGelombang={gelombangs}
      selectedGelombang={gelombang}
    >
      <AnimatePage>
        <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
        <div className="row gy-4">
          <div className="col-md-12">
            <div className="card card-ss p-4">
              <h4 className="fw-black color-dark mb-4">{gelombang?.nama}</h4>
              <div
                className="status-info p-3 pb-md-3 pb-0 rounded-ss d-flex mb-4 mb-md-0 flex-grow-1 flex-wrap justify-content-sm-start justify-content-between h-100"
                style={{ backgroundColor: "#f8f8fb" }}
              >
                <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-0">
                  <h6 className="fw-bold fs-14-ss  color-secondary mb-2">
                    Jumlah Pendaftar
                  </h6>
                  <h4 className="fw-extrabold fs-5 color-primary m-0">
                    {gelombang?.pendaftar?.length} Orang
                  </h4>
                </div>
                {sekolah?.id !== 9487 && sekolah?.id !== 9489 && (
                  <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-0">
                    <h6 className="fw-bold fs-14-ss color-secondary mb-2">
                      Jumlah Penerimaan
                    </h6>
                    <h5 className="fw-extrabold fs-5 color-primary m-0">
                      {gelombang?.diterima} Orang
                    </h5>
                  </div>
                )}
                <div className="status-info-items mb-lg-0 mb-3 p-0 order-md-1">
                  <h6 className="fw-bold fs-14-ss color-secondary mb-2">
                    Peserta Diterima
                  </h6>
                  <h5 className="fw-extrabold fs-5 color-primary m-0">
                    {gelombang?.pendaftar?.length
                      ? gelombang?.pendaftar?.filter(
                          (d) => d.status == "diterima"
                        ).length
                      : 0}{" "}
                    Orang
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <Spin spinning={loading}>
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header p-4 card-header-ss">
                  <div className="d-flex justify-content-md-between align-items-md-center flex-column flex-md-row ">
                    <div className="col-md-3">
                      <h4 className="fw-extrabold color-dark mb-sm-0 mb-3">
                        Data Pendaftar
                      </h4>
                    </div>
                    <div className="col-md-9 d-flex justify-content-end">
                      <input
                        type="text"
                        className="form-control form-search rounded-pill fw-semibold border-secondary-ss"
                        style={{ height: "42px" }}
                        id="exampleFormControlInput1"
                        placeholder="Cari Pendaftar"
                        autoComplete="off"
                        value={searchSiswa}
                        onChange={(e) => setSearchSiswa(e.target.value)}
                      />
                      <div className="dropdown dropdown-ss d-flex flex-sm-row flex-column">
                        <button
                          className={`dropdown-toggle dropdown-search-perpustakaan-toggle dropdown-sort-perpus-toggle btn py-2 px-4 btn-link rounded-pill border bg-white text-decoration-none color-dark fw-bold ms-3 me-3`}
                          role="button"
                          id="dropdownMenuLink"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          data-joyride="btn-filter-kelas"
                        >
                          {!statusPendaftar || statusPendaftar == "semua"
                            ? "Semua"
                            : statusPendaftar == "menungguSeleksiBerkas"
                            ? "Menunggu Seleksi Berkas"
                            : statusPendaftar == "menungguKonfirmasiPembayaran"
                            ? "Menunggu Konfirmasi Pembayaran"
                            : statusPendaftar == "menungguSeleksiUjian"
                            ? "Menunggu Seleksi Ujian"
                            : statusPendaftar == "menungguHasilPengumuman"
                            ? "Menunggu Hasil Pengumuman"
                            : statusPendaftar == "berkasTerkonfirmasi"
                            ? "Berkas Terkonfirmasi"
                            : statusPendaftar == "pembayaranTerkonfirmasi"
                            ? "Pembayaran Terkonfirmasi"
                            : statusPendaftar == "lulusSeleksi"
                            ? "Lulus Seleksi"
                            : statusPendaftar == "tidakLulusSeleksi"
                            ? "Tidak Lulus Seleksi"
                            : ""}
                        </button>
                        <ul
                          className="dropdown-menu dropdown-menu-ss my-1"
                          aria-labelledby="dropdownMenuLink"
                          style={{ maxHeight: "282px", overflow: "auto" }}
                        >
                          <li>
                            <a
                              className="dropdown-item"
                              onClick={(e) => setStatusPendaftar("semua")}
                            >
                              Semua
                            </a>
                          </li>
                          {sekolah?.id == 9487 || sekolah?.id == 9489 ? (
                            <>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar(
                                      "menungguKonfirmasiPembayaran"
                                    )
                                  }
                                >
                                  Menunggu Hasil Pengumuman
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("berkasTerkonfirmasi")
                                  }
                                >
                                  Berkas Terkonfirmasi
                                </a>
                              </li>
                            </>
                          ) : (
                            <>
                              {" "}
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("menungguSeleksiBerkas")
                                  }
                                >
                                  Menunggu Seleksi Berkas
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar(
                                      "menungguKonfirmasiPembayaran"
                                    )
                                  }
                                >
                                  Menunggu Konfirmasi Pembayaran
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("menungguSeleksiUjian")
                                  }
                                >
                                  Menunggu Seleksi Ujian
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar(
                                      "menungguHasilPengumuman"
                                    )
                                  }
                                >
                                  Menunggu Hasil Pengumuman
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("berkasTerkonfirmasi")
                                  }
                                >
                                  Berkas Terkonfirmasi
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar(
                                      "pembayaranTerkonfirmasi"
                                    )
                                  }
                                >
                                  Pembayaran Terkonfirmasi
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("lulusSeleksi")
                                  }
                                >
                                  Lulus Seleksi
                                </a>
                              </li>
                              <li>
                                <a
                                  className="dropdown-item"
                                  onClick={(e) =>
                                    setStatusPendaftar("tidakLulusSeleksi")
                                  }
                                >
                                  Tidak Lulus Seleksi
                                </a>
                              </li>
                            </>
                          )}
                        </ul>
                        <button
                          className={`btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold border-light-secondary-ss ${
                            downloaded ? "" : "disabled"
                          }`}
                          onClick={downloadRekap}
                        >
                          <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                          Rekap Gelombang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <table className="table-ss">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>No. Telepon</th>
                        <th>Tanggal Mendaftar</th>
                        <th>Status</th>
                        <th>Detail</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gelombang?.pendaftar
                        ?.filter((d) => {
                          return (d?.user?.nama?.toLowerCase() || "").includes(
                            searchSiswa?.toLowerCase()
                          );
                        })
                        ?.filter((d) => {
                          if (statusPendaftar && statusPendaftar != "semua") {
                            return d?.status == statusPendaftar;
                          } else {
                            return 1;
                          }
                        })
                        ?.map((d, idx) => {
                          // const checkBayar =
                          //   JSON.parse(d?.pembayaran || "[]")?.reduce((a, b) => {
                          //     if (b?.diverifikasi) {
                          //       return a + b?.nominal;
                          //     } else {
                          //       return a + 0;
                          //     }
                          //   }, 0) < (gelombang?.jalur?.biaya || 0)
                          //     ? "menungguKonfirmasiPembayaran"
                          //     : d?.status;
                          const checkBayar = d?.status;
                          let status = "";
                          if (
                            checkBayar == "menungguKonfirmasiPembayaran" &&
                            (sekolah?.id == 9487 || sekolah?.id == 9489)
                          ) {
                            status = dataStatus["menungguHasilPengumuman"];
                          } else if (
                            checkBayar == "menungguSeleksiBerkas" &&
                            (sekolah?.id == 9487 || sekolah?.id == 9489)
                          ) {
                            status = dataStatus["tidakLulusSeleksi"];
                          } else {
                            status = dataStatus[checkBayar];
                          }
                          return (
                            <tr>
                              <td data-th="No">{idx + 1}</td>
                              <td data-th="Nama">{d?.user?.nama}</td>
                              <td data-th="No. Telepon">{d?.user?.whatsapp}</td>
                              <td data-th="Tanggal Mendaftar">
                                {momentPackage(d?.createdAt).format(
                                  "DD MMM YYYY"
                                )}
                              </td>
                              <td data-th="Status">
                                <div
                                  className={`fs-14-ss fw-bold d-flex align-items-center ${
                                    status?.color || ""
                                  }`}
                                >
                                  <img
                                    src={`/img/icon-${status?.icon || ""}.svg`}
                                    alt="icon"
                                    className="me-2"
                                  />
                                  <span className="mt-1">
                                    {" "}
                                    {status?.text || ""}
                                  </span>
                                </div>
                              </td>
                              <td data-th="Cek Berkas<">
                                <Link
                                  href={`${ssURL}/pendaftar-ppdb/${id}/${d?.id}`}
                                >
                                  <a className="px-4 py-1 btn-primary btn-primary-ss shadow-primary-ss rounded-pill fw-semibold hover-shadow-none">
                                    Lihat
                                  </a>
                                </Link>
                              </td>
                              <td>
                                <div
                                  className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 pointer"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  onClick={() => _deletePendaftar(d?.id)}
                                >
                                  <FaTrashAlt className="color-secondary" />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Spin>
        </div>
        {/* <div className="card card-ss my-4" style={{ overflow: "hidden" }}>
          <nav className="d-flex justify-content-between align-items-center p-4">
            <h5 className="fw-bold">Kartu Peserta</h5>
            <Pdf
              options={options}
              targetRef={kartuRef}
              filename="Kartu Peserta.pdf"
            >
              {({ toPdf }) => (
                <button
                  className="btn btn-primary rounded-pill"
                  onClick={() => {
                    setUserView(false);
                    setTimeout(() => {
                      toPdf();
                      setUserView(true);
                    }, 1);
                  }}
                >
                  <FaFileDownload /> Unduh Kartu Peserta
                </button>
              )}
            </Pdf>
          </nav>
          {userView ? (
            <div className="card-body p-0 kartu-peserta-pdf">
              <div className="table-responsive">
                <table className="table-ss">
                  <thead>
                    <tr>
                      <th>Jalur Masuk</th>
                      <th>: {pendaftar?.gelombang?.nama}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>No Peserta</th>
                      <th>: {pendaftar?.id}</th>
                    </tr>
                    <tr>
                      <th>NISN</th>
                      <th>: {pendaftar?.user?.profil?.nisn}</th>
                    </tr>
                    <tr>
                      <th>Nama</th>
                      <th>: {pendaftar?.user?.nama}</th>
                    </tr>
                    <tr>
                      <th>Tgl Lahir</th>
                      <th>: {getFormatDate(pendaftar?.user?.tanggalLahir)}</th>
                    </tr>
                    <tr>
                      <th>Tempat</th>
                      <th>: {pendaftar?.user?.tempatLahir}</th>
                    </tr>
                    <tr>
                      <th>Asal Sekolah</th>
                      <th>: {pendaftar?.user?.profil?.asalSekolah}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 1</th>
                      <th>: {pendaftar?.mJurusan1Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 2</th>
                      <th>: {pendaftar?.mJurusan2Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 3</th>
                      <th>: {pendaftar?.mJurusan3Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 4</th>
                      <th>: {pendaftar?.mJurusan4Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 5</th>
                      <th>: {pendaftar?.mJurusan5Id}</th>
                    </tr>
                  </tbody>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="card-body p-0 kartu-peserta-pdf-export"
              ref={kartuRef}
            >
              <div className="table-responsive">
                <table className="table-ss">
                  <thead>
                    <tr>
                      <th>Jalur Masuk</th>
                      <th>: {pendaftar?.gelombang?.nama}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>No Peserta</th>
                      <th>: {pendaftar?.id}</th>
                    </tr>
                    <tr>
                      <th>NISN</th>
                      <th>: {pendaftar?.user?.profil?.nisn}</th>
                    </tr>
                    <tr>
                      <th>Nama</th>
                      <th>: {pendaftar?.user?.nama}</th>
                    </tr>
                    <tr>
                      <th>Tgl Lahir</th>
                      <th>: {getFormatDate(pendaftar?.user?.tanggalLahir)}</th>
                    </tr>
                    <tr>
                      <th>Tempat</th>
                      <th>: {pendaftar?.user?.tempatLahir}</th>
                    </tr>
                    <tr>
                      <th>Asal Sekolah</th>
                      <th>: {pendaftar?.user?.profil?.asalSekolah}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 1</th>
                      <th>: {pendaftar?.mJurusan1Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 2</th>
                      <th>: {pendaftar?.mJurusan2Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 3</th>
                      <th>: {pendaftar?.mJurusan3Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 4</th>
                      <th>: {pendaftar?.mJurusan4Id}</th>
                    </tr>
                    <tr>
                      <th>Pilihan Jurusan 5</th>
                      <th>: {pendaftar?.mJurusan5Id}</th>
                    </tr>
                  </tbody>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          )}
        </div> */}

        {/* formulir peserta */}
        {/* <div className="card card-ss mb-4">
          <nav className="d-flex justify-content-between align-items-center p-4">
            <h5 className="fw-bold">Formulir Peserta</h5>
            <Pdf targetRef={formulirRef} filename="Formulir Pendaftaran.pdf">
              {({ toPdf }) => (
                <button
                  className="btn btn-primary rounded-pill"
                  onClick={toPdf}
                >
                  <FaFileDownload /> Unduh Kartu Peserta
                </button>
              )}
            </Pdf>
          </nav>
          <div className="card-body p-0" ref={formulirRef}>
            <div>
              <h5 className="fw-bold text-center text-uppercase">
                Formulir Pendaftaran
                <br />
                Calon Siswa Baru {sekolah?.nama}
              </h5>
              <h5 className="fw-bold text-center text-uppercase">
                Jalur Seleksi
                <br />
                {pendaftar?.gelombang?.nama}
              </h5>
              <h5 className="fw-bold text-center text-uppercase">
                Nama : {pendaftar?.user?.nama}
                <br />
                No Peserta : {pendaftar?.id}
                <br />
                Pilihan Jurusan 1 : {pendaftar?.mJurusan1Id}
                <br />
                Pilihan Jurusan 2 : {pendaftar?.mJurusan2Id}
                <br />
                Pilihan Jurusan 3 : {pendaftar?.mJurusan3Id}
                <br />
                Pilihan Jurusan 4 : {pendaftar?.mJurusan4Id}
                <br />
                Pilihan Jurusan 5 : {pendaftar?.mJurusan5Id}
              </h5>
              <h5 className="fw-bold text-center text-uppercase">
                Tanggal Mendaftar : {getYear(pendaftar?.createdAt)}
              </h5>
            </div>
            <div>
              <h5 className="fw-bold text-center text-uppercase">
                Identitas Diri
              </h5>
              <div className="table-responsive">
                <table className="table-ss">
                  <tbody>
                    <tr>
                      <th>NISN</th>
                      <th>: {pendaftar?.user?.profil?.nisn}</th>
                    </tr>
                    <tr>
                      <th>No HP</th>
                      <th>: {pendaftar?.user?.whatsapp}</th>
                    </tr>
                    <tr>
                      <th>Nama Lengkap</th>
                      <th>: {pendaftar?.user?.nama}</th>
                    </tr>
                    <tr>
                      <th>Nama Panggilan</th>
                      <th>: {pendaftar?.user?.nama}</th>
                    </tr>
                    <tr>
                      <th>Gender</th>
                      <th>: {pendaftar?.user?.genderText}</th>
                    </tr>
                    <tr>
                      <th>Agama</th>
                      <th>: {pendaftar?.user?.agama}</th>
                    </tr>
                    <tr>
                      <th>Tempat Lahir</th>
                      <th>: {pendaftar?.user?.tempatLahir}</th>
                    </tr>
                    <tr>
                      <th>Tanggal Lahir</th>
                      <th>: {pendaftar?.user?.tanggalLahir}</th>
                    </tr>
                    <tr>
                      <th>Alamat</th>
                      <th>: {pendaftar?.user?.profil?.alamat}</th>
                    </tr>
                    <tr>
                      <th>Asal Sekolah</th>
                      <th>: {pendaftar?.user?.profil?.asalSekolah}</th>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h5 className="fw-bold text-center text-uppercase">
                Informasi Orang Tua
              </h5>
              <div className="table-responsive">
                <table className="table-ss">
                  <tbody>
                    <tr>
                      <th>Nama Ayah</th>
                      <th>: {pendaftar?.user?.profil?.namaAyah}</th>
                    </tr>
                    <tr>
                      <th>Pekerjaan Ayah</th>
                      <th>: {pendaftar?.user?.profil?.pekerjaanAyah}</th>
                    </tr>
                    <tr>
                      <th>No HP Ayah</th>
                      <th>: {pendaftar?.user?.profil?.telpAyah}</th>
                    </tr>
                    <tr>
                      <th>Alamat Ayah</th>
                      <th>: {pendaftar?.user?.profil?.alamatAyah}</th>
                    </tr>
                    <tr>
                      <th>Nama Ibu</th>
                      <th>: {pendaftar?.user?.profil?.namaIbu}</th>
                    </tr>
                    <tr>
                      <th>Pekerjaan Ibu</th>
                      <th>: {pendaftar?.user?.profil?.pekerjaanIbu}</th>
                    </tr>
                    <tr>
                      <th>No HP Ibu</th>
                      <th>: {pendaftar?.user?.profil?.telpIbu}</th>
                    </tr>
                    <tr>
                      <th>Alamat Ibu</th>
                      <th>: {pendaftar?.user?.profil?.alamatIbu}</th>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h5 className="fw-bold text-center text-uppercase">
                Informasi Kesehatan
              </h5>
              <div className="table-responsive">
                <table className="table-ss">
                  <tbody>
                    <tr>
                      <th>Tinggi Badan</th>
                      <th>: {pendaftar?.user?.profil?.tb}cm</th>
                    </tr>
                    <tr>
                      <th>Berat Badan</th>
                      <th>: {pendaftar?.user?.profil?.bb}kg</th>
                    </tr>
                    <tr>
                      <th>Gol. Darah</th>
                      <th>: {pendaftar?.user?.profil?.golDarah}</th>
                    </tr>
                    <tr>
                      <th>Buta Warna</th>
                      <th>: {pendaftar?.user?.profil?.butaWarna}</th>
                    </tr>
                    <tr>
                      <th>Kacamata</th>
                      <th>: {pendaftar?.user?.profil?.kacamata || "-"}</th>
                    </tr>
                    <tr>
                      <th>Disabilitas</th>
                      <th>: {pendaftar?.user?.profil?.disabilitas || "-"}</th>
                    </tr>
                    <tr>
                      <th>Surat Keterangan Kesehatan</th>
                      <th>
                        :{" "}
                        {pendaftar?.user?.profil?.suratKeteranganSehat ? (
                          <a
                            href={pendaftar?.user?.profil?.suratKeteranganSehat}
                          >
                            <FaFileDownload />
                          </a>
                        ) : (
                          "-"
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th>Surat Keterangan Kesehatan</th>
                      <th>
                        :{" "}
                        {pendaftar?.user?.profil?.suratKeteranganButaWarna ? (
                          <a
                            href={
                              pendaftar?.user?.profil?.suratKeteranganButaWarna
                            }
                          >
                            <FaFileDownload />
                          </a>
                        ) : (
                          "-"
                        )}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
      </AnimatePage>
    </LayoutPendaftarPPDB>
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
