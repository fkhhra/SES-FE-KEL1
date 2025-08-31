import { DatePicker } from "antd";
import { ssURL } from "../../client/clientAxios";
import useUser from "../../hooks/useUser";
import AnimatePage from "../Shared/AnimatePage/AnimatePage";
import ProfileCard from "../Shared/ProfileCard/ProfileCard"
import CardBuatJadwalKonsultasi from "./detail-pengajuan-pertemuan/CardBuatJadwalKonsultasi";
import CardInformasiPengajuan from "./detail-pengajuan-pertemuan/CardInformasiPengajuan";
import CardStatusPengajuan from "./detail-pengajuan-pertemuan/CardStatusPengajuan";
import CardJadwalKonsultasi from "./detail-pengajuan-pertemuan/CardJadwalKonsultasi";
import CardBuatPenolakanKonsultasi from "./detail-pengajuan-pertemuan/CardBuatPenolakanKonsultasi";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getDetailKonsultasi } from "../../client/KonsultasiClient";

const DetailPengajuanPertemuan = () => {

  const [konsultasi, setKonsultasi] = useState({});

  const [statusPengajuan, setStatusPengajuan] = useState("");

  const router = useRouter();
  
  const { query: { menu, id } } = router;

  const { user } = useUser();

  const backUrl = menu.includes("konsultasi-saya") ? `${ssURL}/konsultasi?menu=konsultasi-saya` : `${ssURL}/konsultasi?menu=buku-kunjungan`;

  const _getDetailKonsultasi = async () => {
    const { data } = await getDetailKonsultasi(id)
    data && setKonsultasi(data?.konsultasi);
  }

  const getStatusPengajuan = () => {
    let info = "";
    let text = "";

    switch(konsultasi?.statusSelesai === 0 ? konsultasi?.status : konsultasi?.statusSelesai) {
      case 1:
        info = "success";
        text = konsultasi?.statusSelesai === 1 ? "Selesai" : "Pengajuan Diterima";
        break;
      case 0:
        info = "danger";
        text = "Pengajuan Ditolak"
        break;
      default:
        info = "warning";
        text = "Sedang Diproses";
    }

    return {
      info: info,
      text: text
    }
  }

  useEffect(() => {
    _getDetailKonsultasi();
  }, []);

  return <AnimatePage>
    <ProfileCard
      backUrl={backUrl}
      userName={konsultasi?.user?.nama}
      status={getStatusPengajuan()}
      canUploadPhoto={false}
    />
    
    <CardInformasiPengajuan konsultasi={konsultasi} />

    { user?.role === "guru" && !konsultasi?.jadwal && <CardStatusPengajuan konsultasi={konsultasi} setStatusPengajuan={setStatusPengajuan} />}

    { user?.role === "guru" && !konsultasi?.jadwal && (statusPengajuan === "diterima" || konsultasi?.status === 1) && <CardBuatJadwalKonsultasi konsultasi={konsultasi} _getDetailKonsultasi={_getDetailKonsultasi} />}
    { user?.role === "guru" && (statusPengajuan === "ditolak" || konsultasi?.status === 0) && <CardBuatPenolakanKonsultasi konsultasi={konsultasi} _getDetailKonsultasi={_getDetailKonsultasi} />}

    { konsultasi?.jadwal && konsultasi?.status === 1 && <CardJadwalKonsultasi konsultasi={konsultasi} _getDetailKonsultasi={_getDetailKonsultasi} />}
  </AnimatePage>
}

export default DetailPengajuanPertemuan;