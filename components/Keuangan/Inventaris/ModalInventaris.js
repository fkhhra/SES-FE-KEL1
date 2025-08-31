// import { editTugas, postTugas } from "client/TugasClient";
// import useBuatTugas from "hooks/useBuatTugas";
// import useEditModal from "hooks/useEditModal";
import { deleteBarang, updateBarang } from "client/BarangClient";
import { editMutasiV2, postMutasiV2 } from "client/MutasiClient";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";
import ReactiveButton from "reactive-button";
import swal from "sweetalert";
import { momentPackage } from "utilities/HelperUtils";
import { hideModal } from "utilities/ModalUtils";
// import { momentPackage } from "utilities/HelperUtils";
// import { hideModal } from "utilities/ModalUtils";
import ModalStep from "../../Shared/ModalStep/ModalStep";
// import IsiInformasiSoal from "./IsiInformasiSoal";
// import Lampiran from "./Lampiran";
// import Pembagian from "./Pembagian";
// import Soal from "./Soal";
// import isEmpty from "lodash/isEmpty";
import ContentInventaris from "./ContentInventaris";
import ContentMasukanTransaksi from "./ContentMasukanTransaksi";

const initialFormData = {
  nama: "",
  tanggal: momentPackage(),
  mRencanaTransaksiId: "",
  nomor: "",
  jurnal: [
    {
      jenis: "",
      m_keu_akun_id: "",
      kredit: 0,
      debit: 0,
    },
  ],
};

const ModalInventaris = ({ editData, rencana, akun, getData = () => {} }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [current, setCurrent] = useState(0);
  const [kredit, setKredit] = useState(0);
  const [debit, setDebit] = useState(0);
  const [btn, setBtn] = useState("idle");

  const router = useRouter();

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Verifikasi Barang",
      content: <ContentInventaris formData={formData} />,
    },
    {
      title: "Masukkan ke Transaksi",
      content: (
        <ContentMasukanTransaksi
          editData={editData}
          rencana={rencana}
          akun={akun}
          formData={formData}
          setFormData={setFormData}
          debit={debit}
          setDebit={setDebit}
          kredit={kredit}
          setKredit={setKredit}
        />
      ),
    },
  ];

  const onCloseModal = () => {
    setCurrent(0);
  };

  const handleClickDelete = (deleteId) => {
    swal({
      title: "Yakin ingin dihapus?",
      text: "Perhatikan kembali data yang ingin anda hapus",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await updateBarang(editData?.id, { ...editData, verifikasi: 0 });
        const { data, error } = await deleteBarang(editData?.id);
        if (data) {
          toast.success(data?.message);
          hideModal("ModalInventaris");
          getData();
        } else {
          toast.error(error?.message);
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!formData.nama) {
      toast.error("Harap memasukan nama transaksi");
      return;
    }
    // if (!formData.mRencanaTransaksiId) {
    //   toast.error("Harap Memilih Rencana transaksi");
    //   return;
    // }
    if (!formData.tanggal) {
      toast.error("Harap memasukan tanggal transaksi");
      return;
    }
    if (
      formData?.jurnal.length == 0 ||
      formData?.jurnal?.filter((d) => d.m_keu_akun_id).length == 0
    ) {
      toast.error("Harap memasukan jurnal transaksi");
      return;
    }
    if (!kredit || !debit) {
      toast.error("Kredit dan debit wajib di isi");
      return;
    }
    if (kredit != debit) {
      toast.error("Jumlah kredit dan debit tidak balance");
      return;
    }
    setBtn("loading");
    const payload = {
      ...formData,
      tanggal: momentPackage(formData.tanggal).format("YYYY-MM-DD HH:mm:00"),
      jurnal: formData.jurnal.map((d) => {
        const saldo = d.kredit || d.debit;
        const jenis = d.kredit ? "kredit" : "debit";
        return { ...d, saldo, jenis };
      }),
      mBarangId: editData?.id,
    };

    const { data, error } = await postMutasiV2(payload);

    if (data) {
      setBtn("success");
      toast.success(data.message);
      getData();
      hideModal("ModalInventaris");
      setFormData(initialFormData);
    } else {
      toast.error(error.message);
      setBtn("error");
    }
  };

  useEffect(() => {
    if (editData) {
      setFormData({
        ...formData,
        ...editData,
        nama: `${editData?.nama} - ${editData?.merk}`,
        namaAsli: editData?.nama,
      });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [editData]);

  return (
    <>
      <ModalStep
        onClose={onCloseModal}
        isFullScreen
        modalClass="modal-dialog modal-fullscreen"
        isNext={true}
        modalId="ModalInventaris"
        title={
          <>
            <h4 className="mb-1 fw-extrabold">
              {/* {`${
                isDuplikatTugas ? "Duplikat" : editModalData ? "Ubah" : "Buat"
              } Tugas ${modalTugasType === "kuis" ? "Kuis" : ""}`} */}
              Proses Inventarisasi Aset
            </h4>
            <span className="fs-6 fw-normal">
              {/* {`Isi informasi dibawah untuk ${
                isDuplikatTugas
                  ? "menduplikat"
                  : editModalData
                  ? "mengubah"
                  : "membuat"
              } tugas ${modalTugasType === "kuis" ? "kuis" : ""}`} */}
              Isi informasi dibawah untuk menambahkan Proses Inventarisasi Aset
            </span>
          </>
        }
        current={current}
        next={next}
        prev={prev}
        steps={steps}
        customButton={
          current == 0 ? (
            <div className="d-flex justify-content-sm-end flex-sm-row flex-column">
              <button
                className="btn btn-ss btn-outline-danger btn-outline-danger-ss rounded-pill me-sm-2 mb-sm-0 mb-3 fw-bold"
                onClick={() => handleClickDelete()}
              >
                Tolak Verifikasi
              </button>
              <button className="btn btn-primary" onClick={() => next()}>
                Konfirmasi Verifikasi
              </button>
            </div>
          ) : null
        }
        buttonSubmit={
          <ReactiveButton
            onClick={handleSubmit}
            buttonState={btn}
            color={"primary"}
            idleText="Simpan"
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
  );
};

export default ModalInventaris;
