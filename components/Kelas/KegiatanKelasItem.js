import { ssURL } from "client/clientAxios";
import { deleteTimeline } from "client/TimelineClient";
import useEditModal from "hooks/useEditModal";
import { momentPackage } from "utilities/HelperUtils";
import {
  FaClock,
  FaClone,
  FaPen,
  FaTrashAlt,
} from "react-icons/fa";

import useBuatTugas from "hooks/useBuatTugas";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import toast from "react-hot-toast";
import swal from "sweetalert";

const KegiatanKelasItem = ({
  id,
  type,
  isGuru,
  data,
  getDetailRombelData,
  setModalTugasType,
  disabled,
  showDropdownAction=true
}) => {

  const kegiatanKelasId = type === "materi" ? data?.materiId : data?.id;
  const { meta } = data || {};
  const { totalAbsen, totalSiswa, totalRespon } = meta || {}

  const { setEditModal } = useEditModal();
  const { setIsDuplikatTugas } = useBuatTugas();

  const getCountData = () => {
    if (type === "tatap-maya") {
      return `${totalAbsen} / ${totalSiswa}`
    }
    
    if (type === "tugas" || type === "tugas-kuis") {
      return `${totalRespon} / ${totalSiswa}`
    }

    if (type === "materi") {
      return `${data?.sudahBaca} / ${data?.anggotaRombel?.length}`
    }

    return null
  }

  const getCountClasses = () => {
    if (type === "tatap-maya") {
      if (totalAbsen === 0) {
        return "bg-soft-danger color-danger"
      } else if (totalAbsen > 0 && totalAbsen !== totalSiswa) {
        return "bg-soft-primary color-primary"
      } else {
        return "bg-soft-success color-success";
      }
    }

    if (type === "tugas" || type === "tugas-kuis") {
      if (totalRespon === 0) {
        return "bg-soft-danger color-danger"
      } else if (totalRespon > 0 && totalRespon !== totalSiswa) {
        return "bg-soft-primary color-primary"
      } else {
        return "bg-soft-success color-success";
      }
    }

    if (type === "materi") {
      if (data?.sudahBaca === 0) {
        return "bg-soft-danger color-danger"
      } else if (data?.sudahBaca > 0 && data?.sudahBaca !== data?.anggotaRombel?.length) {
        return "bg-soft-primary color-primary"
      } else {
        return "bg-soft-success color-success";
      }
    }
  }

  const getLinkDetail = () => {
    let url = `${ssURL}/kelas/${id}/kegiatan/${kegiatanKelasId}`;

    if (disabled) {
      return `${ssURL}/kelas/${id}/kegiatan`;
    }

    if (type === "tatap-maya") {
      return url + "?hal=pertemuan";
    } else if (type === "tugas-kuis") {
      return url + "?hal=tugas-kuis";
    } else if (type === "tugas") {
      return url + "?hal=tugas";
    } else if (type === "materi") {
      return url + "?hal=materi";
    }

    return url;
  }

  const getModalId = () => {
    switch (type) {
      case "tatap-maya":
        return "ModalBuatPertemuan";
      case "materi":
        return "ModalBagikanMateri";
      case "tugas":
      case "tugas-kuis":
        return "modalBuatTugas";
      default:
        return;
    }
  }

  const onClickEdit = () => {
    const modalId = getModalId();
    if (type.includes("tugas")) {
      setIsDuplikatTugas(false);
      setModalTugasType(type === "tugas-kuis" ? "kuis" : type); // set type modal tugas
      window.$(`#instruksi-tugas-editor`).summernote("code", data?.tugas?.instruksi); // to set editor value instruksi tugas in ModalTugas.js -> IsiInformasiSoal.js
    }
    setEditModal(modalId, data);
  }

  const onClickDuplikatTugas = () => {
    setIsDuplikatTugas(true);
    setModalTugasType(type === "tugas-kuis" ? "kuis" : type);
    window.$(`#instruksi-tugas-editor`).summernote("code", data?.tugas?.instruksi);
    setEditModal("modalBuatTugas", data);
  }

  const deleteKegiatan = async () => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { isSuccess, data } = await deleteTimeline(kegiatanKelasId);
        if (isSuccess) {
          toast.success(data?.message);
          getDetailRombelData();
        }
      }
    });
  }

  const isDone = () => {
    switch (type) {
      case "tatap-maya":
        return !isEmpty(data?.absen);
      case "materi":
        return data?.meta?.totalKesimpulan > 0;
      case "tugas":
        return data?.dikumpulkan === 1;
      case "tugas-kuis":
        return data?.peserta?.length > 0
      default:
        return false
    }
  }

  const getKegiatanTitle = () => {
    const tugasJudul = data?.tugas?.judul || data?.timeline?.tugas?.judul;

    switch (type) {
      case "tatap-maya":
        return "Tatap Maya";
      case "materi":
        return `Materi - ${data?.bab?.judul}`;
      case "tugas":
        return `Tugas - ${tugasJudul}`;
      case "tugas-kuis":
        return `Tugas Kuis - ${tugasJudul}`;
    }
  }

  const getKegiatanSubTitle = () => {
    const tanggalPengumpulan = data?.tugas?.tanggalPengumpulan || data?.timeline?.tugas?.tanggalPengumpulan;
    const waktuPengumpulan = data?.tugas?.waktuPengumpulan || data?.timeline?.tugas?.waktuPengumpulan;

    switch (type) {
      case "materi":
        return `BAB ${data?.babNumber} - ${data?.judul}`;
      case "tugas":
      case "tugas-kuis":
        return disabled
            ? "Belum Membaca Materi"
            : <>
            <FaClock className="me-2 mb-1" />
            { (tanggalPengumpulan)
              ? `Batas Pengumpulan ${momentPackage(momentPackage(tanggalPengumpulan).add(7, "hours").format("YYYY-MM-DD ") + (waktuPengumpulan)).fromNow()}`
              : "Batas Pengumpulan Tidak Ada"
            }
          </>
    }
  }

  const getIconSource = () => {
    switch (type) {
      case "tatap-maya":
        return "/img/icon-kegiatan-tatap-maya.svg";
      case "materi":
        return "/img/icon-kegiatan-materi.svg";
      case "tugas":
      case "tugas-kuis":
        return disabled ? "/img/icon-kegiatan-tugas-disabled.svg" : "/img/icon-kegiatan-tugas.svg";
      default:
        break;
    }
  }

  return (
    <div className={`kegiatan-items py-3 pointer rounded-ss mb-4 px-4 ${disabled ? "disabled" : ""}`}>
      <div className="row">
        <div className="col-lg-9 mb-lg-0 mb-5">
          <Link
            href={getLinkDetail()}
          >
            <a className="text-decoration-none">
              <div className="d-flex align-items-md-center flex-lg-nowrap flex-wrap flex-md-row flex-column">
                <img
                  src={getIconSource()}
                  alt="icon-kegiatan"
                  width="50px"
                  height="50px"
                  className="me-lg-3 mb-lg-0 mb-4"
                />
                <div className="w-100">
                  <h6
                    className={`fs-18-ss color-dark fw-bold text-truncate ${
                      type == "tatap-maya" ? "mb-0" : "mb-1"
                    }`}
                  >
                    {getKegiatanTitle()}
                  </h6>
                  <p
                    className={`
                      fs-14-ss fw-semibold color-secondary text-truncate mb-0
                      ${type == "tugas" || type == "tugas-kuis"
                        ? data?.tugas?.tanggalPengumpulan || data?.timeline?.tugas?.tanggalPengumpulan
                        ? "color-danger"
                        : "color-secondary"
                        : ""
                      }
                    `}
                  >
                    {getKegiatanSubTitle()}
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </div>  
        <div className="col-lg-3 d-flex justify-content-end align-items-center">
          { isGuru && getCountData() ? (
            <Link
              href={getLinkDetail()}
            >
              <a className="text-decoration-none">
                <span
                  className={`p-1 d-flex align-items-center justify-content-center rounded-pill fs-12-ss fw-bold ${getCountClasses()}`}
                  style={{ width: "90px", height: "24px" }}
                >
                  {getCountData()}
                </span>
              </a>
            </Link>
          ) : disabled ? (
            <div style={{ background: "#80849C", width: "36px", height: "36px", borderRadius: "50%", textAlign: "center", lineHeight: "36px" }}>
              <img src="/img/icon-lock-white.svg" />
            </div>
          ) : isDone() && (
            <>
              {
                data?.tipe === "tugas"
                  ? data?.nilai != null && (
                    <div className={`text-white rounded-pill d-flex align-items-center justify-content-center ${data?.nilai >= data?.timeline?.tugas?.kkm ? "shadow-primary-ss bg-primary" : "shadow-danger-ss bg-danger"}`} style={{ width: "36px", height: "36px" }}>
                      {data?.nilai}
                    </div>
                  )
                  : (
                    <div className="shadow-success-ss rounded-pill">
                      <img src="/img/icon-check-green.svg" />
                    </div>
                  )
              }
            </>
          )}
          {isGuru && showDropdownAction && (
            <div className="dropdown dropdown-ss mb-md-0 mb-2 d-md-inline d-flex justify-content-end">
              <div
                role="button"
                id="dropdownOption"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/img/option-button-vertical-secondary.svg"
                  alt="option-button"
                  className="ms-4"
                />
              </div>
              <ul
                className="dropdown-menu dropdown-menu-ss my-1"
                aria-labelledby="dropdownOption"
              >
                <li
                  onClick={() => onClickEdit()}
                  data-bs-toggle="modal"
                  data-bs-target={`#${getModalId()}`}
                >
                  <a className="dropdown-item">
                    <FaPen className="me-2" />
                    <span>Edit</span>
                  </a>
                </li>
                {(type == "tugas" || type == "tugas-kuis") && (
                  <li
                    onClick={() => onClickDuplikatTugas()}
                    data-bs-toggle="modal"
                    data-bs-target="#modalBuatTugas"
                  >
                    <a className="dropdown-item">
                      <FaClone className="me-2" />
                      <span>Duplikat</span>
                    </a>
                  </li>
                )}
                <li onClick={() => deleteKegiatan()}
                >
                  <a className="dropdown-item color-danger">
                    <FaTrashAlt className="me-2" />
                    <span>Hapus</span>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KegiatanKelasItem;
