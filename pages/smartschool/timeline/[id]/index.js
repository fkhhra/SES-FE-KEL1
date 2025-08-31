import { uploadString } from "client/uploadFileClient";
import CanvasDraw from "components/Shared/CanvasDraw/CanvasDraw";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaFile, FaPaperclip, FaTimes } from "react-icons/fa";
import TextareaAutosize from "react-textarea-autosize";
import ReactiveButton from "reactive-button";
import { getFileType } from "utilities/FileViewer";
import {
  editTimeline,
  getDetailTimeline,
  postTkTimelineKomen,
} from "../../../../client/TimelineClient";
import Layout from "../../../../components/Layout/Layout";
import AnimatePage from "../../../../components/Shared/AnimatePage/AnimatePage";
import InputFile from "../../../../components/Shared/InputFile/InputFile";
import MyJoyride from "../../../../components/Shared/MyJoyride/MyJoyride";
import NewModal from "../../../../components/Shared/NewModal/NewModal";
import WhatsappLink from "../../../../components/Shared/WhatsappLink/WhatsappLink";
import PertemuanPage from "../../../../components/Timeline/PertemuanPage";
import TugasPage from "../../../../components/Timeline/TugasPage";
import useAbsenSiswa from "../../../../hooks/useAbsenSiswa";
import useTugasSiswa from "../../../../hooks/useTugasSiswa";
import useUser from "../../../../hooks/useUser";
import { momentPackage } from "../../../../utilities/HelperUtils";
import { hideModal } from "../../../../utilities/ModalUtils";

const initialFormData = {
  tingkat: "",
  mJurusanId: "",
  mUserId: "",
  kode: "",
  rpp: [],
  nilai: 0,
  komen: "",
};

const index = ({ id, hal }) => {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [buttonState, setButtonState] = useState("idle");
  const [buttonRPP, setButtonRPP] = useState("idle");
  const [modalType, setModalType] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [lampiran, setLampiran] = useState([]);
  const [edit, setEdit] = useState({});
  const [uploading, setUploading] = useState(false);

  const { tugasSiswa, setTugasSiswa } = useTugasSiswa();
  const { absenSiswa } = useAbsenSiswa();

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    router.back();
  };

  const handlePutNilaiSiswa = async () => {
    setButtonRPP("loading");
    const { data, isSuccess } = await editTimeline(tugasSiswa?.id, {
      ...formData,
      tipe: "nilai",
    });

    if (isSuccess) {
      toast.success(data?.message);
      setButtonState("success");
      getDetailTimelineData();
      setFormData(initialFormData);
    } else {
      setButtonState("error");
    }
  };

  const postKomentarPribadi = async () => {
    if (formData?.komen) {
      const payload = {
        tkTimelineId: tugasSiswa?.id,
        komen: formData?.komen,
      };
      const { data } = await postTkTimelineKomen(payload);
      if (data) {
        setFormData(initialFormData);
        getDetailTimelineData();
      }
    }
  };

  const handleAbsensi = async (absen = null, siswa) => {
    const payload = {
      tipe: "absen",
      absen: absen ? absen : modalType,
      keterangan: keterangan,
      waktuAbsen: momentPackage().format("YYYY-MM-DD HH:mm:ss"),
      lampiran: lampiran,
    };
    if (siswa) {
      payload.siswaId = siswa.siswaId;
      payload.tkId = siswa.tkId;
    }
    const { data } = await editTimeline(
      siswa ? timeline?.timeline?.id : timeline?.id,
      payload
    );
    if (data) {
      toast.success(data?.message);
      getDetailTimelineData();
    }
  };

  const handleChangeInputFile = async (e, data) => {
    if (data) {
      setLampiran([...lampiran, data]);
    }
  };

  const deleteLampiran = (lampiranData) => {
    const modifiedLampiran = lampiran?.filter((val) => val !== lampiranData);
    setLampiran([...modifiedLampiran]);
  };

  const [timelineData, setTimelineData] = useState({});
  const { timeline } = timelineData;
  const getDetailTimelineData = async () => {
    const { data } = await getDetailTimeline(id);

    if (data) {
      setFormData({
        ...formData,
        rpp: data?.timeline?.rpp,
      });
      setTimelineData(data);
      setTugasSiswa(
        data?.timeline?.listSiswaTerkumpul?.find((d) => d.id == tugasSiswa?.id)
      );
    }
  };

  const handleSave = async (data, nama, idx) => {
    setUploading(true);
    const ext = getFileType(tugasSiswa?.lampiran[idx]);
    const url = await uploadString(`${nama}.${ext}`, data);
    if (url) {
      setUploading(false);
    }

    let lampiran = tugasSiswa?.lampiran;
    lampiran?.splice(idx, 1, url);
    await editTimeline(tugasSiswa?.id, {
      tipe: "tugas",
      lampiran,
    });
  };

  useEffect(() => {
    getDetailTimelineData();
  }, []);

  const steps = [];

  if (user?.role == "guru") {
    steps.push(
      {
        target: '[data-joyride="informasi"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi Pertemuan</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini anda dapat melihat seluruh informasi mengenai
              pertemuan hari ini.
            </p>
          </div>
        ),
        disableBeacon: true,
      },
      {
        target: '[data-joyride="absen-siswa"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Absen Siswa</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini anda dapat melihat aktivitas absensi siswa. Akan
              tampil informasi terkait absensi seperti siapa saja siswa yang
              hadir, sakit, izin, ataupun alpa.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="rpp-jurnal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">RPP dan Jurnal</h5>
            <p className="color-secondary fw-semibold">
              Pada menu ini anda dapat mengumpulkan RPP dan menuliskan jurnal
              terkait pertemuan hari ini.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="informasi-absen"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi Absen</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat melihat informasi mengenai absensi siswa hari ini,
              berapa jumlah siswa yang hadir, sakit, izin dan juga alpa.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="btn-tatap-muka"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">
              Ingin Melakukan Tatap Muka Dengan Siswa?
            </h5>
            <p className="color-secondary fw-semibold">
              Klik tombol tatap muka untuk bertatap muka dengan siswa anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="rpp"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">RPP</h5>
            <p className="color-secondary fw-semibold">
              Unggah file RPP anda disini lalu kumpulkan, agar kurikulum dapat
              bisa melihat rencana pelaksanaan pembelajaran yang anda buat.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="jurnal"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Jurnal</h5>
            <p className="color-secondary fw-semibold">
              Tulis jurnal harian mengenai kegiatan pada pertemuan hari ini,
              untuk melaporkan kegiatan pembelajaran yang anda lakukan di kelas
              kepada kurikulum.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="instruksi-tugas"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Instruksi Tugas</h5>
            <p className="color-secondary fw-semibold">
              Anda dapat melihat informasi mengenai tugas yang anda berikan di
              kelas anda.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="progres-siswa"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Progres Siswa</h5>
            <p className="color-secondary fw-semibold">
              Untuk melihat progres siswa dalam mengerjakan tugas anda dapat
              melihat melalui menu ini. Disini akan tampil siapa aja yang sudah
              dan juga yang belum mengumpulkan tugas.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="informasi-tugas"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Informasi Tugas</h5>
            <p className="color-secondary fw-semibold">
              Informasi secara singkat mengenai tugas yang diberikan dan juga
              mengenai progres pengerjaan tugas dari siswa.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="lampiran-pelajaran"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Lampiran Pelajaran</h5>
            <p className="color-secondary fw-semibold">
              Lampiran file file pendukung yang anda berikan kepada siswa anda
              untuk mengerjakan tugas yang diberikan.
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="tugas-belum"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Belum Selesai</h5>
            <p className="color-secondary fw-semibold">
              Daftar tugas siswa yang belum selesai
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="tugas-terkumpul"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Terkumpul</h5>
            <p className="color-secondary fw-semibold">
              Daftar tugas siswa yang sudah terkumpul
            </p>
          </div>
        ),
      },
      {
        target: '[data-joyride="tugas-dinilai"]',
        content: (
          <div className="text-start">
            <h5 className="color-dark fw-black">Tugas Dinilai</h5>
            <p className="color-secondary fw-semibold">
              Daftar tugas siswa yang sudah dinilai
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
          <div
            className="modal modal-ss fade"
            id="modalNilaiTugas"
            tabIndex="-1"
            aria-labelledby="modalNilaiTugasLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header p-3">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                          <div
                            className="modal-title d-flex flex-column col-md-6 order-2 order-md-1"
                            id="modalNilaiTugasLabel"
                          >
                            <h6 className="mb-2 fw-extrabold fs-14-ss">
                              {timeline?.tugas?.judul}
                            </h6>

                            {/* Dropdown Nama Siswa Start */}

                            <div className="dropdown dropdown-ss dropdown-nama-nilai-tugas">
                              <div
                                className="btn btn-light bg-light dropdown-toggle d-flex align-items-center justify-content-between flex-wrap w-100 rounded-ss"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {" "}
                                <div className="">
                                  <p className="mb-0 fw-bold color-dark">
                                    {tugasSiswa?.user?.nama?.substring(0, 20)}
                                    ...
                                  </p>
                                </div>
                                <span className="fs-12-ss fw-bold color-secondary ms-md-auto">
                                  Mengumpulkan
                                </span>
                              </div>
                              {/* <ul
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                              >
                                <li>
                                  <a className="dropdown-item" >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="flex-grow-1 flex-wrap">
                                        <p className="mb-0">
                                          Lorem Ipsum dolor...
                                        </p>
                                      </div>
                                      <span className="py-0 color-secondary fs-14-ss fw-bold">
                                        Mengumpulkan
                                      </span>
                                    </div>
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="flex-grow-1 flex-wrap">
                                        <p className="mb-0">
                                          Lorem Ipsum dolor...
                                        </p>
                                      </div>
                                      <span
                                        className="py-0 px-3 color-danger bg-soft-danger rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center"
                                        style={{
                                          width: "50px",
                                          height: "20px",
                                        }}
                                      >
                                        70
                                      </span>
                                    </div>
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" >
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="flex-grow-1 flex-wrap">
                                        <p className="mb-0">
                                          Lorem Ipsum dolor...
                                        </p>
                                      </div>
                                      <span
                                        className="py-0 px-3 color-success bg-soft-success rounded-pill fs-14-ss fw-bold d-flex justify-content-center align-items-center"
                                        style={{
                                          width: "50px",
                                          height: "20px",
                                        }}
                                      >
                                        100
                                      </span>
                                    </div>
                                  </a>
                                </li>
                              </ul> */}
                            </div>

                            {/* Dropdown Nama Siswa End */}
                          </div>
                          <div className="order-1 order-md-2 d-flex d-md-inline justify-content-end m-md-0 m-2">
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => hideModal("modalNilaiTugas")}
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-8">
                        {/* Card Jawaban Siswa Start*/}
                        <div
                          className="card card-ss rounded-ss p-4 mb-md-0 mb-4"
                          style={{
                            minHeight: "455px",
                          }}
                        >
                          <h4 className="mb-4 fw-extrabold color-dark">
                            Jawaban Tugas
                          </h4>

                          {/* <p
                            dangerouslySetInnerHTML={{
                              __html: tugasSiswa?.keterangan,
                            }}
                          ></p> */}
                          <p>{tugasSiswa?.keterangan}</p>

                          {/* Lampiran Tugas Biasa Start */}
                          {tugasSiswa?.lampiran?.map((lampiran, idx) => {
                            const type = getFileType(lampiran);
                            if (
                              ["PNG", "JPEG", "JPG"].includes(
                                type?.toUpperCase()
                              )
                            ) {
                              if (edit?.[`gambar-${idx}`]) {
                                return (
                                  <>
                                    <div className="position-relative">
                                      <CanvasDraw
                                        id={`image-${idx}`}
                                        img={lampiran}
                                        key={`${idx}-${new Date().getTime()}`}
                                        handleSave={(data) =>
                                          handleSave(data, "edit-guru", idx)
                                        }
                                        disableSave={uploading}
                                      />
                                      <div
                                        className="d-flex justify-content-end position-absolute"
                                        style={{
                                          bottom: "0",
                                          left: "0",
                                        }}
                                      >
                                        <button
                                          className="btn btn-ss btn-outline-secondary btn-outline-secondary-ss border-light-secondary-ss border-2 fw-semibold rounded-pill me-3"
                                          onClick={() =>
                                            setEdit({
                                              ...edit,
                                              [`gambar-${idx}`]: false,
                                            })
                                          }
                                        >
                                          Kembali
                                        </button>
                                      </div>
                                    </div>
                                    <hr className="hr-ss my-4" />
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div>
                                      <img
                                        src={lampiran}
                                        alt={`tugas-${idx}`}
                                        height={500}
                                        width={"100%"}
                                        className="img-fit-contain mb-3"
                                      />
                                      <div className="d-flex justify-content-end">
                                        <button
                                          className="btn btn-ss btn-primary btn-primary-ss rounded-pill shadow-primary-ss d-md-block d-none"
                                          onClick={() =>
                                            setEdit({
                                              ...edit,
                                              [`gambar-${idx}`]: true,
                                            })
                                          }
                                        >
                                          Coret Gambar
                                        </button>
                                      </div>
                                      <hr className="hr-ss my-4" />
                                    </div>
                                  </>
                                );
                              }
                            }
                            return (
                              <a
                                href={lampiran}
                                target="_blank"
                                className="bg-soft-primary p-3 rounded-ss mb-3"
                              >
                                <div className="file-content d-flex align-items-center flex-wrap">
                                  <div
                                    className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                    }}
                                  >
                                    <FaFile />
                                  </div>
                                  <div className="p-2 d-flex flex-column">
                                    <p className="fw-bold color-dark mb-1">
                                      {lampiran}
                                    </p>
                                    {/* <p className="fs-12-ss fw-bold color-secondary mb-0">
                                  PDF
                                </p> */}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>

                        <div className="card card-ss rounded-ss p-4 mt-4 mt-lg-0">
                          <h6 className="fs-18-ss fw-bold color-dark mb-3">
                            Komentar Pribadi ( {tugasSiswa?.komen?.length} )
                          </h6>
                          {tugasSiswa?.komen?.map((komen) => (
                            <div className="row">
                              <div className="col-md-12">
                                <div className="comment-items d-flex">
                                  <div className="ava me-3">
                                    <img
                                      src={
                                        komen?.user?.avatar
                                          ? `${komen?.user?.avatar}`
                                          : `/img/avatar.svg`
                                      }
                                      width={50}
                                      height={50}
                                    />
                                  </div>
                                  <div className="comment-content">
                                    <div>
                                      <p className="fw-14-ss fw-bold color-dark mb-0 me-2 d-inline">
                                        {komen?.user?.nama}
                                      </p>
                                      <span className="color-secondary fw-semibold fs-12-ss">
                                        {komen?.createdAt}
                                      </span>
                                    </div>
                                    <p className="fw-14-ss color-secondary mb-2">
                                      {komen?.komen}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="row justify-content-end mt-3 comment-input">
                            <div className="col-11 me-md-3 ms-5 ms-md-0 ps-md-0 ps-5">
                              <div className="comment-items d-flex">
                                <div className="ava me-3 d-md-inline d-none">
                                  <img
                                    src={`/img/avatar.svg`}
                                    width={50}
                                    height={50}
                                  />
                                </div>
                                <div className="flex-grow-1 rounded-ss border border-secondary border-light-secondary-ss position-relative p-2 pe-5">
                                  <TextareaAutosize
                                    className="textarea-auto"
                                    style={{
                                      resize: "none",
                                      width: "100%",
                                      border: "none",
                                    }}
                                    placeholder="Tuliskan komentar..."
                                    name="komen"
                                    onChange={handleChangeForm}
                                    value={formData?.komen}
                                  />
                                  <button
                                    className="border-0 btn position-absolute pe-2"
                                    style={{
                                      bottom: "5%",
                                      right: "0",
                                    }}
                                    onClick={postKomentarPribadi}
                                  >
                                    <img
                                      src={`/img/btn-submit-comment.svg`}
                                      alt="button-submit-comment"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Jawaban Siswa End*/}
                      </div>
                      <div className="col-lg-4 position-relative">
                        {/* Card Penilaian Start */}

                        <div className="card card-ss rounded-ss p-4 card-penilaian-tugas mt-4 mt-lg-0">
                          <h4 className="mb-4 fw-extrabold color-dark">
                            Penilaian
                          </h4>
                          <div className="bg-soft-success rounded-ss px-4 py-3 mb-3">
                            <p className="fs-14-ss color-secondary mb-1">
                              Dikumpulkan Pada
                            </p>
                            <h6 className="fs-18-ss color-dark fw-bold mb-0">
                              {tugasSiswa?.updatedAt}
                            </h6>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="nilai" className="form-label">
                              Nilai
                            </label>
                            <input
                              className="form-control"
                              autoComplete="off"
                              name="nilai"
                              type="number"
                              value={formData?.nilai}
                              id="nilai"
                              placeholder="Berikan Nilai"
                              onChange={(e) => handleChangeForm(e)}
                            />
                          </div>
                          <ReactiveButton
                            buttonState={buttonState}
                            color={"primary"}
                            idleText={"Berikan Nilai"}
                            loadingText={"Diproses"}
                            successText={"Berhasil"}
                            errorText={"Gagal"}
                            type={"button"}
                            data-bs-dismiss="modal"
                            className={
                              "btn btn-primary bg-gradient-primary py-2 w-100 rounded-pill d-flex justify-content-center align-items-center fs-18-ss fw-bold"
                            }
                            onClick={() => handlePutNilaiSiswa()}
                          />
                        </div>
                        {/* Card Penilaian Start */}

                        {/* Card Penilaian End */}
                        <WhatsappLink
                          phoneNumber={tugasSiswa?.user?.whatsapp}
                          text={`Halo nak ${tugasSiswa?.user?.nama}, tugas yang berjudul *${timeline?.tugas?.judul}* masih belum sesuai. Tolong direvisi kembali`}
                        >
                          <button className="btn-pengembalian-tugas bg-soft-primary shadow-primary-ss rounded-ss p-3 w-100 mt-3 border-0">
                            <div className="d-flex align-items-center">
                              <img
                                src={`/img/icon-kembalikan-tugas.svg`}
                                alt="icon-kembalikan-tugas"
                              />
                              <span className="fs-18-ss fw-bold color-dark mb-0 ms-2">
                                Kembalikan Tugas
                              </span>
                            </div>
                          </button>
                        </WhatsappLink>

                        {/* Card Penilaian End */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NewModal
            modalId="keteranganAbsen"
            title={absenSiswa?.user?.nama}
            content={
              <>
                <h6 className="fs-18-ss fw-bold color-dark mb-2">
                  Keterangan {absenSiswa?.absen}
                </h6>
                <p className="color-secondary fw-semibold mb-4 fs-14-ss">
                  Dikirim pada {absenSiswa?.createdAt}
                </p>
                <p className="color-secondary">{absenSiswa?.keterangan}</p>
                {absenSiswa?.lampiran?.map((lampiran) => {
                  return (
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
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            }
            submitButton={
              <WhatsappLink
                phoneNumber={absenSiswa?.user?.whatsapp}
                text={`Absensi sudah saya terima, tanggal ${absenSiswa?.createdAt} presensi kamu *${absenSiswa?.absen}* dengan keterangan *${absenSiswa?.keterangan}* Terimakasih`}
              >
                <button className="btn btn-primary">Verifikasi</button>
              </WhatsappLink>
            }
          />
          <NewModal
            modalId="modal-absen-izin-sakit"
            title={
              <>
                <h4 className="fs-18-ss mb-0 fw-bold">
                  Absen {modalType === "izin" ? "Izin" : "Sakit"}
                </h4>
              </>
            }
            content={
              <div>
                <h6 className="fw-bold color-dark mb-3">
                  {modalType === "izin"
                    ? "Kirimkan Bukti Keterangan Izin"
                    : "Kirimkan Bukti Keterangan Sakit atau Surat Dokter"}
                </h6>
                <TextareaAutosize
                  className="form-control"
                  autoComplete="off"
                  style={{
                    resize: "none",
                    width: "100%",
                  }}
                  placeholder="Tuliskan keterangan absen izin"
                  minRows={3}
                  onChange={(e) => setKeterangan(e.target.value)}
                />
                <div className="d-flex justify-content-between align-items-center mb-3 mt-4 flex-wrap">
                  <h6 className="mt-0 fw-bold color-dark">Lampiran</h6>
                  <div className="d-flex align-items-md-center flex-md-row flex-column justify-content-between">
                    <label
                      htmlFor="lampiranTimeline"
                      className="btn btn-ss fs-12-ss btn-outline-secondary btn-outline-secondary-ss rounded-pill fw-bold form-label"
                    >
                      <FaPaperclip className="me-2" />
                      Unggah File
                    </label>
                    <InputFile
                      name="lampiranTimeline"
                      id="lampiranTimeline"
                      onChange={handleChangeInputFile}
                    />
                  </div>
                </div>
                {lampiran?.map((dataLampiran, idx) => (
                  <div
                    className="card-lampiran-materi border-light-secondary rounded-ss mb-3"
                    key={`${idx}-${new Date().getTime()}`}
                  >
                    <div className="d-flex justify-content-between align-items-md-center flex-wrap flex-md-row flex-column">
                      <div className="d-flex align-items-center flex-wrap">
                        <div className="pdf-icon ms-0 m-2 shadow-primary-ss">
                          <FaFile className="text-white fs-3" />
                        </div>
                        <div className="p-2">
                          <p className="fw-bold color-dark mb-0">
                            {dataLampiran}
                          </p>
                          <span className="fs-12-ss color-secondary fs-12-ss fw-bold">
                            {/* PDF */}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center ps-md-2 pt-md-2 pb-md-2 pe-0 pt-3 p-0">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-3 btn-pratinjau-file rounded-pill fs-12-ss fw-bold d-flex justify-content-center align-items-center"
                        >
                          Pratinjau
                        </button>
                        <FaTimes
                          className="text-secondary pointer"
                          onClick={() => deleteLampiran(dataLampiran)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
            submitButton={
              <ReactiveButton
                buttonState={buttonState}
                color={"primary"}
                idleText={"Absen"}
                loadingText={"Diproses"}
                successText={"Berhasil"}
                errorText={"Gagal"}
                type={"button"}
                className={"btn btn-primary"}
                onClick={handleAbsensi}
              />
            }
          />
          <NewModal
            modalId="modal-bukti-keterangan"
            title={
              <>
                <h4 className="fs-18-ss mb-0 fw-bold">{user?.nama}</h4>
              </>
            }
            content={
              <div>
                <div className="mb-3">
                  <h6 className="fw-bold color-dark mb-3">Keterangan Izin</h6>
                  <span className="fs-6 color-secondary">
                    {timeline?.waktuAbsen}
                  </span>
                </div>
                <div className="post-content mt-4">
                  <p className="color-secondary">{timeline?.keterangan}</p>
                </div>
                <h6 className="mt-0 fw-bold color-dark mb-3">Lampiran</h6>
                {timeline?.lampiran?.length > 0 &&
                  timeline?.lampiran?.map((lampiranData, idx) => (
                    <a
                      key={`${idx}-${new Date().getTime()}`}
                      href={`${lampiranData}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <div className="bg-soft-primary p-3 rounded-ss mb-3">
                        <div className="file-content d-flex align-items-center flex-wrap">
                          <div
                            className="rounded-circle bg-primary shadow-primary-ss d-flex justify-content-center align-items-center text-white fs-3 p-2"
                            style={{
                              width: "48px",
                              height: "48px",
                            }}
                          >
                            <FaFile />
                          </div>
                          <div className="p-2 d-flex flex-column">
                            <p className="fw-bold color-dark mb-1">
                              {lampiranData}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
              </div>
            }
          />
        </>
      }
    >
      <AnimatePage>
        <MyJoyride steps={steps} />
        {timeline?.tipe == "absen" && (
          <PertemuanPage
            id={id}
            setModalType={setModalType}
            handleAbsensi={handleAbsensi}
            timelineDataProps={timelineData}
          />
        )}
        {timeline?.tipe == "tugas" && (
          <TugasPage
            id={id}
            timelineDataProps={timelineData}
            getDetailTimelineData={getDetailTimelineData}
          />
        )}
      </AnimatePage>
    </Layout>
  );
};

export async function getServerSideProps({ params: { id }, query: { hal } }) {
  return {
    props: {
      id,
      hal,
    },
  };
}

export default index;
