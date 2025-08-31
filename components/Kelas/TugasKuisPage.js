import useEditModal from "hooks/useEditModal";
import React from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import Tabs from "../Shared/Tabs/Tabs";
import ModalTugas from "./ModalTugas/ModalTugas";
import InstruksiTugas from "./TugasKuis/InstruksiTugas";
import Jawaban from "./TugasKuis/Jawaban";
import ProgressSiswa from "./TugasKuis/ProgressSiswa";
import { postPesertaUjian } from "client/PesertaUjianClient";
import moment from "moment";
import { useRouter } from "next/router";
import { ssURL } from "client/clientAxios";

const TugasKuisPage = ({ detailData, _getDetailTimeline, detailRombel }) => {
  const { user } = useUser();
  const { setEditModal } = useEditModal();
  const router = useRouter();

  const onClickEdit = () => {
    setEditModal("modalBuatTugas", detailData);
    window
      .$(`#instruksi-tugas-editor`)
      .summernote("code", detailData?.tugas?.instruksi); // to set editor value instruksi tugas in ModalTugas.js -> IsiInformasiSoal.js
  };

  const onClickKerjakanTugas = async () => {
    let body = { tkTimelineId: detailData?.id };
    const { data } = await postPesertaUjian(body);
    if (data) {
      localStorage.setItem("redirectUrl", router.asPath);
      router.push(`${ssURL}/mengerjakan-ujian/${data?.pesertaUjian?.id}`);
    }
  };

  const navItemsPertemuan = [
    {
      id: "instruksi-tugas",
      nav: "Instruksi Tugas",
      active: true,
      dataJoyride: "instruksi-tugas",
      isVisible: true,
      content: (
        <InstruksiTugas
          isTugasKuis={true}
          detailData={detailData}
          showLampiranPelajaran={false}
          showPratinjauSoal={user?.role === "guru"}
          showBtnKerjakanTugas={
            user?.role === "siswa"
              ? { onClick: () => onClickKerjakanTugas() }
              : false
          }
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
      content: (
        <ProgressSiswa
          detailData={detailData}
          isTugasKuis
          _getDetailTimeline={_getDetailTimeline}
        />
      ),
    },
    {
      id: "jawaban",
      nav: "Jawaban",
      active: false,
      dataJoyride: "jawaban",
      isVisible: user?.role === "siswa",
      content: <Jawaban detailData={detailData} isTugasKuis />,
    },
  ].filter(({ isVisible }) => isVisible);

  return (
    <div className="card card-ss p-4 pb-5 mb-4">
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
          <li
            data-bs-toggle="modal"
            data-bs-target="#modalBuatTugas"
            onClick={() => onClickEdit()}
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
      <div className="d-flex align-items-center justify-content-md-between mb-4 flex-md-row flex-column">
        <div className="d-flex align-items-center flex-md-row flex-column text-break">
          <img
            src={`/img/icon-kegiatan-tugas.svg`}
            alt="icon-kegiatan-tugas"
            width="86px"
            height="86px"
          />
          <div className="text-md-start text-center ms-md-4 mt-md-0 mt-4">
            <p className="color-secondary mb-2">Kegiatan - 19 Agustus 2021</p>
            <h2 className="color-dark fw-black mb-0">
              {`Tugas Kuis - ${
                detailData?.tugas?.judul || detailData?.timeline?.tugas?.judul
              }`}
            </h2>
          </div>
        </div>
      </div>

      <Tabs navItems={navItemsPertemuan} />

      <ModalTugas
        _getDetailTimeline={_getDetailTimeline}
        modalTugasType="kuis"
        detailRombel={detailRombel}
      />
    </div>
  );
};

export default TugasKuisPage;
