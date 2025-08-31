import { DatePicker, InputNumber, Pagination, TimePicker } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import Select from "react-select";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  FaCalendarDay,
  FaClock,
  FaFilter,
  FaLink,
  FaPen,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";
import Joyride from "react-joyride";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { ssURL } from "../../../client/clientAxios";
import {
  deleteJadwalUjian,
  editJadwalUjian,
  getJadwalUjian,
  postJadwalUjian,
} from "../../../client/JadwalUjianClient";
import { postPesertaUjian } from "../../../client/PesertaUjianClient";
import Layout from "../../../components/Layout/Layout";
import AnimatePage from "../../../components/Shared/AnimatePage/AnimatePage";
import ModalStep from "../../../components/Shared/ModalStep/ModalStep";
import Navbar from "../../../components/Shared/Navbar/Navbar";
import NewModal from "../../../components/Shared/NewModal/NewModal";
import SelectShared from "../../../components/Shared/SelectShared/SelectShared";
import UjianSkeleton from "../../../components/Shared/Skeleton/UjianSkeleton";
import WhatsappLink from "../../../components/Shared/WhatsappLink/WhatsappLink";
import useJoyride from "../../../hooks/useJoyride";
import useSekolah from "../../../hooks/useSekolah";
import useUser from "../../../hooks/useUser";
import { hideModal } from "../../../utilities/ModalUtils";
import { useDebounce } from "use-debounce";
import { momentPackage } from "utilities/HelperUtils";
import InputJumlahSoal from "components/JadwalUjian/InputJumlahSoal";
import SideBarUjian from "components/Ujian/SideBarUjian";
import ModalJadwalRemedial from "components/Ujian/ModalJadwalRemedial";
import useBagian from "hooks/useBagian";
import { getGTK } from "client/GTKClient";
import { getUjian } from "client/UjianClient";

const initialFormData = {
  mUjianId: null,
  jumlahPg: 0,
  jumlahEsai: 0,
  jumlahIsian: 0,
  jumlahMenjodohkan: 0,
  jumlahUraian: 0,
  jumlahPgKompleks: 0,
  diacak: 0,
  keluartab: 1,
  kkm: "",
  waktuDibuka: "",
  durasi: "",
  gmeet: "",
  rombelId: [],
  token: "",
  tanggal: "",
  waktu: "",
  tampilNilai: 0,
  tampilJawaban: 0,
};

const index = ({ subnav, page }) => {
  const { user } = useUser();
  const router = useRouter();
  const { sekolah } = useSekolah();
  const elementRef = useRef(null);
  const loopInterval = useRef(null);
  const { bagian } = useBagian();

  const { joyrideConfig, setJoyrideConfig } = useJoyride();
  const [collapseOpen, setcollapseOpen] = useState(false);

  const [activeMenu, setActiveMenu] = useState(`/`);
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [clickDetailJadwalUjian, setClickDetailJadwalUjian] = useState("");
  const [jadwalUjianData, setJadwalUjianData] = useState({});
  const { ujian, rombel, jadwalUjian, pembayaran, total } =
    jadwalUjianData || {};
  const [buttonState, setButtonState] = useState("idle");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    nama: "",
    guru_id: "",
    mapel_id: "",
    tanggal: "",
  });
  const [listGuru, setListGuru] = useState([]);
  const [ujianData, setUjianData] = useState({});
  const [debounceSearch] = useDebounce(search?.nama, 600);

  const { mataPelajaran } = ujianData;

  const [tipeUjian, setTipeUjian] = useState("");
  const [current, setCurrent] = useState(0);

  const maksPg = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalPg
    : 0;
  const maksEsai = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalEsai
    : 0;
  const maksIsian = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalIsian
    : 0;
  const maksPgKompleks = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalPgKompleks
    : 0;
  const maksUraian = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalUraian
    : 0;
  const maksMenjodohkan = formData.mUjianId
    ? ujian?.find((d) => d?.id == formData?.mUjianId)?.meta?.soalMenjodohkan
    : 0;
  const ujianTerpilih = ujian?.find((d) => d?.id == formData?.mUjianId);

  const next = () => {
    if (!formData.mUjianId) {
      toast.error("Anda belum memilih daftar ujian");
      return;
    } else if (!formData.kkm) {
      toast.error([9349, 9350].includes(sekolah?.id) ? "Anda belum memasukkan KKTP ujian" : "Anda belum memasukkan KKM ujian");
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const setInitialFormData = () => {
    setFormData(initialFormData);
    setEditId(null);
  };

  const [nomorKartuUjian, setNomorKartuUjian] = useState("");

  const getTeachersData = async () => {
    setLoading(true);
    const { data } = await getGTK({
      page: "all",
    });
    if (data) {
      setLoading(false);
      const options = data?.guru?.map((item) => {
        return { value: item?.id, label: item?.nama };
      });
      setListGuru(options);
    }
  };

  const onClickEdit = (data, rombelData) => {
    let rombelId = [];

    rombelData?.map((rombel) => {
      rombelId.push(rombel?.rombel?.id);
    });

    setEditId(data?.id);
    setFormData({
      mUjianId: data?.ujian?.id,
      jumlahPg: data?.jumlahPg,
      jumlahEsai: data?.jumlahEsai,
      jumlahIsian: data?.jumlahIsian,
      jumlahMenjodohkan: data?.jumlahMenjodohkan,
      jumlahPgKompleks: data?.jumlahPgKompleks,
      jumlahUraian: data?.jumlahUraian,
      diacak: data?.diacak,
      kkm: data?.kkm,
      keluartab: data?.keluarTab,
      waktuDibuka: "",
      durasi: data?.durasi,
      gmeet: data?.gmeet,
      rombelId: rombelId,
      tanggal: moment(data?.tanggalInput),
      waktu: moment(data?.waktuInput, "HH:mm"),
      jumlahSoalAkm: data?.jumlahSoalAkm,
      token: data?.token,
      tampilNilai: data?.tampilNilai,
      tampilJawaban: data?.tampilJawaban,
    });
    setTipeUjian(data.ujian.tipe);
  };

  const handleClickMengerjakanUjian = async (
    detailJadwalUjian,
    isNomorKartuUjian = false,
    isToken = false,
    waktuFullScreen
  ) => {
    setButtonState("loading");

    if (isNomorKartuUjian && !isToken) {
      if (nomorKartuUjian != user?.noUjian) {
        toast.error("Nomor Ujian yang anda masukan salah!");
        setButtonState("error");

        return;
      }
    }
    if (isToken && sekolah?.id !== 15) {
      if (nomorKartuUjian != clickDetailJadwalUjian?.jadwalUjian?.token) {
        toast.error("Token Ujian yang anda masukan salah!");
        setButtonState("error");

        return;
      }
    }

    // useEffect(() => {
    //   const handleFullscreenChange = () => {
    //     if (!document.fullscreenElement) {
    //       // Menutup mode layar penuh saat tautan ditutup
    //       document.exitFullscreen();
    //     }
    //   };

    //   const handleKeyDown = (e) => {
    //     if (e.key === "Escape") {
    //       e.preventDefault();
    //     }
    //   };

    //   document.addEventListener("fullscreenchange", handleFullscreenChange);
    //   document.addEventListener("keydown", handleKeyDown);

    //   return () => {
    //     document.removeEventListener(
    //       "fullscreenchange",
    //       handleFullscreenChange
    //     );
    //     document.removeEventListener("keydown", handleKeyDown);
    //   };
    // }, []);

    const fullScreen = () => {
      const element = document.documentElement;
      // console.log(element);
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    };

    // useEffect(() => {
    //   setTimeout(() => window.location.reload(), 50000)
    // }, [])

    const { data, error } = await postPesertaUjian({
      waktu_mulai: moment().format("YYYY-MM-DD HH:mm:ss"),
      tk_jadwal_ujian_id: detailJadwalUjian?.id,
      ujian_id: detailJadwalUjian?.jadwalUjian?.mUjianId,
    });

    if (data) {
      setButtonState("success");
      hideModal("modalInstruksiUjian");
      localStorage.setItem("warning", 0);
      fullScreen();
      router.push(`${ssURL}/mengerjakan-ujian/${data.pesertaUjian?.id}`);
    } else {
      toast.error(error);
      setButtonState("error");
    }
  };

  const handleChangeForm = (e, type, stateName, parseInteger = false) => {
    if (type === "date" || type === "time") {
      setFormData({
        ...formData,
        [stateName]: type === "date" ? moment(e) : moment(e, "HH:mm"),
      });
      return;
    }

    if (e.target.type === "checkbox") {
      if (e.target.checked) {
        setFormData({
          ...formData,
          rombelId: [
            ...formData.rombelId,
            parseInteger ? parseInt(e.target.value) : e.target.value,
          ],
        });
      } else {
        setFormData({
          ...formData,
          rombelId: formData.rombelId.filter(
            (id) => id !== parseInt(e.target.value)
          ),
        });
      }
      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: parseInteger ? parseInt(e.target.value) : e.target.value,
    });
  };

  const getJadwalUjianData = async () => {
    setLoading(true);
    let data;
    if (subnav == "sudah-selesai") {
      data = await getJadwalUjian({
        status: !subnav ? "berlangsung" : subnav,
        hariIni: moment().format("YYYY-MM-DD HH:mm"),
        page: !router.query?.page ? 1 : router.query?.page,
        search: debounceSearch,
        guru_id: search?.guru_id,
        mapel_id: search?.mapel_id,
        tanggal:
          search?.tanggal != ""
            ? momentPackage(search?.tanggal).format("YYYY-MM-DD")
            : "",
      });
    } else {
      data = await getJadwalUjian({
        status: !subnav ? "berlangsung" : subnav,
        hariIni: moment().format("YYYY-MM-DD HH:mm"),
        search: debounceSearch,
        guru_id: search?.guru_id,
        mapel_id: search?.mapel_id,
        tanggal:
          search?.tanggal != ""
            ? momentPackage(search?.tanggal).format("YYYY-MM-DD")
            : "",
      });
    }
    if (data) {
      setJadwalUjianData(data.data);
    }
    setLoading(false);
  };

  const getUjianData = async () => {
    setLoading(true);
    const { data } = await getUjian({
      page: "all",
    });
    if (data) {
      setUjianData(data);
    }
    setLoading(false);
  };

  const handlePostUjianData = async () => {
    if (!formData.tanggal) {
      toast.error("Anda belum memasukkan tanggal ujian");
      return;
    } else if (
      formData?.jumlahPg +
        formData?.jumlahEsai +
        formData?.jumlahIsian +
        formData?.jumlahUraian +
        formData?.jumlahPgKompleks +
        formData?.jumlahMenjodohkan ==
      0
    ) {
      toast.error("Anda belum memasukkan jumlah soal ujian");
      return;
    } else if (!formData.waktu) {
      toast.error("Anda belum memasukkan waktu ujian dibuka");
      return;
    } else if (!formData.durasi) {
      toast.error("Anda belum memasukkan durasi ujian");
      return;
      // } else if (!formData.gmeet) {
      //   toast.error("Anda belum memasukkan link google meet");
      //   return;
    } else if (!formData.rombelId.length) {
      toast.error("Anda belum memasukkan memilih kelas untuk diujikan");
      return;
    }

    setButtonState("loading");
    const { tanggal, waktu, ...body } = formData;
    const payload = {
      ...body,
      waktuDibuka:
        moment(tanggal).format("YYYY-MM-DD") +
        " " +
        moment(waktu).format("HH:mm"),
    };

    let JumlahSoaldatas = 0;

    let text = 0;
    if (formData?.jumlahPg) {
      text = `Jumlah Soal Pg = ${formData?.jumlahPg};\n`;
    }
    if (formData?.jumlahEsai) {
      if (text) {
        text = `${text} Jumlah Soal Esai = ${formData?.jumlahEsai};\n`;
      } else {
        text = `Jumlah Soal Esai = ${formData?.jumlahEsai};\n`;
      }
    }
    if (formData?.jumlahIsian) {
      if (text) {
        text = `${text} Jumlah Soal Isian = ${formData?.jumlahIsian};\n`;
      } else {
        text = `Jumlah Soal Isian = ${formData?.jumlahIsian};\n`;
      }
    }
    if (formData?.jumlahUraian) {
      if (text) {
        text = `${text}, Jumlah Soal Uraian = ${formData?.jumlahUraian};\n`;
      } else {
        text = `Jumlah Soal Uraian = ${formData?.jumlahUraian};\n`;
      }
    }
    if (formData?.jumlahPgKompleks) {
      if (text) {
        text = `${text}, Jumlah Soal PgKompleks = ${formData?.jumlahPgKompleks};\n`;
      } else {
        text = `Jumlah Soal PgKompleks = ${formData?.jumlahPgKompleks};\n`;
      }
    }
    if (formData?.jumlahMenjodohkan) {
      if (text) {
        text = `${text}, Jumlah Soal Menjodohkan = ${formData?.jumlahMenjodohkan};\n`;
      } else {
        text = `Jumlah Soal Menjodohkan = ${formData?.jumlahMenjodohkan};\n`;
      }
    }

    swal({
      title: "Mohon untuk konfirmasi pembuatan Jadwal Ujian",
      text: `Bank Soal = ${formData?.namaUjian};\n ${text}Jumlah Soal = ${
        formData?.jumlahPg +
        formData?.jumlahEsai +
        formData?.jumlahIsian +
        formData?.jumlahUraian +
        formData?.jumlahPgKompleks +
        formData?.jumlahMenjodohkan
      };\n ${formData?.diacak ? "Soal Diacak" : "Soal Tidak Diacak"}; \n ${
        formData?.keluartab
          ? "Fitur Keluar Tab Aktif"
          : "Fitur Keluar Tab Tidak Aktif"
      }; \n ${
        sekolah?.id == 8123 ||
        sekolah?.id == 3364 ||
        sekolah?.id == 3367 ||
        sekolah?.id == 3388 ||
        sekolah?.id == 4995 ||
        sekolah?.id == 5025 ||
        sekolah?.id == 9348
          ? "\n"
          : ""
      }  ${
        (sekolah?.id == 8123 ||
          sekolah?.id == 3364 ||
          sekolah?.id == 3367 ||
          sekolah?.id == 3388 ||
          sekolah?.id == 4995 ||
          sekolah?.id == 5025 ||
          sekolah?.id == 9348) &&
        formData?.tampilNilai
          ? "Tampilkan Nilai"
          : "Tidak Tampilkan Nilai"
      };${
        sekolah?.id == 8123 ||
        sekolah?.id == 3364 ||
        sekolah?.id == 3367 ||
        sekolah?.id == 3388 ||
        sekolah?.id == 4995 ||
        sekolah?.id == 5025 ||
        sekolah?.id == 9348
          ? "\n"
          : ""
      } ${
        (sekolah?.id == 8123 ||
          sekolah?.id == 3364 ||
          sekolah?.id == 3367 ||
          sekolah?.id == 3388 ||
          sekolah?.id == 4995 ||
          sekolah?.id == 5025 ||
          sekolah?.id == 9348) &&
        formData?.tampilJawaban
          ? "Tampilkan Jawaban Benar"
          : "Tidak Tampilkan Jawaban Benar"
      }; \n KKM = ${formData?.kkm};\n Tanggal dan Waktu Dibuka = ${
        payload?.waktuDibuka
      };\n Durasi = ${formData?.durasi};\n ${
        formData?.gmeet ? `Link Pengawasan = ${formData?.gmeet};\n` : ``
      } Kelas yang dibagikan = ${formData?.rombelId?.map((d) => {
        return rombel?.find((s) => s?.id == d)?.nama;
      })}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = editId
          ? await editJadwalUjian(editId, payload)
          : await postJadwalUjian(payload);
        if (data) {
          toast.success(data?.message);
          getJadwalUjianData();
          hideModal("modalBuatJadwalUjian");
          setCurrent(0);
          setFormData(initialFormData);
        }
      }
    });

    setButtonState("idle");
  };

  const handleDeleteJadwalUjianData = async (id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await deleteJadwalUjian(id);
        if (data) {
          toast.success(data?.message);
          getJadwalUjianData();
        }
      }
    });
  };

  // useEffect(() => {
  //   document.getElementById("inputNumber").addEventListener("wheel", (e) => {
  //     e.preventDefault();
  //     return;
  //   });
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => window.location.reload(), 50000);
  // }, []);

  useEffect(() => {
    setActiveMenu(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    getJadwalUjianData();
  }, [
    subnav,
    debounceSearch,
    search?.guru_id,
    search?.mapel_id,
    search?.tanggal,
  ]);

  useEffect(() => {
    if (router.query?.page) {
      getJadwalUjianData();
    }
  }, [router.query]);

  useEffect(() => {
    getTeachersData();
    getUjianData();
  }, []);

  // useEffect(() => {
  //   getJadwalUjianData();
  //   // showModal("showHasilUjian");
  // }, []);

  const steps = [];

  if (user?.role == "guru") {
    steps.push(
      {
        target: '[data-joyride="side-nav-jadwal-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Menu Jadwal Ujian</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisi informasi mengenai semua jadwal ujian yang
              ada, mulai dari jadwal yang akan datang, berlangsung, dan juga
              jadwal yang sudah selesai. Pada menu ini juga anda dapat
              menambahkan jadwal ujian baru untuk ujian yang akan datang.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="side-nav-daftar-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Menu Daftar Ujian</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini berisikan daftar ujian yang sudah dibuat. Disini
              anda dapat membuat bank soal untuk ujian yang akan diujikan kepada
              siswa anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="jadwal-berlangsung"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Jadwal Sedang Berlangsung</h5>
            <p className="color-secondary fw-semibold">
              Berisi jadwal ujian yang sedang berlangsung.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="jadwal-akan-datang"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Jadwal Akan Datang</h5>
            <p className="color-secondary fw-semibold">
              Berisi jadwal ujian yang akan datang.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="jadwal-sudah-selesai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Jadwal Sudah Selesai</h5>
            <p className="color-secondary fw-semibold">
              Berisi jadwal ujian yang sudah selesai.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-buat-jadwal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Ingin Membuat Jadwal Ujian?</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol "Buat Jadwal" untuk membuat jadwal ujian.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="card-jadwal-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Jadwal Ujian</h5>
            <p className="color-secondary fw-semibold">
              Jadwal ujian yang sudah anda buat. Terdapat informasi mengenai
              ujian
            </p>
          </div>
        ),
      }
    );
  }
  let navItems = [];

  if (bagian == "pengawas") {
    navItems = [
      {
        url: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        as: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        text: "Berlangsung",
        active: subnav == "berlangsung" || subnav == undefined,
        dataJoyride: "jadwal-berlangsung",
      },
    ];
  } else {
    navItems = [
      {
        url: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        as: `${ssURL}/jadwal-ujian?subnav=berlangsung`,
        text: "Berlangsung",
        active: subnav == "berlangsung" || subnav == undefined,
        dataJoyride: "jadwal-berlangsung",
      },
      {
        url: `${ssURL}/jadwal-ujian?subnav=akan-datang`,
        as: `${ssURL}/jadwal-ujian?subnav=akan-datang`,
        text: "Akan Datang",
        active: subnav == "akan-datang",
        dataJoyride: "jadwal-akan-datang",
      },
      {
        url: `${ssURL}/jadwal-ujian?subnav=sudah-selesai&page=1`,
        as: `${ssURL}/jadwal-ujian?subnav=sudah-selesai&page=1`,
        text: "Sudah Selesai",
        active: subnav == "sudah-selesai",
        dataJoyride: "jadwal-sudah-selesai",
      },
    ];
  }

  const handleJoyrideCallback = (data) => {
    const { action } = data;
    if (action === "reset" || action === "close") {
      setJoyrideConfig({ ...joyrideConfig, [router.pathname]: true });
    }
  };

  const handleWheel = () => {
    return false;
  };

  const SubNavbarJadwalUjian = () => (
    <>
      <Navbar
        nav={navItems}
        action={[
          {
            button:
              (user?.role == "guru" || user?.role == "admin") &&
              bagian != "pengawas" ? (
                <>
                  <div
                    className={`btn py-2 px-4 btn-collapse-filter btn-light rounded-pill border bg-white color-dark fw-bold mb-sm-0 mb-3 me-sm-3 me-0 ${
                      collapseOpen && "active"
                    }`}
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    onClick={() => setcollapseOpen(!collapseOpen)}
                    style={{ zIndex: "1" }}
                  >
                    <FaFilter className="me-3 fs-14-ss" />
                    Filter
                  </div>

                  <div className="dropdown dropdown-ss d-flex flex-column">
                    <div
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold"
                      data-joyride="btn-buat-soal"
                    >
                      <div>
                        <FaPlus className="me-2" />
                        Buat Jadwal
                      </div>
                    </div>
                    <ul
                      className="dropdown-menu dropdown-menu-ss my-1"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li>
                        <a
                          className="dropdown-item pointer"
                          data-bs-toggle="modal"
                          data-bs-target="#modalBuatJadwalUjian"
                          onClick={() => setInitialFormData()}
                          data-joyride="btn-buat-jadwal"
                        >
                          Buat Jadwal Ujian
                        </a>
                      </li>
                      {/* <li>
      <a
        className="dropdown-item pointer"
        data-bs-toggle="modal"
        data-bs-target="#modalJadwalRemedial"
      >
        <span>Buat Jadwal Remedial</span>
      </a>
    </li> */}
                    </ul>
                  </div>
                </>
              ) : null,
          },
        ]}
      />
    </>
  );

  return (
    <Layout
      modalWrapper={
        <>
          <ModalStep
            modalClass="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            buttonSubmit={
              <ReactiveButton
                buttonState={buttonState}
                color={"primary"}
                idleText={editId ? "Edit Jadwal Ujian" : "Buat Jadwal Ujian"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
                onClick={handlePostUjianData}
              />
            }
            isNext={true}
            modalId="modalBuatJadwalUjian"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">
                  {editId ? "Edit" : "Buat"} Jadwal Ujian
                </h4>
                <span className="fs-6 fw-normal">
                  Isi informasi dibawah untuk membuat jadwal ujian
                </span>
              </>
            }
            current={current}
            next={next}
            prev={prev}
            removeFooter={
              sekolah?.trial &&
              moment(sekolah?.createdAt).format("YYYY-MM-DD") <
                moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
              total >= 3
            }
            steps={
              sekolah?.trial &&
              moment(sekolah?.createdAt).format("YYYY-MM-DD") <
                moment("2021-09-01 00:00:00").format("YYYY-MM-DD") &&
              total >= 3
                ? [
                    {
                      title: "Anda hanya memiliki limit 3 jadwal ujian",
                      content: (
                        <div className="row justify-content-center my-4">
                          <div className="col-sm-6 col-8">
                            <img
                              src="/img/smarteschool-illustration.png"
                              alt="empty-state"
                              className="img-fluid mb-2"
                            />
                          </div>
                          <div className="col-12 text-center">
                            <h5 className="color-dark fw-black">
                              {user?.role == "siswa"
                                ? "Anda hanya memiliki limit 3 jadwal ujian"
                                : "Anda hanya memiliki limit 3 jadwal ujian"}
                            </h5>
                            {user?.role != "siswa" && (
                              <>
                                <p className="fw-bold fs-14-ss">
                                  Silahkan{" "}
                                  <a
                                    className="text-decoration-none color-primary"
                                    onClick={() =>
                                      window.open(
                                        `https://wa.me/6287889192581?text=Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool`
                                      )
                                    }
                                  >
                                    {" "}
                                    Hubungi CS
                                  </a>{" "}
                                  Smarteschool
                                </p>
                                <WhatsappLink
                                  phoneNumber="087889192581"
                                  text="Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool"
                                >
                                  <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                                    Hubungi CS
                                  </button>
                                </WhatsappLink>
                              </>
                            )}
                          </div>
                        </div>
                      ),
                    },
                  ]
                : [
                    {
                      title: "Pilih Bank Soal",
                      content: (
                        <>
                          <div className="mt-4 mb-3">
                            <label className="form-label">Bank Soal</label>
                            <SelectShared
                              name="mUjianId"
                              placeholder="Pilih bank soal yang akan diujikan"
                              handleChangeSelect={(e, name) => {
                                setFormData({
                                  ...formData,
                                  [name]: e.value,
                                  namaUjian: e?.label,
                                });
                              }}
                              value={formData.mUjianId}
                              options={ujian?.map((data) => {
                                return { label: data?.nama, value: data?.id };
                              })}
                            />
                            {/* <select
                        className="form-select"
                        aria-label="Default select example"
                        placeholder="Pilih bank soal yang akan diujikan"
                        name="mUjianId"
                        onChange={(e) => {
                          setTipeUjian(
                            ujian?.filter(
                              (data) => data.id === parseInt(e.target.value)
                            )?.[0]?.tipe
                          );
                          handleChangeForm(e, null, null, true);
                        }}
                        value={formData?.mUjianId}
                      >
                        <option hidden>
                          Pilih bank soal yang akan diujikan{" "}
                        </option>
                        {ujian?.map((data) => (
                          <option value={data?.id}>{data?.nama}</option>
                        ))}
                      </select> */}
                          </div>
                          <div className="row mb-3">
                            {
                              // tipeUjian !== "literasi" &&
                              // tipeUjian !== "numerasi"
                              1 ? (
                                <>
                                  <div className="col-md-6 mb-md-0 mb-3">
                                    <label className="form-label">
                                      Jumlah Soal PG{" "}
                                    </label>
                                    <InputJumlahSoal
                                      handleChangeForm={handleChangeForm}
                                      value={formData?.jumlahPg}
                                      maks={maksPg}
                                      name={"jumlahPg"}
                                    />
                                  </div>
                                  <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                      Jumlah Soal Esai
                                    </label>
                                    <InputJumlahSoal
                                      handleChangeForm={handleChangeForm}
                                      value={formData?.jumlahEsai}
                                      maks={maksEsai}
                                      name={"jumlahEsai"}
                                    />
                                  </div>
                                  <div className="col-12">
                                    <label className="form-label">
                                      Jumlah Soal Isian
                                    </label>
                                    <InputJumlahSoal
                                      handleChangeForm={handleChangeForm}
                                      value={formData?.jumlahIsian}
                                      maks={maksIsian}
                                      name={"jumlahIsian"}
                                    />
                                  </div>
                                  {ujianTerpilih?.tipe == "literasi" ||
                                  ujianTerpilih?.tipe == "numerasi" ? (
                                    <>
                                      <div className="col-md-6">
                                        <label className="form-label">
                                          Jumlah Soal PG Kompleks
                                        </label>
                                        <InputJumlahSoal
                                          handleChangeForm={handleChangeForm}
                                          value={formData?.jumlahPgKompleks}
                                          maks={maksPgKompleks}
                                          name={"jumlahPgKompleks"}
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label className="form-label">
                                          Jumlah Soal Uraian
                                        </label>
                                        <InputJumlahSoal
                                          handleChangeForm={handleChangeForm}
                                          value={formData?.jumlahUraian}
                                          maks={maksUraian}
                                          name={"jumlahUraian"}
                                        />
                                      </div>
                                      <div className="col-md-6">
                                        <label className="form-label">
                                          Jumlah Soal Menjodohkan
                                        </label>
                                        <InputJumlahSoal
                                          handleChangeForm={handleChangeForm}
                                          value={formData?.jumlahMenjodohkan}
                                          maks={maksMenjodohkan}
                                          name={"jumlahMenjodohkan"}
                                        />
                                      </div>
                                    </>
                                  ) : null}
                                </>
                              ) : (
                                <div className="col-md-6 mb-md-0 mb-3">
                                  <label className="form-label">
                                    Jumlah Soal AKM
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="0 Soal"
                                    name="jumlahSoalAkm"
                                    value={formData?.jumlahSoalAkm}
                                    onChange={(e) =>
                                      handleChangeForm(e, null, null, true)
                                    }
                                  />
                                </div>
                              )
                            }
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Jumlah Semua </label>
                            <input
                              type="number"
                              className="form-control"
                              autoComplete="off"
                              placeholder="0 Soal"
                              readOnly
                              value={
                                formData?.jumlahPg +
                                formData?.jumlahEsai +
                                formData?.jumlahIsian +
                                formData?.jumlahUraian +
                                formData?.jumlahPgKompleks +
                                formData?.jumlahMenjodohkan
                              }
                            />
                          </div>
                          <div className="mb-3">
                            <h6 className="fs-18-ss fw-bold color-dark mb-3">
                              Acak Soal
                            </h6>
                            <div className="row">
                              <div className="form-check-ss col-md-6 position-relative">
                                <input
                                  className="form-check-input form-check-radio position-absolute"
                                  type="radio"
                                  id="radioYa"
                                  style={{
                                    top: "36%",
                                    left: "2em",
                                    // height: "20px",
                                  }}
                                  name="diacak"
                                  value={1}
                                  checked={formData?.diacak === 1}
                                  onChange={(e) =>
                                    handleChangeForm(e, null, null, true)
                                  }
                                />
                                <label
                                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                                  htmlFor="radioYa"
                                >
                                  <span className="ms-4 ps-2">Ya</span>
                                </label>
                              </div>
                              <div className="form-check-ss col-md-6 position-relative">
                                <input
                                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                                  type="radio"
                                  id="radioTidak"
                                  style={{
                                    top: "36%",
                                    left: "2em",
                                    // height: "20px",
                                  }}
                                  name="diacak"
                                  value={0}
                                  checked={formData?.diacak === 0}
                                  onChange={(e) =>
                                    handleChangeForm(e, null, null, true)
                                  }
                                />
                                <label
                                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                                  htmlFor="radioTidak"
                                >
                                  <span className="ms-4 ps-2">Tidak</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <h6 className="fs-18-ss fw-bold color-dark mb-3">
                              Fitur Keluar Tab
                            </h6>
                            <div className="row">
                              <div className="form-check-ss col-md-6 position-relative">
                                <input
                                  className="form-check-input form-check-radio position-absolute"
                                  type="radio"
                                  id="radioYa"
                                  style={{
                                    top: "36%",
                                    left: "2em",
                                    // height: "20px",
                                  }}
                                  name="keluartab"
                                  value={1}
                                  checked={formData?.keluartab === 1}
                                  onChange={(e) =>
                                    handleChangeForm(e, null, null, true)
                                  }
                                />
                                <label
                                  className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                                  htmlFor="radioYa"
                                >
                                  <span className="ms-4 ps-2">Aktif</span>
                                </label>
                              </div>
                              <div className="form-check-ss col-md-6 position-relative">
                                <input
                                  className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                                  type="radio"
                                  id="radioTidak"
                                  style={{
                                    top: "36%",
                                    left: "2em",
                                    // height: "20px",
                                  }}
                                  name="keluartab"
                                  value={0}
                                  checked={formData?.keluartab === 0}
                                  onChange={(e) =>
                                    handleChangeForm(e, null, null, true)
                                  }
                                />
                                <label
                                  className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                                  htmlFor="radioTidak"
                                >
                                  <span className="ms-4 ps-2">Tidak Aktif</span>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">{[9349, 9350].includes(sekolah?.id) ? "KKTP" : "KKM"} </label>
                            <input
                              type="number"
                              className="form-control"
                              autoComplete="off"
                              placeholder="0"
                              name="kkm"
                              value={formData?.kkm}
                              onChange={(e) =>
                                handleChangeForm(e, null, null, true)
                              }
                            />
                          </div>
                        </>
                      ),
                    },
                    {
                      title: "Atur Waktu Ujian",
                      content: (
                        <>
                          <div className="mt-4 mb-3">
                            <label
                              htmlFor="example-date-input"
                              className="form-label"
                            >
                              Tanggal
                            </label>
                            <DatePicker
                              className="form-control"
                              autoComplete="off"
                              onChange={(date, dateString) =>
                                handleChangeForm(dateString, "date", "tanggal")
                              }
                              placeholder="dd / mm / yyyy"
                              value={formData?.tanggal}
                            />
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-6 mb-md-0 mb-3">
                              <label className="form-label">
                                Waktu Dibuka{" "}
                              </label>
                              <TimePicker
                                className="form-control"
                                autoComplete="off"
                                format="HH:mm"
                                onChange={(date, dateString) =>
                                  handleChangeForm(dateString, "time", "waktu")
                                }
                                value={formData?.waktu}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Durasi</label>
                              <input
                                type="number"
                                className="form-control"
                                autoComplete="off"
                                placeholder="Masukkan waktu dalam menit"
                                name="durasi"
                                value={formData?.durasi}
                                onChange={(e) =>
                                  handleChangeForm(e, null, null, true)
                                }
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                              <label className="form-label mb-0">
                                Link Google Meet
                              </label>
                              <a
                                href="https://meet.google.com/"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="py-1 px-3 bg-soft-primary rounded-pill fs-12-ss color-primary text-decoration-none fw-semibold"
                              >
                                <FaLink className="me-2" />
                                Ambil Link Google Meet
                              </a>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              autoComplete="off"
                              id="exampleFormControlInput1"
                              placeholder="Tempel link Google Meet disini"
                              name="gmeet"
                              value={formData?.gmeet}
                              onChange={handleChangeForm}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap">
                              <label className="form-label mb-0">Token</label>
                            </div>
                            <input
                              type="text"
                              className="form-control"
                              autoComplete="off"
                              id="exampleFormControlInput1"
                              placeholder="Masukkan Token (jika siswa ingin masuk ujian harus menginput token)"
                              name="token"
                              value={formData?.token}
                              onChange={handleChangeForm}
                            />
                          </div>
                          {(sekolah?.id == 8123 ||
                            sekolah?.id == 3364 ||
                            sekolah?.id == 3367 ||
                            sekolah?.id == 3388 ||
                            sekolah?.id == 4995 ||
                            sekolah?.id == 5025 ||
                            sekolah?.id == 9348) && (
                            <>
                              <div className="mb-3">
                                <h6 className="fs-18-ss fw-bold color-dark mb-3">
                                  Tampilkan Jawaban Benar
                                </h6>
                                <div className="row">
                                  <div className="form-check-ss col-md-6 position-relative">
                                    <input
                                      className="form-check-input form-check-radio position-absolute"
                                      type="radio"
                                      id="radioYa"
                                      style={{
                                        top: "36%",
                                        left: "2em",
                                        // height: "20px",
                                      }}
                                      name="tampilJawaban"
                                      value={1}
                                      checked={formData?.tampilJawaban === 1}
                                      onChange={(e) =>
                                        handleChangeForm(e, null, null, true)
                                      }
                                    />
                                    <label
                                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                                      htmlFor="radioYa"
                                    >
                                      <span className="ms-4 ps-2">Ya</span>
                                    </label>
                                  </div>
                                  <div className="form-check-ss col-md-6 position-relative">
                                    <input
                                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                                      type="radio"
                                      id="radioTidak"
                                      style={{
                                        top: "36%",
                                        left: "2em",
                                        // height: "20px",
                                      }}
                                      name="tampilJawaban"
                                      value={0}
                                      checked={formData?.tampilJawaban === 0}
                                      onChange={(e) =>
                                        handleChangeForm(e, null, null, true)
                                      }
                                    />
                                    <label
                                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                                      htmlFor="radioTidak"
                                    >
                                      <span className="ms-4 ps-2">Tidak</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <h6 className="fs-18-ss fw-bold color-dark mb-3">
                                  Tampilkan Nilai
                                </h6>
                                <div className="row">
                                  <div className="form-check-ss col-md-6 position-relative">
                                    <input
                                      className="form-check-input form-check-radio position-absolute"
                                      type="radio"
                                      id="radioYa"
                                      style={{
                                        top: "36%",
                                        left: "2em",
                                        // height: "20px",
                                      }}
                                      name="tampilNilai"
                                      value={1}
                                      checked={formData?.tampilNilai === 1}
                                      onChange={(e) =>
                                        handleChangeForm(e, null, null, true)
                                      }
                                    />
                                    <label
                                      className="form-check-label rounded-ss w-100 border border-light-secondary-ss p-3"
                                      htmlFor="radioYa"
                                    >
                                      <span className="ms-4 ps-2">Ya</span>
                                    </label>
                                  </div>
                                  <div className="form-check-ss col-md-6 position-relative">
                                    <input
                                      className="form-check-input form-check-radio-salah form-check-input-salah position-absolute rounded-pill"
                                      type="radio"
                                      id="radioTidak"
                                      style={{
                                        top: "36%",
                                        left: "2em",
                                        // height: "20px",test
                                      }}
                                      name="tampilNilai"
                                      value={0}
                                      checked={formData?.tampilNilai === 0}
                                      onChange={(e) =>
                                        handleChangeForm(e, null, null, true)
                                      }
                                    />
                                    <label
                                      className="form-check-label-salah rounded-ss w-100 border border-light-secondary-ss p-3"
                                      htmlFor="radioTidak"
                                    >
                                      <span className="ms-4 ps-2">Tidak</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="mb-3">
                            <h6 className="fs-18-ss fw-bold color-dark mb-3">
                              Pilih Kelas
                            </h6>
                            <div className="row">
                              {rombel?.map((data) => (
                                <div className="col-lg-3 col-md-4 col-6">
                                  <div className="form-check mb-3">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={data?.id}
                                      id={data?.id}
                                      name="rombelId"
                                      defaultChecked={formData?.rombelId.includes(
                                        data?.id
                                      )}
                                      onChange={(e) =>
                                        handleChangeForm(e, null, null, true)
                                      }
                                    />
                                    <label
                                      className="form-check-label fs-14-ss fw-semibold"
                                      htmlFor={data?.id}
                                    >
                                      {data?.nama}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ),
                    },
                  ]
            }
          />
          <NewModal
            removeFooter={
              ((sekolah?.id == 15 || sekolah?.id == 33) &&
                (clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pts1" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pts2" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pas1" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe ==
                    "pas2")) ||
              clickDetailJadwalUjian?.jadwalUjian?.token
                ? true
                : false
            }
            modalId="modalInstruksiUjian"
            title={
              <>
                <h4 className="mb-0 fw-extrabold">
                  {clickDetailJadwalUjian?.jadwalUjian?.ujian?.nama} Kelas{" "}
                  {clickDetailJadwalUjian?.jadwalUjian?.ujian?.tingkat}
                </h4>
              </>
            }
            content={
              <>
                {(sekolah?.id == 15 || sekolah?.id == 33) &&
                (clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pts1" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pts2" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe == "pas1" ||
                  clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe ==
                    "pas2") ? (
                  <>
                    <div className="mb-4">
                      <label className="form-label">Nomor Ujian Anda</label>
                      <input
                        className="form-control"
                        autoComplete="off"
                        placeholder="Tuliskan judul anda"
                        type="text"
                        name="judul"
                        value={nomorKartuUjian}
                        onChange={(e) => setNomorKartuUjian(e.target.value)}
                      />
                    </div>

                    <ReactiveButton
                      buttonState={buttonState}
                      color={"primary"}
                      idleText={"Mulai Ujian"}
                      loadingText={"Diproses"}
                      successText={"Berhasil"}
                      errorText={"Gagal"}
                      type={"button"}
                      className="text-decoration-none btn btn-primary"
                      onClick={() =>
                        handleClickMengerjakanUjian(
                          clickDetailJadwalUjian,
                          true
                        )
                      }
                    />
                  </>
                ) : clickDetailJadwalUjian?.jadwalUjian?.token ? (
                  <>
                    <div className="mb-4">
                      <label className="form-label">Token Ujian</label>
                      <input
                        className="form-control"
                        autoComplete="off"
                        placeholder="Masukkan Token Ujian"
                        type="text"
                        name="judul"
                        value={nomorKartuUjian}
                        onChange={(e) => setNomorKartuUjian(e.target.value)}
                      />
                    </div>

                    <ReactiveButton
                      buttonState={buttonState}
                      color={"primary"}
                      idleText={"Mulai Ujian"}
                      loadingText={"Diproses"}
                      successText={"Berhasil"}
                      errorText={"Gagal"}
                      type={"button"}
                      className="text-decoration-none btn btn-primary"
                      onClick={() =>
                        handleClickMengerjakanUjian(
                          clickDetailJadwalUjian,
                          true,
                          true
                        )
                      }
                    />
                  </>
                ) : (
                  <>
                    <h6 className="fs-18-ss fw-bold color-dark">
                      Instruksi Ujian
                    </h6>
                    <ol className="mb-4">
                      <li>
                        Jika memiliki 2 device silahkan scan barcode dibawah
                        ini. Jika tidak, silahkan klik tombol "Masuk Google
                        Meet".
                      </li>
                      <li>Letakan kamera didepan layar ujian.</li>
                      <li>
                        Saat bergabung di Google Meet nyalakan microphone.
                      </li>
                      <li>
                        Jika handphone tidak memiliki aplikasi scanner silahkan
                        download scanner.
                      </li>
                    </ol>
                  </>
                )}
              </>
            }
            submitButton={
              sekolah?.id != 15 ||
              clickDetailJadwalUjian?.jadwalUjian?.ujian?.tipe ? (
                <ReactiveButton
                  buttonState={buttonState}
                  color={"primary"}
                  idleText={"Mulai Ujian"}
                  loadingText={"Diproses"}
                  successText={"Berhasil"}
                  errorText={"Gagal"}
                  type={"button"}
                  className="text-decoration-none btn btn-primary"
                  onClick={() =>
                    handleClickMengerjakanUjian(clickDetailJadwalUjian)
                  }
                />
              ) : null
            }
          />
        </>
      }
    >
      {/* {sekolah?.trial &&
      moment(sekolah?.createdAt).format("YYYY-MM-DD") <
        moment("2021-09-01 00:00:00").format("YYYY-MM-DD")} */}
      {0 ? (
        <>
          <AnimatePage>
            <div className="row justify-content-center my-4">
              <div className="col-sm-6 col-8">
                <img
                  src="/img/smarteschool-illustration.png"
                  alt="empty-state"
                  className="img-fluid mb-2"
                />
              </div>
              <div className="col-12 text-center">
                <h5 className="color-dark fw-black">
                  {user?.role == "siswa"
                    ? "Silahkan upgrade sekolah anda ke Smarteschool Pro"
                    : "Upgrade sekolah ke Versi Pro Sekarang"}
                </h5>
                {user?.role != "siswa" && (
                  <>
                    <p className="fw-bold fs-14-ss">
                      Silahkan{" "}
                      <a
                        className="text-decoration-none color-primary"
                        onClick={() =>
                          window.open(
                            `https://wa.me/6287889192581?text=Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool`
                          )
                        }
                      >
                        {" "}
                        Hubungi CS
                      </a>{" "}
                      Smarteschool
                    </p>
                    <WhatsappLink
                      phoneNumber="087889192581"
                      text="Halo CS Smarteschool, saya ingin Upgrade ke versi pro smarteschool"
                    >
                      <button className="btn btn-ss btn-primary bg-gradient-primary rounded-pill shadow-primary-ss fw-bold">
                        Hubungi CS
                      </button>
                    </WhatsappLink>
                  </>
                )}
              </div>
            </div>
          </AnimatePage>
        </>
      ) : (
        <>
          <AnimatePage>
            <div className="row gy-4">
              {(user?.role == "guru" || user?.role == "admin") &&
                bagian != "pengawas" && (
                  <div className="col-lg-3 positon-relative">
                    <SideBarUjian activeMenu={activeMenu} />
                  </div>
                )}
              <div
                className={`${
                  (user?.role == "guru" || user?.role == "admin") &&
                  bagian != "pengawas"
                    ? "col-lg-9"
                    : "col-12"
                }`}
              >
                <SubNavbarJadwalUjian />
                {/* <input
                  type="text"
                  className="form-control form-search-pembayaran my-4"
                  placeholder="Cari Jadwal Ujian..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    // router.push(
                    //   `jadwal-ujian?subnav=${subnav}&page=1&search=${e.target.value}`
                    // );
                  }}
                  // data-joyride="cari Jadwal Ujian"
                /> */}
                <div className="collapse" id="collapseExample">
                  <div className="row mb-3">
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Nama Ujian</label>
                      <input
                        type="text"
                        className="form-control form-search-filter-perpus"
                        id="exampleFormControlInput1"
                        placeholder="Cari jadwal ujian"
                        autoComplete="off"
                        value={search?.nama}
                        onChange={(e) => {
                          setSearch({ ...search, nama: e.target.value }),
                            setPage(1);
                          // router.push(
                          //   `jadwal-ujian?subnav=${subnav}&page=1&search=${e.target.value}`
                          // );
                        }}
                        // data-joyride="cari Jadwal Ujian"
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Tanggal</label>
                      <DatePicker
                        className="form-control"
                        autoComplete="off"
                        value={search?.tanggal}
                        placeholder="Pilih tanggal"
                        onChange={(date) => {
                          setSearch({ ...search, tanggal: date || "" });
                          router.push(
                            `jadwal-ujian?subnav=${subnav}&page=1&tanggal=${date}`
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Guru Pengampu</label>
                      <Select
                        placeholder="Pilih guru pengampu"
                        onChange={(opt) => {
                          setSearch({ ...search, guru_id: opt?.value || "" });
                          router.push(
                            `jadwal-ujian?subnav=${subnav}&page=1&guru_id=${opt?.value}`
                          );
                        }}
                        isClearable
                        options={listGuru}
                      />
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <label className="form-label ">Mata Pelajaran</label>
                      <Select
                        placeholder="Pilih Mapel Ujian"
                        onChange={(opt) => {
                          setSearch({ ...search, mapel_id: opt?.value || "" });
                          router.push(
                            `jadwal-ujian?subnav=${subnav}&page=1&mapel_id=${opt?.value}`
                          );
                        }}
                        isClearable
                        options={mataPelajaran?.map((mapel) => {
                          return {
                            value: mapel?.user?.id,
                            label: `${mapel?.nama} - ${mapel?.user?.nama}`,
                          };
                        })}
                      />
                    </div>
                  </div>
                </div>
                {subnav == "sudah-selesai" && (
                  <div className="d-flex justify-content-center align-items-center">
                    {/* <Pagination
                total={jadwalUjianData?.total}
                showSizeChanger={false}
                current={parseInt(router.query?.page) || 1}
                pageSize={10}
                onChange={(e) =>
                  router.push(
                    `${ssURL}/jadwal-ujian?subnav=sudah-selesai&page=${e}`
                  )
                }
              /> */}
                  </div>
                )}
                {/* <hr /> */}
                {/* Card Jadwal Ujian Start */}

                <Joyride
                  run={!joyrideConfig?.[router.pathname]}
                  steps={steps}
                  continuous={true}
                  showProgress={false}
                  showSkipButton={true}
                  disableScrolling={true}
                  callback={handleJoyrideCallback}
                  styles={{
                    options: {
                      primaryColor: "#2680eb",
                      outline: "none",
                      border: "none",
                    },
                  }}
                />

                {loading && <UjianSkeleton />}

                {!loading && !jadwalUjian?.length && user?.role === "guru" && (
                  <>
                    <div className="row justify-content-center">
                      <div className="col-sm-7 col-10">
                        <img
                          src="/img/empty-state-jadwal.png"
                          alt=""
                          className="img-fluid mb-md-0 mb-2"
                        />
                      </div>
                      <div className="col-12 text-center">
                        <h4 className="color-dark fw-black mb-2">
                          {(subnav == "berlangsung" || !subnav) &&
                            "Belum Ada Ujian Yang Berlangsung"}
                          {subnav == "akan-datang" && "Jadwal Ujian Kosong"}
                          {subnav == "sudah-selesai" &&
                            "Belum Ada Ujian Yang Selesai"}
                        </h4>
                        <p className="fw-bold">
                          {(subnav == "berlangsung" || !subnav) && (
                            <>
                              Lihat pada tab{" "}
                              <Link
                                href={`${ssURL}/jadwal-ujian?subnav=akan-datang`}
                              >
                                <a className="color-primary text-decoration-none">
                                  Akan Datang
                                </a>
                              </Link>{" "}
                              untuk mengecek jadwal ujian
                            </>
                          )}
                          {subnav == "akan-datang" && (
                            <>
                              Tekan tombol {""}
                              <a
                                className="color-primary text-decoration-none"
                                data-bs-toggle="modal"
                                data-bs-target="#modalBuatJadwalUjian"
                                onClick={() => setInitialFormData()}
                              >
                                Buat Jadwal
                              </a>{" "}
                              {""}
                              untuk membuat jadwal ujian
                            </>
                          )}
                          {subnav == "sudah-selesai" && (
                            <>
                              Lihat pada tab{" "}
                              <Link
                                href={`${ssURL}/jadwal-ujian?subnav=berlangsung`}
                              >
                                <a className="color-primary text-decoration-none">
                                  Akan Datang
                                </a>
                              </Link>{" "}
                              untuk memonitor kegiatan ujian
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {!jadwalUjian?.length && user?.role == "siswa" ? (
                  <div className="row justify-content-center">
                    <div className="col-sm-6 col-10">
                      <img
                        src="/img/empty-state-jadwal.png"
                        alt=""
                        className="img-fluid mb-md-0 mb-2"
                      />
                    </div>
                    <div className="col-12 text-center">
                      <h4 className="color-dark fw-black mb-2">
                        {(subnav == "berlangsung" || !subnav) &&
                          "Belum Ada Ujian Yang Berlangsung"}
                        {subnav == "akan-datang" && "Jadwal Ujian Kosong"}
                        {subnav == "sudah-selesai" &&
                          "Belum Ada Ujian Yang Selesai"}
                      </h4>
                      <p className="fw-bold">
                        {(subnav == "berlangsung" || !subnav) && (
                          <>
                            Lihat pada tab{" "}
                            <Link
                              href={`${ssURL}/jadwal-ujian?subnav=akan-datang`}
                            >
                              <a className="color-primary text-decoration-none">
                                Akan Datang
                              </a>
                            </Link>{" "}
                            untuk mengecek jadwal ujian
                          </>
                        )}
                        {subnav == "akan-datang" && (
                          <>
                            Sepertinya guru memberikan ujian untuk kamu saat ini
                          </>
                        )}
                        {subnav == "sudah-selesai" && (
                          <>
                            Lihat pada tab{" "}
                            <Link
                              href={`${ssURL}/jadwal-ujian?subnav=berlangsung`}
                            >
                              <a className="color-primary text-decoration-none">
                                Berlangsung
                              </a>
                            </Link>{" "}
                            untuk melihat ujian yang sedang berlangsung
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
                {!loading &&
                  jadwalUjian?.map((dataJadwalUjian, idx) => {
                    if (
                      !dataJadwalUjian?.jadwalUjian &&
                      user?.role == "siswa"
                    ) {
                      return;
                    }

                    if (subnav == "akan-datang") {
                      return (
                        <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer mb-4">
                          {/* Card Label & Option Start */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            {/* Jadwal Ujian Label Start */}

                            <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                              {dataJadwalUjian?.ujian?.tipeFormat ||
                                dataJadwalUjian?.jadwalUjian?.ujian?.tipeFormat}
                            </div>

                            {/* Jadwal Ujian Label End */}

                            {/* Dropdown Option Start */}
                            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                              {(user?.role === "guru" ||
                                user?.role == "admin") && (
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
                              )}
                              <ul
                                className="dropdown-menu dropdown-menu-ss my-1"
                                aria-labelledby="dropdownOption"
                              >
                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalBuatJadwalUjian"
                                  onClick={() =>
                                    onClickEdit(
                                      dataJadwalUjian?.jadwalUjian,
                                      dataJadwalUjian?.rombel
                                    )
                                  }
                                >
                                  <a className="dropdown-item">
                                    <FaPen className="me-2" />
                                    <span>Edit</span>
                                  </a>
                                </li>
                                <li
                                  onClick={() =>
                                    handleDeleteJadwalUjianData(
                                      dataJadwalUjian?.jadwalUjian?.id
                                    )
                                  }
                                >
                                  <a className="dropdown-item color-danger">
                                    <FaTrashAlt className="me-2" />
                                    <span>Hapus</span>
                                  </a>
                                </li>
                              </ul>
                            </div>

                            {/* Dropdown Option End */}
                          </div>
                          {/* Card Label & Option End */}
                          {/* Jadwal Ujian Title Start */}
                          {(user?.role == "guru" || user?.role == "admin") && (
                            <Link
                              href={`${ssURL}/jadwal-ujian/[id]`}
                              as={`${ssURL}/jadwal-ujian/${dataJadwalUjian?.jadwalUjian?.id}`}
                            >
                              <div className="w-75 text-break">
                                <h4 className="color-dark fw-black mb-2">
                                  {dataJadwalUjian?.ujian?.nama ||
                                    dataJadwalUjian?.jadwalUjian?.ujian
                                      ?.nama}{" "}
                                  Kelas{" "}
                                  {dataJadwalUjian?.ujian?.tingkat ||
                                    dataJadwalUjian?.jadwalUjian?.ujian
                                      ?.tingkat}
                                </h4>
                              </div>
                            </Link>
                          )}
                          {user?.role == "siswa" && (
                            <div className="w-75 text-break">
                              <h4 className="color-dark fw-black mb-2">
                                {dataJadwalUjian?.ujian?.nama ||
                                  dataJadwalUjian?.jadwalUjian?.ujian
                                    ?.nama}{" "}
                                Kelas{" "}
                                {dataJadwalUjian?.ujian?.tingkat ||
                                  dataJadwalUjian?.jadwalUjian?.ujian?.tingkat}
                              </h4>
                            </div>
                          )}
                          {/* Jadwal Ujian Title End */}
                          {/* Kelas Jadwal Ujian Start */}
                          {(user?.role === "guru" || user?.role == "admin") && (
                            <>
                              <p className="color-secondary fw-bold mb-2">
                                Kelas
                              </p>
                              <div className="w-75 d-flex flex-wrap mb-3">
                                {dataJadwalUjian?.rombel?.map(
                                  (dataRombelUjian) => (
                                    <div className="me-2 mb-2">
                                      <div
                                        className="btn btn-outline-secondary-ss rounded-pill fs-12-ss d-flex justify-content-center align-items-center p-0 px-2"
                                        style={{
                                          minWidth: "75px",
                                          height: "20px",
                                        }}
                                      >
                                        {dataRombelUjian?.rombel?.nama}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {/* Kelas Jadwal Ujian End */}
                          {/* Date & Time Jadwal Ujian Start */}
                          <div className="d-flex align-items-center justify-content-between flex-wrap color-primary mt-4">
                            <div className="d-flex flex-wrap">
                              <div className="d-flex align-items-center me-4 mb-2">
                                <FaCalendarDay className="me-2" />
                                <span className="fs-14-ss fw-semibold">
                                  {dataJadwalUjian?.tanggalUjian ||
                                    dataJadwalUjian?.jadwalUjian?.tanggalUjian}
                                </span>
                              </div>
                              <div className="d-flex align-items-center me-4 mb-2">
                                <FaClock className="me-2" />
                                <span className="fs-14-ss fw-semibold">
                                  {dataJadwalUjian?.waktuUjian ||
                                    dataJadwalUjian?.jadwalUjian?.waktuUjian}
                                </span>
                              </div>
                              <div className="label-ss bg-light-primary fw-bolder  rounded-pill mb-2 d-flex">
                                {/* <Countdown
                                  value={momentPackage(
                                    dataJadwalUjian?.waktuDitutup ||
                                      dataJadwalUjian?.jadwalUjian?.waktuDitutup
                                  ).fromNow()}
                                  // format="HH:mm:ss"
                                /> */}
                                {""}{" "}
                                <span className="fs-14-ss ms-1 mb-0 text-capitalize">
                                  {momentPackage(
                                    dataJadwalUjian?.waktuDibuka ||
                                      dataJadwalUjian?.jadwalUjian?.waktuDibuka
                                  ).fromNow()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Date & Time Jadwal Ujian End */}
                        </div>
                      );
                    }

                    if (subnav == "berlangsung" || subnav == undefined)
                      return (
                        <div
                          className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer mb-4"
                          data-joyride={`${
                            idx === 0 ? "card-jadwal-ujian" : ""
                          }`}
                        >
                          {/* Card Label & Option Start */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            {/* Jadwal Ujian Label Start */}

                            <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                              {dataJadwalUjian?.ujian?.tipeFormat ||
                                dataJadwalUjian?.jadwalUjian?.ujian?.tipeFormat}
                            </div>

                            {/* Jadwal Ujian Label End */}

                            {/* Dropdown Option Start */}
                            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                              {(user?.role === "guru" ||
                                user?.role == "admin") && (
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
                              )}
                              <ul
                                className="dropdown-menu dropdown-menu-ss my-1"
                                aria-labelledby="dropdownOption"
                              >
                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalBuatJadwalUjian"
                                  onClick={() =>
                                    onClickEdit(
                                      dataJadwalUjian?.jadwalUjian,
                                      dataJadwalUjian?.rombel
                                    )
                                  }
                                >
                                  <a className="dropdown-item">
                                    <FaPen className="me-2" />
                                    <span>Edit</span>
                                  </a>
                                </li>
                                <li
                                  onClick={() =>
                                    handleDeleteJadwalUjianData(
                                      dataJadwalUjian?.jadwalUjian?.id
                                    )
                                  }
                                >
                                  <a className="dropdown-item color-danger">
                                    <FaTrashAlt className="me-2" />
                                    <span>Hapus</span>
                                  </a>
                                </li>
                              </ul>
                            </div>

                            {/* Dropdown Option End */}
                          </div>
                          {/* Card Label & Option End */}
                          {/* Jadwal Ujian Title Start */}
                          {(user?.role == "guru" || user?.role == "admin") && (
                            <Link
                              href={`${ssURL}/jadwal-ujian/[id]`}
                              as={`${ssURL}/jadwal-ujian/${dataJadwalUjian?.jadwalUjian?.id}`}
                            >
                              <div className="w-75 text-break">
                                <h4 className="color-dark fw-black mb-2">
                                  {dataJadwalUjian?.ujian?.nama ||
                                    dataJadwalUjian?.jadwalUjian?.ujian
                                      ?.nama}{" "}
                                  Kelas{" "}
                                  {dataJadwalUjian?.ujian?.tingkat ||
                                    dataJadwalUjian?.jadwalUjian?.ujian
                                      ?.tingkat}
                                </h4>
                              </div>
                            </Link>
                          )}
                          {user?.role == "siswa" && (
                            <div className="w-75 text-break">
                              <h4 className="color-dark fw-black mb-2">
                                {dataJadwalUjian?.ujian?.nama ||
                                  dataJadwalUjian?.jadwalUjian?.ujian
                                    ?.nama}{" "}
                                Kelas{" "}
                                {dataJadwalUjian?.ujian?.tingkat ||
                                  dataJadwalUjian?.jadwalUjian?.ujian?.tingkat}
                              </h4>
                            </div>
                          )}
                          {/* Jadwal Ujian Title End */}
                          {/* Kelas Jadwal Ujian Start */}
                          {(user?.role === "guru" || user?.role == "admin") && (
                            <>
                              <p className="color-secondary fw-bold mb-2">
                                Kelas
                              </p>
                              <div className="w-75 d-flex flex-wrap mb-3">
                                {dataJadwalUjian?.rombel?.map(
                                  (dataRombelUjian) => (
                                    <div className="me-2 mb-2">
                                      <div
                                        className="btn btn-outline-secondary-ss rounded-pill fs-12-ss d-flex justify-content-center align-items-center p-0 px-2"
                                        style={{
                                          minWidth: "75px",
                                          height: "20px",
                                        }}
                                      >
                                        {dataRombelUjian?.rombel?.nama}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {/* Kelas Jadwal Ujian End */}
                          {/* Date & Time Jadwal Ujian Start */}
                          <div className="d-flex align-items-center justify-content-between flex-wrap color-primary mt-4">
                            <div className="d-flex flex-wrap">
                              <div className="d-flex align-items-center me-4 mb-2">
                                <FaCalendarDay className="me-2" />
                                <span className="fs-14-ss fw-semibold">
                                  {dataJadwalUjian?.tanggalUjian ||
                                    dataJadwalUjian?.jadwalUjian?.tanggalUjian}
                                </span>
                              </div>
                              <div className="d-flex align-items-center me-4 mb-2">
                                <FaClock className="me-2" />
                                <span className="fs-14-ss fw-semibold">
                                  {dataJadwalUjian?.waktuUjian ||
                                    dataJadwalUjian?.jadwalUjian?.waktuUjian}
                                </span>
                              </div>
                              <div className="label-ss bg-light-primary fw-bolder  rounded-pill mb-2 d-flex">
                                <Countdown
                                  value={moment(
                                    dataJadwalUjian?.waktuDitutup ||
                                      dataJadwalUjian?.jadwalUjian?.waktuDitutup
                                  )}
                                  format="HH:mm:ss"
                                />
                                {""}{" "}
                                <span className="fs-14-ss ms-1 mb-0">
                                  Tersisa
                                </span>
                              </div>
                            </div>
                            {/* {user?.role === "siswa" &&
                            dataJadwalUjian?.peserta?.[0]?.mUserId == user?.id &&
                            dataJadwalUjian?.peserta?.[0]?.selesai ? (
                            <button
                            className="btn btn-ss bg-soft-success color-success rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                            disabled
                            >
                            Sudah dikerjakan
                              </button>
                            ) : ( */}
                            {/* user?.role === "siswa" && ( */}
                            {user?.role == "siswa" && (
                              <>
                                {!dataJadwalUjian?.peserta?.find(
                                  (item) => item.mUserId == user?.id
                                )?.waktuSelesai ? (
                                  <>
                                    {pembayaran &&
                                    pembayaran?.filter(
                                      (item) =>
                                        item?.rombelPembayaran?.pembayaran
                                          ?.tipeUjian ==
                                        dataJadwalUjian?.jadwalUjian?.ujian
                                          ?.tipe
                                    )?.length > 0 ? (
                                      <button
                                        className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                        onClick={() =>
                                          router.push(`${ssURL}/tagihan`)
                                        }
                                      >
                                        Hubungi TU/ Panitia
                                      </button>
                                    ) : dataJadwalUjian?.peserta?.[0]?.block ==
                                      1 ? (
                                      <button
                                        className="btn btn-ss bg-soft-danger color-danger rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                        disabled
                                      >
                                        Ujian anda diblokir
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                          data-bs-toggle="modal"
                                          data-bs-target="#modalInstruksiUjian"
                                          onClick={() =>
                                            setClickDetailJadwalUjian(
                                              dataJadwalUjian
                                            )
                                          }
                                        >
                                          Kerjakan Ujian
                                        </button>
                                      </>
                                    )}
                                  </>
                                ) : // sekolah?.id == 9059 ? (
                                //   <button
                                //     className="btn btn-ss bg-primary text-white rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                //     // disabled
                                //     onClick={() => showModal("showHasilUjian")}
                                //   >
                                //     Lihat hasil ujian
                                //   </button>
                                // ) : (
                                //   <button
                                //     className="btn btn-ss bg-soft-success color-success rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                //     disabled
                                //   >
                                //     Sudah dikerjakan
                                //   </button>
                                // )}
                                sekolah?.id == 8123 ||
                                  sekolah?.id == 3364 ||
                                  sekolah?.id == 3367 ||
                                  sekolah?.id == 3388 ||
                                  sekolah?.id == 4995 ||
                                  sekolah?.id == 5025 ||
                                  sekolah?.id == 9348 ? (
                                  (dataJadwalUjian?.jadwalUjian
                                    ?.tampilJawaban == 1 ||
                                    dataJadwalUjian?.jadwalUjian?.tampilNilai ==
                                      1) && (
                                    <>
                                      <Link
                                        href={`${ssURL}/hasil-ujian/${dataJadwalUjian?.peserta?.[0]?.id}`}
                                      >
                                        <button className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2">
                                          Lihat hasil ujian
                                        </button>
                                      </Link>
                                    </>
                                  )
                                ) : (
                                  <button
                                    className="btn btn-ss bg-soft-success color-success rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                    disabled
                                  >
                                    Sudah dikerjakan
                                  </button>
                                )}
                              </>
                            )}
                            {/* ) */}
                            {/* )} */}
                          </div>
                          {/* Date & Time Jadwal Ujian End */}
                        </div>
                      );

                    if (subnav == "sudah-selesai") {
                      const hrefSiswa = `${ssURL}/jadwal-ujian?subnav=sudah-selesai`;
                      const pesertaId =
                        dataJadwalUjian?.peserta?.[0]?.id || null;

                      const renderMetaHasilUjian = (meta) => {
                        const { remedial, susulan } = meta;
                        let label = [];

                        if (remedial === 0 && susulan === 0) {
                          return [
                            {
                              text: "Tuntas Semua",
                              className: "bg-soft-success color-success",
                            },
                          ];
                        }

                        if (remedial) {
                          label.push({
                            text: `${remedial} Remedial`,
                            className: "bg-soft-danger color-danger",
                          });
                        }

                        if (susulan) {
                          label.push({
                            text: `${susulan} Susulan`,
                            className: "bg-light-primary color-primary",
                          });
                        }

                        return label;
                      };

                      return (
                        <>
                          <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer mb-4">
                            <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                              <div className="d-flex align-items-center justify-content-between flex-wrap order-2 order-md-1 w-100">
                                {/* Jadwal Ujian Label Start */}

                                <div className="d-flex">
                                  <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss mb-3 me-2">
                                    {dataJadwalUjian?.ujian?.tipeFormat ||
                                      dataJadwalUjian?.jadwalUjian?.ujian
                                        ?.tipeFormat}
                                  </div>

                                  {/* Jadwal Ujian Label End */}

                                  {/* Label Hasil Ujian Start */}
                                  {(user?.role == "guru" ||
                                    user?.role == "admin") && (
                                    <div className="d-flex align-items-center">
                                      {renderMetaHasilUjian(
                                        dataJadwalUjian?.metaJadwalUjian
                                      )?.map((meta) => (
                                        <div
                                          className={`label-ss fs-12-ss fw-bold rounded-pill mb-3 me-2 ${
                                            meta?.className || ""
                                          }`}
                                        >
                                          {meta?.text}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Dropdown Option Start */}
                                <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                                  {(user?.role === "guru" ||
                                    user?.role == "admin") && (
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
                                  )}
                                  <ul
                                    className="dropdown-menu dropdown-menu-ss my-1"
                                    aria-labelledby="dropdownOption"
                                  >
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#modalBuatJadwalUjian"
                                      onClick={() =>
                                        onClickEdit(
                                          dataJadwalUjian?.jadwalUjian,
                                          dataJadwalUjian?.rombel
                                        )
                                      }
                                    >
                                      <a className="dropdown-item">
                                        <FaPen className="me-2" />
                                        <span>Edit</span>
                                      </a>
                                    </li>
                                    <li
                                      onClick={() =>
                                        handleDeleteJadwalUjianData(
                                          dataJadwalUjian?.jadwalUjian?.id
                                        )
                                      }
                                    >
                                      <a className="dropdown-item color-danger">
                                        <FaTrashAlt className="me-2" />
                                        <span>Hapus</span>
                                      </a>
                                    </li>
                                  </ul>
                                </div>

                                {/* Dropdown Option End */}
                                {/* Label Hasil Ujian End */}
                              </div>
                            </div>
                            <Link
                              href={
                                user?.role === "siswa"
                                  ? hrefSiswa
                                  : `${ssURL}/jadwal-ujian/[id]`
                              }
                              as={
                                user?.role === "siswa"
                                  ? hrefSiswa
                                  : `${ssURL}/jadwal-ujian/${dataJadwalUjian?.jadwalUjian?.id}`
                              }
                            >
                              <a className="text-decoration-none">
                                <div className="w-100">
                                  <div className="w-75 text-break">
                                    <h4 className="color-dark fw-black mb-2">
                                      {dataJadwalUjian?.ujian?.nama ||
                                        dataJadwalUjian?.jadwalUjian?.ujian
                                          ?.nama}
                                    </h4>
                                  </div>
                                  {(user?.role === "guru" ||
                                    user?.role == "admin") && (
                                    <>
                                      <p className="color-secondary fw-bold mb-2">
                                        Kelas
                                      </p>
                                      <div className="w-75 d-flex flex-wrap mb-3">
                                        {dataJadwalUjian?.rombel?.map(
                                          (dataRombelUjian) => (
                                            <div className="me-2 mb-2">
                                              <div
                                                className="btn btn-outline-secondary-ss rounded-pill fs-12-ss d-flex justify-content-center align-items-center p-0 px-2"
                                                style={{
                                                  minWidth: "75px",
                                                  height: "20px",
                                                }}
                                              >
                                                {dataRombelUjian?.rombel?.nama}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                  <div className="d-flex align-items-center justify-content-between flex-wrap color-primary mt-4">
                                    <div className="d-flex flex-wrap">
                                      <div className="d-flex align-items-center me-4 mb-2">
                                        <FaCalendarDay className="me-2" />
                                        <span className="fs-14-ss fw-semibold">
                                          {dataJadwalUjian?.tanggalUjian ||
                                            dataJadwalUjian?.jadwalUjian
                                              ?.tanggalUjian}
                                        </span>
                                      </div>
                                      <div className="d-flex align-items-center me-4 mb-2">
                                        <FaClock className="me-2" />
                                        <span className="fs-14-ss fw-semibold">
                                          {dataJadwalUjian?.waktuUjian ||
                                            dataJadwalUjian?.jadwalUjian
                                              ?.waktuUjian}
                                        </span>
                                      </div>
                                    </div>
                                    {user?.role === "siswa" &&
                                      (pesertaId ? (
                                        sekolah?.id == 8123 ||
                                        sekolah?.id == 3364 ||
                                        sekolah?.id == 3367 ||
                                        sekolah?.id == 3388 ||
                                        sekolah?.id == 4995 ||
                                        sekolah?.id == 5025 ||
                                        sekolah?.id == 9348 ? (
                                          (dataJadwalUjian?.jadwalUjian
                                            ?.tampilJawaban == 1 ||
                                            dataJadwalUjian?.jadwalUjian
                                              ?.tampilNilai == 1) && (
                                            <>
                                              <Link
                                                href={`${ssURL}/hasil-ujian/${dataJadwalUjian?.peserta?.[0]?.id}`}
                                              >
                                                <button className="btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2">
                                                  Lihat hasil ujian
                                                </button>
                                              </Link>
                                            </>
                                          )
                                        ) : (
                                          <button
                                            className="btn btn-ss bg-soft-success color-success rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2"
                                            disabled
                                          >
                                            Jawaban berhasil direkam
                                          </button>
                                        )
                                      ) : (
                                        <button
                                          className={`
                            btn btn-ss btn-primary bg-gradient-primary shadow-primary-ss rounded-pill fs-18-ss fw-bold mt-lg-0 mt-3 mb-2
                            ${!pesertaId ? "no-drop" : ""}
                          `}
                                          style={{
                                            zIndex: "2",
                                            pointerEvents: "auto",
                                          }}
                                          // onClick={() =>
                                          //   pesertaId
                                          //     ? router.push(
                                          //         `${ssURL}/peserta-ujian/${pesertaId}`
                                          //       )
                                          //     : {}
                                          // }
                                          disabled={!pesertaId}
                                        >
                                          Anda tidak mengikuti ujian
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              </a>
                            </Link>
                          </div>
                        </>
                      );
                    }
                  })}
                {subnav == "sudah-selesai" && (
                  <div className="d-flex justify-content-center align-items-center">
                    <Pagination
                      total={jadwalUjianData?.totalData}
                      showSizeChanger={false}
                      current={parseInt(router.query?.page) || 1}
                      pageSize={10}
                      onChange={(e) => {
                        if (search) {
                          router.push(
                            `${ssURL}/jadwal-ujian?subnav=sudah-selesai&page=${e}&search=${search}`
                          );
                        } else {
                          router.push(
                            `${ssURL}/jadwal-ujian?subnav=sudah-selesai&page=${e}`
                          );
                        }
                      }}
                    />
                  </div>
                )}

                {/* Card Jadwal Ujian End */}
              </div>
            </div>

            {/* Modal Remedial */}
            <ModalJadwalRemedial
              sekolah
              user={user}
              rombel={rombel}
              ujianTerpilih={ujianTerpilih}
              formData={formData}
              setFormData={setFormData}
              editId={editId}
              handlePostUjianData={handlePostUjianData}
            />
          </AnimatePage>
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ query: { subnav, page } }) {
  return {
    props: {
      subnav: subnav || null,
      page: page || 1,
    },
  };
}

export default index;
