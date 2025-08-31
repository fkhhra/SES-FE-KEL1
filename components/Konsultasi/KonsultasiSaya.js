import { FaPen, FaTrashAlt } from "react-icons/fa";
import AnimatePage from "../Shared/AnimatePage/AnimatePage";
import ProfileCard from "../Shared/ProfileCard/ProfileCard"
import Navbar from "../Shared/Navbar/Navbar";
import { ssURL } from "../../client/clientAxios";
import { useRouter } from "next/router";
import DetailPengajuanPertemuan from "./DetailPengajuanPertemuan";
import DaftarKonsultasi from "./DaftarKonsultasi";
import useUser from "../../hooks/useUser";

const KonsultasiSaya = () => {

  const { user } = useUser();

  const router = useRouter();
  const { query: { nav, detail } } = router || "";

  const navItems = [
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=pengajuan`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=pengajuan`,
      text: "Pengajuan",
      active: (!nav || nav === "pengajuan"),
      isVisible: user?.role === "siswa"
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=diterima`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=diterima`,
      text: "Diproses",
      active: nav === "diterima",
      isVisible: user?.role === "siswa"
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=ditolak`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=ditolak`,
      text: "Ditolak",
      active: nav === "ditolak",
      isVisible: user?.role === "siswa"
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=hari-ini`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=hari-ini`,
      text: "Hari Ini",
      active: (!nav || nav === "hari-ini"),
      isVisible: user?.role === "guru"
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=akan-datang`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=akan-datang`,
      text: "Akan Datang",
      active: nav === "akan-datang",
      isVisible: user?.role === "guru"
    },
    {
      url: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=selesai`,
      as: `${ssURL}/konsultasi?menu=konsultasi-saya&nav=selesai`,
      text: "Selesai",
      active: nav === "selesai",
      isVisible: (user?.role === "guru" || user?.role === "siswa")
    },
  ].filter(item => item.isVisible);

  return (
    <div className="col-md-12 col-lg-9">
      <AnimatePage>
          
        { !detail && <Navbar nav={navItems} />}

        { !detail
          ? <DaftarKonsultasi />
          : <DetailPengajuanPertemuan />
        }
      </AnimatePage>
    </div>
  )
}

export default KonsultasiSaya;