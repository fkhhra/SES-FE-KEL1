import { DatePicker } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  FaCloudDownloadAlt,
  FaCommentDots,
  FaPaperclip,
  FaPen,
  FaPlus,
  FaRegClock,
  FaSearch,
  FaTimes,
  FaTrashAlt,
  FaUndo,
  FaVideoSlash,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { Combobox } from "react-widgets";
import ReactiveButton from "reactive-button";
import { ssURL } from "../../../client/clientAxios";
import {
  editJadwalMengajar,
  getJadwalMengajar,
  getJadwalMengajarPertemuan,
} from "../../../client/JadwalMengajarClient";
import ModalMonev from "../../../components/JadwalMengajar/ModalMonev";
import Layout from "../../../components/Layout/Layout";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import useUser from "../../../hooks/useUser";
import {
  momentPackage,
  optionHari,
  renderGuruPengampu,
  renderJamMengajar,
} from "../../../utilities/HelperUtils";

const index = () => {
  const router = useRouter();

  const initialFormData = {
    tingkatRombel: [],
    tingkat: router?.query?.tingkat || "",
    hari: router?.query?.hari || "",
    tanggal: router?.query?.tanggal,
  };

  const [jadwalMengajarData, setJadwalMengajarData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const { jamMengajar, hari, mataPelajaran } = jadwalMengajarData;

  const { user } = useUser();

  const { nav } = useRouter().query;

  const [loading, setLoading] = useState(true);

  const cycle = useRef(null);
  const getMataPelajaranData = async () => {
    setLoading(true);

    const { data } = await getJadwalMengajar({
      hari: new Date().getDay(),
      ...router.query,
    });
    if (data) {
      setLoading(false);
      setJadwalMengajarData(data);
      setFormData({ ...initialFormData, tingkatRombel: data.tingkatRombel });
    } else {
      if (router.query.hari != 1) {
        router.push(
          `${ssURL}/jadwal-mengajar/?hari=1${
            router.query.nav ? "&nav=" + router.query.nav : ""
          }`
        );
      }
    }
  };

  const getMataPelajaranDataStreaming = async () => {
    const { data } = await getJadwalMengajar({
      hari: new Date().getDay(),
    });
    if (data) {
      setJadwalMengajarData(data);
      let tingkat = data.tingkatRombel;
      let id = 0;

      const getStreamingMataPelajaranData = async () => {
        const { data } = await getJadwalMengajar({
          tingkat: tingkat[id],
          hari: new Date().getDay(),
        });

        setJadwalMengajarData(data);
        cycle.current = setTimeout(() => {
          id = tingkat.length - 2 < id ? 0 : id + 1;
          getStreamingMataPelajaranData();
        }, 3000);
      };

      getStreamingMataPelajaranData();
    }
  };

  const [buttonStreaming, setButtonStreaming] = useState(false);

  const stopStreaming = () => {
    setButtonStreaming(false);
    clearTimeout(cycle.current);
  };

  const startStreaming = () => {
    setButtonStreaming(true);
    // getMataPelajaranDataStreaming();
  };

  const [jadwalMengajarPertemuan, setJadwalMengajarPertemuan] = useState({});

  const { pertemuan } = jadwalMengajarPertemuan;

  const _getJadwalMengajarPertemuan = async () => {
    const { data } = await getJadwalMengajarPertemuan({
      tanggal: router?.query?.tanggal,
    });

    if (data) {
      setJadwalMengajarPertemuan(data);
    }
  };

  useEffect(() => {
    _getJadwalMengajarPertemuan();
  }, [router.query]);

  useEffect(() => {
    getMataPelajaranData();
  }, [router.query]);

  const [buttonStateChangeAngkatan, setButtonStateChangeAngkatan] =
    useState("idle");

  const setFilter = () => {
    const queryParams = {
      tingkat: formData.tingkat,
      hari: formData.hari,
      nav: nav,
      tanggal: formData.tanggal,
    };

    // delete queryParams if value is null
    Object.keys(queryParams).map((query) => {
      !queryParams[query] && delete queryParams[query];
    });

    router.push({
      pathname: router.pathname,
      query: queryParams,
    });
  };

  const handleChangeAngkatan = async (e) => {
    setLoading(true);
    e.preventDefault();
    setFilter();
    setButtonStateChangeAngkatan("loading");
    const { data } = await getJadwalMengajar({
      tingkat: formData.tingkat,
      hari: formData.hari,
    });
    if (data) {
      setButtonStateChangeAngkatan("success");
      setJadwalMengajarData(data);
      setLoading(false);
    }
  };

  const handleEmptyAngkatan = async (id) => {
    const res = await editJadwalMengajar(id, {
      kosongkan: true,
    });
    if (res) {
      getMataPelajaranData();
    }
  };

  const navItems = [];

  if (user?.role == "admin") {
    navItems.push(
      {
        url: `${ssURL}/jadwal-mengajar?nav=streaming`,
        text: "Monitor",
        active: nav == "streaming" || nav == undefined,
        onClick: startStreaming,
      }
      // {
      //   url: `${ssURL}/jadwal-mengajar?nav=pengaturan`,
      //   text: "Pengaturan",
      //   active: nav == "pengaturan",
      //   onClick: stopStreaming,
      // }
    );
  } else if (user?.role == "kepsek") {
    navItems.push({
      url: `${ssURL}/jadwal-mengajar?nav=streaming`,
      text: "Monitor",
      active: nav == "streaming" || nav == undefined,
      onClick: startStreaming,
    });
  }

  const handleChangeTanggalMonev = (date, dateString) => {
    setFormData({
      ...formData,
      tanggal: dateString,
    });
  };

  const handleGetMonev = () => {
    setFilter();
  };

  // const navItems = [
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=senin`,
  //     text: "Senin",
  //     active: nav == "senin" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=selasa`,
  //     text: "Selasa",
  //     active: nav == "selasa" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=rabu`,
  //     text: "Rabu",
  //     active: nav == "rabu" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=kamis`,
  //     text: "Kamis",
  //     active: nav == "kamis" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=jumat`,
  //     text: "Jumat",
  //     active: nav == "jumat" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=sabtu`,
  //     text: "Sabtu",
  //     active: nav == "sabtu" || !nav,
  //   },
  //   {
  //     url: `${ssURL}/jadwal-mengajar?nav=minggu`,
  //     text: "Minggu",
  //     active: nav == "minggu" || !nav,
  //   },
  // ];

  return (
    <Layout isFluid={true}>
      <motion.div
        exit={{ opacity: 0 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {/* <Navbar nav={navItems} />

        <div className="card-body px-4 pt-4 pb-0 mb-5">
          <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-5">
            <h4 className="fw-extrabold color-dark title-border">
              Jadwal Mengajar
            </h4>
            <button
              type="button"
              className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#modalTambahSarpras"
            >
              <FaPlus className="me-2" />
              Tambah Jadwal Mengajar
            </button>
          </div>
          <div className="table-responsive mb-5">
            <table className="table-ss">
              <thead>
                <tr>
                  <th>Jam</th>
                  <th>Waktu</th>
                  <th>X KGSP 1</th>
                  <th>X KSGP 2</th>
                  <th>X TEDK 1</th>
                  <th>X TEDK 2</th>
                </tr>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
            </table>
          </div>
        </div> */}

        <Navbar
          nav={navItems}
          action={[
            {
              button: (
                <>
                  <button
                    type="button"
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-semibold color-secondary border border-light-secondary-ss me-sm-3 fs-14-ss mb-sm-0 mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#ModalMonev"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-6" />
                    Download Monev
                  </button>
                  <div
                    class="date-picker-kehadiran d-flex"
                    data-joyride="filter-tanggal"
                  >
                    <DatePicker
                      className="w-100"
                      onChange={handleChangeTanggalMonev}
                      placeholder="Pilih tanggal"
                      value={momentPackage(formData.tanggal)}
                    />
                    <button
                      type="button"
                      className="btn btn-ss btn-primary btn-primary-ss fs-14-ss"
                      onClick={() => {
                        handleGetMonev();
                      }}
                      data-joyride="btn-tampilkan"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </>
              ),
            },
          ]}
        />

        {loading ? (
          <Skeleton count={4} height={50} />
        ) : (
          <>
            {nav == "pengaturan" ? (
              <div className="card card-ss mb-4">
                <div className="card-header p-4 card-header-ss">
                  {nav == "streaming" || nav == undefined ? (
                    buttonStreaming ? (
                      <button
                        className="btn btn-primary"
                        onClick={stopStreaming}
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={startStreaming}
                      >
                        Start
                      </button>
                    )
                  ) : (
                    <form onSubmit={handleChangeAngkatan}>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary p-2 px-3"
                          onClick={() => getMataPelajaranData()}
                        >
                          <FaUndo />
                        </button>
                        <div className="d-flex flex-md-row flex-column justify-content-end">
                          <div className="mb-md-0 mb-3 me-3">
                            <select
                              required
                              className="form-select"
                              style={{ minWidth: 150 }}
                              value={formData.tingkat}
                              onChange={({ target }) => {
                                setFormData({
                                  ...formData,
                                  tingkat: target.value,
                                });
                              }}
                            >
                              <option value="">Pilih Angkatan</option>
                              {formData.tingkatRombel?.map((d, idx) => {
                                return (
                                  <option
                                    key={`${idx}-${new Date().getTime()}`}
                                    value={d}
                                  >
                                    {d}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="mb-md-0 mb-3 me-3">
                            <select
                              required
                              className="form-select"
                              style={{ minWidth: 150 }}
                              value={formData.hari}
                              onChange={({ target }) => {
                                setFormData({
                                  ...formData,
                                  hari: target.value,
                                });
                              }}
                            >
                              <option value="">Pilih Hari</option>
                              {optionHari.map((d, idx) => {
                                return (
                                  <option
                                    key={`${idx}-${new Date().getTime()}`}
                                    value={d.value}
                                  >
                                    {d.label}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <ReactiveButton
                            buttonState={buttonStateChangeAngkatan}
                            color={"primary"}
                            idleText={"Tampilkan"}
                            loadingText={"Diproses"}
                            successText={"Berhasil"}
                            errorText={"Gagal"}
                            type={"submit"}
                            className="btn btn-primary btn-primary-ss bg-gradient-primary rounded-pill"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </div>{" "}
                <div className="card-body p-0">
                  <div className="table-responsive mt-4">
                    <table className="table-ss">
                      <thead>
                        <tr>
                          <th colSpan="50" className="text-center">
                            {hari}
                          </th>
                        </tr>
                        <tr>
                          <th>Jam</th>
                          <th>Waktu</th>
                          {jamMengajar !== undefined
                            ? jamMengajar[0].jadwalMengajar?.map(
                                (data, idx) => {
                                  return (
                                    <th key={`${idx}-${new Date().getTime()}`}>
                                      {data?.rombel?.nama}
                                    </th>
                                  );
                                }
                              )
                            : null}
                        </tr>
                      </thead>
                      <tbody>
                        {jamMengajar?.map((data, idx) => {
                          if (data.istirahat) {
                            return (
                              <tr key={`${idx}-${new Date().getTime()}`}>
                                <td colSpan="50" className="alert-warning">
                                  Istirahat
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr>
                              <td data-th="Jam">{data.jamKe}</td>
                              <td data-th="Waktu">
                                {renderJamMengajar(
                                  data.jamMulai,
                                  data.jamSelesai
                                )}
                              </td>
                              {data?.jadwalMengajar.map((data, idx) => {
                                if (nav == "pengaturan") {
                                  return (
                                    <td
                                      data-th={data.rombel?.nama}
                                      key={`${idx}-${new Date().getTime()}`}
                                    >
                                      {data.mataPelajaran
                                        ? renderGuruPengampu(
                                            data.mataPelajaran?.user?.nama,
                                            data.mataPelajaran?.nama
                                          )
                                        : ""}
                                      {
                                        <div className="d-flex">
                                          <Combobox
                                            data={mataPelajaran}
                                            textField={(item) =>
                                              typeof item === "string"
                                                ? item
                                                : renderGuruPengampu(
                                                    item.user?.nama,
                                                    item.nama
                                                  )
                                            }
                                            filter="contains"
                                            placeholder="Pilih Pengajar"
                                            onSelect={async (value) => {
                                              const res =
                                                await editJadwalMengajar(
                                                  data.id,
                                                  {
                                                    mMataPelajaranId: value.id,
                                                    tingkat:
                                                      data.rombel?.tingkat,
                                                    mRombelId: data.mRombelId,
                                                    mJurusanId:
                                                      data.rombel?.mJurusanId,
                                                  }
                                                );
                                            }}
                                          />
                                          <button
                                            className="btn btn-danger"
                                            onClick={() =>
                                              handleEmptyAngkatan(data.id)
                                            }
                                          >
                                            <FaTimes />
                                          </button>
                                        </div>
                                      }
                                    </td>
                                  );
                                }

                                return (
                                  <td
                                    className={
                                      data.absen
                                        ? "alert-success"
                                        : "alert-danger"
                                    }
                                  >
                                    {data.mataPelajaran ? (
                                      <Link
                                        href={`${ssURL}/jadwal-mengajar/[id]`}
                                        as={`${ssURL}/jadwal-mengajar/${data?.id}`}
                                      >
                                        <a className="d-flex align-items-center">
                                          <FaVideoSlash className="h3 me-2" />
                                          {renderGuruPengampu(
                                            data.mataPelajaran?.user?.nama,
                                            data.mataPelajaran?.nama
                                          )}
                                        </a>
                                      </Link>
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row g-4 justify-content-center">
                {pertemuan?.map((d, idx) => {
                  if (d?.tipe == "absen") {
                    return (
                      <div
                        className="col-lg-10"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <div className="card-post card card-ss">
                          <div className="mx-4 mt-4">
                            <span className="label-ss rounded-pill bg-primary text-white">
                              {user?.role == "admin" &&
                                `   ${`${d?.user?.nama} - ${d?.rombel?.nama}`}`}
                              {user?.role == "siswa" &&
                                `   ${d?.timeline?.mataPelajaran?.nama} - ${d?.timeline?.user?.nama}`}
                            </span>
                            <hr style={{ backgroundColor: "#80849c" }} />
                          </div>

                          <div className="card-header card-header-ss p-4 d-flex flex-md-row flex-column justify-content-between">
                            {/* Post Title Start */}
                            <Link
                              href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                              as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                            >
                              <a className="text-decoration-none order-md-1 order-2">
                                <div className="card-post-title d-flex align-items-center flex-grow-1 ">
                                  <div
                                    className="rounded-circle shadow-primary-ss me-4"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                    }}
                                  >
                                    <img
                                      src={`/img/post-icon-1.svg`}
                                      alt="post-icon"
                                    />
                                  </div>
                                  <div className="title">
                                    <h6 className="color-dark fw-black m-0">
                                      {/* {`${d?.user?.nama} - ${d?.rombel?.nama}`} */}
                                      Pertemuan
                                    </h6>
                                    <p className="color-secondary m-0 fs-14-ss mt-2">
                                      {momentPackage(
                                        d?.tanggalPembagian
                                      ).format("DD MMMM YYYY")}
                                    </p>
                                  </div>
                                </div>
                              </a>
                            </Link>
                            {/* Post Title End */}

                            {/* Dropdown Option Start */}

                            {user?.role == "guru" && (
                              <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end order-md-2 order-1">
                                <div
                                  role="button"
                                  id="dropdownMenuLink"
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
                                  aria-labelledby="dropdownMenuLink"
                                >
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalAddPertemuan"
                                    onClick={() => handleClickEdit(d)}
                                  >
                                    <a className="dropdown-item">
                                      <FaPen className="me-2" />
                                      <span>Edit</span>
                                    </a>
                                  </li>

                                  <li onClick={() => deleteTimelineData(d?.id)}>
                                    <a className="dropdown-item color-danger">
                                      <FaTrashAlt className="me-2" />
                                      <span>Hapus</span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )}
                            {/* Dropdown Option End */}
                          </div>

                          <div className="card-body pt-0 px-4 pb-3">
                            {/* Post Content Start */}
                            <Link
                              href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                              as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                            >
                              <a className="text-decoration-none">
                                <div className="row px-lg-0 px-md-3">
                                  {/* Post Description Start */}

                                  <div
                                    className={`card-post-content dangerous-html ${
                                      user?.role === "guru" ||
                                      user?.role == "admin" ||
                                      user?.role == "kepsek"
                                        ? "col-lg-9"
                                        : "col-lg-8"
                                    } col-md-8 color-secondary`}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        d?.deskripsi || d?.timeline?.deskripsi,
                                    }}
                                  />

                                  {/* Post Description End */}

                                  {/* Post Complete Status Start*/}
                                  <div
                                    className={`bg-soft-primary rounded-ss d-flex align-items-center post-complete-status ${
                                      user?.role === "guru" ||
                                      user?.role == "admin" ||
                                      user?.role == "kepsek"
                                        ? "col-lg-3 p-3"
                                        : "col-lg-4 py-3 px-4"
                                    } col-md-4 mt-md-0 mt-3`}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div
                                        className={`rounded-circle ${
                                          user?.role == "guru" ||
                                          user?.role == "admin" ||
                                          user?.role == "kepsek"
                                            ? "shadow-primary-ss"
                                            : !d?.absen
                                            ? "shadow-danger-ss"
                                            : "shadow-primary-ss"
                                        } me-4`}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      >
                                        <img
                                          src={`${
                                            user?.role == "guru" ||
                                            user?.role == "admin" ||
                                            user?.role == "kepsek"
                                              ? `/img/icon-complete.svg`
                                              : !d?.absen
                                              ? "/img/icon-post-warning.svg"
                                              : `/img/icon-complete.svg`
                                          }`}
                                          alt="post-icon"
                                          width="50px"
                                          height="50px"
                                        />
                                      </div>
                                      <div className="div">
                                        {user?.role === "guru" ||
                                        user?.role == "admin" ||
                                        user?.role == "kepsek" ? (
                                          <>
                                            <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                                              Diabsen
                                            </p>
                                            <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                                              {`${d.meta.totalAbsen} / ${d.meta.totalSiswa}`}{" "}
                                              Siswa
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                                              Kamu hari ini
                                            </p>
                                            <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                                              {!d?.absen
                                                ? "Belum Absen"
                                                : "Sudah Absen"}
                                            </p>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Post Complete Status End*/}
                                </div>
                              </a>
                            </Link>
                            {/* Post Content End */}
                          </div>
                          <div className="card-footer-ss p-4 pt-0">
                            <hr className="m-0 mb-3" />

                            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                              <Link
                                href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                                as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                              >
                                <a className="text-decoration-none">
                                  {/* Comment & Attachment Start */}
                                  <div className="d-flex mb-3 mb-md-0">
                                    <div className="comment color-dark fs-14-ss fw-bolder me-4">
                                      <FaCommentDots className="me-2" />
                                      <span>
                                        {(user?.role == "guru" ||
                                          user?.role == "admin" ||
                                          user?.role == "kepsek") &&
                                          d?.meta?.totalKomen}
                                        {user?.role == "siswa" &&
                                          d?.timeline?.meta?.totalKomen}{" "}
                                        Komentar
                                      </span>
                                    </div>
                                    <div className="attach color-dark fs-14-ss fw-bolder">
                                      <FaPaperclip className="me-2" />
                                      <span>
                                        {(user?.role == "guru" ||
                                          user?.role == "admin" ||
                                          user?.role == "kepsek") &&
                                          d?.lampiran?.length}
                                        {user?.role == "siswa" &&
                                          d?.timeline?.lampiran?.length}{" "}
                                        Lampiran
                                      </span>
                                    </div>
                                  </div>
                                  {/* Comment & Attachment End */}
                                </a>
                              </Link>

                              {/* Alert Start */}
                              {(d.rpp?.length || d.jurnal) &&
                              (user?.role == "guru" ||
                                user?.role == "admin" ||
                                user?.role == "kepsek") ? (
                                <div className="rounded-ss px-4 py-2 bg-success shadow-success-ss text-white fs-14-ss">
                                  <img
                                    src={`/img/icon-check-alert.svg`}
                                    alt="icon-check-alert"
                                    className="me-2"
                                  />
                                  {d?.user?.nama} Sudah Menulis Jurnal Harian
                                </div>
                              ) : user?.role == "guru" ||
                                user?.role == "admin" ||
                                user?.role == "kepsek" ? (
                                <div className="rounded-ss px-4 py-2 bg-danger shadow-danger-ss text-white fs-14-ss">
                                  <img
                                    src={`/img/icon-warning-alert.svg`}
                                    alt="icon-warning-alert"
                                    className="me-2"
                                  />
                                  {d?.user?.nama} Belum Menulis Jurnal Harian
                                </div>
                              ) : null}

                              {/* Alert End */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (d?.tipe == "tugas") {
                    const tugas =
                      d?.timeline?.tugas || d?.timeline?.timeline?.tugas;

                    return (
                      // <div className="col-lg-10" key={`${idx}-${new Date().getTime()}`}>
                      //   <h1>Ihsan</h1>
                      // </div>
                      <div
                        className="col-lg-10"
                        key={`${idx}-${new Date().getTime()}`}
                      >
                        <div className="card-post card card-ss">
                          <div className="mx-4 mt-4">
                            <span className="label-ss rounded-pill bg-primary text-white">
                              {user?.role == "admin" &&
                                `   ${`${d?.user?.nama} - ${d?.rombel?.nama}`}`}
                              {user?.role == "siswa" &&
                                `   ${d?.timeline?.mataPelajaran?.nama} - ${d?.timeline?.user?.nama}`}
                            </span>
                            <hr style={{ backgroundColor: "#80849c" }} />
                          </div>
                          <div className="card-header card-header-ss p-4 flex-column">
                            {/* Post Title Start */}
                            <Link
                              href={`${ssURL}/timeline/[id]?hal=tugas`}
                              as={`${ssURL}/timeline/${d.id}?hal=tugas`}
                            >
                              <a className="text-decoration-none order-md-1 order-2">
                                <div className="card-post-title d-flex align-items-center flex-grow-1">
                                  <div
                                    className="rounded-circle shadow-primary-ss me-4"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                    }}
                                  >
                                    <img
                                      src={`/img/post-icon-1.svg`}
                                      alt="post-icon"
                                    />
                                  </div>
                                  <div className="title">
                                    <h6 className="color-dark fw-black m-0">
                                      Tugas
                                    </h6>
                                    <p className="color-secondary m-0 fs-14-ss mt-2">
                                      {d?.createdAt || d?.timeline?.createdAt}
                                    </p>
                                  </div>
                                </div>
                              </a>
                            </Link>
                            {/* Post Title End */}

                            {/* Dropdown Option Start */}

                            {/* Dropdown Option End */}
                          </div>

                          <div className="card-body pt-0 px-4 pb-3">
                            {/* Post Content Start */}
                            <Link
                              href={`${ssURL}/timeline/[id]?hal=tugas`}
                              as={`${ssURL}/timeline/${d.id}?hal=tugas`}
                            >
                              <a className="text-decoration-none">
                                <div className="row px-lg-0 px-md-0 mx-0">
                                  {/* Post Description Start */}

                                  <div
                                    className={`col-md-12 color-secondary clamp`}
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        tugas?.instruksi || tugas?.instruksi,
                                    }}
                                  ></div>

                                  {/* Post Description End */}

                                  {/* Post Complete Status Start*/}
                                  <div
                                    className={`bg-soft-primary rounded-ss d-flex align-items-center post-complete-status col-md-12 mt-3 py-3 `}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div
                                        className={`rounded-circle me-4 ${
                                          user?.role == "admin"
                                            ? "shadow-primary-ss"
                                            : d?.nilai
                                            ? "bg-primary d-flex justify-content-center align-items-center shadow-primary-ss"
                                            : !d?.dikumpulkan
                                            ? "shadow-danger-ss"
                                            : "shadow-primary-ss"
                                        }`}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      >
                                        {user?.role === "admin" ||
                                        (d?.dikumpulkan === 1 && !d?.nilai) ? (
                                          <img
                                            src={`/img/icon-complete.svg`}
                                            alt="post-icon"
                                            width="50px"
                                            height="50px"
                                          />
                                        ) : user?.role === "siswa" &&
                                          d?.nilai ? (
                                          <span className="fs-18-ss fw-bold text-white">
                                            {d?.nilai}
                                          </span>
                                        ) : (
                                          (!d?.dikumpulkan ||
                                            d?.dikumpulkan === 0) && (
                                            <img
                                              src="/img/icon-post-warning.svg"
                                              alt="post-icon"
                                              width="50px"
                                              height="50px"
                                            />
                                          )
                                        )}
                                      </div>
                                      <div className="div">
                                        <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                                          {user?.role === "admin"
                                            ? "Dikumpulkan"
                                            : "Tugas"}
                                        </p>
                                        <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                                          {user?.role === "admin"
                                            ? `${d?.meta?.totalRespon} / ${d?.meta?.totalSiswa} Siswa`
                                            : user?.role === "siswa" &&
                                              (!d?.dikumpulkan ||
                                                d?.dikumpulkan === 0)
                                            ? "Belum Dikerjakan"
                                            : d?.nilai
                                            ? "Sudah Dinilai"
                                            : "Sudah Dikumpul"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Post Complete Status End*/}
                                </div>
                              </a>
                            </Link>
                            {/* Post Content End */}
                          </div>
                          <div className="card-footer-ss p-4 pt-0">
                            <hr className="m-0 mb-3" />

                            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                              <Link
                                href={`${ssURL}/timeline/[id]?hal=tugas`}
                                as={`${ssURL}/timeline/${d.id}?hal=tugas`}
                              >
                                <a className="text-decoration-none">
                                  {/* Comment & Attachment Start */}
                                  <div className="d-flex mb-3 mb-md-0">
                                    <div className="comment color-dark fs-14-ss fw-bolder me-4">
                                      <FaCommentDots className="me-2" />
                                      <span>
                                        {user?.role == "admin" &&
                                          d?.meta?.totalKomen}
                                        {user?.role == "siswa" &&
                                          d?.timeline?.meta?.totalKomen}{" "}
                                        Komentar
                                      </span>
                                    </div>
                                    <div className="attach color-dark fs-14-ss fw-bolder">
                                      <FaPaperclip className="me-2" />
                                      <span>
                                        {user?.role == "admin" &&
                                          tugas?.lampiran?.length}
                                        {user?.role == "siswa" &&
                                          tugas?.lampiran?.length}{" "}
                                        Lampiran
                                      </span>
                                    </div>
                                  </div>
                                  {/* Comment & Attachment End */}
                                </a>
                              </Link>

                              {/* Alert Start */}
                              <div
                                className={`
                            rounded-ss px-4 py-2 text-white fs-14-ss
                            ${
                              tugas?.tanggalPengumpulan ||
                              tugas?.tanggalPengumpulan
                                ? momentPackage(
                                    momentPackage(
                                      tugas?.tanggalPengumpulan ||
                                        tugas?.tanggalPengumpulan
                                    ).format("YYYY-MM-DD ") +
                                      tugas?.waktuPengumpulan ||
                                      tugas?.waktuPengumpulan
                                  ) < momentPackage()
                                  ? "bg-secondary"
                                  : "bg-danger shadow-danger-ss"
                                : "bg-secondary"
                            }
                          `}
                              >
                                <FaRegClock className="me-2" />
                                Batas Pengumpulan{" "}
                                {tugas?.tanggalPengumpulan ||
                                tugas?.tanggalPengumpulan
                                  ? momentPackage(
                                      momentPackage(
                                        tugas?.tanggalPengumpulan ||
                                          tugas?.tanggalPengumpulan
                                      ).format("YYYY-MM-DD ") +
                                        tugas?.waktuPengumpulan ||
                                        tugas?.waktuPengumpulan
                                    ).fromNow()
                                  : "Tidak Ada"}
                              </div>
                              {/* Alert End */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // return (
                  //   <div className="col-lg-10" key={`${idx}-${new Date().getTime()}`}>
                  //     <div className="card-post card card-ss">
                  //       <div className="card-header card-header-ss p-4 d-flex flex-md-row flex-column justify-content-between">
                  //         {/* Post Title Start */}
                  //         <Link
                  //           href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                  //           as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                  //         >
                  //           <a className="text-decoration-none order-md-1 order-2">
                  //             <div className="card-post-title d-flex align-items-center flex-grow-1 ">
                  //               <div
                  //                 className="rounded-circle shadow-primary-ss me-4"
                  //                 style={{
                  //                   width: "50px",
                  //                   height: "50px",
                  //                 }}
                  //               >
                  //                 <img
                  //                   src={`/img/post-icon-1.svg`}
                  //                   alt="post-icon"
                  //                 />
                  //               </div>
                  //               <div className="title">
                  //                 <h6 className="color-dark fw-black m-0">
                  //                   {`${d?.user?.nama} - ${d?.rombel?.nama}`}
                  //                 </h6>
                  //                 <p className="color-secondary m-0 fs-14-ss mt-2">
                  //                   {momentPackage(d?.tanggalPembagian).format(
                  //                     "DD MMMM YYYY"
                  //                   )}
                  //                 </p>
                  //               </div>
                  //             </div>
                  //           </a>
                  //         </Link>
                  //         {/* Post Title End */}

                  //         {/* Dropdown Option Start */}

                  //         {user?.role == "guru" && (
                  //           <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end order-md-2 order-1">
                  //             <div
                  //               role="button"
                  //               id="dropdownMenuLink"
                  //               data-bs-toggle="dropdown"
                  //               aria-expanded="false"
                  //             >
                  //               <img
                  //                 src={`/img/icon-dropdown-option.svg`}
                  //                 alt="icon-option"
                  //               />
                  //             </div>
                  //             <ul
                  //               className="dropdown-menu dropdown-menu-ss my-1"
                  //               aria-labelledby="dropdownMenuLink"
                  //             >
                  //               <li
                  //                 data-bs-toggle="modal"
                  //                 data-bs-target="#modalAddPertemuan"
                  //                 onClick={() => handleClickEdit(d)}
                  //               >
                  //                 <a className="dropdown-item">
                  //                   <FaPen className="me-2" />
                  //                   <span>Edit</span>
                  //                 </a>
                  //               </li>

                  //               <li onClick={() => deleteTimelineData(d?.id)}>
                  //                 <a className="dropdown-item color-danger">
                  //                   <FaTrashAlt className="me-2" />
                  //                   <span>Hapus</span>
                  //                 </a>
                  //               </li>
                  //             </ul>
                  //           </div>
                  //         )}
                  //         {/* Dropdown Option End */}
                  //       </div>

                  //       <div className="card-body pt-0 px-4 pb-3">
                  //         {/* Post Content Start */}
                  //         <Link
                  //           href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                  //           as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                  //         >
                  //           <a className="text-decoration-none">
                  //             <div className="row px-lg-0 px-md-3">
                  //               {/* Post Description Start */}

                  //               <div
                  //                 className={`card-post-content dangerous-html ${
                  //                   user?.role === "guru" ||
                  //                   user?.role == "admin" ||
                  //                   user?.role == "kepsek"
                  //                     ? "col-lg-9"
                  //                     : "col-lg-8"
                  //                 } col-md-8 color-secondary`}
                  //                 dangerouslySetInnerHTML={{
                  //                   __html:
                  //                     d?.deskripsi || d?.timeline?.deskripsi,
                  //                 }}
                  //               />

                  //               {/* Post Description End */}

                  //               {/* Post Complete Status Start*/}
                  //               <div
                  //                 className={`bg-soft-primary rounded-ss d-flex align-items-center post-complete-status ${
                  //                   user?.role === "guru" ||
                  //                   user?.role == "admin" ||
                  //                   user?.role == "kepsek"
                  //                     ? "col-lg-3 p-3"
                  //                     : "col-lg-4 py-3 px-4"
                  //                 } col-md-4 mt-md-0 mt-3`}
                  //               >
                  //                 <div className="d-flex align-items-center">
                  //                   <div
                  //                     className={`rounded-circle ${
                  //                       user?.role == "guru" ||
                  //                       user?.role == "admin" ||
                  //                       user?.role == "kepsek"
                  //                         ? "shadow-primary-ss"
                  //                         : !d?.absen
                  //                         ? "shadow-danger-ss"
                  //                         : "shadow-primary-ss"
                  //                     } me-4`}
                  //                     style={{
                  //                       width: "50px",
                  //                       height: "50px",
                  //                     }}
                  //                   >
                  //                     <img
                  //                       src={`${
                  //                         user?.role == "guru" ||
                  //                         user?.role == "admin" ||
                  //                         user?.role == "kepsek"
                  //                           ? `/img/icon-complete.svg`
                  //                           : !d?.absen
                  //                           ? "/img/icon-post-warning.svg"
                  //                           : `/img/icon-complete.svg`
                  //                       }`}
                  //                       alt="post-icon"
                  //                       width="50px"
                  //                       height="50px"
                  //                     />
                  //                   </div>
                  //                   <div className="div">
                  //                     {user?.role === "guru" ||
                  //                     user?.role == "admin" ||
                  //                     user?.role == "kepsek" ? (
                  //                       <>
                  //                         <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                  //                           Diabsen
                  //                         </p>
                  //                         <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                  //                           {`${d.meta.totalAbsen} / ${d.meta.totalSiswa}`}{" "}
                  //                           Siswa
                  //                         </p>
                  //                       </>
                  //                     ) : (
                  //                       <>
                  //                         <p className="m-0 mb-1 fs-14-ss color-secondary fw-semibold">
                  //                           Kamu hari ini
                  //                         </p>
                  //                         <p className="m-0 text-white fw-extrabold fs-18-ss color-dark">
                  //                           {!d?.absen
                  //                             ? "Belum Absen"
                  //                             : "Sudah Absen"}
                  //                         </p>
                  //                       </>
                  //                     )}
                  //                   </div>
                  //                 </div>
                  //               </div>

                  //               {/* Post Complete Status End*/}
                  //             </div>
                  //           </a>
                  //         </Link>
                  //         {/* Post Content End */}
                  //       </div>
                  //       <div className="card-footer-ss p-4 pt-0">
                  //         <hr className="m-0 mb-3" />

                  //         <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                  //           <Link
                  //             href={`${ssURL}/timeline/[id]?hal=pertemuan`}
                  //             as={`${ssURL}/timeline/${d?.id}?hal=pertemuan`}
                  //           >
                  //             <a className="text-decoration-none">
                  //               {/* Comment & Attachment Start */}
                  //               <div className="d-flex mb-3 mb-md-0">
                  //                 <div className="comment color-dark fs-14-ss fw-bolder me-4">
                  //                   <FaCommentDots className="me-2" />
                  //                   <span>
                  //                     {(user?.role == "guru" ||
                  //                       user?.role == "admin" ||
                  //                       user?.role == "kepsek") &&
                  //                       d?.meta?.totalKomen}
                  //                     {user?.role == "siswa" &&
                  //                       d?.timeline?.meta?.totalKomen}{" "}
                  //                     Komentar
                  //                   </span>
                  //                 </div>
                  //                 <div className="attach color-dark fs-14-ss fw-bolder">
                  //                   <FaPaperclip className="me-2" />
                  //                   <span>
                  //                     {(user?.role == "guru" ||
                  //                       user?.role == "admin" ||
                  //                       user?.role == "kepsek") &&
                  //                       d?.lampiran?.length}
                  //                     {user?.role == "siswa" &&
                  //                       d?.timeline?.lampiran?.length}{" "}
                  //                     Lampiran
                  //                   </span>
                  //                 </div>
                  //               </div>
                  //               {/* Comment & Attachment End */}
                  //             </a>
                  //           </Link>

                  //           {/* Alert Start */}
                  //           {(d.rpp?.length || d.jurnal) &&
                  //           (user?.role == "guru" ||
                  //             user?.role == "admin" ||
                  //             user?.role == "kepsek") ? (
                  //             <div className="rounded-ss px-4 py-2 bg-success shadow-success-ss text-white fs-14-ss">
                  //               <img
                  //                 src={`/img/icon-check-alert.svg`}
                  //                 alt="icon-check-alert"
                  //                 className="me-2"
                  //               />
                  //               {d?.user?.nama} Sudah Menulis Jurnal Harian
                  //             </div>
                  //           ) : user?.role == "guru" ||
                  //             user?.role == "admin" ||
                  //             user?.role == "kepsek" ? (
                  //             <div className="rounded-ss px-4 py-2 bg-danger shadow-danger-ss text-white fs-14-ss">
                  //               <img
                  //                 src={`/img/icon-warning-alert.svg`}
                  //                 alt="icon-warning-alert"
                  //                 className="me-2"
                  //               />
                  //               {d?.user?.nama} Belum Menulis Jurnal Harian
                  //             </div>
                  //           ) : null}

                  //           {/* Alert End */}
                  //         </div>
                  //       </div>
                  //     </div>
                  //   </div>
                  // );
                })}
              </div>
            )}
          </>
        )}
        <ModalMonev />
      </motion.div>
    </Layout>
  );
};

export default index;
