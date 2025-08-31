import { Badge, DatePicker, Select, TimePicker } from "antd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaFile,
  FaLink,
  FaPaperclip,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { ssURL } from "../../../../client/clientAxios";
import { getDetailRombel } from "../../../../client/RombelClient";
import {
  editTimeline,
  getTimeline,
  postTimeline,
} from "../../../../client/TimelineClient";
import {
  deleteTugas,
  editTugas,
  getTugas,
  postTugas,
} from "../../../../client/TugasClient";
import { uploadFile } from "../../../../client/uploadFileClient";
import Layout from "../../../../components/Layout/Layout";
import ModalAddPertemuan from "../../../../components/pertemuan/ModalAddPertemuan";
import AnalisisMateriPage from "../../../../components/Rombel/AnalisisMateriPage";
import AnalisisNilaiPage from "../../../../components/Rombel/AnalisisNilaiPage";
import InfoPage from "../../../../components/Rombel/InfoPage";
import PertemuanPage from "../../../../components/Rombel/PertemuanPage";
import RaporPage from "../../../../components/Rombel/RaporPage";
import TimelinePage from "../../../../components/Rombel/TimelinePage";
import TugasPage from "../../../../components/Rombel/TugasPage";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import Editor from "../../../../components/Shared/Editor/Editor";
import InputFile from "../../../../components/Shared/InputFile/InputFile";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import LampiranSkeleton from "../../../../components/Shared/Skeleton/LampiranSkeleton";
import Tabs from "../../../../components/Shared/Tabs/Tabs";
import ModalBuatTugas from "../../../../components/Tugas/ModalBuatTugas";
import useUser from "../../../../hooks/useUser";
import { momentPackage } from "../../../../utilities/HelperUtils";
import { hideModal } from "../../../../utilities/ModalUtils";
import router from "next/router";

const index = ({ id, rombel_id, nav, subnav, tanggal, taId }) => {
  // ======= ROUTER =======
  // ======= TUGAS STATE =======
  const initialState = {
    judul: "",
    instruksi: "",
    tanggalPembagian: "",
    tanggalAkhir: "",
    waktuPembagian: "",
    dikumpulkan: false,
    dikkm: false,
    dijadwalkan: false,
    tanggalPengumpulan: "",
    waktuPengumpulan: "",
    lampiran: [],
    link: [],
    mJadwalMengajarId: id,
    kkm: 0,
    gmeet: "",
    draft: 0,
    deskripsi: "",
    hari_ini: momentPackage().format("YYYY-MM-DD"),
  };
  const { user } = useUser();
  const [formData, setFormData] = useState(initialState);
  const [tugasData, setTugasData] = useState([]);
  const [link, setLink] = useState("");
  const [isTugasLoading, setIsTugasLoading] = useState(true);
  const [onUpload, setOnUpload] = useState(false);
  const [anggotaRombel, setAnggotaRombel] = useState([]);
  const [listRombel, setListRombel] = useState([]);
  const [listAnggota, setListAnggota] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const { materi } = tugasData;

  let rombelOptions = [];
  let rombelIdCheck = 0;

  materi?.materiRombel?.map((rombelData) => {
    if (rombelIdCheck !== rombelData?.rombel?.id) {
      rombelIdCheck = rombelData?.rombel?.id;
      rombelOptions.push({
        label: rombelData?.rombel?.nama || "",
        value: rombelData?.rombel?.id || "",
      });
    }
  });

  let rombelIds = [];
  let anggotaRombelOptions = [
    {
      label: "Pilih Semua Siswa",
      value: "all",
    },
  ];
  anggotaRombel?.map((anggota) => {
    anggotaRombelOptions.push({
      label: anggota?.user?.nama || "",
      value: anggota?.user?.id || "",
    });
    rombelIds.push(anggota?.user?.id);
  });

  // ======= TIMELINE STATE =======
  const [timelineData, setTimelineData] = useState([]);
  const [buttonStatePertemuan, setButtonStatePertemuan] = useState("idle");
  const [detailRombelData, setDetailRombelData] = useState({});
  const [loading, setLoading] = useState(true);
  const {
    jadwalMengajar,
    integrasi,
    analisisMateri,
    checkAbsensi,
    analisisNilai,
    judulTugas,
    industri,
    sikapsosial,
    sikapspiritual,
    totalMapel,
    kkm,
    semuaTA,
    dataTA,
  } = detailRombelData;

  // ======= Fitur E-Rapor =======
  const keterangan = jadwalMengajar?.rombel?.anggotaRombel;
  const keteranganRombel = jadwalMengajar?.rombel;
  const totalMapelSiswa = totalMapel;

  // ======= TUGAS FUNCTION =======
  const setInitialFormData = () => {
    setFormData(initialState);
    setListRombel([jadwalMengajar?.rombel?.id]);
    setListAnggota([]);
    setEditId(null);
    setIsDuplicate(false);
  };

  const setStateEditData = async (data, setId = true) => {
    let editTugasData = { ...data.tugas };

    setId ? setEditId(editTugasData.id) : setEditId(null);

    const {
      tanggalPengumpulan,
      waktuPengumpulan,
      tanggalPembagian,
      waktuPembagian,
      timeline,
    } = editTugasData;

    if (tanggalPengumpulan && waktuPengumpulan) {
      editTugasData.dikumpulkan = true;
    }

    if (tanggalPembagian && waktuPembagian) {
      editTugasData.dijadwalkan = true;
    }

    if (editTugasData?.kkm) {
      editTugasData.dikkm = true;
    }

    if (setId) {
      window.$(`#instruksi-tugas`).summernote("code", editTugasData.instruksi);
    }
    if (timeline?.length > 0) {
      let rombelData = [];

      timeline.map((dataTimeline) => {
        rombelData.push(dataTimeline.rombel.id);
      });

      setListRombel(rombelData);

      if (rombelData.length === 1) {
        const { data } = await getDetailRombel(id, {
          rombel_id: rombelData[0],
        });
        if (data) {
          const {
            jadwalMengajar: { rombel },
          } = data;
          setAnggotaRombel(rombel.anggotaRombel);
        }
      }
    }

    if (timeline?.length === 1) {
      let anggota = [];

      timeline[0].tkTimeline.map((dataTkTimeline) => {
        anggota.push(dataTkTimeline.mUserId);
      });

      setListAnggota(anggota);
    }

    setFormData({
      ...editTugasData,
      tanggalPengumpulan: momentPackage(tanggalPengumpulan),
      waktuPengumpulan: setId
        ? waktuPengumpulan
          ? momentPackage(waktuPengumpulan, "HH:mm")
          : null
        : null,
      tanggalPembagian: momentPackage(tanggalPembagian),
      waktuPembagian: setId
        ? waktuPembagian
          ? momentPackage(waktuPembagian, "HH:mm")
          : null
        : null,
    });
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeFormPertemuan = (e, name, value) => {
    setFormData({
      ...formData,
      [name || e.target.name]: value || e.target.value,
    });
  };

  const handleChangeDate = (dateString, key) => {
    setFormData({
      ...formData,
      [key]: dateString ? momentPackage(dateString) : "",
    });
  };

  const formatDateTimeValue = (value, type) => {
    if (type === "date") {
      return value._isValid ? momentPackage(value, "DD-MM-YYYY") : null;
    }

    if (type === "time") {
      return value._isValid ? momentPackage(value, "HH:mm") : null;
    }
  };

  const getAnggotaRombel = async (newValue) => {
    const { data } = await getDetailRombel(id, {
      rombel_id: listRombel[0] || newValue[0],
    });
    if (data) {
      const {
        jadwalMengajar: { rombel },
      } = data;
      setAnggotaRombel(rombel.anggotaRombel);
    }
  };

  const handleChangeSelect = async (type, newValue) => {
    if (type === "pilihKelas") {
      setListRombel(newValue);

      if (newValue.length === 1) {
        getAnggotaRombel(newValue);
      } else if (newValue.length > 1) {
        setListAnggota([]);
      }
    } else {
      if (newValue && newValue.includes("all")) {
        if (newValue.length === rombelIds.length + 1) {
          return setListAnggota([]);
        }
        return setListAnggota([...rombelIds]);
      }

      return setListAnggota(newValue);
    }
  };

  const getTugasData = async () => {
    setIsTugasLoading(true);
    const { data } = await getTugas({
      mJadwalMengajarId: id,
      hariIni: momentPackage().format("YYYY-MM-DD"),
      jamSaatIni: momentPackage().format("HH:mm"),
    });
    if (data) {
      setTugasData(data);
    }
    setIsTugasLoading(false);
  };

  const handleModalSubmit = async (isDraft = false) => {
    if (!formData.judul) {
      toast.error("Anda belum memberikan judul tugas");
      return;
    } else if (!window.$(`#instruksi-tugas`).summernote("code")) {
      toast.error("Anda belum memberikan instruksi tugas");
      return;
    } else if (!listRombel.length) {
      toast.error("Anda belum memilih kelas untuk diberikan tugas");
      return;
    } else if (!listAnggota.length && listRombel.length == 1) {
      toast.error("Anda belum memilih siswa untuk diberikan tugas");
      return;
    } else if (formData.dikumpulkan && !formData.tanggalPengumpulan) {
      toast.error("Anda belum memberikan tanggal pengumpulan tugas");
      return;
    } else if (formData.dikumpulkan && !formData.waktuPengumpulan) {
      toast.error("Anda belum memberikan waktu pengumpulan tugas");
      return;
    } else if (formData.dikkm && !formData.kkm) {
      toast.error("Anda belum memberikan kkm untuk tugas");
      return;
    } else if (formData.dijadwalkan && !formData.tanggalPembagian) {
      toast.error("Anda belum memberikan tanggal pembagian tugas");
      return;
    } else if (formData.dijadwalkan && !formData.waktuPembagian) {
      toast.error("Anda belum memberikan waktu pembagian tugas");
      return;
    }

    const body = {
      ...formData,
      listAnggota,
      listRombel,
    };

    if (body.tanggalPembagian) {
      body.tanggalPembagian =
        momentPackage(body.tanggalPembagian).format("YYYY-MM-DD") ==
        "Invalid date"
          ? null
          : momentPackage(body.tanggalPembagian).format("YYYY-MM-DD");
      body.waktuPembagian =
        momentPackage(body.waktuPembagian).format("HH:mm:ss") == "Invalid date"
          ? null
          : momentPackage(body.waktuPembagian).format("HH:mm:ss");
    }

    if (body.tanggalPengumpulan) {
      body.tanggalPengumpulan =
        momentPackage(body.tanggalPengumpulan).format("YYYY-MM-DD") ==
        "Invalid date"
          ? null
          : momentPackage(body.tanggalPengumpulan).format("YYYY-MM-DD");
      body.waktuPengumpulan =
        momentPackage(body.waktuPengumpulan).format("HH:mm:ss") ==
        "Invalid date"
          ? null
          : momentPackage(body.waktuPengumpulan).format("HH:mm:ss");
    }

    if (!formData.dijadwalkan) {
      body.tanggalPembagian = momentPackage().format("YYYY-MM-DD");
    }

    body.instruksi = window.$(`#instruksi-tugas`).summernote("code");
    body.draft = 0;
    body.mJadwalMengajarId = id;

    if (isDraft) {
      body.draft = 1;
    }

    const { data } =
      editId && !isDuplicate
        ? await editTugas(body, editId)
        : await postTugas(body);
    if (data) {
      toast.success(data?.message);
      window.$(`#instruksi-tugas`).summernote("reset");
      setInitialFormData();
      hideModal("modalBuatTugas");
      getTugasData();
      getTimelineData();
    }
  };

  const uploadFileToServer = async (e, data) => {
    // setOnUpload(true);
    if (data) {
      setFormData({
        ...formData,
        lampiran: [...formData.lampiran, data],
      });
    }
    // setOnUpload(false);
  };

  const deleteLampiran = (lampiran) => {
    const modifiedLampiran = formData?.lampiran?.filter(
      (val) => val !== lampiran
    );
    setFormData({
      ...formData,
      lampiran: [...modifiedLampiran],
    });
  };

  const handleChangeLink = (e) => {
    setLink(e.target.value);
  };

  const uploadLink = () => {
    if (link) {
      setFormData({
        ...formData,
        link: [...formData?.link, link],
      });
      hideModal("modalTautanLinkBuatSoalLabel");
      setLink("");
    }
  };

  const deleteLink = (link) => {
    const modifiedLink = formData?.link?.filter((val) => val !== link);
    setFormData({
      ...formData,
      link: [...modifiedLink],
    });
  };

  const navItemsModalTugas = [
    {
      id: "file-unggahan",
      nav: "File Unggahan",
      active: true,
      content: (
        <>
          {onUpload && <LampiranSkeleton />}
          {!onUpload && formData?.lampiran?.length === 0 && (
            <p className="mt-3">Tidak ada file yang diunggah</p>
          )}
          {!onUpload &&
            formData?.lampiran?.map((lampiran) => (
              <div className="mt-3">
                <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                  <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                        <FaFile className="text-white fs-3" />
                      </div>
                      <div className="p-2">
                        <p className="fw-bold color-dark mb-0">{lampiran}</p>
                        <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                          {/* PDF */}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                      <a
                        href={`${lampiran}`}
                        className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                      >
                        Pratinjau
                      </a>
                      <FaTimes
                        className="text-secondary"
                        onClick={() => deleteLampiran(lampiran)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
      ),
    },
    {
      id: "tautan-link",
      nav: "Tautan Link",
      active: false,
      content: (
        <>
          {formData?.link?.length === 0 && (
            <p className="mt-3">Tidak tautan link</p>
          )}
          {formData?.link?.map((link) => (
            <div className="mt-3">
              <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="ms-0 m-2 shadow-primary-ss pdf-icon">
                      <FaLink className="text-white fs-3" />
                    </div>
                    <div className="p-2">
                      <p className="fw-bold color-dark mb-0">Smartschool</p>
                      <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                        {link}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                    >
                      Pratinjau
                    </a>
                    <FaTimes
                      className="text-secondary"
                      onClick={() => deleteLink(link)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ),
    },
  ];

  // ======= TIMELINE FUNCTION =======

  const handlePostTimelineData = async (tipe) => {
    setButtonStatePertemuan("loading");
    if (tipe == "absen") {
      const payload = {
        ...formData,
        tipe: tipe,
        mJadwalMengajarId: id,
        tanggalPembagian: momentPackage(formData.tanggalPembagian).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        tanggalAkhir: moment(formData.tanggalAkhir).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        tanggalPengumpulan: momentPackage(formData.tanggalPengumpulan).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
      };

      const { data, isSuccess, error } = editId
        ? await editTimeline(editId, payload)
        : await postTimeline({
            ...payload,
            tanggalPembagian: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
          });

      if (isSuccess) {
        toast.success(data?.message);
        setButtonStatePertemuan("success");
        getTimelineData();
        setFormData(initialState);
        hideModal("modalAddPertemuan");
      } else {
        toast.error(error?.message);
        setButtonStatePertemuan("error");
      }
    } else if (tipe == "diskusi") {
      const { data, isSuccess, error } = !editId
        ? await postTimeline({
            ...formData,
            tipe: tipe,
            deskripsi: window.$(`#editorDiskusi`).summernote("code"),
          })
        : await editTimeline(editId, {
            ...formData,
            tipe: tipe,
            deskripsi: window.$(`#editorDiskusi`).summernote("code"),
          });

      if (isSuccess) {
        toast.success(data?.message);
        setButtonStatePertemuan("success");
        getTimelineData();
        !editId && setFormData(initialState);
        hideModal("modalAddPostingan");
        window.$(`#editorDiskusi`).summernote("code", "");
      } else {
        toast.error(error?.message);
        setButtonStatePertemuan("error");
      }
    }
  };

  const getTimelineData = async () => {
    setLoading(true);
    const { data } = await getTimeline({
      m_jadwal_mengajar_id: id,
      hari_ini: momentPackage().format("YYYY-MM-DD"),
      waktu_saat_ini: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
    });

    if (data) {
      setTimelineData(data);
    }
    setLoading(false);
  };

  const getDetailRombelData = async () => {
    const { data } = await getDetailRombel(id, {
      rombel_id: rombel_id,
      kode_hari: new Date().getDay(),
      ta_id: taId,
    });

    if (data) {
      setDetailRombelData(data);
    }
  };

  const handleDeleteTugasData = (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteTugas(id);
        if (data) {
          toast.success(data?.message);
          getTugasData();
        }
      }
    });
  };

  // ======= USE EFFECT =======

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [nav]);

  useEffect(() => {
    if (listRombel.length > 0) {
      getAnggotaRombel();
    }
  }, [listRombel]);

  useEffect(() => {
    getDetailRombelData();
    getTugasData();
    getTimelineData();
  }, [taId]);

  const RombelLayout = ({ children }) => {
    const tugasLength = timelineData?.timeline?.filter(
      (data) => data.tipe === "tugas" && !data.dikumpulkan
    )?.length;
    const pertemuanLength = timelineData?.timeline?.filter(
      (data) => data.tipe === "absen" && !data.waktuAbsen
    )?.length;

    const navMenus = [
      {
        href: `${ssURL}/rombel/[id]?nav=timeline`,
        as: `${ssURL}/rombel/${id}?nav=timeline`,
        text: "Timeline",
        active: nav == "timeline" || !nav,
        isVisible: true,
        dataJoyride: "timeline",
      },
      {
        href: `${ssURL}/rombel/[id]?nav=analisis-materi`,
        as: `${ssURL}/rombel/${id}?nav=analisis-materi`,
        text: "Analisis Materi",
        active: nav == "analisis-materi",
        isVisible: user?.role !== "siswa",
        dataJoyride: "analisis-materi",
      },
      {
        href: `${ssURL}/rombel/[id]?nav=tugas`,
        as: `${ssURL}/rombel/${id}?nav=tugas`,
        text: "Tugas",
        active: nav == "tugas",
        isVisible: true,
        withBadge: {
          show: user?.role === "siswa" && tugasLength > 0,
          text: tugasLength,
        },
        dataJoyride: "tugas",
      },
      {
        href: `${ssURL}/rombel/[id]?nav=pertemuan`,
        as: `${ssURL}/rombel/${id}?nav=pertemuan`,
        text: "Pertemuan",
        active: nav == "pertemuan",
        isVisible: true,
        withBadge: {
          show: user?.role === "siswa" && pertemuanLength > 0,
          text: pertemuanLength,
        },
        dataJoyride: "pertemuan",
      },
      {
        href: `${ssURL}/rombel/[id]?nav=analisis-nilai`,
        as: `${ssURL}/rombel/${id}?nav=analisis-nilai`,
        text: "Analisis Nilai",
        active: nav == "analisis-nilai",
        isVisible: user?.role === "guru",
        dataJoyride: "analisis-nilai",
      },
      {
        href: `${ssURL}/rombel/[id]?nav=rapor`,
        as: `${ssURL}/rombel/${id}?nav=rapor`,
        text: "Rapor",
        active: nav == "rapor",
        isVisible: user?.role === "guru",
        dataJoyride: "rapor",
      },
    ];
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div
              className={`${
                user?.role == "guru" && "d-flex justify-content-between"
              }`}
            >
              <Link href={`${ssURL}/rombel`}>
                <a className="text-decoration-none fw-bolder color-primary">
                  <FaChevronLeft />
                  <span className="ms-2">Daftar Kelas</span>
                </a>
              </Link>
            </div>

            {/* Card Kelas Start */}
            <div className="card-header-kelas-ss card card-kelas-ss card-ss px-0 mt-3 mb-4">
              <div className="card-body px-4 pt-3 pb-5 justify-content-between d-flex mb-lg-0 mb-3">
                <div className="card-kelas-name text-white">
                  <h2 className="mb-2 fw-black">
                    {user?.role == "siswa"
                      ? jadwalMengajar?.mataPelajaran?.nama
                      : jadwalMengajar?.rombel?.nama}
                  </h2>
                  <p className="m-0 fw-semibold fs-18-ss">
                    {user?.role == "siswa"
                      ? jadwalMengajar?.mataPelajaran?.user?.nama
                      : jadwalMengajar?.mataPelajaran?.nama}
                  </p>
                </div>
                <div
                  className="card-kelas-info hover-scale"
                  data-joyride="kelas-info"
                >
                  <Link
                    href={`${ssURL}/rombel/[id]?nav=info`}
                    as={`${ssURL}/rombel/${id}?nav=info`}
                  >
                    <a>
                      <img
                        src={`/img/button-info.svg`}
                        alt="button-info"
                        width={40}
                        height={40}
                      />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="card-footer card-footer-ss card-kelas-footer py-lg-3 py-0 px-lg-3 px-0 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center align-items-stretch">
                <div className="kelas-nav d-flex flex-column flex-lg-row">
                  {navMenus.map((d) => {
                    return (
                      d.isVisible && (
                        <Link href={d.href} as={d.as}>
                          <a
                            className={`position-relative text-decoration-none fw-bold px-0  me-lg-5 me-0 pt-0 py-3 py-lg-0 text-center text-mb-left mb-lg-0 mb-3 ${
                              d.active ? "color-primary" : "color-secondary"
                            }`}
                            data-joyride={d.dataJoyride || ""}
                          >
                            {d?.withBadge?.show && (
                              <Badge
                                count={parseInt(d?.withBadge?.text)}
                                className="position-absolute"
                                style={{ top: "-18px", right: "-40px" }}
                              />
                            )}
                            {d.text}
                          </a>
                        </Link>
                      )
                    );
                  })}
                </div>
                {/* <a
                  href="https://chat.whatsapp.com/KDMx875yz511IUjDcI5IIy"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-14-ss fw-bolder py-1 px-3 mb-3 mb-lg-0 mx-2 mx-lg-0"
                  data-joyride="grup-kelas"
                >
                  <span className="me-2">Grup {integrasi}</span>
                  <FaAngleRight />
                </a> */}
              </div>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  };

  const steps = [];

  if (user?.role == "guru") {
    steps.push(
      {
        target: '[data-joyride="kelas-info"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi kelas</h5>
            <p className="color-secondary fw-semibold">
              Klik tombol ini, untuk melihat informasi dari kelas anda. Disini
              anda bisa melihat siapa saja anggota dari kelas anda dan informasi
              dari setiap anggota kelas anda.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="timeline"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Timeline</h5>
            <p className="color-secondary fw-semibold">
              Menu ini berisi mengenai kesimpulan dari semua aktivitas kelas
              anda. Disini anda bisa melihat semua aktivitas terbaru yang ada
              pada kelas anda, seperti pertemuan kelas, tugas kelas dan juga
              diskusi kelas.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="analisis-materi"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Analisis Materi</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisi mengenai materi pelajaran yang anda buat
              untuk kelas anda. Disini anda dapat menganalisis aktivitas belajar
              siswa terkait materi yang anda berikan untuk kelas anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="tugas"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisi mengenai semua aktivitas tugas dari kelas
              anda. Pada menu ini anda dapat membuat tugas, memonitor aktivitas
              pengerjaan tugas dan juga melakukan penilaian tugas siswa anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="pertemuan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Pertemuan</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisi semua aktivitas mengenai pertemuan yang ada
              dikelas. Disini anda dapat membuat pertemuan untuk kelas anda
              untuk melakukan pembelajaran di kelas.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="analisis-nilai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Analisis Nilai</h5>
            <p className="color-secondary fw-semibold">
              Disini anda dapat melihat nilai nilai dari siswa di kelas anda.
              Pada menu ini juga disajikan informasi mengenai ketertiban siswa
              dalam mengerjakan tugas anda. Anda dapat menganalisis seberapa
              rajin siswa anda dalam mengerjakan tugas pada kelas anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="grup-kelas"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Grup Kelas</h5>
            <p className="color-secondary fw-semibold">
              Lakukan diskusi kelas lebih lanjut dengan menggunakan sosial media
              dengan menggunaka menekan tombol ini. Grup ini akan secara
              otomatis terintegrasi dengan grup kelas yang anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="add-postingan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin melakukan diskusi dengan kelas?
            </h5>
            <p className="color-secondary fw-semibold">
              Klik pada bagian ini untuk melakukan diskusi dengan kelas atau
              memberikan postingan pada kelas anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="topik-materi"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Topik Materi</h5>
            <p className="color-secondary fw-semibold">
              Topik dari BAB materi yang anda berikan untuk kelas anda. Untuk
              melihat lebih detail mengenai aktivitas baca siswa terkait topik
              materi ini, anda dapat menekan pada bagian ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="progres-materi"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Progres Materi</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat melihat berapa banyak siswa yang sudah membaca materi
              yang anda bagikan.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="saat-ini"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Saat Ini</h5>
            <p className="color-secondary fw-semibold">
              Berisi tugas tugas yang sedang diberikan saat ini. Anda dapat
              melihat berapa banyak tugas saat ini dengan memilih menu ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="terjadwal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Terjadwal</h5>
            <p className="color-secondary fw-semibold">
              Berisi tugas tugas yang dijadwalkan untuk diberikan ke kelas
              nanti. Anda dapat melihat berapa banyak tugas terjadwal dengan
              memilih menu ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="sudah-selesai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Sudah Selesai</h5>
            <p className="color-secondary fw-semibold">
              Berisi tugas tugas yang sudah selesai dikerjakan siswa atau sudah
              lewat dari batas pengumpulan. Anda dapat melihat berapa banyak
              tugas sudah selesai dengan memilih menu ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="terperiksa"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Terperiksa</h5>
            <p className="color-secondary fw-semibold">
              Berisi tugas tugas yang sudah anda nilai. Anda dapat melihat
              berapa banyak tugas terperiksa dengan memilih menu ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="draf"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Draf</h5>
            <p className="color-secondary fw-semibold">
              Berisi tugas tugas yang anda draf dan belum dibagikan kepada kelas
              anda. Anda dapat melihat berapa banyak tugas draf dengan memilih
              menu ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-buat-tugas"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Membuat Tugas Untuk Kelas Anda?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol ini jika anda ingin membuat tugas untuk kelas anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="unduh-absen"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Unduh Absen</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat merekap semua pertemuan yang sudah anda buat dan dapat
              melihat informasi mengenai absen siswa. Tekan tombol ini untuk
              mengunduh rekap pertemuan berupa file excel.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-buat-pertemuan"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Membuat Pertemuan Dengan Kelas?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol ini jika anda ingin melakukan pertemuan dengan kelas
              anda.
            </p>
          </div>
        ),
      }
    );
  }

  return nav == "info" ? (
    <InfoPage
      jadwalMengajar={jadwalMengajar}
      id={id}
      user={user}
      getDetailRombelData={getDetailRombelData}
    />
  ) : (
    <Layout
      modalWrapper={
        <>
          <div
            className="modal modal-ss fade"
            id="modalAddPostingan"
            tabIndex="-1"
            aria-labelledby="modalAddPostinganLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4
                    className="modal-title fw-extrabold"
                    id="exampleModalLabel"
                  >
                    {editId ? "Edit" : "Buat"} Postingan
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => hideModal("modalAddPostingan")}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="d-flex align-items-center">
                    <img src={`/img/avatar.svg`} width={50} height={50} />
                    <div className="w-75 text-break ms-4">
                      <p className="mb-0 fw-semibold color-secondary">
                        {user?.nama}
                      </p>
                    </div>
                  </div>
                  <div className="my-4">
                    <Editor id="editorDiskusi" />
                  </div>
                  <hr className="mt-4" />
                  <div className="d-flex justify-content-between align-items-center mb-4  flex-wrap">
                    <h6 className="mt-0 fw-bold color-dark">Lampiran</h6>
                    <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between">
                      <label
                        htmlFor="lampiranRombelDetail"
                        className="btn btn-ss fs-12-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold form-label"
                      >
                        <FaPaperclip className="me-2" />
                        Unggah File
                      </label>
                      <InputFile
                        className="form-control d-none"
                        type="file"
                        id="lampiranRombelDetail"
                        onChange={uploadFileToServer}
                      />
                    </div>
                  </div>
                  {formData?.lampiran?.map((lampiran) => (
                    <div className="mt-3">
                      <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                        <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                              <FaFile className="text-white fs-3" />
                            </div>
                            <div className="p-2">
                              <p className="fw-bold color-dark mb-0">
                                {lampiran}
                              </p>
                              <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                                {/* PDF */}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                            <a
                              target="_blank"
                              rel="noreferrer noopener"
                              href={`${lampiran}`}
                              className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                            >
                              Pratinjau
                            </a>
                            <FaTimes
                              className="text-secondary pointer"
                              onClick={() => deleteLampiran(lampiran)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="d-flex align-items-center w-50">
                      <div className="ms-4 react-multi-select select-share-posting">
                        {/* <ReactMultiSelectCheckboxes
                          options={options}
                          placeholderButtonLabel="Pilih Kelas.."
                        /> */}
                      </div>
                    </div>
                    {/* <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button> */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handlePostTimelineData("diskusi")}
                    >
                      {editId ? "Edit" : "Posting"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Modal Buat Postingan End--> */}
          </div>

          <ModalAddPertemuan
            editId={editId}
            formInput={formData}
            handleChangeForm={handleChangeFormPertemuan}
            handleModalSubmit={() => handlePostTimelineData("absen")}
          />
          <ModalBuatTugas
            editId={editId}
            isDuplicate={isDuplicate}
            formData={formData}
            listAnggota={listAnggota}
            listRombel={listRombel}
            navItemsModalTugas={navItemsModalTugas}
            onUpload={onUpload}
            setOnUpload={setOnUpload}
            rombelOptions={rombelOptions}
            anggotaRombelOptions={anggotaRombelOptions}
            formatDateTimeValue={formatDateTimeValue}
            uploadFileToServer={uploadFileToServer}
            handleChangeForm={handleChangeForm}
            handleChangeSelect={handleChangeSelect}
            handleChangeDate={handleChangeDate}
            handleModalSubmit={handleModalSubmit}
          />
          <div
            className="modal modal-ss fade"
            id="modalTautanLinkBuatSoalLabel"
            tabIndex="-1"
            aria-labelledby="modalTautanLinkBuatSoalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4
                    className="modal-title fw-extrabold"
                    id="modalTautanLinkBuatSoalLabel"
                  >
                    Tambah Link
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => hideModal("modalTautanLinkBuatSoalLabel")}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label className="form-label">Alamat Link</label>
                    <input
                      type="text"
                      className="form-control"
                      autoComplete="off"
                      placeholder="Contoh:https://smarteschool.id"
                      onChange={handleChangeLink}
                      value={link}
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <div className="row w-100">
                    <div className="col-6 ps-0">
                      <button
                        type="button"
                        className="btn btn-secondary w-100"
                        data-bs-dismiss="modal"
                      >
                        Batal
                      </button>
                    </div>
                    <div className="col-6 pe-0">
                      <button
                        type="button"
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                        onClick={uploadLink}
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    >
      <MyJoyride steps={steps} />
      <AnimatePage>
        <RombelLayout>
          {(!nav || nav == "timeline") && (
            <TimelinePage
              handleDeleteTugasData={handleDeleteTugasData}
              jadwalMengajar={jadwalMengajar}
              checkAbsensi={checkAbsensi}
              id={id}
              user={user}
              getTimelineData={getTimelineData}
              timelineData={timelineData}
              setFormData={setFormData}
              setEditId={setEditId}
              setStateEditData={setStateEditData}
              setIsDuplicate={setIsDuplicate}
              loading={loading}
            />
          )}
          {nav == "tugas" && (
            <TugasPage
              id={id}
              subnav={subnav}
              setInitialFormData={setInitialFormData}
              setStateEditData={setStateEditData}
              tugasData={tugasData}
              timelineData={timelineData}
              isLoading={isTugasLoading}
              getTugasData={getTugasData}
              setIsDuplicate={setIsDuplicate}
            />
          )}
          {nav == "pertemuan" && (
            <PertemuanPage
              id={id}
              user={user}
              subnav={subnav}
              jadwalMengajar={jadwalMengajar}
              timelineData={timelineData}
              setFormData={setFormData}
              setEditId={setEditId}
              mJadwalMengajarId={id}
              getTimelineData={getTimelineData}
              loading={loading}
              tanggal={tanggal}
            />
          )}
          {nav == "analisis-materi" && (
            <AnalisisMateriPage
              loading={loading}
              analisisMateri={analisisMateri}
              id={id}
              semuaTA={semuaTA}
              ta_id={taId}
            />
          )}
          {nav == "analisis-nilai" && (
            <AnalisisNilaiPage
              id={id}
              analisisNilai={analisisNilai}
              judulTugas={judulTugas}
              loading={loading}
              jadwalMengajar={jadwalMengajar}
            />
          )}
          {nav == "rapor" && (
            <RaporPage
              id={id}
              subnav={subnav}
              setInitialFormData={setInitialFormData}
              setStateEditData={setStateEditData}
              tugasData={tugasData}
              timelineData={timelineData}
              isLoading={isTugasLoading}
              getDetailRombelData={getDetailRombelData}
              setIsDuplicate={setIsDuplicate}
              jadwalMengajar={jadwalMengajar}
              keterangan={keterangan}
              industri={industri}
              sikapsosial={sikapsosial}
              sikapspiritual={sikapspiritual}
              keteranganRombel={keteranganRombel}
              kkm={kkm}
              totalMapel={totalMapelSiswa}
              dataTA={dataTA}
            />
          )}
        </RombelLayout>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { rombel_id, nav, subnav, tanggal, ta },
}) {
  return {
    props: {
      id,
      rombel_id: rombel_id || null,
      nav: nav || null,
      subnav: subnav || null,
      tanggal: tanggal || "",
      taId: parseInt(ta) || "",
    },
  };
}

export default index;
