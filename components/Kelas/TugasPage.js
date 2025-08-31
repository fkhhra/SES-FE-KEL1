
import React from "react";
import { FaPen, FaRegClock, FaTrashAlt } from "react-icons/fa";
import useUser from "hooks/useUser";
import { momentPackage } from "utilities/HelperUtils";
import { showModal } from "utilities/ModalUtils";
import Tabs from "../Shared/Tabs/Tabs";
import ModalNilaiTugas from "./ModalNilaiTugas";
import InstruksiTugas from "./TugasKuis/InstruksiTugas";
import ProgressSiswa from "./TugasKuis/ProgressSiswa";
import Jawaban from "./TugasKuis/Jawaban";
import ModalTugas from "./ModalTugas/ModalTugas";
import useEditModal from "hooks/useEditModal";
import ModalKerjakanTugas from "./ModalKerjakanTugas";
import moment from "moment";
import ctl from "@netlify/classnames-template-literals";
import router from "next/router";
import { ssURL } from "client/clientAxios";

const TugasPage = ({ detailData, _getDetailTimeline, detailRombel, disabled, kelasId, materiId }) => {
  const { user } = useUser();
  const { setEditModal } = useEditModal();

  const onClickEdit = () => {
    setEditModal("modalBuatTugas", detailData);
    window.$(`#instruksi-tugas-editor`).summernote("code", detailData?.tugas?.instruksi); // to set editor value instruksi tugas in ModalTugas.js -> IsiInformasiSoal.js
  }

  const navItemsPertemuan = [
    {
      id: "instruksi-tugas",
      nav: "Instruksi Tugas",
      active: true,
      dataJoyride: "instruksi-tugas",
      isVisible: true,
      content: (
        <InstruksiTugas
          detailData={detailData}
          showPratinjauSoal={false}
          showBtnKerjakanTugas={user?.role === "siswa" ? { onClick: () => showModal("modalKerjakanTugas") } : false}
          _getDetailTimeline={_getDetailTimeline}
        />
      ),
    },
    {
      id: "progres-siswa",
      nav: "Progres Siswa",
      active: false,
      dataJoyride: "progres-siswa",
      isVisible: user?.role === "guru",
      content: <ProgressSiswa detailData={detailData} />,
    },
    {
      id: "jawaban",
      nav: "Jawaban",
      active: false,
      dataJoyride: "jawaban",
      isVisible: user?.role === "siswa",
      content: <Jawaban detailData={detailData} />,
    },
  ].filter(({ isVisible }) => isVisible);

  const tanggalPengumpulan = detailData?.tugas?.tanggalPengumpulan || detailData?.timeline?.tugas?.tanggalPengumpulan;
  const waktuPengumpulan = detailData?.tugas?.waktuPengumpulan || detailData?.timeline?.tugas?.waktuPengumpulan;

  const tugasStatusCN = ctl(`
    rounded-ss px-4 py-2 text-white fs-14-ss
    ${
      (!tanggalPengumpulan || moment(moment(tanggalPengumpulan).add(7, "hours").format("YYYY-MM-DD ") + waktuPengumpulan ) < moment())
        ? "bg-secondary"
        : "bg-danger shadow-danger-ss"
    }
  `);

  const getBatasPengumpulanText = () => {
    if (tanggalPengumpulan) {
      return moment(moment(tanggalPengumpulan).add(7, "hours").format("YYYY-MM-DD ") + waktuPengumpulan).fromNow();
    } else {
      return "Tidak Ada";
    }
  }

  const onClickBacaMateri = () => {
    router.replace(`${ssURL}/kelas/${kelasId}/kegiatan/${materiId}?hal=materi`)
  }

  return (
    <div className="card card-ss p-4 pb-5 mb-4">
      
      { disabled
        ? <div className="d-flex justify-content-center flex-column align-items-center">
          <img src="/img/empty-state-tugas-kegiatan.svg" style={{ width: "217px", height: "175px" }} />
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h5 className="color-dark fw-black" style={{ marginBottom: "5px" }}>Anda Belum Membaca Materi</h5>
            <p className="color-secondary fw-bold fs-14-ss">Harap <span onClick={() => onClickBacaMateri()} className="color-primary pointer">baca materi</span> terlebih dahulu agar dapat mengerjakan tugas</p>
            <div onClick={() => onClickBacaMateri()} className="bg-primary pointer rounded-pill text-white justify-content-center align-items-center fw-semibold px-4 py-1 fs-14-ss shadow-primary-ss hover-shadow-none fs-18-ss" style={{ width: "min-content", whiteSpace: "nowrap" }}>
              Baca Materi
            </div>
          </div>
        </div>
        : <>
          <div className="d-flex align-items-center justify-content-between" style={{ borderBottom: "1px solid #E1E1E7", margin: "0 -24px", padding: "0 24px 24px 24px", marginBottom: "24px" }}>
            <div className={tugasStatusCN}>
              <FaRegClock className="me-2" />
              {`Batas Pengumpulan ${getBatasPengumpulanText()}`}
            </div>

              {/* Dropdown Option Start */}
              <div className="dropdown dropdown-ss mb-md-0 mb-2 d-flex justify-content-end">
                {(user?.role == "guru" || user?.role == "admin") && (
                  <div
                    role="button"
                    id="dropdownMenuLink"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img src={`/img/icon-dropdown-option.svg`} alt="icon-option" />
                  </div>
                )}
                <ul
                  className="dropdown-menu dropdown-menu-ss my-1"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li  data-bs-toggle="modal" data-bs-target="#modalBuatTugas" onClick={() => onClickEdit()}>
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
          
            
            <div className="d-flex align-items-center justify-content-md-between mb-4 flex-md-row flex-column">
              <div className="d-flex align-items-center flex-md-row flex-column text-break">
                <img
                  src={`/img/icon-kegiatan-tugas.svg`}
                  alt="icon-kegiatan-tugas"
                  width="86px"
                  height="86px"
                />
                <div className="text-md-start text-center ms-md-4 mt-md-0 mt-4">
                  <p className="color-secondary mb-2">
                    {`Kegiatan - ${momentPackage(detailData?.tugas?.tanggalPembagian || detailData?.timeline?.tugas?.tanggalPembagian).format("DD MMMM YYYY")}`}
                  </p>
                  <h2 className="color-dark fw-black mb-0">
                    {`Tugas - ${detailData?.tugas?.judul || detailData?.timeline?.tugas?.judul}`}
                  </h2>
                </div>
              </div>
            </div>

            <Tabs navItems={navItemsPertemuan} />

            <ModalTugas
              _getDetailTimeline={_getDetailTimeline}
              modalTugasType="tugas"
              detailRombel={detailRombel}
            />
            {user?.role == "guru" ? (
              <ModalNilaiTugas
                timeline={detailData}
                _getDetailTimeline={_getDetailTimeline}
                listSiswaTerkumpul={[...detailData?.listSiswaTerkumpul, ...detailData?.listSiswaDinilai]}
              />
            ):null}
            <ModalKerjakanTugas
              detailData={detailData}
              _getDetailTimeline={_getDetailTimeline}
            />
        </>
      }
      
    </div>
  );
};

export default TugasPage;
