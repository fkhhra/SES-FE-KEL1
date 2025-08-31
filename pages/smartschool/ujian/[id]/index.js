import axios from "axios";
import { DetailContentUjian } from "components/Ujian/DetailContent";
import ModalBuatSoalUjian from "components/Ujian/ModalBuatSoalUjian";
import ModalDownloadKartuSoal from "components/Ujian/ModalDownloadKartuSoal";
import { ModalUnggahSoalUjianExcel } from "components/Ujian/ModalUnggahSoalUjianExcel";
import { ModalUnggahSoalUjianWord } from "components/Ujian/ModalUnggahSoalUjianWord";
import { NavUjianDetail } from "components/Ujian/NavUjianDetail";
import { UjianHeader } from "components/Ujian/UjianHeader";
import useSekolah from "hooks/useSekolah";
import useUjian from "hooks/useUjian";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { hideModal } from "utilities/ModalUtils";
import { getStepsBankSoal } from "utilities/UjianUtils";
import { baseURL, ssURL } from "../../../../client/clientAxios";
import { getDetailUjian } from "../../../../client/UjianClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import ModalAmbilSoal from "../../../../components/Shared/ModalAmbilSoal/ModalAmbilSoal";
import ModalPratinjauSoal from "../../../../components/Shared/ModalPratinjauSoal/ModalPratinjauSoal";
import ModalTautanLink from "../../../../components/Shared/ModalTautanLink/ModalTautanLink";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import useUser from "../../../../hooks/useUser";
import Navbar from "components/Shared/Navbar/Navbar";
import { FaCalendarDay, FaClock } from "react-icons/fa";
import { momentPackage } from "utilities/HelperUtils";
import { DatePicker, Empty } from "antd";
import { Link } from "react-scroll";

const index = ({ id, nav, subnav }) => {
  const { user } = useUser();
  const router = useRouter();
  const { page = 1 } = router.query;
  const { sekolah } = useSekolah();
  const {
    detailUjianData,
    setDetailUjianData,

    soalMenjodohkan,
    setSoalMenjodohkan,

    setPilihanMenjodohkan,

    setPilihanJawabanPG,

    setRubrikKj,
  } = useUjian();

  const steps = getStepsBankSoal(user);

  const initialRubrikKj = [
    {
      poin: "",
      indikator: "",
      id: Math.random(),
    },
  ];

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
    totalNilai,
  } = detailUjianData;

  const activeSoalUjian = ujian?.soalUjian?.[indexSoalUjian];
  const tipeSoal = activeSoalUjian?.soal?.bentuk;

  let navItems = [];

  const navbarItems = [
    {
      url: `${ssURL}/ujian/${id}?subnav=soal`,
      as: `${ssURL}/ujian/${id}?subnav=soal`,
      text: "Soal",
      active: subnav == "soal" || subnav == undefined,
      dataJoyride: "soal",
    },
    {
      url: `${ssURL}/ujian/${id}?subnav=riwayat`,
      as: `${ssURL}/ujian/${id}?subnav=riwayat`,
      text: "Riwayat",
      active: subnav == "riwayat",
      dataJoyride: "riwayat",
    },
  ];

  if (ujian?.tipe != "literasi" && ujian?.tipe != "numerasi") {
    navItems.push(
      {
        url: `${ssURL}/ujian/${id}?nav=pg&subnav=soal`,
        as: `${ssURL}/ujian/${id}?nav=pg&subnav=soal`,
        text: "Pilihan Ganda",
        active: nav == "pg" || nav == undefined,
        dataJoyride: "pg",
      },
      {
        url: `${ssURL}/ujian/${id}?nav=esai&subnav=soal`,
        as: `${ssURL}/ujian/${id}?nav=esai&subnav=soal`,
        text: "Esai",
        active: nav == "esai",
        dataJoyride: "esai",
      },
      {
        url: `${ssURL}/ujian/${id}?nav=isian&subnav=soal`,
        as: `${ssURL}/ujian/${id}?nav=isian&subnav=soal`,
        text: "Isian",
        active: nav == "isian",
        dataJoyride: "isian",
      }
    );
  } else {
    navItems = bentukSoal;
  }

  const initialFormDataFilter = {
    tanggal: "",
  };

  const initialFormData = {
    totalNilaiPg: 0,
    totalNilaiEsai: 0,
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
    // akm_konteks_materi: "",
    // akm_konten_materi: "",
    // akm_proses_kognitif: "",

    //
    akmKonteksMateri: "",
    akmKontenMateri: "",
    akmProsesKognitif: "",
    tingkatKesukaran: "",
    sumberBuku: "",
    opsiAUraian: "",
    opsiBUraian: "",
    kjUraian: "",
    pilihanMenjodohkan: [],
    soalMenjodohkan: [],
    jawabanBenar: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formDataFilter, setFormDataFilter] = useState(initialFormDataFilter);
  const [fileSoalWord, setFileSoalWord] = useState();
  const [fileSoalExcel, setFileSoalExcel] = useState();
  const [indexSoalUjian, setIndexSoalUjian] = useState(0);
  const { jadwalUjian } = detailUjianData || {};
  const [buttonStateUnggahSoalExcel, setButtonStateUnggahSoalExcel] =
    useState("idle");
  const [buttonStateUnggahSoalWord, setButtonStateUnggahSoalWord] =
    useState("idle");

  const handleChangeInput = (e, uploadedFile) => {
    setFormData({
      ...formData,
      [e.target.name]: uploadedFile || e.target.value,
    });
  };

  const handlePostImportSoalDataWord = async () => {
    console.log(fileSoalWord?.files?.[0]);
    if (!formData.totalNilaiPg) {
      toast.error("Anda belum memasukkan total nilai pilihan ganda");
      return;
    }
    // else if (!formData.totalNilaiEsai) {
    //   toast.error("Anda belum memasukkan total nilai esai");
    //   return;
    // }
    if (!fileSoalWord?.files?.[0]?.name?.includes("txt")) {
      toast.error("Periksa Kembali tipe file anda");
      return;
    }
    setButtonStateUnggahSoalWord("loading");
    const payload = new FormData();

    payload.append("file", fileSoalWord?.files?.[0]);
    payload.append("m_ujian_id", id);
    payload.append("total_nilai_pg", formData?.totalNilaiPg);
    payload.append("total_nilai_esai", formData?.totalNilaiEsai);

    const { data } = await axios.post(baseURL + "/import-soal-word", payload, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
      },
    });

    if (data) {
      setButtonStateUnggahSoalWord("success");
      toast.success("Berhasil");
      getDetailUjianData();
      hideModal("modalUnggahSoalWord");
      setFileSoalWord({});
    } else {
      setButtonStateUnggahSoalWord("error");
    }
  };

  const handlePostImportSoalData = async () => {
    setButtonStateUnggahSoalExcel("loading");

    const payload = new FormData();

    payload.append("file", fileSoalExcel?.files?.[0]);
    payload.append("m_ujian_id", id);

    const { data } = await axios.post(baseURL + "/soal-ujian/import", payload, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("ss-token"))}`,
      },
    });

    if (data) {
      setButtonStateUnggahSoalExcel("success");
      toast.success("Berhasil");
      getDetailUjianData();
      hideModal("modalUnggahSoalExcel");
      setFileSoalExcel({});
    } else {
      setButtonStateUnggahSoalExcel("error");
    }
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
    const { data } = await getDetailUjian(id, {
      nav: subnav == "riwayat" ? "riwayat" : "",
      tanggal:
        subnav == "riwayat" && formDataFilter?.tanggal != ""
          ? momentPackage(formDataFilter?.tanggal).format("YYYY-MM-DD")
          : "",
      page: subnav == "riwayat" ? page : "",
    });
    if (data) {
      setDetailUjianData(data);
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
      akmKonteksMateri: soal?.akmKonteksMateri || "",
      akmKontenMateri: soal?.akmKontenMateri || "",
      akmProsesKognitif: soal?.akmProsesKognitif || "",
      tingkatKesukaran: soal?.tingkatKesukaran || "",
      sumberBuku: soal?.sumberBuku || "",
      jawabanPgKompleks: soal?.jawabanPgKompleks?.split(","),
      opsiAUraian: soal?.opsiAUraian,
      opsiBUraian: soal?.opsiBUraian,
      kjUraian: soal?.kjUraian,
      jawabanBenar: soal?.jawabanBenar,
    });
    soal?.jawabanA && setPilihanJawabanPG([0]);
    soal?.jawabanB && setPilihanJawabanPG([0, 1]);
    soal?.jawabanC && setPilihanJawabanPG([0, 1, 2]);
    soal?.jawabanD && setPilihanJawabanPG([0, 1, 2, 3]);
    soal?.jawabanE && setPilihanJawabanPG([0, 1, 2, 3, 4]);
    setRubrikKj(JSON.parse(soal?.rubrikKj || initialRubrikKj));
    setPilihanMenjodohkan(soal?.pilihanMenjodohkan);
    setSoalMenjodohkan(soal?.soalMenjodohkan);
    window.$(`#editorPertanyaan`).summernote("destroy");
  };

  const UjianLayout = ({ children }) => {
    return (
      <>
        <UjianHeader />
        {children}
      </>
    );
  };

  const onChangeDropdownFilter = (e) => {
    router.push({
      pathname: `${ssURL}/ujian/${id}`,
      query: {
        nav: e.value,
      },
    });
  };

  const [loadingUserData, setLoadingUserData] = useState(true);

  useEffect(() => {
    if (user?.role == "siswa") {
      router.push(`${ssURL}/jadwal-ujian`);
    } else if (user?.role == "guru") {
      if (detailUjianData?.ujian?.mUserId != user?.id) {
        if (sekolah?.id !== 8025 && sekolah?.id !== 33) {
          router.push(`${ssURL}/ujian`);
        }
        setLoadingUserData(false);
      } else {
        setLoadingUserData(false);
      }
    } else {
      setLoadingUserData(false);
    }
  }, [user]);

  useEffect(() => {
    getDetailUjianData();
  }, [subnav, formDataFilter?.tanggal]);
  useEffect(() => {
    window.MathJax.typesetClear();
    window.MathJax.typeset();
  }, [detailUjianData]);
  return loadingUserData ? (
    "loading"
  ) : (
    <Layout
      modalWrapper={
        <>
          <iframe id="downloadIframe" style={{ display: "none" }}></iframe>
          <ModalBuatSoalUjian
            formData={formData}
            setFormData={setFormData}
            detailUjianData={detailUjianData}
            getDetailUjianData={getDetailUjianData}
            id={id}
            sekolah={sekolah}
          />

          <ModalDownloadKartuSoal id={id} />

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
          <ModalPratinjauSoal
            ujianData={ujian?.soalUjian}
            kontenMateri={kontenMateri}
            prosesKognitif={prosesKognitif}
            konteksMateri={konteksMateri}
          />
          <ModalUnggahSoalUjianExcel
            buttonStateUnggahSoal={buttonStateUnggahSoalExcel}
            fileSoal={fileSoalExcel}
            handlePostImportSoalData={handlePostImportSoalData}
            setFileSoal={setFileSoalExcel}
          />
          <ModalUnggahSoalUjianWord
            buttonStateUnggahSoal={buttonStateUnggahSoalWord}
            fileSoalWord={fileSoalWord}
            handlePostImportSoalDataWord={handlePostImportSoalDataWord}
            setFileSoalWord={setFileSoalWord}
            handleChangeInput={handleChangeInput}
            formData={formData}
            setFormData={setFormData}
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
            <Navbar nav={navbarItems} />
          </div>
          {(subnav == undefined || subnav == "soal") && (
            <div className="col-md-12">
              <NavUjianDetail
                initialFormData={initialFormData}
                navItems={navItems}
                onChangeDropdownFilter={onChangeDropdownFilter}
                setFormData={setFormData}
                nav={nav}
              />
            </div>
          )}
          {/* Nav Jadwal Ujian Detail End */}

          {/* Ujian Detail Content Start*/}
          {subnav == undefined || subnav == "soal" ? (
            <DetailContentUjian
              setFormData={setFormData}
              initialFormData={initialFormData}
              getDetailUjianData={getDetailUjianData}
              handleClickEditSoalUjian={handleClickEditSoalUjian}
              nav={nav}
            />
          ) : (
            <>
              <div className="row d-flex justify-content-end mb-4 p-0">
                <div className="col-lg-3 col-md-6 p-0">
                  <DatePicker
                    className="form-control"
                    autoComplete="off"
                    value={formDataFilter?.tanggal}
                    placeholder="Pilih tanggal"
                    onChange={(date) => {
                      setFormDataFilter({
                        ...formDataFilter,
                        tanggal: date || "",
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-md-12">
                {jadwalUjian?.length ? (
                  jadwalUjian?.map((dataJadwalUjian) => {
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
                      <div className="card-jadwal-ujian card card-ss bg-white rounded-ss p-4 pointer mb-4">
                        <div className="d-flex justify-content-between align-items-md-center flex-column flex-md-row">
                          <div className="d-flex align-items-center justify-content-between flex-wrap order-2 order-md-1 w-100">
                            {/* Jadwal Ujian Label Start */}

                            <div className="d-flex">
                              <div className="jadwal-ujian-label label-ss bg-primary text-white rounded-pill fs-12-ss mb-3 me-2">
                                {ujian?.tipeFormat}
                              </div>
                              {/* Jadwal Ujian Label End */}
                              {/* Label Hasil Ujian Start */}
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
                            </div>

                            {/* Dropdown Option Start */}

                            {/* Dropdown Option End */}
                            {/* Label Hasil Ujian End */}
                          </div>
                        </div>
                        <Link
                          href={`${ssURL}/jadwal-ujian/[id]`}
                          as={`${ssURL}/jadwal-ujian/${dataJadwalUjian?.jadwalUjian?.id}`}
                        >
                          <a className="text-decoration-none">
                            <div className="w-100">
                              <div className="w-75 text-break">
                                <h4 className="color-dark fw-black mb-2">
                                  {ujian?.nama}
                                </h4>
                              </div>
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
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
            </>
          )}
        </div>
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({
  params: { id },
  query: { nav, subnav },
}) {
  return {
    props: {
      id,
      nav: nav || null,
      subnav: subnav || null,
    },
  };
}

export default index;
