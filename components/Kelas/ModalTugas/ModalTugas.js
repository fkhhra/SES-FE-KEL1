import { editTugas, postTugas } from "client/TugasClient";
import useBuatTugas from "hooks/useBuatTugas";
import useEditModal from "hooks/useEditModal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
import ModalStep from "../../Shared/ModalStep/ModalStep";
import IsiInformasiSoal from "./IsiInformasiSoal";
import Lampiran from "./Lampiran";
import Pembagian from "./Pembagian";
import Soal from "./Soal";
import isEmpty from "lodash/isEmpty";

const ModalTugas = ({ detailRombel, getDetailRombelData, modalTugasType, _getDetailTimeline }) => {
  const [current, setCurrent] = useState(0);

  const {
    stateBuatTugas,
    changeStateBuatTugas,
    resetStateBuatTugas,
    isDuplikatTugas
  } = useBuatTugas();

  const editModalData = useEditModal(state => state.editModal?.modalBuatTugas);
  const isEditTugas = !isEmpty(editModalData);

  const listBab = detailRombel?.analisisMateri?.materi?.bab;

  const materiId = editModalData?.materi?.map(({ id }) => id);

  let selBab = {}
  listBab?.map(bab => {
    bab?.topik?.map(t => {
      if (materiId?.includes(t.id)) {
        selBab = bab;
        return;
      }
    })
  })

  const router = useRouter();

  const next = () => {
    if (current === 0) {
      changeStateBuatTugas("instruksi", window.$(`#instruksi-tugas-editor`).summernote("code")); // set instruksi when user click to next step
    }

    if (current == 0) {
      if (!stateBuatTugas.judul) {
        toast.error("Anda belum memberikan judul tugas");
        return;
      }

      if (!window.$(`#instruksi-tugas-editor`).summernote("code")) {
        toast.error("Anda belum memberikan instruksi tugas");
        return;
      }

      if (!stateBuatTugas.bab) {
        toast.error("Anda belum memilih bab");
        return;
      }

      if (stateBuatTugas.materi.length == 0) {
        toast.error("Anda belum memilih materi");
        return;
      }
    }

    if (modalTugasType == "kuis" && current == 1) {
      if (!stateBuatTugas.soal.length) {
        toast.error("Anda belum membuat soal");
        return;
      }
    }

    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
    if (current === 1) { // to set editor value instuksi tugas
      setTimeout(() => { // need timeout to wait until editor component is rendered on web page
        window.$(`#instruksi-tugas-editor`).summernote("code", stateBuatTugas?.instruksi);
      }, 50);
    }
  };

  const steps = [
    {
      title: "Isi Informasi Soal",
      content: <IsiInformasiSoal detailRombel={detailRombel} />,
      isVisible: true
    },
    {
      title: "Lampiran",
      content: <Lampiran />,
      isVisible: modalTugasType === "tugas"
    },
    {
      title: "Soal",
      content: <Soal />,
      isVisible: modalTugasType === "kuis"
    },
    {
      title: "Pembagian",
      content: <Pembagian detailRombel={detailRombel} />,
      isVisible: true
    },
  ].filter(({ isVisible }) => isVisible);

  const saveTugas = async () => {
    let body = {
      ...stateBuatTugas,
      draft: 0,
      mJadwalMengajarId: router.query.id
    }

    if (stateBuatTugas.dikumpulkan) {
      if (!stateBuatTugas.tanggalPengumpulan) {
        toast.error("Anda belum memberikan tanggal pengumpulan tugas");
        return;
      }

      if (!stateBuatTugas.waktuPengumpulan) {
        toast.error("Anda belum memberikan waktu pengumpulan tugas");
        return;
      }
    }

    if (stateBuatTugas.dijadwalkan) {
      if (!stateBuatTugas.tanggalPembagian) {
        toast.error("Anda belum memberikan tanggal pembagian tugas");
        return;
      }
      
      if (!stateBuatTugas.waktuPembagian) {
        toast.error("Anda belum memberikan waktu pembagian tugas");
        return;
      }
    }

    if (!stateBuatTugas.listRombel.length) {
      toast.error("Anda belum memilih kelas untuk diberikan tugas");
      return;
    }

    if (!stateBuatTugas.listAnggota.length) {
      toast.error("Anda belum memilih siswa untuk diberikan tugas");
      return;
    }

    if (body.tanggalPembagian) {
      body.tanggalPembagian = momentPackage(body.tanggalPembagian).format("YYYY-MM-DD") == "Invalid date" ? null : momentPackage(body.tanggalPembagian).format("YYYY-MM-DD");
    }

    if (body.waktuPembagian) {
      body.waktuPembagian = momentPackage(body.waktuPembagian).format("HH:mm:ss") == "Invalid date" ? null : momentPackage(body.waktuPembagian).format("HH:mm:ss");
    }

    if (body.tanggalPengumpulan) {
      body.tanggalPengumpulan = momentPackage(body.tanggalPengumpulan).format("YYYY-MM-DD") == "Invalid date" ? null : momentPackage(body.tanggalPengumpulan).format("YYYY-MM-DD");
    }

    if (body.waktuPengumpulan) {
      body.waktuPengumpulan = momentPackage(body.waktuPengumpulan).format("HH:mm:ss") == "Invalid date" ? null : momentPackage(body.waktuPengumpulan).format("HH:mm:ss");
    }

    if (body.dikumpulkan == false) {
      delete body.tanggalPengumpulan;
      delete body.waktuPengumpulan;
    }

    if (!body.dijadwalkan) {
      body.tanggalPembagian = momentPackage().format("YYYY-MM-DD");
    }

    // if (isDraft) {
    //   body.draft = 1;
    // }

    if (body.soal?.length > 0) {
      body.soal = body.soal.map(dt => {
        return {
          ...(isEditTugas && typeof dt?.id === "number" && { id: dt?.id, }),
          bentuk: dt?.bentuk,
          nilaiSoal: dt?.nilaiSoal,
          pembahasan: dt?.pembahasan,
          pertanyaan: dt?.pertanyaan,
          rubrikKj: typeof dt?.rubrikKj === "string" ? JSON.parse(dt?.rubrikKj) : dt?.rubrikKj,
          kjPg: dt?.kjPg,
          jawabanA: dt?.jawabanA,
          jawabanB: dt?.jawabanB,
          jawabanC: dt?.jawabanC,
          jawabanD: dt?.jawabanD,
          jawabanE: dt?.jawabanE,
        }
      })
    }


    const { data } = isEditTugas && !isDuplikatTugas ? await editTugas(body, editModalData?.tugas?.id) : await postTugas(body);
    if (data) {
      toast.success(data?.message);
      resetStateBuatTugas();
      hideModal("modalBuatTugas");
      getDetailRombelData && getDetailRombelData();
      _getDetailTimeline && _getDetailTimeline();
      setCurrent(0);
    }
  }

  const getListAnggota = () => {
    let mUserId = [];
    const timeline = editModalData?.tugas?.timeline ? editModalData?.tugas?.timeline : [editModalData]
    timeline?.forEach(tm => {
      tm?.tkTimeline?.forEach(tkTm => {
        mUserId.push(tkTm?.mUserId)
      })
    });

    return mUserId
  }

  const onCloseModal = () => {
    setCurrent(0);
  }

  useEffect(() => {
    if (editModalData) {
      changeStateBuatTugas({
        judul: `${editModalData?.tugas?.judul} ${isDuplikatTugas ? "(Duplikat)" : ""}`,
        dikkm: editModalData?.tugas?.kkm !== null && editModalData?.tugas?.kkm !== undefined,
        showNilai: editModalData?.tugas?.showNilai,
        kkm: editModalData?.tugas?.kkm,
        soal: editModalData?.tugas?.soal?.map(data => data?.soal),
        bab: selBab,
        materi: materiId,
        dikumpulkan: editModalData?.tugas?.tanggalPengumpulan && editModalData?.tugas?.waktuPengumpulan ? true : false,
        dijadwalkan: editModalData?.tugas?.tanggalPembagian && editModalData?.tugas?.waktuPembagian ? true : false,
        tanggalPengumpulan: editModalData?.tugas?.tanggalPengumpulan ? momentPackage(editModalData?.tugas?.tanggalPengumpulan) : null,
        waktuPengumpulan: editModalData?.tugas?.waktuPengumpulan ? momentPackage(editModalData?.tugas?.waktuPengumpulan, "HH:mm") : null,
        listRombel: [editModalData?.mRombelId],
        listAnggota: getListAnggota(),
        tanggalPembagian: editModalData?.tugas?.tanggalPembagian ? momentPackage(editModalData?.tugas?.tanggalPembagian) : null,
        waktuPembagian: editModalData?.tugas?.waktuPembagian ? momentPackage(editModalData?.tugas?.waktuPembagian, "HH:mm") : null,
        lampiran: editModalData?.tugas?.lampiran,
        link: editModalData?.tugas?.link
      });
    } else {
      resetStateBuatTugas();
    }
  }, [editModalData]);

  return (
    <>
      <ModalStep
        onClose={onCloseModal}
        isFullScreen
        modalClass="modal-dialog modal-fullscreen"
        buttonSubmit={
          <ReactiveButton
            onClick={saveTugas}
            color={"primary"}
            idleText={`${isDuplikatTugas ? "Duplikat" : editModalData ? "Ubah" : "Buat"} Tugas`}
            loadingText={"Diproses"}
            successText={"Berhasil"}
            errorText={"Gagal"}
            type={"button"}
            data-bs-dismiss="modal"
            className={"btn btn-primary"}
          />
        }
        isNext={true}
        modalId="modalBuatTugas"
        title={<>
          <h4 className="mb-1 fw-extrabold">
            {`${isDuplikatTugas ? "Duplikat" : editModalData ? "Ubah" : "Buat"} Tugas ${modalTugasType === "kuis" ? "Kuis" : ""}`}
          </h4>
          <span className="fs-6 fw-normal">
            {`Isi informasi dibawah untuk ${isDuplikatTugas ? "menduplikat" : editModalData ? "mengubah" : "membuat"} tugas ${modalTugasType === "kuis" ? "kuis" : ""}`}
          </span>
        </>}
        current={current}
        next={next}
        prev={prev}
        steps={steps}
      />
    </>
  );
};

export default ModalTugas;
