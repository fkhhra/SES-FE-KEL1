import Layout from "../../../../components/Layout/Layout";
import { motion } from "framer-motion";
import { whatsappLink } from "utilities/app-helper";

import {
  FaChevronLeft,
  FaCloudUploadAlt,
  FaPen,
  FaPrint,
  FaTrashAlt,
} from "react-icons/fa";
import { baseURL, downloadURL, ssURL } from "../../../../client/clientAxios";
import { useEffect, useState } from "react";
import {
  currencyFormatter,
  momentPackage,
} from "../../../../utilities/HelperUtils";
import Link from "next/link";
import Navbar from "../../../../components/Shared/Navbar/Navbar";
import {
  deletePembayaranSiswa,
  detailPembayaran,
  downloadTemplateSPP,
  importTemplateSPP,
  refreshPembayaranSiswa,
  getPembayaranSiswa,
  rekapPembayaran,
} from "../../../../client/PembayaranClient";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/router";
import Dropdown from "../../../../components/Shared/Dropdown/Dropdown";
import { checkStatusLunas } from "../../../../utilities/TagihanUtils";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import ReactiveButton from "reactive-button";
import toast from "react-hot-toast";
import { hideModal } from "../../../../utilities/ModalUtils";
import axios from "axios";
import { textStatusPembayaran } from "utilities/PembayaranUtils";
import swal from "sweetalert";
import useSekolah from "hooks/useSekolah";

const index = ({ nav, id, rombel_id }) => {
  console.log('')
  const router = useRouter();
  const { sekolah } = useSekolah();
  const [pembayaranData, setPembayaranData] = useState([]);
  const { siswa: listSiswa, pembayaran } = pembayaranData || {};
  const [listDropdownValue, setListDropdownValue] = useState([]);
  const [rombelId, setRombelId] = useState(rombel_id);
  const [downloaded, setDownloaded] = useState(false);
  const [file, setFile] = useState("");

  const [search, setSearch] = useState("");
  const [debounceSearch] = useDebounce(search, 600);

  const navItems = [
    {
      url: `${ssURL}/pembayaran/[id]?nav=semua`,
      as: `${ssURL}/pembayaran/${id}?nav=semua`,
      text: "Semua",
      active: nav == "semua" || nav == undefined,
    },
    {
      url: `${ssURL}/pembayaran/[id]?nav=belum-lunas`,
      as: `${ssURL}/pembayaran/${id}?nav=belum-lunas`,
      text: "Belum Lunas",
      active: nav == "belum-lunas",
    },
    {
      url: `${ssURL}/pembayaran/[id]?nav=butuh-konfirmasi`,
      as: `${ssURL}/pembayaran/${id}?nav=butuh-konfirmasi`,
      text: "Butuh Konfirmasi",
      active: nav == "butuh-konfirmasi",
    },
  ];

  const _detailPembayaran = async () => {
    let dropdownData = [];

    const params = {
      ...router.query,
      rombel_id: rombelId,
      search: search,
    };

    params?.id && delete params?.id;

    const { data } = await detailPembayaran(id, params);
    if (data) {
      setPembayaranData(data);

      !pembayaran &&
        data?.pembayaran?.rombel?.length > 0 &&
        data?.pembayaran?.rombel
          ?.sort((a, b) => {
            return ("" + a?.rombel?.nama).localeCompare("" + b?.rombel?.nama);
          })
          ?.map((rombelData) => {
            dropdownData.push({
              label: rombelData?.rombel?.nama,
              value: rombelData?.id,
            });
          });

      !pembayaran && setListDropdownValue(dropdownData);
    }
  };

  const _deletePembayaranSiswa = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deletePembayaranSiswa(id);

        if (data) {
          toast.success(data.message);
          _detailPembayaran();
        } else {
          toast.error(error.message);
        }
      }
    });
  };

  const _refreshPembayaranSiswa = async () => {
    const { data, error } = await refreshPembayaranSiswa({
      id: rombelId || pembayaran?.rombel?.[0]?.id,
    });
    if (data) {
      toast.success(data.message);
      _detailPembayaran();
    } else {
      toast.error(error.message);
    }
  };

  const downloadTemplate = async () => {
    const { data, error } = await downloadTemplateSPP(
      rombelId || pembayaran?.rombel?.[0]?.id
    );

    if (data) {
      setDownloaded(true);
      document.getElementById("downloadIframe").src = `${downloadURL}${data}`;
    } else {
      toast.error("Silahkan Coba beberapa saat lagi");
    }
  };

  const importTemplate = async () => {
    if (!file) {
      toast.error("File Wajib Diisi");
    }

    const form = new FormData();
    form.append("file", file);

    await axios
      .post(baseURL + `/import/pembayaran-siswa/${id}`, form)
      .then((res) => {
        toast.success("Import Berhasil");
        hideModal("importSPP");
        _detailPembayaran();
        if (res?.length) {
          res?.map((d) => toast.error(d?.message));
        }
      })
      .catch((err) => {
        toast.error("Silahkan coba beberapa saat lagi");
      });
  };

  const handleChangeDropdown = (value) => {
    setRombelId(value.value);
  };

  // const setFilter = () => {
  //   const queryParams = {
  //     search: search,
  //     rombel_id: rombelId,
  //     nav: nav,
  //   };

  //   // delete queryParams if value is null
  //   Object.keys(queryParams).map((query) => {
  //     !queryParams[query] && delete queryParams[query];
  //   });

  //   router.push({
  //     pathname: `${ssURL}/pembayaran/${router.query.id}`,
  //     query: queryParams,
  //   });
  // };

  const renderStatus = (status) => {
    let className = "";
    let text = "";

    switch (status) {
      case 0:
        className = "bg-soft-warning color-warning";
        text = "Butuh Konfirmasi";
        break;
      case 1:
        className = "bg-soft-success color-success";
        text = "Sudah Lunas";
        break;
      case 3:
        className = "bg-soft-warning color-warning";
        text = "Ditangguhkan";
        break;
      default:
        className = "bg-soft-danger color-danger";
        text = "Belum Lunas";
        break;
    }

    return {
      className,
      text,
    };
  };

  const handleRekapPembayaran = async () => {
    const { data } = await rekapPembayaran(id);
    if (data) {
      window.open(`${downloadURL}/${data}`, "_blank");
    }
  };

  // useEffect(() => _detailPembayaran(), []);

  useEffect(() => {
    _detailPembayaran();
  }, [router.query, rombelId, debounceSearch]);

  // useEffect(() => {
  //   setFilter();
  // }, [debounceSearch, rombelId]);

  return (
    <Layout
      isIndex={true}
      modalWrapper={
        <>
          <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
          <NewModal
            title={`Unggah Data ${
              sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
            }`}
            modalId="importSPP"
            content={
              <>
                <div className="mb-3">
                  <h6 className="color-dark fw-semibold mb-2">
                    Download template file untuk mengimport data{" "}
                    <span className="text-lowercase">Anggota Rombel</span>
                  </h6>
                  <a
                    // href="/import/template-import-anggota-kelas-password.xlsx"
                    onClick={() => {
                      downloadTemplate();
                    }}
                    // target="_blank"
                  >
                    <div className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template File Import Pembayaran{" "}
                          {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                        </span>
                      </p>
                    </div>
                  </a>
                </div>
                {/* {downloaded && ( */}
                <div className="mb-3">
                  <label className="form-label">
                    Pilih file untuk diimport
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    autoComplete="off"
                    onChange={({ target }) => {
                      setFile(target.files[0]);
                    }}
                  />
                </div>
                {/* )} */}
              </>
            }
            submitButton={
              <ReactiveButton
                // buttonState={buttonStateImportAnggotaRombel}
                onClick={importTemplate}
                color={"primary"}
                idleText={"Unggah"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
          />
        </>
      }
    >
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <>
          <div className="row mb-3">
            <div className="col-md-12">
              <Link href={`${ssURL}/pembayaran`}>
                <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                  <FaChevronLeft />
                  <span className="ms-2">Kembali</span>
                </a>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 mb-4">
                {/* Card Label & Option Start */}
                <div className="card-header-ss d-flex justify-content-between align-items-center mb-3 px-0">
                  {/* Jadwal Ujian Label Start */}

                  <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                    SPP
                  </div>

                  {/* Jadwal Ujian Label End */}

                  {/* Dropdown Option Start */}
                  <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                    <div
                      role="button"
                      id="dropdownOption"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={`/img/icon-dropdown-option.svg`}
                        alt="icon-option"
                      />
                    </div>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownOption"
                    >
                      <li
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatJadwalUjian"
                      >
                        <a className="dropdown-item">
                          <FaPen className="me-2" />
                          <span>Edit</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item color-danger">
                          <FaTrashAlt className="me-2" />
                          <span>Hapus</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Dropdown Option End */}
                </div>
                <div className="card-body p-0">
                  <h2 className="color-dark fw-black mb-2">
                    {/* {pembayaran?.nama} */}
                    {`${pembayaran?.nama} ${
                      pembayaran?.bulan == null ? "" : `- ${pembayaran?.bulan}`
                    }`}
                  </h2>
                  <div className="row mt-4">
                    <div className="col-md-8 pe-2">
                      <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between">
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Sudah Lunas
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {listSiswa?.filter((item) => item.status == "lunas")
                              ?.length || "-"}{" "}
                            {sekolah?.tingkat == "kampus"
                              ? "Mahasiswa"
                              : "Siswa"}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Belum Lunas
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {listSiswa?.filter(
                              (item) => item.status == "belum lunas"
                            )?.length || "-"}{" "}
                            {sekolah?.tingkat == "kampus"
                              ? "Mahasiswa"
                              : "Siswa"}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Butuh Konfirmasi
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {
                              listSiswa?.filter((item) =>
                                item?.riwayat?.some(
                                  (pembayaran) => !pembayaran.dikonfirmasi
                                )
                              )?.length
                            }{" "}
                            {sekolah?.tingkat == "kampus"
                              ? "Mahasiswa"
                              : "Siswa"}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Nominal
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {currencyFormatter(pembayaran?.nominal)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 ps-2">
                      <div
                        className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100"
                        onClick={handleRekapPembayaran}
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
                            Rekap Pembayaran
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Navbar nav={navItems} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card card-ss">
                <div className="card-header-ss p-4 d-flex justify-content-between align-items-md-center flex-md-row flex-column">
                  <h4 className="fw-extrabold m-0 color-dark mb-md-0 mb-4">
                    Daftar{" "}
                    {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                  </h4>
                  <div className="d-flex justify-content-md-start justify-content-between flex-sm-row flex-column">
                    <input
                      type="text"
                      className="form-control form-search rounded-pill fs-14-ss fw-semibold border-secondary-ss me-sm-4 mb-sm-0 mb-3"
                      style={{ height: "42px" }}
                      id="exampleFormControlInput1"
                      placeholder={`Cari Nama ${
                        sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"
                      }`}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <Dropdown
                      listValue={listDropdownValue}
                      defaultValue={
                        rombelId
                          ? listDropdownValue?.find(
                              (item) => item.value == rombelId
                            )?.label
                          : listDropdownValue?.[0]?.label
                      }
                      onChange={handleChangeDropdown}
                    />
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-md-0 ms-3 mb-3"
                      onClick={() => {
                        _refreshPembayaranSiswa();
                      }}
                    >
                      Update{" "}
                      {sekolah?.tingkat == "kampus" ? "Mahasiswa" : "Siswa"}
                    </button>
                    <button
                      className="btn btn-primary btn-primary btn-primary-ss shadow-primary-ss rounded-pill fs-6 py-2 px-4 mb-md-0 ms-3 mb-3 me-md-3"
                      data-bs-toggle="modal"
                      data-bs-target="#importSPP"
                    >
                      <FaCloudUploadAlt className="me-2" /> Unggah Data
                    </button>
                  </div>
                </div>
                <div className="card-body p-0 pb-4">
                  <div className="table-responsive">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>Pembayaran</th>
                          <th>Sisa</th>
                          <th>Status</th>
                          <th>Detail</th>
                          <th>Hubungi Orang Tua</th>
                          <th>Aksi</th>
                          {/* <th>Cetak</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {router.query.nav == "butuh-konfirmasi" ? (
                          <>
                            {listSiswa
                              ?.filter((siswa) =>
                                siswa?.riwayat?.some(
                                  (item) => !item.dikonfirmasi
                                )
                              )
                              ?.sort((a, b) =>
                                ("" + a.user?.nama).localeCompare(b.user?.nama)
                              )
                              ?.map((siswa, idx) => {
                                const totalSudahBayar = siswa?.riwayat?.reduce(
                                  (a, b) => a + parseInt(b.nominal),
                                  0
                                );
                                const nominal =
                                  siswa?.rombelPembayaran?.pembayaran?.nominal;
                                let status = textStatusPembayaran(
                                  siswa,
                                  totalSudahBayar,
                                  nominal
                                );
                                return (
                                  <tr>
                                    <td>{idx + 1}</td>
                                    <td>{siswa?.user?.nama}</td>
                                    <td>
                                      {currencyFormatter(totalSudahBayar)}
                                    </td>
                                    <td>
                                      {currencyFormatter(
                                        parseInt(pembayaran?.nominal) -
                                          parseInt(totalSudahBayar) <
                                          0
                                          ? 0
                                          : parseInt(pembayaran?.nominal) -
                                              parseInt(totalSudahBayar)
                                      )}
                                    </td>
                                    <td>
                                      <div
                                        className={`rounded-pill fw-bold py-1 d-flex justify-content-center fs-12-ss ${
                                          renderStatus(status).className
                                        }`}
                                        style={{ width: "125px" }}
                                      >
                                        {renderStatus(status).text}
                                      </div>
                                    </td>
                                    <td>
                                      <Link
                                        href={`${ssURL}/transaksi/[id]`}
                                        as={`${ssURL}/transaksi/${siswa?.id}`}
                                      >
                                        <a className="text-decoration-none">
                                          <button className="btn  btn-primary btn-primary-ss shadow-primary-ss fs-14-ss rounded-pill py-1 px-4">
                                            Detail
                                          </button>
                                        </a>
                                      </Link>
                                    </td>
                                    <td>
                                      <div className="dropdown dropdown-ss">
                                        <button
                                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                          }}
                                          onClick={() =>
                                            _deletePembayaranSiswa(siswa?.id)
                                          }
                                        >
                                          <FaTrashAlt className="color-secondary" />
                                        </button>
                                      </div>
                                    </td>
                                    {/* <td>
                                      <button
                                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 mb-lg-0 mb-md-2 mb-0"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        //   data-bs-toggle="modal"
                                        //   data-bs-target="#modalBuatSoalUjian"
                                        //   onClick={() => handleClickEditSoalUjian(soal)}
                                      >
                                        <FaPrint className="color-secondary fs-18-ss" />
                                      </button>
                                    </td> */}
                                  </tr>
                                );
                              })}
                          </>
                        ) : (
                          <>
                            {listSiswa
                              ?.sort((a, b) =>
                                ("" + a.user?.nama).localeCompare(b.user?.nama)
                              )
                              ?.map((siswa, idx) => {
                                const totalSudahBayar = siswa?.riwayat?.reduce(
                                  (a, b) => a + parseInt(b.nominal),
                                  0
                                );
                                const nominal =
                                  siswa?.rombelPembayaran?.pembayaran?.nominal;
                                let status = textStatusPembayaran(
                                  siswa,
                                  totalSudahBayar,
                                  nominal
                                );

                                return (
                                  <tr>
                                    <td>{idx + 1}</td>
                                    <td>{siswa?.user?.nama}</td>
                                    <td>
                                      {currencyFormatter(totalSudahBayar)}
                                    </td>
                                    <td>
                                      {`${
                                        parseInt(pembayaran?.nominal) -
                                          parseInt(totalSudahBayar) <
                                        0
                                          ? "+"
                                          : ""
                                      } ${currencyFormatter(
                                        Math.abs(
                                          parseInt(pembayaran?.nominal) -
                                            parseInt(totalSudahBayar)
                                        )
                                      )}`}
                                    </td>
                                    <td>
                                      <div
                                        className={`rounded-pill fw-bold py-1 d-flex justify-content-center fs-12-ss ${
                                          renderStatus(status).className
                                        }`}
                                        style={{ width: "125px" }}
                                      >
                                        {renderStatus(status).text}
                                      </div>
                                    </td>
                                    <td>
                                      <Link
                                        href={`${ssURL}/transaksi/[id]`}
                                        as={`${ssURL}/transaksi/${siswa?.id}`}
                                      >
                                        <a className="text-decoration-none">
                                          <button className="btn  btn-primary btn-primary-ss shadow-primary-ss fs-14-ss rounded-pill py-1 px-4">
                                            Detail
                                          </button>
                                        </a>
                                      </Link>
                                    </td>
                                    <td className="d-flex align-items-center justify-content-center">
                                        <a
                                          href={whatsappLink(siswa?.user?.wa_ibu == null ? "" : siswa?.user?.wa_ibu || siswa?.user?.wa_ayah == null ? "" : siswa?.user?.wa_ayah, `Halo, Bapak / Ibu ${siswa?.user?.nama_ibu == null ? "" : siswa?.user?.nama_ibu || siswa?.user?.nama_ayah == null ? "" : siswa?.user?.nama_ayah} SPP ${pembayaran?.nama} belum dibayar atas nama ${siswa?.user?.nama} mohon segera untuk dilunasi. `)}
                                          target="_blank"
                                          rel="noreferrer noopener"
                                        >
                                          <div
                                            className="rounded-circle shadow-success-ss text-center"
                                            style={{
                                              width: "45px",
                                              height: "45px",
                                            }}
                                          >
                                            <img
                                              src={`/img/whatsapp.svg`}
                                              width={45}
                                              height={45}
                                            />
                                          </div>
                                        </a>
                                    </td>
                                    <td>
                                      <div className="dropdown dropdown-ss">
                                        <button
                                          className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center"
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                          }}
                                          onClick={() =>
                                            _deletePembayaranSiswa(siswa?.id)
                                          }
                                        >
                                          <FaTrashAlt className="color-secondary" />
                                        </button>
                                      </div>
                                    </td>
                                    {/* <td>
                                      <button
                                        className="btn btn-link p-0 rounded-circle bg-soft-primary d-flex justify-content-center align-items-center me-lg-2 mb-lg-0 mb-md-2 mb-0"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                        //   data-bs-toggle="modal"
                                        //   data-bs-target="#modalBuatSoalUjian"
                                        //   onClick={() => handleClickEditSoalUjian(soal)}
                                      >
                                        <FaPrint className="color-secondary fs-18-ss" />
                                      </button>
                                    </td> */}
                                  </tr>
                                );
                              })}
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </motion.div>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nav, rombel_id },
}) {
  return {
    props: {
      nav: nav || null,
      id,
      rombel_id: rombel_id || null,
    },
  };
}

export default index;
