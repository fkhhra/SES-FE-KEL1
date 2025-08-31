import { Select } from "antd";
import axios from "axios";
import { baseURL, downloadURL, ssURL } from "client/clientAxios";
import {
  deleteSoalUjian,
  editSoalUjian,
  postSoalUjian,
} from "client/SoalUjianClient";
import { downloadKartuSoal, getDetailUjian } from "client/UjianClient";
import Layout from "components/Layout/Layout";
import AnimatePage from "components/Shared/AnimatePage/AnimatePage";
import AudioPlayer from "components/Shared/AudioPlayer/AudioPlayer";
import Editor from "components/Shared/Editor/Editor";
import EmptyStateFile from "components/Shared/EmptyState/EmptyStateFile";
import InputFile from "components/Shared/InputFile/InputFile";
import ModalAmbilSoal from "components/Shared/ModalAmbilSoal/ModalAmbilSoal";
import ModalPratinjauSoal from "components/Shared/ModalPratinjauSoal/ModalPratinjauSoal";
import ModalStep from "components/Shared/ModalStep/ModalStep";
import ModalTautanLink from "components/Shared/ModalTautanLink/ModalTautanLink";
import MyJoyride from "components/Shared/MyJoyride/MyJoyride";
import Navbar from "components/Shared/Navbar/Navbar";
import NewModal from "components/Shared/NewModal/NewModal";
import useUser from "hooks/useUser";
import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronLeft,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaFile,
  FaLink,
  FaPaperclip,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { alphabet, momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";

const { Option } = Select;

const index = ({ id }) => {
  const initialFormData = {
    bentuk: "",
    kd: "",
    kdKontenMateri: "",
    levelKognitif: "",
    kjPg: "",
    nilaiSoal: 0,
    mUjianId: id,
    soalEdit: false,
    rubrikKj: [],
    audio: "",
    pertanyaan: "",

    //
    akmKontenMateri: "",
    akmKonteksMateri: "",
    akmProsesKognitif: "",
    opsiAUraian: "",
    opsiBUraian: "",
    kjUraian: "",
    pilihanMenjodohkan: [],
    soalMenjodohkan: [],
  };

  const router = useRouter();

  const { nav } = useRouter().query;
  const { user } = useUser();

  const [formData, setFormData] = useState(initialFormData);

  const [detailUjianData, setDetailUjianData] = useState({});
  const {
    levelKognitif,
    bentukSoal,
    ujian,
    jumlahSoalEsai,
    jumlahSoalPg,
    tingkat,
    kontenMateri,
    konteksMateri,
    prosesKognitif,
  } = detailUjianData;

  const [fileSoal, setFileSoal] = useState();

  const [downloadingKartu, setDownloadingKartu] = useState(false);
  const [indexSoalUjian, setIndexSoalUjian] = useState(0);
  const [pilihanJawabanPG, setPilihanJawabanPG] = useState([0]);
  const initialRubrikKj = [
    {
      poin: "",
      indikator: "",
      id: Math.random(),
    },
  ];
  const [rubrikKj, setRubrikKj] = useState(initialRubrikKj);
  const [buttonState, setButtonState] = useState("idle");

  const activeSoalUjian = ujian?.soalUjian?.[indexSoalUjian];
  const tipeSoal = activeSoalUjian?.soal?.bentuk;

  const handleClickDownloadKartuSoal = async (tipe) => {
    if (
      momentPackage().hour() > 11 ||
      momentPackage().hour() < 6 ||
      tipe == "template" ||
      momentPackage().day() == 0 ||
      momentPackage().day() == 6
    ) {
      setDownloadingKartu(true);
      const toastloading = toast.loading("Downloading");
      const { data, error } = await downloadKartuSoal(id, tipe);

      if (data) {
        document.getElementById(
          "downloadIframe"
        ).src = `${downloadURL}/${data}`;
        setDownloadingKartu(false);
        toast.success("Downloaded", { id: toastloading });
      } else if (error) {
        toast.error("silahkan Coba beberapa saat lagi");
        toast.error("Error", { id: toastloading });
      }
    } else {
      toast.error("Fitur Aktif Pukul 12.00 - 06.00");
      return false;
    }
  };

  const [buttonStateUnggahSoal, setButtonStateUnggahSoal] = useState("idle");

  const [pilihanMenjodohkan, setPilihanMenjodohkan] = useState([0]);
  const [soalMenjodohkan, setSoalMenjodohkan] = useState([
    { id: 1, soal: "", jawaban: "", pembahasan: "", poin: "" },
  ]);

  const handlePostImportSoalData = async () => {
    setButtonStateUnggahSoal("loading");

    const payload = new FormData();

    payload.append("file", fileSoal?.files?.[0]);
    payload.append("m_ujian_id", id);

    const { data } = await axios.post(baseURL + "/soal-ujian/import", payload, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
      },
    });

    if (data) {
      setButtonStateUnggahSoal("success");
      toast.success("Berhasil");
      getDetailUjianData();
      setFileSoal({});
    } else {
      setButtonStateUnggahSoal("error");
    }
  };

  const handlePrev = () => {
    if (indexSoalUjian === 0) return;

    setIndexSoalUjian(indexSoalUjian - 1);
  };

  const handleNext = () => {
    if (ujian?.soalUjian?.length - 1 === indexSoalUjian) return;

    setIndexSoalUjian(indexSoalUjian + 1);
  };

  const handleChangeForm = (e, data, type, idx) => {
    if (type === "soal-menjodohkan") {
      const copy = [...soalMenjodohkan];
      copy[idx][e.target.name] = e.target.value;
      setSoalMenjodohkan(copy);
      return;
    }

    if (data) {
      setFormData({
        ...formData,
        [e.target.name]: data,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const getDetailUjianData = async () => {
    const { data } = await getDetailUjian(id);
    if (data) {
      setDetailUjianData(data);
    }
  };

  const uploadFileToServer = async (e, data) => {
    if (data) {
      handleChangeForm(e, data);
    }
  };

  const handleClickEditSoalUjian = (soal) => {
    setFormData({
      ...formData,
      pertanyaan: soal?.pertanyaan,
      pembahasan: soal?.pembahasan,
      bentuk: soal?.bentuk,
      kd: soal?.kd,
      kdKontenMateri: soal?.kdKontenMateri,
      levelKognitif: soal?.levelKognitif,
      kjPg: soal?.kjPg,
      nilaiSoal: soal?.nilaiSoal,
      soalEdit: true,
      soalUjianId: soal?.id,
      jawabanA: soal?.jawabanA,
      jawabanB: soal?.jawabanB,
      jawabanC: soal?.jawabanC,
      jawabanD: soal?.jawabanD,
      jawabanE: soal?.jawabanE,
      radioYa: soal?.audio ? true : false,
      audio: soal?.audio,
      akmKonteksMateri: soal?.akmKonteksMateri,
      akmKontenMateri: soal?.akmKontenMateri,
      akmProsesKognitif: soal?.akmProsesKognitif,
      jawabanPgKompleks: soal?.jawabanPgKompleks?.split(","),
      opsiAUraian: soal?.opsiAUraian,
      opsiBUraian: soal?.opsiBUraian,
      kjUraian: soal?.kjUraian,
    });
    soal?.jawabanA && setPilihanJawabanPG([0]);
    soal?.jawabanB && setPilihanJawabanPG([0, 1]);
    soal?.jawabanC && setPilihanJawabanPG([0, 1, 2]);
    soal?.jawabanD && setPilihanJawabanPG([0, 1, 2, 3]);
    soal?.jawabanE && setPilihanJawabanPG([0, 1, 2, 3, 4]);
    setRubrikKj(JSON.parse(soal?.rubrikKj || initialRubrikKj));
    setPilihanMenjodohkan(soal?.pilihanMenjodohkan);
    setSoalMenjodohkan(soal?.soalMenjodohkan);
  };

  const handlePostSoalUjianData = async () => {
    setButtonState("loading");
    if (!formData.nilaiSoal && formData.bentuk != "menjodohkan") {
      toast.error("Nilai Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    } else if (
      !formData.kjPg &&
      !formData.kjUraian &&
      !formData.jawabanPgKompleks &&
      !formData.kjUraian &&
      !formData.soalMenjodohkan &&
      formData.bentuk !== "esai"
    ) {
      toast.error("Jawaban Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    } else if (!window.$(`#editorPertanyaan`).summernote("code")) {
      toast.error("Pertanyaan Soal Belum Dimasukan");
      setButtonState("idle");
      return;
    }
    const payload = {
      ...formData,
      pertanyaan: window.$(`#editorPertanyaan`).summernote("code"),
      jawabanA:
        typeof window.$(`#editorJawabanPGA`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGA`).summernote("code")
          : " ",
      jawabanB:
        typeof window.$(`#editorJawabanPGB`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGB`).summernote("code")
          : " ",
      jawabanC:
        typeof window.$(`#editorJawabanPGC`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGC`).summernote("code")
          : " ",
      jawabanD:
        typeof window.$(`#editorJawabanPGD`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGD`).summernote("code")
          : " ",
      jawabanE:
        typeof window.$(`#editorJawabanPGE`).summernote("code") == "string"
          ? window.$(`#editorJawabanPGE`).summernote("code")
          : " ",
      pembahasan:
        typeof window.$(`#editorPembahasan`).summernote("code") == "string"
          ? window.$(`#editorPembahasan`).summernote("code")
          : " ",
      rubrikKj: rubrikKj,
    };

    if (formData.bentuk === "menjodohkan") {
      let pilihanMenjodohkanData = [];
      let soalMenjodohkanData = [];

      pilihanMenjodohkan?.map((pilihan, idx) => {
        pilihanMenjodohkanData.push(
          window.$(`#editorMenjodohkan-${alphabet[idx]}`).summernote("code")
        );
      });

      soalMenjodohkan?.map((soalData, idx) => {
        soalMenjodohkanData.push({
          ...soalData,
          soal: window
            .$(`#editor-pertanyaan-menjodohkan-${idx}`)
            .summernote("code"),
          pembahasan: window
            .$(`#editor-pembahasan-menjodohkan-${idx}`)
            .summernote("code"),
        });
      });

      payload.pilihanMenjodohkan = pilihanMenjodohkanData;
      payload.soalMenjodohkan = soalMenjodohkanData;
      payload.pertanyaan = formData.pertanyaan;
    }

    const { data } = formData?.soalEdit
      ? await editSoalUjian(formData?.soalUjianId, payload)
      : await postSoalUjian(payload);

    if (data) {
      setCurrent(0);
      hideModal("modalBuatSoalUjian");
      window.$(`#editorPertanyaan`).summernote("code", "");
      window.$(`#editorJawabanPGA`).summernote("code", "");
      window.$(`#editorJawabanPGB`).summernote("code", "");
      window.$(`#editorJawabanPGC`).summernote("code", "");
      window.$(`#editorJawabanPGD`).summernote("code", "");
      window.$(`#editorJawabanPGE`).summernote("code", "");
      window.$(`#editorPembahasanPG`).summernote("code", "");
      window.$(`#editorPembahasanEsai`).summernote("code");
      window.$(`#editorPertanyaanEsai`).summernote("code");
      toast.success(data?.message);
      setFormData(initialFormData);
      setRubrikKj(initialRubrikKj);
      setPilihanJawabanPG([0]);
      getDetailUjianData();
      setButtonState("success");
      router.reload();
    } else {
      setButtonState("error");
    }
  };

  const handleDeleteSoalUjianData = (soal_id) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data, error } = await deleteSoalUjian(soal_id, {
          m_ujian_id: id,
        });
        if (data) {
          toast.success(data?.message);
          getDetailUjianData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleRemoveSoalMenjodohkan = (index) => {
    if (index != 0)
      setSoalMenjodohkan(soalMenjodohkan.filter((val, idx) => idx != index));
  };

  const handleChangeRubrik = (e, index, parseInteger) => {
    let editedRubrik = [...rubrikKj];
    let currentRubrik = editedRubrik[index];

    if (e.target.name) {
      currentRubrik[e.target.name] = parseInteger
        ? parseInt(e.target.value)
        : e.target.value;
    }

    setRubrikKj(editedRubrik);
  };

  const handleRemoveRubrik = (id) => {
    if (rubrikKj.length === 1) return;

    const filterRubrik = rubrikKj.filter((val) => val.id !== id);
    setRubrikKj([...filterRubrik]);
  };

  const handleAddPilihanRubrik = () => {
    setRubrikKj([
      ...rubrikKj,
      {
        poin: "",
        indikator: "",
        id: Math.random(),
      },
    ]);
  };

  useEffect(() => {
    getDetailUjianData();
  }, []);

  const UjianLayout = ({ children }) => {
    return (
      <>
        <div className="row">
          {/* Header Jadwal Ujian Detail End */}
          <div className="col-md-12">
            <Link href={`${ssURL}/ujian-penerimaan-ppdb/soal/`}>
              <a className="text-decoration-none fw-bolder position-relative color-primary pointer">
                <FaChevronLeft />
                <span className="ms-2">Kembali</span>
              </a>
            </Link>

            <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 my-4">
              {/* Card Label & Option Start */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* Ujian Label Start */}

                {/* <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss me-2">
                  {ujian?.tipeFormat
                    ? ujian?.tipeFormat
                    : "Penilaian Akhir Semester 1"}
                </div> */}

                {/* Ujian Label End */}

                {/* Dropdown Option Start */}

                {/* <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
                  <div
                    role="button"
                    id="dropdownOption"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={`/img/icon-dropdown-option.svg`}
                      alt="icon-option"
                      data-joyride="btn-edit-ujian"
                    />
                  </div>
                  <ul
                    className="dropdown-menu dropdown-menu-ss my-1"
                    aria-labelledby="dropdownOption"
                  >
                    <li>
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
                </div> */}
                {/* Dropdown Option End */}
              </div>
              {/* Card Label & Option End */}
              {/* Ujian Title Start */}
              <div className="w-75 text-break">
                <h2 className="color-dark fw-black mb-4">{ujian?.nama}</h2>
              </div>
              {/* Ujian Title End */}

              {/* Ujian Info Start */}
              <div className="row mt-4">
                <div className="col-md-9 pe-2">
                  <div
                    className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss d-flex mb-3 mb-md-0 flex-grow-1 flex-wrap justify-content-md-start justify-content-between"
                    data-joyride="informasi-ujian"
                  >
                    {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? (
                      <>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">PG</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {`${parseInt(jumlahSoalPg) || 0} Soal`}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">Esai</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {`${parseInt(jumlahSoalEsai) || 0} Soal`}
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                          <p className="fs-14-ss color-secondary mb-2">
                            Jumlah Soal
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            {`${
                              parseInt(jumlahSoalPg) + parseInt(jumlahSoalEsai)
                            } Soal`}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0">
                        <p className="fs-14-ss color-secondary mb-2">
                          Jumlah Soal
                        </p>
                        <p className="fs-18-ss fw-bold color-dark m-0">
                          {`${ujian?.soalUjian?.length} Soal`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3 ps-2">
                  <button
                    className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#modalPratinjauSoal"
                    data-joyride="btn-pratinjau-soal"
                  >
                    <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                      <img
                        src={`/img/icon-pratinjau.svg`}
                        alt="icon-pratinjau"
                        style={{
                          width: "50px",
                          height: "50px",
                        }}
                      />
                      <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                        Pratinjau Soal
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Ujian Info End */}

              {/* Ujian AKM Info Start */}
              {/* <div className="row mt-4">
                  <div className="col-md-9 pe-2">
                    <div className="status-info p-3 pb-md-3 pb-0 bg-soft-primary rounded-ss mb-3 mb-md-0 d-flex flex-wrap justify-content-start">
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-1 order-sm-1">
                          <p className="fs-14-ss color-secondary mb-2">PG</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-5 order-sm-2">
                          <p className="fs-14-ss color-secondary mb-2">
                            Uraian
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-3 order-sm-3">
                          <p className="fs-14-ss color-secondary mb-2">Isian</p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-2 order-sm-4">
                          <p className="fs-14-ss color-secondary mb-2">
                            PG. Kompleks
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-4 order-sm-5">
                          <p className="fs-14-ss color-secondary mb-2">
                            Menjodohkan
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            20 Poin
                          </p>
                        </div>
                        <div className="status-info-items me-md-5 mb-lg-0 mb-3 p-3 p-md-0 order-last">
                          <p className="fs-14-ss color-secondary mb-2">
                            Total Nilai
                          </p>
                          <p className="fs-18-ss fw-bold color-dark m-0">
                            100 Poin
                          </p>
                        </div>
                    </div>
                  </div>
                  <div className="col-md-3 ps-2">
                    <div className="btn btn-primary btn-primary-ss rounded-ss d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-start py-3 px-4 h-100">
                      <div className="d-flex align-items-center flex-lg-row flex-md-column flex-row ">
                        <img
                          src={`/img/icon-pratinjau.svg`}
                          alt="icon-tatap-muka"
                          style={{
                            width: "50px",
                            height: "50px",
                          }}
                        />
                        <p className="m-0 text-white fw-bold px-lg-4 px-md-0 px-4 py-lg-0 py-md-2 py-0">
                          Mengawas
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

              {/* Ujian AKM Info End */}
            </div>
          </div>
          {/* Header Jadwal Ujian Detail End */}
        </div>
        {children}
      </>
    );
  };

  let navItems = [];

  if (ujian?.tipe != "literasi" && ujian?.tipe != "numerasi") {
    navItems.push(
      {
        url: `${ssURL}/ujian-penerimaan-ppdb/soal/[id]?nav=pg`,
        as: `${ssURL}/ujian-penerimaan-ppdb/soal/${id}?nav=pg`,
        text: "Pilihan Ganda",
        active: nav == "pg" || nav == undefined,
        dataJoyride: "pg",
      },
      {
        url: `${ssURL}/ujian-penerimaan-ppdb/soal/[id]?nav=esai`,
        as: `${ssURL}/ujian-penerimaan-ppdb/soal/${id}?nav=esai`,
        text: "Esai",
        active: nav == "esai",
        dataJoyride: "esai",
      }
    );
  } else {
    navItems = bentukSoal;
  }

  const onChangeDropdownFilter = (e) => {
    router.push({
      pathname: `${ssURL}/ujian/${id}`,
      query: {
        nav: e.value,
      },
    });
  };

  const NavUjianDetail = () => (
    <>
      <Navbar
        nav={navItems}
        isNavDropdown={
          ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? false : true
        }
        handleChangeDropdown={onChangeDropdownFilter}
        defaultDropdownValue={
          bentukSoal?.filter((bentuk) => bentuk?.value === nav)?.[0]?.label
        }
        action={[
          {
            button: (
              <>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    data-joyride="btn-unduh-soal"
                    data-bs-toggle="modal"
                    data-bs-target="#downloadKartuSoal"
                  >
                    <FaCloudDownloadAlt className="me-2 fs-18-ss" />
                    Kartu Soal
                  </button>
                </div>
                <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                  <button
                    className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-lg-3 mb-3 mb-lg-0 fw-bold color-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#modalUnggahSoal"
                    data-joyride="btn-unggah-soal"
                  >
                    <FaCloudUploadAlt className="me-2 fs-18-ss" />
                    Unggah Soal
                  </button>
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
                      Buat Soal
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
                        data-bs-target="#modalAmbilSoal"
                      >
                        <span>Ambil dari Bank Soal</span>
                      </a>
                    </li>
                    <li onClick={() => setFormData(initialFormData)}>
                      <a
                        className="dropdown-item pointer"
                        data-bs-toggle="modal"
                        data-bs-target="#modalBuatSoalUjian"
                      >
                        <span>Buat Soal Baru</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );

  const ListSoal = ({
    soal,
    handleDeleteSoalUjianData,
    handleClickEditSoalUjian,
    nomor,
  }) => {
    return (
      <>
        <div className="kuis-component">
          <div
            className="kuis-card rounded-ss mb-3 border border-secondary border-light-secondary-ss p-3"
            data-joyride="list-soal"
          >
            {/* Info Soal Start */}

            <div className="d-flex justify-content-center align-items-center justify-content-md-start justify-content-between pb-3 border-bottom border-light-secondary-ss flex-wrap">
              <span
                className="bg-primary text-white rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-sm-auto mb-sm-0 mb-1"
                style={{
                  minWidth: "75px",
                  height: "25px",
                }}
              >
                {soal?.nilaiSoal} Poin
              </span>
              <span
                className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center me-3 px-2 mb-sm-0 mb-1"
                style={{
                  minWidth: "75px",
                  minHeight: "25px",
                }}
              >
                {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi"
                  ? `KD ${soal?.kd}`
                  : kontenMateri.find((d) => d.value == soal?.akmKontenMateri)
                      ?.label}
              </span>
              <span
                className="outline-primary-ss rounded-pill fs-14-ss fw-bold d-flex align-items-center justify-content-center text-uppercase"
                style={{
                  minWidth: "75px",
                  height: "25px",
                }}
              >
                {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi"
                  ? `${soal?.levelKognitif}`
                  : prosesKognitif.find(
                      (d) => d.value == soal?.akmProsesKognitif
                    )?.label}
              </span>
            </div>
            {/* Info Soal End */}
            <div className="d-flex align-items-md-center flex-lg-nowrap flex-md-row flex-column flex-wrap pt-3">
              <div
                className="rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fw-extrabold color-dark me-3 p-3"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                {nomor}
              </div>
              <div className="d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row flex-grow-1">
                <div className="soal-content p-md-1 p-0 m-md-0 mt-3 mb-4 text-break">
                  <p
                    className="mb-0 color-secondary pe-3 dangerous-html"
                    dangerouslySetInnerHTML={{
                      __html: soal?.pertanyaan?.replace("b&", "..."),
                    }}
                  ></p>
                </div>
                <div className="d-flex flex-lg-row flex-sm-column flex-row justify-content-between">
                  <button
                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6 me-lg-2 mb-lg-0 mb-md-2 mb-0"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#modalBuatSoalUjian"
                    onClick={() => handleClickEditSoalUjian(soal)}
                    data-joyride="btn-edit-soal"
                  >
                    <FaPen className="color-secondary" />
                  </button>
                  <button
                    className="btn btn-link rounded-circle bg-soft-primary d-flex justify-content-center align-items-center fs-6"
                    style={{
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={() => handleDeleteSoalUjianData(soal?.id)}
                    data-joyride="btn-delete-soal"
                  >
                    <FaTrashAlt className="color-secondary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const [current, setCurrent] = useState(0);

  const next = () => {
    if (!formData.bentuk) {
      toast.error("Anda Belum Memilih Bentuk Soal");
      return;
      // } else if (formData.kd.length > 4) {
      //   toast.error("Hanya dapat memasukkan nomor kompetensi dasar");
      //   return;
    }
    // else if (!formData.levelKognitif) {
    //   toast.error("Anda Belum Memilih Level Kognitif");
    //   return;
    // }
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [];

  if (user?.role == "guru") {
    steps.push(
      {
        target: '[data-joyride="btn-edit-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Edit Ujian</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol jika anda ingin mengedit informasi mengenai ujian
              yang sudah dibuat.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="informasi-ujian"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi Ujian</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat melihat informasi singkat mengenai bank soal dari ujian
              yang anda buat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-pratinjau-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Melihat Pratinjau Soal ?
            </h5>
            <p className="color-secondary fw-semibold">
              Klik pada tombol untuk melihat pratinjau dari bank ujian yang
              sudah dibuat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-unduh-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Kartu Soal</h5>
            <p className="color-secondary fw-semibold">
              Bank soal yang sudah anda buat dapat diunduh menjadi file excel.
              Tekan tombol untuk mengunduh bank soal.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-unggah-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Unggah Soal</h5>
            <p className="color-secondary fw-semibold">
              Apabila anda ingin memasukkan soal dalam jumlah yang banyak dalam
              waktu yang bersamaan, anda bisa mengunggah soal yang sudah anda
              buat dengan mengnekan tombol unggah soal.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-buat-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Menambahkan Soal Baru ?
            </h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol untuk nambahkan soal baru ke dalam bank soal anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="pilihan-ganda"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Soal Pilihan Ganda</h5>
            <p className="color-secondary fw-semibold">
              Menu ini berisi semua soal berbentuk pilihan ganda. Klik menu
              apabila anda ingin melihat soal berbentuk pilihan ganda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="esai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Soal Esai</h5>
            <p className="color-secondary fw-semibold">
              Menu ini berisi semua soal berbentuk esai. Klik menu apabila anda
              ingin melihat soal berbentuk esai.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="list-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Daftar Soal</h5>
            <p className="color-secondary fw-semibold">
              Daftar soal yang sudah anda buat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-edit-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Edit Soal</h5>
            <p className="color-secondary fw-semibold">
              Tekan tombol jika anda ingin mengedit soal yang sudah dibuat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-delete-soal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Hapus Soal</h5>
            <p className="color-secondary fw-semibold">
              Jika anda ingin menghapus soal yang sudah anda buat, anda dapat
              menekan tombol ini untuk menghapus soal.
            </p>
          </div>
        ),
      }
    );
  }

  return (
    <Layout
      modalWrapper={
        <>
          <ModalStep
            modalClass="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
            buttonSubmit={
              <ReactiveButton
                onClick={handlePostSoalUjianData}
                buttonState={buttonState}
                color={"primary"}
                idleText={formData.soalEdit ? "Ubah Soal" : "Buat Soal"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                data-bs-dismiss="modal"
                className={"btn btn-primary"}
              />
            }
            isNext={true}
            modalId="modalBuatSoalUjian"
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Buat Soal</h4>
                <span className="fs-6 fw-normal">
                  Isi informasi dibawah untuk membuat soal
                </span>
              </>
            }
            current={current}
            next={next}
            prev={prev}
            steps={[
              {
                title: "Isi Informasi Soal",
                content: (
                  <>
                    {ujian?.tipe != "literasi" && ujian?.tipe != "numerasi" ? (
                      <>
                        <div className="mt-4 mb-3">
                          <label className="form-label">
                            Nomor Kompetensi Dasar / Nomor Capaian Pembelajaran
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Contoh: 3.1"
                            name="kd"
                            value={formData.kd}
                            onChange={(e) =>
                              e.target.value.length > 4
                                ? toast.error(
                                    "Hanya dapat memasukkan nomor kompetensi dasar / capaian pembelajaran"
                                  )
                                : handleChangeForm(e)
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Isi Kompetensi Dasar
                          </label>
                          <TextareaAutosize
                            className="form-control"
                            autoComplete="off"
                            style={{
                              resize: "none",
                              width: "100%",
                            }}
                            placeholder="Contoh: Siswa dapat memahami tentang aljabar"
                            minRows={3}
                            name="kdKontenMateri"
                            value={formData.kdKontenMateri}
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Level Kognitif</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            placeholder="Pilih level kognitif"
                            name="levelKognitif"
                            value={formData.levelKognitif}
                            onChange={handleChangeForm}
                          >
                            <option hidden>Pilih level kognitif</option>
                            {levelKognitif?.map((d) => {
                              return (
                                <option value={d?.value}>
                                  {d?.label} - {d?.value}{" "}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Konten Materi</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            placeholder="Pilih konten materi"
                            name="akmKontenMateri"
                            value={formData.akmKontenMateri}
                            onChange={handleChangeForm}
                          >
                            <option hidden>Pilih Konten Materi</option>
                            {kontenMateri?.map((kontenM) => (
                              <option value={kontenM.value}>
                                {kontenM.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Konteks Materi</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            placeholder="Pilih konteks materi"
                            name="akmKonteksMateri"
                            value={formData.akmKonteksMateri}
                            onChange={handleChangeForm}
                          >
                            <option hidden>Pilih Konteks Materi</option>
                            {konteksMateri?.map((konteksM) => (
                              <option value={konteksM.value}>
                                {konteksM.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Proses Kognitif</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            placeholder="Pilih Proses Kognitif"
                            name="akmProsesKognitif"
                            value={formData.akmProsesKognitif}
                            onChange={handleChangeForm}
                          >
                            <option hidden>Pilih Proses Kognitif</option>
                            {prosesKognitif?.map((prosesKog) => (
                              <option value={prosesKog.value}>
                                {prosesKog.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Bentuk Soal</label>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        placeholder="Pilih bentuk soal"
                        name="bentuk"
                        value={formData.bentuk}
                        onChange={handleChangeForm}
                      >
                        <option hidden>Pilih bentuk soal</option>
                        {bentukSoal?.map((soal) => (
                          <option value={soal?.value}>{soal?.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <h6 className="fs-18-ss fw-bold color-dark mb-3">
                        Ada Soal Audio ?
                      </h6>
                      <div className="row">
                        <div className="form-check-ss col-md-6 position-relative">
                          <input
                            className="form-check-input form-check-radio position-absolute"
                            type="radio"
                            name="flexRadioDefault"
                            id="radioYa"
                            style={{
                              top: "36%",
                              left: "2em",
                            }}
                            checked={formData?.radioYa}
                            defaultChecked={false}
                            onChange={(e) =>
                              setFormData({ ...formData, radioYa: true })
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
                            name="flexRadioDefault"
                            id="radioTidak"
                            style={{
                              top: "36%",
                              left: "2em",
                              // height: "20px",
                            }}
                            checked={!formData?.radioYa}
                            defaultChecked={false}
                            onChange={(e) =>
                              setFormData({ ...formData, radioYa: false })
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
                ),
              },
              {
                title: "Buat Soal",
                content: (
                  <>
                    {/* Buat Soal Pilihan Ganda Start */}
                    {(formData?.bentuk === "pg" ||
                      formData?.bentuk === "pg_kompleks") && (
                      <>
                        {formData?.radioYa && (
                          <div className="mb-4 mt-4">
                            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                              <h6 className="color-dark fw-bold fs-18-ss">
                                File Audio
                              </h6>
                              <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                                <label
                                  htmlFor="uploadAudio"
                                  className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                                >
                                  <FaPaperclip className="me-2" />
                                  <p className="mb-0">Unggah File</p>
                                </label>
                                <InputFile
                                  name="audio"
                                  id="uploadAudio"
                                  accept="audio/"
                                  onChange={uploadFileToServer}
                                />
                                <button
                                  type="button"
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalTautanLinkAudio"
                                >
                                  <FaLink className="me-2" />
                                  Tautan Link
                                </button>
                              </div>
                            </div>
                            {formData?.audio ? (
                              <AudioPlayer src={formData?.audio} />
                            ) : (
                              <EmptyStateFile type="music" />
                            )}
                          </div>
                        )}
                        <div className="my-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pertanyaan
                          </h5>
                          <Editor
                            id="editorPertanyaan"
                            defaultValue={formData?.pertanyaan}
                          />
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Jawaban
                          </h5>
                          {pilihanJawabanPG?.map((d, idx) => {
                            return (
                              <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                                <div className="d-flex justify-content-between">
                                  <div
                                    className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                  >
                                    {alphabet[idx]}
                                  </div>
                                  {pilihanJawabanPG[
                                    pilihanJawabanPG.length - 1
                                  ] == d && (
                                    <button
                                      className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                                      onClick={() =>
                                        setPilihanJawabanPG(
                                          pilihanJawabanPG.filter((e) => {
                                            return e !== d;
                                          })
                                        )
                                      }
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  )}
                                </div>
                                <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                                  <Editor
                                    id={`editorJawabanPG${alphabet[idx]}`}
                                    defaultValue={
                                      formData?.[`jawaban${alphabet[idx]}`]
                                    }
                                  />
                                </div>
                                {pilihanJawabanPG[
                                  pilihanJawabanPG.length - 1
                                ] == d && (
                                  <button
                                    className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                                    onClick={() =>
                                      setPilihanJawabanPG(
                                        pilihanJawabanPG.filter((e) => {
                                          return e !== d;
                                        })
                                      )
                                    }
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          {pilihanJawabanPG.length < 5 && (
                            <button
                              className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                              onClick={() =>
                                setPilihanJawabanPG([
                                  ...pilihanJawabanPG,
                                  Math.max(...pilihanJawabanPG) + 1,
                                ])
                              }
                            >
                              <FaPlus className="me-2" />
                              Tambah Pilihan Jawaban
                            </button>
                          )}
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Jawaban Benar</label>
                          {formData?.bentuk === "pg" ? (
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              placeholder="Pilih jawaban benar"
                              name="kjPg"
                              value={formData.kjPg}
                              onChange={handleChangeForm}
                            >
                              <option hidden>Pilih jawaban benar</option>
                              {pilihanJawabanPG?.map((d, idx) => {
                                return (
                                  <option value={alphabet[idx]}>
                                    Jawaban {alphabet[idx]}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <Select
                              mode="multiple"
                              value={formData.jawabanPgKompleks}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  jawabanPgKompleks: e,
                                })
                              }
                              placeholder="Pilih Kelas.."
                              style={{ width: "100%" }}
                              maxTagCount="responsive"
                              // value={formData.jawabanPgKompleks}
                            >
                              {pilihanJawabanPG?.map((d, idx) => {
                                return (
                                  <Option value={alphabet[idx]}>
                                    Jawaban {alphabet[idx]}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pembahasan
                          </h5>
                          <Editor
                            id="editorPembahasan"
                            defaultValue={formData?.pembahasan}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Nilai Soal</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan nilai soal"
                            name="nilaiSoal"
                            value={formData.nilaiSoal}
                            onChange={handleChangeForm}
                          />
                        </div>
                      </>
                    )}
                    {/* Buat Soal Pilihan Ganda End */}

                    {/* Buat Soal Esai Start */}
                    {formData?.bentuk === "esai" && (
                      <>
                        {formData?.radioYa && (
                          <div className="mb-4 mt-4">
                            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                              <h6 className="color-dark fw-bold fs-18-ss">
                                File Audio
                              </h6>
                              <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                                <label
                                  htmlFor="uploadAudio"
                                  className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                                >
                                  <FaPaperclip className="me-2" />
                                  <p className="mb-0">Unggah File</p>
                                </label>
                                <InputFile
                                  name="audio"
                                  id="uploadAudio"
                                  accept="audio/"
                                  onChange={uploadFileToServer}
                                />
                                <button
                                  type="button"
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalTautanLinkAudio"
                                >
                                  <FaLink className="me-2" />
                                  Tautan Link
                                </button>
                              </div>
                            </div>
                            {formData?.audio ? (
                              <AudioPlayer src={formData?.audio} />
                            ) : (
                              <EmptyStateFile type="music" />
                            )}
                          </div>
                        )}
                        <div className="my-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pertanyaan
                          </h5>
                          <Editor
                            id="editorPertanyaan"
                            defaultValue={formData?.pertanyaan}
                          />
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pembahasan
                          </h5>
                          <Editor
                            id="editorPembahasan"
                            defaultValue={formData?.pembahasan}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Nilai Soal</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan nilai soal"
                            value={formData.nilaiSoal}
                            name="nilaiSoal"
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Rubrik
                          </h5>
                          {rubrikKj?.map((rubrik, idx) => (
                            <div className="rubrik-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                              <div className="d-flex justify-content-between">
                                <div
                                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                >
                                  {idx + 1}
                                </div>
                                <button
                                  className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                  onClick={() => handleRemoveRubrik(rubrik?.id)}
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                              <div className="w-100 rounded-ss border border-light-secondary-ss p-3 order-lg-2 order-3 mt-lg-0 mt-2">
                                <div className="mb-3">
                                  <label className="form-label">Poin</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    autoComplete="off"
                                    placeholder="Masukkan poin untuk rubrik"
                                    value={rubrik.poin}
                                    name="poin"
                                    onChange={(e) =>
                                      handleChangeRubrik(e, idx, true)
                                    }
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Indikator
                                  </label>
                                  <TextareaAutosize
                                    className="form-control"
                                    autoComplete="off"
                                    style={{
                                      resize: "none",
                                      width: "100%",
                                    }}
                                    placeholder="Tuliskan indikator rubrik"
                                    minRows={3}
                                    name="indikator"
                                    value={rubrik.indikator}
                                    onChange={(e) => handleChangeRubrik(e, idx)}
                                  />
                                </div>
                              </div>
                              <button
                                className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => handleRemoveRubrik(rubrik?.id)}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          ))}
                          <button
                            className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                            onClick={() => handleAddPilihanRubrik()}
                          >
                            <FaPlus className="me-2" />
                            Tambah Rubrik
                          </button>
                        </div>
                      </>
                    )}
                    {/* Buat Soal Esai End */}

                    {/* Buat Soal Uraian Start */}
                    {formData?.bentuk === "uraian" && (
                      <>
                        {formData?.radioYa && (
                          <div className="mb-4 mt-4">
                            <div className="d-flex justify-content-between align-items-sm-center flex-sm-row flex-column mb-3">
                              <h6 className="color-dark fw-bold fs-18-ss">
                                File Audio
                              </h6>
                              <div className="d-flex align-items-sm-center flex-sm-row flex-column">
                                <label
                                  htmlFor="uploadAudio"
                                  className="d-flex align-items-center justify-content-center form-label m-0 fs-12-ss fw-bold btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill me-sm-3 mb-sm-0 mb-3"
                                >
                                  <FaPaperclip className="me-2" />
                                  <p className="mb-0">Unggah File</p>
                                </label>
                                <InputFile
                                  name="audio"
                                  id="uploadAudio"
                                  accept="audio/"
                                  onChange={uploadFileToServer}
                                />
                                <button
                                  type="button"
                                  className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fs-12-ss fw-bold"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalTautanLinkAudio"
                                >
                                  <FaLink className="me-2" />
                                  Tautan Link
                                </button>
                              </div>
                            </div>
                            {formData?.audio ? (
                              <AudioPlayer src={formData?.audio} />
                            ) : (
                              <EmptyStateFile type="music" />
                            )}
                          </div>
                        )}
                        <div className="my-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pertanyaan
                          </h5>
                          <Editor
                            id="editorPertanyaan"
                            defaultValue={formData.pertanyaan}
                          />
                        </div>
                        <div className="mb-4">
                          <d className="d-flex justify-content-between align-items-center">
                            <h5 className="fs-18-ss fw-bold color-dark mb-0">
                              Jawaban Opsi
                            </h5>
                          </d>
                        </div>
                        <div className="mb-4">
                          <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-12-ss fw-extrabold color-primary mb-3 d-inline-block">
                            Opsi 1
                          </h6>
                          <TextareaAutosize
                            className="form-control"
                            autoComplete="off"
                            style={{
                              resize: "none",
                              width: "100%",
                            }}
                            onChange={handleChangeForm}
                            value={formData.opsiAUraian}
                            name="opsiAUraian"
                          />
                        </div>
                        <div className="mb-4">
                          <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-12-ss fw-extrabold color-primary mb-3 d-inline-block">
                            Opsi 2
                          </h6>
                          <TextareaAutosize
                            className="form-control"
                            autoComplete="off"
                            style={{
                              resize: "none",
                              width: "100%",
                            }}
                            onChange={handleChangeForm}
                            value={formData.opsiBUraian}
                            name="opsiBUraian"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Jawaban Benar</label>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            placeholder="Pilih jawaban benar"
                            name="kjUraian"
                            value={formData.kjUraian}
                            onChange={handleChangeForm}
                          >
                            <option hidden>Pilih jawaban benar</option>
                            <option value="A">Jawaban Opsi 1</option>
                            <option value="B">Jawaban Opsi 2</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Nilai Soal</label>
                          <input
                            type="number"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan nilai soal"
                            name="nilaiSoal"
                            value={formData.nilaiSoal}
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pembahasan
                          </h5>
                          <Editor
                            id="editorPembahasan"
                            defaultValue={formData.pembahasan}
                          />
                        </div>
                      </>
                    )}

                    {/* Buat Soal Uraian End */}

                    {/* Buat Soal Menjodohkan Start */}
                    {formData?.bentuk === "menjodohkan" && (
                      <>
                        <div className="my-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-2">
                            Judul
                          </h5>
                          <input
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            placeholder="Masukkan judul soal"
                            value={formData.pertanyaan}
                            name="pertanyaan"
                            onChange={handleChangeForm}
                          />
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Pilihan Menjodohkan
                          </h5>
                          {pilihanMenjodohkan?.map((pilihan, idx) => (
                            <div className="jawaban-list d-flex flex-lg-nowrap flex-lg-row flex-column flex-wrap justify-content-between mb-3">
                              <div className="d-flex justify-content-between">
                                <div
                                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center fw-extrabold text-white me-3 p-3 order-lg-1 order-1"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                >
                                  {alphabet[idx]}
                                </div>
                                <button
                                  className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-lg-none"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                  }}
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                              <div className="w-100 text-break order-lg-2 order-3 mt-lg-0 mt-2">
                                <Editor
                                  id={`editorMenjodohkan-${alphabet[idx]}`}
                                  defaultValue={
                                    typeof pilihan === "number" ? "" : pilihan
                                  }
                                />
                              </div>
                              <button
                                className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-lg-flex justify-content-center align-items-center fs-6 ms-3 order-lg-3 order-2 d-none"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                }}
                                onClick={() => {
                                  if (
                                    Math.max(
                                      ...soalMenjodohkan?.map((d) => d?.jawaban)
                                    ) +
                                      1 ==
                                    pilihanMenjodohkan?.length
                                  ) {
                                    toast.error(
                                      "Ada Soal dengan jawaban " +
                                        alphabet[
                                          Math.max(
                                            ...soalMenjodohkan?.map(
                                              (d) => d?.jawaban
                                            )
                                          )
                                        ]
                                    );
                                    return;
                                  } else if (idx > 0)
                                    setPilihanMenjodohkan(
                                      pilihanMenjodohkan.filter((e) => {
                                        return e !== pilihan;
                                      })
                                    );
                                }}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              if (pilihanMenjodohkan?.length == 20) {
                                toast.error("Hanya dapat membuat 20 pilihan");
                                return;
                              } else {
                                setPilihanMenjodohkan([
                                  ...pilihanMenjodohkan,
                                  Math.max(...pilihanMenjodohkan) + 1,
                                ]);
                              }
                            }}
                            className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                          >
                            <FaPlus className="me-2" />
                            Tambah Pilihan Menjodohkan
                          </button>
                        </div>
                        <div className="mb-4">
                          <h5 className="fs-18-ss fw-bold color-dark mb-4">
                            Soal
                          </h5>
                          {soalMenjodohkan?.map((soal, idx) => (
                            <div>
                              <div className="mb-3 w-100 rounded-ss border border-light-secondary-ss p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="border border-2 border-primary-ss rounded-pill label-ss fs-14-ss fw-extrabold color-primary d-inline-block">
                                    Soal {idx + 1}
                                  </h6>
                                  <button
                                    className="btn btn-danger btn-danger-ss rounded-circle shadow-danger-ss d-flex justify-content-center align-items-center fs-6 ms-3"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                    }}
                                    onClick={() =>
                                      handleRemoveSoalMenjodohkan(idx)
                                    }
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                                <div className="row">
                                  <div className="col-sm-11">
                                    <div className="my-4">
                                      <h6 className="fs-14-ss fw-bold color-dark mb-4">
                                        Pertanyaan
                                      </h6>
                                      <Editor
                                        id={`editor-pertanyaan-menjodohkan-${idx}`}
                                        defaultValue={soal?.soal}
                                      />
                                    </div>
                                    <div className="mb-4">
                                      <label className="form-label fs-14-ss">
                                        Jawaban Benar
                                      </label>
                                      <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        placeholder="Pilih jawaban benar"
                                        name="jawaban"
                                        onChange={(e) => {
                                          if (
                                            soalMenjodohkan.find(
                                              (d) => d.jawaban == e.target.value
                                            )
                                          ) {
                                            toast.error(
                                              `Jawaban ${
                                                alphabet[e.target.value]
                                              } sudah terpakai`
                                            );
                                          } else {
                                            handleChangeForm(
                                              e,
                                              null,
                                              "soal-menjodohkan",
                                              idx
                                            );
                                          }
                                        }}
                                        value={parseInt(soal?.jawaban)}
                                      >
                                        <option hidden>
                                          Pilih jawaban benar
                                        </option>
                                        {pilihanMenjodohkan?.map(
                                          (pilihan, idx) => (
                                            <option value={idx}>
                                              Jawaban {alphabet[idx]}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>
                                    <div className="mb-4">
                                      <h6 className="fs-14-ss fw-bold color-dark mb-4">
                                        Pembahasan
                                      </h6>
                                      <Editor
                                        id={`editor-pembahasan-menjodohkan-${idx}`}
                                        defaultValue={soal?.pembahasan}
                                      />
                                    </div>
                                    <div className="mb-4">
                                      <label className="form-label">
                                        Nilai Soal
                                      </label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        autoComplete="off"
                                        placeholder="Masukkan nilai soal"
                                        name="poin"
                                        onChange={(e) =>
                                          handleChangeForm(
                                            e,
                                            null,
                                            "soal-menjodohkan",
                                            idx
                                          )
                                        }
                                        value={soal?.poin}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn btn-ss btn-primary btn-primary-ss fs-14-ss fw-bold rounded-pill shadow-primary-ss mt-2"
                            onClick={() => {
                              if (
                                soalMenjodohkan?.length ==
                                pilihanMenjodohkan?.length
                              ) {
                                toast.error("Jumlah soal melebihi pilihan");
                                return;
                              } else {
                                setSoalMenjodohkan([
                                  ...soalMenjodohkan,
                                  {
                                    soal: "",
                                    jawaban: "",
                                    pembahasan: "",
                                    poin: "",
                                    id:
                                      soalMenjodohkan[
                                        soalMenjodohkan.length - 1
                                      ]?.id + 1,
                                  },
                                ]);
                              }
                            }}
                          >
                            <FaPlus className="me-2" />
                            Tambah Soal
                          </button>
                        </div>
                      </>
                    )}

                    {/* Buat Soal Menjodohkan End */}
                  </>
                ),
              },
            ]}
          />

          <NewModal
            modalId="downloadKartuSoal"
            removeFooter={1}
            title={
              <>
                <h4 className="mb-1 fw-extrabold">Kartu Soal</h4>
                <span className="fs-6 fw-normal">
                  Fitur Aktif 12.00 - 06.00
                </span>
              </>
            }
            content={
              <>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Template import Soal</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("template")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template import soal
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Template import soal
                        </span>
                      </p>
                    </a>
                  )}
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Kartu Soal PG</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("pg")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kartu Soal PG
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kartu Soal PG
                        </span>
                      </p>
                    </a>
                  )}
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Kartu Soal Esai</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("esai")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kartu Soal Esai
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kartu Soal Esai
                        </span>
                      </p>
                    </a>
                  )}
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Kisi-kisi Soal</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("kisi")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kisi-kisi Soal
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Kisi-kisi Soal
                        </span>
                      </p>
                    </a>
                  )}
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Naskah Soal</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("naskah")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Naskah Soal
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Naskah Soal
                        </span>
                      </p>
                    </a>
                  )}
                </div>
                <div className="mb-3">
                  <h5 className="fw-bold color-dark">Rumusan Soal</h5>
                  {!downloadingKartu ? (
                    <a
                      className="w-100 bg-soft-primary border border-primary d-flex align-items-center justify-content-center p-4 rounded-ss"
                      onClick={() => handleClickDownloadKartuSoal("rumusan")}
                      disabled={downloadingKartu}
                    >
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Rumusan Soal
                        </span>
                      </p>
                    </a>
                  ) : (
                    <a className="w-100 bg-soft-primary d-flex align-items-center justify-content-center p-4 rounded-ss not-allowed">
                      <img src="/img/icon-file-download.svg" alt="" />
                      <p className="fs-18-ss color-secondary fw-semibold ms-4 mb-0">
                        Klik untuk mengunduh{" "}
                        <span className="color-primary fw-bold">
                          Rumusan Soal
                        </span>
                      </p>
                    </a>
                  )}
                </div>
              </>
            }
          />

          {/* Modal AmbilSoal Start */}
          <ModalTautanLink
            toastMessage="Link berhasil ditambahkan"
            name="audio"
            modalId="modalTautanLinkAudio"
            getLink={(e, link) => handleChangeForm(e, link)}
          />
          <ModalAmbilSoal
            tingkat={tingkat?.map((d) => ({ value: d, label: d }))}
            getDetailUjianData={getDetailUjianData}
          />
          <ModalPratinjauSoal ujianData={ujian?.soalUjian} />
          <NewModal
            modalSize="md"
            modalId="modalUnggahSoal"
            title={
              <>
                <h4 className="mb-0 fw-extrabold">Unggah Soal</h4>
              </>
            }
            content={
              <>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label mb-0"
                    >
                      File Soal
                    </label>
                    <a
                      href="/import/template-soal-import-ss.xlsx"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="py-2 px-4 bg-soft-primary rounded-pill fs-14-ss color-primary text-decoration-none fw-bold"
                    >
                      <FaCloudDownloadAlt className="me-2" />
                      Download Template Soal
                    </a>
                  </div>
                  <label
                    htmlFor="inputUnggahSoal"
                    className="form-label mt-3 mb-4 w-100"
                  >
                    <div className="drop-file bg-soft-primary rounded d-flex rounded-ss border border-primary-ss justify-content-center align-items-center flex-column pointer w-100 p-4">
                      <div className="label-input d-flex align-items-center m-3 m-md-0 flex-sm-row flex-column">
                        <img src={`/img/icon-upload-dropfile.svg`} />
                        <span className="fs-18-ss fw-semibold color-secondary text-center ms-sm-3 ms-0 mt-sm-0 mt-2">
                          Klik untuk mengunggah{" "}
                          <span className="color-primary">Soal</span>
                        </span>
                      </div>
                    </div>
                  </label>
                  <input
                    className="form-control d-none"
                    type="file"
                    id="inputUnggahSoal"
                    onChange={({ target }) => setFileSoal(target)}
                  />
                  {fileSoal?.files?.[0] && (
                    <div className="card-lampiran-materi border-light-secondary rounded-ss mb-3">
                      <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                            <FaFile className="text-white fs-3" />
                          </div>
                          <div className="p-2">
                            <p className="fw-bold color-dark mb-0">
                              Template Import Soal
                            </p>
                            <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                              {/* PDF */}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                          <a
                            href={URL.createObjectURL(fileSoal?.files?.[0])}
                            target="_blank"
                            className="btn btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                          >
                            Pratinjau
                          </a>
                          <FaTimes
                            className="text-secondary pointer"
                            onClick={() => setFileSoal({})}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonStateUnggahSoal}
                onClick={() => handlePostImportSoalData()}
                disabled={!fileSoal?.files?.[0]}
                color={"primary"}
                idleText={"Unggah Soal"}
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
      <AnimatePage>
        <MyJoyride steps={steps} />
        <UjianLayout />
        <div className="row">
          {/* Nav Jadwal Ujian Detail Start */}
          <div className="col-md-12">
            <NavUjianDetail />
          </div>
          {/* Nav Jadwal Ujian Detail End */}

          {/* Ujian Detail Content Start*/}

          <div className="col-md-12">
            <div className="card card-ss">
              <div className="card-header-ss px-4 py-3">
                <h4 className="color-dark fw-extrabold mb-0">
                  Soal{" "}
                  {
                    bentukSoal?.filter(
                      (bentuk) => bentuk.value === (nav || "pg")
                    )?.[0]?.label
                  }
                </h4>
              </div>
              <div className="card-body pt-0">
                {ujian?.soalUjian?.filter(
                  (soal) =>
                    soal?.soal?.bentuk.trim().toLowerCase() === (nav || "pg")
                )?.length === 0 && (
                  <>
                    <div className="row justify-content-center">
                      <div className="col-sm-3 col-8">
                        <img
                          src="/img/empty-state-daftar-soal.png"
                          alt="empty-state"
                          className="img-fluid mb-2"
                        />
                      </div>
                      <div className="col-12 text-center">
                        <h5 className="color-dark fw-black">
                          Belum Ada Soal Yang Dibuat
                        </h5>
                        <p className="fw-bold fs-14-ss">
                          Tekan tombol{" "}
                          <a
                            className="text-decoration-none color-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#modalBuatSoalUjian"
                            onClick={() => setFormData(initialFormData)}
                          >
                            {" "}
                            Buat Soal
                          </a>{" "}
                          untuk membuat soal
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {ujian?.soalUjian
                  ?.filter(
                    (soal) =>
                      soal?.soal?.bentuk.trim().toLowerCase() === (nav || "pg")
                  )
                  ?.map((detailSoal, idx) => (
                    <ListSoal
                      soal={detailSoal?.soal}
                      handleDeleteSoalUjianData={handleDeleteSoalUjianData}
                      handleClickEditSoalUjian={handleClickEditSoalUjian}
                      nomor={idx + 1}
                      key={`${idx}-${new Date().getTime()}`}
                    />
                  ))}
              </div>
            </div>
          </div>
          {/* Ujian Detail Content End*/}
        </div>
      </AnimatePage>
      <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
    </Layout>
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
